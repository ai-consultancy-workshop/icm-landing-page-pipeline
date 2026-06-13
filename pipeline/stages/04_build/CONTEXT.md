# Stage 04 — Build

One job: **build the Next.js landing page** in this repo, at the repo root, matching
the design and spec. You are writing real production code now.

## Inputs

- Layer 4: `../03_design/output/design.md`
- Layer 4: `../02_spec/output/spec.md`
- Layer 4: `../01_brand/output/tokens.json`, `brand-identity.md`, `assets/`
- Layer 3: `../../_config/engineering-conventions.md` (stack + conventions)
- Skill: re-read `next-best-practices` before writing app code (APIs change).

## Process

1. **Scaffold if needed** (idempotent): if there is no `package.json`/`app/` at the
   repo root, run `bash ../../scripts/scaffold-app.sh`. It runs `create-next-app`
   (App Router, TypeScript, Tailwind) and `shadcn init`. If the app already exists,
   skip — never re-scaffold over existing code.
2. **Install brand tokens**: write the OKLCH values from `tokens.json` into the
   Tailwind theme / `globals.css` as CSS variables and semantic tokens
   (`--primary`, `--background`, …). Wire light + dark mode. Load fonts with
   `next/font`. Never hardcode hex that breaks a mode.
3. **Build sections**: implement each section from `design.md` as a component.
   Server Components by default; `'use client'` only where interactivity/motion needs
   it. Compose shadcn/ui primitives where chosen; add Framer Motion per the motion
   plan; lucide icons.
4. **Assemble the page**: compose sections in `app/page.tsx`, real copy from the spec,
   `next/image` for images, `generateMetadata` for SEO from the spec's metadata.
5. **Stay accessible**: semantic landmarks, focus order, alt text, reduced-motion —
   per the design's accessibility commitments.

## Outputs

- The Next.js app at repo root: `app/`, `components/`, theme/token files, assets.
- `output/build-notes.md` — what was built, decisions/trade-offs, anything deferred
  for review, and which sections need a human eye.

## Verify

- The page renders every section in `spec.md`, in order, in the brand from `tokens.json`.
- No hardcoded brand colours; semantic tokens only; dark mode does not break.
- Server/Client boundaries are correct (no client component fetching server-only data).

## Review gate

Confirm the build **looks like the design and reads like the brand**. Run it locally
(`pnpm dev` / `npm run dev`) and skim each section before the review stage.
