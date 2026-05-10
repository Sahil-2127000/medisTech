const mongoose = require('mongoose');
require('dotenv').config();
const Appointment = require('./models/Appointment');

async function checkStats() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const stats = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    console.log(JSON.stringify(stats, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkStats();
