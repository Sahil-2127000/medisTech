import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ContactSection = ({ contactInfo = {} }) => {
  const { address = '', phone = '', email = '' } = contactInfo;
  const panelVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 1, ease: "easeOut" } 
    }
  };

  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [showCallModal, setShowCallModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', text: '' });

    try {
      const response = await fetch('http://localhost:5001/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setStatus({ type: 'success', text: 'Your message has been sent successfully! We will contact you soon.' });
        setFormData({ name: '', phone: '', email: '', message: '' });
      } else {
        setStatus({ type: 'error', text: data.message || 'Failed to send message.' });
      }
    } catch (err) {
      setStatus({ type: 'error', text: 'Network error. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="w-full max-w-7xl mx-auto px-8 md:px-16 min-h-screen flex flex-col items-center justify-center py-12">
      <div className="w-full bg-blue-500 rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col md:flex-row">
        
        {/* Background Decorative Shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

        {/* Left Side: Contact Form */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={panelVariants}
          className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 relative z-10 bg-white md:rounded-r-[3rem]"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Get in Touch</h2>
          <p className="text-slate-500 mb-8 text-sm">
            We are here to help you feel your best. Reach out to schedule a consultation.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Sahil Maurya" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+91 9876543210" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="email@gmail.com" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Message / Preferred Call Time</label>
              <textarea name="message" value={formData.message} onChange={handleChange} required placeholder="Tell us about your concern and mention a suitable time for us to contact you back..." rows="3" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"></textarea>
            </div>
            
            {status.text && (
              <div className={`text-sm font-medium p-3 rounded-lg ${status.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {status.text}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:scale-[1.02] hover:bg-slate-800 text-white rounded-xl px-4 py-3.5 font-medium transition-all shadow-lg shadow-slate-900/20 disabled:opacity-70 disabled:hover:scale-100">
              {loading ? 'Sending...' : 'Contact Us'}
            </button>
          </form>
        </motion.div>

        {/* Right Side: Contact Info */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          transition={{ delay: 0.2 }}
          variants={panelVariants}
          className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 relative z-10 flex flex-col justify-center text-white"
        >
          <h3 className="text-3xl font-bold mb-20">Contact Information</h3>
          
          <div className="space-y-8 -mt-6">
            <div className="flex items-start gap-4 hover:translate-x-2 transition-transform cursor-default group">
              <div className="w-10 h-10 bg-white/10 group-hover:bg-white/20 rounded-full flex items-center justify-center shrink-0 transition-colors">📍</div>
              <div>
                <p className="text-blue-100 text-md font-medium">Clinic Address</p>
                <p className="text-lg"> {address} </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 hover:translate-x-2 transition-transform cursor-default group">
              <div className="w-10 h-10 bg-white/10 group-hover:bg-white/20 rounded-full flex items-center justify-center shrink-0 transition-colors">
                <svg className="w-5 h-5 lg:w-6 lg:h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM19 12h2a9 9 0 00-9-9v2c3.87 0 7 3.13 7 7zm-4 0h2c0-2.76-2.24-5-5-5v2c1.66 0 3 1.34 3 3z"/>
                </svg>
              </div>
              <div>
                <p className="text-blue-100 text-md font-medium">Phone Number</p>
                <button 
                  onClick={() => setShowCallModal(true)} 
                  className="text-lg cursor-pointer transition-all hover:text-white text-left outline-none"
                >
                  {phone}
                </button>
              </div>
            </div>
            
            <div className="flex items-start gap-4 hover:translate-x-2 transition-transform cursor-default group">
              <div className="w-10 h-10 bg-white/10 group-hover:bg-white/20 rounded-full flex items-center justify-center shrink-0 overflow-hidden transition-colors">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Gmail_Icon_%282013-2020%29.svg/250px-Gmail_Icon_%282013-2020%29.svg.png" 
                  alt="Gmail" 
                  className="w-5 h-5 lg:w-6 lg:h-6 object-contain"
                />
              </div>
              <div>
                <p className="text-blue-100 text-md font-medium">Email Address</p>
                <a 
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg cursor-pointer transition-all"
                >
                  {email}
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-4 hover:translate-x-2 transition-transform cursor-default group">
              <div className="w-10 h-10 bg-white/10 group-hover:bg-white/20 rounded-full flex items-center justify-center shrink-0 transition-colors">🕒</div>
              <div>
                <p className="text-blue-100 text-md font-medium">Contact Timings</p>
                <p className="text-lg">Mon – Sat: 9:00 AM – 6:00 PM<br/>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Call Confirmation Modal */}
      <AnimatePresence>
        {showCallModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCallModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            {/* Modal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden px-7 py-10 flex flex-col items-center text-center"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowCallModal(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>

              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-8 text-blue-500">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM19 12h2a9 9 0 00-9-9v2c3.87 0 7 3.13 7 7zm-4 0h2c0-2.76-2.24-5-5-5v2c1.66 0 3 1.34 3 3z"/>
                </svg>
              </div>

              <h3 className="text-3xl font-bold text-slate-800 mb-2">Call Clinic</h3>
              <p className="text-blue-900/60 font-medium mb-8">
                Would you like to initiate a call to our clinic?
              </p>

              <div className="w-full flex flex-col justify-center items-center space-y-4">
                <a 
                  href={`tel:${phone}`}
                  onClick={() => setShowCallModal(false)}
                  className="w-fit bg-[#1da1f2] hover:bg-[#1991db] text-white font-bold px-15 py-3 rounded-2xl transition-all shadow-xl shadow-blue-400/30 flex items-center justify-center gap-3 text-lg"
                >
                  <span>{phone}</span>
                </a>
                
                <button 
                  onClick={() => setShowCallModal(false)}
                  className="w-full bg-transparent text-slate-400 hover:text-slate-600 font-bold px-3 py-2 rounded-xl transition-all text-md"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};



export default ContactSection;
