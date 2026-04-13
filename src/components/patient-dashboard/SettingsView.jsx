import React from 'react';

const SettingsView = () => {
  return (
    <div className="flex-1 h-full py-8 md:py-12 px-6 md:px-12 flex flex-col overflow-y-auto no-scrollbar">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-[#021024]">Account Settings</h1>
        <p className="text-gray-400 font-medium mt-1">Manage your preferences and security</p>
      </div>

      <div className="space-y-6">
        {/* Security Context */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_10px_20px_rgba(0,0,0,0.03)] p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
            <svg className="w-6 h-6 text-[#5265ec]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            Security Context
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-5">
              <div>
                <div className="font-bold text-slate-800">Change Password</div>
                <div className="text-sm text-gray-400 font-medium mt-1">Update your account password regularly</div>
              </div>
              <button className="text-[#5265ec] font-semibold hover:underline bg-[#5265ec]/5 px-4 py-2 rounded-xl transition-colors hover:bg-[#5265ec]/10">Update</button>
            </div>
            <div className="flex justify-between items-center pt-2">
              <div>
                <div className="font-bold text-slate-800">Two-Factor Authentication</div>
                <div className="text-sm text-gray-400 font-medium mt-1">Add an extra layer of security</div>
              </div>
              <button className="bg-gray-100 hover:bg-gray-200 text-slate-800 px-5 py-2 rounded-xl font-semibold transition-colors">Enable</button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_10px_20px_rgba(0,0,0,0.03)] p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
            <svg className="w-6 h-6 text-[#5265ec]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            Notifications
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-5">
              <div>
                <div className="font-bold text-slate-800">Email Notifications</div>
                <div className="text-sm text-gray-400 font-medium mt-1">Receive alerts via email</div>
              </div>
              <div className="w-12 h-6 bg-[#5265ec] rounded-full relative cursor-pointer shadow-inner">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <div>
                <div className="font-bold text-slate-800">SMS Alerts</div>
                <div className="text-sm text-gray-400 font-medium mt-1">Get updates on your phone</div>
              </div>
              <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer shadow-inner">
                <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
