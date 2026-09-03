import type {ContactEnquiry} from "./contact-enquiry";

type OwnerEmailDetails = Omit<ContactEnquiry, "submissionId"> & {
  receivedAt: string;
};

const languages: Record<string, {format: string; label: string}> = {
  en: {format: "en-GB", label: "English"},
  it: {format: "it-IT", label: "Italian"},
  de: {format: "de-DE", label: "German"},
  fr: {format: "fr-FR", label: "French"},
};

// Public 240px PNG derivative of trb-logo-plain.svg; deploy alongside this template.
const logoUrl = "https://therancobay.com/logo/trb-logo-email.png";
const colors = {
  surface: "#ffffff",
  text: "#222222",
  accent: "#244b74",
  muted: "#555555",
  border: "#dddddd",
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildOwnerEmail(details: OwnerEmailDetails) {
  const language = languages[details.locale] ?? languages.en;
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const stayDate = new Intl.DateTimeFormat(language.format, {
    ...dateOptions,
    timeZone: "UTC",
  });
  // Date-only stay values must not shift when the server's timezone changes.
  const formatStayDate = (value: string) =>
    value ? stayDate.format(new Date(`${value}T00:00:00Z`)) : "Not supplied";
  const received = new Date(details.receivedAt);
  const submittedDate = new Intl.DateTimeFormat(language.format, {
    ...dateOptions,
    timeZone: "Europe/Rome",
  }).format(received);
  const submittedTime = new Intl.DateTimeFormat(language.format, {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Europe/Rome",
  }).format(received);
  const arrival = formatStayDate(details.arrival);
  const departure = formatStayDate(details.departure);
  const timestamp = `${submittedDate} · ${submittedTime}`;
  const websiteLanguage = `${language.label} website`;
  const labelStyle = `color:${colors.muted};font-size:12px;line-height:18px;letter-spacing:1px;font-weight:bold;`;
  const name = escapeHtml(details.name);
  const email = escapeHtml(details.email);
  const message = escapeHtml(details.message).replace(/\r\n|\r|\n/g, "<br>");
  const emailHref = escapeHtml(`mailto:${encodeURIComponent(details.email)}`);

  const text = [
    "THE RANCO BAY",
    "NEW ENQUIRY",
    "",
    details.name,
    details.email,
    "",
    "ARRIVAL",
    arrival,
    "",
    "DEPARTURE",
    departure,
    "",
    "MESSAGE",
    details.message,
    "",
    "---",
    "Submitted from therancobay.com",
    timestamp,
    websiteLanguage,
  ].join("\n");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>New enquiry — The Ranco Bay</title>
</head>
<body style="margin:0;padding:0;background-color:${colors.surface};color:${colors.text};font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${colors.surface}" style="border-collapse:collapse;">
    <tr><td align="center" style="padding:16px 12px;">
      <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${colors.surface}" style="width:100%;max-width:600px;table-layout:fixed;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;color:${colors.text};">
        <tr><td style="padding:0 16px 16px;">
          <img src="${logoUrl}" alt="The Ranco Bay" width="180" height="180" style="display:block;width:180px;height:180px;border:0;color:${colors.text};font-family:Arial,Helvetica,sans-serif;font-size:16px;">
        </td></tr>
        <tr><td style="padding:0 16px 12px;">
          <h1 style="margin:0;${labelStyle}color:${colors.accent};">NEW ENQUIRY</h1>
        </td></tr>
        <tr><td style="padding:0 16px 24px;word-wrap:break-word;overflow-wrap:anywhere;">
          <p style="margin:0 0 6px;color:${colors.text};font-size:26px;line-height:34px;font-weight:bold;">${name}</p>
          <p style="margin:0;font-size:16px;line-height:24px;word-break:break-all;">
            <a href="${emailHref}" style="color:${colors.accent};text-decoration:underline;">${email}</a>
          </p>
        </td></tr>
        <tr><td style="padding:0 16px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="table-layout:fixed;border-collapse:collapse;">
            <tr>
              <td width="50%" valign="top" style="padding:0 12px 0 0;">
                <p style="margin:0 0 6px;${labelStyle}">ARRIVAL</p>
                <p style="margin:0;color:${colors.text};font-size:16px;line-height:24px;">${escapeHtml(arrival)}</p>
              </td>
              <td width="50%" valign="top" style="padding:0 0 0 12px;">
                <p style="margin:0 0 6px;${labelStyle}">DEPARTURE</p>
                <p style="margin:0;color:${colors.text};font-size:16px;line-height:24px;">${escapeHtml(departure)}</p>
              </td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding:0 16px 24px;word-wrap:break-word;overflow-wrap:anywhere;">
          <h2 style="margin:0 0 10px;${labelStyle}">MESSAGE</h2>
          <p style="margin:0;color:${colors.text};font-size:16px;line-height:26px;">${message}</p>
        </td></tr>
        <tr><td style="padding:0 16px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
            <tr><td style="border-top:1px solid ${colors.border};padding-top:20px;color:${colors.muted};font-size:12px;line-height:20px;">
              Submitted from <a href="https://therancobay.com" style="color:${colors.muted};text-decoration:none;">therancobay.com</a><br>
              ${escapeHtml(timestamp)}<br>
              ${escapeHtml(websiteLanguage)}
            </td></tr>
          </table>
        </td></tr>
      </table>
      <!--[if mso]></td></tr></table><![endif]-->
    </td></tr>
  </table>
</body>
</html>`;

  return {html, text};
}
