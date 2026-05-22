# AGENTS.md

## Project Overview

Premium multi-page website for **D.E.B TOUT CORPS** — a French construction and renovation company. Built with Astro 6 + Tailwind CSS v4.

**Brand Colors:**
- `#FFFFFF` — White
- `#F7D051` — Gold accent
- `#253142` — Dark blue (primary)
- `#34404F` — Gray blue (secondary)

**Tech Stack:**
- Astro 6 (static output)
- Tailwind CSS v4 (configured in CSS, no `tailwind.config.js`)
- Custom i18n architecture (FR/ES)
- Inter font from Google Fonts

**Package manager:** pnpm

## Build / Dev / Test Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start local dev server (localhost:4321)
pnpm build            # Production build to ./dist/
pnpm preview          # Preview production build locally
pnpm astro check      # TypeScript and type checking for Astro files
```

**No test framework currently configured.** If adding tests, prefer Vitest.

## Project Structure

```
/
├── public/                    # Static assets (images, favicons)
│   └── images/
├── src/
│   ├── i18n/                  # Internationalization
│   │   ├── ui.ts              # Translation dictionaries (FR + ES)
│   │   └── utils.ts           # getLangFromUrl, useTranslations helpers
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── Button.astro
│   │   │   ├── LanguagePicker.astro
│   │   │   ├── SectionHeader.astro
│   │   │   └── ServiceCard.astro
│   │   ├── sections/          # Page sections
│   │   │   ├── Hero.astro
│   │   │   ├── ValueProp.astro
│   │   │   ├── ServicesPreview.astro
│   │   │   ├── ProjectsShowcase.astro
│   │   │   ├── WhyUs.astro
│   │   │   ├── Process.astro
│   │   │   ├── Testimonials.astro
│   │   │   └── CTABanner.astro
│   │   ├── Navbar.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── Layout.astro       # Main layout with SEO, i18n, fonts
│   ├── pages/
│   │   ├── index.astro        # Redirect to /fr/
│   │   ├── [lang]/            # FR and ES versions
│   │   │   ├── index.astro
│   │   │   ├── services.astro
│   │   │   ├── about.astro
│   │   │   ├── contact.astro
│   │   │   ├── gallery.astro
│   │   │   └── services/
│   │   │       └── [service].astro   # Dynamic service pages
│   │   ├── fr/                # French pages
│   │   └── es/                # Spanish pages
│   ├── styles/
│   │   └── global.css         # Tailwind v4 + custom theme + animations
│   └── assets/                # Processed assets
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

## i18n Architecture

- **Default locale:** French (`fr`)
- **Supported locales:** French (`fr`), Spanish (`es`)
- **URL pattern:** `/{lang}/{page}` (e.g., `/fr/services`, `/es/contact`)
- **Translation file:** `src/i18n/ui.ts` — add new keys to both `fr` and `es` objects
- **Helper usage:**
  ```ts
  import { getLangFromUrl, useTranslations } from '../i18n/utils';
  const lang = getLangFromUrl(Astro.url);
  const t = useTranslations(lang);
  const title = t('nav.home');
  ```

## Tailwind v4 Configuration

Tailwind v4 is configured in `src/styles/global.css` using `@theme` and `@import "tailwindcss"`.

**Custom theme variables:**
```css
--color-deb-white: #FFFFFF;
--color-deb-gold: #F7D051;
--color-deb-dark: #253142;
--color-deb-gray: #34404F;
--color-deb-cream: #FAF9F6;
--color-deb-light-gray: #F5F5F0;
```

**Font:** Inter (300, 400, 500, 600, 700) loaded from Google Fonts in Layout.astro.

## Code Style Guidelines

### General
- Component files use `.astro` syntax with TypeScript in frontmatter
- Use `pnpm` exclusively
- Node version >=22.12.0

### Imports
- Use **relative paths** for local imports
- Include `.astro` extensions for Astro components
- Third-party imports before local imports

### Tailwind v4 Specific
- Use utility classes directly in HTML (no `@apply` needed in most cases)
- Custom colors via `bg-deb-dark`, `text-deb-gold`, etc.
- Custom animations defined in `global.css` with `@keyframes`

### Formatting
- Tabs for HTML and CSS inside `.astro` files
- Single quotes for JS/TS strings, double quotes for HTML attributes
- `<!doctype html>` (lowercase)
- Self-closing void elements (`<meta />`, `<img />`)

### TypeScript
- Strict mode enabled (extends `astro/tsconfigs/strict`)
- Explicit types for component props using `Props` interface

### Component Conventions
- PascalCase filenames (`ServiceCard.astro`, `Hero.astro`)
- One component per file
- Minimal frontmatter — move complex logic to `.ts` files

### Styling
- Tailwind utility classes preferred
- Scoped `<style>` blocks only when necessary
- Semantic HTML (`<main>`, `<section>`, `<nav>`, `<article>`)
- Mobile-first responsive design

### Accessibility
- ARIA labels on interactive elements
- Focus-visible states on buttons/links
- `prefers-reduced-motion` respected
- Alt text on all images
- WCAG AA color contrast

## Important Notes

- The `.astro/` directory is auto-generated; never edit it directly
- The `dist/` directory is the build output; never commit it
- Environment files are gitignored — never hardcode secrets
- Use `pnpm add <package>` for new dependencies
- The `public/images/` folder is ready for real project photos
