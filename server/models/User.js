const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['patient'],
    default: 'patient'
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  phone: {
    type: String,
  },
  lastPasswordChange: {
    type: Date
  },
  is2FAEnabled: { type: Boolean, default: false },
  twoFactorPhone: { type: String, default: '' },
  twoFactorOTP: { type: String, default: '' },
  emailNotifications: { type: Boolean, default: true },
  smsNotifications: { type: Boolean, default: true },
  patientUid: { type: String, unique: true, sparse: true }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
