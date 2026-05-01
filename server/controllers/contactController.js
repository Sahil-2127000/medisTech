const Contact = require('../models/Contact');
const Doctor = require('../models/Doctor');
const { sendEmail } = require('../utils/emailService');

exports.submitContact = async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;
    
    if (!name || !phone || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Save to database
    const newContact = await Contact.create({ name, phone, email, message });

    // Find the doctor's email
    const doctor = await Doctor.findOne();
    const doctorEmail = doctor ? doctor.email : process.env.SMTP_USER;

    // Send email to the doctor
    const doctorHtml = `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;
    await sendEmail(doctorEmail, 'New Patient Inquiry via MedisTech', doctorHtml);

    // Send confirmation email to the patient
    const patientHtml = `
      <h3>Thank you for reaching out, ${name}!</h3>
      <p>We have received your message and will get back to you as soon as possible.</p>
      <p><strong>Your Message:</strong></p>
      <blockquote style="border-left: 4px solid #3963F9; padding-left: 10px; margin-left: 0; color: #555;">
        ${message}
      </blockquote>
      <br />
      <p>Best Regards,</p>
      <p><strong>MedisTech</strong></p>
    `;
    await sendEmail(email, 'We have received your inquiry', patientHtml);

    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ success: false, message: 'Server error processing your request' });
  }
};
