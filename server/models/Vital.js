const mongoose = require('mongoose');

const vitalSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String, // 'Blood Pressure', 'Heart Rate', 'Weight', etc.
    required: true
  },
  value: {
    type: String, // '120/80', '72', '70kg'
    required: true
  },
  unit: String,
  note: String,
  recordedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Vital', vitalSchema);
