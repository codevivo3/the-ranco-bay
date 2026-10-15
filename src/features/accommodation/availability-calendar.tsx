"use client";

import {useId, useSyncExternalStore} from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";

import {
  type AvailabilityData,
  type CalendarDate,
  type StayDateSelection,
  VISIBLE_MONTH_COUNT,
  calendarDateForFormatting,
  getRomeToday,
  monthAtOffset,
  monthCells,
  selectStayDate,
  toCalendarDate,
} from "./availability-dates";
import {AvailabilityCalendarDay} from "./availability-calendar-day";
import {AvailabilityCalendarLegend} from "./availability-calendar-legend";

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
      <div className="w-full max-w-lg border-t border-page-border pt-6 md:mx-auto lg:mx-0 lg:col-start-1 lg:row-start-1 lg:pt-5">
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
                if (!date || !today) {
                  return (
                    <td key={date ?? `empty-${index}`} className="p-0.5 lg:p-0">
                      <span aria-hidden="true" className="block h-11 lg:h-10" />
                    </td>
                  );
                }

                return (
                  <AvailabilityCalendarDay
                    key={date}
                    data={data}
                    date={date}
                    getDateLabel={(key) =>
                      t(`dateLabels.${key}`, {
                        date: fullDate.format(
                          calendarDateForFormatting(date),
                        ),
                      })
                    }
                    index={index}
                    onSelect={handleDateSelection}
                    selection={selection}
                    today={today}
                    weekCells={weekCells}
                  />
                );
                })}
              </tr>
            );
          })}
        </tbody>
        </table>
      </div>
      <AvailabilityCalendarLegend
        availableLabel={t("states.available")}
        data={data}
        disclaimer={t("disclaimer")}
        id={`${id}-disclaimer`}
        notPublished={t("notPublished")}
        rangeUnavailable={t("rangeUnavailable")}
        showRangeError={showRangeError}
        unavailableLabel={t("states.unavailable")}
        unknownLabel={t("states.unknown")}
        withoutJavaScript={t("withoutJavaScript")}
      />
    </section>
  );
}
