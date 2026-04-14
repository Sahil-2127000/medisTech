const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['lab', 'report'],
    required: true
  },
  title: { type: String, required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  status: { type: String, default: 'Final' },
  fileUrl: { type: String, required: true }, // URL to access the PDF locally
}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);
