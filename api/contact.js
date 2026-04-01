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

const IMAGE_PATH_REGEX = /images\/([a-zA-Z0-9._-]+)/g;

const MIME_BY_EXTENSION = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

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

const getThankYouText = async (name) => {
  const fallback = [
    `Hi ${name},`,
    "",
    "Thank you for reaching out through my portfolio.",
    "I received your message and will get back to you soon.",
    "",
    "Best regards,",
    "Appaji Dheeraj",
  ].join("\n");

  try {
    const templatePath = path.resolve(__dirname, "../email/email.txt");
    const template = await readFile(templatePath, "utf8");
    return `Hi ${name},\n\n${template.trim()}`;
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

const enforceLightThemeHint = (html) => {
  if (html.includes("name=\"color-scheme\"")) {
    return html;
  }

  const lightHints =
    '<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">';

  if (html.includes("</head>")) {
    return html.replace("</head>", `${lightHints}</head>`);
  }

  return html;
};

const inlineLocalTemplateImages = async (html) => {
  const matches = html.match(IMAGE_PATH_REGEX) || [];
  const uniquePaths = [...new Set(matches)];
  let inlinedHtml = html;

  for (const relativePath of uniquePaths) {
    const fileName = relativePath.replace("images/", "");
    const imagePath = path.resolve(__dirname, "../email/images", fileName);
    const extension = path.extname(fileName).toLowerCase();
    const mimeType = MIME_BY_EXTENSION[extension] || "application/octet-stream";

    try {
      const imageBuffer = await readFile(imagePath);
      const dataUrl = `data:${mimeType};base64,${imageBuffer.toString("base64")}`;
      inlinedHtml = inlinedHtml.split(relativePath).join(dataUrl);
    } catch {
      // Keep original URL if a template image is missing.
    }
  }

  return inlinedHtml;
};

const getThankYouHtml = async (name) => {
  const fallbackText = await getThankYouText(name);

  try {
    const templatePath = path.resolve(__dirname, "../email/email.html");
    const template = await readFile(templatePath, "utf8");
    const inlinedTemplate = await inlineLocalTemplateImages(template);
    return enforceLightThemeHint(inlinedTemplate);
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

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;

  if (!RESEND_API_KEY || !CONTACT_FROM_EMAIL) {
    return json(res, 500, {
      error: "Server is not configured for email delivery.",
    });
  }

  try {
    const thankYouText = await getThankYouText(cleanName);
    const thankYouHtml = await getThankYouHtml(cleanName);

    const userEmailPayload = {
      from: CONTACT_FROM_EMAIL,
      to: [cleanEmail],
      subject: "Thanks for contacting me",
      text: thankYouText,
      html: thankYouHtml,
    };

    const requests = [sendWithResend(RESEND_API_KEY, userEmailPayload)];

    if (CONTACT_TO_EMAIL) {
      const ownerEmailPayload = {
        from: CONTACT_FROM_EMAIL,
        to: [CONTACT_TO_EMAIL],
        reply_to: cleanEmail,
        subject: `New portfolio contact from ${cleanName}`,
        text: [
          `Name: ${cleanName}`,
          `Email: ${cleanEmail}`,
          "",
          "Message:",
          cleanMessage,
        ].join("\n"),
      };

      requests.push(sendWithResend(RESEND_API_KEY, ownerEmailPayload));
    }

    const responses = await Promise.all(requests);
    const failedResponse = responses.find((item) => !item.ok);

    if (failedResponse) {
      const errorBody = await failedResponse.text();
      return json(res, 502, {
        error: "Email provider rejected the request.",
        details: errorBody,
      });
    }

    return json(res, 200, { ok: true });
  } catch {
    return json(res, 500, { error: "Failed to send message." });
  }
}
