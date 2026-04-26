import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import AboutSection from '../components/landing/AboutSection';
import ServicesSection from '../components/landing/ServicesSection';
import BlogSection from '../components/landing/BlogSection';
import FaqSection from '../components/landing/FaqSection';
import ContactSection from '../components/landing/ContactSection';
import Footer from '../components/landing/Footer';

const Landing = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user') || 'null');
    if (user) {
      navigate(user.role === 'doctor' ? '/doctor/dashboard' : '/patientdashboard');
    }
  }, [navigate]);

  return (
    <div id="home" className="min-h-screen bg-slate-50/50 font-sans text-slate-900 flex flex-col items-center overflow-x-hidden relative selection:bg-blue-200">

      {/* Top Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-linear-to-b from-blue-50 via-cyan-50/30 to-transparent pointer-events-none z-0"></div>
      
      {/* Background radial gradients for reference-like soft colorful glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-linear-to-br from-yellow-50 via-purple-50/30 to-transparent rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-linear-to-tl from-cyan-100/40 via-blue-100/20 to-transparent rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-linear-to-tr from-purple-100/20 via-pink-50/20 to-transparent rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <BlogSection />
      <FaqSection />
      <ContactSection />
      <Footer />

    </div>
  );
};

export default Landing;
