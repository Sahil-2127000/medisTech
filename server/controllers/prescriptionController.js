const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const { sendEmail } = require('../utils/emailService');

const capitalizeNames = (name) => {
  if (!name) return name;
  return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

// Write massive prescription array into the database linking entities cleanly
exports.issuePrescription = async (req, res) => {
  try {
    const { appointmentId, patientId, diagnosis, medicines, clinicalNotes, pdfBase64 } = req.body;
    // We are optimizing DB weight by potentially receiving empty pdfBase64
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
    const appt = await Appointment.findByIdAndUpdate(appointmentId, { status: 'completed' })
                                  .populate('patientId', 'fullName email emailNotifications')
                                  .populate('doctorId', 'fullName');

    // Send Completion Email natively
    if (appt && appt.patientId && appt.patientId.email && appt.patientId.emailNotifications !== false) {
       const pName = capitalizeNames(appt.patientId.fullName);
       const dName = capitalizeNames(appt.doctorId.fullName);
       
       const subject = "Consultation Completed - Clinic@Flow";
       const html = `<h2>Hello ${pName},</h2>
                    <p>Your consultation with <strong>Dr. ${dName}</strong> is now complete.</p>
                    <p>Your prescription and clinical notes are available in your patient dashboard under "Medical Documents".</p>
                    <p>Stay healthy!</p>`;
       await sendEmail(appt.patientId.email, subject, html);
    }

    // Trigger Socket.io natively to notify all participants of the queue shift
    const io = req.app.get('socketio');
    if (io) {
      io.emit('queueUpdated', { 
        doctorId: doctorId.toString(),
        patientId: patientId.toString(),
        type: 'prescription_issued'
      });
    }

    res.status(201).json({ message: 'Prescription generated perfectly.', prescription: rx });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Persisting prescription logic failed.' });
  }
};

// Retrieve history generically based on authorization level structurally
exports.getMyPrescriptions = async (req, res) => {
  try {
    console.log("[PRESCRIPTION CONTROLLER] Fetching prescriptions for Patient ID:", req.user.id);
    const rxList = await Prescription.find({ patientId: req.user.id })
                                     .populate('doctorId', 'fullName')
                                     .sort({ createdAt: -1 });
    
    console.log(`[PRESCRIPTION CONTROLLER] Found ${rxList.length} prescriptions for user ${req.user.id}`);
    res.status(200).json(rxList);
  } catch (error) {
    console.error("[PRESCRIPTION CONTROLLER] Error:", error);
    res.status(500).json({ message: 'Failed fetching patient history natively.' });
  }
};
