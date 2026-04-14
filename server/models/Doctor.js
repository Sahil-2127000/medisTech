const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: {
    type: String,
    enum: ['doctor'],
    default: 'doctor' // Hardcoded specifically mirroring the identity permanently
  },
  
  // Specific Clinical Context bindings dynamically retained
  phone: { type: String, default: '' },
  specialization: { type: String, default: '' },
  experience: { type: String, default: '' },
  clinicAddress: { type: String, default: '' },
  photo: { type: String, default: '' },
  lastPasswordChange: { type: Date },
  is2FAEnabled: { type: Boolean, default: false },
  twoFactorPhone: { type: String, default: '' },
  twoFactorOTP: { type: String, default: '' },
  twoFactorOTPExpires: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', DoctorSchema);
