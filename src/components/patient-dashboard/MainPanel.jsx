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

      {/* Bottom Section: Health Summary */}
      <div className="grid grid-cols-1 gap-6">

        {/* Intuitive Health Status Block */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden group">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h4 className="font-black text-3xl text-slate-800 tracking-tight">Your Health Today</h4>
              </div>
              <p className="text-gray-400 font-bold ml-13">Everything looks great! You are within your target health ranges.</p>
            </div>

            <button 
              onClick={() => setShowVitalModal(true)}
              className="bg-[#5265ec] hover:bg-[#4254d3] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#5265ec]/20 transition-all active:scale-95 flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
              Log New Reading
            </button>
          </div>

          {/* Simple Traffic Light Vitals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {[
              { 
                label: 'Blood Pressure', 
                value: patientData.vitals?.find(v => v.type === 'Blood Pressure')?.value || '120/80', 
                status: 'Healthy', 
                color: 'emerald', 
                desc: 'Perfect range for your heart.',
                icon: <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              },
              { 
                label: 'Heart Pulse', 
                value: patientData.vitals?.find(v => v.type === 'Heart Rate')?.value || '72', 
                status: 'Normal', 
                color: 'blue', 
                desc: 'Your heart is beating steadily.',
                unit: 'BPM',
                icon: <path d="M8.25 18.75a1.5 1.5 0 01-3 0 1.5 1.5 0 013 0zM18.75 18.75a1.5 1.5 0 01-3 0 1.5 1.5 0 013 0zM12 7.5a1.5 1.5 0 01-3 0 1.5 1.5 0 013 0z" />
              },
              { 
                label: 'Blood Sugar', 
                value: patientData.vitals?.find(v => v.type === 'Blood Sugar')?.value || '95', 
                status: 'Stable', 
                color: 'indigo', 
                desc: 'Your sugar level is very good.',
                unit: 'mg/dL',
                icon: <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A8.959 8.959 0 013 12c0-.778.099-1.533.284-2.253" />
              }
            ].map((vital, i) => (
              <div key={i} className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 flex flex-col items-center text-center group/card hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
                <div className={`w-14 h-14 bg-${vital.color}-500/10 rounded-2xl flex items-center justify-center text-${vital.color}-500 mb-6 group-hover/card:scale-110 transition-transform`}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{vital.icon}</svg>
                </div>
                
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{vital.label}</div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black text-slate-800 tracking-tighter">{vital.value}</span>
                  {vital.unit && <span className="text-xs font-bold text-slate-400 uppercase">{vital.unit}</span>}
                </div>

                <div className={`mt-2 flex items-center gap-2 bg-${vital.color}-100 text-${vital.color}-600 px-4 py-1.5 rounded-full`}>
                  <div className={`w-2 h-2 rounded-full bg-${vital.color}-500 animate-pulse`}></div>
                  <span className="text-xs font-black uppercase tracking-widest">{vital.status}</span>
                </div>
                
                <p className="mt-4 text-xs font-bold text-gray-400 leading-relaxed px-4 opacity-0 group-hover/card:opacity-100 transition-opacity">
                  {vital.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Large Abstract Background Shapes */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none group-hover:bg-blue-100 transition-colors"></div>
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-emerald-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        </div>
      </div>

    </div>
  );
};

export default MainPanel;
