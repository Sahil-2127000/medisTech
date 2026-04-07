import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="px-8 md:px-16 pb-20 pt-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
      {/* Left Content */}
      <div className="space-y-8">
        {/* Reviews Pill */}
        <div className="flex items-center gap-2 text-sm text-clinic-200 font-medium bg-clinic-900/40 w-max px-4 py-2 rounded-full backdrop-blur-sm border border-clinic-600/30">
          <div className="flex text-yellow-400 text-lg">★ ★ ★ ★ ★</div>
          <span>Trusted by 5k+ Patients</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
          Because Clinic <br /> Management <br /> Is Complicated <br /> Enough.<span className="text-orange-500">🔥</span>
        </h1>

        {/* Objectives / Subtext */}


        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <Link to="/auth" className="bg-white text-clinic-900 hover:bg-clinic-200 px-8 py-3.5 rounded-full font-bold transition-colors shadow-xl">
            Book Appointment
          </Link>

          <button className="flex items-center gap-3 text-white font-medium hover:text-clinic-200 transition-colors group">
            <div className="w-12 h-12 bg-yellow-400 text-clinic-900 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform pl-1">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            Watch Demo
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8 pt-12 border-t border-clinic-600/30 mt-8">
          <div>
            <div className="text-3xl font-bold">10K+</div>
            <div className="text-xs text-clinic-400 mt-1 uppercase tracking-wider">Satisfied<br />Patients</div>
          </div>
          <div className="w-px h-12 bg-clinic-600/30"></div>
          <div>
            <div className="text-3xl font-bold">1M+</div>
            <div className="text-xs text-clinic-400 mt-1 uppercase tracking-wider">Tokens<br />Generated</div>
          </div>
          <div className="w-px h-12 bg-clinic-600/30"></div>
          <div>
            <div className="text-3xl font-bold">99%</div>
            <div className="text-xs text-clinic-400 mt-1 uppercase tracking-wider">Uptime &<br />Reliability</div>
          </div>
        </div>
      </div>

      {/* Right Content (Image) */}
      <div className="relative flex justify-center lg:justify-end h-full min-h-[500px]">
        {/* Background design circle/element behind the doctor */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-clinic-600/30 rounded-full blur-3xl"></div>

        {/* The user-modified doctor image logic */}
        <img
          src="/doctor_logo.png"
          alt="Medical Practitioner"
          className="relative z-10 w-full max-w-[550px] object-contain drop-shadow-2xl translate-y-[-7rem]"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/550x700/052659/C1E8FF.png?text=Doctor+Image+Here";
          }}
        />
      </div>
    </div>
  );
};

export default HeroSection;
