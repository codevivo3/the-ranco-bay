"use client";

import {useState} from "react";
import {useTranslations} from "next-intl";

import {ContactEnquiryForm} from "@/features/contact/contact-enquiry-form";

import {AvailabilityCalendar} from "./availability-calendar";
import {apartmentIds, apartments, type ApartmentId} from "./apartments";
import {
  getDayStatus,
  getRomeToday,
  isCalendarDate,
  isStayRangeAvailable,
  monthOffsetForDate,
  type AvailabilityData,
  type StayDateSelection,
  VISIBLE_MONTH_COUNT,
} from "./availability-dates";

type AvailabilityEnquiryProps = {
  data: AvailabilityData;
  initialApartment?: ApartmentId;
  locale: string;
};

export function AvailabilityEnquiry({
  data,
  initialApartment = 'ground-floor',
  locale,
}: AvailabilityEnquiryProps) {
  const t = useTranslations('Availability');
  const [apartmentId, setApartmentId] = useState<ApartmentId>(initialApartment);
  const [selection, setSelection] = useState<StayDateSelection>({
    arrival: "",
    departure: "",
  });
  const [rangeRejected, setRangeRejected] = useState(false);
  const [monthOffset, setMonthOffset] = useState(0);
  const today = getRomeToday();
  const arrivalIsUnavailable =
    isCalendarDate(selection.arrival) &&
    getDayStatus(selection.arrival, today, data) !== "available";

  const hasUnavailableNight =
    isCalendarDate(selection.arrival) &&
    isCalendarDate(selection.departure) &&
    selection.departure > selection.arrival &&
    !isStayRangeAvailable(
      selection.arrival,
      selection.departure,
      today,
      data,
    );
  const hasUnavailableSelection =
    arrivalIsUnavailable || hasUnavailableNight;
  const showRangeError = rangeRejected || hasUnavailableSelection;

  const updateSelection = (nextSelection: StayDateSelection) => {
    setSelection(nextSelection);
    setRangeRejected(false);
  };

  const updateDateField = (
    field: keyof StayDateSelection,
    value: string,
  ) => {
    setSelection((current) => ({...current, [field]: value}));
    setRangeRejected(false);
    if (isCalendarDate(value)) {
      const nextOffset = monthOffsetForDate(today, value);
      if (nextOffset >= 0 && nextOffset < VISIBLE_MONTH_COUNT) {
        setMonthOffset(nextOffset);
      }
    }
  };

  const validateStay = () => {
    if (apartmentId === 'upper-floor') return true;
    if (!hasUnavailableSelection) return true;
    setRangeRejected(true);
    return false;
  };

  return (
    <div className="mt-12 lg:mt-[clamp(2rem,3.5svh,2.5rem)]">
      <div
        className='grid w-full max-w-lg grid-cols-2 gap-1 rounded-lg bg-[color-mix(in_srgb,var(--trb-lagoon)_4%,transparent)] p-1'
        aria-label={t('apartmentPickerLabel')}
      >
        {apartmentIds.map((id) => {
          const active = apartmentId === id;
          const translationKey = apartments[id].translationKey;

          return (
            <button
              key={id}
              type='button'
              aria-pressed={active}
              onClick={() => setApartmentId(id)}
              className={`min-h-11 rounded-md border-b-2 px-3 py-2 text-sm transition-[color,background-color,border-color] duration-200 ease-out motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-page-focus ${
                active
                  ? 'border-[var(--trb-lagoon)] bg-[color-mix(in_srgb,var(--trb-lagoon)_12%,transparent)] font-medium text-page-text-strong'
                  : 'border-transparent bg-transparent text-page-muted hover:bg-[color-mix(in_srgb,var(--trb-lagoon)_7%,transparent)] hover:text-page-accent'
              }`}
            >
              {t(`apartments.${translationKey}.label`)}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid items-start gap-x-12 gap-y-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-x-20 lg:gap-y-[clamp(1.5rem,3svh,2rem)]">
        {apartmentId === 'ground-floor' ? (
          <AvailabilityCalendar
            data={data}
            monthOffset={monthOffset}
            onMonthOffsetChange={setMonthOffset}
            selection={selection}
            onInvalidRange={() => setRangeRejected(true)}
            onSelectionChange={updateSelection}
            showRangeError={showRangeError}
          />
        ) : (
          <section className='w-full max-w-lg border-y border-page-border py-8 lg:row-span-2'>
            <p className='text-xs uppercase tracking-[0.18em] text-page-accent'>
              {t('apartments.upperFloor.status')}
            </p>
            <h3 className='mt-4 font-display text-[clamp(2rem,4vw,3.5rem)] leading-none text-page-text-strong'>
              {t('apartments.upperFloor.title')}
            </h3>
            <p className='mt-5 max-w-md text-base leading-7 text-page-muted'>
              {t('apartments.upperFloor.body')}
            </p>
          </section>
        )}
        <ContactEnquiryForm
          key={apartmentId}
          apartmentId={apartmentId}
          apartmentLabel={t(`apartments.${apartments[apartmentId].translationKey}.label`)}
          arrival={apartmentId === 'ground-floor' ? selection.arrival : ''}
          datesEnabled={apartmentId === 'ground-floor'}
          departure={apartmentId === 'ground-floor' ? selection.departure : ''}
          locale={locale}
          onDateChange={updateDateField}
          onValidateStay={validateStay}
          stayRangeInvalid={apartmentId === 'ground-floor' && showRangeError}
        />
      </div>
    </div>
  );
}
