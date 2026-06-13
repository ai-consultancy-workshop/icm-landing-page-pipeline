# Landing-page pipeline

A reusable **factory** for building production-grade, bespoke Next.js landing pages
fast and reliably. It orchestrates the work using the **Interpretable Context
Methodology (ICM)**: the folder structure *is* the pipeline. A single agent walks
numbered stages, reading the right files at each step and writing plain-text
artifacts a human reviews before the next stage runs. Local scripts do the
non-AI work (scraping, scaffolding, QA).

## This repo is a template

This repo is copied to become **one customer's repo**. The pipeline runs **inside**
it and builds that customer's landing page at the repo root. Nothing here creates a
new repo — by the time you run it, you're already in one. The generated Next.js app
lives at the repo root; this `pipeline/` folder is the machinery that produced it
(keep it for re-runs and provenance).

## How it works

```
CLAUDE.md            Layer 0 — identity & map (auto-loaded by Claude Code)
pipeline/
  CONTEXT.md         Layer 1 — routing: entry paths + stage order + review gates
  stages/NN_*/       Layer 2 contract (CONTEXT.md) + Layer 3 refs + Layer 4 output/
  _config/           Layer 3 — design principles, engineering conventions, voice, sections, tokens
  setup/             Layer 3 — business-type questionnaires (entry path B)
  scripts/           scrape-site.mjs, scaffold-app.sh, qa.sh
```

The six stages, each doing one job, with a human review gate between each:

| # | Stage | Produces |
|---|-------|----------|
| 00 | Intake | `business-profile.json`, `intake.md` |
| 01 | Brand | `brand-identity.md`, `tokens.json` |
| 02 | Spec | `spec.md` (objective, sections, copy, SEO, CTA) |
| 03 | Design | `design.md` (layout, components, motion, a11y) |
| 04 | Build | the Next.js app at repo root + `build-notes.md` |
| 05 | Review | QA, fixes, and a PR in this repo |

## Two ways to start

- **A — improve an existing site:** give the agent the live URL. It scrapes it
  (visual + HTML) and imports the brand identity.
- **B — net-new:** the agent runs the right questionnaire from
  `setup/questionnaires/` and synthesises a first-iteration brand.

## Running it

Open this repo in Claude Code and tell the agent to start the pipeline, giving it
either a URL (path A) or saying you'll answer questions (path B). The agent reads
`CLAUDE.md` → `pipeline/CONTEXT.md` → each stage's `CONTEXT.md`, and stops at every
review gate for your sign-off. Edit any stage's `output/` file before continuing —
your edits are what the next stage reads.

To re-run one stage (e.g. tweak the design without redoing brand/spec), just run that
stage again; its `## Inputs` lists what it depends on.

## Scripts

- `node pipeline/scripts/scrape-site.mjs <url> <outDir>` — brand evidence capture
  (Playwright if available, HTML fetch otherwise). Needs `npx playwright install`
  for visual capture.
- `bash pipeline/scripts/scaffold-app.sh` — one-time Next.js + shadcn scaffold (idempotent).
- `bash pipeline/scripts/qa.sh` — lint + typecheck + build, collated into a report.

## Stack of generated sites

Next.js (App Router) · Tailwind · shadcn/ui · Framer Motion · lucide — always in the
**customer's** brand from stage 01, never a hardcoded one.
