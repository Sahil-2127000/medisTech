const User = require('../models/User');
const Doctor = require('../models/Doctor');

exports.getProfile = async (req, res) => {
  try {
    let targetUser;
    console.log("[USER CONTROLLER] /profile Requested by ID:", req.user.id, "| ROLE:", req.user.role);

    if (req.user.role === 'doctor') {
       targetUser = await Doctor.findById(req.user.id).select('-password');
       if (targetUser && !targetUser.role) targetUser.role = 'doctor';
    } else {
       targetUser = await User.findById(req.user.id).select('-password');
       if (targetUser) targetUser.role = 'patient';
    }

    if (!targetUser) return res.status(404).json({ message: 'Entity structural mapping not found natively' });
    
    // Explicitly inject the role parameter in the payload so the frontend knows who it is!
    const userData = targetUser.toObject();
    userData.role = req.user.role;

    console.log("[USER CONTROLLER] /profile mapping completed. Returning Entity:", userData.email, "| Found in mode:", req.user.role);
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve profile binding strictly' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    console.log("[USER CONTROLLER] PUT /profile incoming body:", updates);
    
    // Forbid mathematical bypass logic against secure tokens natively
    delete updates.password;
    delete updates.role;
    delete updates.email; // Do not mutate primary keys via profile!

    let updatedEntity;

    if (req.user.role === 'doctor') {
       updatedEntity = await Doctor.findByIdAndUpdate(
         req.user.id,
         { $set: updates },
         { new: true, runValidators: true }
       ).select('-password');
    } else {
       // Explicit defense: Patients shouldn't even be mutating clinical variables via this endpoint natively!
       const strictlyPatientUpdates = { fullName: updates.fullName }; // Whitelist only valid patient variables dynamically
       updatedEntity = await User.findByIdAndUpdate(
         req.user.id,
         { $set: strictlyPatientUpdates },
         { new: true, runValidators: true }
       ).select('-password');
    }

    console.log("[USER CONTROLLER] Successfully patched entity natively! Returns:", updatedEntity);
    res.status(200).json({ message: 'Profile dynamically bound safely across isolated tree', user: updatedEntity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Profile injection mutation failed globally navigating tables' });
  }
};
