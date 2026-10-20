# Sanity application boundary

This directory owns the server-side connection between the Next.js application
and the private Sanity `development` dataset. Sanity response shapes stay here;
page and feature code consume application-owned normalized types.

## Configuration

Phase 2A is locked to project `8aeezn2c` and dataset `development`. The defaults
are safe for local development, and startup fails if environment overrides point
at any other project or dataset.

Configure these values in the uncommitted root `.env.local`:

```bash
SANITY_PROJECT_ID=8aeezn2c
SANITY_DATASET=development
SANITY_API_READ_TOKEN=<viewer token>
SANITY_STUDIO_URL=http://localhost:3333
```

`SANITY_API_READ_TOKEN` must be a least-privilege Viewer token. Because the
dataset is private, the server needs it for published and draft reads. It is
loaded only from server-only modules and is never assigned to a `NEXT_PUBLIC_`
variable or a browser live-subscription client.

## Fetch modes and fallback

- `fetchPublishedSanity` always uses the published perspective.
- `fetchDraftAwareSanity` uses drafts only after Next.js Draft Mode has been
  enabled by the validated Sanity Presentation handshake.
- Preview reads bypass the CDN and Next.js cache. Published reads may be cached
  briefly and tagged for later revalidation work.
- Missing credentials, missing documents, missing locale values and API errors
  return an explicit non-success result. The page keeps its existing next-intl
  content instead of failing.

Phase 2A renders Mansarda's localized introduction only in authorized preview.
Its code-controlled `coming-soon` availability, contact flow and public page
remain unchanged.

Phase 2B also renders Local Guide entries on the existing localized guide route.
Each public category moves from its static entry to Sanity only after the query
returns at least one valid entry for that category. This supports incremental
migration without duplicates and prevents an empty dataset or failed request
from erasing the established guide. Published guide reads revalidate within 30
seconds; preview reads remain uncached.

Local Guide normalization also owns the public safety boundary for optional
practical information. It accepts only HTTP(S) website and Maps URLs, converts
reasonable international telephone text into a `tel:` URL, and omits malformed
values. Missing contact fields do not affect entry eligibility or static
category fallback.

## Preview security

The Studio Presentation tool calls `/api/draft-mode/enable`. `next-sanity`
validates the short-lived secret against Sanity before setting the signed Next.js
Draft Mode cookie. Shared preview links are disabled in Studio configuration.
The exit control posts to `/api/draft-mode/disable` and redirects only to a
whitelisted localized path.

Visual-editing overlays are enabled in Draft Mode. Live browser subscriptions
are intentionally omitted so the private read token never reaches client-side
JavaScript; use reload or preview navigation to fetch the latest saved draft.
