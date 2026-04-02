const Availability = require('../models/Availability');

exports.getConfig = async (req, res) => {
  try {
    const doctorId = req.user.id;
    
    let config = await Availability.findOne({ doctorId });
    
    if (!config) {
      // Create intelligent default structure if none natively exists 
      config = new Availability({ doctorId });
      await config.save();
    }
    
    res.status(200).json(config);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ message: 'Failed to fetch availability mapping from database' });
  }
};

exports.upsertConfig = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { weeklyConfig, slotDuration, bufferTime, blackoutDates } = req.body;

    // Use findOneAndUpdate with upsert cleanly
    const config = await Availability.findOneAndUpdate(
      { doctorId },
      { weeklyConfig, slotDuration, bufferTime, blackoutDates },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ message: 'Availability schedule synced deeply successfully', config });
  } catch (error) {
    console.error('Error strictly syncing availability:', error);
    res.status(500).json({ message: 'Server database explicitly failed to map updates' });
  }
};
