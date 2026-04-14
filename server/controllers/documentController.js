const Document = require('../models/Document');
const fs = require('fs');
const path = require('path');

// Upload base64 PDF
exports.uploadDocument = async (req, res) => {
  try {
    const { title, type, patientId, fileBase64, filename } = req.body;
    const doctorId = req.user.id; // From authMiddleware

    if (!fileBase64 || !filename) {
      return res.status(400).json({ message: 'File is required.' });
    }

    // Decode base64 and save to disk
    const base64Data = fileBase64.replace(/^data:application\/pdf;base64,/, "");
    
    // Ensure uploads/documents directory exists
    const dir = path.join(__dirname, '..', 'uploads', 'documents');
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    // Creating unique filename to prevent overwrites
    const uniqueFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
    const filePath = path.join(dir, uniqueFilename);
    
    fs.writeFileSync(filePath, base64Data, 'base64');

    // Make route mapping for static retrieval
    const fileUrl = `http://localhost:5001/uploads/documents/${uniqueFilename}`;

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
