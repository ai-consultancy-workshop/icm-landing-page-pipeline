---
name: brand-guidelines
description: Applies Sustentus's official brand colours, typography, visual language, and tone of voice to any artifact that should look and sound like Sustentus. Use it whenever brand colours or style guidelines, visual formatting, UI copy, or company design standards apply.
---

# Sustentus brand styling

## Overview

Use this skill to apply Sustentus's brand identity — colours, typography, visual language, and tone of voice — to any artifact: marketing pages, app UI, slides, emails, documents, or generated copy. The goal is a single, consistent look and voice across the whole product.

Sustentus is an AI-first B2B SaaS platform for customer success, expert matching, and operational management. The brand is **confident, outcome-focused, and direct** — it speaks in business results (ARR, NRR, conversion, time-to-value), not feature lists.

**Keywords**: branding, brand identity, visual identity, Sustentus brand, brand colours, typography, tone of voice, UI copy, styling, visual formatting, visual design, design system, look and feel.

The canonical source of truth for the design tokens below is `packages/ui/src/globals.css` (the shared `@sustentus/ui` theme). When in doubt, read that file — these guidelines describe it, they do not override it.

## Colours

Colours are defined in OKLCH (the canonical format in the theme). Hex values are **approximate** convenience equivalents — prefer the Tailwind token or CSS variable in real code.

### Primary — Purple (the brand colour)

Distinctive and confident. This is Sustentus. Use it for primary actions, links, active states, emphasis, key stats, and brand accents.

| Token                    | OKLCH                                | Approx hex | Use                                       |
| ------------------------ | ------------------------------------ | ---------- | ----------------------------------------- |
| `primary` (brand)        | `oklch(0.52 0.22 280)`               | `#6d3bd1`  | Brand reference colour                    |
| `--primary` (light mode) | `oklch(0.48 0.23 280)` (primary-600) | `#6024c4`  | Buttons, links, focus rings in light mode |
| `--primary` (dark mode)  | `oklch(0.68 0.19 280)` (primary-400) | `#9b7bf0`  | The same, lifted for dark mode            |

A full `primary-50 … primary-950` scale exists — use tints for surfaces and shades for hover/active.

### Supporting palette

| Role                | Hue               | OKLCH (base)           | Approx hex | Meaning                                |
| ------------------- | ----------------- | ---------------------- | ---------- | -------------------------------------- |
| Accent              | Slate (cool gray) | `oklch(0.55 0.02 250)` | `#71798a`  | Neutral secondary, calm backgrounds    |
| Success             | Green             | `oklch(0.60 0.18 150)` | `#15924f`  | Growth, positive, confirmation         |
| Warning             | Amber             | `oklch(0.70 0.15 50)`  | `#e5912e`  | Attention, energy, caution             |
| Error / destructive | Red               | `oklch(0.55 0.22 25)`  | `#d43a2f`  | Alerts, the "broken" / problem framing |
| Info                | Cyan              | `oklch(0.65 0.15 200)` | `#159ec0`  | Information, clarity, trust            |

### Neutrals & surfaces

- Background (light): `gray-50` `oklch(0.985 0.002 247)` ≈ `#fafafb`. Foreground: `gray-900` `oklch(0.21 0.012 247)` ≈ `#1e2230`.
- Dark mode inverts these (`gray-950` background, `gray-50` foreground). Sustentus ships **light and dark mode** (system default) — never hardcode a colour that breaks in one mode. Use semantic tokens (`bg-background`, `text-foreground`, `text-muted-foreground`, `bg-card`, `border-border`).
- `secondary` mirrors the gray scale for muted UI.

### Colour usage conventions (observed in the product)

- **Tint for surfaces, solid for content.** Brand and semantic colours appear at low opacity for fills (`bg-primary/10`, `bg-primary/5`), `/20` for borders, and full strength for text and icons. Example pill: `bg-primary/10 border-primary/20 text-primary`.
- **Primary for the one thing that matters** on a screen (the main CTA, the headline stat). Don't dilute it across everything.
- **Red is reserved for the problem.** The brand deliberately uses `destructive` to dramatise pain points ("your Contact Us button is **broken**"), then resolves to neutral/primary for the solution.
- Always pair colour with sufficient contrast; rely on the semantic tokens so both themes stay accessible.

## Typography

| Role                     | Font                                                             | Notes                                                                  |
| ------------------------ | ---------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Body & headings (UI/web) | **Inter** (`--font-sans`)                                        | Loaded via `next/font`, `display: swap`. The workhorse for everything. |
| Monospace                | **Geist Mono** (`--font-mono`)                                   | Code, technical values.                                                |
| Brand wordmark           | **Sustentus** display font (`sustentus.otf`, `--font-sustentus`) | Reserved for the logo/wordmark only — not body or headings.            |

For non-web artifacts (slides, docs) where Inter isn't available, fall back to a clean geometric/grotesque sans (e.g. Arial, Helvetica) for everything. Keep one sans family — Sustentus is **not** a serif brand.

### Type scale & weights

Headings are **semibold-to-bold (600–700)**; body is normal weight. Mirror the shared `Typography` component:

| Element    | Size                        | Weight         |
| ---------- | --------------------------- | -------------- |
| h1         | `4xl` (→ `6xl` on hero)     | bold (700)     |
| h2         | `3xl` (→ `5xl` on emphasis) | bold (700)     |
| h3         | `2xl`                       | semibold (600) |
| h4         | `xl`                        | semibold (600) |
| h5         | `lg`                        | medium (500)   |
| h6         | `base`                      | medium (500)   |
| body (`p`) | `base`                      | normal (400)   |
| label      | `sm`                        | medium (500)   |

- All `h1–h6` default to `font-weight: 600` minimum in the base layer.
- Use `text-balance` on headings and lead paragraphs for tidy wrapping.
- Muted secondary text uses `text-muted-foreground`, not a hardcoded gray.

## Visual language

The Sustentus aesthetic is **clean, modern, soft-edged, and quietly animated** — confident SaaS, not flashy.

- **Rounded corners.** Base radius `--radius: 0.75rem` (`rounded-lg`). Scale: `xs` (−6px) → `xl` (+4px). Cards and buttons are noticeably rounded; nothing sharp.
- **Soft cards.** Surfaces use `bg-card/30`–`/80` + `border border-border` + `backdrop-blur-sm`, often with `shadow-2xl` for elevated panels. Translucent, layered, airy.
- **Pill badges / eyebrows.** Section labels are full-rounded pills: `rounded-full border px-4 py-2 text-sm font-medium` with a tinted brand or semantic background.
- **Ambient gradient orbs.** Hero/section backgrounds use large blurred colour blobs (`h-96 w-96 rounded-full blur-3xl bg-primary/10` and `bg-accent/10`) for depth — subtle, never loud.
- **Motion.** Framer Motion fade-up entrances: `opacity 0→1`, `y: 20→0`, ~0.8s, with **staggered delays** (`delay: index * 0.1`) and `whileInView` + `viewport={{ once: true }}` for scroll reveals. Movement is gentle and purposeful.
- **Stat blocks.** Big primary-coloured number + small muted label (`98%`, `5×`, `24/7`) to make impact concrete.
- **Iconography.** `lucide-react`, thin/consistent stroke, sized to context (`h-4 w-4` inline, `h-12 w-12` feature). Tinted to match their semantic colour.
- **Hand-drawn underline accent.** Emphasised words in big headlines get a small SVG swoosh underline in `text-primary`.
- **Generous spacing.** Sections breathe (`py-24`), content is centred in `max-w-6xl`/`max-w-7xl` containers.

## Tone of voice

Sustentus sounds like a confident operator who has done this before and respects your time.

**Principles**

1. **Outcome over feature.** Lead with the business result. Customer Success isn't a cost centre — it's "your next revenue line". Tie everything to ARR, NRR, conversion, win-rate, time-to-value.
2. **Direct and second-person.** Talk to "you" about "your" pipeline, leads, team. Short, declarative sentences and confident fragments. Em dashes for crisp asides.
3. **Name the pain, then resolve it.** Problem/solution framing: state the broken status quo plainly ("Your 'Contact Us' button is broken", "a black hole of manual processes"), then show Sustentus closing the gap.
4. **Quantify the claim.** Prefer concrete proof to adjectives — "98% faster lead processing", "5× higher conversion", "go live in weeks, see impact this quarter", "launch in hours".
5. **Speed and low friction.** Emphasise fast time-to-value and easy starts: "Setup in minutes", "No credit card required".
6. **AI-forward but practical.** AI is described by what it does for the user ("AI qualifies & drafts a mini-BRD", "AI + CSM hybrid", "agentic flows"), never as buzz.
7. **No hype for its own sake.** Confident, not breathless. Every bold claim is backed by a number or a clear mechanism.

**Mechanics**

- **Sentence case everywhere** — headings, buttons, badges, labels, placeholders. Never Title Case. ✓ `Get started free`, `Book a demo`, `Automated lead routing` · ✗ `Get Started Free`, `Automated Lead Routing`.
- **International / British English spelling**: `fulfilment`, `categorisation`, `optimise`, `centre`, `colour`, `personalise`.
- **CTAs are short, active, low-commitment**: "See Sustentus in action", "Get started free", "Book a demo", "Partner with us", "Get started".
- Use the product name **Sustentus** as the actor that fixes things ("Sustentus closes the gap").

**Voice examples (from the product)**

- Hero: _"Customer Success is your next revenue line"_ / _"Go live in weeks, see impact this quarter — the only platform where every Customer Success activity drives real ARR and NRR."_
- Problem: _"Your 'Contact Us' button is broken."_ / _"…enter a black hole of manual processes, delayed responses, and missed opportunities."_
- Solution: _"Sustentus closes the gap — qualifying, specifying, and routing every request to fulfilment-ready action."_
- Pricing: _"Pricing that grows with you. Transparent plans … No hidden fees."_
- Footer: _"Automate enterprise leads. Convert faster."_

**Avoid**: Title Case, US spellings where a British form exists, vague hype ("revolutionary", "next-gen", "synergy"), feature dumps with no stated outcome, passive voice, long hedged sentences.

## Applying the brand

- **In web/app code:** always use the semantic Tailwind tokens and CSS variables from `@sustentus/ui` (`bg-primary`, `text-muted-foreground`, `border-border`, `rounded-lg`, the `Typography` component). Never hardcode hex values that would break dark mode. Import UI primitives from `@sustentus/ui` (or, in `apps/dashboards/`, the local `components/ui/`).
- **In documents/slides/emails:** apply the brand purple as the single accent, Inter (or a clean sans fallback), generous rounded cards, and sentence-case, outcome-led copy. Use the supporting palette only for its meaning (green = success, red = problem/alert, amber = caution).
- **When writing copy:** run it past the tone principles above — lead with the outcome, quantify, sentence case, British spelling.
