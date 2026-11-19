import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/patient-dashboard/Sidebar';
import MainPanel from '../components/patient-dashboard/MainPanel';
import RightPanel from '../components/patient-dashboard/RightPanel';
import BookAppointment from '../components/patient-dashboard/BookAppointment';
import { MobileTopBar, MobileTabBar } from '../components/common/MobileNav';
import { ICONS, signOut } from '../utils/mobileNav';
import { initialsAvatar } from '../utils/avatar';
import { API_URL, clearAuthToken } from '../config/api';

const PatientDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Natively rip routing variables dynamically catching root paths explicitly
  const pathParts = location.pathname.split('/').filter(Boolean);
  const activeTab = pathParts[1] || 'home'; 
  const setActiveTab = (tab, search = "") => {
    React.startTransition(() => {
      navigate(`/patientdashboard/${tab}${search}`);
    });
  };
  const socket = useSocket();

  // Attempt to load real logged-in user profile, fallback to Guest
  const savedUser = JSON.parse(sessionStorage.getItem('user')) || {};
  const rawName = savedUser.fullName || "John Doe";
  const activeName = rawName.split(' ').map(w => w ? w.charAt(0).toUpperCase() + w.slice(1) : '').join(' ');

  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [vitals, setVitals] = useState([]); // Real-time Health Metrics
  const [emergencyAlert, setEmergencyAlert] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [userProfile, setUserProfile] = useState(savedUser);



  // Hook intercepting Native Browser Back Button forcing explicit logout validations
  useEffect(() => {
    if (activeTab !== 'home') return; // Trap locks solely effectively at absolute root

    const handlePopState = (e) => {
      e.preventDefault();
      const confirmLogout = window.confirm("You are leaving the secure Patient Dashboard. You will instantly be logged out. Proceed?");
      if (confirmLogout) {
         sessionStorage.removeItem('user');
         clearAuthToken();
         sessionStorage.removeItem('token');
         window.location.href = '/'; // Map entirely to Landing natively
      } else {
         window.history.pushState(null, "", window.location.pathname);
      }
    };
    
    // Anchor physical state securely preventing instant fallback drops
    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    
    return () => window.removeEventListener("popstate", handlePopState);
  }, [activeTab]);

  // Poll exactly specifically against live backend mappings targeting array mutations!
  const pollVitals = async () => {
     try {
       const res = await fetch(`${API_URL}/api/vitals/my`, { credentials: 'include' });
       if (res.ok) {
         const data = await res.json();
         setVitals(data);
       }
     } catch(e) { }
  };

  const pollAppointments = async () => {
     try {
       const res = await fetch(`${API_URL}/api/appointments/my`, { credentials: 'include' });
       if (res.ok) {
         const data = await res.json();
         setUpcomingAppointments(data);

         // Crucial Notification Logic Strategy evaluating math shifts!
         // Only warn about a delay that still matters: today's booking, still waiting to be seen,
         // shifted by a doctor's emergency and not yet dismissed. Old / finished visits never show it.
         const now = new Date();
         const todayStr = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
         const delayed = data.find(app =>
           Number(app.emergencyDelayedMinutes) > 0 &&
           app.date === todayStr &&
           ['pending', 'approved', 'emergency_active'].includes(app.status) &&
           !localStorage.getItem(`dismissed_alert_${app._id || app.id}`));
         if (delayed) {
           setEmergencyAlert({
              id: delayed._id || delayed.id,
              doctor: delayed.doctorId?.fullName,
              delay: delayed.emergencyDelayedMinutes,
              newTime: delayed.time
           });
         } else {
           setEmergencyAlert(null);
         }
       }
     } catch(e) { }

     try {
       console.log("[PatientDashboard] Fetching prescriptions...");
       const resRx = await fetch(`${API_URL}/api/prescriptions/my`, { credentials: 'include' });
       if (resRx.ok) {
         const rxData = await resRx.json();
         console.log("[PatientDashboard] Prescriptions received:", rxData);
         setPrescriptions(rxData);
       }
     } catch(e) { }

      try {
        const resProf = await fetch(`${API_URL}/api/auth/profile`, { credentials: 'include' });
        if (resProf.ok) {
          const pData = await resProf.json();
          setUserProfile(prev => ({ ...prev, ...pData }));
        }
      } catch(e) { }
      
      pollVitals();
  };

  useEffect(() => {
    pollAppointments();
    
    if (socket) {
      // Listen for global queue or prescription updates to refresh dashboard data
      socket.on('queueUpdated', pollAppointments);
    }

    const interval = setInterval(pollAppointments, 30000); // Polling legacy fallback (reduced frequency)
    return () => {
      clearInterval(interval);
      if (socket) {
        socket.off('queueUpdated', pollAppointments);
      }
    };
  }, [socket]);

  // Structural mock data blending with actual fetched lengths natively dynamically
  const upcomingFiltered = upcomingAppointments.filter(app => ['pending', 'approved', 'emergency_active'].includes(app.status));
  const historyFiltered = upcomingAppointments.filter(app => ['completed', 'rejected'].includes(app.status));

  const resolvedName = userProfile.fullName || activeName;

  const patientData = {
    ...userProfile,
    name: resolvedName,
    avatar: `https://placehold.co/150x150/5265ec/ffffff.png?text=${resolvedName.charAt(0).toUpperCase()}`,
    appointmentsCount: upcomingFiltered.length, 
    prescriptionsCount: prescriptions.length,
    prescriptions: prescriptions,
    vitals: vitals,
    upcoming: upcomingFiltered.map(app => ({
      doctorId: app.doctorId,
      doctor: `Dr. ${app.doctorId?.fullName || 'Unknown'}`,
      date: app.date,
      time: app.time,
      status: app.status,
      patientName: app.patientName,
      img: `https://placehold.co/100x100/fca5a5/ffffff.png?text=D`
    })),
    history: historyFiltered.map(app => ({
      doctor: `Dr. ${app.doctorId?.fullName || 'Unknown'}`,
      date: app.date,
      time: app.time,
      status: app.status,
      patientName: app.patientName,
      img: `https://placehold.co/100x100/fca5a5/ffffff.png?text=D`
    }))
  };

  return (
    <div className="min-h-[100dvh] bg-[#EEF2FA] dark:bg-[#020617] p-0 lg:p-8 flex items-center justify-center font-sans tracking-tight text-slate-800 dark:text-gray-100 transition-colors duration-300 relative">
      
      {/* 🚨 THE EMERGENCY NOTIFICATION BROADCAST BANNER 🚨 */}
      {emergencyAlert && (
         <div className="fixed inset-x-0 top-0 z-[60] flex justify-center px-3 pt-[calc(env(safe-area-inset-top)+8px)] pointer-events-none">
            <div className="pointer-events-auto w-full max-w-xl bg-red-500 text-white rounded-2xl shadow-lg flex items-start gap-3 p-3 lg:p-4">
              <span className="w-8 h-8 shrink-0 bg-white/20 rounded-full flex items-center justify-center"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg></span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">Appointment delayed</div>
                <div className="text-xs text-white/90 leading-snug mt-0.5">Dr. {emergencyAlert.doctor} is handling an emergency. Your visit has moved by {emergencyAlert.delay} min to {emergencyAlert.newTime}.</div>
              </div>
              <button onClick={() => {
                 upcomingAppointments.forEach(app => {
                     if (Number(app.emergencyDelayedMinutes) > 0) {
                         localStorage.setItem(`dismissed_alert_${app._id || app.id}`, 'true');
                     }
                 });
                 setEmergencyAlert(null);
              }} className="shrink-0 self-center bg-white text-red-600 font-bold text-xs px-3 py-1.5 rounded-lg">OK</button>
            </div>
         </div>
      )}

      {showBooking && <BookAppointment onClose={() => { setShowBooking(false); pollAppointments(); }} />}

      {/* Main Orchestration Card */}
      <div className="w-full max-w-[1400px] h-[100dvh] lg:h-[90vh] bg-white dark:bg-slate-900 lg:rounded-[2.5rem] lg:shadow-2xl flex flex-col lg:flex-row overflow-hidden relative lg:border border-white/50 dark:border-white/5 transition-colors duration-300">
        
        {/* Left Combined Panel (Profile + Nav) */}
        <div className="hidden lg:flex flex-col w-[270px] xl:w-[340px] h-full bg-[#fafcff] dark:bg-slate-900/40 shrink-0 relative">
          <RightPanel patientData={patientData} />
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {/* 💎 PREMIUM GRADIENT DIVIDER (Quantum Etched) 💎 */}
          <div className="absolute right-0 top-0 bottom-0 w-px bg-[#5265ec]/5"></div>
          <div className="absolute right-0 top-[15%] bottom-[15%] w-[1.5px] bg-linear-to-b from-transparent via-[#5265ec]/40 to-transparent blur-[0.4px]"></div>
          <div className="absolute -right-px top-[40%] bottom-[40%] w-[3px] bg-[#5265ec]/10 blur-xl rounded-full animate-pulse"></div>
          <div className="absolute right-0 top-[45%] bottom-[45%] w-[2px] bg-[#5265ec] rounded-full shadow-[0_0_15px_rgba(82,101,236,0.6)]"></div>
        </div>
        
        {/* Phone / tablet app bar */}
        <MobileTopBar
          title={{ home: 'Home', queue: 'Live Queue', calendar: 'My Visits', docs: 'Prescriptions', profile: 'My Profile', settings: 'Settings' }[activeTab] || 'MedisTech'}
          subtitle={resolvedName}
          avatar={initialsAvatar(resolvedName || 'P', 72)}
          actions={[
            { label: 'Settings', icon: ICONS.settings, onClick: () => setActiveTab('settings') },
            { label: 'Sign out', icon: ICONS.logout, danger: true, onClick: () => signOut(navigate) },
          ]}
        />

        {/* Render Center UI Data View, filling rest of space */}
        <div className="app-compact flex-1 min-h-0 min-w-0 flex">
        <MainPanel 
          patientData={patientData} 
          activeTab={activeTab} 
          onVitalsUpdate={pollVitals}
          onTabChange={setActiveTab}
          onBookClick={() => {
            setActiveTab('calendar');
            setShowBooking(true);
          }} 
        />
        </div>

        <MobileTabBar
          active={activeTab}
          onSelect={(t) => setActiveTab(t)}
          items={[
            { id: 'home', label: 'Home', icon: ICONS.home },
            { id: 'queue', label: 'Queue', icon: ICONS.queue },
            { id: 'calendar', label: 'Visits', icon: ICONS.calendar },
            { id: 'docs', label: 'Records', icon: ICONS.rx },
            { id: 'profile', label: 'Profile', icon: ICONS.user },
          ]}
        />
        
      </div>

    </div>
  );
};

export default PatientDashboard;
