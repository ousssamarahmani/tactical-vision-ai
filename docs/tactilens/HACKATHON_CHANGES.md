# Hackathon change record

Keep pre-existing TactiVision work separate from work performed during the hackathon. Source presence is not a claim of deployed functionality or independently verified football data.

## Pre-existing baseline

Commit `81c6374a7320283b5b02de24e18cdfa2d0141727` (2026-07-06): React/Vite web app, Opposition Analyst hook and Supabase endpoint, bundled club/international datasets, dashboard/keyword visualizations, knowledge ingestion/full-text retrieval, PDF exports and test configuration. See [source audit](FOUNDATION_AUDIT.md) for capability limits.

## Actual foundation changes

| Date | Evidence | Change | Validation / limitation |
| --- | --- | --- | --- |
| 2026-09-22 (Europe/Budapest) | `d6f2a05`, [PR #1](https://github.com/ousssamarahmani/TactiLens/pull/1) | TactiLens logo/README/page metadata, npm package name, environment example and synchronized lockfile | Build and one placeholder test passed; lint had 25 errors/7 warnings. This was branding/setup, not a TV or CV implementation. |
| 2026-09-22 | GitHub repository metadata, outside Git history | Renamed repository to TactiLens; updated description/topics | Previously verified through GitHub API; no product capability added. |
| 2026-09-22 | Four documents in this directory; commit containing this entry | Source-backed reuse audit, architecture, gated implementation plan and this change record | Documentation/link/whitespace checks; no runtime files changed in this increment. |

The foundation PR records proposed changes; this log does not imply it has been merged. Dates use local time; the first branding commit is 2026-09-21 in UTC.

## Implementation status

Planning follow-up, 2026-09-22: added `VALIDATION_PLAN.md` and `TASKS.md`, with traceable acceptance checks, proposed performance budgets, Bedrock/AgentCore subtasks, and Fire TV plus AWS Builder submission evidence. Updated roadmap links and planning scope. Documentation only; validation execution and all implementation tasks remain NOT STARTED.

Presentation follow-up, 2026-09-22: replaced the original orange artwork with the owner's green logo, simplified the repository landing page, added contribution guidance and a PR template, and corrected the setup prerequisite to Node.js 22+. This is documentation/branding work; no product capability added.

Shared-core extraction, new Opposition API, CV, evidence validation/player, Fire TV shell, remote navigation, briefing mode, Vega validation and AWS integration: **NOT STARTED**.

## Future entry template

Copy only when work actually occurs; never manufacture feedback or demo evidence.

```text
Date/time and timezone:
Task ID and author:
Baseline -> resulting commit / PR:
What changed and why:
Pre-existing modules reused:
New capability delivered (or documentation only):
Setup/run changes:
Tests, target device/runtime and observed results:
Evidence links (clips/screenshots/logs):
Limitations, failures and remaining work:
Tools/APIs/SDKs actually used and purpose:
Onboarding experience; what worked; what needs work:
Would use again and why:
Optional friction: task, steps, expected/actual, severity, workaround, suggestion:
```
