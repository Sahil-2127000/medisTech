// Seeds 5 mock doctors (different specializations) + default availability for testing multi-doctor support.
// Run once from the server folder:  node seedDoctors.js
// All mock doctors share the test password below. Re-running skips doctors that already exist.
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Doctor = require('./models/Doctor');
const Availability = require('./models/Availability');

const TEST_PASSWORD = 'Doctor@123';

const doctors = [
  {
    fullName: 'Ananya Sharma',
    email: 'ananya.derma@medistech.test',
    phone: '9000000001',
    specialization: 'Dermatologist',
    experience: '8',
    clinicAddress: 'Skin Care Wing, MedisTech Clinic, Ludhiana',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    fullName: 'Rohan Mehta',
    email: 'rohan.cardio@medistech.test',
    phone: '9000000002',
    specialization: 'Cardiologist',
    experience: '15',
    clinicAddress: 'Heart Centre, MedisTech Clinic, Ludhiana',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    fullName: 'Priya Kapoor',
    email: 'priya.pediatric@medistech.test',
    phone: '9000000003',
    specialization: 'Pediatrician',
    experience: '10',
    clinicAddress: 'Child Care Block, MedisTech Clinic, Ludhiana',
    photo: 'https://randomuser.me/api/portraits/women/65.jpg'
  },
  {
    fullName: 'Arjun Singh',
    email: 'arjun.ortho@medistech.test',
    phone: '9000000004',
    specialization: 'Orthopedic',
    experience: '12',
    clinicAddress: 'Bone & Joint Unit, MedisTech Clinic, Ludhiana',
    photo: 'https://randomuser.me/api/portraits/men/75.jpg'
  },
  {
    fullName: 'Neha Verma',
    email: 'neha.ent@medistech.test',
    phone: '9000000005',
    specialization: 'ENT Specialist',
    experience: '6',
    clinicAddress: 'ENT Department, MedisTech Clinic, Ludhiana',
    photo: 'https://randomuser.me/api/portraits/women/12.jpg'
  }
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/clinicflow');
  const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);

  for (const doc of doctors) {
    const exists = await Doctor.findOne({ email: doc.email });
    if (exists) {
      console.log(`Skipping ${doc.email} (already exists)`);
      continue;
    }
    const created = await Doctor.create({ ...doc, password: hashedPassword, role: 'doctor' });
    await Availability.create({ doctorId: created._id }); // default Mon-Fri 9-5 grid
    console.log(`Created Dr. ${doc.fullName} (${doc.specialization})`);
  }

  await mongoose.disconnect();
  console.log(`Done. Login with any seeded email and password: ${TEST_PASSWORD}`);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
