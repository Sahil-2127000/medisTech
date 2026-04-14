const mongoose = require('mongoose');
require('dotenv').config();

const Prescription = require('./server/models/Prescription');

async function checkDB() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://nitish:nitish@cluster0.r80v4.mongodb.net/medisTech?retryWrites=true&w=majority&appName=Cluster0');
  const rxCount = await Prescription.countDocuments();
  console.log("Total Prescriptions in DB:", rxCount);
  const sample = await Prescription.findOne().populate('patientId').lean();
  console.log("Sample Prescription:", JSON.stringify(sample, null, 2));
  process.exit(0);
}

checkDB();
