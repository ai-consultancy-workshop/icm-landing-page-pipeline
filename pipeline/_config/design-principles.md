# Design principles (Layer 3)

Universal principles for high-converting, well-designed landing pages. These are
**constraints to internalise**, applied with the customer's brand — not a style of
their own. Used by stages 02 (spec), 03 (design), and checked at 05 (review).

## Purpose & focus

- **One page, one job.** A landing page exists to drive a single primary action.
  Every section either moves the visitor toward it or earns its place as a trust
  signal. If a section does neither, cut it.
- **Message hierarchy.** The visitor should grasp *what this is, who it's for, and
  why it matters* within seconds. Lead with the outcome, not the mechanism.

## Above the fold

- A clear **headline** (the value/outcome), a **subhead** (who it's for + how),
  one **primary CTA**, and a supporting **visual**. No more competing for attention.
- Don't bury the CTA. The primary action should be visible without scrolling on
  both mobile and desktop.

## Visual hierarchy & scanning

- Guide the eye with **size, weight, colour, and spacing** — the most important
  thing on a screen should be the most prominent. Use the brand's primary colour
  for the **one** thing that matters per view (the main CTA, the hero stat), not
  everywhere.
- People scan in **F/Z patterns**. Put key messages along those paths; left-align
  body copy; keep line length readable (~60–80 chars).
- **Whitespace is structure**, not waste. Generous spacing (`py-20`/`py-24` sections,
  centred `max-w-6xl`/`max-w-7xl` containers) reads as confident and premium.

## Conversion patterns

- **Repeat the CTA** at natural decision points (after hero, after value, at the
  end) — same primary action, consistent label.
- **Social proof** near decision points: logos, testimonials, stats, ratings.
  Concrete numbers beat adjectives ("98% faster", "5× conversion").
- **Reduce friction**: short forms, low-commitment CTA copy ("See it in action",
  "Get started free"), no credit card unless required.
- **Name the pain, then resolve it.** State the problem plainly, then show the
  product closing the gap. Use the brand's error/destructive colour sparingly to
  dramatise the pain, then resolve to neutral/primary for the solution.

## Copy

- **Outcome over feature.** Tie claims to results. Back bold claims with a number or
  a clear mechanism.
- **Sentence case** for headings, buttons, and labels unless the brand says otherwise.
- Short, active, second-person ("you"/"your"). Match spelling convention to the
  brand (e.g. British vs US English) — capture this in stage 01.

## Responsiveness & accessibility (non-negotiable)

- **Mobile-first.** Design the small screen first; most landing-page traffic is mobile.
- **WCAG-AA** contrast and full keyboard operability are requirements, not polish.
- **Motion is purposeful and subtle** — gentle fade/slide entrances, scroll reveals
  that fire once — and always respects `prefers-reduced-motion`.

## Trust & finish

- Consistent spacing scale, type scale, and radius across the page reads as quality.
- Real content over lorem ipsum; real or tasteful placeholder imagery.
- Fast: optimise the LCP image, load fonts without layout shift, keep client JS lean.
