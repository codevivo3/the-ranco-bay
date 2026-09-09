"use client";

import {useState} from "react";

import {ContactEnquiryForm} from "@/features/contact/contact-enquiry-form";

import {AvailabilityCalendar} from "./availability-calendar";
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
  locale: string;
};

export function AvailabilityEnquiry({data, locale}: AvailabilityEnquiryProps) {
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
    if (!hasUnavailableSelection) return true;
    setRangeRejected(true);
    return false;
  };

  return (
    <div className="mt-12 grid items-start gap-x-12 gap-y-8 lg:mt-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-x-20 lg:gap-y-4">
      <AvailabilityCalendar
        data={data}
        monthOffset={monthOffset}
        onMonthOffsetChange={setMonthOffset}
        selection={selection}
        onInvalidRange={() => setRangeRejected(true)}
        onSelectionChange={updateSelection}
        showRangeError={showRangeError}
      />
      <ContactEnquiryForm
        arrival={selection.arrival}
        departure={selection.departure}
        locale={locale}
        onDateChange={updateDateField}
        onValidateStay={validateStay}
        stayRangeInvalid={showRangeError}
      />
    </div>
  );
}
