const nodemailer = require('nodemailer');

// Ways to send mail, tried in this order:
//  1. Brevo API over HTTPS (BREVO_API_KEY / BREVO_SENDER) — works on Render's free plan, key never expires.
//  2. Gmail API over HTTPS (GMAIL_CLIENT_ID / GMAIL_CLIENT_SECRET / GMAIL_REFRESH_TOKEN / GMAIL_USER).
//     Works on hosts that block SMTP ports, such as Render's free plan. Same setup as the TaskFlow app.
//  3. SMTP with nodemailer (SMTP_USER / SMTP_PASS) — the original setup, used locally.

const brevoConfigured = () => !!(process.env.BREVO_API_KEY && process.env.BREVO_SENDER);

const sendWithBrevo = async (to, subject, html) => {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      sender: { name: 'MedisTech', email: process.env.BREVO_SENDER },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Brevo send failed (${res.status}): ${data.message || data.code || 'unknown error'}`);
  return data;
};

const gmailApiConfigured = () =>
  !!(process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET && process.env.GMAIL_REFRESH_TOKEN && process.env.GMAIL_USER);

// Exchange the long-lived refresh token for a short-lived access token (cached until it expires)
let cachedToken = { value: null, expiresAt: 0 };
const getGmailAccessToken = async () => {
  if (cachedToken.value && Date.now() < cachedToken.expiresAt - 60_000) return cachedToken.value;
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GMAIL_CLIENT_ID,
      client_secret: process.env.GMAIL_CLIENT_SECRET,
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Gmail token refresh failed: ${data.error || res.status} (${data.error_description || ''})`);
  cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cachedToken.value;
};

const sendWithGmailApi = async (to, subject, html) => {
  const encodedSubject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const message = [
    `From: MedisTech <${process.env.GMAIL_USER}>`,
    `To: ${to}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${encodedSubject}`,
    '',
    html,
  ].join('\r\n');
  const raw = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${await getGmailAccessToken()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Gmail API send failed: ${data.error?.message || res.status}`);
  return data;
};

const sendWithSmtp = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transporter.sendMail({ from: `"MedisTech" <${process.env.SMTP_USER}>`, to, subject, html });
};

// True when real emails can be sent (otherwise OTPs are only logged, for local testing)
const isEmailConfigured = () => brevoConfigured() || gmailApiConfigured() || !!(process.env.SMTP_USER && process.env.SMTP_PASS);

// Address that receives contact-form enquiries
const supportInbox = () => process.env.BREVO_SENDER || process.env.GMAIL_USER || process.env.SMTP_USER;

const sendEmail = async (to, subject, html) => {
  if (brevoConfigured()) return sendWithBrevo(to, subject, html);
  if (gmailApiConfigured()) return sendWithGmailApi(to, subject, html);
  if (process.env.SMTP_USER && process.env.SMTP_PASS) return sendWithSmtp(to, subject, html);
  console.log(`[TEST MODE EMAIL] No email service configured. Would have sent: \nTo: ${to}\nSubject: ${subject}`);
};

module.exports = { sendEmail, isEmailConfigured, supportInbox };
