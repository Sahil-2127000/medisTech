const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  duration: { type: String, required: true }
}, { _id: false });

const PrescriptionSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor', 
    required: true 
  },
  
  diagnosis: { type: String, required: true },
  medicines: { type: [MedicineSchema], required: true },
  clinicalNotes: { type: String, default: '' },
  pdfBase64: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', PrescriptionSchema);
