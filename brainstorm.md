# Brainstorm — Pipeline Audit vs. ICM Paper

**Date:** 2026-06-15
**Scope:** Cross-check the landing-page pipeline scaffolding against `.claude/icm.pdf`
("Interpretable Context Methodology: Folder Structure as Agent Architecture"), and
flag every issue, risk, question, and concern that could undermine reliable,
high-quality output. This file is an input to later improvement prompts — it
diagnoses, it does not fix.

## How to read this

Each item has a **priority**, a **location**, **what's wrong**, **why it matters**,
and (where useful) a **direction** or an **open question**. Priorities:

- **P0 — Confirmed bug.** Will break or silently degrade a real run. Fix before first use.
- **P1 — High risk.** Likely to break on current tool versions, or a real output-quality hole.
- **P2 — Medium.** Reliability/consistency gap; worth fixing soon.
- **P3 — Polish / open question.** Improvement or a decision for the human.

## TL;DR — the headline findings

1. **The handoff folders aren't in git** (`output/` dirs are empty → untracked). The
   template's whole premise is "copy this repo to become the customer's repo," and the
   paper's only inter-stage channel is `output/`. A `git`-based copy loses them. **P0.**
2. **`.claude/settings.json` is from a different project.** It allow-lists four scripts
   that don't exist and none of the three that do, plus Linear/investor tooling. Every
   real script run will prompt for permission. **P0.**
3. **`scaffold-app.sh` can delete the customer repo's git history** in its no-`rsync`
   fallback (`rm -rf "$REPO_ROOT/.git"`), directly violating CLAUDE.md's "never
   initialise a repository." **P0.**
4. **Version drift is the biggest build-stage landmine:** `create-next-app@latest` +
   `shadcn@latest` now ship Tailwind v4 (CSS-first `@theme`, no `tailwind.config.js`),
   and the conventions/token docs still describe a v3 "Tailwind theme" mental model. **P1.**
5. **Path A ("improve existing site") captures brand but never captures the
   conversion intent** (goal, CTA, audience). Stage 02 then has to invent the very
   things the pipeline says never to invent. **P1.**

---

## A. ICM-fidelity — does the scaffolding match the paper's architecture?

Overall: this is a **faithful and well-executed ICM implementation.** The five layers
map cleanly (Layer 0 `CLAUDE.md` → Layer 1 `pipeline/CONTEXT.md` → Layer 2 stage
`CONTEXT.md` → Layer 3 `_config/` + `references/` → Layer 4 `output/`), the stage
contracts use the paper's Inputs/Process/Outputs shape, numbering encodes execution
order, and the review-gate-between-every-stage protocol is explicit. The pipeline even
adds a `## Verify` section the paper only proposes as future work (§6.2). The notes
below are divergences and missed opportunities, not architectural failures.

### A1 — `output/` (and empty `references/`) dirs are not git-tracked **[P0]**
- **Where:** all `pipeline/stages/NN_*/output/` (every one is empty); confirmed via
  `git ls-files` — only `CONTEXT.md` and two `references/*.md` are tracked.
- **What:** Git does not track empty directories. When this template "is copied to
  become one customer's repo" (README) via clone/template, the `output/` folders
  vanish.
- **Why it matters:** The paper is emphatic that `output/` is *the* handoff channel —
  "the `output/` folder of stage N is the input to stage N+1 — that is the only channel
  between stages" (`pipeline/CONTEXT.md`). The pipeline also claims Git-compatibility/
  portability as a core property (paper §3.4). Missing folders mean the first action of
  every stage is "create the folder I was told already exists," and any tooling that
  assumes the path exists will fail.
- **Direction:** add `.gitkeep` (or a short `output/README.md`) to every `output/` and
  `references/` dir so the structure survives a copy and is self-documenting.

### A2 — "Verify" means two different things (paper vs. pipeline) **[P3]**
- **Where:** every stage `CONTEXT.md` `## Verify`; paper §6.2 "Cross-stage trace verification."
- **What:** The pipeline's `Verify` blocks are *within-stage self-checks* ("every token
  validates," "entry_path is consistent"). The paper's proposed `Verify` is a
  *cross-stage* check: confirm stage N is consistent with stage N−2 by re-reading both.
- **Why it matters:** Not a bug — the pipeline is ahead of the paper by having Verify at
  all. But the strongest reliability lever the paper identifies (catching drift between,
  e.g., the built page and the brand set three stages earlier) isn't what these blocks
  do. Stage 05 carries the cross-stage burden alone, manually.
- **Direction:** consider adding explicit "check against stage N−k" assertions to the
  later stages (03/04/05) — e.g. 04's Verify already gestures at this ("renders every
  section in spec.md, in the brand from tokens.json"); make it systematic.

### A3 — No output provenance / traceability **[P3]**
- **Where:** all stage outputs; paper §6.2 "Output provenance through identifiers,"
  §4.5 "U-shaped" edit pattern (heavy edits again at the final stage = alignment work).
- **What:** Outputs carry no markers linking a decision back to the input that drove it.
- **Why it matters:** The paper's central observed pain is that final-stage review is
  "almost entirely alignment work, tracing the final output back through the pipeline."
  With reliable, high-quality output as the goal, cheap traceability directly lowers the
  cost of the most expensive review gate (05).
- **Direction:** lightweight convention — e.g. spec/design sections cite which
  profile/brand field they serve; `build-notes.md` maps each component to its
  `design.md` section. Optional but high-leverage for review speed.

### A4 — `shared/` vs `_config/`; questionnaire-as-`setup/` **[P3]**
- **Where:** paper Fig. 2 shows Layer 3 as both `_config/` and `shared/`; pipeline has
  only `_config/` and puts questionnaires under `setup/`.
- **What/why:** Harmless consolidation, but worth noting so no later prompt goes looking
  for a `shared/` folder. The mapping is sound; just undocumented as a deliberate choice.

### A5 — Token-budget claims are weakest at stage 04 **[P3]**
- **Where:** paper §3.2 (Layers 0–2 ≈ 1,300–1,600 tok; total per stage 2,000–8,000);
  stage 04 `CONTEXT.md` Inputs.
- **What:** Stage 04 loads `design.md` + `spec.md` + `tokens.json` + `brand-identity.md`
  + `engineering-conventions.md` + the whole `next-best-practices` skill. That is the
  heaviest context in the pipeline and plausibly exceeds the paper's 8k "focused" band.
- **Why it matters:** The "layered loading keeps context lean" guarantee is the ICM
  selling point; it's least true exactly where output quality matters most (the build).
- **Open question:** is stage 04 worth splitting (e.g. 04a scaffold+tokens, 04b
  sections, 04c assembly) so each pass stays in the focused band? Trade-off: more gates.

---

## B. Confirmed bugs & reliability risks in the mechanics

### B1 — `settings.json` is mis-templated (wrong project) **[P0]**
- **Where:** `.claude/settings.json` `permissions.allow`.
- **What:** Allow-lists `pipeline/scripts/feature-run.sh`, `feature-board.sh`,
  `sync-labels.sh`, `send-investor-update.sh` — **none exist** here. The three scripts
  that *do* exist (`scrape-site.mjs`, `scaffold-app.sh`, `qa.sh`) are **not** allowed.
  Also pre-allows six Linear MCP tools and `send-investor-update.sh` — leftovers from a
  Sustentus internal repo (see B2).
- **Why it matters:** Every real pipeline run (scrape, scaffold, qa) hits a permission
  prompt, breaking the "one agent walks the stages" flow; the allow-list provides zero
  value and signals the template wasn't scrubbed.
- **Direction:** replace with the actual scripts:
  `Bash(node pipeline/scripts/scrape-site.mjs:*)`,
  `Bash(bash pipeline/scripts/scaffold-app.sh:*)`,
  `Bash(bash pipeline/scripts/qa.sh:*)`,
  plus `npx create-next-app`, `npx shadcn`, `npx playwright`. Drop the Linear/investor
  entries (or confirm they're intentional).

### B2 — Template not scrubbed of its source project (Sustentus) **[P1]**
- **Where:** `settings.json` (B1); `pipeline/_config/engineering-conventions.md` (refs
  `packages/ui/src/globals.css`, "this org uses pnpm + turbo," Sustentus brand-guidelines
  skill); `.claude/skills/brand-guidelines/` is entirely Sustentus.
- **What:** The repo carries Sustentus-specific assumptions and a Sustentus brand skill.
- **Why it matters:** Twofold. (1) **Brand-leak risk:** the build agent has a
  fully-specified "apply Sustentus purple/voice" skill in context while being told to
  use *the customer's* brand. engineering-conventions.md *does* warn against this
  ("Borrow the technique, never Sustentus's purple/voice") — good — but relying on a
  prose warning to suppress an actively-loaded brand skill is fragile. (2) **Stale
  infra assumptions:** "pnpm + turbo," `packages/ui` monorepo paths don't match a
  single-app landing page.
- **Open question:** should `brand-guidelines` (Sustentus) be removed from a customer
  template entirely, and the *mechanics* it teaches be re-expressed brand-neutrally in
  `engineering-conventions.md`? That removes the leak vector at the source.

### B3 — `scaffold-app.sh` can destroy the customer repo's git history **[P0]**
- **Where:** `pipeline/scripts/scaffold-app.sh` lines ~58–62 (no-`rsync` fallback).
- **What:** `create-next-app` initialises a git repo in `$TMP/app`. The fallback does
  `cp -R "$TMP/app/." "$REPO_ROOT/"` (copying `$TMP/app/.git` over the real `.git`) then
  `rm -rf "$REPO_ROOT/.git"` — **deleting the repo's history**. The comment says "restore
  guards if needed" but the code does the opposite.
- **Why it matters:** Directly violates CLAUDE.md ("Never create, clone, or initialise a
  repository") and is destructive/irreversible. Triggers whenever `rsync` is absent
  (common on minimal/macOS-CI/container images).
- **Direction:** never touch `$REPO_ROOT/.git`. Pass `--disable-git` (or equivalent) to
  `create-next-app` so no tmp `.git` is created, and in the fallback copy
  file-by-file excluding `.git`, `CLAUDE.md`, `pipeline/`, `.claude/` (mirror the rsync
  excludes exactly).

### B4 — Likely-invalid / drifting `create-next-app` flags **[P1]**
- **Where:** `scaffold-app.sh` lines ~39–47.
- **What:** `--src-dir=false` is probably not valid syntax (the flag is `--src-dir` /
  `--no-src-dir`); `--ts/--tailwind/--app/--eslint` and `--use-pnpm` also drift between
  versions. The script self-admits flag drift, which is honest but means the scaffold
  may error on first contact.
- **Why it matters:** Stage 04 begins by running this; if it errors, the agent is
  improvising the scaffold, which is exactly the unreliability we're auditing for.
- **Direction:** use `--no-src-dir`; consider `--turbopack`/`--no-turbopack`,
  `--disable-git`; verify against the installed `create-next-app` (the build stage
  already re-reads `next-best-practices` — point it at the scaffold too).

### B5 — Tailwind v4 / shadcn v-latest mismatch with the token docs **[P1]**
- **Where:** `_config/engineering-conventions.md`, `_config/tokens-schema.md`,
  stage 04 `CONTEXT.md` step 2.
- **What:** `create-next-app@latest` + `shadcn@latest` now scaffold **Tailwind v4**
  (CSS-first `@theme` in `globals.css`, typically no `tailwind.config.js`; shadcn uses
  `components.json` + CSS variables). The docs repeatedly say "map tokens into the
  **Tailwind theme** / globals.css," a v3-flavoured framing.
- **Why it matters:** The token-install step (the thing that makes the page look like
  the customer) is where v3→v4 differences bite hardest. Wrong mental model → broken
  theming, dark mode, or silent fallback to defaults.
- **Direction:** make the conventions explicitly v4-aware (`@theme inline`, `@custom-variant
  dark`, CSS-var-first), and have the build stage confirm the scaffolded Tailwind major
  before mapping tokens.

### B6 — `tokens.json` semantic names don't line up with shadcn's variables **[P2]**
- **Where:** `_config/tokens-schema.md` (`success/warning/error/info`, `light`/`dark`
  roles) vs. shadcn's default contract (`--destructive`, `--secondary`, `--popover`,
  `--input`, `--card`, `--ring`, `--chart-*`).
- **What:** The schema invents `error` where shadcn uses `destructive`, omits
  `secondary`/`popover`/`input`, and adds `success/warning/info` shadcn doesn't define.
- **Why it matters:** The build stage must bridge two non-matching vocabularies by hand
  → drift, missed variables, or components reading undefined tokens. Reliability nit
  right at the brand-application seam.
- **Direction:** align the schema to shadcn's variable set (map `error`→`destructive`,
  add the missing roles) and document the extras as additive.

### B7 — `scrape-site.mjs` silently degrades brand capture on Path A **[P2]**
- **Where:** `pipeline/scripts/scrape-site.mjs`.
- **What:** Several quality risks on the *visual import* path that is Path A's whole point:
  - `waitUntil: 'networkidle'` is flaky/deprecated; many real sites never idle →
    45s timeout → the **entire** Playwright branch throws → falls back to HTML fetch,
    **losing the screenshot** even though the page rendered.
  - Browsers aren't installed by the script (README says run `npx playwright install`
    manually); if absent, every Path A run silently drops to HTML-only.
  - The HTML-fallback `extractColorsFromCss` only scans inline HTML — real brand colours
    live in **external CSS** it never fetches, so fallback colour data is near-useless.
  - Single desktop viewport (1440×900); no mobile capture though design is "mobile-first."
- **Why it matters:** "Improve an existing site" quietly becoming "guess from thin HTML"
  is a silent quality cliff with no signal to the brand stage that it happened.
- **Direction:** switch to `domcontentloaded` + explicit settle, screenshot inside a
  try so a timeout still yields an image, fetch linked stylesheets in the fallback, and
  have stage 01 **assert** a screenshot exists (or loudly note Path A degraded to HTML).

### B8 — `scrape` evidence is dumped into the curated `output/` handoff **[P2]**
- **Where:** stage 01 `CONTEXT.md` (`node ../../scripts/scrape-site.mjs <url> ./output`);
  script writes `page.html`, `content.md`, `extracted.json`, `screenshot.png` into `output/`.
- **What:** Raw scrape evidence lands alongside the curated deliverables
  (`brand-identity.md`, `tokens.json`) in the same `output/` folder.
- **Why it matters:** The paper's principle is "every output is a clean edit surface."
  Mixing transient evidence with the Layer-4 handoff muddies that surface and the review
  gate. (Stage 02 only reads `brand-identity.md`, so not fatal — but untidy.)
- **Direction:** scrape into `output/assets/` or a `01_brand/_evidence/` subfolder;
  keep `output/` for the curated artifacts the next stage and human actually consume.

### B9 — `qa.sh` typecheck uses `npx --yes tsc` (not the project's TS) **[P2]**
- **Where:** `pipeline/scripts/qa.sh` lines ~67–73.
- **What:** Prefers `npx --yes tsc --noEmit`, which may pull a different TypeScript than
  the project's and ignores the Next TS plugin wiring → false failures or false passes.
- **Direction:** prefer the project's `typecheck` script / local `tsc`; only fall back to
  `npx tsc` if neither exists.

### B10 — Relative paths assume an unstated CWD **[P2]**
- **Where:** every stage `CONTEXT.md` (`../00_intake/output/`, `../../scripts/...`).
- **What:** Inputs/commands are written relative to the stage folder, but nothing tells
  the agent to `cd` there; the agent starts at repo root. `../../scripts/scrape-site.mjs`
  from repo root resolves wrong. (The *scripts* anchor via `git rev-parse` — robust — but
  the *instructions to the agent* don't.)
- **Why it matters:** Ambiguous CWD is a classic source of "works once, fails next time."
- **Direction:** standardise on repo-root-relative paths in CONTEXT files, or state the
  CWD convention once in Layer 1 and keep it consistent.

---

## C. Output-quality & coverage gaps

### C1 — Path A never captures conversion intent **[P1]**
- **Where:** stage 00 `CONTEXT.md` (Path A records only URL + reasons; questionnaire is
  Path B only); stage 02 needs `primary_goal`, `primary_cta`, `target_audience`,
  `offerings`.
- **What:** Path A produces a `business-profile.json` with brand but likely **null**
  goal/CTA/audience, because the shared-core questions are only asked on Path B.
- **Why it matters:** Stage 02 must then invent the page's objective and CTA — exactly
  what stage 00 forbids ("No invented facts… mark unknowns null"). The page's whole arc
  rests on an objective nobody captured. This is the biggest *silent* quality hole.
- **Direction:** have Path A also ask the shared-core conversion questions from
  `_router.md` (brand is imported; intent still has to be elicited). Or make stage 02
  explicitly pause for goal/CTA when they're null.

### C2 — "Improve an existing site" is actually a greenfield rebuild **[P2 / question]**
- **Where:** README + `pipeline/CONTEXT.md` Path A framing.
- **What:** Path A imports *brand* but builds a brand-new Next.js app; it does not
  improve the existing site's structure/content/code in place.
- **Why it matters:** A customer hearing "improve my site" may expect their site
  edited, not replaced with a fresh single landing page. Expectation mismatch.
- **Open question:** is "rebuild the landing page in their refreshed brand" the intended
  promise? If so, rename Path A to something like "re-skin / rebuild from an existing
  site" so it's honest.

### C3 — Forms/CTAs that submit nowhere **[P2]**
- **Where:** `section-catalog.md` ("Lead capture / CTA band," short form),
  questionnaires (book / request-a-quote / contact CTAs), qa-checklist security row.
- **What:** Several business types' primary CTA is a form (book, quote, contact), but no
  stage specifies where a form submits — no API route / Server Action / email-service
  pattern. The `email-best-practices` skill + Resend exist but aren't wired into any stage.
- **Why it matters:** A primary CTA that goes nowhere is a broken conversion path — the
  one thing a landing page exists to do. Especially acute for local-services /
  professional-services (book/contact is *the* goal).
- **Direction:** add a "form handling" decision to spec/design (mailto vs. Server Action
  + Resend vs. external embed), and a minimal secure-submit pattern to conventions.

### C4 — No measured a11y/perf; the gate is model-judgment **[P2]**
- **Where:** `qa.sh` (lint/tsc/build only); qa-checklist "Lighthouse/perf" and
  "WCAG-AA" rows; closing message promises perf notes nothing produces.
- **What:** WCAG-AA is stated as "non-negotiable / a requirement," but nothing runs axe/
  pa11y/Lighthouse — a11y and perf rest entirely on the agent reasoning via the
  `accessibility` skill.
- **Why it matters:** For a stated *requirement*, the verification is unmeasured. Output
  reliability of the a11y claim is therefore only as good as the model's manual pass.
- **Direction:** add an automated axe-core run (e.g. against a local build) and capture
  `next build` output / a Lighthouse-CI pass into the report so the gate has evidence.

### C5 — No deploy / preview stage, but the gate references a "deployed preview" **[P3 / question]**
- **Where:** pipeline ends at 05 (PR in repo); stage 05 review gate says "review the PR
  diff **and the deployed preview**."
- **What:** Nothing in the pipeline produces a preview deployment; it's assumed (Vercel
  PR previews?) but never stated or configured.
- **Open question:** is deploy intentionally out of scope (Vercel auto-previews on PR),
  or should there be a `06_deploy` stage / explicit Vercel link step? At minimum, stop
  the gate from promising an artifact the pipeline doesn't create.

### C6 — Path B with no logo / assets **[P3]**
- **Where:** stage 01 outputs (`assets/` logo "when available"); Path B businesses often
  have no logo.
- **What:** No guidance for the logo-absent case (wordmark fallback, generated mark).
- **Direction:** specify a tasteful wordmark fallback so the build never stalls on a
  missing logo.

### C7 — `next-best-practices` re-read mandated only at build, not design **[P3]**
- **Where:** stage 03 picks shadcn primitives + Framer Motion APIs but isn't told to
  re-read the skill; only stage 04 is.
- **Why it matters:** Design can commit to stale component/motion APIs the build then
  inherits. Minor.

---

## D. Smaller items & polish

- **D1 [P3] Root `README.md` is a one-line stub** (`# icm-landing-page-pipeline`). The
  real overview lives in `pipeline/README.md`. A human (or agent) landing at repo root
  sees nothing. Promote a short orientation + pointer to `pipeline/README.md`.
  *(Note: this is the file currently open in the IDE.)*
- **D2 [P3] Review gates are prose-only, unenforced.** CLAUDE.md/CONTEXT say "stop after
  every stage," but nothing enforces it — the single most important safety property in
  the paper (human-in-the-loop) depends entirely on agent discipline. Consider a Stop
  hook or a per-stage "gate passed?" artifact the next stage checks. *This is arguably
  the highest-leverage reliability lever in the whole system.*
- **D3 [P3] `accent` has no tint ramp** in `tokens-schema.md` (only `primary` does),
  though design/build may want accent tints for surfaces/hover.
- **D4 [P3] "One page, one job" vs. multi-action local businesses.** Local services often
  want call + book + directions at once; the hard single-CTA rule may fight reality.
  Worth a note on permitted secondary actions.
- **D5 [P3] Model/agent-teams note.** Paper was built on Opus 4.6 + Sonnet 4.6 via Agent
  Teams (sub-agent delegation); this pipeline is single-agent sequential (which matches
  ICM's core claim and is fine). Just flag that the parallel sub-agent delegation the
  paper describes isn't used here, so no one expects it.
- **D6 [P3] Vercel session hooks are noisy false-positives here.** The harness keeps
  auto-suggesting Vercel `workflow`/`bootstrap` skills on keyword matches ("pipeline,"
  "reliable," `README*`). Not part of this repo's design, but worth knowing the
  environment injects them so they don't get mistaken for pipeline requirements.

---

## E. Open questions for the human (decisions, not bugs)

1. **Path A intent capture (C1):** should Path A also run the shared-core conversion
   questions, or is brand-only import the deliberate scope?
2. **"Improve" semantics (C2):** is a greenfield rebuild-in-new-brand the intended
   promise of Path A?
3. **Forms (C3):** what's the default form-submit target — Resend/email, a Server Action,
   or an external embed? This decides whether the primary CTA actually works.
4. **Deploy (C5):** out of scope (rely on Vercel PR previews) or add an explicit stage?
5. **Sustentus brand skill (B2):** remove it from the customer template and re-express
   its mechanics brand-neutrally, or keep it (with the leak-risk it carries)?
6. **Stage-04 split (A5):** accept the heavy build context, or split into sub-stages for
   tighter context at the cost of more review gates?

---

## Suggested fix order (when we move from diagnosis to action)

1. **P0 safety/correctness:** `.gitkeep` the handoff folders (A1); fix `settings.json`
   (B1); make `scaffold-app.sh` never delete `.git` (B3).
2. **P1 build reliability:** Tailwind v4 awareness (B5); `create-next-app` flags (B4);
   Path A intent capture (C1); de-Sustentus the template (B2).
3. **P2 quality seams:** token↔shadcn mapping (B6); scrape robustness (B7); evidence vs.
   handoff separation (B8); CWD/paths (B10); forms (C3); measured a11y/perf (C4).
4. **P3 polish & the gate-enforcement question (D2)** — small but D2 is worth promoting.
