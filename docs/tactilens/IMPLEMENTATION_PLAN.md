# TactiLens implementation plan

Foundation deliverable: documentation only. Every implementation task below is **NOT STARTED**. Completing these documents does not authorize Phase 1. Read the [audit](FOUNDATION_AUDIT.md) and [architecture](ARCHITECTURE.md) first.

## Protected behavior

Keep `/`, `/knowledge`, opponent selection, club/international context, analyst streaming/source badges, ingestion, dashboard and both report export paths working. Preserve source datasets and legacy identifiers; do not duplicate the app for television. Never promote existing keyword heatmaps, radar scores or generated prose to verified footage evidence.

## Sequenced gates

| ID / phase | Objective and deliverable | Dependencies | Acceptance gate | Priority / complexity | Main risk | Status |
| --- | --- | --- | --- | --- | --- | --- |
| TL-01 / 1 | Characterization fixtures/tests for existing analyst and adapters | Foundation approval | Recorded club/national outputs; SSE source/text/error fixtures; reset/concurrency behavior documented; PDF smoke checks; no live provider calls needed | P0 / M | Placeholder test gives false confidence | NOT STARTED |
| TL-02 / 1 | Shared identity, opponent/match and missing-value contracts | TL-01 | Stable ID/alias mappings, nullable metrics and home/away cases; both original data shapes adapt without copied datasets | P0 / M | Zero sentinel or unstable IDs change meaning | NOT STARTED |
| TL-03 / 2 | Small extraction of pure context/retrieval/transport boundaries | TL-01, TL-02 | Existing HTTP/SSE contract and web regression fixtures remain unchanged; no browser dependency in shared core | P0 / M | Provider and UI state are tightly coupled | NOT STARTED |
| TL-04 / 2 | Versioned evidence and briefing schemas with validators | TL-02 | Reject broken references, invalid intervals and false VERIFIED states; preserve unknowns; synthetic fixtures visibly labeled | P0 / M | Schema implies evidence that does not exist | NOT STARTED |
| TL-05 / 3 | TV platform spike and ADR | TL-02; access to actual target/simulator | Package launches, remote SELECT/BACK/focus and seek work, ten-foot text readable; record platform/runtime/device | P0 / M | DOM components unavailable on chosen runtime | NOT STARTED |
| TL-06 / 3 | Offline CV benchmark with rights-cleared footage | TL-04; footage rights and compute | Detection precision/recall, tracking HOTA/IDF1, calibration error and processing time recorded on held-out matches; model license reviewed | P0 / L | Ball loss, cuts and calibration instability | NOT STARTED |
| TL-07 / 4 | Events, occurrences, clips and validation/abstention | TL-04, TL-06 | Timestamp/frame round trips; duplicate/replay exclusion; coach-reviewed supporting clips; false findings/coverage/abstention measured | P0 / L | Candidate patterns overstate causality | NOT STARTED |
| TL-08 / 4 | Persisted briefing read API using shared services | TL-03, TL-04, TL-07 | Versioned payloads, authorization, stale/missing states; web endpoint remains compatible | P0 / M | Second source of domain truth | NOT STARTED |
| TL-09 / 5 | TV shell, overview, detail and briefing mode | TL-05, TL-08 | Complete primary journey by remote only; stable initial/restored focus; no copied datasets or analyst logic | P0 / L | Focus traps and excessive density | NOT STARTED |
| TL-10 / 5 | Evidence player and adapted pitch presentation | TL-07, TL-09 | SELECT/pause/seek/BACK; clip bounds correct; expired/missing media recoverable; geometry fixtures align | P0 / M | Codec, clock and coordinate differences | NOT STARTED |
| TL-11 / 6 | Documented AWS integration | TL-08; service/region/budget ADR | Working integration demonstrated; server secrets isolated; fallback available; Bedrock cannot modify evidence fields | P1 / M | Cloud latency/cost or invented evidence | NOT STARTED |
| TL-12 / 7 | Demo hardening and submission evidence | TL-09, TL-10; TL-11 if AWS claimed | Cold-start and network-loss rehearsal on target, measured load/playback timings, footage rights, change log and real product feedback | P0 / M | Demo success depends on live analysis | NOT STARTED |

Complexity: M = focused multi-file work; L = subsystem work with experimentation. These are relative estimates, not delivery promises. The owner reviews each phase's evidence before progression. Phase 0 is this audit/plan/architecture/change-log deliverable only.

## Recommended first implementation task

TL-01: capture current behavior before extracting anything. Assert actual opponent selection/context, international home/away and missing metrics, chunk-split SSE/source events, provider errors and report exports. The existing `expect(true).toBe(true)` test cannot protect an extraction. Resolve the undeclared Playwright config dependency as an explicit test-tooling change before relying on browser checks.

## Regression and rollout strategy

Use small additive changes: introduce contracts/adapters, keep old entry points, prove parity, then opt the web caller into shared helpers. Introduce TV behind its own entry point only after the platform ADR. Keep fixtures free of production secrets and avoid replaying ingestion/migration side effects against a live database. Additive database changes require a local reset/migration check and a rollback plan; never overwrite existing documents or datasets to make a demo work.

Validation layers: pure contract/adapter tests; endpoint/SSE compatibility tests; browser checks of existing workflows; evidence consistency tests; held-out match evaluation; target-device remote/playback tests; a disconnected/precomputed demo rehearsal. Record dataset versions, hardware, algorithm versions and measured timings. Choose latency/quality budgets during spikes, then fail gates against those budgets.

## Risks and unresolved prerequisites

- Data provenance/rights and stable team/match identity must be established before verified claims.
- Existing permissive knowledge reads and client context require an access-control review before private coaching footage is introduced.
- Current lint baseline is 25 errors/7 warnings; dependency audit previously reported 22 vulnerabilities. Track remediation separately rather than hiding it inside extraction.
- The actual Fire TV/Vega target and packaging route are unproven; do not commit to sharing DOM components across native runtimes.
- No validated CV dataset, measured confidence policy or media authorization mechanism exists yet.
- A license decision and a functioning target demo remain submission prerequisites; foundation documentation alone is not a completed hackathon entry.

## Foundation completion and stop condition

The four documents must link to inspected code, identify missing components honestly, assign reuse boundaries and preserve the original app. Record this documentation change in [HACKATHON_CHANGES.md](HACKATHON_CHANGES.md). Stop after the foundation; obtain explicit implementation approval before TL-01 or code extraction.
