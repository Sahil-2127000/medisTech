const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/send-otp', authController.sendOtp);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/login-2fa-verify', authController.verifyLogin2FA);
router.post('/logout', authController.logout);
router.get('/doctors', authController.getDoctors);

router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.put('/change-password', authMiddleware, userController.changePassword);

router.post('/2fa/setup', authMiddleware, userController.setup2FA);
router.post('/2fa/setup-verify', authMiddleware, userController.verifySetup2FA);
router.post('/2fa/disable', authMiddleware, userController.disable2FA);
router.put('/preferences', authMiddleware, userController.updatePreferences);

module.exports = router;
