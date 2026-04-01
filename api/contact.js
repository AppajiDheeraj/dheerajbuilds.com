const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (res, statusCode, payload) => {
  res.status(statusCode).json(payload);
};

const sanitize = (value = "") => value.toString().trim();

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

  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    return json(res, 500, {
      error: "Server is not configured for email delivery.",
    });
  }

  const emailPayload = {
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

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    if (!resendResponse.ok) {
      const errorBody = await resendResponse.text();
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
