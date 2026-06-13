# Stage 03 — Design

One job: turn the spec + brand tokens into a **concrete design direction** the build
stage can implement without guessing. Decide *how* each section looks and moves.

## Inputs

- Layer 4: `../02_spec/output/spec.md`
- Layer 4: `../01_brand/output/tokens.json`, `brand-identity.md`
- Layer 3: `../../_config/design-principles.md`
- Layer 3: `../../_config/engineering-conventions.md` (what shadcn/ui + craft is available)

## Process

1. For each section in the spec's IA, specify the **layout**: structure (columns,
   grid, alignment), the visual hierarchy, and the responsive behaviour (mobile → desktop).
2. Choose components: which **shadcn/ui** primitives to use vs which **custom
   sections** to build. Prefer composing shadcn primitives; build custom only where
   the section warrants it. Name them.
3. Apply the brand: map `tokens.json` to concrete usage (which colour is primary
   CTA, surfaces, accents) following the craft in `engineering-conventions.md`
   (soft rounded cards, semantic tokens, tasteful motion) — in the **customer's**
   palette, not a fixed brand.
4. Write a **motion plan**: entrance animations, scroll reveals, hover states —
   purposeful and subtle, with reduced-motion respected.
5. State **accessibility commitments**: focus order, contrast, landmarks, alt-text
   intent, keyboard paths.

## Outputs

- `output/design.md` — section-by-section layout + component choices + brand mapping
  + motion plan + responsive + accessibility commitments.

## Verify

- Every spec section has a design entry; nothing in the spec is unaddressed.
- Colour usage references `tokens.json` values, not invented colours.
- Motion plan includes a reduced-motion fallback.

## Review gate

Confirm the **hero and overall layout direction** match the brand and objective.
This is the last cheap place to redirect before code exists.
