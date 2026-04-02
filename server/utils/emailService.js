const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // or use host/port for custom SMTP
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendEmail = async (to, subject, html) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[TEST MODE EMAIL] SMTP not configured. Would have sent: \nTo: ${to}\nSubject: ${subject}`);
    return;
  }
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Clinic@Flow System" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = { sendEmail };
