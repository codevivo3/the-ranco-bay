import {routing} from "@/i18n/routing";

export const CONTACT_LIMITS = {
  email: 254,
  message: 4000,
  name: 120,
} as const;

export type ContactField =
  | "arrival"
  | "departure"
  | "email"
  | "message"
  | "name";

export type ContactValidationCode =
  | "dateOrder"
  | "invalidDate"
  | "invalidEmail"
  | "required"
  | "tooLong";

export type ContactFieldErrors = Partial<
  Record<ContactField, ContactValidationCode>
>;

export type ContactEnquiry = {
  arrival: string;
  departure: string;
  email: string;
  locale: string;
  message: string;
  name: string;
  submissionId: string;
};

export type ContactApiResponse =
  | {ok: true}
  | {
      fieldErrors?: ContactFieldErrors;
      ok: false;
      reason: "rateLimit" | "server" | "validation";
    };

type ContactValidationResult =
  | {data: ContactEnquiry; success: true}
  | {fieldErrors: ContactFieldErrors; success: false};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function readString(input: Record<string, unknown>, key: string) {
  const value = input[key];
  return typeof value === "string" ? value.trim() : "";
}

function isValidIsoDate(value: string) {
  if (!ISO_DATE_PATTERN.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

export function validateContactEnquiry(
  input: unknown,
): ContactValidationResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {fieldErrors: {}, success: false};
  }

  const record = input as Record<string, unknown>;
  const data: ContactEnquiry = {
    arrival: readString(record, "arrival"),
    departure: readString(record, "departure"),
    email: readString(record, "email").toLowerCase(),
    locale: readString(record, "locale"),
    message: readString(record, "message"),
    name: readString(record, "name"),
    submissionId: readString(record, "submissionId"),
  };
  const fieldErrors: ContactFieldErrors = {};

  if (!data.name) fieldErrors.name = "required";
  else if (data.name.length > CONTACT_LIMITS.name) {
    fieldErrors.name = "tooLong";
  }

  if (!data.email) fieldErrors.email = "required";
  else if (data.email.length > CONTACT_LIMITS.email) {
    fieldErrors.email = "tooLong";
  } else if (!EMAIL_PATTERN.test(data.email)) {
    fieldErrors.email = "invalidEmail";
  }

  if (!data.message) fieldErrors.message = "required";
  else if (data.message.length > CONTACT_LIMITS.message) {
    fieldErrors.message = "tooLong";
  }

  if (data.arrival && !isValidIsoDate(data.arrival)) {
    fieldErrors.arrival = "invalidDate";
  }
  if (data.departure && !isValidIsoDate(data.departure)) {
    fieldErrors.departure = "invalidDate";
  } else if (
    data.arrival &&
    data.departure &&
    !fieldErrors.arrival &&
    data.departure < data.arrival
  ) {
    fieldErrors.departure = "dateOrder";
  }

  const validLocale = routing.locales.some((locale) => locale === data.locale);
  const validSubmissionId = UUID_PATTERN.test(data.submissionId);

  if (
    Object.keys(fieldErrors).length > 0 ||
    !validLocale ||
    !validSubmissionId
  ) {
    return {fieldErrors, success: false};
  }

  return {data, success: true};
}

export function hasContactHoneypot(input: unknown) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return false;
  const value = (input as Record<string, unknown>).contactNote;
  return typeof value === "string" && value.trim().length > 0;
}
