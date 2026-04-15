import React, { useState } from 'react';
import AppointmentsView from './AppointmentsView';
import DocumentsView from './DocumentsView';
import ProfileView from './ProfileView';
import SettingsView from './SettingsView';
import LiveQueueUI from './LiveQueueUI';

const MainPanel = ({ patientData, activeTab, onBookClick }) => {
  if (activeTab === 'calendar') return <AppointmentsView appointments={[...(patientData.upcoming || []), ...(patientData.history || [])]} onBookClick={onBookClick} />;
  if (activeTab === 'docs') return <DocumentsView prescriptions={patientData.prescriptions || []} />;
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
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
            Book Appointment
          </button>
        </div>
      </div>

      {/* Banner */}
      <div className="w-full shrink-0 bg-[#5265ec] rounded-[2rem] h-[160px] flex items-center relative overflow-hidden mb-12 shadow-md">
        {/* Massive faded circle overlapping graphic */}
        <div className="absolute -right-20 -bottom-20 w-64 h-64 border-[30px] border-white/10 rounded-full pointer-events-none"></div>
        
        {/* The Clinic/Doctor Graphic offset to the left */}
        <div className="hidden sm:block absolute left-4 md:left-8 bottom-0 w-28 md:w-32 h-36 md:h-40 z-10">
           <img src="/doctor_auth.png" style={{ height: '100%', objectFit: 'contain' }} alt="Doctor" className="w-full h-full object-contain -scale-x-100 drop-shadow-lg" />
        </div>

        {/* Banner Text Area */}
        <div className="ml-8 sm:ml-[160px] md:ml-[190px] relative z-20 flex-1 pr-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-1 lg:mb-2 truncate">Welcome, {patientData.name}</h2>
          <p className="text-white/80 font-medium text-sm lg:text-lg">Have a nice and healthy day!</p>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-slate-800">Your Records</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {[
          { title: 'Appointments', count: patientData.appointmentsCount, color: 'bg-[#5265ec]', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> },
          { title: 'Prescriptions', count: patientData.prescriptionsCount, color: 'bg-blue-400', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_10px_20px_rgba(0,0,0,0.02)] p-8 flex flex-col items-center justify-center hover:shadow-xl hover:shadow-blue-500/5 transition-all group cursor-pointer">
            <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{stat.icon}</svg>
            </div>
            <div className="text-gray-400 font-bold text-sm mb-1 uppercase tracking-wider">{stat.title}</div>
            <div className="text-3xl font-black text-slate-800 tracking-tight">{stat.count}</div>
          </div>
        ))}

        {/* Empty Add slot mimicking the design dashed block */}
        <div 
          onClick={onBookClick}
          className="bg-white rounded-[2rem] border-2 border-dashed border-[#5265ec]/20 bg-blue-50/20 flex items-center justify-center hover:bg-blue-50 hover:border-[#5265ec]/40 transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#5265ec] shadow-md group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          </div>
        </div>
      </div>

      {/* Bottom Section: Health Metric & Upcoming Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Health Metric Block */}
        <div className="lg:col-span-1 bg-[#5265ec] rounded-[2rem] p-6 relative overflow-hidden shadow-[0_20px_40px_rgba(82,101,236,0.3)] text-white flex flex-col justify-between min-h-[220px]">
          <div>
            <h4 className="font-extrabold text-xl mb-1">Health Metric</h4>
            <div className="text-sm text-white/70 mb-4">Blood pressure average</div>
          </div>
          
          <div className="relative w-full h-32 mt-4 flex items-end justify-center">
             <svg viewBox="0 0 200 100" className="absolute top-0 w-[120%] h-[120%] stroke-pink-400 stroke-[3px] fill-transparent overflow-visible">
               <path d="M-10,80 Q30,50 60,90 T140,40 T210,80" />
               <circle cx="140" cy="40" r="5" fill="white" className="stroke-pink-400 stroke-[3px]" />
             </svg>
             <div className="absolute top-1 right-[30%] text-center text-sm font-bold bg-white text-[#5265ec] px-3 py-1 rounded-full shadow-md z-10">120/80</div>
             
             <div className="flex justify-between w-full text-xs text-white/70 mt-auto opacity-70 relative z-10">
               <span>Tue</span>
               <span>Wed</span>
               <span className="text-white font-bold opacity-100">Thu</span>
               <span>Fri</span>
               <span>Sat</span>
             </div>
          </div>
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
