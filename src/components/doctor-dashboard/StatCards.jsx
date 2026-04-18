import React from 'react';

const StatCards = ({ appointments, historicalTotal, onCardClick }) => {
 // Derive Statistics dynamically
 const todayRaw = new Date();
 const todayFormatted = `${String(todayRaw.getDate()).padStart(2, '0')}-${String(todayRaw.getMonth() + 1).padStart(2, '0')}-${todayRaw.getFullYear()}`;

 const total = historicalTotal || appointments.length;
 const todayAppointments = appointments.filter(app => app.date === todayFormatted).length;
 const completed = appointments.filter(app => app.status === 'completed').length;
 const pending = appointments.filter(app => app.status === 'pending').length;

 const stats = [
 { id: 'total-patients', title: 'Total Patients', count: total, color: 'bg-clinic-600', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /> },
 { title: "Today's Consults", count: todayAppointments, color: 'bg-teal-400', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> },
 { title: 'Completed', count: completed, color: 'bg-green-500', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
 { title: 'Pending Requests', count: pending, color: 'bg-amber-400', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> }
 ];

 return (
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 w-full">
 {stats.map((stat, i) => (
 <div key={i} onClick={() => stat.id && onCardClick && onCardClick(stat.id)}
 className={`bg-white/60 backdrop-blur-md rounded-2xl border border-white/60 p-4 flex items-center gap-4 transition-all relative overflow-hidden shadow-xl shadow-clinic-600/20 ${stat.id ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-clinic-600/20' : 'opacity-90'}`}
 >
 {/* Subtle background glow mimicking patient cards */}
 <div className={`absolute -right-4 -top-4 w-16 h-16 ${stat.color} rounded-full opacity-30 blur-xl pointer-events-none`}></div>
 
 {/* Compact Icon */}
 <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm`}>
 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{stat.icon}</svg>
 </div>
 
 {/* Compact Labeling */}
 <div className="flex flex-col">
 <div className="text-xl font-extrabold text-[#021024] transition-colors">{stat.count}</div>
 <div className="text-gray-400 font-bold text-[10px] uppercase tracking-wider mt-0.5 transition-colors">{stat.title}</div>
 </div>
 </div>
 ))}
 </div>
 );
};

export default StatCards;
