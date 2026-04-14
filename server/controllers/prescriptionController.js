const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');

// Write massive prescription array into the database linking entities cleanly
exports.issuePrescription = async (req, res) => {
  try {
    const { appointmentId, patientId, diagnosis, medicines, clinicalNotes, pdfBase64 } = req.body;
    const doctorId = req.user.id; // Authorized endpoint inherently

    const rx = new Prescription({
      appointmentId,
      patientId,
      doctorId,
      diagnosis,
      medicines,
      clinicalNotes,
      pdfBase64
    });

    await rx.save();

    // After issuing implicitly complete the underlying Appointment securely
    await Appointment.findByIdAndUpdate(appointmentId, { status: 'completed' });

    res.status(201).json({ message: 'Prescription generated perfectly.', prescription: rx });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Persisting prescription logic failed.' });
  }
};

// Retrieve history generically based on authorization level structurally
exports.getMyPrescriptions = async (req, res) => {
  try {
    const rxList = await Prescription.find({ patientId: req.user.id })
                                     .populate('doctorId', 'fullName')
                                     .sort({ createdAt: -1 });
    res.status(200).json(rxList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed fetching patient history natively.' });
  }
};
