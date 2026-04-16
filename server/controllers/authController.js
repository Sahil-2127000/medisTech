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
    //otp send template
const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table width="500" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                    
                    <tr><td height="6" style="background-color: #3b82f6;"></td></tr>

                    <tr>
                        <td align="center" style="padding: 40px 40px 20px 40px;">
                            <div style="color: #3b82f6; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
                                Secure Verification
                            </div>
                            <h1 style="margin: 0; color: #1e293b; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">
                                Medistech
                            </h1>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding: 0 40px 40px 40px;">
                            <p style="color: #64748b; font-size: 15px; line-height: 24px; margin: 0 0 32px 0;">
                                Welcome to Medistech. To ensure your healthcare records remain secure, please enter the following code to verify your identity.
                            </p>
                            
                            <div style="background-color: #f1f5f9; border-radius: 12px; padding: 24px; border: 1px dashed #cbd5e1;">
                                <span style="font-family: 'Courier New', Courier, monospace; font-size: 42px; font-weight: 700; color: #0f172a; letter-spacing: 12px;">
                                    ${otpCode}
                                </span>
                            </div>

                            <p style="color: #94a3b8; font-size: 13px; margin: 32px 0 0 0;">
                                Code expires in: <span style="color: #3b82f6; font-weight: 600;">10 minutes</span>
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="background-color: #0f172a; padding: 32px 40px;">
                            <p style="color: #94a3b8; font-size: 12px; margin: 0; line-height: 20px;">
                                <strong>Medistech Healthcare</strong><br>
                                Compassionate Care, Exceptional Medicine.
                            </p>
                            <p style="color: #475569; font-size: 11px; margin-top: 12px;">
                                If you did not request this, please ignore this email.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
    
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
       // Generate Unique Patient UID strictly natively
       let patientUid;
       let isUnique = false;
       while (!isUnique) {
         const digits = Math.floor(100000 + Math.random() * 900000);
         patientUid = `P${digits}`;
         const existingUid = await User.findOne({ patientUid });
         if (!existingUid) isUnique = true;
       }
       newlyCreatedEntity = new User({ fullName, email, password: hashedPassword, role: 'patient', age, gender, phone, patientUid });
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

    // If 2FA is formally enabled, halt login and require OTP phase
    if (targetUser.is2FAEnabled && targetUser.twoFactorPhone) {
        // Generate a 6-digit SMS OTP
        const smsOtp = Math.floor(100000 + Math.random() * 900000).toString();
        // Since we don't have a live Twilio key, simulate SMS transmission
        console.log(`[SMS MOCK] Sending OTP ${smsOtp} to phone ${targetUser.twoFactorPhone} for login...`);
        
        targetUser.twoFactorOTP = smsOtp;
        targetUser.twoFactorOTPExpires = Date.now() + 1 * 60 * 1000; // 60 seconds duration
        await targetUser.save();
        
        return res.status(200).json({
           requires2FA: true,
           userId: targetUser._id,
           role: targetUser.role,
           message: `OTP sent to ${targetUser.twoFactorPhone.replace(/.(?=.{4})/g, '*')}`
        });
    }

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

exports.verifyLogin2FA = async (req, res) => {
   const { userId, role, otp } = req.body;
   try {
     let targetUser = role === 'doctor' ? await Doctor.findById(userId) : await User.findById(userId);
     if (!targetUser) return res.status(404).json({ message: 'User not found natively' });

     if (targetUser.twoFactorOTP !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
     }
     if (targetUser.twoFactorOTPExpires < Date.now()) {
        return res.status(400).json({ message: 'OTP has expired' });
     }

     // Auth success
     targetUser.twoFactorOTP = '';
     targetUser.twoFactorOTPExpires = null;
     await targetUser.save();

     // Log them in properly
     const token = jwt.sign(
       { id: targetUser._id, email: targetUser.email, role: targetUser.role }, 
       JWT_SECRET, 
       { expiresIn: '7d' }
     );

     res.cookie('token', token, {
       httpOnly: true,
       secure: process.env.NODE_ENV === 'production',
       sameSite: 'lax',
       maxAge: 7 * 24 * 60 * 60 * 1000
     });

     res.status(200).json({
       message: '2FA Login dynamically authenticated',
       user: { id: targetUser._id, fullName: targetUser.fullName, email: targetUser.email, role: targetUser.role }
     });
   } catch (err) {
     res.status(500).json({ message: 'Failed to verify 2FA login sequence' });
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

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};
