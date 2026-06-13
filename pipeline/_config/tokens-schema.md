# Tokens schema (Layer 3)

The canonical shape of `tokens.json`, written by stage 01 and consumed by stages 03
and 04. Keeping one shape means the brand stays consistent from capture to build.

## Rules

- **Colours in OKLCH.** `oklch(L C H)` — L 0–1, C ≥ 0, H 0–360. OKLCH is the build
  target (maps cleanly to CSS variables and stays perceptually even across the scale).
- **Provide light and dark** values for surface/text roles. Never a single colour
  that breaks in one mode.
- **Verify WCAG-AA** for every text/surface pairing you intend to use *before*
  committing the token (≥ 4.5:1 body, ≥ 3:1 large text/UI).
- Provide a `50…950` ramp for `primary` (and `accent` if used) so the build has
  tints for surfaces and shades for hover/active.
- Optional `approx_hex` alongside any OKLCH value is allowed as a convenience, but
  OKLCH is the source of truth.

## Shape

```json
{
  "meta": {
    "business_name": "string",
    "entry_path": "A | B",
    "source": "imported from <url> | synthesised",
    "notes": "string"
  },
  "color": {
    "primary":   { "DEFAULT": "oklch(L C H)", "50": "…", "100": "…", "200": "…", "300": "…", "400": "…", "500": "…", "600": "…", "700": "…", "800": "…", "900": "…", "950": "…" },
    "accent":    { "DEFAULT": "oklch(L C H)" },
    "semantic":  { "success": "oklch(…)", "warning": "oklch(…)", "error": "oklch(…)", "info": "oklch(…)" },
    "light": {
      "background": "oklch(…)", "foreground": "oklch(…)",
      "card": "oklch(…)", "card_foreground": "oklch(…)",
      "muted": "oklch(…)", "muted_foreground": "oklch(…)",
      "border": "oklch(…)", "ring": "oklch(…)"
    },
    "dark": {
      "background": "oklch(…)", "foreground": "oklch(…)",
      "card": "oklch(…)", "card_foreground": "oklch(…)",
      "muted": "oklch(…)", "muted_foreground": "oklch(…)",
      "border": "oklch(…)", "ring": "oklch(…)"
    }
  },
  "typography": {
    "sans":    { "family": "Inter", "source": "next/font/google", "weights": [400, 500, 600, 700] },
    "heading": { "family": "Inter", "source": "next/font/google", "weights": [600, 700] },
    "mono":    { "family": "Geist Mono", "source": "next/font/google", "weights": [400] },
    "scale": { "h1": "3rem", "h2": "2.25rem", "h3": "1.5rem", "body": "1rem", "small": "0.875rem" },
    "tracking": "normal",
    "case_convention": "sentence"
  },
  "radius":  { "base": "0.75rem", "sm": "0.5rem", "lg": "1rem", "full": "9999px" },
  "spacing": { "section_y": "6rem", "container_max": "80rem", "gap": "1.5rem" },
  "elevation": { "card_shadow": "0 1px 3px oklch(0 0 0 / 0.1)", "blur_backdrop": true },
  "accessibility": {
    "verified_pairs": [
      { "fg": "foreground", "bg": "background", "ratio": 0.0, "passes_AA": true }
    ]
  }
}
```

## Notes for the build stage

- These map to the Tailwind theme / `globals.css` semantic variables
  (`--primary`, `--background`, `--foreground`, `--muted`, `--border`, `--ring`, …)
  and the semantic colours (`--success`, `--warning`, `--error`, `--info`).
- `light`/`dark` populate the respective theme blocks; components only ever touch the
  semantic token, so switching modes "just works".
- `typography.*.source: "next/font/..."` tells the build how to load each family.
