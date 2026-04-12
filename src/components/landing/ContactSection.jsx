import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const ContactSection = () => {
  const panelVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 1, ease: "easeOut" } 
    }
  };

  return (
    <section id="contact" className="w-full max-w-7xl mx-auto px-8 md:px-16 py-24">
      <div className="bg-blue-500 rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col md:flex-row">
        
        {/* Background Decorative Shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

        {/* Left Side: Contact Form */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={panelVariants}
          className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 relative z-10 bg-white md:rounded-r-[3rem]"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Get in Touch</h2>
          <p className="text-slate-500 mb-8 text-sm">
            We are here to help you feel your best. Reach out to schedule a consultation.
          </p>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" placeholder="John Doe" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input type="tel" placeholder="+91 000000000" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" placeholder="john@gmail.com" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Message / Best Time to Call</label>
              <textarea placeholder="How can we help you?" rows="3" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"></textarea>
            </div>
            
            <button type="button" className="w-full bg-slate-900 hover:scale-[1.02] hover:bg-slate-800 text-white rounded-xl px-4 py-3.5 font-medium transition-all shadow-lg shadow-slate-900/20">
              Request Appointment
            </button>
          </form>
        </motion.div>

        {/* Right Side: Contact Info */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.2 }}
          variants={panelVariants}
          className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 relative z-10 flex flex-col justify-center text-white"
        >
          <h3 className="text-3xl font-bold mb-20">Contact Information</h3>
          
          <div className="space-y-8 -mt-6">
            <div className="flex items-start gap-4 hover:translate-x-2 transition-transform cursor-default">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">📍</div>
              <div>
                <p className="text-blue-100 text-md font-medium">Clinic Address</p>
                <p className="text-lg">123, Sarabha Nagar,<br/>Ludhiana, Punjab, 141001</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 hover:translate-x-2 transition-transform cursor-pointer">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 lg:w-6 lg:h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM19 12h2a9 9 0 00-9-9v2c3.87 0 7 3.13 7 7zm-4 0h2c0-2.76-2.24-5-5-5v2c1.66 0 3 1.34 3 3z"/>
                </svg>
              </div>
              <div>
                <p className="text-blue-100 text-md font-medium">Phone Number</p>
                <p className="text-lg">+91 987654321</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 hover:translate-x-2 transition-transform cursor-pointer">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Gmail_Icon_%282013-2020%29.svg/250px-Gmail_Icon_%282013-2020%29.svg.png" 
                  alt="Gmail" 
                  className="w-5 h-5 lg:w-6 lg:h-6 object-contain"
                />
              </div>
              <div>
                <p className="text-blue-100 text-md font-medium">Email Address</p>
                <p className="text-lg">anandkumarclinic@gmail.com</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 hover:translate-x-2 transition-transform cursor-default">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">🕒</div>
              <div>
                <p className="text-blue-100 text-md font-medium">Clinic Timings</p>
                <p className="text-lg">Mon – Sat: 9:00 AM – 6:00 PM<br/>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default ContactSection;
