import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-white pt-20 pb-8 mt-12 border-t border-slate-100 relative z-10">
      <div className="max-w-7xl mx-auto px-8 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        
        {/* Column 1: Brand & OVERVIEW */}
        <div>
          <div className="flex items-center gap-2 text-2xl font-bold text-slate-800 mb-4">
            <div className="text-blue-600">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M12 2L12 22M2 12L22 12" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
               </svg>
            </div>
            <span>medisTech</span>
          </div>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Delivering personalized, high-quality healthcare and expert medical advice for you and your family.
          </p>
          <div className="flex gap-4 mb-6">
            <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-colors">in</a>
            <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-colors">tw</a>
            <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-colors">fb</a>
          </div>
          <p className="text-slate-400 text-xs">
            Copyright © 2026 Dr. Anand Kumar Clinic. <br/>All rights reserved.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="font-bold text-slate-900 mb-6 text-lg">Quick Links</h4>
          <ul className="space-y-4 text-sm text-slate-500 font-medium">
            <li><a href="#home" className="hover:text-blue-600 transition-colors inline-block">Home</a></li>
            <li><a href="#about" className="hover:text-blue-600 transition-colors inline-block">About Dr. Anand Kumar</a></li>
            <li><a href="#services" className="hover:text-blue-600 transition-colors inline-block">Our Services</a></li>
            <li><a href="#blog" className="hover:text-blue-600 transition-colors inline-block">Health Insights (Blog)</a></li>
            <li><a href="#faq" className="hover:text-blue-600 transition-colors inline-block">FAQs</a></li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div>
          <h4 className="font-bold text-slate-900 mb-6 text-lg">Clinic Info</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 text-base mt-0.5">📍</span>
              <span>123, Sarabha Nagar,<br/>Ludhiana, Punjab, 141001</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-blue-600 flex items-center justify-center">
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM19 12h2a9 9 0 00-9-9v2c3.87 0 7 3.13 7 7zm-4 0h2c0-2.76-2.24-5-5-5v2c1.66 0 3 1.34 3 3z"/>
                </svg>
              </span>
              <span className="font-medium text-slate-700">+91 987654321</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex items-center justify-center overflow-hidden">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Gmail_Icon_%282013-2020%29.svg/250px-Gmail_Icon_%282013-2020%29.svg.png" 
                  alt="Gmail" 
                  className="w-4 h-4 lg:w-5 lg:h-5 object-contain drop-shadow-sm"
                />
              </span>
              <span>anandkumarclinic@gmail.com</span>
            </li>
            <li className="flex items-start gap-3 pt-2">
              <span className="text-blue-600 text-base mt-0.5">🕒</span>
              <span>Mon – Sat: 9:00 AM – 6:00 PM<br/>Sunday: Closed</span>
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
