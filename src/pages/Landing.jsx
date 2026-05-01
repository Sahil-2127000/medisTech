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

  const [contactInfo, setContactInfo] = React.useState({
    address: 'Loading...',
    phone: 'Loading...',
    email: 'Loading...'
  });

  React.useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user') || 'null');
    if (user) {
      navigate(user.role === 'doctor' ? '/doctor/dashboard' : '/patientdashboard');
    }
  }, [navigate]);

  React.useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/auth/doctors');
        if (res.ok) {
          const doctors = await res.json();
          if (doctors && doctors.length > 0) {
            const doc = doctors[0];
            setContactInfo({
              address: doc.clinicAddress || '',
              phone: doc.phone || '',
              email: doc.email || ''
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch doctor info", err);
      }
    };
    fetchContactInfo();
  }, []);

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
      <ContactSection contactInfo={contactInfo} />
      <Footer contactInfo={contactInfo} />

    </div>
  );
};

export default Landing;
