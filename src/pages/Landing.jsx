import React from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import BestServices from '../components/landing/BestServices';
import FeatureSection from '../components/landing/FeatureSection';
import MedicalServices from '../components/landing/MedicalServices';
import FaqSection from '../components/landing/FaqSection';
import Footer from '../components/landing/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 flex flex-col items-center overflow-x-hidden relative selection:bg-blue-200">

      {/* Top Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50 via-cyan-50/30 to-transparent pointer-events-none z-0"></div>
      
      {/* Background radial gradients for reference-like soft colorful glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-yellow-50 via-purple-50/30 to-transparent rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-cyan-100/40 via-blue-100/20 to-transparent rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-100/20 via-pink-50/20 to-transparent rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <Navbar />
      <HeroSection />
      <BestServices />
      <FeatureSection />
      <MedicalServices />
      <FaqSection />
      <Footer />

    </div>
  );
};

export default Landing;
