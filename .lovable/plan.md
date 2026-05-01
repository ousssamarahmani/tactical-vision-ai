## Root cause

The "Failed to fetch documents" error on `/knowledge` and the "RAG pipeline not used in my analysis" symptom share the same cause right now:

**Your Lovable Cloud database is not accepting connections.**
Direct SQL probes return:
```
FATAL: 57P03: the database system is not accepting connections
DETAIL: Hot standby mode is disabled.
```
While the DB is in this state:
- `listDocuments()` (PostgREST query) fails → empty Knowledge Base UI
- `ingest-pdf` / `ingest-youtube` / `fetch-football-content` cannot insert rows
- `analyze-opposition` calls `search_knowledge` RPC inside a try/catch that *swallows* the error, so the analyst silently runs with **no** RAG context — exactly what you observed in your Real Madrid analysis (no "Knowledge Base" excerpts cited).

On top of that, two real code bugs would still bite you once the DB recovers:

1. **`ingest-pdf` crashes on the fallback path.** It calls `supabase.storage.from('rag-documents').upload(...)`, but no migration ever creates a `rag-documents` storage bucket. Any scanned/image PDF takes this branch and 500s.
2. **The RAG context is invisible to the user.** Even when retrieval works, `analyze-opposition` injects chunks silently and never tells the UI "I used N knowledge sources", so you can't tell whether RAG fired.

## Plan

### 1. Wait for Cloud to come back up, then verify
- Re-run a `SELECT count(*) FROM rag_documents` once the DB is `ACTIVE_HEALTHY`.
- Confirm `search_knowledge` function and `rag_chunks` rows exist.

### 2. Fix `ingest-pdf` storage crash
- Remove the broken `supabase.storage.from('rag-documents').upload(...)` call. We don't need to persist the raw PDF — we only need its text.
- Keep the AI fallback that asks Gemini to extract text from the raw bytes string, but skip the storage step entirely.
- Return a clean 400 ("Could not extract text — please use a text-based PDF") if both regex extraction and AI extraction fail.

### 3. Make `analyze-opposition` RAG usage observable & robust
- Stream a small SSE preamble line listing the RAG sources used, e.g.
  ```
  data: {"rag_sources":[{"title":"...","source_type":"article"}, ...]}
  ```
  before the model tokens start. Frontend can ignore it today; we'll surface it in step 4.
- Broaden the search query: also try the user's raw question without the team name when the team-filtered + global search both return < 3 hits.
- Lower the team filter to a `team_tags @> ARRAY[...]` check that's case-insensitive, since auto-fetched articles tag teams like `bayern munich` while `teamData.name` is `FC Bayern München`. Normalize both sides (lowercase, strip "fc"/"münchen"→"munich") before filtering.
- If the RPC errors (not just returns empty), log the error message into the response so we can see it in edge logs instead of silently continuing.

### 4. Show RAG usage in the chat UI
- In `src/lib/stream-chat.ts`, parse the new `rag_sources` SSE event and forward it via a new `onRagSources` callback.
- In `useOppositionAnalyst`, store `ragSources` and expose it.
- In `Index.tsx` (or wherever the assistant message renders), show a small "Sources used: 3 from knowledge base" chip above the answer with a tooltip listing titles. This makes it obvious whether RAG fired.

### 5. Fix the Knowledge Base "Failed to fetch" UX
- In `KnowledgeBase.tsx`, surface the actual error to the user via a `toast.error(...)` + an inline retry banner instead of just `console.error`. So when the DB is briefly down, the user sees "Backend temporarily unavailable — retry" rather than a permanently spinning loader.

### 6. Sanity-test end to end
After deploy:
- Click **Auto-Fetch Football Content** → expect rows in `rag_documents` with `source_type='article'` and `status='ready'`.
- Run a Real Madrid analysis → expect to see the new "Sources used" chip with at least one article cited, and the analyst body referencing the new article context.

## Technical details

**Files to edit**
- `supabase/functions/ingest-pdf/index.ts` — drop storage bucket call, simplify fallback.
- `supabase/functions/analyze-opposition/index.ts` — emit `rag_sources` SSE event, normalize team filter, surface RPC errors in logs.
- `src/lib/stream-chat.ts` — handle `rag_sources` event, add `onRagSources` callback.
- `src/hooks/useOppositionAnalyst.ts` — store `ragSources` per assistant message.
- `src/pages/Index.tsx` (or analysis renderer) — render "Sources used" chip.
- `src/pages/KnowledgeBase.tsx` — toast + retry on `listDocuments()` failure.

**Files NOT touched**
- DB schema / migrations — current schema is fine; the issue is the DB being temporarily offline plus a missing bucket reference, which we remove rather than create.
- `ingest-youtube` — already has 3-method fallback chain; leaving as is.

**What to expect after the fix**
- Even if the DB hiccups again, the Knowledge Base page tells you so instead of looking empty.
- PDFs with weird encodings no longer 500 the function.
- You'll *see* in chat whether the analyst used RAG, with which sources, every time.
