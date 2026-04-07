import React from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FacilitiesSection from '../components/landing/FacilitiesSection';
import ReviewsSection from '../components/landing/ReviewsSection';
import VideoTourSection from '../components/landing/VideoTourSection';
import Footer from '../components/landing/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-200 font-sans text-white pb-32 flex flex-col items-center overflow-x-hidden">

      {/* --- HERO SECTION CONTAINER --- */}
      <div className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] max-w-7xl bg-clinic-800 rounded-[3rem] overflow-hidden relative shadow-2xl mt-4 md:mt-8">
        {/* Floating Stars / Decorations */}
        <div className="absolute top-32 left-1/3 text-yellow-400 rotate-45">✦</div>
        <div className="absolute top-24 right-1/4 text-yellow-200 text-sm">✦</div>
        <div className="absolute bottom-40 left-1/4 text-clinic-400 text-sm">✦</div>

        <Navbar />
        <HeroSection />

        {/* Bottom curvy cut-out matching the Learn@House design */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-64 h-16 bg-clinic-900 rounded-t-full z-20"></div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-clinic-600 z-30">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 animate-bounce">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      <FacilitiesSection />
      <ReviewsSection />
      <VideoTourSection />
      <Footer />

    </div>
  );
};

export default Landing;
