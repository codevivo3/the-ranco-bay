# Architecture

## Application shell

The site uses the Next.js App Router under `src/app`. Locale-aware public pages live beneath `src/app/[locale]`; there is no legacy Pages Router. Layouts and pages are Server Components by default. A component becomes a Client Component only when it owns browser state, browser APIs or interaction that cannot remain on the server.

The initial homepage is deliberately a semantic scaffold. Future page areas should be grouped by business domain under `src/features`, while generic primitives remain in `src/components`. Accommodation, local guide, property and Guest Companion logic must not leak into generic UI components.

## Internationalisation

next-intl owns application and interface language. `src/i18n/routing.ts` defines English, Italian, German and French with English as the default and `localePrefix: "always"`. `src/proxy.ts` negotiates or redirects unprefixed requests. `src/i18n/request.ts` validates the requested locale and loads its JSON messages. `src/i18n/navigation.ts` exposes locale-aware `Link`, redirect and routing helpers so components do not build locale URLs manually.

Every locale is statically enumerated by the locale layout. All visible static UI copy—including metadata, labels, navigation, accessibility text, temporary scaffold text and static alt text—belongs in `messages/{locale}.json`. The four files must keep identical semantic namespace shapes. Avoid generic numbered keys and avoid long-form editorial copy in message files.

## Messages and CMS content

next-intl will own navigation, buttons, fixed interface labels, validation, accessibility strings, reusable calls to action and appropriate static metadata.

Sanity will eventually own editorial and business content: accommodation descriptions, amenities, places, itineraries, property stories, recommendations and Guest Companion material. It will also support multilingual editorial documents, previews and visual editing. Sanity content will not replace next-intl UI messages.

CMS queries will enter through `src/lib/sanity`. Where useful, query results should be normalised into application-owned types before page components consume them. Components should not be coupled prematurely to one language-specific Sanity field shape.

## Replaceable integration boundaries

No booking provider is selected. A future integration must sit behind a provider-independent application boundary so accommodation pages do not depend directly on Booking.com, Airbnb, Lodgify, Smoobu, Beds24 or a custom checkout.

No motion package is selected. Future animation primitives belong in `src/components/motion` as narrow client boundaries after the static Figma implementation and interaction prototype are approved. Do not make whole page trees client-side for animation.

## SEO, responsive design and accessibility

The locale layout creates translated metadata and language alternates through the Metadata API. `sitemap.ts` lists only the four existing public locale roots; `robots.ts` permits crawling and advertises the sitemap. `NEXT_PUBLIC_SITE_URL` supplies the production origin and localhost is the development fallback.

Layouts are mobile-first and fluid. Components must wrap translated strings naturally and must not depend on English line lengths or fixed text heights. Shared gutters and maximum widths are tokenised.

The baseline uses semantic landmarks, a skip link, translated navigation labels, visible focus indicators, a valid heading order and a reduced-motion media query. Future interactions must work with keyboard and touch, never hover alone. Static image alternatives belong in messages; editorial image alternatives may come from Sanity.
