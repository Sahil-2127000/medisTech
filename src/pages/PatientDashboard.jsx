import React, { useState, useEffect } from 'react';
import Sidebar from '../components/patient-dashboard/Sidebar';
import MainPanel from '../components/patient-dashboard/MainPanel';
import RightPanel from '../components/patient-dashboard/RightPanel';
import BookAppointment from '../components/patient-dashboard/BookAppointment';

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');

  // Attempt to load real logged-in user profile, fallback to Guest
  const savedUser = JSON.parse(sessionStorage.getItem('user')) || {};
  const activeName = savedUser.fullName || "John Doe";

  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [emergencyAlert, setEmergencyAlert] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  // Poll exactly specifically against live backend mappings targeting array mutations!
  const pollAppointments = async () => {
     try {
       const res = await fetch('http://localhost:5001/api/appointments/my', { credentials: 'include' });
       if (res.ok) {
         const data = await res.json();
         setUpcomingAppointments(data);

         // Crucial Notification Logic Strategy evaluating math shifts!
         const delayed = data.find(app => Number(app.emergencyDelayedMinutes) > 0 && app.status !== 'completed');
         if (delayed) {
           setEmergencyAlert({
              doctor: delayed.doctorId?.fullName,
              delay: delayed.emergencyDelayedMinutes,
              newTime: delayed.time
           });
         } else {
           setEmergencyAlert(null);
         }
       }
     } catch(e) { }
  };

  useEffect(() => {
    pollAppointments();
    const interval = setInterval(pollAppointments, 15000); // Poll intensely natively every 15s syncing
    return () => clearInterval(interval);
  }, []);

  // Structural mock data blending with actual fetched lengths natively dynamically
  const patientData = {
    name: activeName,
    avatar: `https://placehold.co/150x150/5265ec/ffffff.png?text=${activeName.charAt(0).toUpperCase()}`,
    appointmentsCount: upcomingAppointments.length, // Native Array math
    prescriptionsCount: 0,
    labTestsCount: 0,
    upcoming: upcomingAppointments.map(app => ({
      doctor: `Dr. ${app.doctorId?.fullName || 'Unknown'}`,
      date: app.date,
      time: app.time,
      img: `https://placehold.co/100x100/fca5a5/ffffff.png?text=D`
    }))
  };

  return (
    <div className="min-h-screen bg-[#EEF2FA] p-4 md:p-8 flex items-center justify-center font-sans tracking-tight text-slate-800 relative">
      
      {/* 🚨 THE EMERGENCY NOTIFICATION BROADCAST BANNER 🚨 */}
      {emergencyAlert && (
         <div className="absolute top-0 left-0 w-full z-50 animate-fade-in">
            <div className="bg-red-500 text-white font-extrabold text-sm md:text-md py-4 shadow-xl flex items-center justify-center gap-3 w-full text-center px-4">
              <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg></span>
              CLINIC ALERT: A medical code emergency drastically shifted {emergencyAlert.doctor}'s active schedule. Your native booking has been automatically adjusted by explicitly {emergencyAlert.delay} mins to a new block mapping at {emergencyAlert.newTime}.
              <button onClick={() => setEmergencyAlert(null)} className="ml-4 hover:bg-black/20 px-3 py-1 rounded-full border border-white/40 shadow-sm transition-colors text-xs uppercase tracking-widest">Acknowledge</button>
            </div>
         </div>
      )}

      {showBooking && <BookAppointment onClose={() => { setShowBooking(false); pollAppointments(); }} />}

      {/* Main Orchestration Card */}
      <div className="w-full max-w-[1400px] h-[90vh] min-h-[800px] bg-white rounded-[2.5rem] shadow-2xl flex overflow-hidden relative border border-white/50">
        
        {/* Left Navigation Bar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Center UI Data View */}
        <MainPanel patientData={patientData} onBookClick={() => setShowBooking(true)} />
        
        {/* Right Info View */}
        <RightPanel patientData={patientData} />
        
      </div>

    </div>
  );
};

export default PatientDashboard;
