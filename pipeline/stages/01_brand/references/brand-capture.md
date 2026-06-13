# Brand capture heuristics (Layer 3)

How to derive a trustworthy brand identity, for both entry paths. Internalise these
as constraints when running stage 01.

## Path A — importing from an existing site

The scrape (`scripts/scrape-site.mjs`) gives you a screenshot and/or HTML+CSS.
Treat it as **evidence to interpret**, not values to copy verbatim.

- **Palette.** Identify the *intended* brand colours, not every colour on the page.
  Look at: primary buttons/links, logo, headings, recurring accents. Distinguish
  brand colours from incidental ones (stock photos, third-party embeds). Convert to
  OKLCH. If the existing contrast fails WCAG, **fix it** and note the change — we
  improve, not faithfully reproduce flaws.
- **Typography.** Capture the heading and body font families and the weight/scale
  feel. If the fonts are non-web or low-quality, propose the nearest tasteful
  Google/`next/font` equivalent and say so.
- **Shape & spacing.** Note corner radius (sharp vs soft), density (cramped vs
  airy), and elevation (flat vs shadowed) — these carry brand feel.
- **Voice.** Read the existing copy. Capture register, vocabulary, and any taglines
  worth keeping. Cross-check against `_config/voice-framework.md`.
- **Keep vs fix.** Honour `must_keep` / `must_fix` from the intake. Recognisable
  equity (logo, signature colour) stays; broken or dated execution gets improved.

## Path B — synthesising from the questionnaire

No site to import; you are choosing a defensible first iteration.

- **Sector fit first.** Let the business type and audience set the baseline (a law
  firm and a kids' brand want different energy). Use the questionnaire's `tone_hints`.
- **Accessible by construction.** Pick colours that already pass WCAG-AA for the text
  pairings you'll need — don't paint yourself into a contrast corner.
- **Restraint.** One primary brand colour, a neutral scale, and at most one accent.
  Semantic colours (success/warning/error) follow convention.
- **Type.** A single clean sans family is a safe, modern default unless the sector
  calls for character. Confirm it's available via `next/font`.

## Output discipline (both paths)

- Write tokens **only** in the shape defined by `_config/tokens-schema.md`.
- Every text/surface pairing you intend to use must meet WCAG-AA — verify before writing.
- Keep light **and** dark mode viable; never commit a colour that breaks one mode.
- The voice notes describe **this** customer. No borrowed or template personality.
