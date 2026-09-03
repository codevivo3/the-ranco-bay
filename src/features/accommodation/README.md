# Accommodation feature

## Informational availability calendar

`AvailabilityCalendar` receives an `AvailabilityData` object. The Contact page
currently passes `accommodationAvailability` from `availability-data.ts`.
There is no booking action, API, external feed, or connection to the enquiry form.

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

### Future providers

A Sanity/iCal/other adapter can return the same `AvailabilityData` shape and pass
it through the existing server page. Keep provider fetching out of the calendar
UI. Normalize feed dates and convert exclusive iCal end dates into inclusive
blocked dates deliberately. Set the reviewed range only for dates whose source
is complete and fresh; missing, failed or stale data must remain unconfirmed.
The displayed calendar is always indicative, subject to the owner's confirmation.
