require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/clinic').then(async () => {
  const users = await User.find({}, 'fullName email role');
  const doctors = await Doctor.find({}, 'fullName email role');
  console.log("USERS:", users);
  console.log("DOCTORS:", doctors);
  process.exit(0);
});
