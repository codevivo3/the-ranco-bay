"use client";

import {useId, useState, useSyncExternalStore} from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";

import {
  type AvailabilityData,
  type DayStatus,
  VISIBLE_MONTH_COUNT,
  calendarDateForFormatting,
  getDayStatus,
  getRomeToday,
  monthAtOffset,
  monthCells,
  toCalendarDate,
} from "./availability-dates";

function subscribeToDateChange(notify: () => void) {
  const interval = window.setInterval(notify, 60_000);
  document.addEventListener("visibilitychange", notify);
  return () => {
    window.clearInterval(interval);
    document.removeEventListener("visibilitychange", notify);
  };
}

// Static pages must not freeze "today" at build time or mismatch during hydration.
const readToday = () => getRomeToday();
const serverToday = () => null;

const dayStyles: Record<DayStatus, string> = {
  available: "text-page-text-strong",
  unavailable: "bg-[color-mix(in_srgb,var(--trb-lake)_7%,transparent)] text-page-muted line-through decoration-1",
  unknown: "text-page-muted",
  past: "text-[color-mix(in_srgb,var(--trb-lake)_40%,transparent)]",
};

const navigationStyle =
  "flex size-11 items-center justify-center text-page-accent transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--trb-lagoon)] disabled:cursor-default disabled:opacity-25 motion-reduce:transition-none";

export function AvailabilityCalendar({data}: {data: AvailabilityData}) {
  const t = useTranslations("Availability");
  const locale = useLocale();
  const formatLocale = locale === "en" ? "en-GB" : locale;
  const id = useId();
  const today = useSyncExternalStore(subscribeToDateChange, readToday, serverToday);
  const [monthOffset, setMonthOffset] = useState(0);
  const month = today ? monthAtOffset(today, monthOffset) : null;
  const cells = month ? monthCells(month) : Array<null>(42).fill(null);
  const monthLabel = month
    ? new Intl.DateTimeFormat(formatLocale, {month: "long", year: "numeric", timeZone: "UTC"})
        .format(calendarDateForFormatting(toCalendarDate(month.year, month.month, 1)))
    : t("loading");
  const fullDate = new Intl.DateTimeFormat(formatLocale, {dateStyle: "full", timeZone: "UTC"});
  const weekdayShort = new Intl.DateTimeFormat(formatLocale, {weekday: "short", timeZone: "UTC"});
  const weekdayFull = new Intl.DateTimeFormat(formatLocale, {weekday: "long", timeZone: "UTC"});
  const weekdays = Array.from({length: 7}, (_, index) =>
    calendarDateForFormatting(toCalendarDate(2024, 1, index + 1)), // 1 January 2024 was Monday.
  );

  return (
    <section
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-disclaimer`}
      className="w-full max-w-lg border-y border-page-border py-6"
      data-availability-calendar
    >
      <h3 id={`${id}-title`} className="text-xs uppercase tracking-[0.18em] text-page-accent">
        {t("title")}
      </h3>
      <div className="mb-4 mt-3 flex min-h-11 items-center justify-between gap-2">
        <p aria-live="polite" aria-atomic="true" className="font-display text-2xl capitalize text-page-text-strong sm:text-3xl">
          {monthLabel}
        </p>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            aria-label={t("previousMonth")}
            disabled={!today || monthOffset === 0}
            onClick={() => setMonthOffset((offset) => Math.max(0, offset - 1))}
            className={navigationStyle}
          >
            <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={t("nextMonth")}
            disabled={!today || monthOffset === VISIBLE_MONTH_COUNT - 1}
            onClick={() => setMonthOffset((offset) => Math.min(VISIBLE_MONTH_COUNT - 1, offset + 1))}
            className={navigationStyle}
          >
            <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>
      <table className="w-full table-fixed border-collapse text-center text-sm" aria-busy={!today}>
        <caption className="sr-only">{t("title")} — {monthLabel}</caption>
        <thead>
          <tr>
            {weekdays.map((date) => (
              <th key={date.getUTCDate()} scope="col" className="pb-2 text-xs font-normal text-page-muted">
                <abbr title={weekdayFull.format(date)} className="no-underline">{weekdayShort.format(date)}</abbr>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({length: 6}, (_, week) => (
            <tr key={week}>
              {cells.slice(week * 7, week * 7 + 7).map((date, index) => {
                const status = date && today ? getDayStatus(date, today, data) : null;
                return (
                  <td key={date ?? `empty-${index}`} className="p-0.5 align-middle">
                    {date && status ? (
                      <span
                        data-date={date}
                        data-status={status}
                        className={`relative flex h-10 items-center justify-center sm:h-11 ${dayStyles[status]}`}
                      >
                        <time dateTime={date} aria-current={date === today ? "date" : undefined}>
                          <span aria-hidden="true" className={date === today ? "underline decoration-[var(--trb-lagoon)] underline-offset-4" : undefined}>
                            {Number(date.slice(-2))}
                          </span>
                          <span className="sr-only">
                            {fullDate.format(calendarDateForFormatting(date))} — {t(`states.${status}`)}{date === today ? ` — ${t("today")}` : ""}
                          </span>
                        </time>
                        {status === "available" && <span aria-hidden="true" className="absolute bottom-1 size-1 rounded-full bg-page-accent" />}
                      </span>
                    ) : <span aria-hidden="true" className="block h-10 sm:h-11" />}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs leading-5 text-page-muted">
        <li className="flex items-center gap-2"><span aria-hidden="true" className="size-1 rounded-full bg-page-accent" />{t("states.available")}</li>
        <li className="flex items-center gap-2"><span aria-hidden="true" className="h-px w-3 bg-page-muted" />{t("states.unavailable")}</li>
        <li>{t("states.unknown")}</li>
      </ul>
      {!data.reviewedRange && data.unavailableRanges.length === 0 && <p className="mt-4 text-sm leading-6 text-page-muted">{t("notPublished")}</p>}
      <p id={`${id}-disclaimer`} className="mt-3 text-xs leading-5 text-page-muted">{t("disclaimer")}</p>
      <noscript><p className="mt-3 text-sm text-page-muted">{t("withoutJavaScript")}</p></noscript>
    </section>
  );
}
