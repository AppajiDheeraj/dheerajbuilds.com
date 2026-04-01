# Portfolio (Vite + React)

## Contact Form Backend

This project now includes a serverless backend endpoint at `/api/contact`.

### What it does

- Accepts `POST` requests from the contact form.
- Validates required fields (`name`, `email`, `message`).
- Uses a hidden honeypot field to reduce bot submissions.
- Sends emails through Resend.

### Required environment variables

Set these in Vercel project settings (or local `.env` when using `vercel dev`):

- `RESEND_API_KEY`: API key from Resend.
- `CONTACT_TO_EMAIL`: inbox where contact messages are delivered.
- `CONTACT_FROM_EMAIL`: verified sender identity in Resend (for example `Portfolio <hello@yourdomain.com>`).

### Deployment notes

- The Vercel config uses filesystem-first routing so `/api/*` functions are served correctly.
- All non-file routes are then redirected to `/` for the React SPA.

### Local development

- Frontend only: `npm run dev`
- Frontend + API functions: use Vercel local runtime (`vercel dev`)
