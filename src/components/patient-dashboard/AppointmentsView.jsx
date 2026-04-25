import React from 'react';
import { motion } from 'framer-motion';

const AppointmentsView = ({ appointments = [], onBookClick }) => {
    // Helper to parse DD-MM-YYYY date strings into Date objects for sorting
    const parseDate = (d) => {
        if (!d) return new Date(0);
        const [day, month, year] = d.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    // 1. Sort all appointments by date (Newest/Latest first)
    // We also sort by time as a secondary factor
    const sortedAppointments = [...appointments].sort((a, b) => {
        const dateDiff = parseDate(b.date) - parseDate(a.date);
        if (dateDiff !== 0) return dateDiff;
        return (b.time || "").localeCompare(a.time || "");
    });

    // 2. Group sorted appointments by patient (family members)
    // Preservation of order in the reduce ensures groups appear in order of their latest appointment
    const groupedAppointments = sortedAppointments.reduce((acc, app) => {
        const patientKey = app.patientName || "Primary Account";
        if (!acc[patientKey]) acc[patientKey] = [];
        acc[patientKey].push(app);
        return acc;
    }, {});

    const patientNames = Object.keys(groupedAppointments);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'pending': return { 
                badge: 'bg-amber-100 text-amber-900 border-amber-400 font-black', 
                card: 'bg-gradient-to-r from-amber-100/60 via-white to-white border-amber-200/60 shadow-[0_15px_40px_rgba(217,119,6,0.05)]',
                text: 'text-slate-900',
                subtext: 'text-slate-500',
                icon: 'bg-amber-100 text-amber-700'
            };
            case 'approved': return { 
                badge: 'bg-emerald-100 text-emerald-900 border-emerald-600 font-black', 
                card: 'bg-gradient-to-r from-emerald-100/60 via-white to-white border-emerald-200/60 shadow-[0_15px_40px_rgba(16,185,129,0.05)]',
                text: 'text-slate-900',
                subtext: 'text-slate-500',
                icon: 'bg-emerald-100 text-emerald-700'
            };
            case 'completed': return { 
                badge: 'bg-blue-100 text-blue-900 border-blue-600 font-black', 
                card: 'bg-gradient-to-r from-blue-100/60 via-white to-white border-blue-200/60 shadow-[0_15px_40px_rgba(59,130,246,0.05)]',
                text: 'text-slate-900',
                subtext: 'text-slate-500',
                icon: 'bg-blue-100 text-blue-700'
            };
            case 'rejected': return { 
                badge: 'bg-rose-100 text-rose-900 border-rose-600 font-black', 
                card: 'bg-gradient-to-r from-rose-100/60 via-white to-white border-rose-200/60 shadow-[0_15px_40px_rgba(244,63,94,0.05)]',
                text: 'text-slate-900',
                subtext: 'text-slate-500',
                icon: 'bg-rose-100 text-rose-700'
            };
            case 'emergency_active': return { 
                badge: 'bg-purple-100 text-purple-900 border-purple-600 font-black animate-pulse', 
                card: 'bg-gradient-to-r from-purple-100/60 via-white to-white border-purple-200/60 shadow-[0_15px_40px_rgba(147,51,234,0.05)]',
                text: 'text-slate-900',
                subtext: 'text-slate-500',
                icon: 'bg-purple-100 text-purple-700'
            };
            default: return { 
                badge: 'bg-gray-100 text-gray-600 border-gray-200 font-black', 
                card: 'bg-white border-gray-100 shadow-sm',
                text: 'text-slate-800',
                subtext: 'text-slate-400',
                icon: 'bg-slate-50 text-slate-400'
            };
        }
    };

    return (
        <div className="flex-1 h-full py-8 md:py-12 px-6 md:px-12 flex flex-col overflow-y-auto no-scrollbar bg-transparent">
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-2">My Appointments</h1>
                    <p className="text-gray-400 font-bold text-lg">Manage visits for you and your family</p>
                </motion.div>
                
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onBookClick}
                    className="bg-linear-to-r from-[#5265ec] to-[#6366f1] text-white px-8 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-[#5265ec]/40 transition-all flex items-center gap-3 border border-white/20"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
                    Book Appointment
                </motion.button>
            </div>

            {appointments.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/60 backdrop-blur-2xl rounded-[3rem] border border-white p-12 flex flex-col items-center justify-center min-h-[400px] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.04)]"
                >
                    <div className="w-20 h-20 bg-[#5265ec]/10 text-[#5265ec] rounded-full flex items-center justify-center mb-6">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">No Appointments Yet</h2>
                    <p className="text-gray-400 font-bold text-center max-w-md mb-8">Schedule your first health checkup easily.</p>
                    <button onClick={onBookClick} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all">Book Now</button>
                </motion.div>
            ) : (
                <div className="space-y-12 pb-20">
                    {patientNames.map((name, patientIdx) => (
                        <motion.div 
                            key={name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: patientIdx * 0.1 }}
                            className="flex flex-col"
                        >
                            {/* Group Header */}
                            <div className="flex items-center gap-4 mb-6 ml-2">
                                <div className="w-10 h-1 bg-gradient-to-r from-[#5265ec] to-transparent rounded-full"></div>
                                <h2 className="text-xl font-black text-slate-800 tracking-tight">
                                    Appointments for <span className="text-[#5265ec]">{name === "Primary Account" ? "Me" : name}</span>
                                </h2>
                                <span className="bg-slate-100 text-slate-400 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ml-auto md:ml-0">
                                    {groupedAppointments[name].length} Records
                                </span>
                            </div>

                            {/* List of Rows */}
                            <div className="space-y-4">
                                {groupedAppointments[name].map((app, appIdx) => {
                                    const styles = getStatusStyles(app.status);
                                    return (
                                        <motion.div 
                                            key={app._id || appIdx}
                                            whileHover={{ x: 10, scale: 1.01 }}
                                            className={`${styles.card} border rounded-[2rem] p-4 md:p-6 transition-all flex flex-col md:flex-row md:items-center gap-6 group cursor-pointer relative overflow-hidden`}
                                        >
                                            {/* Status Accent Bar */}
                                            <div className={`absolute left-0 top-0 bottom-0 w-3 ${app.status === 'approved' ? 'bg-emerald-500' : app.status === 'pending' ? 'bg-amber-500' : app.status === 'completed' ? 'bg-blue-500' : 'bg-red-500'}`}></div>

                                            {/* Doctor Avatar & Name */}
                                            <div className="flex items-center gap-4 md:w-1/3 relative z-10">
                                                <div className="relative shrink-0">
                                                    <img 
                                                        src={app.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.doctor)}&background=5265ec&color=fff&bold=true`} 
                                                        alt="doctor" 
                                                        className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-110 transition-transform duration-500" 
                                                    />
                                                </div>
                                                <div>
                                                    <div className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${styles.subtext}`}>Consultant</div>
                                                    <div className={`text-xl font-black transition-colors leading-tight ${styles.text}`}>{app.doctor}</div>
                                                </div>
                                            </div>

                                            {/* Schedule Info */}
                                            <div className="flex items-center gap-8 md:flex-1 relative z-10">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm ${styles.icon}`}>
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                                    </div>
                                                    <div>
                                                        <div className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${styles.subtext}`}>Date</div>
                                                        <div className={`text-base font-black ${styles.text}`}>{app.date}</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm ${styles.icon}`}>
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    </div>
                                                    <div>
                                                        <div className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${styles.subtext}`}>Time</div>
                                                        <div className={`text-base font-black ${styles.text}`}>{app.time}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status Badge */}
                                            <div className="flex items-center justify-between md:justify-end md:w-1/4 gap-4 relative z-10">
                                                <div className={`px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-xs ${styles.badge}`}>
                                                    {app.status === 'emergency_active' ? 'Emergency Shift' : app.status === 'approved' ? 'Accepted' : app.status}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AppointmentsView;
