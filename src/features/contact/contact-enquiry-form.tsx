"use client";

import {useRef, useState, type FormEvent} from "react";
import {useTranslations} from "next-intl";

import {
  CONTACT_LIMITS,
  type ContactApiResponse,
  type ContactField,
  type ContactFieldErrors,
  type ContactValidationCode,
  validateContactEnquiry,
} from "@/features/contact/contact-enquiry";
import {TrbButton} from "@/components/ui/trb-button";

type ContactEnquiryFormProps = {
  arrival: string;
  departure: string;
  locale: string;
  onDateChange: (
    field: "arrival" | "departure",
    value: string,
  ) => void;
  onValidateStay: () => boolean;
  stayRangeInvalid: boolean;
};

type FormStatus = "error" | "idle" | "rateLimit" | "sending" | "success";

const inputClasses =
  "mt-2 block w-full border-b border-[color-mix(in_srgb,var(--trb-lake)_32%,transparent)] bg-transparent px-0 py-2.5 lg:mt-1.5 lg:py-1.5 " +
  "outline-none transition-colors focus:border-[var(--trb-lagoon)] " +
  "disabled:cursor-wait disabled:opacity-60";

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function createSubmissionId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const value = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");

  return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`;
}

export function ContactEnquiryForm({
  arrival,
  departure,
  locale,
  onDateChange,
  onValidateStay,
  stayRangeInvalid,
}: ContactEnquiryFormProps) {
  const t = useTranslations("Contact.enquiry");
  const formRef = useRef<HTMLFormElement>(null);
  const submissionIdRef = useRef<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const isSending = status === "sending";

  const getValidationMessage = (
    field: ContactField,
    code: ContactValidationCode,
  ) => {
    if (code === "required") {
      if (field === "name") return t("validation.nameRequired");
      if (field === "email") return t("validation.emailRequired");
      return t("validation.messageRequired");
    }
    if (code === "invalidEmail") return t("validation.emailInvalid");
    if (code === "invalidDate") return t("validation.dateInvalid");
    if (code === "dateOrder") return t("validation.dateOrder");
    if (field === "name") return t("validation.nameTooLong");
    if (field === "email") return t("validation.emailTooLong");
    return t("validation.messageTooLong");
  };

  const errorFor = (field: ContactField) => {
    const code = fieldErrors[field];
    return code ? getValidationMessage(field, code) : null;
  };

  const resetSubmissionState = () => {
    submissionIdRef.current = null;
    if (status !== "idle" && status !== "sending") setStatus("idle");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSending) return;
    if (!onValidateStay()) {
      setStatus("idle");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const submissionId = submissionIdRef.current ?? createSubmissionId();
    submissionIdRef.current = submissionId;

    const payload = {
      arrival: readFormValue(formData, "arrival"),
      departure: readFormValue(formData, "departure"),
      email: readFormValue(formData, "email"),
      locale,
      message: readFormValue(formData, "message"),
      name: readFormValue(formData, "name"),
      submissionId,
      contactNote: readFormValue(formData, "contactNote"),
    };
    const validation = validateContactEnquiry(payload);

    if (!validation.success) {
      setFieldErrors(validation.fieldErrors);
      setStatus("error");
      return;
    }

    setFieldErrors({});
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        body: JSON.stringify(payload),
        headers: {"Content-Type": "application/json"},
        method: "POST",
      });
      const result = (await response.json()) as ContactApiResponse;

      if (!response.ok || !result.ok) {
        if (!result.ok && result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        setStatus(!result.ok && result.reason === "rateLimit" ? "rateLimit" : "error");
        return;
      }

      formRef.current?.reset();
      onDateChange("arrival", "");
      onDateChange("departure", "");
      submissionIdRef.current = null;
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const statusMessage =
    status === "sending"
      ? t("status.sending")
      : status === "success"
        ? t("status.success")
        : status === "rateLimit"
          ? t("status.rateLimit")
          : status === "error" && Object.keys(fieldErrors).length === 0
            ? t("status.error")
            : "";

  return (
    <form
      ref={formRef}
      aria-describedby="contact-form-status"
      noValidate
      onChange={resetSubmissionState}
      onSubmit={handleSubmit}
      className="contents"
    >
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label>
          Company
          <input name="contactNote" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="border-t border-page-border pt-6 lg:col-start-2 lg:row-start-1 lg:pt-5">
        <p className="text-xs uppercase tracking-[0.18em] text-page-accent">
          {t("columnLabel")}
        </p>

        <fieldset
          disabled={isSending}
          className="mt-3 grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:mt-2 lg:gap-y-3"
        >
        <label className="text-[0.9375rem] text-page-text" htmlFor="contact-name">
          <span>{t("fields.name")}</span>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            maxLength={CONTACT_LIMITS.name}
            autoComplete="name"
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
            className={inputClasses}
          />
          {errorFor("name") ? (
            <span
              id="contact-name-error"
              className="mt-2 block text-xs text-[var(--trb-walnut)]"
            >
              {errorFor("name")}
            </span>
          ) : null}
        </label>

        <label className="text-[0.9375rem] text-page-text" htmlFor="contact-email">
          <span>{t("fields.email")}</span>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={CONTACT_LIMITS.email}
            autoComplete="email"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
            className={inputClasses}
          />
          {errorFor("email") ? (
            <span
              id="contact-email-error"
              className="mt-2 block text-xs text-[var(--trb-walnut)]"
            >
              {errorFor("email")}
            </span>
          ) : null}
        </label>

        <label className="text-[0.9375rem] text-page-text" htmlFor="contact-arrival">
          <span>{t("fields.arrival")}</span>
          <input
            id="contact-arrival"
            name="arrival"
            type="date"
            value={arrival}
            onChange={(event) => onDateChange("arrival", event.target.value)}
            aria-invalid={Boolean(fieldErrors.arrival) || stayRangeInvalid}
            aria-describedby={
              [
                fieldErrors.arrival ? "contact-arrival-error" : null,
                stayRangeInvalid ? "availability-range-error" : null,
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
            className={inputClasses}
          />
          {errorFor("arrival") ? (
            <span
              id="contact-arrival-error"
              className="mt-2 block text-xs text-[var(--trb-walnut)]"
            >
              {errorFor("arrival")}
            </span>
          ) : null}
        </label>

        <label className="text-[0.9375rem] text-page-text" htmlFor="contact-departure">
          <span>{t("fields.departure")}</span>
          <input
            id="contact-departure"
            name="departure"
            type="date"
            value={departure}
            onChange={(event) => onDateChange("departure", event.target.value)}
            aria-invalid={Boolean(fieldErrors.departure) || stayRangeInvalid}
            aria-describedby={
              [
                fieldErrors.departure ? "contact-departure-error" : null,
                stayRangeInvalid ? "availability-range-error" : null,
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
            className={inputClasses}
          />
          {errorFor("departure") ? (
            <span
              id="contact-departure-error"
              className="mt-2 block text-xs text-[var(--trb-walnut)]"
            >
              {errorFor("departure")}
            </span>
          ) : null}
        </label>

        <label
          className="text-[0.9375rem] text-page-text sm:col-span-2"
          htmlFor="contact-message"
        >
          <span>{t("fields.message")}</span>
          <textarea
            id="contact-message"
            name="message"
            rows={3}
            required
            maxLength={CONTACT_LIMITS.message}
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={
              fieldErrors.message ? "contact-message-error" : undefined
            }
            className={`${inputClasses} resize-none lg:h-16`}
          />
          {errorFor("message") ? (
            <span
              id="contact-message-error"
              className="mt-2 block text-xs text-[var(--trb-walnut)]"
            >
              {errorFor("message")}
            </span>
          ) : null}
        </label>
        </fieldset>
      </div>

      <div className="flex flex-col items-start gap-3 lg:col-start-2 lg:row-start-2">
        <TrbButton type="submit" disabled={isSending}>
          {isSending ? t("actions.sending") : t("actions.submit")}
        </TrbButton>
        <p
          id="contact-form-status"
          aria-live="polite"
          className={`text-sm leading-6 ${
            status === "success"
              ? "text-[var(--trb-lagoon)]"
              : "text-[var(--trb-walnut)]"
          }`}
        >
          {statusMessage}
        </p>
      </div>
    </form>
  );
}
