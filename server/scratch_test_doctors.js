require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

async function testQuery() {
  try {
    const mongoUrl = process.env.MONGO_URL;
    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 5000 });
    
    const doctors = await Doctor.find({});
    console.log("All doctors:", doctors.map(d => d.email));
    
    process.exit(0);
  } catch (err) {
    console.error("ERROR:", err);
    process.exit(1);
  }
}

testQuery();
