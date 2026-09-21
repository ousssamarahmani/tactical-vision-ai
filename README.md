<div align="center">
  <img src="./docs/assets/tactilens-logo.png" alt="TactiLens" width="440" />

  # Fire TV opposition intelligence, powered by TactiVision AI

  TactiLens brings evidence-led football preparation to the coaching room: verified
  tactical findings, match context, and video evidence designed for a focused
  ten-foot viewing experience.

  [![Hackathon](https://img.shields.io/badge/Build%2C%20Ship%2C%20Shape-Amazon%20Developer%20Hackathon%202026-FF9900?style=flat-square)](https://amazonappdev2026.devpost.com/)
  [![Primary track](https://img.shields.io/badge/primary%20track-Fire%20TV-FF9900?style=flat-square)](https://amazonappdev2026.devpost.com/)
  [![AWS Builder](https://img.shields.io/badge/AWS%20Builder-planned-232F3E?style=flat-square)](#hackathon-scope)
  [![Status](https://img.shields.io/badge/status-foundation%20%2F%20architecture-8B949E?style=flat-square)](#project-status)
  [![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=111111)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

  [Product vision](#what-is-tactilens) · [What exists](#what-works-today) · [Hackathon scope](#hackathon-scope) · [Run locally](#run-locally) · [Architecture](#architecture-direction)
</div>

---

> [!IMPORTANT]
> TactiLens is currently in its foundation and architecture phase. The repository
> contains a pre-existing TactiVision Opposition Analyst web application. The Fire
> TV/Vega client, computer-vision evidence pipeline, and AWS integration described
> below are planned hackathon work and are not yet implemented.

## What is TactiLens?

**TactiLens** is the Fire TV coaching-room experience for **TactiVision AI**. It is
designed to turn validated match evidence into opposition intelligence that a
coaching team can explore together with a remote control, from the tactical overview
down to the exact match occurrence that supports a finding.

The product direction is built around one rule: a tactical claim should not be
presented as verified unless it is backed by traceable evidence. Computer vision
will describe what the video contains, deterministic analysis will derive football
events and geometry, and language models may explain verified findings. They will
not invent timestamps, occurrence counts, detections, or confidence.

| Evidence first | Built for the room | Demo resilient |
| --- | --- | --- |
| Findings trace back to clips, events, tracks, detections, and source video. | A ten-foot interface will use clear focus states, D-pad navigation, and readable tactical visuals. | Precomputed analysis keeps the Fire TV experience fast and reliable during a live demonstration. |

## Project status

| Area | Status |
| --- | --- |
| Existing TactiVision web application | Available before the hackathon |
| Opposition Analyst and tactical dashboard | Available before the hackathon |
| RAG knowledge base and report generation | Available before the hackathon |
| TactiLens foundation and architecture | In progress |
| Fire TV / Vega application | Not started |
| Computer-vision evidence pipeline | Not started |
| AWS runtime integration | Not started |

This status boundary is intentional. It preserves a clear record of the existing
project and the work completed during the hackathon submission period.

## What works today

The current repository already provides the following TactiVision capabilities:

| Capability | Current implementation |
| --- | --- |
| Opposition analysis | Streaming analyst workflow backed by a Supabase Edge Function |
| Tactical interface | React dashboard with opponent selection, strengths, weaknesses, form, match metrics, and tactical phases |
| Football data | Club, international-team, match, squad, and FIFA World Cup 2026 datasets |
| Knowledge retrieval | Supabase/pgvector search with PDF, YouTube, FIFA report, and football-content ingestion functions |
| Visual analysis | Pitch heatmaps, tactical radar, KPI cards, form strips, and match-stat charts |
| Reports | Downloadable opposition-analysis and FIFA-style PDF reports |
| Quality tooling | ESLint, Vitest, Testing Library, and Playwright configuration |

These capabilities are pre-existing TactiVision work. They are not presented as
features created during the 2026 hackathon.

## Hackathon scope

TactiLens is being prepared for **Build, Ship, Shape: Amazon Developer Hackathon
2026**.

- **Primary track:** Fire TV
- **Priority categories:** sports, AI-enhanced viewing, and computer vision
- **Target platforms:** Fire OS or Vega OS
- **Mini challenge:** AWS Builder, planned pending a documented runtime integration
- **Submission deadline:** October 23, 2026 at 12:00 PM Pacific Time

The planned submission must include a demo-ready application running on Fire OS or
Vega OS, a public demonstration video under three minutes showing the target device
or simulator, complete setup and run instructions, source code and assets, product
feedback, and a clear record of significant changes made during the submission
window. AWS Builder eligibility will only be claimed after the repository contains
and documents a working AWS integration.

The authoritative requirements are the [official hackathon rules](https://amazonappdev2026.devpost.com/rules)
and [resource hub](https://amazonappdev2026.devpost.com/resources).

## Product direction

```text
Match video
    │
    ▼
Offline computer vision
    │  detections, tracks, pitch coordinates
    ▼
Deterministic football events and spatial features
    │
    ▼
Candidate tactical patterns
    │
    ▼
Evidence validation ── insufficient evidence → abstain
    │
    ▼
Verified findings and evidence clips
    │
    ▼
Opposition Analyst explanation
    │
    ▼
TactiLens on Fire TV / Vega
```

Computer vision owns observations from the footage. The tactical engine owns their
football meaning. A future Amazon Bedrock integration may explain verified findings
and recommendations using structured evidence.

## Architecture direction

The current application is a Vite and React single-page application with a Supabase
backend. The minimum-change direction for TactiLens is:

```text
TactiLens TV client
  └── Opposition briefing and evidence playback

TactiVision application
  ├── Existing Opposition Analyst
  ├── Existing dashboards and report generation
  └── Existing knowledge-base workflows

Evidence platform (planned)
  ├── Offline video/CV processing
  ├── Deterministic event and pattern extraction
  ├── Provenance and validation
  └── Persisted briefings and evidence clips

AWS integration (planned)
  ├── Media and artifact storage
  ├── Opposition briefing API
  └── Bedrock explanation over verified evidence
```

Specific CV models, tracking libraries, TV framework, and AWS compute services will
be selected after technical spikes and benchmarks. No candidate is treated as an
architectural commitment yet.

## Run locally

### Prerequisites

- Node.js 20 or later
- npm 10 or later
- A Supabase project for connected knowledge-base and analyst features

### Install and start

```bash
git clone https://github.com/ousssamarahmani/TactiLens.git
cd TactiLens
npm install
Copy-Item .env.example .env.local # Windows PowerShell
npm run dev
```

For macOS or Linux, replace the `Copy-Item` command with:

```bash
cp .env.example .env.local
```

Open [http://localhost:8080](http://localhost:8080).

### Environment

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

Only use the public Supabase anonymous key in the browser. Keep service-role keys
and external provider credentials in server-side secrets.

## Verify the repository

```bash
npm run lint
npm run test
npm run build
```

These commands validate the existing web application. Device and remote-navigation
verification will be added when the Fire TV/Vega client exists.

## Repository map

```text
src/
  components/        Tactical dashboard, visualizations, and UI primitives
  data/              Club, international, match, and World Cup data
  hooks/             Opposition Analyst client workflow
  integrations/      Generated Supabase client and types
  lib/               Retrieval, report generation, and domain helpers
  pages/             Analyst and knowledge-base screens
supabase/
  functions/         Analyst, search, and ingestion Edge Functions
  migrations/        Database, storage, and vector-search schema
docs/
  assets/            TactiLens repository artwork
public/              Application-facing static assets
```

## Roadmap

- [x] Preserve and identify pre-existing TactiVision capabilities
- [ ] Complete repository audit and implementation plan
- [ ] Define evidence, provenance, and system-boundary contracts
- [ ] Benchmark the offline computer-vision pipeline
- [ ] Connect structured observations to validated tactical findings
- [ ] Build and test the ten-foot Fire TV/Vega experience
- [ ] Add and document working AWS services
- [ ] Validate the demo on a Fire TV device or Vega simulator
- [ ] Record the sub-three-minute demonstration and complete product feedback

## Brand

TactiLens is a product within the TactiVision AI family.

```text
TactiVision AI
    └── Opposition Analyst
            └── TactiLens — Fire TV / Vega coaching-room experience
```

The TactiLens name, logo, and original project assets are reserved by the project
owner. Third-party football data, reports, footage, trademarks, and services remain
subject to their respective licenses and terms.

## License

No open-source license has been selected yet. All rights are reserved until a
license file is added. Because the repository is public, an approved open-source
license must be added before using it as the public hackathon submission repository.

<div align="center">
  <strong>See the pattern. Trust the evidence. Prepare the room.</strong>
</div>
