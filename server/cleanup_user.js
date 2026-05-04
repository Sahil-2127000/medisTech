const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URL);
  await User.deleteOne({ email: 'verify@test.com' });
  console.log('Test user deleted');
  process.exit(0);
}

run();
