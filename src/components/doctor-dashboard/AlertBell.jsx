import React, { useState, useRef, useEffect } from 'react';

const AlertBell = ({ appointments, onStatusChange }) => {
 const [isOpen, setIsOpen] = useState(false);
 const dropdownRef = useRef(null);

 // Derive precisely only explicit pending queue structures securely
 const pendingRequests = appointments.filter(app => app.status === 'pending');
 const count = pendingRequests.length;

 // Map explicitly detecting external clicks natively
 useEffect(() => {
 const handleClickOutside = (event) => {
 if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
 setIsOpen(false);
 }
 };
 document.addEventListener("mousedown", handleClickOutside);
 return () => document.removeEventListener("mousedown", handleClickOutside);
 }, []);

 return (
 <>
 {/* Full Screen Blur Overlay when Open */}
 {isOpen && (
 <div 
 className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-40 animate-fade-in"
 onClick={() => setIsOpen(false)}
 />
 )}

 <div className="relative z-50" ref={dropdownRef}>
 {/* Icon Trigger Bubble */}
 <button onClick={() => setIsOpen(!isOpen)}
 className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 relative hover:scale-105 transition-transform duration-300"
 >
 <svg className="w-6 h-6 text-slate-800 " fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
 </svg>
 {/* Dynamic Pulsing Badge Native Architecture */}
 {count > 0 && (
 <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center animate-bounce shadow-md border-2 border-white " />
 )}
 </button>

 {/* Overarching Embedded Dropdown Array Modal */}
 {isOpen && (
 <div className="absolute right-0 mt-4 w-80 md:w-96 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden transform origin-top-right transition-all animate-fade-in-down">
 <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
 <h3 className="font-bold text-slate-800 text-lg">Notifications</h3>
 <span className="text-xs font-black uppercase text-clinic-600 tracking-widest">{count > 0 ? `${count} Pending` : 'Up to date'}</span>
 </div>

 <div className="max-h-[60vh] overflow-y-auto no-scrollbar p-2">
 {count === 0 ? (
 <div className="py-8 text-center text-gray-400 font-semibold text-sm">
 You have no incoming appointment requests naturally pending.
 </div>
 ) : (
 <div className="space-y-2">
 {pendingRequests.map((request) => (
 <div key={request.id} className="p-4 bg-white rounded-2xl border border-gray-50 hover:border-blue-100 transition-colors shadow-sm">
 <div className="flex justify-between items-start mb-2">
 <div>
 <h4 className="font-bold text-slate-800 ">{request.name}</h4>
 <span className="text-xs font-semibold text-gray-500 block">{request.date} @ {request.time}</span>
 </div>
 <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 font-bold text-[10px] uppercase tracking-wider">Requested</span>
 </div>
 <div className="text-sm font-medium text-gray-600 mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100 ">
 {request.symptoms ? `"${request.symptoms}"` : 'No explicit symptoms declared.'}
 </div>

 <div className="flex gap-2">
 <button onClick={() => onStatusChange(request.id, 'approved')}
 className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-lg shadow-green-500/20"
 >
 Accept
 </button>
 <button onClick={() => onStatusChange(request.id, 'rejected')}
 className="flex-1 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-500 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
 >
 Decline
 </button>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 )}
 </div>
 </>
 );
};

export default AlertBell;
