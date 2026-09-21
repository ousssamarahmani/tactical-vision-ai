# TactiLens task backlog

Scope: Fire TV primary track plus AWS Builder mini challenge. Documentation prepared; all implementation tasks are **NOT STARTED**. No task below grants approval to implement, deploy or incur cloud charges. The owner selects the next task and reviews phase gates.

Keep the task IDs in [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md). This file expands their deliverables and links them to [VALIDATION_PLAN.md](VALIDATION_PLAN.md). Assign a named owner when a task starts. Status transitions: NOT STARTED → IN PROGRESS → IN REVIEW → DONE; use BLOCKED with a concrete reason. DONE requires evidence and passed acceptance criteria.

P0 = required for our intended dual-entry demo; P1 = valuable improvement. S/M/L indicate relative complexity, not a delivery promise.

## Core, evidence and TV

| ID | Priority / size | Dependencies | Objective and deliverable | Acceptance / validation | Risk | Status |
| --- | --- | --- | --- | --- | --- | --- |
| TL-01 | P0 / M | Implementation approval | Establish meaningful characterization tests and reproducible test tooling; capture web, SSE and PDF baseline | VAL-01,03; resolve undeclared Playwright config dependency before relying on browser results | Placeholder tests hide regressions | NOT STARTED |
| TL-02 | P0 / M | TL-01 | Shared opponent/match contracts, stable ID mappings and missing-value adapters | VAL-02; one dataset source; preserve legacy aliases | Zero sentinel and home/away errors | NOT STARTED |
| TL-03 | P0 / M | TL-01,02 | Extract pure context/retrieval helpers behind existing routes and HTTP/SSE contract | VAL-01,03 remain passing before caller migration | Breaking existing analyst | NOT STARTED |
| TL-04 | P0 / M | TL-02 | Versioned observation, event, occurrence, clip, finding and briefing schemas; validator and labeled synthetic fixtures | VAL-04 rejects invalid references/status transitions | Schema mistaken for implemented evidence | NOT STARTED |
| TL-05 | P0 / M | TL-02; target access | TV packaging/input/playback spike and framework ADR | VAL-10,11 spike evidence on actual target; record supported framework/runtime | Desktop success mistaken for TV support | NOT STARTED |
| TL-06 | P0 / L | TL-04; footage rights; compute | Benchmark isolated offline detection/tracking/calibration; dataset manifest and evaluation report | VAL-05; disjoint matches and predeclared quality thresholds | Ball loss, replay contamination and licensing | NOT STARTED |
| TL-07 | P0 / L | TL-04,06 | Deterministic events/patterns, timestamp-mapped clips, provenance, validation and abstention | VAL-06; human-reviewed occurrences; no model-owned frequency/confidence | False tactical claims | NOT STARTED |
| TL-08 | P0 / M | TL-03,04,07 | Versioned persisted briefing API with scoped media access and freshness states | VAL-09; preserve existing endpoint and data ownership | Duplicate persistence and access leakage | NOT STARTED |
| TL-09 | P0 / L | TL-05,08 | TV opponent selection, overview, finding detail and briefing mode; complete focus graph | VAL-10; keyboard-free journey with initial/restored focus | Focus traps and dense layouts | NOT STARTED |
| TL-10 | P0 / M | TL-07,09 | Evidence player and coordinate-tested TV pitch rendering | VAL-11; seek/BACK/error recovery; evidence is directly retrieved without requiring an agent call | Codec and timebase mismatch | NOT STARTED |
| TL-11 | P0 / L | TL-08; TL-11A..E | Deliver Bedrock/AgentCore workflow and integration documentation | VAL-07..09; all required subtasks complete; optional TL-11F excluded | Cloud complexity without user value | NOT STARTED |
| TL-12 | P0 / M | TL-09,10,11 | Harden stored briefing fallback, performance and repeatable target demo | VAL-12; measured budgets and outage rehearsal | Demo depends on live inference | NOT STARTED |

## AWS and agent workflow — TL-11 breakdown

These tasks implement a proposed workflow within TactiLens, reusing the Opposition Analyst. Bedrock supplies reasoning; AgentCore hosts the agent application. Neither replaces deterministic evidence validation. Heavy CV processing stays outside the interactive agent request.

| ID | Priority / size | Dependencies | Objective and deliverable | Acceptance / validation | Risk | Status |
| --- | --- | --- | --- | --- | --- | --- |
| TL-11A | P0 / M | TL-03,04 | Define orchestrator tool contracts: retrieve opponent context, query validated occurrences, load finding details and assemble briefing; local mock harness | Scoped inputs, allowed evidence IDs, explicit tool errors, bounded calls; VAL-07 fixtures prepared | Agent trusts injected source instructions | NOT STARTED |
| TL-11B | P0 / M | TL-11A,07; AWS model access/budget | Bedrock adapter and evidence-grounded game-plan synthesis; versioned prompts and evaluation report | VAL-07 passes; recommendations labeled; invalid tool references rejected; no evidence fields invented | Hallucination and repeated calls | NOT STARTED |
| TL-11C | P0 / M | TL-11B; region/runtime ADR | Deploy agent application to AgentCore Runtime with scoped identity and trace correlation | VAL-08; actual invocation, authorization denial, timeout and session-isolation evidence | Credential exposure or session leakage | NOT STARTED |
| TL-11D | P0 / M | TL-08; storage ADR | Protected evidence storage/access integration; document S3 role if selected; retain existing knowledge store | VAL-09; no public private-footage bucket; expiry/renewal and team ownership tests | Unnecessary database migration | NOT STARTED |
| TL-11E | P0 / M | TL-11B,C,D,09 | Connect remote-friendly explain/adapt actions to bounded workflow; persist prioritized briefings and document services used | Stored briefing opens without cloud generation; “show evidence” uses direct API; VAL-07,12 and sanitized end-to-end trace | All actions unnecessarily route through LLM | NOT STARTED |
| TL-11F | P1 / M | TL-11B evaluation | Evaluate Build-Up/Pressing/Transition specialists against one orchestrator; ADR for retaining or rejecting specialization | Measured recommendation quality, grounding, latency and cost comparison; add agents only with demonstrated benefit | More agents amplify cost and unsupported agreement | NOT STARTED |

AgentCore Gateway, Memory and other services are optional architecture decisions, not mandatory additions. Framework selection (including Strands) must be justified by the workflow. Bedrock/AgentCore use is our project direction, not a claim that both are required for mini-challenge eligibility.

## Quality and submission tasks

| ID | Priority / size | Dependencies | Objective and deliverable | Acceptance / validation | Risk | Status |
| --- | --- | --- | --- | --- | --- | --- |
| TL-QA-01 | P0 / M | TL-01 | Record and triage lint, dependency and browser-tooling baseline; track fixes separately | Every inherited failure has disposition; new changes add no unacknowledged regression | Blind dependency upgrades | NOT STARTED |
| TL-QA-02 | P0 / M | TL-04,06,11A | Versioned adversarial evidence/agent cases, quality budgets and evaluation runner | VAL-04..07 reproducible; hold-out separation and repeated agent runs documented | Test leakage or hand-picked examples | NOT STARTED |
| TL-HACK-01 | P0 / S | Owner licensing decision; data inventory | Resolve repository license/access path and footage/data permissions; document clean setup | VAL-13; no license chosen without owner decision; judge can access required materials | Public code without suitable license or footage rights | NOT STARTED |
| TL-HACK-02 | P0 / M | TL-12, TL-HACK-01 | Record under-three-minute target demo, project description and actual AWS integration evidence | VAL-13; actual Fire TV/device simulator shown, no laptop-only substitute; source revision identified | Unsupported feature claims | NOT STARTED |
| TL-HACK-03 | P0 / S | Real tool use; TL-HACK-02 for final review | Actual product feedback, friction observations and pre-existing/new change record | Identify tools/purpose, onboarding, strengths, problems and reuse decision; current official-rule review | Fabricated feedback or omitted baseline | NOT STARTED |

Keep feedback and change records during implementation rather than reconstructing them at the end. Submission itself remains a separate owner-authorized action.

## Next action

After explicit implementation approval, start TL-01. Agree the available Fire TV target early so TL-05 can expose platform risk before the full TV build. Review TL-06 feasibility early; any reduction in the CV scope must be explicit and must preserve honest evidence labeling.

## Task completion record

```text
Task ID / owner / status:
Start and finish dates:
Commit / PR:
Deliverables:
Validation IDs and result artifacts:
Acceptance criteria met / unmet:
Open risks and follow-up:
Reviewer / approval:
```
