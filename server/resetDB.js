require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');
const Prescription = require('./models/Prescription');
const Availability = require('./models/Availability');

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("Connected to MongoDB for Native Reset Wipe.");
    
    // Purge structurally modified relationships permanently globally
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Appointment.deleteMany({});
    await Prescription.deleteMany({});
    await Availability.deleteMany({});
    
    console.log("Database ecosystems completely purged structurally! Slate is clean.");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
