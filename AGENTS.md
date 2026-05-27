# AGENTS.md

## Project Overview

Premium multi-page website for **D.E.B TOUT CORPS** — a French construction and renovation company. Built with Astro 6 + Tailwind CSS v4.

**Brand Colors:**
- `#FFFFFF` — White
- `#F7D051` — Gold accent
- `#253142` — Dark blue (primary)
- `#34404F` — Gray blue (secondary)

**Tech Stack:** Astro 6 (static), Tailwind CSS v4 (CSS-based config, no `tailwind.config.js`), custom i18n (FR/ES), Inter font.

**Package manager:** pnpm (Node >=22.12.0)

## Build / Dev / Test Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server (localhost:4321)
pnpm build            # Production build to ./dist/
pnpm preview          # Preview production build
pnpm astro check      # TypeScript + Astro type checking
```

**No test framework is currently configured.** If adding tests, prefer Vitest. Example single-test command once configured:
```bash
pnpm vitest run src/tests/example.test.ts   # Run single test file
pnpm vitest run --reporter=verbose          # Run all tests verbose
```

## Project Structure

```
src/
  i18n/              # Translations (ui.ts) + helpers (utils.ts)
  components/
    ui/              # Reusable UI components
    sections/        # Page sections
  layouts/
    Layout.astro     # SEO, i18n, fonts, global styles
  pages/
    index.astro      # Root redirect to /fr/
    [lang]/          # FR & ES localized pages
    [lang]/services/ # Dynamic service pages
  styles/
    global.css       # Tailwind v4 theme + animations
public/images/       # Static assets
```

## i18n Architecture

- **Default locale:** French (`fr`). **Supported:** `fr`, `es`.
- **URL pattern:** `/{lang}/{page}` (e.g. `/fr/services`, `/es/contact`).
- **Translation file:** `src/i18n/ui.ts` — always add keys to **both** `fr` and `es` objects.
- **Helper usage:**
  ```ts
  import { getLangFromUrl, useTranslations } from '../i18n/utils';
  const lang = getLangFromUrl(Astro.url);
  const t = useTranslations(lang);
  const title = t('nav.home');   // falls back to defaultLang if missing
  ```

## Tailwind v4 Configuration

Configured in `src/styles/global.css` via `@import "tailwindcss"` and `@theme`.

**Custom colors:** `bg-deb-dark`, `text-deb-gold`, `border-deb-gray`, etc.  
**Custom animations:** defined in `global.css` with `@keyframes`.  
**No `tailwind.config.js` exists.**

## Code Style Guidelines

### General
- Use **pnpm** exclusively.
- Component files use `.astro` syntax with TypeScript frontmatter.
- Keep frontmatter minimal; move complex logic to `.ts` files.

### Imports
- Use **relative paths** for local imports.
- Include **`.astro` extension** for Astro component imports.
- Order: third-party imports first, then local imports (separate with blank line).

### Formatting
- **Tabs** for indentation inside `.astro` files (HTML + CSS).
- **Single quotes** for JS/TS strings; **double quotes** for HTML attributes.
- Use `<!doctype html>` (lowercase).
- Self-closing void elements: `<meta />`, `<img />`.

### TypeScript
- Strict mode enabled (`extends: astro/tsconfigs/strict`).
- Use explicit `interface Props` for component props.
- Avoid `any`; use proper types or `unknown` with narrowing.

### Naming Conventions
- **PascalCase** for component filenames and types (`ServiceCard.astro`, `Hero.astro`).
- **camelCase** for variables, functions, and instances.
- **UPPER_SNAKE_CASE** for constants.
- One component per file.

### Error Handling
- Validate dynamic params and props explicitly.
- Use optional chaining and nullish coalescing where appropriate (`??` not `||` for defaults).
- Never expose secrets or stack traces to the client.

### Styling
- Prefer Tailwind utility classes directly in HTML.
- Use scoped `<style>` blocks only when necessary.
- Semantic HTML: `<main>`, `<section>`, `<nav>`, `<article>`.
- Mobile-first responsive design.

### Accessibility
- ARIA labels on interactive elements.
- `focus-visible` states on buttons and links.
- Respect `prefers-reduced-motion`.
- Alt text on all images.
- Maintain WCAG AA color contrast.

## Important Notes

- The `.astro/` directory is auto-generated; never edit it directly.
- The `dist/` directory is the build output; never commit it.
- Environment files are gitignored — never hardcode secrets.
- Use `pnpm add <package>` for new dependencies.
- The `public/images/` folder is for real project photos.
