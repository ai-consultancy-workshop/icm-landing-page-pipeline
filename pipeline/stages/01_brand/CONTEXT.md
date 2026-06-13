# Stage 01 — Brand Identity

One job: produce this customer's **brand identity** — voice and visual tokens.
Branch on `entry_path`: **import** it (Path A) or **synthesise** it (Path B).

## Inputs

- Layer 4: `../00_intake/output/business-profile.json`, `intake.md`
- Layer 3: `../../_config/voice-framework.md` (capture/validate tone of voice)
- Layer 3: `../../_config/tokens-schema.md` (the exact shape of `tokens.json`)
- Layer 3: `references/brand-capture.md` (heuristics for both paths)

## Process

**Path A — import from the existing site:**
1. Run `node ../../scripts/scrape-site.mjs <existing_url> ./output` (Playwright
   visual capture; falls back to WebFetch HTML if no browser is available).
2. From the scrape, extract the real palette, type families, spacing/radius feel,
   logo, and copy voice. Keep what works (`must_keep`), fix what doesn't (`must_fix`).
3. Treat the screenshot/HTML as evidence — derive tokens, don't copy pixel values blindly.

**Path B — synthesise from the profile:**
1. Use `voice-framework.md` and the business type to derive a tone of voice.
2. Choose a palette and type system appropriate to the sector and audience —
   accessible contrast first, then character. This is a defensible first iteration.

**Both paths:** write tokens in **OKLCH** per `tokens-schema.md`, ensure WCAG-AA
contrast for text pairings, and keep light + dark mode in mind.

## Outputs

- `output/tokens.json` — palette (OKLCH), typography, radius, spacing, per `tokens-schema.md`.
- `output/brand-identity.md` — voice & personality, do/don't, target register,
  visual character notes, and (Path A) what was kept vs changed and why.
- `output/assets/` — logo + reference screenshot(s) when available.

## Verify

- Every token in `tokens.json` validates against `tokens-schema.md`.
- Text/background colour pairs meet **WCAG AA** (4.5:1 body, 3:1 large).
- Voice notes are the **customer's**, not a generic or borrowed brand.

## Review gate

This is the highest-leverage gate — brand sets the whole direction. Confirm the
palette, type, and voice feel like **this** business before any spec/design work.
