const User = require('../models/User');
const Doctor = require('../models/Doctor');
const bcrypt = require('bcryptjs');

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
       const strictlyPatientUpdates = {};
       if (updates.fullName !== undefined) strictlyPatientUpdates.fullName = updates.fullName;
       if (updates.phone !== undefined) strictlyPatientUpdates.phone = updates.phone;
       if (updates.age !== undefined) strictlyPatientUpdates.age = updates.age;
       if (updates.gender !== undefined) strictlyPatientUpdates.gender = updates.gender;
       
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

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ message: 'Missing required password fields.' });

    let targetUser;
    if (req.user.role === 'doctor') {
       targetUser = await Doctor.findById(req.user.id);
    } else {
       targetUser = await User.findById(req.user.id);
    }
    
    if (!targetUser) return res.status(404).json({ message: 'Entity structural mapping not found natively.' });

    // Enforce 24-hour limit structurally mapped over physical time bounds
    console.log("[DEBUG] lastPasswordChange from DB in changePassword:", targetUser.lastPasswordChange);
    if (targetUser.lastPasswordChange) {
       const twentyFourHours = 24 * 60 * 60 * 1000;
       const timeSinceLastChange = Date.now() - new Date(targetUser.lastPasswordChange).getTime();
       console.log("[DEBUG] timeSinceLastChange (ms):", timeSinceLastChange, "| vs Limit:", twentyFourHours);
       if (timeSinceLastChange < twentyFourHours) {
          const hoursLeft = Math.ceil((twentyFourHours - timeSinceLastChange) / (60 * 60 * 1000));
          console.log("[DEBUG] Aborting password change. Hours left:", hoursLeft);
          return res.status(400).json({ message: 'For security reasons, password changes are limited to once every 24 hours. Please try again later.' });
       }
    }

    const isMatch = await bcrypt.compare(oldPassword, targetUser.password);
    if (!isMatch) return res.status(400).json({ message: 'The old password you provided is incorrectly mapped.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Natively forcefully mutate the exact DB records bypassing any weird hooks or strict caches
    if (req.user.role === 'doctor') {
       await Doctor.findByIdAndUpdate(req.user.id, { password: hashedPassword, lastPasswordChange: new Date() });
    } else {
       await User.findByIdAndUpdate(req.user.id, { password: hashedPassword, lastPasswordChange: new Date() });
    }

    res.status(200).json({ message: 'Password securely mutated across isolated layers.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server core failed securely patching password.' });
  }
};

exports.setup2FA = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone number explicitly required for 2FA' });

    let targetUser = req.user.role === 'doctor' ? await Doctor.findById(req.user.id) : await User.findById(req.user.id);
    if (!targetUser) return res.status(404).json({ message: 'User mapping failed natively' });

    const smsOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[SMS MOCK] Sending 2FA Verification OTP ${smsOtp} to phone ${phone}`);
    
    targetUser.twoFactorOTP = smsOtp;
    targetUser.twoFactorOTPExpires = Date.now() + 1 * 60 * 1000; // 60 seconds duration
    
    if (req.user.role === 'doctor') {
       await Doctor.findByIdAndUpdate(req.user.id, { twoFactorOTP: smsOtp, twoFactorOTPExpires: targetUser.twoFactorOTPExpires });
    } else {
       await User.findByIdAndUpdate(req.user.id, { twoFactorOTP: smsOtp, twoFactorOTPExpires: targetUser.twoFactorOTPExpires });
    }

    res.status(200).json({ message: 'Verification OTP blasted to mapped mobile.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Core failed initiating SMS verification.' });
  }
};

exports.verifySetup2FA = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    let targetUser = req.user.role === 'doctor' ? await Doctor.findById(req.user.id) : await User.findById(req.user.id);

    if (targetUser.twoFactorOTP !== otp) return res.status(400).json({ message: 'Invalid OTP natively mapped.' });
    if (targetUser.twoFactorOTPExpires < Date.now()) return res.status(400).json({ message: 'OTP physically expired.' });

    // Enable it rigidly
    if (req.user.role === 'doctor') {
       await Doctor.findByIdAndUpdate(req.user.id, { is2FAEnabled: true, twoFactorPhone: phone, twoFactorOTP: '', twoFactorOTPExpires: null });
    } else {
       await User.findByIdAndUpdate(req.user.id, { is2FAEnabled: true, twoFactorPhone: phone, twoFactorOTP: '', twoFactorOTPExpires: null });
    }

    res.status(200).json({ message: 'Two-Factor Authentication firmly locked and active.' });
  } catch (err) {
    res.status(500).json({ message: 'Core structurally failed processing 2FA save.' });
  }
};

exports.disable2FA = async (req, res) => {
  try {
    if (req.user.role === 'doctor') {
       await Doctor.findByIdAndUpdate(req.user.id, { is2FAEnabled: false, twoFactorPhone: '', twoFactorOTP: '', twoFactorOTPExpires: null });
    } else {
       await User.findByIdAndUpdate(req.user.id, { is2FAEnabled: false, twoFactorPhone: '', twoFactorOTP: '', twoFactorOTPExpires: null });
    }
    res.status(200).json({ message: 'Two-Factor Authentication cleanly disabled.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed dissolving 2FA natively' });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const { emailNotifications, smsNotifications } = req.body;
    const updates = {};
    if (emailNotifications !== undefined) updates.emailNotifications = emailNotifications;
    if (smsNotifications !== undefined) updates.smsNotifications = smsNotifications;

    let updated;
    if (req.user.role === 'doctor') {
      updated = await Doctor.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true }).select('-password');
    } else {
      updated = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true }).select('-password');
    }
    
    res.status(200).json({ message: 'Preferences updated dynamically.', user: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update user preferences natively.' });
  }
};
