const Document = require('../models/Document');
const { saveUpload } = require('../utils/fileStorage');

// Upload a base64 file (PDF or image)
exports.uploadDocument = async (req, res) => {
  try {
    const { title, type, fileBase64, filename } = req.body;
    const isDoctor = req.user.role === 'doctor';
    // Patients upload into their own records; doctors upload for the selected patient
    const patientId = isDoctor ? req.body.patientId : req.user.id;
    const doctorId = isDoctor ? req.user.id : undefined;

    if (!fileBase64 || !filename || !title) {
      return res.status(400).json({ message: 'Title and file are required.' });
    }

    // Cloudinary when configured (survives Render restarts), otherwise the local uploads/ folder
    const fileUrl = await saveUpload({ dataUrl: fileBase64, filename, folder: 'documents' }, req);

    const newDoc = new Document({
      title,
      type,
      patientId,
      doctorId,
      fileUrl
    });

    await newDoc.save();

    res.status(201).json({ message: 'Document uploaded perfectly.', document: newDoc });
  } catch (error) {
    console.error("Document Upload Error", error);
    res.status(500).json({ message: 'Failed to upload document.' });
  }
};

// Retrieve docs based on role context
exports.getMyDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ patientId: req.user.id })
                               .populate('doctorId', 'fullName')
                               .sort({ createdAt: -1 });

    // Segregate natively for frontend payload optimizations
    const labResults = docs.filter(d => d.type === 'lab');
    const reports = docs.filter(d => d.type === 'report');

    res.status(200).json({ labResults, reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed fetching patient documents natively.' });
  }
};
