# Local guide feature

The existing guide layout accepts application-owned `LocalGuideEntry` values.
The localized page asks the Sanity boundary for entries, then applies a
category-level fallback to the original next-intl content. Once a category has
at least one valid CMS entry, only CMS entries are shown for that category.

Sanity's `eat`, `water`, and `explore` values map to the website's established
sections. The schema's `practical` option is intentionally not public yet,
because the website has no corresponding localized section. Static-only tags
remain on fallback entries; CMS image layout is derived from asset dimensions.
Missing photographs, descriptions, seasonal information, and Maps URLs do not
prevent a valid titled entry from rendering.

Optional practical information is shown only inside the expanded guide item.
Address is rendered as text; the official website and Google Maps values are
validated HTTP(S) links; telephone values are normalized to a safe `tel:` URL.
Malformed optional links are omitted rather than exposed to visitors. The link
labels come from the existing `Guide` next-intl namespace.
