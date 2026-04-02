const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const { sendEmail } = require('../utils/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development';

// In-memory OTP store (email -> { otp, expiresAt })
const otps = {};

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const existingPatient = await User.findOne({ email });
    const existingDoctor = await Doctor.findOne({ email });
    
    if (existingPatient || existingDoctor) {
      return res.status(400).json({ message: 'User already exists with this email across any clinical role' });
    }
  } catch (error) {
    console.error('Database Error:', error);
    return res.status(500).json({ message: 'Failed to verify email against database ecosystem' });
  }

  // Generate a random 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Save OTP in memory expiring in 10 minutes
  otps[email] = {
    otp: otpCode,
    expiresAt: Date.now() + 10 * 60 * 1000, 
  };

  try {
    const html = `<h2>Welcome to Clinic@Flow!</h2><p>Your verification code is: <strong>${otpCode}</strong></p><p>This code will expire in 10 minutes.</p>`;
    
    // Attempt to send email using standard utility service
    await sendEmail(email, 'Your Verification Code', html);
    
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log(`[TEST MODE] SMTP not configured. OTP for ${email} is: ${otpCode}`);
    }

    res.status(200).json({ message: 'OTP sent to email successfully' });
  } catch (error) {
    console.error('Error sending email:', error.message);
    console.log(`[TEST MODE FALLBACK] Real email failed, but here is OTP: ${otpCode}`);
    // Return 200 so the frontend can still proceed with OTP verification
    res.status(200).json({ message: 'OTP generated locally (Email sending failed due to credentials)' });
  }
};

exports.register = async (req, res) => {
  const { fullName, email, password, otp, role, age, gender, phone } = req.body;

  if (!fullName || !email || !password || !otp) {
    return res.status(400).json({ message: 'All fields including OTP are required' });
  }

  try {
    // Structural Isolation logic handling distinct databases
    const existingPatient = await User.findOne({ email });
    const existingDoctor = await Doctor.findOne({ email });
    
    if (existingPatient || existingDoctor) {
      return res.status(400).json({ message: 'Entity already exists with this email' });
    }

    // Validate OTP
    const record = otps[email];
    if (!record) {
      return res.status(400).json({ message: 'No OTP requested for this email' });
    }
    if (Date.now() > record.expiresAt) {
      return res.status(400).json({ message: 'OTP has expired' });
    }
    if (record.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP verified successfully. Remove from memory.
    delete otps[email];

    // Cryptographic Salting & Hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Register user explicitly dynamically splitting schemas
    let newlyCreatedEntity;
    let actualRole = role === 'doctor' ? 'doctor' : 'patient';

    if (actualRole === 'doctor') {
       newlyCreatedEntity = new Doctor({ fullName, email, password: hashedPassword, role: 'doctor', phone });
    } else {
       newlyCreatedEntity = new User({ fullName, email, password: hashedPassword, role: 'patient', age, gender, phone });
    }
    await newlyCreatedEntity.save();

    // Sign JWT (Inject role into JWT natively so middlewares can check authorization)
    const token = jwt.sign(
      { id: newlyCreatedEntity._id, email: newlyCreatedEntity.email, role: actualRole }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    // Set Secure HttpOnly Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      message: 'Registered successfully mapped to physical split collections',
      user: { id: newlyCreatedEntity._id, fullName: newlyCreatedEntity.fullName, email: newlyCreatedEntity.email, role: actualRole }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Registration failed due to server error routing split DBs' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Intelligent hunt natively routing sequentially via isolated bodies
    let targetUser = await User.findOne({ email });
    
    if (!targetUser) {
        targetUser = await Doctor.findOne({ email });
    }

    if (!targetUser) {
      return res.status(401).json({ message: 'Invalid email structurally absent from all nodes' });
    }

    // Cryptographic comparative hash match check
    const isMatch = await bcrypt.compare(password, targetUser.password);
    if (!isMatch) {
       return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Sign JWT including role natively (targetUser inherently has .role)
    const token = jwt.sign(
      { id: targetUser._id, email: targetUser.email, role: targetUser.role }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    // Set Secure HttpOnly Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      message: 'Login dynamically routed and successful',
      user: { id: targetUser._id, fullName: targetUser.fullName, email: targetUser.email, role: targetUser.role }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Login natively crashed hunting distinct bases' });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().select('-password');
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Failed to extract Doctor schemas directly' });
  }
};
