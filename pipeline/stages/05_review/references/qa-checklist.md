# Review QA checklist (Layer 3)

The gate the build must pass before merge. `scripts/qa.sh` automates the mechanical
rows; the rest are judgement checks. Record each in `review-report.md`.

## Build health (automated — qa.sh)

- [ ] Lint passes (no errors; warnings triaged).
- [ ] Type check passes (no `any`-escape hatches hiding failures).
- [ ] `next build` succeeds with no errors.
- [ ] No console errors/warnings on first paint.

## Accessibility (WCAG 2.2 AA — apply the `accessibility` skill)

- [ ] Colour contrast: body ≥ 4.5:1, large text/UI ≥ 3:1, in **both** modes.
- [ ] Full keyboard path: every interactive element reachable and operable; visible focus.
- [ ] Landmarks: one `<main>`, header/nav/footer, logical heading order (one `<h1>`).
- [ ] Images have meaningful `alt`; decorative images are `alt=""`.
- [ ] `prefers-reduced-motion` respected by all animation.
- [ ] Forms (if any): labels, error messaging, and focus management.

## Performance

- [ ] LCP image uses `next/image` with `priority`; correct `sizes`.
- [ ] Fonts via `next/font` (no layout shift, no render-blocking link tags).
- [ ] No oversized client bundles; `'use client'` only where needed.
- [ ] Lighthouse/perf notes captured (record scores even if informal).

## Brand fidelity (vs `01_brand/output/`)

- [ ] Colours map to `tokens.json`; no stray hardcoded brand colours.
- [ ] Typography matches the brand type system.
- [ ] Copy reads in the brand voice from `brand-identity.md` (tone, register, spelling).
- [ ] Shape/spacing/motion match the intended brand feel.

## Spec fidelity (vs `02_spec/output/spec.md`)

- [ ] Every spec section present, in the specified order.
- [ ] Primary CTA is the dominant action and repeats per the CTA strategy.
- [ ] Metadata (title/description/OG) matches the spec.

## Security (if the page has forms or handlers — `security-best-practices` skill)

- [ ] Inputs validated server-side; no secrets in client code; no obvious injection paths.

## Merge

- [ ] Branch created, changes committed, PR opened **in this repo** (`gh pr create`).
- [ ] PR diff contains only the intended landing-page changes.
- [ ] PR description links the spec and notes anything deferred.
