# Stage 05 — Review & Merge

One job: **quality-gate the build and merge it** into this repo via a PR. This is
alignment and debugging work — trace any issue back to the stage that caused it.

## Inputs

- Layer 4: `../04_build/output/build-notes.md` and the built app at repo root
- Layer 4: `../01_brand/output/brand-identity.md`, `tokens.json`
- Layer 4: `../02_spec/output/spec.md`
- Layer 3: `references/qa-checklist.md`
- Skills: `accessibility` (WCAG 2.2), and `security-best-practices` if there are forms.

## Process

1. **Automated QA**: run `bash ../../scripts/qa.sh` — lint, typecheck, `build`, and
   a11y/perf collation. Fix what it surfaces. Re-run until clean.
2. **Accessibility pass**: apply the `accessibility` skill against the rendered page
   (contrast, keyboard, landmarks, alt text, reduced-motion).
3. **Brand-fidelity check**: compare the page against `brand-identity.md` and
   `tokens.json` — does it look and read like this customer? Note drift.
4. **Spec-fidelity check**: every section from `spec.md` present, in order, with the
   primary CTA dominant.
5. **Trace, don't patch blindly**: when something is wrong, decide whether to fix it
   here or to re-run an earlier stage (e.g. weak copy → spec; wrong colour → brand).
   Prefer fixing the source when the issue is systemic.
6. **Merge**: create a branch, commit, and **open a PR in this repo** (`gh pr create`).
   Do not create a new repo — you are already in the customer's repo.

## Outputs

- `output/review-report.md` — QA results (lint/types/build/a11y/perf), brand- and
  spec-fidelity findings, what was fixed vs deferred, and the PR link.
- A PR in this repo with the landing page ready to merge.

## Verify

- `qa.sh` passes clean (no lint/type errors, `build` succeeds).
- No WCAG-AA failures outstanding; reduced-motion respected.
- The PR targets this repo's default branch and contains only the intended changes.

## Review gate

Final human sign-off: review the PR diff and the deployed preview, confirm brand +
spec fidelity, then approve and merge.
