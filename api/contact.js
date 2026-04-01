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

const textToBasicHtml = (text) => {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return `<!doctype html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <meta name="x-apple-disable-message-reformatting" />
    <style>
      :root {
        color-scheme: light only;
        supported-color-schemes: light;
      }
      body,
      table,
      td,
      p {
        background: #fff6ec !important;
        color: #111111 !important;
      }
      a {
        color: #2341e1 !important;
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#fff6ec !important;color:#111111 !important;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#fff6ec" style="background:#fff6ec !important;">
      <tr>
        <td align="center" style="padding:24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:640px;background:#fff6ec !important;border:1px solid #e8ded2;border-radius:12px;">
            <tr>
              <td style="padding:24px;font-family:Arial,Helvetica,sans-serif;line-height:1.6;white-space:pre-wrap;color:#111111 !important;">${escaped}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
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

    const userEmailPayload = {
      from: CONTACT_FROM_EMAIL,
      to: [cleanEmail],
      subject: "Thanks for contacting me",
      text: thankYouText,
      html: textToBasicHtml(thankYouText),
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
