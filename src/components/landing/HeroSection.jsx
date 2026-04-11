import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-8 md:px-16 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
      
      {/* Left Content */}
      <div className="space-y-8 max-w-xl">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight text-slate-900 tracking-tight">
          Quality Healthcare <br /> from your <br />Trusted Doctor
        </h1>
        
        <p className="text-slate-500 text-lg leading-relaxed">
          Our Clinic provides personalized medical care with easy appointment booking, quick consultations, and a patient-friendly experience—all in one place.
        </p>

        <div className="pt-2">
          <Link to="/appointment" className="inline-block bg-[#3bbab1] hover:bg-[#34a59d] text-white px-8 py-3.5 rounded-full font-medium transition-colors shadow-lg shadow-teal-500/30">
            Request an Appointment
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-12 pt-12">
          <div>
            <div className="text-4xl font-bold text-slate-900">30+</div>
            <div className="text-sm text-slate-500 mt-1">Years of Experience</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">15+</div>
            <div className="text-sm text-slate-500 mt-1">Clinic Location</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#3bbab1]">100%</div>
            <div className="text-sm text-slate-500 mt-1">Patient Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Right Content (Images Grid) */}
      <div className="relative h-[600px] w-full hidden md:block">
        {/* Large Main Image (Yellow BG) */}
        <div className="absolute top-0 left-0 w-64 h-[400px] bg-[#f8c12a] rounded-2xl overflow-hidden shadow-xl transform -rotate-1">
          {/* Faded flower/sun design behind doctor */}
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+PHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTEwMCAyMGMxMC0yMCAzMC0yMCA0MCAwIDEwIDIwLTEwIDQwLTIwIDQwaC00MGMtMTAgMC0zMC0yMC0yMC00MCAxMC0yMCAzMC0yMCA0MCAweiIvPjwvc3ZnPg==')] bg-center bg-no-repeat bg-contain"></div>
          <img src="https://placehold.co/400x600/transparent/ffffff?text=Doctor+Main" alt="Doctor" className="w-full h-full object-cover object-top relative z-10" />
        </div>

        {/* Top Right Image (Purple BG) */}
        <div className="absolute top-4 right-8 w-44 h-44 bg-[#a682ff] rounded-2xl overflow-hidden shadow-xl transform rotate-2">
          <img src="https://placehold.co/300x300/transparent/ffffff?text=Nurse" alt="Nurse" className="w-full h-full object-cover object-top" />
        </div>

        {/* Bottom Right Image (Cyan BG) */}
        <div className="absolute top-52 right-12 w-48 h-56 bg-[#c5f5f1] rounded-2xl overflow-hidden shadow-xl transform -rotate-1">
          <img src="https://placehold.co/300x400/transparent/0f172a?text=Doctor+Sub" alt="Doctor" className="w-full h-full object-cover object-top" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
