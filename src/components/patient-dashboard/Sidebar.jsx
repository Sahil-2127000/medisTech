import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/');
  };

  const menuItems = [
    { id: 'home', label: 'Dashboard Overview', icon: <path d="M12 3l10 9h-3v9h-14v-9h-3l10-9zm0 2.8l-5 4.5v6.7h10v-6.7l-5-4.5z" /> },
    { id: 'calendar', label: 'My Appointments', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />, stroke: true },
    { id: 'docs', label: 'Medical Documents', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />, stroke: true },
    { id: 'profile', label: 'Patient Profile', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />, stroke: true },
    { id: 'settings', label: 'Account Settings', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />, stroke: true },
  ];

  return (
    <div className="w-full h-full flex flex-col px-6 pb-8">
      <div className="flex-1 flex flex-col gap-1.5 mt-4">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full py-3 px-4 rounded-xl flex items-center gap-3 transition-all group ${activeTab === item.id ? 'bg-[#5265ec] text-white shadow-md shadow-[#5265ec]/30' : 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-slate-800'}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${activeTab === item.id ? 'bg-white/20' : 'bg-white shadow-sm text-gray-400 group-hover:text-[#5265ec]'}`}>
              {item.stroke ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{item.icon}</svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
              )}
            </div>
            <span className="font-semibold text-[13px] whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Logout Indicator */}
      <button
        onClick={handleLogout}
        className="w-full py-3 px-4 rounded-xl flex items-center gap-3 transition-all text-red-400 hover:bg-red-50 hover:text-red-600 mt-auto group shrink-0"
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white shadow-sm text-red-300 group-hover:text-red-500 transition-colors">
          <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </div>
        <span className="font-semibold text-[13px] whitespace-nowrap">Sign Out Securely</span>
      </button>

    </div>
  );
};

export default Sidebar;
