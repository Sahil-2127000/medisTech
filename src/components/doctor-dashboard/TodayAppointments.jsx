import React from 'react';
import PatientRxHistory from './PatientRxHistory';

const TodayAppointments = ({ appointments, onStatusChange }) => {
  // Ensure we format current date correctly matching DD-MM-YYYY
  const todayRaw = new Date();
  const todayFormatted = `${String(todayRaw.getDate()).padStart(2, '0')}-${String(todayRaw.getMonth() + 1).padStart(2, '0')}-${todayRaw.getFullYear()}`;

  const todayList = appointments
    .filter(app => app.date === todayFormatted)
    .sort((a, b) => a.time.localeCompare(b.time));

  const formatTime12Hour = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(':');
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHour = h % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

 return (
 <div className="bg-white border border-gray-100 rounded-3xl p-4 lg:p-6 mb-0 w-full transition-colors duration-300 lg:h-[340px] flex flex-col shadow-xl shadow-clinic-600/20 relative overflow-hidden">

    <div className="absolute -top-20 -left-30 w-68  h-50 bg-blue-300 rounded-full opacity-20 blur-2xl pointer-events-none z-0"></div>

 <div className="flex justify-between items-center gap-2 mb-4 shrink-0 z-1">
 <h3 className="text-lg xl:text-xl font-bold text-slate-800 transition-colors truncate"><span className="xl:hidden 2xl:inline">Today's Appointments</span><span className="hidden xl:inline 2xl:hidden">Today</span></h3>
 <span className="shrink-0 whitespace-nowrap text-xs font-semibold px-2.5 py-1 bg-blue-50 text-clinic-600 rounded-full transition-colors z-1">{todayList.length} {todayList.length === 1 ? 'booking' : 'bookings'}</span>
 </div>

 <div className="flex flex-col gap-3 overflow-y-auto no-scrollbar flex-1 pb-4 z-1">
 {todayList.length === 0 ? (
 <div className="text-center text-sm py-4 text-gray-400 font-medium transition-colors z-1">No scheduled appointments for today.</div>
 ) : (
 todayList.map(app => {
 const displayName = app.name || (app.patient && app.patient.name) || "Walk-In";
 const displayChar = typeof displayName === 'string' && displayName.length > 0 ? displayName.charAt(0).toUpperCase() : "W";
 const badge = {
   in_progress: ['In Progress', 'bg-blue-100 text-blue-600'],
   completed: ['Completed', 'bg-gray-100 text-gray-500'],
   approved: ['Approved', 'bg-green-100 text-green-600'],
   pending: ['Pending', 'bg-amber-100 text-amber-600'],
   rejected: ['Rejected', 'bg-red-100 text-red-600'],
   cancelled: ['Cancelled', 'bg-red-100 text-red-600'],
 }[app.status];
 return (
 <div key={app.id} className="flex items-center gap-2.5 px-2.5 py-2.5 bg-white border-2 border-gray-100 rounded-2xl hover:shadow-md transition-all group z-1 min-w-0">
   <div className="w-9 h-9 shrink-0 rounded-full bg-blue-100 text-clinic-600 flex items-center justify-center font-bold text-sm shadow-sm">
     {displayChar}
   </div>
   <div className="min-w-0 flex-1">
     <div className="flex items-center gap-1.5 min-w-0">
       <span className="font-bold text-sm text-slate-800 truncate">{displayName}</span>
       {app.hasHistory && app.patientId && <PatientRxHistory patientId={app.patientId} patientName={displayName} />}
     </div>
     <div className="flex items-center gap-2 mt-0.5 whitespace-nowrap">
       <span className="text-xs font-semibold text-clinic-600">{formatTime12Hour(app.time)}</span>
       {badge && !(app.status === 'pending' && onStatusChange) && <span className={`${badge[1]} text-[10px] uppercase tracking-wide font-bold px-1.5 py-0.5 rounded-md`}>{badge[0]}</span>}
     </div>
   </div>
   {app.status === 'pending' && onStatusChange && (
     <button
       onClick={() => onStatusChange(app.id, 'approved')}
       title="Accept this appointment"
       aria-label="Accept"
       className="shrink-0 h-8 min-w-8 flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-2.5 xl:px-2 2xl:px-3 rounded-lg shadow-sm transition-colors active:scale-95"
     >
       <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
       <span className="xl:hidden 2xl:inline">Accept</span>
     </button>
   )}
 </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TodayAppointments;
