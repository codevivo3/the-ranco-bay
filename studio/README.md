# The Ranco Bay Content Studio

This standalone Sanity Studio is the editorial foundation for The Ranco Bay.
Phase 2A adds Presentation preview against the existing Next.js website without
migrating the current messages or photographs.

## Prerequisites and project boundary

- Node.js 22.12+ and pnpm 9.
- A Sanity account and a project created by an authorized project administrator.
- A private `development` dataset for initial testing. Do not point Phase 1 at
  production content.

No project ID, dataset credentials, or API token is committed. Studio users
authenticate with Sanity directly; an API token is not required for normal
local editing.

## First-time setup

1. Create or select the intended Sanity project at `sanity.io/manage`.
2. From this repository root, run `pnpm install`.
3. Authenticate the CLI with `cd studio && pnpm exec sanity login`.
4. Copy `studio/.env.example` to `studio/.env.local`.
5. Set `SANITY_STUDIO_PROJECT_ID` to the real project ID. Keep
   `SANITY_STUDIO_DATASET=development` unless an administrator chose another
   non-production dataset name.
6. If the dataset does not exist, run
   `cd studio && pnpm exec sanity dataset create development --visibility private`.

The optional `SANITY_STUDIO_APP_ID` is only needed after a Studio application
has been created for managed deployment. Phase 1 does not create or deploy one.
`SANITY_STUDIO_HOSTNAME` records the intended Sanity-hosted deployment hostname
for a later phase; it is not consumed by the current build.

## Development and build

From the repository root:

```bash
pnpm studio:dev
pnpm studio:typecheck
pnpm studio:build
```

Or run `pnpm dev`, `pnpm typecheck`, and `pnpm build` directly inside `studio/`.
The local Studio defaults to `http://localhost:3333`.

Run the Next.js application at `http://localhost:3000` at the same time to use
the Preview tool. `SANITY_STUDIO_PREVIEW_ORIGIN` may override that frontend
origin; it defaults to the local address.

## Presentation preview

The Preview tool uses Sanity's supported Presentation integration and its
short-lived preview URL secret. Shared preview links are explicitly disabled.
The frontend validates the secret before enabling its signed Draft Mode cookie,
then performs draft reads on the server with a Viewer token.

Preview destinations are available for every supported locale:

- Homepage: `/{locale}`
- Veranda: `/{locale}/house` (the repository's existing route)
- Mansarda: `/{locale}/apartments/upper-floor`
- The Property: `/{locale}/house`
- Local Guide entries: `/{locale}/guide`

Mansarda's CMS introduction appears only in authorized preview. Its public page
remains the code-controlled Coming Soon experience. Phase 2A does not expose a
browser read token, so saved draft changes require a reload or preview
navigation rather than an instantaneous live subscription.

## Branding

The house symbol from `public/logo/trb-logo-image-plain.svg` is supplied through
Sanity's supported workspace `icon` configuration. Sanity renders its native
`THE RANCO BAY` workspace title beside the icon on the authentication screen
and in authenticated Studio navigation. The Studio intentionally leaves
Sanity's native icon size, alignment, and spacing unchanged.

## Editorial model

- Homepage, The Property, and Website Settings are singletons.
- Veranda uses document ID `ground-floor`; Mansarda uses `upper-floor`.
- Apartment identity and public display name are structural configuration, not
  editable fields. Both apartments use exactly the same schema.
- Local Guide entries are the only repeatable top-level editorial document.
- Local Guide fields use Italian editorial guidance. Optional address, official
  website, telephone, Google Maps, coordinates, and seasonal-opening details
  are grouped under **Contatti e informazioni pratiche**. Existing entries do
  not require migration when these values are absent.
- Local Guide titles remain required in all four languages. The separate
  subtitle is optional; once started, missing translations produce an editorial
  warning without blocking publication.
- Photography stays embedded in its owning document. Apartment categories are
  Bathroom, Bedroom, Details, Kitchen, Living, and General.
- English, Italian, German, and French values are stored in reusable localized
  objects. The language filter keeps the form focused on chosen languages.
- Required localized objects produce errors and block publication until every
  translation is present. Recommended localized objects produce warnings only.
  Drafts can remain incomplete.

## Safety and authorization

The Studio registers fixed documents as first-class Sanity singletons, removes
their creation templates, and removes delete, duplicate, and unpublish actions
for Homepage, both apartments, The Property, and Website Settings. These are
editorial guardrails in the Studio UI, not a security boundary.

Sanity roles and Content Lake permissions enforce authorization outside the UI.
Before inviting an owner/editor:

- Do not grant Administrator or Developer solely for content editing.
- On Growth, use the built-in Editor role only if write access to the entire
  development dataset is acceptable.
- Granular server-enforced restrictions by document type or ID require custom
  roles and content resources, currently an Enterprise feature. Configure a
  custom resource that permits editorial documents and image assets but denies
  structural mutations to fixed IDs, then test it with the intended account.
- Permissions are additive. Remove any broader role that would override a
  restricted custom role.

If plan-level permissions cannot enforce the required separation, keep Studio
access limited to trusted editors and route structural changes through a
developer until an approved server-side policy is available.
