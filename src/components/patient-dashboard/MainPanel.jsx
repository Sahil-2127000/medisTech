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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-5xl font-black text-[#021024] dark:text-white tracking-tighter leading-none mb-2 transition-colors">Dashboard</h1>
          <p className="text-slate-400 dark:text-slate-500 font-bold text-sm tracking-tight">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>

        <div className="flex items-center gap-6">

          <button onClick={onBookClick} className="bg-[#5265ec] hover:bg-[#4254d3] text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-[#5265ec]/30 transition-all flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Book Appointment
          </button>
        </div>
      </div>

      {/* 🔵 DOCTOR-STYLE WELCOME BANNER (AURA REDESIGN - DARK ONLY) 🔵 */}
      <div className="relative w-full shrink-0 min-h-[160px] rounded-[3rem] overflow-hidden mb-12 bg-linear-to-r from-blue-600 via-[#3963F9] to-blue-400 dark:bg-none dark:bg-blue-600/20 dark:backdrop-blur-2xl border border-transparent dark:border-blue-500/40 flex items-center shadow-xl shadow-blue-500/20 dark:shadow-blue-500/10">
        <div className="relative z-10 px-8 py-10 md:px-14 flex flex-col justify-center w-full">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight drop-shadow-sm">
            Welcome, {patientData.name}
          </h2>
          <p className="text-blue-100 dark:text-blue-300/80 font-medium text-base md:text-lg drop-shadow-sm opacity-90">
            Have a nice and healthy day!
          </p>
        </div>

        {/* Geometric Accents (Sync with Doctor Portal) */}
        <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-white/5 dark:bg-blue-500/10 rounded-full blur-[20px] -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute right-[15%] bottom-[-50%] w-[300px] h-[300px] bg-white/10 dark:bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* 📊 Vital Capture Modal */}
      {showVitalModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-fade-in">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-md shadow-2xl relative animate-slide-up border border-slate-100">
            <button
              onClick={() => setShowVitalModal(false)}
              className="absolute top-8 right-8 text-gray-400 hover:text-slate-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <h3 className="text-3xl font-black text-slate-800 mb-2">Record Vital</h3>
            <p className="text-gray-400 font-medium mb-8">Enter your latest health reading for tracking.</p>

            <form onSubmit={handleVitalSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Vital Type</label>
                <select
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#5265ec]/20 transition-all appearance-none"
                  value={vitalForm.type}
                  onChange={e => setVitalForm({ ...vitalForm, type: e.target.value })}
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
                  onChange={e => setVitalForm({ ...vitalForm, value: e.target.value })}
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


      {/* 🧩 PRECISION ASYMMETRIC GRID: YOUR RECORDS 🧩 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">

        {/* Left Side: Two Compact Cards (50% of row) */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-6">
          {/* Card 1: Completed Visits (Vibrant Indigo-Violet 3D) */}
          {(() => {
            const completedCount = [...(patientData.history || []), ...(patientData.upcoming || [])]
              .filter(app => app.status === 'completed').length;
            return (
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => onTabChange('calendar')}
                className="bg-linear-to-br from-[#4776E6] to-[#8E54E9] dark:from-indigo-500/10 dark:to-indigo-500/5 dark:backdrop-blur-xl rounded-[2.5rem] p-0 shadow-[0_20px_60px_rgba(71,118,230,0.3)] dark:shadow-indigo-500/10 border border-transparent dark:border-indigo-500/20 flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden h-[240px]"
              >
                {/* 3D "Broad Thread" Ribbon */}
                <div className="absolute top-10 left-0 right-0 py-3.5 bg-white/20 backdrop-blur-md border-y border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.12)] scale-110 flex items-center justify-center z-10">
                  <div className="text-lg font-medium text-white uppercase tracking-tight scale-y-[1.4] drop-shadow-md">
                    Completed Visits
                  </div>
                </div>

                {/* Main Content (Below Thread) */}
                <div className="mt-28 relative z-20">
                  <div className="text-6xl font-black text-white dark:text-indigo-300 tracking-tighter leading-none drop-shadow-2xl">
                    {completedCount}
                  </div>
                </div>

                {/* Background Decor */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-linear-to-t from-black/10 to-transparent pointer-events-none"></div>
              </motion.div>
            );
          })()}

          {/* Card 2: Prescriptions (Emerald 3D) */}
          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={() => onTabChange('docs')}
            className="bg-linear-to-br from-[#11998e] to-[#38ef7d] dark:from-emerald-500/10 dark:to-emerald-500/5 dark:backdrop-blur-xl rounded-[2.5rem] p-0 shadow-[0_20px_60px_rgba(17,153,142,0.25)] dark:shadow-emerald-500/10 border border-transparent dark:border-emerald-500/20 flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden h-[240px]"
          >
            {/* 3D "Broad Thread" Ribbon */}
            <div className="absolute top-10 left-0 right-0 py-3.5 bg-white/20 backdrop-blur-md border-y border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.12)] scale-110 flex items-center justify-center z-10">
              <div className="text-lg font-medium text-white uppercase tracking-tight scale-y-[1.4] drop-shadow-md">
                Prescriptions
              </div>
            </div>

            {/* Main Content (Below Thread) */}
            <div className="mt-28 relative z-20">
              <div className="text-6xl font-black text-white dark:text-emerald-300 tracking-tighter leading-none drop-shadow-2xl">
                {patientData.prescriptionsCount || 0}
              </div>
            </div>

            {/* Background Decor */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-t from-black/10 to-transparent pointer-events-none"></div>
          </motion.div>
        </div>

        {/* Right Side: Single Wide Card (The Greatest Deep Navy/Blue) */}
        <div className="lg:col-span-2">
          {(() => {
            const parseDate = (d) => {
              if (!d) return new Date(0);
              const [day, month, year] = d.split('-').map(Number);
              return new Date(year, month - 1, day);
            };

            const allApps = [...(patientData.upcoming || []), ...(patientData.history || [])];
            const dynamicLatest = allApps
              .filter(app => ['approved', 'accepted', 'completed'].includes(app.status))
              .sort((a, b) => parseDate(b.date) - parseDate(a.date))[0];

            return (
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => onTabChange('calendar')}
                className="bg-linear-to-br from-[#0f172a] to-[#1e40af] dark:bg-none dark:bg-indigo-600/10 dark:backdrop-blur-xl rounded-[2.5rem] p-10 shadow-[0_20px_60px_rgba(15,23,42,0.45)] dark:shadow-indigo-500/10 flex flex-col justify-between cursor-pointer group h-[240px] transition-all relative overflow-hidden border border-white/10 dark:border-indigo-500/40"
              >
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500 opacity-20 rounded-full blur-3xl group-hover:opacity-40 transition-opacity"></div>

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/10 transition-transform group-hover:rotate-12">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-white tracking-tight group-hover:text-blue-300 transition-colors">{dynamicLatest?.doctor || 'No Recent Visits'}</div>
                    </div>
                  </div>
                  <div className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.15em] border border-white/10 ${dynamicLatest?.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-300'}`}>
                    {dynamicLatest?.status === 'completed' ? 'Last Visit' : 'Next Visit'}
                  </div>
                </div>

                {/* 🌌 OPTION 3: MINIMALIST DOTTED WAVE + RUNNING ORB 🌌 */}
                <div className="relative h-16 w-full overflow-hidden flex items-center justify-center pointer-events-none my-2">
                  <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
                    <path
                      id="wavePath"
                      d="M20,20 C150,80 400,100 600,50 C800,0 950,20 980,40"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeDasharray="1,12"
                      strokeLinecap="round"
                      className="opacity-20 dark:opacity-40"
                    />
                    <motion.circle
                      r="4"
                      fill="white"
                      className="drop-shadow-[0_0_12px_rgba(255,255,255,1)]"
                      style={{ offsetPath: "path('M20,20 C150,80 400,100 600,50 C800,0 950,20 980,40')" }}
                      animate={{ offsetDistance: ["0%", "100%"] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                  </svg>
                </div>

                {dynamicLatest ? (
                  <div className="flex items-center gap-12 pt-2 relative z-10">
                    <div className="flex items-center gap-4 text-slate-200 font-black text-lg uppercase tracking-wider">
                      <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-18 0h18" /></svg>
                      {dynamicLatest.date}
                    </div>
                    <div className="flex items-center gap-4 text-slate-200 font-black text-lg uppercase tracking-wider">
                      <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {dynamicLatest.time}
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-400 font-bold text-sm relative z-10">You're all set! No confirmed visits at the moment.</div>
                )}
              </motion.div>
            );
          })()}
        </div>
      </div>

      {/* 🌡️ UNIFIED HEALTH METRICS ROW (3-COLUMN EQUAL GRID) 🌡️ */}
      <div className="bg-white dark:bg-slate-900/60 rounded-[3rem] p-10 border border-slate-100 dark:border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-black/20 mb-12 transition-all">
        <div className="flex justify-between items-center mb-10">
          <h4 className="font-black text-2xl text-slate-800 dark:text-white tracking-tight">Your Health Metrics</h4>
          <button
            onClick={() => setShowVitalModal(true)}
            className="bg-[#3963F9] hover:bg-[#3252d4] text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
            Update Vitals
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: 'Blood Pressure',
              value: patientData.vitals?.find(v => v.type === 'Blood Pressure')?.value || '120/80',
              status: 'Optimal',
              color: 'emerald',
              unit: 'mmHg',
              icon: <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            },
            {
              label: 'Heart Pulse',
              value: patientData.vitals?.find(v => v.type === 'Heart Rate')?.value || '72',
              status: 'Normal',
              color: 'rose',
              unit: 'BPM',
              icon: <path d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
            },
            {
              label: 'Blood Sugar',
              value: patientData.vitals?.find(v => v.type === 'Blood Sugar')?.value || '95',
              status: 'Stable',
              color: 'amber',
              unit: 'mg/dL',
              icon: <path d="M12 3v18m9-9H3" />
            }
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col gap-5 p-8 rounded-[2.5rem] border border-slate-50 dark:border-white/5 bg-slate-50/40 dark:bg-slate-800/40 group hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black transition-all duration-500">
              <div className="flex justify-between items-start">
                <div className={`w-14 h-14 bg-${stat.color}-500/10 text-${stat.color}-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">{stat.icon}</svg>
                </div>
                <div className={`px-4 py-1.5 rounded-full bg-${stat.color}-50 dark:bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400 text-[10px] font-black uppercase tracking-widest border border-${stat.color}-100 dark:border-${stat.color}-500/20`}>
                  {stat.status}
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">{stat.value}</span>
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.unit}</span>
                </div>
                <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default MainPanel;
