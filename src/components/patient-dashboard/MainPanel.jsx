import React from 'react';

const MainPanel = ({ patientData, onBookClick }) => {
  return (
    <div className="flex-1 h-full py-8 md:py-12 px-6 md:px-12 flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar">
      
      {/* Header row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-[#021024]">Dashboard</h1>
          <p className="text-gray-400 font-medium mt-1">Thursday, 28 Jan 2026</p>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="text-[#5265ec] font-semibold text-sm flex items-center gap-1 hover:underline">
            Appointment History
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
          </button>
          
          <button onClick={onBookClick} className="bg-[#5265ec] hover:bg-[#4254d3] text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-[#5265ec]/30 transition-all flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
            Book Appointment
          </button>
        </div>
      </div>

      {/* Banner */}
      <div className="w-full bg-[#5265ec] rounded-[2rem] h-44 flex items-center relative overflow-hidden mb-12 shadow-md">
        {/* Massive faded circle overlapping graphic */}
        <div className="absolute -right-20 -bottom-20 w-64 h-64 border-[30px] border-white/10 rounded-full pointer-events-none"></div>
        
        {/* The Clinic/Doctor Graphic offset to the left */}
        <div className="hidden sm:block absolute left-8 bottom-0 w-32 h-40 z-10">
           <img src="/doctor_auth.png" style={{ height: '100%', objectFit: 'contain' }} alt="Doctor" className="w-full h-full object-contain -scale-x-100 drop-shadow-lg" />
        </div>

        {/* Banner Text Area */}
        <div className="ml-8 sm:ml-64 relative z-20">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome, {patientData.name}</h2>
          <p className="text-white/80 font-medium text-lg">Have a nice and healthy day!</p>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-slate-800">Your Records</h3>
        <button className="text-gray-400 text-sm font-semibold flex items-center gap-1 hover:text-slate-600">
          This month
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
        {[
          { title: 'Appointments', count: patientData.appointmentsCount, color: 'bg-[#5265ec]', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> },
          { title: 'Consultations', count: 18, color: 'bg-teal-400', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /> },
          { title: 'Lab Tests', count: patientData.labTestsCount, color: 'bg-pink-500', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /> },
          { title: 'Prescriptions', count: patientData.prescriptionsCount, color: 'bg-blue-400', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_20px_rgba(0,0,0,0.03)] p-6 flex flex-col items-center justify-center hover:-translate-y-1 transition-transform cursor-pointer">
            <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-md`}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{stat.icon}</svg>
            </div>
            <div className="text-gray-400 font-semibold text-sm mb-1">{stat.title}</div>
            <div className="text-2xl font-bold text-slate-800">{stat.count}</div>
          </div>
        ))}

        {/* Empty Add slot mimicking the design dashed block */}
        <div className="bg-white rounded-3xl border-2 border-dashed border-[#5265ec]/40 bg-[#5265ec]/5 flex items-center justify-center hover:bg-[#5265ec]/10 transition-colors cursor-pointer min-h-[140px]">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#5265ec] shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          </div>
        </div>
      </div>

      {/* Visual Timeline Schedule block */}
      <div className="w-full bg-white border border-gray-100 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] p-6 relative">
        <div className="flex justify-between items-center mb-8 px-4">
          <button className="text-gray-400 hover:text-slate-800"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg></button>
          <h3 className="text-lg font-bold">January 2026</h3>
          <button className="text-gray-400 hover:text-slate-800"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg></button>
        </div>

        {/* Static horizontal mapped timeline */}
        <div className="flex justify-between items-center relative pb-20 pt-4 px-4 overflow-x-auto">
          {/* Main Axis Line */}
          <div className="absolute top-12 left-0 w-full h-px bg-gray-200 z-0"></div>

          {["25", "26", "27", "28", "29", "30", "31"].map((day, i) => (
            <div key={i} className="flex flex-col items-center z-10 min-w-[60px]">
              <span className={`text-xs font-semibold ${day === "28" ? "text-[#5265ec]" : "text-gray-400"}`}>Mon</span>
              <span className={`text-xl font-bold mt-1 ${day === "28" ? "text-[#5265ec]" : "text-slate-800"}`}>{day}</span>
              
              {/* Event Marker Bubbles using raw logic to mimic exact image layout */}
              {day === "25" && (
                <div className="mt-8 ml-32 w-48 bg-[#5265ec] text-white p-3 rounded-xl absolute whitespace-nowrap shadow-lg">
                  <div className="text-sm font-bold">General Checkup</div>
                  <div className="text-xs text-white/70">Routine health checkup</div>
                </div>
              )}
              {day === "28" && (
                <>
                  <div className="absolute top-10 w-0.5 h-32 bg-[#5265ec] -z-10"></div>
                  <div className="mt-8 ml-0 w-48 bg-pink-500 text-white p-3 rounded-xl absolute whitespace-nowrap shadow-lg">
                    <div className="text-sm font-bold">Lab Results Followup</div>
                    <div className="text-xs text-white/70">Check blood panels</div>
                  </div>
                </>
              )}
              {day === "30" && (
                <div className="mt-[5rem] ml-16 w-48 bg-teal-400 text-white p-3 rounded-xl absolute whitespace-nowrap shadow-lg">
                  <div className="text-sm font-bold">Vaccine Injection</div>
                  <div className="text-xs text-white/70">Flu shot booster</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default MainPanel;
