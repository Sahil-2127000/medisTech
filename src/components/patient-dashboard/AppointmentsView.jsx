import React from 'react';

const AppointmentsView = ({ appointments = [], onBookClick }) => {
  return (
    <div className="flex-1 h-full py-8 md:py-12 px-6 md:px-12 flex flex-col overflow-y-auto no-scrollbar">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-[#021024]">My Appointments</h1>
          <p className="text-gray-400 font-medium mt-1">Manage your upcoming and past visits</p>
        </div>
        {appointments.length > 0 && (
          <button onClick={onBookClick} className="bg-[#5265ec] hover:bg-[#4254d3] text-white px-6 py-2.5 rounded-xl font-semibold shadow-md shadow-[#5265ec]/30 transition-all flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
            Book New
          </button>
        )}
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_20px_rgba(0,0,0,0.03)] p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-20 h-20 bg-[#5265ec]/10 text-[#5265ec] rounded-full flex items-center justify-center mb-6 shadow-sm">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">No Appointments Yet</h2>
        <p className="text-gray-500 text-center max-w-md mb-8">You don't have any upcoming appointments scheduled at the moment. Click "Book Appointment" to schedule one.</p>
        <button onClick={onBookClick} className="bg-[#5265ec] hover:bg-[#4254d3] text-white px-8 py-3 rounded-2xl font-semibold shadow-lg shadow-[#5265ec]/30 transition-all flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          Book New Appointment
        </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((app, i) => (
             <div key={i} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col group cursor-pointer w-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#5265ec]"></div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={app.img} alt="doctor" className="w-10 h-10 rounded-full border border-gray-200" />
                    <div>
                      <div className="font-bold text-slate-800 group-hover:text-[#5265ec] transition-colors leading-tight">{app.doctor}</div>
                      <div className="mt-1">
                        {app.status === 'pending' && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">Pending</span>}
                        {app.status === 'approved' && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-100">Accepted</span>}
                        {app.status === 'completed' && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">Completed</span>}
                        {app.status === 'rejected' && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">Cancelled</span>}
                        {app.status === 'emergency_active' && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-100 italic animate-pulse">Emergency Shift</span>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-auto space-y-3">
                  <div className="flex items-center gap-2 text-gray-400 text-sm font-semibold">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    <span>{app.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm font-semibold">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{app.time}</span>
                  </div>
                </div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentsView;
