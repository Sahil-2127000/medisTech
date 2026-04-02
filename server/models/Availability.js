const mongoose = require('mongoose');

const TimeBlockSchema = new mongoose.Schema({
  start: { type: String, required: true }, // e.g., "09:00"
  end: { type: String, required: true }    // e.g., "13:00"
}, { _id: false });

const WeeklyShiftSchema = new mongoose.Schema({
  day: { type: String, required: true, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
  isOff: { type: Boolean, default: false },
  slots: { type: [TimeBlockSchema], default: [] } 
}, { _id: false });

const AvailabilitySchema = new mongoose.Schema({
  doctorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor', 
    required: true, 
    unique: true 
  },
  weeklyConfig: { 
    type: [WeeklyShiftSchema], 
    default: () => [
      { day: 'Monday', isOff: false, slots: [{ start: "09:00", end: "17:00" }] },
      { day: 'Tuesday', isOff: false, slots: [{ start: "09:00", end: "17:00" }] },
      { day: 'Wednesday', isOff: false, slots: [{ start: "09:00", end: "17:00" }] },
      { day: 'Thursday', isOff: false, slots: [{ start: "09:00", end: "17:00" }] },
      { day: 'Friday', isOff: false, slots: [{ start: "09:00", end: "17:00" }] },
      { day: 'Saturday', isOff: true, slots: [] },
      { day: 'Sunday', isOff: true, slots: [] }
    ]
  },
  slotDuration: { type: Number, default: 20 }, // Average patient minutes
  bufferTime: { type: Number, default: 2 }, // Block hours preventing 'last-minute' scheduling
  blackoutDates: { type: [String], default: [] } // Explicit custom off days e.g., "2024-12-25"
}, { timestamps: true });

module.exports = mongoose.model('Availability', AvailabilitySchema);
