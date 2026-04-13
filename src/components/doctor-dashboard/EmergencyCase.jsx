import React, { useState, useEffect } from 'react';

const EmergencyCase = ({ onDeclareEmergency, onResolveEmergency }) => {
 // Local active State parsed purely from generic engine
 const [isEmergencyActive, setIsEmergencyActive] = useState(false);
 const [startTime, setStartTime] = useState(null);
 const [elapsed, setElapsed] = useState(0);

 // Form Fields
 const [name, setName] = useState('');
 const [age, setAge] = useState('');
 const [gender, setGender] = useState('Select');
 const [reason, setReason] = useState('');

 // 1. Check globally if an emergency is running on mount
 useEffect(() => {
 const handleCheck = () => {
 const storedStart = localStorage.getItem('emergency_start_time');
 if (storedStart) {
 setIsEmergencyActive(true);
 setStartTime(parseInt(storedStart, 10));
 } else {
 setIsEmergencyActive(false);
 setStartTime(null);
 }
 };
 handleCheck();
 window.addEventListener("emergencyStateToggled", handleCheck);
 return () => window.removeEventListener("emergencyStateToggled", handleCheck);
 }, []);

 // 2. Stopwatch polling
 useEffect(() => {
 let interval;
 if (isEmergencyActive && startTime) {
 interval = setInterval(() => {
 setElapsed(Math.floor((Date.now() - startTime) / 1000));
 }, 1000);
 } else {
 setElapsed(0);
 }
 return () => clearInterval(interval);
 }, [isEmergencyActive, startTime]);

 const handleSubmit = (e) => {
 e.preventDefault();
 if (!name || !age || gender === 'Select' || !reason) return;
 onDeclareEmergency({ name, age, gender, reason });
 };

 const handleResolve = () => {
 onResolveEmergency();
 };

 // Format Elapsed purely for massive UI display
 const formatTime = (secs) => {
 const m = Math.floor(secs / 60);
 const s = secs % 60;
 return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
 };

 return (
 <div className="flex-1 overflow-y-auto no-scrollbar py-12 px-8 flex justify-center bg-transparent transition-colors duration-300">
 <div className="w-full max-w-2xl bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.03)] p-10 relative overflow-hidden transition-colors duration-300">
 {/* Urgent Ambient Lighting */}
 <div className={`absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors ${isEmergencyActive ? 'bg-red-600 animate-pulse' : 'bg-red-400'}`}></div>

 {isEmergencyActive ? (
 <div className="flex flex-col items-center justify-center py-10 text-center relative z-10">
 <svg className="w-24 h-24 text-red-500 mb-6 drop-shadow-md animate-bounce" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
 <h2 className="text-4xl font-extrabold text-red-600 mb-2 uppercase tracking-wide">Emergency In Progress</h2>
 <p className="text-slate-600 font-bold mb-8">All standard queue appointments are frozen.</p>

 <div className="bg-red-50 border border-red-100 rounded-2xl p-6 w-full max-w-sm mb-10 transition-colors">
 <span className="text-xs font-bold text-red-400 uppercase tracking-widest block mb-2">Automated Stopwatch</span>
 <div className="text-6xl font-black text-red-600 font-mono tracking-tighter">
 {formatTime(elapsed)}
 </div>
 </div>

 <button onClick={handleResolve}
 className="w-full max-w-sm bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-extrabold shadow-lg shadow-green-500/30 transition-all active:scale-95 flex items-center justify-center gap-3 text-lg"
 >
 <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
 Resolve & Auto-Adjust Queue
 </button>
 </div>

 ) : (

 <div className="relative z-10">
 <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50 transition-colors">
 <div className="w-14 h-14 bg-red-100 text-red-500 flex items-center justify-center rounded-2xl shadow-sm transition-colors">
 <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
 </div>
 <div>
 <h2 className="text-3xl font-extrabold text-[#021024] mb-1 transition-colors">Declare Emergency</h2>
 <p className="text-sm font-semibold text-gray-400 transition-colors">This instantly pauses the queue and begins automated delay algorithms.</p>
 </div>
 </div>

 <form onSubmit={handleSubmit} className="space-y-6">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-1.5 md:col-span-2">
 <label className="text-[10px] font-extrabold uppercase tracking-widest text-red-500/80 transition-colors">Patient Name</label>
 <input value={name} onChange={e=>setName(e.target.value)} required placeholder="Jane Doe / Unknown" className="w-full bg-[#f4f7fb] border border-transparent focus:bg-white focus:border-red-500 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 transition-all outline-none"/>
 </div>
 <div className="space-y-1.5">
 <label className="text-[10px] font-extrabold uppercase tracking-widest text-red-500/80 transition-colors">Estimated Age</label>
 <input type="number" value={age} onChange={e=>setAge(e.target.value)} required placeholder="e.g. 45" className="w-full bg-[#f4f7fb] border border-transparent focus:bg-white focus:border-red-500 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 transition-all outline-none"/>
 </div>

 <div className="space-y-1.5">
 <label className="text-[10px] font-extrabold uppercase tracking-widest text-red-500/80 transition-colors">Gender</label>
 <select value={gender} onChange={e=>setGender(e.target.value)} required className="w-full bg-[#f4f7fb] border border-transparent focus:bg-white focus:border-red-500 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 transition-all outline-none">
 <option disabled>Select</option>
 <option>Male</option>
 <option>Female</option>
 <option>Other</option>
 </select>
 </div>
 <div className="space-y-1.5 md:col-span-2">
 <label className="text-[10px] font-extrabold uppercase tracking-widest text-red-500/80 transition-colors">Clinical Severity / Reason</label>
 <input value={reason} onChange={e=>setReason(e.target.value)} required placeholder="e.g. Severe chest pain, unresponsive" className="w-full bg-[#f4f7fb] border border-transparent focus:bg-white focus:border-red-500 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 transition-all outline-none"/>
 </div>
 </div>

 <button type="submit" className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-extrabold shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 text-lg">
 Activate Protocol Override
 </button>
 </form>
 </div>

 )}
 </div>
 </div>
 );
};

export default EmergencyCase;
