import React, { useState } from 'react';

const SettingsView = ({ patientData }) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [saveMessage, setSaveMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handlePasswordChange = (e) => {
    setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const attemptUpdateExpand = () => {
    if (patientData && patientData.lastPasswordChange) {
       const twentyFourHours = 24 * 60 * 60 * 1000;
       const timeSinceLastChange = Date.now() - new Date(patientData.lastPasswordChange).getTime();
       if (timeSinceLastChange < twentyFourHours) {
          setSaveMessage('For security reasons, password changes are limited to once every 24 hours. Please try again later.');
          // Auto-hide the soft-block message after 5 seconds to keep UI clean
          setTimeout(() => setSaveMessage(''), 5000);
          return;
       }
    }
    setSaveMessage('');
    setIsChangingPassword(true);
  };

  const submitPasswordChange = async () => {
    setSaveMessage('');
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
       setSaveMessage('All fields are dynamically required.');
       return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
       setSaveMessage('New passwords do not match inherently.');
       return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('http://localhost:5001/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ oldPassword: passwordData.oldPassword, newPassword: passwordData.newPassword })
      });
      const data = await res.json();
      
      if (res.ok) {
         setSaveMessage('Password explicitly mutated successfully!');
         setTimeout(() => {
            setIsChangingPassword(false);
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setSaveMessage('');
         }, 1500);
      } else {
         setSaveMessage(data.message || 'Failed connecting to secure bridge.');
      }
    } catch (e) {
      setSaveMessage('Server physically unavailable.');
    } finally {
      setIsSaving(false);
    }
  };



  const [emailEnabled, setEmailEnabled] = useState(patientData?.emailNotifications !== false);
  const [smsEnabled, setSmsEnabled] = useState(patientData?.smsNotifications !== false);

  const togglePreference = async (type, currentVal) => {
    const newVal = !currentVal;
    if (type === 'email') setEmailEnabled(newVal);
    else setSmsEnabled(newVal);

    try {
      await fetch('http://localhost:5001/api/auth/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ [type === 'email' ? 'emailNotifications' : 'smsNotifications']: newVal })
      });
    } catch (e) {
      console.error('Failed to sync preference natively.');
    }
  };

  return (
    <div className="flex-1 h-full py-8 md:py-12 px-6 md:px-12 flex flex-col overflow-y-auto no-scrollbar">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-[#021024]">Account Settings</h1>
        <p className="text-gray-400 font-medium mt-1">Manage your preferences and security natively across environments.</p>
      </div>

      <div className="space-y-6">
        {/* Security Context */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_10px_20px_rgba(0,0,0,0.03)] p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
            <svg className="w-6 h-6 text-[#5265ec]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            Security Core Context
          </h2>
          <div className="flex flex-col gap-4">
            
            {/* Password Row */}
            <div className={`${isChangingPassword ? 'pb-4' : 'pb-2'} transition-all`}>
              {!isChangingPassword ? (
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-800">Change Password</div>
                      <div className="text-sm text-gray-400 font-medium mt-1">Update your account password regularly</div>
                    </div>
                    <button onClick={attemptUpdateExpand} className="text-[#5265ec] font-semibold hover:underline bg-[#5265ec]/5 px-4 py-2 rounded-xl transition-colors hover:bg-[#5265ec]/10">Update</button>
                  </div>
                  {saveMessage && !isChangingPassword && (
                    <div className="mt-4 p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-fade-in">
                       <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                       <span className="text-sm font-bold text-red-600 leading-tight">{saveMessage}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100">
                   <div className="flex justify-between items-center mb-5">
                      <div className="font-bold text-slate-800 text-lg">Mutate Security Password</div>
                      <button onClick={() => { setIsChangingPassword(false); setSaveMessage(''); setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' }) }} className="text-gray-400 hover:text-red-500 font-bold text-sm">Cancel</button>
                   </div>
                   
                   <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="flex-1">
                         <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Old Password</label>
                         <input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} className="w-full bg-white border border-gray-200 focus:border-[#5265ec] rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none transition-colors shadow-sm" placeholder="••••••••" />
                      </div>
                      <div className="flex-1">
                         <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">New Password</label>
                         <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full bg-white border border-gray-200 focus:border-[#5265ec] rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none transition-colors shadow-sm" placeholder="••••••••" />
                      </div>
                      <div className="flex-1">
                         <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Confirm New</label>
                         <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="w-full bg-white border border-gray-200 focus:border-[#5265ec] rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none transition-colors shadow-sm" placeholder="••••••••" />
                      </div>
                   </div>

                   <div className="flex items-center justify-between">
                     <span className={`text-sm font-bold animate-fade-in ${saveMessage.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
                        {saveMessage}
                     </span>
                     <button onClick={submitPasswordChange} disabled={isSaving} className="bg-[#5265ec] hover:bg-[#4254d3] text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-[#5265ec]/30 transition-all disabled:opacity-50 tracking-wider text-sm">
                        {isSaving ? 'Processing Bridge...' : 'Patch Password'}
                     </button>
                   </div>
                </div>
              )}
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
              <div 
                onClick={() => togglePreference('email', emailEnabled)}
                className={`w-12 h-6 ${emailEnabled ? 'bg-[#5265ec]' : 'bg-gray-200'} rounded-full relative cursor-pointer shadow-inner transition-colors`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${emailEnabled ? 'right-0.5' : 'left-0.5'}`}></div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <div>
                <div className="font-bold text-slate-800">SMS Alerts</div>
                <div className="text-sm text-gray-400 font-medium mt-1">Get updates on your phone</div>
              </div>
              <div 
                onClick={() => togglePreference('sms', smsEnabled)}
                className={`w-12 h-6 ${smsEnabled ? 'bg-[#5265ec]' : 'bg-gray-200'} rounded-full relative cursor-pointer shadow-inner transition-colors`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${smsEnabled ? 'right-0.5' : 'left-0.5'}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
