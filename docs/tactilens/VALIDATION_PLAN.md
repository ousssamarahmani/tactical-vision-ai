# TactiLens validation plan

Status: PLANNED. Execution NOT STARTED. Scope: preserve the existing Opposition Analyst, validate the proposed agentic workflow, and demonstrate the Fire TV primary track plus AWS Builder mini challenge. This document does not authorize implementation or deployment.

Use with the [task backlog](TASKS.md), [implementation phases](IMPLEMENTATION_PLAN.md) and [architecture](ARCHITECTURE.md).

## Known baseline

The earlier foundation build passed and Vitest ran one placeholder assertion. Lint reported 25 existing errors and 7 warnings; npm reported 22 vulnerabilities. These are historical observations, not current release certification. Hosted backend behavior, footage accuracy, agent execution and Fire TV compatibility have not been validated. Re-run and record the baseline before implementation; never count the placeholder test as feature coverage.

## Environments and evidence

| Environment | Purpose | Isolation |
| --- | --- | --- |
| Local web and mocked provider | Domain adapters, existing UI, SSE and exports | Synthetic fixtures; no production writes or paid model calls |
| Disposable Supabase test project | Migrations, storage and endpoint compatibility | Test data and credentials only; explicit teardown inventory |
| Offline CV evaluation | Measure observations and evidence correctness | Rights-cleared footage, versioned annotations; splits separated by match |
| AWS development environment | Bedrock/AgentCore integration and failure tests | Owner-approved region/budget; limited roles; sanitized traces |
| Actual Fire TV device or Fire TV/Vega simulator | Packaging, remote navigation, media and demonstration | Record exact device/simulator, OS/runtime and build revision |

Each result records task/test ID, commit, command or reproducible steps, fixture/data revision, environment, expected and actual behavior, PASS/FAIL/BLOCKED, reviewer and evidence path. BLOCKED is not PASS. Store reports under a future `docs/tactilens/validation/` directory; do not create fabricated results now. Remove tokens, signed URLs and private footage from public logs.

## Validation matrix

All rows are NOT RUN. Gates are future acceptance criteria, not claims of achieved results.

| ID | Scope / linked tasks | Method and adversarial cases | Acceptance gate |
| --- | --- | --- | --- |
| VAL-01 | Web preservation / TL-01, TL-03 | Browser checks for `/`, `/knowledge`, club/national selection, report tabs and PDF exports; compare pre-extraction fixtures | Existing journeys still work; no duplicated dataset; PDF outputs open and contain expected sections |
| VAL-02 | Identity and metrics / TL-02 | Reorder match fixtures; test aliases, missing metrics, home/away perspective, absent squad numbers and unknown results | IDs stable across reorder; unknown remains unknown; no index-derived jersey number claimed as factual; explicit legacy mappings |
| VAL-03 | Analyst transport / TL-01, TL-03 | Split SSE across chunks; source/progress/text events; malformed/truncated frames; 402/429/500; reset and overlapping requests | Existing event framing preserved; bounded recovery/error states; stale responses cannot overwrite new selection; no false completion on failed generation |
| VAL-04 | Contracts / TL-04 | Schema-version mismatch, broken references, duplicate occurrences, negative/out-of-range clip bounds, invalid status transitions | Invalid payloads rejected deterministically; documentary citations cannot promote a video finding to VERIFIED |
| VAL-05 | CV / TL-06 | Annotated held-out matches; occlusion, ball loss, kit similarity, camera motion, cuts/replays | Report detection precision/recall, tracking HOTA/IDF1, calibration error, runtime and failure cases; meet predeclared benchmark thresholds |
| VAL-06 | Evidence / TL-07 | Original-to-normalized timestamp mapping, variable frame rate, duplicated replays, absent media, conflicting events and poor calibration | Every demo VERIFIED finding has reviewable support; no unresolved invalid evidence references; invalid evidence abstains or revokes dependent findings |
| VAL-07 | Agent reasoning / TL-11A, TL-11B | Tool-call traces for relevant/irrelevant opponent, insufficient evidence, contradictory sources, malicious source instructions and tool timeout | Appropriate scoped tool calls; claims cite allowed evidence IDs; count/timing/confidence fields remain tool-owned; recommendations distinct from observations |
| VAL-08 | AgentCore / TL-11C | Invoke deployed workflow; test session isolation, unauthorized caller, timeout/retry and trace correlation | Real runtime invocation evidenced; denied access is denied; no cross-team/session leakage; bounded retries and clear failure response |
| VAL-09 | API/media security / TL-08, TL-11D | Cross-team IDs, expired clip access, unauthenticated requests, stale briefing versions and client-supplied context | Enforced server-side authorization; no service credentials in client; expired media recovers; missing/stale state explicit |
| VAL-10 | TV navigation / TL-05, TL-09 | Install/launch; D-pad in all directions; SELECT/BACK; dialog open/close; return from player; rapid input; empty/loading/error screens | Complete main journey without mouse or keyboard; visible default focus, no traps, correct BACK hierarchy and focus restoration |
| VAL-11 | TV playback/readability / TL-10 | Supported codec on target; start/pause/seek/end; expired URL; playback failure; known pitch points; viewing-distance review | Correct clip and bounds; usable recovery; no clipping/unreadable primary content; pitch coordinates align with labeled fixtures |
| VAL-12 | Reliability/performance / TL-12 | Cold/warm start, slow network, offline cached briefing, Bedrock outage, missing clip, repeated session | Budgets below met; stored briefing remains usable where cached; unavailable assets identified; no fabricated fallback analysis |
| VAL-13 | Submission / TL-HACK-01..03 | Checklist review against official rules; reproduce setup from clean checkout; watch final recording | Actual target demo and documented AWS use; accurate change record, required feedback, repository access/license decision, no planned feature claimed complete |

## Quality and performance budgets

The following are proposed engineering targets, not hackathon rules or measurements. Approve or revise them during spikes before collecting release results; record every revision and reason.

- TV visible focus response: p95 at most 100 ms over at least 100 directional/SELECT inputs on the chosen target.
- Cached briefing opening: p95 at most 2 seconds over 20 runs; record cold launch separately.
- Evidence playback start: p95 at most 3 seconds over 20 runs on a documented stable connection. Slow-network behavior is evaluated separately.
- Interactive agent request: explicit loading state immediately, bounded deadline of 30 seconds, then a recoverable response; no unlimited retries. Precomputed briefings must not depend on that request completing.
- Demo evidence: 100% of presented VERIFIED findings resolve to reviewed supporting occurrences. Measure false finding rate, evidence coverage and abstention rate together; high abstention alone does not prove quality.
- CV numerical thresholds must be fixed after a pilot on validation footage, before the held-out test. Record annotation quality and split sizes. Until thresholds and an independent test split exist, VAL-05 is BLOCKED, not passed.
- Agent evaluation: use a versioned set covering normal, insufficient, conflicting, malicious-input and failed-tool cases, with at least five cases per category and three runs per case. No unsupported VERIFIED promotion, unauthorized tool access or fabricated evidence fields may occur in this suite. Report tool success, evidence-reference accuracy, recommendation usefulness, latency and cost; a clean suite is not a universal accuracy guarantee.

## Release gates

1. **Preservation gate:** VAL-01..03 pass before callers move to extracted shared services.
2. **Evidence gate:** VAL-04..06 pass before any TV finding is labeled VERIFIED. Human review and deterministic checks own promotion; model agreement is insufficient.
3. **Agent gate:** VAL-07..09 pass before enabling the cloud workflow with private data. Specialized agents are optional until they improve evaluated outcomes.
4. **Device gate:** VAL-10..12 pass on the selected target before a demo-ready claim. Desktop-browser behavior does not establish Fire TV compatibility.
5. **Submission gate:** VAL-13 passes before submission. Open failures have an owner and resolution; critical authorization/evidence failures block release. Existing lint/dependency issues need explicit disposition and no silent regression.

## Fire TV and AWS Builder evidence

The [official rules](https://amazonappdev2026.devpost.com/rules) allow any Fire TV framework but require the demonstration on an actual Fire TV device or Fire TV/Vega simulator. AWS Builder requires documented qualifying use; Kiro Crew has a development-tool-only eligibility path. Our selected project direction is Bedrock reasoning plus AgentCore hosting, so record actual invocations and their product purpose, not just dependency names or badges.

Capture the device/runtime identity, build revision and working remote journey in the demo materials. Keep the public demo below three minutes, link source/setup, describe significant changes from the pre-existing app, and write product feedback from real usage. Document which AWS service did what and include sanitized request/trace evidence. Recheck the current rules before submission; this plan is not an eligibility guarantee.

## Result template

```text
Validation ID / task:
Commit and date:
Runner / reviewer:
Environment, device/OS/runtime:
Fixtures, footage rights and dataset revision:
Commands or steps:
Expected / actual:
Metrics, sample size, budgets and observed cost:
PASS / FAIL / BLOCKED:
Evidence paths:
Open defects and disposition:
```
