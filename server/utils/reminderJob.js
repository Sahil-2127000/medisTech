// E-mails each patient a reminder about one hour before an accepted appointment.
// Runs inside the API server every minute; the GitHub keep-alive job keeps the free
// Render instance awake during clinic hours, so the check keeps running.
const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const { sendEmail } = require('./emailService');

const REMIND_BEFORE_MIN = 60;
const CHECK_EVERY_MS = 60 * 1000;

const pad = (n) => String(n).padStart(2, '0');
const todayStr = (d) => `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
const time12 = (t) => {
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${pad(m)} ${h >= 12 ? 'PM' : 'AM'}`;
};
const capitalize = (name = '') => name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

let running = false;

const sendDueReminders = async () => {
  if (running || mongoose.connection.readyState !== 1) return;
  running = true;
  try {
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();
    const date = todayStr(now);

    // Accepted visits of today that have not been reminded yet
    const candidates = await Appointment.find({
      date,
      status: { $in: ['approved', 'emergency_active'] },
      reminderSent: { $ne: true },
    })
      .populate('patientId', 'fullName email emailNotifications')
      .populate('doctorId', 'fullName clinicName clinicAddress');

    for (const appt of candidates) {
      const [h, m] = (appt.time || '').split(':').map(Number);
      if (Number.isNaN(h) || Number.isNaN(m)) continue;
      const minsLeft = h * 60 + m - nowMins;
      if (minsLeft <= 0 || minsLeft > REMIND_BEFORE_MIN) continue;

      // Mark first, so a slow e-mail never causes a second reminder
      const claimed = await Appointment.updateOne(
        { _id: appt._id, reminderSent: { $ne: true } },
        { $set: { reminderSent: true } }
      );
      if (!claimed.modifiedCount) continue;

      const p = appt.patientId;
      if (!p || !p.email || p.emailNotifications === false) continue;

      const pName = capitalize(p.fullName);
      const dName = capitalize(appt.doctorId?.fullName || '');
      const clinic = appt.doctorId?.clinicName ? ` at <strong>${appt.doctorId.clinicName}</strong>` : '';
      const address = appt.doctorId?.clinicAddress ? `<br><strong>Address:</strong> ${appt.doctorId.clinicAddress}` : '';
      const html = `<h2>Hello ${pName},</h2>
        <p>This is a reminder that the appointment for <strong>${appt.patientName || pName}</strong> with <strong>Dr. ${dName}</strong>${clinic} is in about <strong>${minsLeft} minutes</strong>.</p>
        <p><strong>Date:</strong> ${appt.date}<br>
        <strong>Time:</strong> ${time12(appt.time)}${appt.tokenNumber ? `<br><strong>Token:</strong> ${appt.tokenNumber}` : ''}${address}</p>
        <p>If you want to cancel or reschedule this appointment, you can do it from your MedicsTech account on the platform.</p>
        <p>See you soon!</p>`;
      sendEmail(p.email, 'Appointment Reminder: in 1 hour - MedicsTech', html)
        .catch(e => console.error('Reminder e-mail failed:', e.message));
    }
  } catch (err) {
    console.error('Reminder job error:', err.message);
  } finally {
    running = false;
  }
};

const startReminderJob = () => {
  setInterval(sendDueReminders, CHECK_EVERY_MS);
  setTimeout(sendDueReminders, 15 * 1000); // first check shortly after start-up
};

module.exports = { startReminderJob, sendDueReminders };
