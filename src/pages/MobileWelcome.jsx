import React from 'react';
import { useNavigate } from 'react-router-dom';

// App opening screen (phones / Capacitor): one screen, no scrolling, no animation.
const FEATURES = [
  ['Book in seconds', 'Pick a clinic and a free slot', <path key="i" strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />],
  ['Live queue', 'See your token and waiting time', <path key="i" strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />],
  ['Digital prescriptions', 'Download them any time', <path key="i" strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />],
];

const MobileWelcome = () => {
  const navigate = useNavigate();

  return (
    <div className="h-[100dvh] flex flex-col bg-white overflow-hidden">
      {/* Brand panel */}
      <div className="relative flex-1 min-h-0 bg-linear-to-b from-[#3963F9] to-[#1444D8] rounded-b-[2.5rem] flex flex-col items-center justify-end overflow-hidden pt-[env(safe-area-inset-top)]">
        <div className="absolute top-[calc(1.25rem+env(safe-area-inset-top))] left-6 flex items-center gap-2 text-white font-bold text-xl">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L12 22M2 12L22 12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg>
          medisTech
        </div>
        <div className="absolute w-64 h-64 rounded-full border-[14px] border-white/15 bottom-10" />
        <img src="/doctor_auth.png" alt="" className="relative h-[85%] max-h-[340px] object-contain object-bottom" />
      </div>

      {/* Pitch + actions */}
      <div className="shrink-0 px-6 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        <h1 className="text-[26px] leading-tight font-extrabold text-slate-900">Your clinic,<br />in your pocket.</h1>
        <p className="text-sm text-slate-500 mt-2">Trusted clinics across Ludhiana — book, track and keep your records in one app.</p>

        <div className="mt-5 space-y-3">
          {FEATURES.map(([title, sub, icon]) => (
            <div key={title} className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-blue-50 text-[#3963F9] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{icon}</svg>
              </span>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-800 leading-tight">{title}</div>
                <div className="text-xs text-slate-400">{sub}</div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/auth', { state: { mode: 'signup' } })}
          className="mt-6 w-full bg-[#3963F9] active:bg-[#2c50d8] text-white font-bold py-3.5 rounded-2xl text-base shadow-lg shadow-blue-500/25">
          Get Started
        </button>
        <button onClick={() => navigate('/auth', { state: { mode: 'login' } })}
          className="mt-3 w-full text-[#3963F9] font-bold py-3 rounded-2xl text-base bg-blue-50 active:bg-blue-100">
          I already have an account
        </button>
      </div>
    </div>
  );
};

export default MobileWelcome;
