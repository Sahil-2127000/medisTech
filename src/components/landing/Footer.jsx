import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-white pt-20 pb-8 mt-12 border-t border-slate-100 relative z-10">
      <div className="max-w-7xl mx-auto px-8 md:px-16 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 text-2xl font-bold text-slate-800 mb-4">
            <div className="text-blue-600">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M12 2L12 22M2 12L22 12" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
               </svg>
            </div>
            <span>Nursing</span>
          </div>
          <p className="text-slate-500 text-sm mb-6">
            Copyright © 2023 Nursing All rights reserved.
          </p>
          <div className="flex gap-4">
            {/* Social Icons Placeholders */}
            <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-colors">in</a>
            <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-colors">tw</a>
            <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-colors">fb</a>
          </div>
        </div>

        {/* About */}
        <div>
          <h4 className="font-bold text-slate-900 mb-6">About</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-colors">Virtual tours</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-colors">Patients Portal</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-colors">Quality & Safety</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-colors">Location & Map</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-colors">Education & Training</a></li>
          </ul>
        </div>

        {/* I want to */}
        <div>
          <h4 className="font-bold text-slate-900 mb-6">I want to</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><a href="#" className="hover:text-blue-600 transition-colors">Request an appointment</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-colors">Find a doctor</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-colors">Get supplies</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-colors">Learn condition</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-colors">Make a referral</a></li>
          </ul>
        </div>

        {/* Public Relation */}
        <div>
          <h4 className="font-bold text-slate-900 mb-6">Public Relation</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-colors">Patient right</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-colors">Contact Us</a></li>
          </ul>
        </div>

      </div>

      
    </footer>
  );
};

export default Footer;
