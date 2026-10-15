import type {
  AvailabilityData,
  CalendarDate,
  DayStatus,
  StayDateSelection,
} from "./availability-dates";
import {
  getDayStatus,
  isCalendarDate,
  isStayRangeAvailable,
} from "./availability-dates";

type DateLabelKey =
  | DayStatus
  | "departure"
  | "inRange"
  | "selectedArrival"
  | "selectedDeparture";

type AvailabilityCalendarDayProps = {
  data: AvailabilityData;
  date: CalendarDate;
  getDateLabel: (key: DateLabelKey) => string;
  index: number;
  onSelect: (date: CalendarDate) => void;
  selection: StayDateSelection;
  today: CalendarDate;
  weekCells: readonly (CalendarDate | null)[];
};

const stateStyles: Record<DayStatus, string> = {
  available: "text-page-text-strong",
  unavailable:
    "rounded-full bg-[color-mix(in_srgb,var(--trb-lake)_6%,transparent)] text-page-muted line-through decoration-1",
  unknown: "text-page-muted",
  past: "text-[color-mix(in_srgb,var(--trb-lake)_38%,transparent)]",
};

export function AvailabilityCalendarDay({
  data,
  date,
  getDateLabel,
  index,
  onSelect,
  selection,
  today,
  weekCells,
}: AvailabilityCalendarDayProps) {
  const status = getDayStatus(date, today, data);
  const arrival = isCalendarDate(selection.arrival) ? selection.arrival : null;
  const departure = isCalendarDate(selection.departure)
    ? selection.departure
    : null;
  const isArrival = date === arrival;
  const isDeparture = date === departure;
  const hasValidRange = Boolean(
    arrival &&
      departure &&
      isStayRangeAvailable(arrival, departure, today, data),
  );
  const isInRange = Boolean(
    hasValidRange && arrival && departure && date > arrival && date < departure,
  );
  const isInSelectedBand = Boolean(
    hasValidRange && arrival && departure && date >= arrival && date <= departure,
  );
  const bandStartsHere = Boolean(
    isInSelectedBand && (isArrival || index === 0 || !weekCells[index - 1]),
  );
  const bandEndsHere = Boolean(
    isInSelectedBand &&
      (isDeparture || index === weekCells.length - 1 || !weekCells[index + 1]),
  );
  const canBeDeparture = Boolean(
    arrival &&
      !departure &&
      date > arrival &&
      isStayRangeAvailable(arrival, date, today, data),
  );
  const isSelectable = status === "available" || canBeDeparture;
  const labelKey: DateLabelKey = isArrival
    ? "selectedArrival"
    : isDeparture
      ? "selectedDeparture"
      : isInRange
        ? "inRange"
        : canBeDeparture && status !== "available"
          ? "departure"
          : status;
  const endpoint = isArrival || isDeparture;
  const dayClass = isInSelectedBand
    ? "text-[color:var(--trb-sand)]"
    : endpoint
      ? "rounded-full bg-[var(--trb-lagoon)] text-[color:var(--trb-sand)]"
      : stateStyles[status];

  return (
    <td
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
          aria-label={getDateLabel(labelKey)}
          aria-pressed={endpoint}
          onClick={() => onSelect(date)}
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
          <span className="sr-only">{getDateLabel(labelKey)}</span>
        </span>
      )}
    </td>
  );
}
