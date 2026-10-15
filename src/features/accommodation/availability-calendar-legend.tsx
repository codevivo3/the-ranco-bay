import type {AvailabilityData} from "./availability-dates";

type AvailabilityCalendarLegendProps = {
  availableLabel: string;
  data: AvailabilityData;
  disclaimer: string;
  id: string;
  notPublished: string;
  rangeUnavailable: string;
  showRangeError: boolean;
  unavailableLabel: string;
  unknownLabel: string;
  withoutJavaScript: string;
};

export function AvailabilityCalendarLegend({
  availableLabel,
  data,
  disclaimer,
  id,
  notPublished,
  rangeUnavailable,
  showRangeError,
  unavailableLabel,
  unknownLabel,
  withoutJavaScript,
}: AvailabilityCalendarLegendProps) {
  return (
    <div className="w-full max-w-lg md:mx-auto lg:mx-0 lg:col-start-1 lg:row-start-2">
      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs leading-5 text-page-muted">
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-page-accent" />
          {availableLabel}
        </li>
        <li className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-3 rounded-full border border-page-muted bg-[color-mix(in_srgb,var(--trb-lake)_6%,transparent)]"
          />
          {unavailableLabel}
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="size-3 rounded-full border border-dotted border-page-muted" />
          {unknownLabel}
        </li>
      </ul>
      {showRangeError ? (
        <p
          id="availability-range-error"
          role="status"
          className="mt-4 text-sm leading-6 text-[var(--trb-walnut)]"
        >
          {rangeUnavailable}
        </p>
      ) : null}
      {!data.reviewedRange ? (
        <p className="mt-4 text-sm leading-6 text-page-muted">
          {notPublished}
        </p>
      ) : null}
      <p id={id} className="mt-3 text-xs leading-5 text-page-muted">
        {disclaimer}
      </p>
      <noscript>
        <p className="mt-3 text-sm text-page-muted">{withoutJavaScript}</p>
      </noscript>
    </div>
  );
}
