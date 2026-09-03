import type {AvailabilityData} from "./availability-dates";

/**
 * Local, owner-maintained source; replace this object with a provider adapter later.
 * No availability has been supplied yet. Do not interpret an empty block list as
 * all dates being free: only dates inside reviewedRange may be labelled available.
 * All ranges use inclusive YYYY-MM-DD boundaries. Never include guest details.
 */
export const accommodationAvailability: AvailabilityData = {
  reviewedRange: null,
  unavailableRanges: [],
};
