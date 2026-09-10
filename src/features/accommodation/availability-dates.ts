export type CalendarDate = `${number}-${number}-${number}`;

export type DateRange = {
  /** Inclusive calendar dates, not timestamps or check-in/check-out times. */
  start: CalendarDate;
  end: CalendarDate;
};

export type AvailabilityData = {
  /** Only unblocked dates inside this owner-reviewed window appear available. */
  reviewedRange: DateRange | null;
  unavailableRanges: readonly DateRange[];
};

export type StayDateSelection = {
  arrival: string;
  departure: string;
};

export type DayStatus = "available" | "unavailable" | "unknown" | "past";
export type CalendarMonth = {year: number; month: number};

export const VISIBLE_MONTH_COUNT = 12;

export function toCalendarDate(year: number, month: number, day: number): CalendarDate {
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}` as CalendarDate;
}

export function monthAtOffset(today: CalendarDate, offset: number): CalendarMonth {
  const [year, month] = today.split("-").map(Number);
  const totalMonths = year * 12 + month - 1 + offset;
  return {year: Math.floor(totalMonths / 12), month: ((totalMonths % 12) + 12) % 12 + 1};
}

export function monthOffsetForDate(
  today: CalendarDate,
  date: CalendarDate,
) {
  const [todayYear, todayMonth] = today.split("-").map(Number);
  const [year, month] = date.split("-").map(Number);
  return year * 12 + month - (todayYear * 12 + todayMonth);
}

/** UTC is used solely for calendar arithmetic/Intl; no local date conversion. */
export function calendarDateForFormatting(date: CalendarDate) {
  const [year, month, day] = date.split("-").map(Number);
  const result = new Date(0);
  result.setUTCFullYear(year, month - 1, day);
  result.setUTCHours(12, 0, 0, 0);
  return result;
}

export function monthCells({year, month}: CalendarMonth): (CalendarDate | null)[] {
  const first = calendarDateForFormatting(toCalendarDate(year, month, 1));
  const last = calendarDateForFormatting(toCalendarDate(year, month + 1, 0));
  const leadingCells = (first.getUTCDay() + 6) % 7; // Monday first in all site locales.
  const dayCount = last.getUTCDate();

  // Six fixed rows keep navigation from shifting the surrounding content.
  return Array.from({length: 42}, (_, index) => {
    const day = index - leadingCells + 1;
    return day >= 1 && day <= dayCount ? toCalendarDate(year, month, day) : null;
  });
}

function includesDate(range: DateRange | null, date: CalendarDate) {
  return range !== null && range.start <= date && date <= range.end;
}

export function getDayStatus(
  date: CalendarDate,
  today: CalendarDate,
  data: AvailabilityData,
): DayStatus {
  if (date < today) return "past";
  if (data.unavailableRanges.some((range) => includesDate(range, date))) {
    return "unavailable";
  }
  return includesDate(data.reviewedRange, date) ? "available" : "unknown";
}

export function isCalendarDate(value: string): value is CalendarDate {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const parsed = calendarDateForFormatting(toCalendarDate(year, month, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() + 1 === month &&
    parsed.getUTCDate() === day
  );
}

function nextCalendarDate(date: CalendarDate): CalendarDate {
  const next = calendarDateForFormatting(date);
  next.setUTCDate(next.getUTCDate() + 1);
  return toCalendarDate(
    next.getUTCFullYear(),
    next.getUTCMonth() + 1,
    next.getUTCDate(),
  );
}

/**
 * A stay occupies arrival and every following night before departure.
 * Departure is intentionally exclusive, so it may coincide with a later block.
 */
export function isStayRangeAvailable(
  arrival: CalendarDate,
  departure: CalendarDate,
  today: CalendarDate,
  data: AvailabilityData,
) {
  if (departure <= arrival) return false;

  for (let date = arrival; date < departure; date = nextCalendarDate(date)) {
    if (getDayStatus(date, today, data) !== "available") return false;
  }

  return true;
}

export type StaySelectionResult = {
  invalidRange: boolean;
  selection: StayDateSelection;
};

export function selectStayDate(
  selection: StayDateSelection,
  date: CalendarDate,
  today: CalendarDate,
  data: AvailabilityData,
): StaySelectionResult {
  const arrival = isCalendarDate(selection.arrival)
    ? selection.arrival
    : null;

  if (arrival && !selection.departure && date > arrival) {
    return isStayRangeAvailable(arrival, date, today, data)
      ? {invalidRange: false, selection: {arrival, departure: date}}
      : {invalidRange: true, selection};
  }

  if (getDayStatus(date, today, data) === "available") {
    return {
      invalidRange: false,
      selection: {arrival: date, departure: ""},
    };
  }

  return {invalidRange: false, selection};
}

export function getRomeToday(now = new Date()): CalendarDate {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const part = (type: string) => Number(parts.find((item) => item.type === type)?.value);
  return toCalendarDate(part("year"), part("month"), part("day"));
}
