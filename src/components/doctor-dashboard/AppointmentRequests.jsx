import React from 'react';

const AppointmentRequests = ({ appointments, onStatusChange }) => {
 // Sort by date then time natively comparing raw string structures (since format is DD-MM-YYYY)
 const sortedList = [...appointments].sort((a, b) => {
 const dateA = a.date.split('-').reverse().join('-');
 const dateB = b.date.split('-').reverse().join('-');
 if (dateA === dateB) return a.time.localeCompare(b.time);
 return dateA.localeCompare(dateB);
 });

 return (
 <div className="w-full bg-white border border-gray-100 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] p-6 mb-10 overflow-hidden transition-colors duration-300">
 <h3 className="text-xl font-bold mb-6 text-slate-800 transition-colors">Appointment History & Requests</h3>

 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="border-b border-gray-100 text-sm text-gray-400 font-semibold uppercase tracking-wider transition-colors">
 <th className="py-4 pl-2 font-bold">Patient</th>
 <th className="py-4 font-bold">Date & Time</th>
 <th className="py-4 font-bold">Status</th>
 <th className="py-4 font-bold text-right pr-2">Action</th>
 </tr>
 </thead>
 <tbody>
 {sortedList.length === 0 ? (
 <tr>
 <td colSpan="4" className="text-center py-8 text-gray-400 font-medium border-b border-dashed transition-colors">No historical data found.</td>
 </tr>
 ) : (
 sortedList.map(app => {
 const displayName = app.name || (app.patient && app.patient.name) || "patient name is not found";
 const displayChar = typeof displayName === 'string' && displayName.length > 0 ? displayName.charAt(0).toUpperCase() : "W";
 return (
 <tr key={app.id} className="border-b border-gray-50 hover:bg-transparent transition-colors group">
 <td className="py-4 pl-2 flex items-center gap-3">
 <div className="w-10 h-10 rounded-full bg-blue-100 text-clinic-600 flex items-center justify-center font-bold text-sm transition-colors">
 {displayChar}
 </div>
 <div>
 <div className="font-bold text-slate-800 text-sm whitespace-nowrap transition-colors">{displayName}</div>
 <div className="text-[10px] text-gray-400 font-bold tracking-wider transition-colors">{app.age || "--"} yrs • {app.gender || "Unknown"}</div>
 </div>
 </td>
 <td className="py-4 text-sm font-semibold text-slate-600 whitespace-nowrap transition-colors">
 {app.date} <br/> <span className="text-xs text-gray-400 ">{app.time}</span>
 </td>
 <td className="py-4">
 {app.status === 'in_progress' && <span className="bg-blue-100 text-blue-600 text-[10px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-md transition-colors shadow-sm animate-pulse">In Progress</span>}
 {app.status === 'completed' && <span className="bg-gray-100 text-gray-500 text-[10px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-md transition-colors">Completed</span>}
 {app.status === 'approved' && <span className="bg-green-100 text-green-600 text-[10px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-md transition-colors">Approved</span>}
 {app.status === 'pending' && <span className="bg-yellow-100 text-amber-500 text-[10px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-md shadow-sm transition-colors">Pending</span>}
 {app.status === 'rejected' && <span className="bg-red-100 text-red-500 text-[10px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-md transition-colors">Rejected</span>}
 </td>
 <td className="py-4 text-right pr-2">
 {app.status === 'pending' ? (
 <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
 <button onClick={() => onStatusChange(app.id, 'approved')} className="w-8 h-8 rounded-xl bg-green-500 text-white flex items-center justify-center hover:bg-green-600 hover:scale-105 transition-all shadow-md shadow-green-500/20"
 title="Approve"
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
 </button>
 <button onClick={() => onStatusChange(app.id, 'rejected')} className="w-8 h-8 rounded-xl bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200 transition-colors"
 title="Reject"
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
 </button>
 </div>
 ) : (
 <span className="text-xs text-gray-300 font-semibold italic transition-colors">No actions</span>
 )}
 </td>
 </tr>
 );
 })
 )}
 </tbody>
 </table>
 </div>
 </div>
 );
};

export default AppointmentRequests;
