# Landing-Page Pipeline — Layer 0 (Identity)

You are operating a **landing-page build pipeline**. This repository will become a
single customer's landing page. Your job is to take that one customer from raw
input to a merged, production-grade Next.js landing page, one stage at a time.

This pipeline follows the **Interpretable Context Methodology (ICM)**: the folder
structure *is* the orchestration. There is no framework. You navigate numbered
stage folders, read the right files at each step, write plain-text artifacts that
the next stage consumes, and a human reviews between every stage.

## You already live inside the customer's repo

This repo was copied from a template to become **this customer's** repo. You are
already inside it. **Never create, clone, or initialise a repository.** Everything
you build — the Next.js app, branches, commits, the final PR — happens **here**,
in this repo, at the repo root.

## Where am I — folder map

```
CLAUDE.md                  <- you are here (Layer 0: identity)
pipeline/
  CONTEXT.md               Layer 1: routing — read this next, every run
  stages/NN_*/CONTEXT.md   Layer 2: the contract for each stage
  stages/NN_*/references/  Layer 3: stable rules for that stage
  stages/NN_*/output/      Layer 4: this customer's artifacts (handoff point)
  _config/                 Layer 3: pipeline-wide references (the "factory")
  setup/questionnaires/    Layer 3: business-type question sets (entry path B)
  scripts/                 local scripts (scrape, scaffold, qa) — non-AI work
  README.md                human-facing overview
app/ components/ …         the generated Next.js app (created at stage 04, repo root)
```

## How context is layered (load only what a stage names)

- **Layer 0** this file — who you are, where things are. Always loaded.
- **Layer 1** `pipeline/CONTEXT.md` — which stage handles what; the run order.
- **Layer 2** a stage's `CONTEXT.md` — the contract: Inputs / Process / Outputs.
- **Layer 3** reference material under `references/`, `_config/`, `setup/` — stable
  rules to **internalise as constraints** (design principles, conventions, voice).
- **Layer 4** a stage's `output/` — per-customer working artifacts to **process as
  input**. The `output/` of stage N is the input to stage N+1.

Do not load the whole repo. At each stage, read only the files that stage's
`## Inputs` lists. This keeps each step focused and the output reliable.

## How to run

1. Read `pipeline/CONTEXT.md` to pick the entry path and confirm the stage order.
2. Run stages in numeric order, starting at `00_intake`.
3. For each stage: read its `CONTEXT.md`, follow `## Process`, write to `output/`.
4. **Stop at the review gate.** Tell the human what landed in `output/` and what to
   check. Let them edit. Only proceed to the next stage when they say go.

## Engineering baseline (for the build stage)

Generated sites are **Next.js (App Router) + Tailwind + shadcn/ui + Framer Motion +
lucide**, in the **customer's** brand (captured at stage 01) — never a hardcoded
brand. Next.js APIs change often: re-read the `next-best-practices` skill before
writing app code rather than relying on memory.
