import React from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorSidebar = ({ activeTab, setActiveTab, profile }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/');
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l10 9h-3v9h-14v-9h-3l10-9zm0 2.8l-5 4.5v6.7h10v-6.7l-5-4.5z" /> },
        { id: 'appointments', label: 'Appointments', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> },

        { id: 'availability', label: 'Availability', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
        { id: 'blogs', label: 'Manage Blogs', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /> },
        { id: 'emergency', label: 'Emergency Override', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /> },
        { id: 'profile', label: 'Doctor Profile', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> }
    ];

    return (
        <div className="w-[280px] h-full hidden lg:flex flex-col bg-white/50 backdrop-blur-xl border-r border-slate-100 p-6 shadow-[10px_0_30px_rgba(0,0,0,0.01)] z-10 transition-colors duration-300">
            {/* Doctor Profile Section at Top */}
            <div className="flex flex-col items-center mt-4 mb-10 pb-8 border-b border-gray-100 transition-colors">
                <div className="relative w-24 h-24 mb-4">
                    <div className="absolute inset-0 border-[2px] border-clinic-600 rounded-full scale-110 border-dashed animate-spin-slow"></div>
                    <img src={profile?.photo || `https://placehold.co/150x150/5483B3/ffffff.png?text=${encodeURIComponent((profile?.firstName || 'Dr')[0])}`} alt="Doctor Avatar" className="w-full h-full rounded-full object-cover shadow-sm relative z-10" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 text-center transition-colors">Dr. {profile?.firstName || 'Name'} {profile?.lastName || ''}</h2>
                <span className="text-clinic-600 text-sm font-semibold mt-1 bg-clinic-200/30 px-3 py-1 rounded-full">{profile?.specialization || 'Specialization'}</span>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 space-y-2">
                {navItems.map(item => (
                    <button key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-semibold ${activeTab === item.id ? (item.id === 'emergency' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-clinic-600 text-white shadow-lg shadow-blue-500/30') : (item.id === 'emergency' ? 'text-red-500 hover:bg-red-50 ' : 'text-gray-500 hover:bg-slate-50/80 hover:text-clinic-600 ')
                            }`}
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill={activeTab === item.id ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{item.icon}</svg>
                        {item.label}
                    </button>
                ))}
            </div>


            {/* Logout Button */}
            <button onClick={handleLogout}
                className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-500 font-semibold hover:bg-red-50 transition-colors"
            >
                <svg className="w-5 h-5 rotate-180 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Log Out
            </button>

        </div>
    );
};

export default DoctorSidebar;
