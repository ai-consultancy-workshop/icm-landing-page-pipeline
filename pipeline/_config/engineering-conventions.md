# Engineering conventions (Layer 3)

The build baseline for every generated site. Stable craft; the **brand is per-customer**
(from stage 01). Used by stage 03 (component choices) and stage 04 (build).

## Stack

- **Next.js (App Router)**, TypeScript, **Server Components by default**.
- **Tailwind CSS** with brand tokens as CSS variables.
- **shadcn/ui** for component primitives; **Framer Motion** for motion; **lucide-react** for icons.
- `next/image`, `next/font`, `generateMetadata` for images, fonts, SEO.

> APIs change often. **Re-read the `next-best-practices` skill before writing app
> code** — don't rely on memory for App Router / RSC / metadata signatures.

## Next.js rules that matter here

- Components are **Server Components** unless they need interactivity, state, effects,
  or browser APIs — only then add `'use client'`, and push it to the leaf, not the page.
- Never fetch server-only data inside a client component. Pass data down as
  serialisable props.
- Images: `next/image` always; the LCP/hero image gets `priority`; set `sizes`.
- Fonts: `next/font` (Google or local), `display: swap`. Put the font's `.variable`
  className on `<html>`; in `@theme inline` use **literal** family names
  (`--font-sans: "Inter", ui-sans-serif, …`), never the runtime `var(--font-…)` —
  `@theme inline` resolves at parse time, so a runtime font var silently breaks loading.
- Metadata: export `metadata` or `generateMetadata` from the route — title,
  description, OpenGraph — sourced from the spec.
- Use `proxy.ts` (not `middleware.ts`) if interception is ever needed (Next 16+).

## Brand tokens, not hardcoded colours (Tailwind v4)

`create-next-app@latest` + `shadcn@latest` scaffold **Tailwind v4**, which is
**CSS-first**: there is **no `tailwind.config.js`** — the theme lives in
`app/globals.css`. **Confirm the scaffolded Tailwind major before mapping tokens**
(check `package.json`); the steps below assume v4. (Legacy v3 instead maps tokens via
`tailwind.config.ts` `theme.extend`.)

Install `tokens.json` (OKLCH) the way shadcn does:

1. **Raw role values as CSS variables**, split by mode — light in `:root`, dark in `.dark`:

   ```css
   :root { --background: oklch(…); --foreground: oklch(…); --primary: oklch(…); /* … */ }
   .dark { --background: oklch(…); --foreground: oklch(…); --primary: oklch(…); /* … */ }
   ```

2. **Expose them to utilities** via `@theme inline`, so `bg-primary` /
   `text-muted-foreground` / `border-border` resolve:

   ```css
   @import "tailwindcss";
   @custom-variant dark (&:is(.dark *));
   @theme inline {
     --color-background: var(--background);
     --color-foreground: var(--foreground);
     --color-primary:    var(--primary);
     /* …one per semantic role; --radius and font tokens too */
   }
   ```

3. **Dark mode** is the `.dark` class on `<html>` (e.g. `next-themes`,
   `attribute="class"`); `@custom-variant dark` is what makes `dark:` utilities work.

- Components reference **semantic tokens** (`bg-primary`, `text-muted-foreground`,
  `border-border`) — never a raw hex. That is what keeps light + dark mode working.
- Ship **light and dark mode**. Never commit a colour that breaks a mode.

## Visual craft (brand-agnostic mechanics)

These are the *mechanics* that make a SaaS landing page feel polished — apply them in
the **customer's** palette and voice, not any fixed brand:

- **Soft, rounded surfaces.** A base radius (e.g. `rounded-lg`/`0.75rem`); cards as
  `bg-card` + `border-border` + subtle blur/shadow for elevation. Nothing sharp.
- **Pill eyebrows.** Section labels as full-rounded tinted pills
  (`rounded-full border px-4 py-2 text-sm font-medium`).
- **Ambient depth.** Large, soft, blurred colour blobs behind hero/section
  backgrounds at low opacity (`blur-3xl`, `bg-primary/10`) — subtle, never loud.
- **Motion.** Framer Motion fade-up entrances (`opacity 0→1`, `y: 20→0`, ~0.6–0.8s)
  with **staggered** delays and `whileInView` + `viewport={{ once: true }}` for
  scroll reveals. Always gate on `prefers-reduced-motion`.
- **Stat blocks.** Big primary-coloured number + small muted label to make impact concrete.
- **Iconography.** lucide, consistent thin stroke, sized to context, tinted semantically.
- **Generous spacing.** Sections breathe (`py-20`/`py-24`); content centred in
  `max-w-6xl`/`max-w-7xl`.

> Reference: the bundled `brand-guidelines` skill describes these mechanics in
> detail (as Sustentus's own system). Borrow the **technique**, never Sustentus's
> purple/voice — the customer's brand always wins.

## Structure & quality

- `app/page.tsx` composes section components from `components/sections/`.
- One component per section; keep them focused and typed (no `any` escape hatches).
- Real copy from the spec; `alt` text on every meaningful image.
- Accessibility is built in, not bolted on: semantic landmarks, focus order, labels.
- Keep client bundles lean; prefer Server Components and composition over heavy client trees.
