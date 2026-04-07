import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/common/ThemeToggle';

const Landing = () => {
  return (
    <div className="min-h-screen bg-clinic-900 font-sans text-white pb-32 flex flex-col items-center overflow-x-hidden">

      {/* --- HERO SECTION CONTAINER --- */}
      <div className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] max-w-7xl bg-clinic-800 rounded-[3rem] overflow-hidden relative shadow-2xl mt-4 md:mt-8">
        {/* Floating Stars / Decorations */}
        <div className="absolute top-32 left-1/3 text-yellow-400 rotate-45">✦</div>
        <div className="absolute top-24 right-1/4 text-yellow-200 text-sm">✦</div>
        <div className="absolute bottom-40 left-1/4 text-clinic-400 text-sm">✦</div>

        {/* Navbar */}
        <nav className="flex items-center justify-between px-8 md:px-16 py-8 relative z-20">
          <div className="text-2xl font-bold flex items-center gap-2">
            <span className="text-white">Medi</span>
            <span className="text-clinic-400">Tech</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-clinic-200">
            <a href="#" className="hover:text-white transition-colors">Home</a>
            <a href="#" className="hover:text-white transition-colors">Facilities</a>
            <a href="#" className="hover:text-white transition-colors">Reviews</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/auth" className="hidden sm:block text-clinic-200 hover:text-white px-4 py-2 text-sm font-semibold transition-colors">
              Login
            </Link>
            <Link to="/auth" className="block bg-clinic-600 hover:bg-clinic-400 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md">
              Sign Up
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
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

        {/* Bottom curvy cut-out matching the Learn@House design */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-64 h-16 bg-clinic-900 rounded-t-full z-20"></div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-clinic-600 z-30">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 animate-bounce">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* --- FACILITIES SECTION --- */}
      <section className="w-full max-w-7xl px-8 mt-32 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Clinic Facilities</h2>
          <p className="text-clinic-400 text-lg">We provide state-of-the-art medical equipment and comfortable seating areas to ensure you have the best possible visit.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Facility 1 */}
          <div className="bg-clinic-800 p-8 rounded-[2rem] border border-clinic-600/20 hover:border-clinic-400/50 transition-all hover:-translate-y-2 group">
            <div className="w-14 h-14 bg-clinic-900 rounded-full flex items-center justify-center text-clinic-400 mb-6 group-hover:bg-clinic-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Modern Pharmacy</h3>
            <p className="text-clinic-200 text-sm leading-relaxed">Fully stocked pharmacy integrated directly with your digital prescriptions for instant medicine pickup.</p>
          </div>
          {/* Facility 2 */}
          <div className="bg-clinic-800 p-8 rounded-[2rem] border border-clinic-600/20 hover:border-clinic-400/50 transition-all hover:-translate-y-2 group">
            <div className="w-14 h-14 bg-clinic-900 rounded-full flex items-center justify-center text-clinic-400 mb-6 group-hover:bg-clinic-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">General Checkup</h3>
            <p className="text-clinic-200 text-sm leading-relaxed">Routine consultations from top-rated professionals to keep you healthy and informed throughout the year.</p>
          </div>
          {/* Facility 3 */}
          <div className="bg-clinic-800 p-8 rounded-[2rem] border border-clinic-600/20 hover:border-clinic-400/50 transition-all hover:-translate-y-2 group">
            <div className="w-14 h-14 bg-clinic-900 rounded-full flex items-center justify-center text-clinic-400 mb-6 group-hover:bg-clinic-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Pathology Lab</h3>
            <p className="text-clinic-200 text-sm leading-relaxed">In-house laboratory that syncs your test reports straight into your personal patient dashboard account.</p>
          </div>
          {/* Facility 4 */}
          <div className="bg-clinic-800 p-8 rounded-[2rem] border border-clinic-600/20 hover:border-clinic-400/50 transition-all hover:-translate-y-2 group">
            <div className="w-14 h-14 bg-clinic-900 rounded-full flex items-center justify-center text-clinic-400 mb-6 group-hover:bg-clinic-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Emergency & X-Ray</h3>
            <p className="text-clinic-200 text-sm leading-relaxed">24/7 priority emergency services with digital X-Ray integration visible via your online dashboard.</p>
          </div>
        </div>
      </section>

      {/* --- REVIEWS SECTION --- */}
      <section className="w-full max-w-7xl px-4 md:px-8 mt-32">
        <div className="bg-clinic-800 rounded-[3rem] p-8 md:p-16 relative overflow-hidden border border-clinic-600/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-clinic-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Patient Stories</h2>
              <p className="text-clinic-400 text-lg">Hear what our patients have to say about our seamless queue management.</p>
            </div>
            <button className="text-white font-medium hover:text-clinic-200 transition-colors flex items-center gap-2">
              View all reviews
              <span className="text-xl">→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {/* Review 1 */}
            <div className="bg-clinic-900/50 p-8 rounded-3xl border border-clinic-600/10 backdrop-blur-md">
              <div className="flex text-yellow-400 mb-4 text-sm">★★★★★</div>
              <p className="text-clinic-200 mb-6 text-sm leading-relaxed">"The digital token system completely changed my visit. I knew exactly when it was my turn, avoiding hours of waiting in the lobby."</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-clinic-600 flex items-center justify-center font-bold">SM</div>
                <div>
                  <div className="font-bold text-white text-sm">Sarah Mitchell</div>
                  <div className="text-xs text-clinic-400">Regular Patient</div>
                </div>
              </div>
            </div>
            {/* Review 2 */}
            <div className="bg-clinic-900/50 p-8 rounded-3xl border border-clinic-600/10 backdrop-blur-md">
              <div className="flex text-yellow-400 mb-4 text-sm">★★★★★</div>
              <p className="text-clinic-200 mb-6 text-sm leading-relaxed">"Having all my prescriptions stored in one dashboard is fantastic. I don't have to carry old paper files anymore."</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-clinic-400 flex items-center justify-center font-bold text-clinic-900">JD</div>
                <div>
                  <div className="font-bold text-white text-sm">James Peterson</div>
                  <div className="text-xs text-clinic-400">Consultation</div>
                </div>
              </div>
            </div>
            {/* Review 3 */}
            <div className="bg-clinic-900/50 p-8 rounded-3xl border border-clinic-600/10 backdrop-blur-md">
              <div className="flex text-yellow-400 mb-4 text-sm">★★★★☆</div>
              <p className="text-clinic-200 mb-6 text-sm leading-relaxed">"Very smooth app interface! Booking an appointment was seamless, and the web portal is highly responsive and fast."</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-clinic-200 flex items-center justify-center font-bold text-clinic-900">EK</div>
                <div>
                  <div className="font-bold text-white text-sm">Emily K.</div>
                  <div className="text-xs text-clinic-400">Dental Patient</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- VIDEO TOUR SECTION --- */}
      <section className="w-full max-w-5xl px-8 mt-32 mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Take A Virtual Tour</h2>
        <p className="text-clinic-400 text-lg mb-12 max-w-2xl mx-auto">See the clinic facilities inside out through our exclusive video tour and understand how our patient flow system operates firsthand.</p>

        <div className="relative w-full aspect-video bg-gradient-to-br from-clinic-800 to-clinic-900 rounded-[2rem] overflow-hidden flex items-center justify-center group cursor-pointer border border-clinic-600/30 shadow-2xl">
          {/* Overlay gradient / placeholder texture */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500 z-10 w-full h-full flex items-center justify-center">
            <div className="w-full h-full opacity-10" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%235483b3\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
          </div>

          {/* Play Button */}
          <div className="w-24 h-24 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full flex items-center justify-center z-20 group-hover:scale-110 group-hover:bg-white group-hover:text-clinic-900 transition-all duration-300">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 ml-2">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>

          <div className="absolute bottom-6 left-8 z-20 text-left">
            <h3 className="text-2xl font-bold text-white">Clinic Overview</h3>
            <p className="text-clinic-200 text-sm mt-1">2:45 Mins</p>
          </div>
        </div>
      </section>

      {/* Basic Footer space */}
      <footer className="w-full max-w-7xl border-t border-clinic-600/20 mt-20 pt-8 flex justify-between items-center px-8 text-clinic-400 text-sm">
        <p>&copy; 2026 Clinic@Flow. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
