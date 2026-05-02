const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log('Connected to DB');

  const email = 'verify@test.com';
  const password = 'Password@123';
  
  // Remove if exists
  await User.deleteOne({ email });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    fullName: 'Verify User',
    email: email,
    password: hashedPassword,
    role: 'patient',
    patientUid: 'P123456'
  });

  await user.save();
  console.log('User registered: verify@test.com / Password@123');
  process.exit(0);
}

run();
