# Pipeline Routing — Layer 1

This is the workspace-level map. Given what the customer needs, it tells you which
stage handles it and the order to run. Read this at the start of every run, then
hand off to the stage contracts.

## Two entry paths

Both paths converge after stage 01 and run the same stages 02–05.

- **Path A — Improve an existing site.** The customer has a live website flagged
  for improvement. We ingest the URL, scrape it (visual + HTML), and **import**
  their brand identity from what exists.
- **Path B — Net-new from a questionnaire.** No usable site yet. We run the
  business-type questionnaire in `setup/questionnaires/`, capture the business
  information, and **synthesise** a first-iteration brand.

Stage `00_intake` decides the path and records it as `entry_path` in
`business-profile.json`. Stage `01_brand` branches on it. From `02_spec` onward the
two paths are identical.

## Stage order

| # | Stage | One job | Reads (Layer 4 handoff) | Writes |
|---|-------|---------|--------------------------|--------|
| 00 | `00_intake` | Capture the starting point (URL or questionnaire) | — | `intake.md`, `business-profile.json` |
| 01 | `01_brand` | Import (A) or synthesise (B) brand identity | `00_intake/output/` | `brand-identity.md`, `tokens.json`, `assets/` |
| 02 | `02_spec` | Requirements + content spec | `01_brand/output/` | `spec.md` |
| 03 | `03_design` | Concrete design direction | `02_spec/output/` | `design.md` |
| 04 | `04_build` | Build the Next.js app at repo root | `03_design/output/` | app code, `build-notes.md` |
| 05 | `05_review` | QA + open PR in this repo | `04_build/output/` | `review-report.md`, PR |

Numbering is execution order. The `output/` folder of stage N is the input to
stage N+1 — that is the only channel between stages.

## Review-gate protocol (the human-in-the-loop)

After every stage, **stop**. Do not start the next stage automatically. Instead:

1. State plainly what you wrote to `output/` (filenames + a one-paragraph summary).
2. Name the **one or two things most worth checking** at this gate (see each
   stage's `## Review gate` line).
3. Invite the human to open and edit the `output/` file directly.
4. Resume only when they confirm. The next stage reads **whatever is in `output/`
   now** — including their edits.

Editing intensity is uneven by design: heaviest at stage 01 (brand — sets the whole
direction) and stage 05 (review — aligning the build with earlier decisions),
lighter in the well-anchored middle stages.

## Re-running a single stage

Stages are independent passes. If `spec.md` is fine but `design.md` needs rework,
re-run `03_design` without touching 00–02. A stage's `## Inputs` declares which
files it depends on; if any of those change, that stage's output may be stale and
should be re-run.

## Where the stable rules live (Layer 3)

- `_config/design-principles.md` — universal landing-page/design rules.
- `_config/engineering-conventions.md` — Next.js + Tailwind + shadcn build conventions.
- `_config/voice-framework.md` — how to capture any brand's tone of voice.
- `_config/section-catalog.md` — the section library and when to use each.
- `_config/tokens-schema.md` — the canonical shape of `tokens.json`.
- `setup/questionnaires/` — per-business-type intake questions (path B).

These are the **factory**: configured once, stable across customers. The per-customer
**product** is everything under each stage's `output/`.
