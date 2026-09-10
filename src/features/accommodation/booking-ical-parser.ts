import {calendarDateForFormatting, toCalendarDate, type CalendarDate, type DateRange} from "./availability-dates";

type Property = {parameters: string[]; value: string};

function parseDate({parameters, value}: Property): CalendarDate {
  // Booking.com all-day exports. Reject timed/TZID values rather than guess nights.
  if (parameters.some((part) => part.toUpperCase() !== "VALUE=DATE") || !/^\d{8}$/.test(value)) {
    throw new Error("Unsupported iCalendar date");
  }
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));
  const date = toCalendarDate(year, month, day);
  const parsed = calendarDateForFormatting(date);
  if (year < 1 || parsed.getUTCFullYear() !== year || parsed.getUTCMonth() + 1 !== month || parsed.getUTCDate() !== day) {
    throw new Error("Invalid iCalendar date");
  }
  return date;
}

function eventRange(properties: Map<string, Property>): DateRange | null {
  if (properties.get("STATUS")?.value.toUpperCase() === "CANCELLED") return null;
  // Partial recurrence expansion could silently omit blocked dates. Fail closed.
  if (["RRULE", "RDATE", "EXDATE", "EXRULE", "RECURRENCE-ID", "DURATION"].some((name) => properties.has(name))) {
    throw new Error("Unsupported iCalendar event");
  }
  const startProperty = properties.get("DTSTART");
  if (!startProperty) throw new Error("Missing event start");
  const start = parseDate(startProperty);
  const endProperty = properties.get("DTEND");
  // RFC 5545: an all-day event without DTEND/DURATION lasts one day.
  if (!endProperty) return {start, end: start};
  const exclusiveEnd = parseDate(endProperty);
  if (exclusiveEnd <= start) throw new Error("Invalid event range");
  const end = calendarDateForFormatting(exclusiveEnd);
  end.setUTCDate(end.getUTCDate() - 1);
  return {start, end: toCalendarDate(end.getUTCFullYear(), end.getUTCMonth() + 1, end.getUTCDate())};
}

/** Only sanitized inclusive blocked ranges leave this parser, never guest metadata. */
export function parseBookingICal(source: string): DateRange[] {
  const lines = source.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\n[ \t]/g, "").trim().split("\n");
  if (lines[0]?.toUpperCase() !== "BEGIN:VCALENDAR" || lines.at(-1)?.toUpperCase() !== "END:VCALENDAR") {
    throw new Error("Invalid iCalendar document");
  }
  const stack: string[] = [];
  let event: Map<string, Property> | null = null;
  const ranges: DateRange[] = [];
  let version = false;
  for (const line of lines) {
    if (!line) continue;
    const colon = line.indexOf(":");
    if (colon < 1) throw new Error("Invalid iCalendar property");
    const [rawName, ...parameters] = line.slice(0, colon).split(";");
    const name = rawName.toUpperCase();
    const value = line.slice(colon + 1);
    if (name === "BEGIN") {
      const component = value.toUpperCase();
      if (component === "VCALENDAR" && stack.length) throw new Error("Nested calendar");
      if (component === "VEVENT") {
        if (stack.length !== 1 || event) throw new Error("Invalid event nesting");
        event = new Map();
      }
      stack.push(component);
    } else if (name === "END") {
      if (stack.pop() !== value.toUpperCase()) throw new Error("Unclosed iCalendar component");
      if (value.toUpperCase() === "VEVENT" && event) {
        const range = eventRange(event);
        if (range) ranges.push(range);
        event = null;
      }
    } else if (stack.length === 1 && name === "VERSION") {
      if (value !== "2.0" || version) throw new Error("Invalid iCalendar version");
      version = true;
    } else if (event && stack.at(-1) === "VEVENT") {
      // Store only scheduling properties; ignore summaries, descriptions and URLs.
      if (["DTSTART", "DTEND", "STATUS", "RRULE", "RDATE", "EXDATE", "EXRULE", "RECURRENCE-ID", "DURATION"].includes(name)) {
        if (event.has(name)) throw new Error("Duplicate event property");
        event.set(name, {parameters, value});
      }
    }
  }
  if (stack.length || event || !version) throw new Error("Incomplete iCalendar document");
  return ranges.sort((a, b) => a.start.localeCompare(b.start));
}
