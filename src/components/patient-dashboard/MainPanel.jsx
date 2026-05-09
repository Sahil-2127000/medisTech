import React, { useState, useMemo } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import AppointmentsView from './AppointmentsView';
import DocumentsView from './DocumentsView';
import ProfileView from './ProfileView';
import SettingsView from './SettingsView';
import LiveQueueUI from './LiveQueueUI';

const MainPanel = ({ patientData, activeTab, onBookClick, onVitalsUpdate, onTabChange }) => {
  const [showVitalModal, setShowVitalModal] = useState(false);
  const [activeStatModal, setActiveStatModal] = useState(null); // 'total', 'prescriptions', 'completed', 'pending'
  const [vitalForm, setVitalForm] = useState({ type: 'Blood Pressure', value: '' });
  const [showNotifications, setShowNotifications] = useState(false);
  const [lastSeenNotificationId, setLastSeenNotificationId] = useState(null);

  const notifications = useMemo(() => {
    const allApps = [...(patientData.history || []), ...(patientData.upcoming || [])];
    return allApps
      .filter(app => ['approved', 'rejected', 'completed', 'cancelled'].includes(app.status))
      // Sort newest first by parsing DD-MM-YYYY
      .sort((a, b) => {
         const dateA = new Date(a.date.split('-').reverse().join('-'));
         const dateB = new Date(b.date.split('-').reverse().join('-'));
         return dateB - dateA;
      })
      .slice(0, 5) // Show only latest 5
      .map(app => ({
        id: `${app._id || app.doctor}-${app.date}-${app.status}`,
        title: `Appointment ${app.status.charAt(0).toUpperCase() + app.status.slice(1)}`,
        message: `Your appointment with ${app.doctor} on ${app.date} has been ${app.status}.`,
        time: app.date,
        status: app.status
      }));
  }, [patientData]);

  const handleVitalSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5001/api/vitals/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vitalForm),
        credentials: 'include'
      });
      if (res.ok) {
        setShowVitalModal(false);
        setVitalForm({ type: 'Blood Pressure', value: '' });
        if (onVitalsUpdate) onVitalsUpdate();
      }
    } catch (err) { console.error(err); }
  };

  if (activeTab === 'calendar') return <AppointmentsView appointments={[...(patientData.upcoming || []), ...(patientData.history || [])]} onBookClick={onBookClick} />;
  if (activeTab === 'docs') return <DocumentsView prescriptions={patientData.prescriptions || []} patientData={patientData} />;
  if (activeTab === 'profile') return <ProfileView patientData={patientData} />;
  if (activeTab === 'settings') return <SettingsView patientData={patientData} />
  if (activeTab === 'queue') {
    const doctorId = patientData.upcoming?.[0]?.doctorId?._id || "60b8c8d8f1e6b3b3a4a9c888";
    const doctorName = patientData.upcoming?.[0]?.doctor || "Dr. Specialist";
    return <LiveQueueUI doctorId={doctorId} doctorName={doctorName} />;
  }

  const completedCount = [...(patientData.history || []), ...(patientData.upcoming || [])]
    .filter(app => app.status === 'completed').length;

  const todayApps = patientData.upcoming?.filter(app => app.date === new Date().toLocaleDateString('en-GB').replace(/\//g, '-')) || [];

  return (
    <div className="flex-1 h-full py-6 md:py-6 px-6 md:px-10 flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar bg-[#F8FAFC] dark:bg-slate-900 rounded-[2.5rem]">
      {/* Header */}
      <div className="flex justify-between items-end mb-6 relative z-10 shrink-0">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">Dashboard</h1>

        <div className="flex items-center gap-4 relative">
          <button onClick={onBookClick} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Book Appointment
          </button>
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications && notifications.length > 0) {
                  setLastSeenNotificationId(notifications[0].id);
                }
              }} 
              className={`w-11 h-11 rounded-full flex items-center justify-center shadow-sm border transition-colors relative ${showNotifications ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-white/10 text-slate-600 dark:text-slate-300'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              {notifications.length > 0 && notifications[0]?.id !== lastSeenNotificationId && (
                <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
              )}
            </button>
            
            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl shadow-blue-500/10 border border-[#5265ec]/30 dark:border-blue-400/30 overflow-hidden z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-[#5265ec]/10 dark:border-blue-400/20 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full">{notifications.length} New</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map(notif => (
                      <div key={notif.id} className="p-4 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors flex gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notif.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : notif.status === 'completed' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                          {notif.status === 'approved' && <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                          {notif.status === 'completed' && <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                          {(notif.status === 'rejected' || notif.status === 'cancelled') && <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-800 dark:text-white mb-0.5">{notif.title}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 leading-snug">{notif.message}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{notif.time}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-slate-500 text-sm">
                      No recent notifications.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🔵 DOCTOR-STYLE WELCOME BANNER 🔵 */}
      <div className="relative w-full shrink-0 min-h-[150px] rounded-3xl overflow-hidden mb-8 bg-linear-to-r from-blue-600 via-[#3963F9] to-blue-400 animate-gradient-xy flex items-center shadow-xl shadow-blue-600/20">
        <div className="relative z-10 px-8 py-8 md:px-12 flex flex-col justify-center w-full">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight drop-shadow-sm">
            Welcome , {patientData.name}
          </h2>
          <p className="text-blue-100 font-medium text-base md:text-lg drop-shadow-sm opacity-90">
            Have a nice and healthy day!
          </p>
        </div>
        {/* Soft Beautiful Geometric Overlay Accents Mapping the Background */}
        <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[20px] -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute right-[15%] bottom-[-50%] w-[300px] h-[300px] bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 shrink-0">
        {/* Card 1: Total Appointments */}
        <div onClick={() => onTabChange('calendar', '?filter=all')} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-100 dark:border-slate-700 flex items-center gap-4 relative overflow-hidden cursor-pointer hover:-translate-y-1 transition-all">
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-blue-500/10 to-transparent pointer-events-none"></div>
          <div className="w-12 h-12 rounded-xl bg-[#3B82F6] text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <div>
            <div className="text-xl font-extrabold text-[#0F172A] dark:text-white leading-none mb-1">
              {(patientData.upcoming?.length || 0) + (patientData.history?.length || 0)}
            </div>
            <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Total Appointments</div>
          </div>
        </div>

        {/* Card 2: Total Prescriptions */}
        <div onClick={() => onTabChange('docs')} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-100 dark:border-slate-700 flex items-center gap-4 relative overflow-hidden cursor-pointer hover:-translate-y-1 transition-all">
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-teal-400/10 to-transparent pointer-events-none"></div>
          <div className="w-12 h-12 rounded-xl bg-[#14B8A6] text-white flex items-center justify-center shrink-0 shadow-lg shadow-teal-400/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <div>
            <div className="text-xl font-extrabold text-[#0F172A] dark:text-white leading-none mb-1">
              {patientData.prescriptionsCount || 0}
            </div>
            <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Prescriptions</div>
          </div>
        </div>

        {/* Card 3: Completed Visits */}
        <div onClick={() => onTabChange('calendar', '?filter=completed')} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-100 dark:border-slate-700 flex items-center gap-4 relative overflow-hidden cursor-pointer hover:-translate-y-1 transition-all">
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-emerald-500/10 to-transparent pointer-events-none"></div>
          <div className="w-12 h-12 rounded-xl bg-[#22C55E] text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <div className="text-xl font-extrabold text-[#0F172A] dark:text-white leading-none mb-1">
              {completedCount}
            </div>
            <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Completed</div>
          </div>
        </div>

        {/* Card 4: Pending Requests */}
        <div onClick={() => onTabChange('calendar', '?filter=pending')} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-100 dark:border-slate-700 flex items-center gap-4 relative overflow-hidden cursor-pointer hover:-translate-y-1 transition-all">
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-amber-400/10 to-transparent pointer-events-none"></div>
          <div className="w-12 h-12 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-400/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <div className="text-xl font-extrabold text-[#0F172A] dark:text-white leading-none mb-1">
              {patientData.upcoming?.filter(app => app.status === 'pending').length || 0}
            </div>
            <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Pending Requests</div>
          </div>
        </div>
      </div>

      {/* 3 Large Bottom Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1 min-h-[250px] mb-2">

        {/* Next Upcoming Appointment */}
        {(() => {
          const nextApps = patientData.upcoming?.filter(app => ['approved', 'pending'].includes(app.status)) || [];
          const nextApp = nextApps.length > 0 ? nextApps[0] : null;
          const patientName = nextApp?.patientName && nextApp.patientName !== 'All Family' ? nextApp.patientName : 'Me';

          return (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col h-full relative overflow-hidden">
              {/* Subtle Blue Corner Tints (Smaller size) */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#5265ec]/20 blur-xl rounded-full pointer-events-none"></div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#5265ec]/20 blur-xl rounded-full pointer-events-none"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#5265ec]/20 blur-xl rounded-full pointer-events-none"></div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#5265ec]/20 blur-xl rounded-full pointer-events-none"></div>

              <h3 className="font-extrabold text-[#0F172A] dark:text-white mb-4 text-base shrink-0 relative z-10 leading-snug">
                Upcoming Appointment for <br/>
                <span className="text-[#5265ec]">{patientName}</span>
              </h3>
              
              <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
                {nextApp ? (
                  <div className="bg-[#5265ec]/[0.04] dark:bg-slate-700/80 w-full p-6 rounded-2xl border border-[#5265ec]/20 dark:border-slate-600 hover:shadow-md transition-all cursor-pointer group" onClick={() => onTabChange('calendar')}>
                    <div className="w-16 h-16 rounded-full bg-[#5265ec]/10 text-[#5265ec] mx-auto flex items-center justify-center mb-4 shadow-sm border border-white group-hover:scale-105 transition-transform">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <div className="text-xl font-black text-slate-800 dark:text-white tracking-tight">{nextApp.doctor}</div>
                    <div className="text-xs font-bold text-[#5265ec] bg-white/80 dark:bg-slate-800/80 py-2 px-4 rounded-xl inline-block mt-3 shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-slate-100">
                      {nextApp.date} <span className="opacity-50 mx-1">at</span> {nextApp.time}
                    </div>
                  </div>
                ) : (
                  <div className="text-[#94A3B8] font-medium text-sm px-6">
                    No more upcoming appointments in queue.
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Latest Health Vitals */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col h-full relative">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h3 className="font-extrabold text-[#0F172A] dark:text-white text-base">Health Vitals</h3>
            <button onClick={() => setShowVitalModal(true)} className="text-blue-600 font-bold text-[11px] uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
              Update
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-4">
            {[
              {
                label: 'Blood Pressure',
                value: patientData.vitals?.find(v => v.type === 'Blood Pressure')?.value || '120/80',
                color: 'emerald',
                unit: 'mmHg',
                icon: <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              },
              {
                label: 'Heart Rate',
                value: patientData.vitals?.find(v => v.type === 'Heart Rate')?.value || '72',
                color: 'rose',
                unit: 'BPM',
                icon: <path d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
              },
              {
                label: 'Blood Sugar',
                value: patientData.vitals?.find(v => v.type === 'Blood Sugar')?.value || '95',
                color: 'amber',
                unit: 'mg/dL',
                icon: <path d="M12 3v18m9-9H3" />
              }
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-[#F8FAFC] dark:bg-slate-700/50 p-3 rounded-2xl border border-[#E2E8F0] dark:border-slate-600 transition-all">
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-500/20 text-${stat.color}-500 flex items-center justify-center shrink-0`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{stat.icon}</svg>
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{stat.label}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-slate-800 dark:text-white leading-none">{stat.value}</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">{stat.unit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="bg-[#F8FAFC] dark:bg-slate-800/80 rounded-3xl p-6 shadow-lg border border-[#E2E8F0] dark:border-slate-700 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h3 className="font-extrabold text-[#0F172A] dark:text-white text-base">Today's Appointments</h3>
            <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-1.5 rounded-full w-25 text-center">
              {todayApps.length} matches
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center  text-center">
            {todayApps.length > 0 ? (
              <div className="w-full space-y-4">
                {todayApps.map((app, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-700 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-600 text-left flex justify-between items-center transition-all hover:shadow-md">
                    <div>
                      <div className="text-sm font-bold text-slate-800 dark:text-white">{app.doctor}</div>
                      <div className="text-xs font-medium text-slate-500 mt-1">{app.time}</div>
                    </div>
                    <div className={`text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase ${app.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{app.status}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[#94A3B8] font-medium text-sm px-6">
                No scheduled appointments for today.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Vital Capture Modal */}
      {showVitalModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-fade-in">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-md shadow-2xl relative animate-slide-up border border-slate-100">
            <button onClick={() => setShowVitalModal(false)} className="absolute top-8 right-8 text-gray-400 hover:text-slate-800 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-3xl font-black text-slate-800 mb-2">Record Vital</h3>
            <p className="text-gray-400 font-medium mb-8">Enter your latest health reading for tracking.</p>

            <form onSubmit={handleVitalSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Vital Type</label>
                <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#5265ec]/20 transition-all appearance-none" value={vitalForm.type} onChange={e => setVitalForm({ ...vitalForm, type: e.target.value })}>
                  <option>Blood Pressure</option>
                  <option>Heart Rate</option>
                  <option>Blood Sugar</option>
                  <option>Weight</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">New Value</label>
                <input type="text" placeholder={vitalForm.type === 'Blood Pressure' ? 'e.g. 120/80' : 'e.g. 72'} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#5265ec]/20 transition-all" value={vitalForm.value} onChange={e => setVitalForm({ ...vitalForm, value: e.target.value })} required />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/30 hover:bg-blue-700 active:scale-[0.98] transition-all">
                Log Vital Data
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Stat Detail Modal */}
      {activeStatModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-fade-in" onClick={() => setActiveStatModal(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] w-full max-w-lg shadow-2xl relative animate-slide-up border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
            <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white capitalize">
                {activeStatModal === 'total' ? 'All Appointments' : activeStatModal + ' Appointments'}
              </h3>
              <button onClick={() => setActiveStatModal(null)} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-8 overflow-y-auto flex-1 no-scrollbar space-y-4">
              {(() => {
                let list = [];
                const allApps = [...(patientData.history || []), ...(patientData.upcoming || [])];
                if (activeStatModal === 'total') list = allApps;
                else if (activeStatModal === 'completed') list = allApps.filter(a => a.status === 'completed');
                else if (activeStatModal === 'pending') list = allApps.filter(a => a.status === 'pending');

                if (list.length === 0) {
                  return <div className="text-center py-10 text-slate-400 font-medium">No records found.</div>;
                }

                return list.map((app, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="font-bold text-slate-800 dark:text-white text-lg">{app.doctor}</div>
                      <div className="text-sm font-medium text-slate-500">{app.date} at {app.time}</div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${app.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                      app.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                        app.status === 'approved' ? 'bg-blue-100 text-blue-600' :
                          'bg-slate-100 text-slate-600'
                      }`}>
                      {app.status}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPanel;
