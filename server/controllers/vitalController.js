const Vital = require('../models/Vital');

// Get all vitals for the logged-in patient
exports.getMyVitals = async (req, res) => {
  try {
    const vitals = await Vital.find({ patientId: req.user._id }).sort({ recordedAt: -1 });
    res.json(vitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new vital entry
exports.addVital = async (req, res) => {
  try {
    const { type, value, unit, note, recordedAt } = req.body;
    const newVital = new Vital({
      patientId: req.user._id,
      type,
      value,
      unit,
      note,
      recordedAt: recordedAt || Date.now()
    });
    await newVital.save();
    res.status(201).json(newVital);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get trend for a specific vital type
exports.getVitalTrend = async (req, res) => {
  try {
    const { type } = req.params;
    const vitals = await Vital.find({ 
      patientId: req.user._id, 
      type: type 
    })
    .sort({ recordedAt: 1 })
    .limit(10);
    res.json(vitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
