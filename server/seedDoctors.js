// Seeds doctors for the multi-clinic platform: every clinic has exactly one doctor,
// its own Ludhiana address and its own weekly schedule. No photos are stored —
// the UI shows initials avatars instead.
//
// Usage (from the server folder):
//   SEED_DOCTOR_PASSWORD='<password>' node seedDoctors.js <email-1> <email-2>
// E-mails and the password are passed in so no personal data is committed.
// Re-running skips e-mails that already exist.
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Doctor = require('./models/Doctor');
const Availability = require('./models/Availability');
const User = require('./models/User');

const week = (fn) => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
  const slots = fn(day);
  return { day, isOff: slots.length === 0, slots };
});

const clinics = [
  {
    fullName: 'Purvika Jain',
    specialization: 'General Physician',
    experience: '12',
    clinicName: "Dr. Purvika Jain's Clinic",
    clinicAddress: '214-B, Model Town Extension, Ludhiana, Punjab 141002',
    availability: {
      slotDuration: 15,
      weeklyConfig: week(day => day === 'Sunday' ? [] : [{ start: '10:00', end: '14:00' }, { start: '17:00', end: '20:00' }])
    }
  },
  {
    fullName: 'Akshit Kumar',
    specialization: 'Dermatologist',
    experience: '8',
    clinicName: "Dr. Akshit Kumar's Clinic",
    clinicAddress: 'SCO 35, Sarabha Nagar Market, Ludhiana, Punjab 141001',
    availability: {
      slotDuration: 20,
      weeklyConfig: week(day => ['Sunday', 'Wednesday'].includes(day) ? [] : day === 'Saturday' ? [{ start: '10:00', end: '14:00' }] : [{ start: '11:00', end: '17:00' }])
    }
  }
];

const seed = async () => {
  const emails = process.argv.slice(2);
  const password = process.env.SEED_DOCTOR_PASSWORD;
  if (emails.length !== clinics.length || !password) {
    console.error(`Usage: SEED_DOCTOR_PASSWORD='<password>' node seedDoctors.js ${clinics.map((_, i) => `<email-${i + 1}>`).join(' ')}`);
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/clinicflow');
  const hashedPassword = await bcrypt.hash(password, 10);

  for (const [i, { availability, ...clinic }] of clinics.entries()) {
    const email = emails[i].toLowerCase();
    if (await Doctor.findOne({ email })) {
      console.log(`Skipping ${email} (already exists)`);
      continue;
    }
    // Login looks up patients first, so an e-mail can belong to only one account type
    if (await User.findOne({ email })) {
      console.log(`Skipping ${email} (already registered as a patient)`);
      continue;
    }
    const doctor = await Doctor.create({ ...clinic, email, password: hashedPassword, role: 'doctor' });
    await Availability.create({ doctorId: doctor._id, ...availability });
    console.log(`Created ${clinic.clinicName} — Dr. ${clinic.fullName} (${clinic.specialization}) <${email}>`);
  }

  await mongoose.disconnect();
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
