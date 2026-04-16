import React from 'react';

const TodayAppointments = ({ appointments }) => {
  // Ensure we format current date correctly matching DD-MM-YYYY
  const todayRaw = new Date();
  const todayFormatted = `${String(todayRaw.getDate()).padStart(2, '0')}-${String(todayRaw.getMonth() + 1).padStart(2, '0')}-${todayRaw.getFullYear()}`;

  const todayList = appointments
    .filter(app => app.date === todayFormatted)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] shadow-xl shadow-blue-500/5 p-8 w-full transition-colors duration-300 h-[380px] flex flex-col">
      <div className="flex justify-between items-center mb-2 shrink-0">
        <h3 className="text-xl font-bold text-slate-800 transition-colors">Today's Appointments</h3>
        <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-clinic-600 rounded-full transition-colors">{todayList.length} matches</span>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto flex-1 pb-4">
        {todayList.length === 0 ? (
          <div className="text-center text-sm py-4 text-gray-400 font-medium transition-colors">No scheduled appointments for today.</div>
        ) : (
          todayList.map(app => {
            const displayName = app.name || (app.patient && app.patient.name) || "Walk-In";
            const displayChar = typeof displayName === 'string' && displayName.length > 0 ? displayName.charAt(0).toUpperCase() : "W";
            return (
              <div key={app.id} className="flex items-center justify-between p-4 bg-transparent border border-gray-50 rounded-2xl hover:shadow-md transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-clinic-600 flex items-center justify-center font-bold text-lg shadow-sm transition-colors">
                    {displayChar}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 transition-colors">{displayName}</div>
                    <div className="text-xs text-clinic-600/80 font-bold uppercase tracking-wider transition-colors">{app.time}</div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="font-bold text-clinic-600 flex items-center gap-1 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {app.time}
                  </div>
                  <div className="mt-1">
                    {app.status === 'in_progress' && <span className="bg-blue-100 text-blue-600 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md transition-colors shadow-sm animate-pulse">In Progress</span>}
                    {app.status === 'completed' && <span className="bg-gray-200 text-gray-600 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md transition-colors">Completed</span>}
                    {app.status === 'approved' && <span className="bg-green-100 text-green-600 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md transition-colors">Approved</span>}
                    {app.status === 'pending' && <span className="bg-amber-100 text-amber-600 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md transition-colors">Pending</span>}
                    {app.status === 'rejected' && <span className="bg-red-100 text-red-600 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md transition-colors">Rejected</span>}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TodayAppointments;
