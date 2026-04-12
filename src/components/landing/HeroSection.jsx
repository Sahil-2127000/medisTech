import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section id="home" className="relative w-full pt-16 pb-24 lg:pt-24 lg:pb-32 flex items-center overflow-hidden mb-12">

      {/* Background Image & Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://www.healthathomes.com/wp-content/uploads/2024/02/DOCTOR-AT-HOME-1.png"
          alt="Medical Hospital Background"
          className="w-full h-full object-cover object-top"
        />
        {/* Blue color overlays to match reference image */}
        <div className="absolute inset-0 bg-blue-600/70 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-linear-to-r from-blue-600/95 via-blue-600/80 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16">

        {/* Left Content (Same exact content, styled for dark background) */}
        <div className="space-y-8 max-w-xl">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white tracking-tight">
            Quality Healthcare <br /> from your <br />Trusted Doctor
          </h1>

          <p className="text-blue-50 text-lg leading-relaxed font-medium opacity-90">
            Our Clinic provides personalized medical care with easy appointment booking, quick consultations, and a patient-friendly experience—all in one place.
          </p>

          <div className="pt-2">
            <Link to="/auth" className="inline-block bg-[#33cfc5] hover:bg-[#09baae] text-white px-8 py-3.5 rounded-full font-medium transition-colors shadow-lg shadow-teal-500/30">
              Book Appointment
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 md:gap-12 pt-8 mt-8 border-t border-white/20">
            <div>
              <div className="text-4xl font-bold text-white">15+</div>
              <div className="text-sm text-blue-200 mt-1 font-medium">Years of Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white">2000+</div>
              <div className="text-sm text-blue-200 mt-1 font-medium">Patient Treated</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#28dfd2]">98%</div>
              <div className="text-sm text-blue-200 mt-1 font-medium">Patient Satisfaction</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
