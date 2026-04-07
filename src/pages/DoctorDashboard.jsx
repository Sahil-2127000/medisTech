import React, { useState, useEffect } from 'react';
import DoctorSidebar from '../components/doctor-dashboard/DoctorSidebar';
import StatCards from '../components/doctor-dashboard/StatCards';
import TodayAppointments from '../components/doctor-dashboard/TodayAppointments';
import CurrentPatient from '../components/doctor-dashboard/CurrentPatient';
// import AppointmentRequests from '../components/doctor-dashboard/AppointmentRequests';
import DoctorProfile from '../components/doctor-dashboard/DoctorProfile';
import AvailabilityConfig from '../components/doctor-dashboard/AvailabilityConfig';
import EmergencyCase from '../components/doctor-dashboard/EmergencyCase';
import PatientHistoryView from '../components/doctor-dashboard/PatientHistoryView';
import AlertBell from '../components/doctor-dashboard/AlertBell';
import ThemeToggle from '../components/common/ThemeToggle';

// Helper mock seeder if localStorage is uniquely empty
const ensureMockData = () => {
  if (!localStorage.getItem('doc_appointments')) {
    const todayRaw = new Date();
    const today = `${String(todayRaw.getDate()).padStart(2, '0')}-${String(todayRaw.getMonth() + 1).padStart(2, '0')}-${todayRaw.getFullYear()}`;
    
    const mocks = [
      { id: '1', accountEmail: 'patient1@email.com', name: 'Alice Smith', age: 34, gender: 'Female', date: today, time: '09:00', status: 'approved' },
      { id: '2', accountEmail: 'patient2@email.com', name: 'Bob Jones', age: 45, gender: 'Male', date: today, time: '10:30', status: 'pending' },
      { id: '3', accountEmail: 'patient3@email.com', name: 'Charlie Day', age: 29, gender: 'Male', date: today, time: '11:00', status: 'approved' },
      { id: '4', accountEmail: 'patient4@email.com', name: 'Diana Prince', age: 38, gender: 'Female', date: '01-12-2027', time: '14:00', status: 'completed' },
      { id: '5', accountEmail: 'patient5@email.com', name: 'Evan Vance', age: 50, gender: 'Male', date: '05-01-2028', time: '08:30', status: 'rejected' }
    ];
    localStorage.setItem('doc_appointments', JSON.stringify(mocks));
  }
};

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appointments, setAppointments] = useState([]); // Today's dynamic appointments
  const [historyAppointments, setHistoryAppointments] = useState([]); // Master absolute total records
  const [profile, setProfile] = useState({});
  const [showHistoryView, setShowHistoryView] = useState(false); // New Interactive Gateway
  const activeUserEmail = "doctor@clinic.com"; // Conceptually grabbed from auth state

  // Generic backend routing natively syncing sidebar identity
  const loadDoctorProfile = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/auth/profile', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setProfile({
          firstName: data.fullName?.split(' ')[0] || '',
          lastName: data.fullName?.split(' ').slice(1).join(' ') || '',
          specialization: data.specialization || '',
          photo: data.photo || ''
        });
      }
    } catch (err) {
      console.error("Binding profile structure natively failed.");
    }
  };

  // Generic backend routing network polling
  const loadDoctorAppointments = async () => {
     try {
       const res = await fetch('http://localhost:5001/api/appointments/doctor', { credentials: 'include' });
       if (res.ok) {
         const data = await res.json();
         // Data formatting mapping DB standard precisely
         const mapped = data.map(app => ({
           id: app._id,
           name: app.patientId?.fullName || "Walk-In",
           age: app.patientId?.age || "--",
           gender: app.patientId?.gender || "Unknown",
           time: app.time,
           date: app.date,
           symptoms: app.symptoms,
           status: app.status
         }));
         setAppointments(mapped);
       }
     } catch (err) {
       console.error("Binding failure natively", err);
     }
  };

  const loadDoctorHistory = async () => {
     try {
       const res = await fetch('http://localhost:5001/api/appointments/doctor/history', { credentials: 'include' });
       if (res.ok) {
         const data = await res.json();
         const mapped = data.map(app => ({
           id: app._id,
           name: app.patientId?.fullName || "Walk-In",
           age: app.patientId?.age || "--",
           gender: app.patientId?.gender || "Unknown",
           time: app.time,
           date: app.date,
           symptoms: app.symptoms,
           status: app.status
         }));
         setHistoryAppointments(mapped);
       }
     } catch (err) {
       console.error(err);
     }
  };

  useEffect(() => {
    ensureMockData();
    
    loadDoctorAppointments();
    loadDoctorHistory();
    loadDoctorProfile();

    const handleUpdate = () => { loadDoctorAppointments(); loadDoctorHistory(); };
    window.addEventListener("appointmentsUpdated", handleUpdate);
    window.addEventListener("doctorProfileUpdated", loadDoctorProfile);
    
    const interval = setInterval(handleUpdate, 15000); 
    
    return () => {
      window.removeEventListener("appointmentsUpdated", handleUpdate);
      window.removeEventListener("doctorProfileUpdated", loadDoctorProfile);
      clearInterval(interval);
    };
  }, []);

  // Action Mutators strictly utilizing the explicit Dispatch payload flow
  const handleStatusChange = async (id, newStatus) => {
    try {
      await fetch(`http://localhost:5001/api/appointments/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });
      loadDoctorAppointments();
    } catch (error) {
       console.error("Status migration failed", error);
    }
  };

  const handleFinishConsultation = async (id, patientId, prescriptionData) => {
    try {
      await fetch('http://localhost:5001/api/prescriptions/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          appointmentId: id,
          patientId: patientId || "60b8c8d8f1e6b3b3a4a9c123", // fallback
          diagnosis: "General evaluation completed.",
          medicines: [
             { name: prescriptionData.medicine, dosage: "Standard", frequency: prescriptionData.timing, duration: "As Directed" }
          ],
          clinicalNotes: "Resolved efficiently via emergency protocol natively."
        })
      });
      loadDoctorAppointments();
    } catch (err) {
      console.error("Failed to generate robust prescription", err);
    }
  };

  // ==========================================
  // EMERGENCY OVERRIDE AUTOMATED ENGINE
  // ==========================================
  const handleDeclareEmergency = async (patientData) => {
    const timestamp = Date.now();
    localStorage.setItem('emergency_start_time', timestamp);
    
    // Broadcast state universally locally for blazing fast UI bounce
    window.dispatchEvent(new Event("emergencyStateToggled"));

    try {
      // Create Database mapping
      await fetch('http://localhost:5001/api/appointments/book', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         credentials: 'include',
         body: JSON.stringify({
            // Backend middleware dynamically injects doctorId natively if caller is Doctor
            patientIdOverride: "60b8c8d8f1e6b3b3a4a9c123", // mock            originalTime: "09:00",
            date: `${String(new Date().getDate()).padStart(2, '0')}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${new Date().getFullYear()}`,
            symptoms: `[EMERGENCY] ${patientData.reason}`,
            status: "emergency_active"
         })
      });
      loadDoctorAppointments();
    } catch (err) { }
  };

  const handleResolveEmergency = async () => {
    const startTimeStr = localStorage.getItem('emergency_start_time');
    localStorage.removeItem('emergency_start_time');
    
    if (startTimeStr) {
      const startTime = parseInt(startTimeStr, 10);
      const elapsedMinutes = Math.floor((Date.now() - startTime) / 60000); 
      const today = new Date();
      const todayDateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
      
      try {
         // Push massive algorithm calculation down directly into MongoDB layer securely natively!
         await fetch('http://localhost:5001/api/appointments/emergency-resolve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ elapsedMinutes, date: todayDateStr })
         });
         
         window.dispatchEvent(new Event("emergencyStateToggled"));
         loadDoctorAppointments();
      } catch (err) {
         console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#EEF2FA] dark:bg-slate-900 p-0 md:p-8 flex items-center justify-center font-sans tracking-tight text-slate-800 dark:text-gray-100 transition-colors duration-300 overflow-hidden">
      
      {/* Master Flex Canvas matching exactly the Patient perspective UI bounds */}
      <div className="w-full max-w-[1500px] h-[100vh] md:h-[90vh] md:min-h-[800px] bg-white dark:bg-slate-900 md:rounded-[2.5rem] shadow-2xl flex overflow-hidden relative border-0 md:border border-white/50 dark:border-slate-800 transition-colors duration-300">
        
        {/* Left Explicit Profile & Navigation Tab Controller */}
        <DoctorSidebar 
           activeTab={activeTab} 
           setActiveTab={(t) => { setActiveTab(t); setShowHistoryView(false); }} 
           profile={profile} 
        />

          {/* Dynamic Center Orchestrator */}
        {activeTab === 'profile' && <DoctorProfile email={activeUserEmail} />}
        
        {activeTab === 'availability' && <AvailabilityConfig />}
        
        {activeTab === 'emergency' && (
           <EmergencyCase 
              onDeclareEmergency={handleDeclareEmergency} 
              onResolveEmergency={handleResolveEmergency} 
           />
        )}

        {(activeTab === 'dashboard' || activeTab === 'appointments') && (
           <>
              <div className="flex-1 h-full py-8 md:py-12 px-6 md:px-12 flex flex-col overflow-y-auto no-scrollbar bg-[#fafcff]/40 dark:bg-slate-800/40 transition-colors">
                
                {showHistoryView ? (
                   <PatientHistoryView 
                      historyData={historyAppointments} 
                      onBack={() => setShowHistoryView(false)} 
                   />
                ) : (
                  <>
                    {activeTab === 'dashboard' && (
                      <>
                        <div className="flex justify-between items-center mb-8 w-full">
                          <h1 className="text-4xl font-extrabold text-[#021024] dark:text-white transition-colors">Doctor Dashboard</h1>
                          <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <AlertBell appointments={historyAppointments} onStatusChange={handleStatusChange} />
                          </div>
                        </div>
                        <StatCards 
                          appointments={appointments} 
                          historicalTotal={historyAppointments.length}
                          onCardClick={(id) => { if (id === 'total-patients') setShowHistoryView(true); }}
                        />
                        <TodayAppointments appointments={appointments} />
                      </>
                    )}
                    {activeTab === 'appointments' && (
                      <div className="flex justify-between items-center mb-8 w-full">
                        <h1 className="text-4xl font-extrabold text-[#021024] dark:text-white transition-colors">All Queue Records</h1>
                        <div className="flex items-center gap-4">
                          <ThemeToggle />
                          <AlertBell appointments={historyAppointments} onStatusChange={handleStatusChange} />
                        </div>
                      </div>
                    )}
                    {/* <AppointmentRequests appointments={appointments} onStatusChange={handleStatusChange} /> */}
                  </>
                )}
                
              </div>

              {/* Seamless Right Edge Action Context Sidebar */}
              {activeTab === 'dashboard' && (
                 <CurrentPatient appointments={appointments} onFinishConsultation={handleFinishConsultation} onStatusChange={handleStatusChange} />
              )}
           </>
        )}

      </div>
    </div>
  );
};

export default DoctorDashboard;
