import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DoctorSidebar from '../components/doctor-dashboard/DoctorSidebar';
import StatCards from '../components/doctor-dashboard/StatCards';
import TodayAppointments from '../components/doctor-dashboard/TodayAppointments';
import UpcomingPatient from '../components/doctor-dashboard/UpcomingPatient';
import CurrentPatient from '../components/doctor-dashboard/CurrentPatient';
import DoctorProfile from '../components/doctor-dashboard/DoctorProfile';
import AvailabilityConfig from '../components/doctor-dashboard/AvailabilityConfig';
import EmergencyCase from '../components/doctor-dashboard/EmergencyCase';
import PatientHistoryView from '../components/doctor-dashboard/PatientHistoryView';
import AlertBell from '../components/doctor-dashboard/AlertBell';
import ManageBlogs from '../components/doctor-dashboard/ManageBlogs';

const ensureMockData = () => {
  if (!localStorage.getItem('doc_appointments')) {
    const todayRaw = new Date();
    const today = `${String(todayRaw.getDate()).padStart(2, '0')}-${String(todayRaw.getMonth() + 1).padStart(2, '0')}-${todayRaw.getFullYear()}`;
    const mocks = [
      { id: '1', accountEmail: 'patient1@email.com', name: 'Alice Smith', age: 34, gender: 'Female', date: today, time: '09:00', status: 'approved' },
      { id: '2', accountEmail: 'patient2@email.com', name: 'Bob Jones', age: 45, gender: 'Male', date: today, time: '10:30', status: 'pending' },
      { id: '3', accountEmail: 'patient3@email.com', name: 'Charlie Day', age: 29, gender: 'Male', date: today, time: '11:00', status: 'approved' }
    ];
    localStorage.setItem('doc_appointments', JSON.stringify(mocks));
  }
};

const DoctorDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathParts = location.pathname.split('/').filter(Boolean);
  let activeTab = pathParts[1] || 'dashboard';
  if (activeTab === 'appointment') activeTab = 'appointments';
  const setActiveTab = (tab) => navigate(`/doctordashboard/${tab}`);

  const [appointments, setAppointments] = useState([]);
  const [historyAppointments, setHistoryAppointments] = useState([]);
  const [profile, setProfile] = useState({});
  const [showHistoryView, setShowHistoryView] = useState(false);
  const activeUserEmail = "doctor@clinic.com";

  useEffect(() => {
    if (activeTab !== 'dashboard') return;
    const handlePopState = (e) => {
      e.preventDefault();
      if (window.confirm("You are explicitly leaving the secure Doctor Dashboard. You will be get logged out. Do you wish to proceed ?")) {
        sessionStorage.clear();
        window.location.href = '/';
      } else {
        window.history.pushState(null, "", window.location.pathname);
      }
    };
    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [activeTab]);

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
    } catch (err) { console.error(err); }
  };

  const loadDoctorAppointments = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/appointments/doctor', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.map(app => ({
          id: app._id,
          patientId: app.patientId?._id || app.patientId,
          name: app.patientId?.fullName || "Walk-In",
          age: app.patientId?.age || "--",
          gender: app.patientId?.gender || "Unknown",
          time: app.time,
          date: app.date,
          symptoms: app.symptoms,
          status: app.status
        })));
      }
    } catch (err) { console.error(err); }
  };

  const loadDoctorHistory = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/appointments/doctor/history', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setHistoryAppointments(data.map(app => ({
          id: app._id,
          patientId: app.patientId?._id || app.patientId,
          name: app.patientId?.fullName || "Walk-In",
          age: app.patientId?.age || "--",
          gender: app.patientId?.gender || "Unknown",
          time: app.time,
          date: app.date,
          symptoms: app.symptoms,
          status: app.status
        })));
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    ensureMockData(); loadDoctorAppointments(); loadDoctorHistory(); loadDoctorProfile();
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

  const handleStatusChange = async (id, newStatus) => {
    try {
      await fetch(`http://localhost:5001/api/appointments/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });
      loadDoctorAppointments();
    } catch (err) { console.error(err); }
  };

  const handleFinishConsultation = async (id, patientId, prescriptionData) => {
    try {
      const formattedMedicines = (prescriptionData.medicines || []).map(med => ({
        name: med.name, dosage: med.dosage,
        frequency: `${(med.timing || []).join(' - ')} (${med.food || 'After Food'})`,
        duration: med.duration || "As Directed"
      }));
      await fetch('http://localhost:5001/api/prescriptions/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          appointmentId: id, patientId: patientId || "60b8c8d8f1e6b3b3a4a9c123",
          diagnosis: "General evaluation completed.", medicines: formattedMedicines,
          pdfBase64: prescriptionData.pdfBase64,
          clinicalNotes: "Issued securely via Advanced Prescription Builder natively."
        })
      });
      loadDoctorAppointments();
    } catch (err) { console.error(err); }
  };

  const handleDeclareEmergency = async (data) => {
    localStorage.setItem('emergency_start_time', Date.now());
    window.dispatchEvent(new Event("emergencyStateToggled"));
    try {
      await fetch('http://localhost:5001/api/appointments/book', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({
          patientIdOverride: "60b8c8d8f1e6b3b3a4a9c123",
          date: `${String(new Date().getDate()).padStart(2, '0')}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${new Date().getFullYear()}`,
          symptoms: `[EMERGENCY] ${data.reason}`, status: "emergency_active"
        })
      });
      loadDoctorAppointments();
    } catch (err) { }
  };

<<<<<<< HEAD
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
        if (!patientId) {
            alert("Cannot issue prescription: This patient is not registered in the system. Please register them or link to an existing account first.");
            return;
        }
        try {
            const formattedMedicines = (prescriptionData.medicines || []).map(med => ({
                name: med.name,
                dosage: med.dosage,
                frequency: `${(med.timing || []).join(' - ')} (${med.food || 'After Food'})`,
                duration: med.duration || "As Directed"
            }));

            await fetch('http://localhost:5001/api/prescriptions/issue', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    appointmentId: id,
                    patientId: patientId, // Removed hardcoded fallback
                    diagnosis: "General evaluation completed.",
                    medicines: formattedMedicines,
                    pdfBase64: prescriptionData.pdfBase64,
                    clinicalNotes: "Issued securely via Advanced Prescription Builder natively."
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
=======
  const handleResolveEmergency = async () => {
    const startTimeStr = localStorage.getItem('emergency_start_time');
    localStorage.removeItem('emergency_start_time');
    if (startTimeStr) {
      const elapsedMinutes = Math.floor((Date.now() - parseInt(startTimeStr, 10)) / 60000);
      try {
        await fetch('http://localhost:5001/api/appointments/emergency-resolve', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
          body: JSON.stringify({ elapsedMinutes, date: `${String(new Date().getDate()).padStart(2, '0')}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${new Date().getFullYear()}` })
        });
>>>>>>> Nitish
        window.dispatchEvent(new Event("emergencyStateToggled"));
        loadDoctorAppointments();
      } catch (err) { }
    }
  };

<<<<<<< HEAD
        try {
            // Create Database mapping
            await fetch('http://localhost:5001/api/appointments/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    // Backend middleware dynamically injects doctorId natively if caller is Doctor
                    patientIdOverride: null, // Removed hardcoded fallback for unregistered emergencies
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
            const elapsedMinutes = Math.floor((Date.now() - startTime) / 60000); const today = new Date();
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
        <div className="min-h-screen w-full bg-slate-50/50 p-0 md:p-8 flex items-center justify-center font-sans tracking-tight text-slate-800 transition-colors duration-300 relative overflow-hidden selection:bg-blue-200">
            {/* Top Gradient Overlay */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-linear-to-b from-blue-50 via-cyan-50/30 to-transparent pointer-events-none z-0"></div>
            {/* Background radial gradients for reference-like soft colorful glow */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-linear-to-br from-yellow-50 via-purple-50/30 to-transparent rounded-full blur-[100px] pointer-events-none z-0"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-linear-to-tl from-cyan-100/40 via-blue-100/20 to-transparent rounded-full blur-[100px] pointer-events-none z-0"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-linear-to-tr from-purple-100/20 via-pink-50/20 to-transparent rounded-full blur-[120px] pointer-events-none z-0"></div>

            {/* Master Flex Canvas matching exactly the Patient perspective UI bounds */}
            <div className="w-full max-w-[1500px] h-[100vh] md:h-[90vh] md:min-h-[800px] bg-white/80 backdrop-blur-2xl md:rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.06)] flex overflow-hidden border-0 md:border border-white/60 transition-colors duration-300 z-10 relative">
                {/* Left Explicit Profile & Navigation Tab Controller */}
                <DoctorSidebar activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); setShowHistoryView(false); }} profile={profile} />

                {/* Dynamic Center Orchestrator */}
                {activeTab === 'profile' && <DoctorProfile email={activeUserEmail} />}
                {activeTab === 'availability' && <AvailabilityConfig />}
                {activeTab === 'blogs' && <ManageBlogs />}
                {activeTab === 'emergency' && (
                    <EmergencyCase onDeclareEmergency={handleDeclareEmergency} onResolveEmergency={handleResolveEmergency} />
                )}

                {(activeTab === 'dashboard' || activeTab === 'appointments') && (
                    <>
                        <div className="flex-1 h-full py-8 md:py-12 px-6 md:px-12 flex flex-col overflow-y-auto no-scrollbar bg-transparent transition-colors">
                            {showHistoryView ? (
                                <PatientHistoryView historyData={historyAppointments} onBack={() => setShowHistoryView(false)} />
                            ) : (
                                <>
                                    {activeTab === 'dashboard' && (
                                        <>
                                            <div className="flex justify-between items-center mb-8 w-full">
                                                <h1 className="text-4xl font-extrabold text-[#021024] transition-colors">Doctor Dashboard</h1>
                                                <AlertBell appointments={historyAppointments} onStatusChange={handleStatusChange} />
                                            </div>

                                            {/* Smooth Infinite Animated Welcome Banner */}
                                            <div className="relative w-full shrink-0 min-h-[150px] rounded-3xl overflow-hidden mb-8 bg-gradient-to-r from-blue-600 via-[#3963F9] to-blue-400 animate-gradient-xy flex items-center shadow-xl shadow-clinic-600/20">

                                                <div className="relative z-10 px-8 py-8 md:px-12 flex flex-col justify-center w-full ">
                                                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight drop-shadow-sm">Welcome , Dr. {profile?.firstName + ' ' + profile?.lastName || 'Doctor'}</h2>
                                                    <p className="text-blue-100 font-medium text-base md:text-lg drop-shadow-sm opacity-90">Have a nice and healthy day!</p>
                                                </div>

                                                {/* Soft Beautiful Geometric Overlay Accents Mapping the Background */}
                                                <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[20px] -mr-20 -mt-20 pointer-events-none"></div>
                                                <div className="absolute right-[15%] bottom-[-50%] w-[300px] h-[300px] bg-white/10 rounded-full blur-[40px] pointer-events-none"></div>
                                            </div>

                                            <StatCards appointments={appointments} historicalTotal={historyAppointments.length}
                                                onCardClick={(id) => { if (id === 'total-patients') setShowHistoryView(true); }}
                                            />

                                            <div className="flex flex-col lg:flex-row gap-8 w-full mt-2 pb-10 ">
                                                <div className="flex-1 w-full ">
                                                    <CurrentPatient appointments={appointments} onStatusChange={handleStatusChange} onFinishConsultation={handleFinishConsultation} />
                                                </div>
                                                <div className="w-full lg:w-[400px] flex-shrink-0">
                                                    <TodayAppointments appointments={appointments} />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {activeTab === 'appointments' && (
                                        <div className="flex justify-between items-center mb-8 w-full">
                                            <h1 className="text-4xl font-extrabold text-[#021024] transition-colors">All Queue Records</h1>
                                            <AlertBell appointments={historyAppointments} onStatusChange={handleStatusChange} />
                                        </div>
                                    )}
                                    {/* <AppointmentRequests appointments={appointments} onStatusChange={handleStatusChange} /> */}
                                </>
                            )}
                        </div>


                    </>
                )}

            </div>
=======
  const renderPatientCard = (patient) => (
    <div className="bg-slate-50/80 rounded-3xl p-6 border border-slate-100 flex flex-col items-center text-center relative overflow-hidden transition-all duration-300 w-full hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 group">
      <div className="w-16 h-16 rounded-full bg-linear-to-tr from-clinic-600 to-blue-400 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg mb-3 ring-4 ring-blue-50">
        {(patient.name || "P")[0].toUpperCase()}
      </div>
      <h2 className="text-xl font-black text-slate-800 mb-1">{patient.name}</h2>
      <div className="text-[10px] font-black text-clinic-600 bg-blue-50 px-3 py-1 rounded-full tracking-widest uppercase mb-4">
        {patient.age || "--"} yrs • {patient.gender || "Unknown"}
      </div>
      <div className="w-full bg-white/80 rounded-2xl p-4 flex justify-between items-center text-left border border-slate-50 group-hover:border-blue-100 transition-colors">
        <div>
          <div className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-0.5">Scheduled</div>
          <div className="font-extrabold text-slate-700 text-lg">{patient.time}</div>
>>>>>>> Nitish
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-clinic-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-slate-50/50 p-0 md:p-8 flex items-center justify-center font-sans tracking-tight text-slate-800 transition-colors duration-300 relative overflow-hidden selection:bg-blue-200">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-linear-to-b from-blue-50 via-cyan-50/30 to-transparent pointer-events-none z-0"></div>
      <div className="w-full max-w-[1500px] h-[100vh] md:h-[90vh] md:min-h-[800px] bg-white/80 backdrop-blur-2xl md:rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.06)] flex overflow-hidden border-white/60 z-10 relative">
        <DoctorSidebar activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); setShowHistoryView(false); }} profile={profile} />

        {(activeTab === 'dashboard' || activeTab === 'appointments') && (
          <div className="flex-1 h-full pt-4 md:pt-6 pb-8 md:pb-12 px-6 md:px-12 flex flex-col overflow-hidden bg-transparent">
            {showHistoryView ? (
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <PatientHistoryView historyData={historyAppointments} onBack={() => setShowHistoryView(false)} />
              </div>
            ) : (
              <>
                {activeTab === 'dashboard' && (
                  <div className="flex flex-col h-full overflow-hidden">
                    <div className="flex justify-between items-center mb-4 w-full shrink-0">
                      <h1 className="text-3xl font-black text-slate-800 tracking-tighter">Dashboard</h1>
                      <AlertBell appointments={historyAppointments} onStatusChange={handleStatusChange} />
                    </div>
                    <div className="relative w-full min-h-[110px] rounded-[2rem] overflow-hidden mb-4 bg-linear-to-r from-clinic-600 to-blue-400 flex items-center shadow-xl shadow-clinic-600/20 px-10 shrink-0">
                      <div className="relative z-10 flex flex-col">
                        <h2 className="text-3xl font-black text-white mb-1">Welcome , Dr. {profile?.firstName ? `${profile.firstName} ${profile.lastName || ''}` : 'Doctor'}</h2>
                        <p className="text-blue-50 font-medium opacity-90">Have a nice and healthy day!</p>
                      </div>
                    </div>
                    <div className="shrink-0 mb-4">
                        <StatCards appointments={appointments} historicalTotal={historyAppointments.length} onCardClick={(id) => { if (id === 'total-patients') setShowHistoryView(true); }} />
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 w-full flex-1 min-h-0 pb-10">
                      <UpcomingPatient appointments={appointments} onStatusChange={handleStatusChange} renderPatientCard={renderPatientCard} />
                      <CurrentPatient appointments={appointments} onStatusChange={handleStatusChange} onFinishConsultation={handleFinishConsultation} renderPatientCard={renderPatientCard} />
                      <TodayAppointments appointments={appointments} />
                    </div>
                  </div>
                )}
                {activeTab === 'appointments' && (
                  <div className="flex justify-between items-center mb-8 w-full">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tighter">All Queue Records</h1>
                    <AlertBell appointments={historyAppointments} onStatusChange={handleStatusChange} />
                  </div>
                )}
              </>
            )}
          </div>
        )}
        {activeTab === 'profile' && <DoctorProfile email={activeUserEmail} />}
        {activeTab === 'availability' && <AvailabilityConfig />}
        {activeTab === 'blogs' && <ManageBlogs />}
        {activeTab === 'emergency' && <EmergencyCase onDeclareEmergency={handleDeclareEmergency} onResolveEmergency={handleResolveEmergency} />}
      </div>
    </div>
  );
};

export default DoctorDashboard;
