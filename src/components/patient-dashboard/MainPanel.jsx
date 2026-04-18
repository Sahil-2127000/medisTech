import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import AppointmentsView from './AppointmentsView';
import DocumentsView from './DocumentsView';
import ProfileView from './ProfileView';
import SettingsView from './SettingsView';
import LiveQueueUI from './LiveQueueUI';

const MainPanel = ({ patientData, activeTab, onBookClick, onVitalsUpdate, onTabChange }) => {
  const [showVitalModal, setShowVitalModal] = useState(false);
  const [vitalForm, setVitalForm] = useState({ type: 'Blood Pressure', value: '' });
  
  // 3D Parallax Mouse Tracking via MotionValues (No re-renders!)
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [15, -15]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-15, 15]), { stiffness: 100, damping: 30 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - left) / width);
    y.set((e.clientY - top) / height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  const handleVitalSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5001/api/vitals/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vitalForm),
        credentials: 'include'
      });
      if (res.ok) {
        setShowVitalModal(false);
        setVitalForm({ type: 'Blood Pressure', value: '' });
        if (onVitalsUpdate) onVitalsUpdate();
      }
    } catch (err) { console.error(err); }
  };

  const spotlightBg = useTransform([x, y], ([valX, valY]) => 
    `radial-gradient(circle at ${valX * 100}% ${valY * 100}%, rgba(99, 102, 241, 0.4) 0%, transparent 35%)`
  );

  if (activeTab === 'calendar') return <AppointmentsView appointments={[...(patientData.upcoming || []), ...(patientData.history || [])]} onBookClick={onBookClick} />;
  if (activeTab === 'docs') return <DocumentsView prescriptions={patientData.prescriptions || []} patientData={patientData} />;
  if (activeTab === 'profile') return <ProfileView patientData={patientData} />;
  if (activeTab === 'settings') return <SettingsView patientData={patientData} />
  if (activeTab === 'queue') {
    // We assume the first upcoming appointment's doctor is the one to track, or we'd need a doctor selector
    const doctorId = patientData.upcoming?.[0]?.doctorId?._id || "60b8c8d8f1e6b3b3a4a9c888";
    const doctorName = patientData.upcoming?.[0]?.doctor || "Dr. Specialist";
    return <LiveQueueUI doctorId={doctorId} doctorName={doctorName} />;
  }

  return (
    <div className="flex-1 h-full py-8 md:py-12 px-6 md:px-12 flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar">

      {/* Header row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-[#021024]">Dashboard</h1>
          <p className="text-gray-400 font-medium mt-1">Thursday, 28 Jan 2026</p>
        </div>

        <div className="flex items-center gap-6">

          <button onClick={onBookClick} className="bg-[#5265ec] hover:bg-[#4254d3] text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-[#5265ec]/30 transition-all flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Book Appointment
          </button>
        </div>
      </div>

      {/* 🔮 EXTRAORDINARY 3D PARALLAX WELCOME BANNER 🔮 */}
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden rounded-[3rem] p-12 text-white shadow-2xl shadow-indigo-500/30 mb-12 bg-gradient-to-br from-[#5265ec] via-[#6366f1] to-[#4f46e5] min-h-[180px] flex items-center cursor-pointer perspective-1000 group"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
      >
        {/* Dynamic Spotlight Glow */}
        <motion.div 
          className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: spotlightBg }}
        />

        {/* Floating Quantum Particles */}
        <motion.div
          animate={{ 
            x: [0, 20, -20, 0],
            y: [0, -20, 20, 0],
            rotate: [0, 90, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute right-10 top-5 w-32 h-32 border border-white/10 rounded-full blur-[1px] pointer-events-none"
        />

        {/* CONTENT */}
        <div className="relative z-10" style={{ transform: "translateZ(50px)" }}>
          <h1 className="text-4xl lg:text-5xl font-black mb-3 drop-shadow-lg flex items-center gap-4">
            Welcome, {patientData.name}
          </h1>
          <p className="text-xl opacity-90 font-medium tracking-wide">
            Your health journey is our priority. Have a wonderful day!
          </p>
        </div>

        {/* SHIMMER LIGHT SWEEP */}
        <motion.div
          className="absolute top-0 left-[-100%] w-[100%] h-full bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] pointer-events-none"
          animate={{ left: ["-100%", "200%"] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 2
          }}
        />

        {/* Decorative Glass Ring */}
        <div className="absolute -left-10 -bottom-10 w-48 h-48 border-[20px] border-white/5 rounded-full pointer-events-none"></div>
      </motion.div>

        {/* 📊 Vital Capture Modal */}
        {showVitalModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-fade-in">
            <div className="bg-white rounded-[3rem] p-10 w-full max-w-md shadow-2xl relative animate-slide-up border border-slate-100">
              <button 
                onClick={() => setShowVitalModal(false)}
                className="absolute top-8 right-8 text-gray-400 hover:text-slate-800 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>

              <h3 className="text-3xl font-black text-slate-800 mb-2">Record Vital</h3>
              <p className="text-gray-400 font-medium mb-8">Enter your latest health reading for tracking.</p>

              <form onSubmit={handleVitalSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Vital Type</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#5265ec]/20 transition-all appearance-none"
                    value={vitalForm.type}
                    onChange={e => setVitalForm({...vitalForm, type: e.target.value})}
                  >
                    <option>Blood Pressure</option>
                    <option>Heart Rate</option>
                    <option>Blood Sugar</option>
                    <option>Weight</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">New Value</label>
                  <input 
                    type="text" 
                    placeholder={vitalForm.type === 'Blood Pressure' ? 'e.g. 120/80' : 'e.g. 72'}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#5265ec]/20 transition-all"
                    value={vitalForm.value}
                    onChange={e => setVitalForm({...vitalForm, value: e.target.value})}
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#5265ec] text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-[#5265ec]/30 hover:bg-[#4254d3] active:scale-[0.98] transition-all"
                >
                  Log Vital Data
                </button>
              </form>
            </div>
          </div>
        )}


      {/* Quick Metrics */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-slate-800">Your Records</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12 max-w-4xl">
        {[
          { title: 'Appointments', count: patientData.appointmentsCount, color: 'from-[#5265ec] to-[#6366f1]', tab: 'calendar', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> },
          { title: 'Prescriptions', count: patientData.prescriptionsCount, color: 'from-blue-400 to-indigo-400', tab: 'docs', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> }
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -10, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTabChange(stat.tab)}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] border border-white/40 dark:border-slate-700/40 shadow-2xl shadow-[#5265ec]/5 p-8 flex items-center justify-between group cursor-pointer relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>

            <div className="flex items-center gap-6 z-10">
              <div className={`shrink-0 w-16 h-16 bg-gradient-to-br ${stat.color} rounded-3xl flex items-center justify-center text-white shadow-xl shadow-[#5265ec]/20 group-hover:rotate-12 transition-transform duration-500`}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">{stat.icon}</svg>
              </div>
              <div>
                <div className="text-slate-400 dark:text-slate-500 font-black text-xs uppercase tracking-[0.2em] mb-1">{stat.title}</div>
                <div className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">{stat.count}</div>
              </div>
            </div>

            <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-slate-300 group-hover:text-[#5265ec] group-hover:bg-[#5265ec]/10 transition-all z-10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Section: Health Metric & Upcoming Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Health Metric Block */}
        <div className="lg:col-span-1 bg-linear-to-br from-[#5265ec] to-[#6366f1] rounded-[2rem] p-6 relative overflow-hidden shadow-[0_20px_40px_rgba(82,101,236,0.3)] text-white flex flex-col justify-between min-h-[240px] group">
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h4 className="font-extrabold text-xl mb-1">Health Metric</h4>
              <div className="text-sm text-white/70 mb-4">Latest Vitals Recording</div>
            </div>
            <button 
              onClick={() => setShowVitalModal(true)}
              className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all backdrop-blur-md border border-white/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>

          <div className="relative w-full h-32 mt-4 flex items-end justify-center z-10">
            {/* Dynamic Chart simulation */}
            <svg viewBox="0 0 200 100" className="absolute top-0 w-[120%] h-[120%] stroke-pink-400 stroke-[3px] fill-transparent overflow-visible animate-pulse">
              <path d="M-10,80 Q30,50 60,90 T140,40 T210,80" />
              <circle cx="140" cy="40" r="5" fill="white" className="stroke-pink-400 stroke-[3px]" />
            </svg>
            
            <div className="absolute top-1 right-[20%] text-center">
              <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Status: Optimum</div>
              <div className="text-2xl font-black bg-white text-[#5265ec] px-4 py-1.5 rounded-2xl shadow-xl z-20">
                {patientData.vitals?.find(v => v.type === 'Blood Pressure')?.value || '120/80'}
              </div>
            </div>

            <div className="flex justify-between w-full text-[10px] font-black text-white/70 mt-auto opacity-70 relative z-10 uppercase tracking-tighter">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span className="text-white opacity-100">Now</span>
            </div>
          </div>
          
          {/* Decorative faint pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>
        </div>

        {/* Schedule Blocks */}
        <div className="lg:col-span-2 flex flex-col justify-end">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">

            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between group cursor-pointer">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#5265ec]"></div>
              <div className="mb-4">
                <div className="text-xs font-bold text-[#5265ec] bg-[#5265ec]/10 w-max px-3 py-1 rounded-full mb-3">25 Jan</div>
                <div className="font-bold text-slate-800 group-hover:text-[#5265ec] transition-colors leading-tight">General Checkup</div>
                <div className="text-xs text-gray-400 font-medium mt-1">Routine health checkup</div>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>09:00 AM</span>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between group cursor-pointer">
              <div className="absolute top-0 left-0 w-full h-1 bg-pink-500"></div>
              <div className="mb-4">
                <div className="text-xs font-bold text-pink-500 bg-pink-500/10 w-max px-3 py-1 rounded-full mb-3">28 Jan</div>
                <div className="font-bold text-slate-800 group-hover:text-pink-500 transition-colors leading-tight">General Medical Review</div>
                <div className="text-xs text-gray-400 font-medium mt-1">Reviewing monthly health vitals</div>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>11:30 AM</span>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between group cursor-pointer">
              <div className="absolute top-0 left-0 w-full h-1 bg-teal-400"></div>
              <div className="mb-4">
                <div className="text-xs font-bold text-teal-500 bg-teal-400/10 w-max px-3 py-1 rounded-full mb-3">30 Jan</div>
                <div className="font-bold text-slate-800 group-hover:text-teal-400 transition-colors leading-tight">Follow-up Consultation</div>
                <div className="text-xs text-gray-400 font-medium mt-1">Status check on medication</div>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>02:00 PM</span>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default MainPanel;
