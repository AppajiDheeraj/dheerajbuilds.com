import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const json = (res, statusCode, payload) => {
  res.status(statusCode).json(payload);
};

const sanitize = (value = "") => value.toString().trim();

// Matches template-local image paths so we can rewrite them to absolute URLs for email clients.
const IMAGE_PATH_REGEX = /images\/([a-zA-Z0-9._-]+)/g;

const sendWithResend = async (apiKey, payload) => {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

const getEmailTemplateText = async ({ name, email, message }) => {
  const fallback = [
    "New portfolio form response",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    "Message:",
    message,
  ].join("\n");

  try {
    const templatePath = path.resolve(__dirname, "../templates/email/email.txt");
    const template = await readFile(templatePath, "utf8");

    return [
      template.trim(),
      "",
      "Form Details:",
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      "Message:",
      message,
    ].join("\n");
  } catch {
    return fallback;
  }
};

const textToFallbackHtml = (text) => {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return `<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;white-space:pre-wrap;color:#1c1c1c">${escaped}</div>`;
};

const escapeHtml = (value = "") =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const enforceLightThemeHint = (html) => {
  // Some clients auto-invert colors unless color-scheme metadata is explicitly provided.
  if (html.includes('name="color-scheme"') || html.includes("name='color-scheme'")) {
    return html;
  }

  const lightHints =
    '<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">';

  if (html.includes("</head>")) {
    return html.replace("</head>", `${lightHints}</head>`);
  }

  return `${lightHints}${html}`;
};

const normalizeEmailAssetBaseUrl = (value) => {
  // Trim trailing slashes to avoid double-slash URLs after path concatenation.
  const fallback = "https://portfolio-seven-ruby-98.vercel.app/email/images";
  const url = sanitize(value || fallback);
  return url.replace(/\/+$/, "");
};

const normalizeFormResponseAssetBaseUrl = (value) => {
  // Separate base URL allows independent hosting/caching for owner notification assets.
  const fallback = "https://portfolio-seven-ruby-98.vercel.app/form_response/images";
  const url = sanitize(value || fallback);
  return url.replace(/\/+$/, "");
};

const replaceTemplateImagePaths = (html, baseUrl) => {
  return html.replace(IMAGE_PATH_REGEX, (_, fileName) => `${baseUrl}/${fileName}`);
};

const getEmailTemplateHtml = async ({ name, email, message, assetBaseUrl, fallbackText }) => {
  try {
    const templatePath = path.resolve(__dirname, "../templates/email/email.html");
    const template = await readFile(templatePath, "utf8");
    const withAbsoluteAssets = replaceTemplateImagePaths(template, assetBaseUrl);

    const detailsBlock = [
      '<div style="padding:16px 20px 24px 20px;font-family:Arial,Helvetica,sans-serif;color:#111111;">',
      '<p style="margin:0 0 8px 0;font-size:14px;"><strong>Form Details</strong></p>',
      `<p style="margin:0 0 4px 0;font-size:14px;"><strong>Name:</strong> ${escapeHtml(name)}</p>`,
      `<p style="margin:0 0 4px 0;font-size:14px;"><strong>Email:</strong> ${escapeHtml(email)}</p>`,
      `<p style="margin:10px 0 4px 0;font-size:14px;"><strong>Message:</strong></p>`,
      `<p style="margin:0;font-size:14px;white-space:pre-wrap;">${escapeHtml(message)}</p>`,
      "</div>",
    ].join("");

    const withDetails = withAbsoluteAssets.includes("</body>")
      ? withAbsoluteAssets.replace("</body>", `${detailsBlock}</body>`)
      : `${withAbsoluteAssets}${detailsBlock}`;

    return enforceLightThemeHint(withDetails);
  } catch {
    return textToFallbackHtml(fallbackText);
  }
};

const getFormResponseText = async ({ name, email, message }) => {
  const fallback = [
    "New portfolio form response",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    "Message:",
    message,
  ].join("\n");

  try {
    const templatePath = path.resolve(__dirname, "../templates/form_response/email.txt");
    const template = await readFile(templatePath, "utf8");

    return [
      template.trim(),
      "",
      "Form Details:",
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      "Message:",
      message,
    ].join("\n");
  } catch {
    return fallback;
  }
};

const getFormResponseHtml = async ({ name, email, message, assetBaseUrl, fallbackText }) => {
  try {
    const templatePath = path.resolve(__dirname, "../templates/form_response/email.html");
    const template = await readFile(templatePath, "utf8");
    const withAbsoluteAssets = replaceTemplateImagePaths(template, assetBaseUrl);

    const detailsBlock = [
      '<div style="padding:16px 20px 24px 20px;font-family:Arial,Helvetica,sans-serif;color:#111111;">',
      '<p style="margin:0 0 8px 0;font-size:14px;"><strong>Form Details</strong></p>',
      `<p style="margin:0 0 4px 0;font-size:14px;"><strong>Name:</strong> ${escapeHtml(name)}</p>`,
      `<p style="margin:0 0 4px 0;font-size:14px;"><strong>Email:</strong> ${escapeHtml(email)}</p>`,
      `<p style="margin:10px 0 4px 0;font-size:14px;"><strong>Message:</strong></p>`,
      `<p style="margin:0;font-size:14px;white-space:pre-wrap;">${escapeHtml(message)}</p>`,
      "</div>",
    ].join("");

    const withDetails = withAbsoluteAssets.includes("</body>")
      ? withAbsoluteAssets.replace("</body>", `${detailsBlock}</body>`)
      : `${withAbsoluteAssets}${detailsBlock}`;

    return enforceLightThemeHint(withDetails);
  } catch {
    return textToFallbackHtml(fallbackText);
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { error: "Method not allowed" });
  }

  const { name, email, message, company } = req.body || {};

  // Honeypot field: bots often fill hidden fields; return success to avoid signals.
  if (sanitize(company)) {
    return json(res, 200, { ok: true });
  }

  const cleanName = sanitize(name);
  const cleanEmail = sanitize(email).toLowerCase();
  const cleanMessage = sanitize(message);

  if (!cleanName || !cleanEmail || !cleanMessage) {
    return json(res, 400, { error: "All fields are required." });
  }

  if (!EMAIL_REGEX.test(cleanEmail)) {
    return json(res, 400, { error: "Please provide a valid email address." });
  }

  if (cleanMessage.length < 10) {
    return json(res, 400, { error: "Message must be at least 10 characters." });
  }

  const {
    RESEND_API_KEY,
    CONTACT_TO_EMAIL,
    CONTACT_FROM_EMAIL,
    EMAIL_ASSET_BASE_URL,
    EMAIL_FORM_RESPONSE_ASSET_BASE_URL,
  } = process.env;

  const isProduction = process.env.NODE_ENV === "production";

  if (!RESEND_API_KEY || !CONTACT_FROM_EMAIL) {
    // In local development, return success-like responses so form UX can be tested without secrets.
    if (!isProduction) {
      return json(res, 200, {
        ok: true,
        skipped: true,
        warning: "Email delivery is not configured in local development.",
      });
    }

    return json(res, 500, {
      error: "Server is not configured for email delivery.",
    });
  }

  try {
    // Visitor confirmation email uses the portfolio "email" template set.
    const thankYouText = await getEmailTemplateText({
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
    });
    const thankYouAssetBaseUrl = normalizeEmailAssetBaseUrl(EMAIL_ASSET_BASE_URL);
    const thankYouHtml = await getEmailTemplateHtml({
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
      assetBaseUrl: thankYouAssetBaseUrl,
      fallbackText: thankYouText,
    });

    const ownerRecipientEmail = sanitize(CONTACT_TO_EMAIL) || CONTACT_FROM_EMAIL;
    // Owner notification uses the "form_response" template set and includes submitted details.
    const ownerText = await getFormResponseText({
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
    });
    const ownerAssetBaseUrl = normalizeFormResponseAssetBaseUrl(
      EMAIL_FORM_RESPONSE_ASSET_BASE_URL
    );
    const ownerHtml = await getFormResponseHtml({
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
      assetBaseUrl: ownerAssetBaseUrl,
      fallbackText: ownerText,
    });

    const ownerEmailPayload = {
      from: CONTACT_FROM_EMAIL,
      to: [ownerRecipientEmail],
      reply_to: cleanEmail,
      subject: `New portfolio contact from ${cleanName}`,
      text: ownerText,
      html: ownerHtml,
    };

    const visitorEmailPayload = {
      from: CONTACT_FROM_EMAIL,
      to: [cleanEmail],
      reply_to: ownerRecipientEmail,
      subject: "Appaji Dheeraj Portfolio Email",
      text: thankYouText,
      html: thankYouHtml,
    };

    // Send both emails concurrently to keep API latency low.
    const [visitorResponse, ownerResponse] = await Promise.all([
      sendWithResend(RESEND_API_KEY, visitorEmailPayload),
      sendWithResend(RESEND_API_KEY, ownerEmailPayload),
    ]);

    const failedResponses = [
      !visitorResponse.ok ? { label: "visitor", response: visitorResponse } : null,
      !ownerResponse.ok ? { label: "owner", response: ownerResponse } : null,
    ].filter(Boolean);

    if (failedResponses.length > 0) {
      // Preserve provider response bodies to speed up operational debugging.
      const details = await Promise.all(
        failedResponses.map(async ({ label, response }) => ({
          label,
          details: await response.text(),
        }))
      );

      if (!isProduction) {
        return json(res, 200, {
          ok: true,
          skipped: true,
          warning: "Email provider rejected one or more requests in local development.",
          details,
        });
      }

      return json(res, 502, {
        error: "Email provider rejected one or more requests.",
        details,
      });
    }

    return json(res, 200, { ok: true });
  } catch {
    if (!isProduction) {
      return json(res, 200, {
        ok: true,
        skipped: true,
        warning: "Email send failed in local development.",
      });
    }

    return json(res, 500, { error: "Failed to send message." });
  }
}
