# Stage 02 — Spec

One job: turn the business + brand into a **requirements and content spec** for the
landing page. Decide *what* the page says and contains — not how it looks (that's 03).

## Inputs

- Layer 4: `../00_intake/output/business-profile.json`, `intake.md`
- Layer 4: `../01_brand/output/brand-identity.md`
- Layer 3: `../../_config/design-principles.md` (conversion + hierarchy principles)
- Layer 3: `../../_config/section-catalog.md` (the section library + when to use each)

## Process

1. State the page's **single primary objective** and the target conversion action
   (from the profile's `primary_goal` / `primary_cta`). One page, one main job.
2. Choose the **information architecture**: the ordered list of sections from
   `section-catalog.md` appropriate to this business type and goal. Justify each —
   no section without a reason tied to the objective.
3. For each section, write a **content outline**: the message, the proof
   (stats/testimonials/logos), and the copy direction (in the brand voice, but draft
   copy is fine — final wording can land at build).
4. Define **SEO/metadata**: title, description, primary keywords, OG image intent.
5. Define the **CTA strategy**: one primary CTA repeated, optional secondary, and
   where each appears.

## Outputs

- `output/spec.md` — objective, target conversion, ordered IA with per-section
  content outline, SEO/metadata, CTA strategy, and any out-of-scope notes.

## Verify

- Every section maps to the primary objective; nothing is there "for completeness".
- The primary CTA from `business-profile.json` is the page's dominant action.
- Voice in the copy direction matches `brand-identity.md`.

## Review gate

Check the **section list and order** — this is the page's whole arc, and it's
cheapest to change here. Confirm the objective and CTA before design starts.
