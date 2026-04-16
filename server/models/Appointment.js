const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor', 
    required: true 
  },
  
  date: { type: String, required: true }, // 'YYYY-MM-DD'
  time: { type: String, required: true }, // 'HH:MM'
  symptoms: { type: String, default: '' },
  
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled', 'emergency_active', 'in_progress'], 
    default: 'pending' 
  },
  
  // High-priority notification flag indicating mathematical delays
  emergencyDelayedMinutes: { type: Number, default: 0 },
  originalTime: { type: String }, // Snapshot to compare against 'time' shifts
  tokenNumber: { type: Number } // Sequential Daily Token for the Queue System
  
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
