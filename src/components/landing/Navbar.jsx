import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LINKS = [
  ['#home', 'Home'], ['#about', 'About'], ['#services', 'Services'], ['#doctors', 'Clinics'],
  ['#blog', 'Blog'], ['#faq', 'FAQs'], ['#contact', 'Contact'],
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 lg:relative bg-white/90 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none z-30 w-full pt-[env(safe-area-inset-top)] border-b border-slate-100 lg:border-0">
      <div className="flex items-center justify-between gap-4 px-5 md:px-10 lg:px-16 py-3 lg:py-6 w-full max-w-7xl mx-auto">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2 text-xl lg:text-2xl font-bold text-slate-800 shrink-0">
          <span className="text-blue-600">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L12 22M2 12L22 12" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </span>
          <span>medicsTech</span>
        </a>

        {/* Links (desktop / projector) */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-10 text-[15px] font-medium text-slate-600">
          {LINKS.map(([href, label]) => (
            <a key={href} href={href} className="hover:text-blue-600 transition-colors whitespace-nowrap">{label}</a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link to="/auth" className="block whitespace-nowrap bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 lg:px-6 py-2 lg:py-2.5 rounded-full text-sm lg:text-md font-semibold transition-all shadow-md shadow-blue-500/30">
            Sign in<span className="hidden sm:inline"> / Sign up</span>
          </Link>
          {/* Menu toggle (phones, tablets) */}
          <button
            onClick={() => setOpen(o => !o)}
            aria-label="Menu"
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Dropdown menu */}
      {open && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-5 md:px-10 py-2 shadow-lg">
          {LINKS.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}
              className="block py-3 text-base font-medium text-slate-700 border-b border-slate-50 last:border-0 active:text-blue-600">
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
