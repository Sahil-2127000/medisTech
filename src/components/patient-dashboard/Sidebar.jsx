import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/');
  };

  const menuItems = [
    { id: 'home', label: 'Dashboard Overview', icon: <path d="M12 3l10 9h-3v9h-14v-9h-3l10-9zm0 2.8l-5 4.5v6.7h10v-6.7l-5-4.5z" /> },
    { id: 'queue', label: 'Live Queue Tracker', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />, stroke: true },
    { id: 'calendar', label: 'My Appointments', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />, stroke: true },
    { id: 'docs', label: 'My Prescriptions', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />, stroke: true },
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
            className={`w-full py-3 px-4 rounded-xl flex items-center gap-3 transition-all group ${activeTab === item.id ? 'bg-[#3963F9] text-white shadow-lg shadow-[#3963F9]/30' : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white'}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${activeTab === item.id ? 'bg-white/20' : 'bg-white dark:bg-slate-800 shadow-sm text-gray-400 dark:text-slate-500 group-hover:text-[#3963F9]'}`}>
              {item.stroke ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{item.icon}</svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
              )}
            </div>
            <span className="font-bold text-[13px] whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Logout Indicator */}
      <button
        onClick={() => setShowLogoutModal(true)}
        className="w-full py-3 px-4 rounded-xl flex items-center gap-3 transition-all text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 mt-auto group shrink-0"
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm text-red-300 group-hover:text-red-500 transition-colors">
          <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </div>
        <span className="font-bold text-[13px] whitespace-nowrap">Sign Out Securely</span>
      </button>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-white dark:border-white/10 rounded-[2.5rem] shadow-[0_20px_70px_rgba(0,0,0,0.3)] w-full max-w-sm overflow-hidden animate-bounce-in">
            <div className="h-2 w-full bg-gradient-to-r from-red-400 to-rose-600"></div>
            
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500 shadow-inner">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mb-2">Sign Out?</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mb-8 leading-relaxed">
                Are you sure you want to terminate your secure session? You'll need to re-authenticate to access your records.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="py-3.5 px-6 rounded-2xl font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                >
                  No, Stay
                </button>
                <button
                  onClick={handleLogout}
                  className="py-3.5 px-6 rounded-2xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all active:scale-95"
                >
                  Yes, Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Sidebar;
