# The Ranco Bay

The production foundation for The Ranco Bay: an owner-led accommodation website for Ranco on Lake Maggiore. This phase establishes routing, internationalisation, design tokens, accessibility and future integration boundaries without implementing the final Figma design, booking, CMS schemas or motion.

## Stack

- Next.js 16 with the App Router and React Server Components by default
- React 19 and strict TypeScript
- Tailwind CSS 4 plus CSS custom properties
- next-intl for interface localisation and locale-aware navigation
- ESLint with the Next.js Core Web Vitals and TypeScript configurations
- Sanity planned behind an application boundary; not installed in this phase
- pnpm 9 as the package manager

## Local development

Use Node.js 20.9 or newer.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. The root redirects to the English locale at `/en`.

```bash
pnpm lint
pnpm build
pnpm start
```

Copy `.env.example` to `.env.local` only when environment-specific configuration is needed. Never commit secrets.

## Locales

The initial locales are English (`en`), Italian (`it`), German (`de`) and French (`fr`). English is the default and source language. All public routes always include the locale prefix: `/en`, `/it`, `/de` and `/fr`.

Routing is defined in `src/i18n/routing.ts`, request-time message loading in `src/i18n/request.ts`, navigation helpers in `src/i18n/navigation.ts`, and locale interception in `src/proxy.ts`. UI messages live in `messages/{locale}.json`; user-facing copy must not be hardcoded in components.

## Directory overview

- `messages/`: fixed UI, accessibility and metadata translations
- `src/app/[locale]/`: locale-aware pages and layouts
- `src/components/`: reusable layout, navigation and section components
- `src/features/`: future domain-owned application logic
- `src/i18n/`: next-intl configuration
- `src/lib/sanity/`: future CMS integration and normalisation boundary
- `src/styles/`: brand, semantic and typography tokens
- `public/`: future production images, icons and local font assets
- `docs/`: architectural, product-boundary and design-system decisions

See `docs/architecture.md` before adding routes or integrations.
