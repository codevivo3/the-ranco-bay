# Accommodation feature

## Informational availability calendar

`AvailabilityCalendar` receives the existing `AvailabilityData` shape from the
server-only `getBookingAvailability()` adapter. The Contact page passes only
sanitized date ranges to the browser, never the private feed or event metadata.
There is no booking action or connection to the enquiry form.

### Booking.com source

Set `BOOKING_ICAL_URL` in untracked `.env.local` for development and in the
deployment environment for production, then redeploy. Use the private HTTPS
Booking.com iCalendar export URL, not a public property-page link. Never use a
`NEXT_PUBLIC_` prefix, commit the URL, or paste it into logs/client code.
Only `booking.com` and its subdomains are accepted; redirects are rejected.
If Booking.com changes its export host, review the allowlist rather than exposing
an arbitrary server-side URL fetcher.

`booking-ical-parser.ts` unfolds iCalendar lines and reads all-day VEVENT
`DTSTART` / `DTEND` properties (with `VALUE=DATE` or bare `YYYYMMDD` values).
Events are blocked dates, not proof of a confirmed reservation. `DTEND` is
exclusive: September 10–15 blocks September 10–14, not September 15. The adapter
converts it to the existing inclusive range shape using UTC calendar arithmetic.
An all-day event without DTEND lasts one day; cancelled events are ignored.
Invalid dates, malformed documents, timed events/TZID, durations and recurring
events fail the whole feed safely instead of silently omitting blocked dates.
This is deliberately a Booking.com date-only adapter, not a full RFC recurrence
engine. Summaries, descriptions, guest details and event URLs are discarded.

### Caching and safe failures

The server fetch has a 10-second timeout and a 1 MiB response limit. Next.js Data
Cache (`unstable_cache`, compatible with this project's non-Cache-Components
configuration) stores only parsed snapshots for 20 minutes, shared across locales.
The raw fetch uses `no-store`; the URL is represented by a SHA-256 fingerprint in
the cache key so rotating it gets a separate cache entry. Neither URL nor fetch
errors are logged by this adapter.

Contact renders at request time (`connection()`), so an indefinitely cached page
cannot freeze availability. Cache refresh is request-driven, not a background
polling job. An expired snapshot is treated as unknown even while Next revalidates
it in the background; the next visit can use the refreshed result. Failure results
are also cached for up to 20 minutes to avoid repeatedly hitting a failing service.

Missing/invalid configuration, HTTP errors, timeouts, malformed/unsupported feeds,
cache failures and expired snapshots all clear `reviewedRange`. Existing local
blocked ranges remain blocked; other future dates become **Ask the owner**, never
available. Previously fetched Booking.com blocks are not advertised as fresh.
An already-open browser keeps its loaded snapshot until navigation/reload; there
is no client polling or direct access to Booking.com.

A successful feed merges its blocks with local blocks, but **does not invent a
reviewed window**: an iCal export provides no reliable coverage horizon and may
omit reservations from other channels. Only unblocked dates within the explicit
owner-reviewed range may appear available. With the default `reviewedRange: null`,
the feed shows booked dates and leaves other dates as **Ask the owner**. A valid
empty calendar is not interpreted as unlimited availability.

### Updating the local source

- `reviewedRange`: the inclusive `start` / `end` dates the owner has checked.
- `unavailableRanges`: inclusive blocked `start` / `end` date ranges. A single
  blocked date has the same start and end. These contain no guest information.
- All values must be zero-padded, valid `YYYY-MM-DD` calendar dates.
- Within the reviewed range, unblocked dates appear available; outside it, dates
  remain unconfirmed. Blocked dates appear unavailable, even outside that range.
- The initial range is `null`, with no invented bookings. Empty data must not
  suggest that every date is free. Supply owner-reviewed data before publication
  of availability; local data changes require redeployment.

### Date and display rules

The calendar shows the current month plus eleven months, with Monday-first
localized weekday names. Past dates are subdued and cannot be selected. All days
are informational, with full date/status text for assistive technology.

The current date follows Europe/Rome and refreshes while the page is open and
when the tab becomes visible. A hydration-safe placeholder prevents static builds
from freezing the current month. Six table rows reserve a consistent footprint.
Date-only arithmetic and formatting explicitly use UTC, without converting stay
dates through the visitor's timezone.

### Verification and future providers

Run `node --test src/features/accommodation/booking-availability.test.mjs` for
synthetic feed/failure tests (no real private URL or guest data is used).
Sanity or another provider can later return this same `AvailabilityData` shape.
The calendar UI and owner-final-confirmation disclaimer remain unchanged:
displayed availability is always indicative and must be confirmed by the owner.
