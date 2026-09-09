"use client";

import {useId, useSyncExternalStore} from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";

import {
  type AvailabilityData,
  type CalendarDate,
  type DayStatus,
  type StayDateSelection,
  VISIBLE_MONTH_COUNT,
  calendarDateForFormatting,
  getDayStatus,
  getRomeToday,
  isCalendarDate,
  isStayRangeAvailable,
  monthAtOffset,
  monthCells,
  selectStayDate,
  toCalendarDate,
} from "./availability-dates";

type AvailabilityCalendarProps = {
  data: AvailabilityData;
  monthOffset: number;
  onInvalidRange: () => void;
  onMonthOffsetChange: (offset: number) => void;
  onSelectionChange: (selection: StayDateSelection) => void;
  selection: StayDateSelection;
  showRangeError: boolean;
};

function subscribeToDateChange(notify: () => void) {
  const interval = window.setInterval(notify, 60_000);
  document.addEventListener("visibilitychange", notify);
  return () => {
    window.clearInterval(interval);
    document.removeEventListener("visibilitychange", notify);
  };
}

const readToday = () => getRomeToday();
const serverToday = () => null;

const stateStyles: Record<DayStatus, string> = {
  available: "text-page-text-strong",
  unavailable:
    "rounded-full bg-[color-mix(in_srgb,var(--trb-lake)_6%,transparent)] text-page-muted line-through decoration-1",
  unknown: "text-page-muted",
  past: "text-[color-mix(in_srgb,var(--trb-lake)_38%,transparent)]",
};

const navigationStyle =
  "flex size-11 items-center justify-center text-page-accent transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--trb-lagoon)] disabled:cursor-default disabled:opacity-25 motion-reduce:transition-none lg:size-10";

export function AvailabilityCalendar({
  data,
  monthOffset,
  onInvalidRange,
  onMonthOffsetChange,
  onSelectionChange,
  selection,
  showRangeError,
}: AvailabilityCalendarProps) {
  const t = useTranslations("Availability");
  const locale = useLocale();
  const formatLocale = locale === "en" ? "en-GB" : locale;
  const id = useId();
  const today = useSyncExternalStore(
    subscribeToDateChange,
    readToday,
    serverToday,
  );
  const month = today ? monthAtOffset(today, monthOffset) : null;
  const cells = month ? monthCells(month) : Array<null>(42).fill(null);
  const monthLabel = month
    ? new Intl.DateTimeFormat(formatLocale, {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(
        calendarDateForFormatting(toCalendarDate(month.year, month.month, 1)),
      )
    : t("loading");
  const fullDate = new Intl.DateTimeFormat(formatLocale, {
    dateStyle: "full",
    timeZone: "UTC",
  });
  const weekdayShort = new Intl.DateTimeFormat(formatLocale, {
    weekday: "short",
    timeZone: "UTC",
  });
  const weekdayFull = new Intl.DateTimeFormat(formatLocale, {
    weekday: "long",
    timeZone: "UTC",
  });
  const weekdays = Array.from({length: 7}, (_, index) =>
    calendarDateForFormatting(toCalendarDate(2024, 1, index + 1)),
  );

  const handleDateSelection = (date: CalendarDate) => {
    if (!today) return;
    const result = selectStayDate(selection, date, today, data);
    if (result.invalidRange) onInvalidRange();
    else onSelectionChange(result.selection);
  };

  return (
    <section
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-disclaimer`}
      className="contents"
      data-availability-calendar
    >
      <div className="w-full max-w-lg border-t border-page-border pt-6 lg:col-start-1 lg:row-start-1 lg:pt-5">
        <h3
          id={`${id}-title`}
          className="text-xs uppercase tracking-[0.18em] text-page-accent"
        >
          {t("title")}
        </h3>
        <div className="mb-4 mt-3 flex min-h-11 items-center justify-between gap-2 lg:mb-3 lg:mt-2 lg:min-h-10">
          <p
            aria-live="polite"
            aria-atomic="true"
            className="font-display text-[1.75rem] capitalize leading-none text-page-text-strong sm:text-[1.875rem]"
          >
            {monthLabel}
          </p>
          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              aria-label={t("previousMonth")}
              disabled={!today || monthOffset === 0}
              onClick={() => onMonthOffsetChange(Math.max(0, monthOffset - 1))}
              className={navigationStyle}
            >
              <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={t("nextMonth")}
              disabled={!today || monthOffset === VISIBLE_MONTH_COUNT - 1}
              onClick={() =>
                onMonthOffsetChange(
                  Math.min(VISIBLE_MONTH_COUNT - 1, monthOffset + 1),
                )
              }
              className={navigationStyle}
            >
              <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>
        <table
          className="w-full table-fixed border-collapse text-center text-sm"
          aria-busy={!today}
        >
        <caption className="sr-only">
          {t("title")} — {monthLabel}
        </caption>
        <thead>
          <tr>
            {weekdays.map((date) => (
              <th
                key={date.getUTCDate()}
                scope="col"
                className="pb-2 text-[0.8125rem] font-normal text-page-muted"
              >
                <abbr title={weekdayFull.format(date)} className="no-underline">
                  {weekdayShort.format(date)}
                </abbr>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({length: 6}, (_, week) => {
            const weekCells = cells.slice(week * 7, week * 7 + 7);

            return (
              <tr key={week} className="h-[3.25rem] lg:h-10">
                {weekCells.map((date, index) => {
                const status = date && today ? getDayStatus(date, today, data) : null;
                if (!date || !status) {
                  return (
                    <td key={date ?? `empty-${index}`} className="p-0.5 lg:p-0">
                      <span aria-hidden="true" className="block h-11 lg:h-10" />
                    </td>
                  );
                }

                const arrival = isCalendarDate(selection.arrival)
                  ? selection.arrival
                  : null;
                const departure = isCalendarDate(selection.departure)
                  ? selection.departure
                  : null;
                const isArrival = date === arrival;
                const isDeparture = date === departure;
                const hasValidRange = Boolean(
                  today &&
                    arrival &&
                    departure &&
                    isStayRangeAvailable(arrival, departure, today, data),
                );
                const isInRange = Boolean(
                  hasValidRange &&
                    arrival &&
                    departure &&
                    date > arrival &&
                    date < departure,
                );
                const isInSelectedBand = Boolean(
                  hasValidRange &&
                    arrival &&
                    departure &&
                    date >= arrival &&
                    date <= departure,
                );
                const bandStartsHere = Boolean(
                  isInSelectedBand &&
                    (isArrival || index === 0 || !weekCells[index - 1]),
                );
                const bandEndsHere = Boolean(
                  isInSelectedBand &&
                    (isDeparture ||
                      index === weekCells.length - 1 ||
                      !weekCells[index + 1]),
                );
                const canBeDeparture = Boolean(
                  today &&
                    arrival &&
                    !departure &&
                    date > arrival &&
                    isStayRangeAvailable(arrival, date, today, data),
                );
                const isSelectable = status === "available" || canBeDeparture;
                const formattedDate = fullDate.format(
                  calendarDateForFormatting(date),
                );
                const labelKey = isArrival
                  ? "selectedArrival"
                  : isDeparture
                    ? "selectedDeparture"
                    : isInRange
                      ? "inRange"
                      : canBeDeparture && status !== "available"
                        ? "departure"
                        : status;
                const dateLabel = t(`dateLabels.${labelKey}`, {
                  date: formattedDate,
                });
                const endpoint = isArrival || isDeparture;
                const dayClass = isInSelectedBand
                  ? "text-[color:var(--trb-sand)]"
                  : endpoint
                    ? "rounded-full bg-[var(--trb-lagoon)] text-[color:var(--trb-sand)]"
                    : stateStyles[status];

                return (
                  <td
                    key={date}
                    className="relative p-0.5 align-middle [--availability-day-size:2.75rem] lg:p-0 lg:[--availability-day-size:2.5rem]"
                  >
                    {isInSelectedBand ? (
                      <span
                        aria-hidden="true"
                        style={{
                          left: isArrival
                            ? "calc(50% - var(--availability-day-size) / 2)"
                            : 0,
                          right: isDeparture
                            ? "calc(50% - var(--availability-day-size) / 2)"
                            : 0,
                        }}
                        className={`pointer-events-none absolute top-1/2 z-0 h-[var(--availability-day-size)] -translate-y-1/2 bg-[var(--trb-lagoon)] ${
                          bandStartsHere ? "rounded-l-full" : ""
                        } ${bandEndsHere ? "rounded-r-full" : ""}`}
                      />
                    ) : null}
                    {isSelectable ? (
                      <button
                        type="button"
                        data-date={date}
                        data-status={status}
                        data-range-role={
                          isArrival
                            ? "arrival"
                            : isDeparture
                              ? "departure"
                              : isInRange
                                ? "range"
                                : undefined
                        }
                        aria-label={dateLabel}
                        aria-pressed={endpoint}
                        onClick={() => handleDateSelection(date)}
                        style={
                          endpoint || isInSelectedBand
                            ? {color: "var(--trb-sand)"}
                            : undefined
                        }
                        className={`relative z-10 mx-auto flex size-[var(--availability-day-size)] items-center justify-center text-sm transition-colors focus-visible:rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--trb-lagoon)] ${
                          endpoint || isInSelectedBand
                            ? ""
                            : "hover:rounded-full hover:bg-[color-mix(in_srgb,var(--trb-lagoon)_9%,transparent)]"
                        } ${dayClass}`}
                      >
                        <time dateTime={date} aria-hidden="true">
                          <span
                            className={
                              date === today
                                ? "underline decoration-[var(--trb-lagoon)] underline-offset-4"
                                : undefined
                            }
                          >
                            {Number(date.slice(-2))}
                          </span>
                        </time>
                      </button>
                    ) : (
                      <span
                        data-date={date}
                        data-status={status}
                        style={
                          endpoint || isInSelectedBand
                            ? {color: "var(--trb-sand)"}
                            : undefined
                        }
                        className={`relative z-10 mx-auto flex size-10 items-center justify-center text-sm ${dayClass}`}
                      >
                        <time dateTime={date} aria-hidden="true">
                          {Number(date.slice(-2))}
                        </time>
                        <span className="sr-only">{dateLabel}</span>
                      </span>
                    )}
                  </td>
                );
                })}
              </tr>
            );
          })}
        </tbody>
        </table>
      </div>
      <div className="w-full max-w-lg lg:col-start-1 lg:row-start-2">
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs leading-5 text-page-muted">
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-page-accent" />
          {t("states.available")}
        </li>
        <li className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-3 rounded-full border border-page-muted bg-[color-mix(in_srgb,var(--trb-lake)_6%,transparent)]"
          />
          {t("states.unavailable")}
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="size-3 rounded-full border border-dotted border-page-muted" />
          {t("states.unknown")}
        </li>
        </ul>
        {showRangeError ? (
        <p
          id="availability-range-error"
          role="status"
          className="mt-4 text-sm leading-6 text-[var(--trb-walnut)]"
        >
          {t("rangeUnavailable")}
        </p>
        ) : null}
        {!data.reviewedRange ? (
        <p className="mt-4 text-sm leading-6 text-page-muted">
          {t("notPublished")}
        </p>
        ) : null}
        <p id={`${id}-disclaimer`} className="mt-3 text-xs leading-5 text-page-muted">
          {t("disclaimer")}
        </p>
        <noscript>
          <p className="mt-3 text-sm text-page-muted">{t("withoutJavaScript")}</p>
        </noscript>
      </div>
    </section>
  );
}
