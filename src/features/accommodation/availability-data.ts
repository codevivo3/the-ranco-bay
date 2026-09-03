import type {AvailabilityData} from "./availability-dates";

/**
 * Local owner-reviewed window and additional manual blocks, merged by the server
 * Booking.com adapter. Feed events alone do not establish a reviewed window.
 * No availability has been supplied yet. Do not interpret an empty block list as
 * all dates being free: only dates inside reviewedRange may be labelled available.
 * All ranges use inclusive YYYY-MM-DD boundaries. Never include guest details.
 */
export const accommodationAvailability: AvailabilityData = {
  reviewedRange: null,
  unavailableRanges: [],
};
