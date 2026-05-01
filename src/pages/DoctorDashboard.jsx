import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DoctorSidebar from '../components/doctor-dashboard/DoctorSidebar';
import StatCards from '../components/doctor-dashboard/StatCards';
import TodayAppointments from '../components/doctor-dashboard/TodayAppointments';
import CurrentPatient from '../components/doctor-dashboard/CurrentPatient';
import AppointmentRequests from '../components/doctor-dashboard/AppointmentRequests';
import DoctorProfile from '../components/doctor-dashboard/DoctorProfile';
import AvailabilityConfig from '../components/doctor-dashboard/AvailabilityConfig';
import EmergencyCase from '../components/doctor-dashboard/EmergencyCase';
import PatientHistoryView from '../components/doctor-dashboard/PatientHistoryView';
import AlertBell from '../components/doctor-dashboard/AlertBell';
import ManageBlogs from '../components/doctor-dashboard/ManageBlogs';
import { useSocket } from '../context/SocketContext';

// Helper mock seeder if localStorage is uniquely empty
const ensureMockData = () => {
    if (!localStorage.getItem('doc_appointments')) {
        const todayRaw = new Date();
        const today = `${String(todayRaw.getDate()).padStart(2, '0')}-${String(todayRaw.getMonth() + 1).padStart(2, '0')}-${todayRaw.getFullYear()}`;
        const mocks = [
            { id: '1', accountEmail: 'patient1@email.com', name: 'Alice Smith', age: 34, gender: 'Female', date: today, time: '09:00', status: 'approved' },
            { id: '2', accountEmail: 'patient2@email.com', name: 'Bob Jones', age: 45, gender: 'Male', date: today, time: '10:30', status: 'pending' },
            { id: '3', accountEmail: 'patient3@email.com', name: 'Charlie Day', age: 29, gender: 'Male', date: today, time: '11:00', status: 'approved' },
        ];
        localStorage.setItem('doc_appointments', JSON.stringify(mocks));
    }
};

const DoctorDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // Natively rip routing variables dynamically converting explicit hierarchy structures
    const pathParts = location.pathname.split('/').filter(Boolean);
    let activeTab = pathParts[2] || 'dashboard'; // /doctor/dashboard/appointments -> activeTab = 'appointments'
    // Safely mapping plural constraint fallbacks
    if (activeTab === 'appointment') activeTab = 'appointments';
    const setActiveTab = (tab) => navigate(`/doctor/dashboard/${tab}`);
    const socket = useSocket();

    const [appointments, setAppointments] = useState([]); // Today's dynamic appointments
    const [historyAppointments, setHistoryAppointments] = useState([]);
    const [historyPageInfo, setHistoryPageInfo] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });
    const [historySearch, setHistorySearch] = useState('');
    const [historyStatus, setHistoryStatus] = useState('');

    // Tracking Refs to prevent background sync from wiping out user filters
    const historyPageRef = useRef(1);
    const historySearchRef = useRef('');
    const historyStatusRef = useRef('');

    useEffect(() => {
        historyPageRef.current = historyPageInfo.currentPage;
    }, [historyPageInfo.currentPage]);

    useEffect(() => {
        historySearchRef.current = historySearch;
    }, [historySearch]);

    useEffect(() => {
        historyStatusRef.current = historyStatus;
    }, [historyStatus]);
    const [profile, setProfile] = useState({});
    const [showHistoryView, setShowHistoryView] = useState(false); // New Interactive Gateway
    const activeUserEmail = "doctor@clinic.com"; // Conceptually grabbed from auth state

    // Intercept pure Native Window Back Buttons actively stopping dashboard leaks completely
    useEffect(() => {
        // Only map the popstate strictly natively if the User is fundamentally at the Root Base layer physically!
        if (activeTab !== 'dashboard') return;

        const handlePopState = (e) => {
            e.preventDefault();
            const confirmLogout = window.confirm("You are explicitly leaving the secure Doctor Dashboard. You will be get logged out. Do you wish to proceed ?");
            if (confirmLogout) {
                sessionStorage.removeItem('user');
                sessionStorage.removeItem('token');
                window.location.href = '/'; // Shift architecture securely to landing page directly
            } else {
                window.history.pushState(null, "", window.location.pathname);
            }
        };
        // Lock the first frame implicitly preventing default pops
        window.history.pushState(null, "", window.location.pathname);
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [activeTab]);

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
        } catch{
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
                    patientId: app.patientId?._id || app.patientId,
                    name: app.patientName || app.patientId?.fullName || "Walk-In",
                    patientUid: app.patientId?.patientUid || "---",
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

    const loadDoctorHistory = async (page = 1, search = '', status = '') => {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                search: search,
                status: status
            });
            const res = await fetch(`http://localhost:5001/api/appointments/doctor/history?${queryParams}`, { credentials: 'include' });
            if (res.ok) {
                const result = await res.json();
                const mapped = result.data.map(app => ({
                    id: app._id,
                    patientId: app.patientId?._id || app.patientId,
                    name: app.patientName || app.patientId?.fullName || "Walk-In",
                    patientUid: app.patientId?.patientUid || "---",
                    age: app.patientId?.age || "--",
                    gender: app.patientId?.gender || "Unknown",
                    time: app.time,
                    date: app.date,
                    symptoms: app.symptoms,
                    status: app.status
                }));
                setHistoryAppointments(mapped);
                setHistoryPageInfo({
                    currentPage: result.currentPage,
                    totalPages: result.totalPages,
                    totalCount: result.totalCount
                });
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

        const handleUpdate = () => {
            loadDoctorAppointments();
            // Use refs to ensure we don't reset filters during background sync
            loadDoctorHistory(historyPageRef.current, historySearchRef.current, historyStatusRef.current);
        };
        window.addEventListener("appointmentsUpdated", handleUpdate);
        window.addEventListener("doctorProfileUpdated", loadDoctorProfile);
        
        if (socket) {
            socket.on('queueUpdated', handleUpdate);
        }

        const interval = setInterval(handleUpdate, 15000); 
        
        return () => {
            window.removeEventListener("appointmentsUpdated", handleUpdate);
            window.removeEventListener("doctorProfileUpdated", loadDoctorProfile);
            if (socket) socket.off('queueUpdated', handleUpdate);
            clearInterval(interval);
        };
    }, [socket]);

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
            loadDoctorHistory(historyPageInfo.currentPage, historySearch, historyStatus);
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
        window.dispatchEvent(new Event("emergencyStateToggled"));

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
            <div className="w-full max-w-[1500px] h-screen md:h-[90vh] md:min-h-[800px] bg-white/80 backdrop-blur-2xl md:rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.06)] flex overflow-hidden border-0 md:border border-white/60 transition-colors duration-300 z-10 relative">
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
                                            <div className="relative w-full shrink-0 min-h-[150px] rounded-3xl overflow-hidden mb-8 bg-linear-to-r from-blue-600 via-[#3963F9] to-blue-400 animate-gradient-xy flex items-center shadow-xl shadow-clinic-600/20">

                                                <div className="relative z-10 px-8 py-8 md:px-12 flex flex-col justify-center w-full ">
                                                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight drop-shadow-sm">Welcome , Dr. {profile?.firstName + ' ' + profile?.lastName || 'Doctor'}</h2>
                                                    <p className="text-blue-100 font-medium text-base md:text-lg drop-shadow-sm opacity-90">Have a nice and healthy day!</p>
                                                </div>

                                                {/* Soft Beautiful Geometric Overlay Accents Mapping the Background */}
                                                <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[20px] -mr-20 -mt-20 pointer-events-none"></div>
                                                <div className="absolute right-[15%] bottom-[-50%] w-[300px] h-[300px] bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                                            </div>

                                            <StatCards appointments={appointments} historicalTotal={historyAppointments.length}
                                                onCardClick={(id) => { if (id === 'total-patients') setShowHistoryView(true); }}
                                            />

                                            <div className="flex flex-col lg:flex-row gap-8 w-full mt-2 pb-10 ">
                                                <div className="flex-1 w-full ">
                                                    <CurrentPatient appointments={appointments} onStatusChange={handleStatusChange} onFinishConsultation={handleFinishConsultation} />
                                                </div>
                                                <div className="w-full lg:w-[400px] shrink-0">
                                                    <TodayAppointments appointments={appointments} />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {activeTab === 'appointments' && (
                                        <div className="w-full flex flex-col">
                                            <div className="flex justify-between items-center mb-8 w-full">
                                                <h1 className="text-4xl font-extrabold text-[#021024] transition-colors">All Queue Records</h1>
                                                <AlertBell appointments={historyAppointments} onStatusChange={handleStatusChange} />
                                            </div>
                                            <AppointmentRequests
                                                appointments={historyAppointments}
                                                onStatusChange={handleStatusChange}
                                                pageInfo={historyPageInfo}
                                                onFetchHistory={loadDoctorHistory}
                                                searchQuery={historySearch}
                                                setSearchQuery={setHistorySearch}
                                                statusFilter={historyStatus}
                                                setStatusFilter={setHistoryStatus}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>


                    </>
                )}

            </div>
        </div>
    );
};

export default DoctorDashboard;