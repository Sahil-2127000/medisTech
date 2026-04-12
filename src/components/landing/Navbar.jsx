import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-8 md:px-16 py-6 bg-transparent relative z-20 w-full max-w-7xl mx-auto">
      {/* Logo */}
      <div className="flex items-center gap-2 text-2xl font-bold text-slate-800">
        <div className="text-blue-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
             <path d="M12 2L12 22M2 12L22 12" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        </div>
        <span>medisTech</span>
      </div>
      
      {/* Links */}
      <div className="hidden md:flex items-center gap-8 text-md font-medium text-slate-600">
        <a href="#home" className="hover:text-blue-600 transition-colors">Home</a>
        <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
        <a href="#services" className="hover:text-blue-600 transition-colors">Services</a>
        <a href="#blog" className="hover:text-blue-600 transition-colors">Blog</a>
        <a href="#faq" className="hover:text-blue-600 transition-colors">FAQs</a>
        <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-6">
        <button className="text-slate-600 hover:text-slate-900 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        </button>
        <Link to="/auth" className="block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2.5 rounded-full text-md font-semibold transition-all shadow-md shadow-blue-500/30">
          Sign in / Sign up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
