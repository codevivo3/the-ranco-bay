import {Resend} from "resend";

import {
  type ContactApiResponse,
  hasContactHoneypot,
  validateContactEnquiry,
} from "@/features/contact/contact-enquiry";

export const runtime = "nodejs";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitEntries = new Map<string, RateLimitEntry>();

function json(body: ContactApiResponse, status = 200) {
  return Response.json(body, {status});
}

function getClientAddress(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const existing = rateLimitEntries.get(key);

  if (!existing || existing.resetAt <= now) {
    rateLimitEntries.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  existing.count += 1;
  return existing.count > RATE_LIMIT_MAX;
}

function isConfiguredEmail(value: string | undefined): value is string {
  return Boolean(value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
}

function buildOwnerEmail({
  arrival,
  departure,
  email,
  locale,
  message,
  name,
  receivedAt,
}: {
  arrival: string;
  departure: string;
  email: string;
  locale: string;
  message: string;
  name: string;
  receivedAt: string;
}) {
  return [
    "New enquiry from The Ranco Bay website",
    "",
    `Name: ${name}`,
    `Guest email: ${email}`,
    `Arrival: ${arrival || "Not supplied"}`,
    `Departure: ${departure || "Not supplied"}`,
    `Site language: ${locale.toUpperCase()}`,
    `Received: ${receivedAt}`,
    "",
    "Message:",
    message,
  ].join("\n");
}

export async function POST(request: Request) {
  let input: unknown;

  try {
    input = await request.json();
  } catch {
    return json({ok: false, reason: "validation"}, 400);
  }

  // Silently accept bot-filled honeypots without sending an email.
  if (hasContactHoneypot(input)) return json({ok: true});

  const validation = validateContactEnquiry(input);
  if (!validation.success) {
    return json(
      {
        fieldErrors: validation.fieldErrors,
        ok: false,
        reason: "validation",
      },
      400,
    );
  }

  if (isRateLimited(getClientAddress(request))) {
    return json({ok: false, reason: "rateLimit"}, 429);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL;

  if (
    !apiKey ||
    !isConfiguredEmail(fromEmail) ||
    !isConfiguredEmail(toEmail)
  ) {
    console.error("Contact email delivery is not configured.");
    return json({ok: false, reason: "server"}, 503);
  }

  const receivedAt = new Date().toISOString();
  const subjectName = validation.data.name.replace(/[\r\n]+/g, " ");
  const resend = new Resend(apiKey);

  try {
    const {error} = await resend.emails.send(
      {
        from: `The Ranco Bay <${fromEmail}>`,
        replyTo: validation.data.email,
        subject: `New website enquiry — ${subjectName}`,
        text: buildOwnerEmail({...validation.data, receivedAt}),
        to: [toEmail],
      },
      {idempotencyKey: `contact-enquiry/${validation.data.submissionId}`},
    );

    if (error) {
      console.error("Resend rejected a contact enquiry email:", error.message);
      return json({ok: false, reason: "server"}, 502);
    }

    return json({ok: true});
  } catch (error) {
    console.error(
      "Contact enquiry email delivery failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return json({ok: false, reason: "server"}, 502);
  }
}
