import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const SettingsView = ({ patientData }) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [saveMessage, setSaveMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Forgot Password State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState('email'); // email, otp, reset
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotPasswordData, setForgotPasswordData] = useState({ newPassword: '', confirmPassword: '' });
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotIsLoading, setForgotIsLoading] = useState(false);
   const { theme, toggleTheme } = useTheme();
   const isDark = theme === 'dark';

  const handlePasswordChange = (e) => {
    setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const attemptUpdateExpand = () => {
    setSaveMessage('');
    setIsChangingPassword(true);
    setIsVerified(false);
  };

  const handleVerifyPassword = async () => {
    if (!passwordData.oldPassword) {
      setSaveMessage('Please enter your current password first.');
      return;
    }
    setIsVerifying(true);
    setSaveMessage('');
    try {
      const res = await fetch('http://localhost:5001/api/auth/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: passwordData.oldPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setIsVerified(true);
        setSaveMessage('');
      } else {
        setSaveMessage(data.message || 'Please enter the old password correctly');
      }
    } catch (e) {
      setSaveMessage('Server error. Verification failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  const submitPasswordChange = async () => {
    setSaveMessage('');
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setSaveMessage('All fields are dynamically required.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;
    if (!passwordRegex.test(passwordData.newPassword)) {
      setSaveMessage("Complexity failed. Require 8-32 characters, Uppercase, Lowercase, Number & Symbol (@$!%*?&).");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSaveMessage('Both passswords do not match with each other');
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

  // Forgot Password Actions
  const openForgotModal = () => {
    setShowForgotModal(true);
    setForgotStep('email');
    setForgotMessage('');
    setForgotOtp('');
    setForgotPasswordData({ newPassword: '', confirmPassword: '' });
  };

  const sendForgotOtp = async () => {
    setForgotIsLoading(true);
    setForgotMessage('');
    try {
      const res = await fetch('http://localhost:5001/api/auth/forgot-password-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if (res.ok) {
        setForgotStep('otp');
        setForgotMessage('Verification code successfully transmitted.');
      } else {
        const data = await res.json();
        setForgotMessage(data.message || 'Failed to send verification code.');
      }
    } catch (e) {
      setForgotMessage('Network failure reaching secure bridge.');
    } finally {
      setForgotIsLoading(false);
    }
  };

  const handleForgotOtpSubmit = () => {
    if (forgotOtp.length === 6) {
      setForgotStep('reset');
      setForgotMessage('');
    } else {
      setForgotMessage('Please enter a valid 6-digit code.');
    }
  };

  const submitForgotReset = async () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;
    if (!passwordRegex.test(forgotPasswordData.newPassword)) {
      setForgotMessage("Complexity failed: 8-32 chars, Uppercase, Lowercase, Number & Symbol.");
      return;
    }

    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      setForgotMessage('Selection mismatch. Both fields must be identical.');
      return;
    }
    setForgotIsLoading(true);
    setForgotMessage('');
    try {
      const res = await fetch('http://localhost:5001/api/auth/forgot-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ otp: forgotOtp, newPassword: forgotPasswordData.newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setForgotMessage('Password successfully updated!');
        setTimeout(() => {
          setShowForgotModal(false);
          setIsVerified(true); // Unlock the main UI as well
          setSaveMessage('');
        }, 1500);
      } else {
        setForgotMessage(data.message || 'Verification rejected.');
      }
    } catch (e) {
      setForgotMessage('Server unreachable during mutation.');
    } finally {
      setForgotIsLoading(false);
    }
  };




  const [emailEnabled, setEmailEnabled] = useState(patientData?.emailNotifications !== false);

  const togglePreference = async (type, currentVal) => {
    const newVal = !currentVal;
    setEmailEnabled(newVal);

    try {
      await fetch('http://localhost:5001/api/auth/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ emailNotifications: newVal })
      });
    } catch (e) {
      console.error('Failed to sync preference natively.');
    }
  };

  return (
    <div className="flex-1 h-full py-8 md:py-12 px-6 md:px-12 flex flex-col overflow-y-auto no-scrollbar">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-[#021024] dark:text-white transition-colors">Account Settings</h1>
        <p className="text-gray-400 dark:text-gray-500 font-medium mt-1">Manage your preferences and security natively across environments.</p>
      </div>

      <div className="space-y-6">
        {/* Security Context */}
        <div className="bg-white dark:bg-slate-900/40 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-[0_10px_20px_rgba(0,0,0,0.03)] p-8 transition-colors">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
            <svg className="w-6 h-6 text-[#5265ec]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Security Core Context
          </h2>
          <div className="flex flex-col gap-4">

            {/* Password Row */}
            <div className={`${isChangingPassword ? 'pb-4' : 'pb-2'} transition-all`}>
              {!isChangingPassword ? (
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-800 dark:text-white">Update Password</div>
                      <div className="text-sm text-gray-400 dark:text-gray-500 font-medium mt-1">Update your account password regularly</div>
                    </div>
                    <button onClick={attemptUpdateExpand} className="text-[#5265ec] font-semibold hover:underline bg-[#5265ec]/5 dark:bg-[#5265ec]/10 px-4 py-2 rounded-xl transition-colors hover:bg-[#5265ec]/10 dark:hover:bg-[#5265ec]/20">Update</button>
                  </div>
                  {saveMessage && !isChangingPassword && (
                    <div className="mt-4 p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-fade-in">
                      <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      <span className="text-sm font-bold text-red-600 leading-tight">{saveMessage}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-50/40 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-inner">
                  <div className="flex justify-between items-center mb-6">
                    <div className="font-bold text-slate-800 text-lg">{isVerified ? 'Set New Security Credentials' : 'Verify Current Identity'}</div>
                    <button onClick={() => { setIsChangingPassword(false); setSaveMessage(''); setIsVerified(false); setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' }) }} className="text-gray-400 hover:text-red-500 font-bold text-sm bg-white/50 px-3 py-1 rounded-lg transition-colors">Cancel</button>
                  </div>

                  {!isVerified ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">Confirm Old Password</label>
                        <input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} className="w-full bg-white/60 backdrop-blur-sm border border-white focus:border-[#5265ec] rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 outline-none transition-all shadow-sm placeholder:text-gray-300" placeholder="••••••••" />
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        {saveMessage && (
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-rose-500 animate-fade-in">
                              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                              <span className="text-xs font-bold">{saveMessage}</span>
                            </div>
                            {saveMessage.includes('old password') && (
                              <button 
                                onClick={openForgotModal} 
                                className="mt-3 bg-[#5265ec]/5 hover:bg-[#5265ec] text-[#5265ec] hover:text-white border border-[#5265ec]/20 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 group w-max ml-3.5 shadow-sm hover:shadow-lg hover:shadow-[#5265ec]/20"
                              >
                                <svg className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
                                Forgot Password?
                              </button>
                            )}
                          </div>
                        )}
                        <button onClick={handleVerifyPassword} disabled={isVerifying} className="ml-auto bg-[#5265ec] hover:bg-[#4254d3] text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-[#5265ec]/20 transition-all disabled:opacity-50 flex items-center gap-2">
                          {isVerifying ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : null}
                          {isVerifying ? 'Verifying...' : 'Submit'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-slide-up">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">New Secure Password</label>
                          <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full bg-white/60 backdrop-blur-sm border border-white focus:border-[#5265ec] rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 outline-none transition-all shadow-sm placeholder:text-gray-300" placeholder="••••••••" />
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">Confirm New Selection</label>
                          <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="w-full bg-white/60 backdrop-blur-sm border border-white focus:border-[#5265ec] rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 outline-none transition-all shadow-sm placeholder:text-gray-300" placeholder="••••••••" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold animate-fade-in flex items-center gap-2 ${saveMessage.includes('successfully') ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {saveMessage && <div className={`w-1.5 h-1.5 rounded-full ${saveMessage.includes('successfully') ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>}
                          {saveMessage}
                        </span>
                        <button onClick={submitPasswordChange} disabled={isSaving} className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-black shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 tracking-wider text-xs uppercase">
                          {isSaving ? 'Mutating Data...' : 'Update Password'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
      </div>

        {/* 🌓 Appearance & Theme */}
        <div className="bg-white dark:bg-slate-900/40 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-[0_10px_20px_rgba(0,0,0,0.03)] p-8 transition-colors">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
            <svg className="w-6 h-6 text-[#5265ec]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            Appearance & Theme
          </h2>
          <div className="flex items-center justify-between p-6 bg-slate-50/50 dark:bg-slate-800/40 rounded-3xl border border-white/60 dark:border-white/5 shadow-inner transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-[#5265ec]">
                {!isDark ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
              </div>
              <div>
                <div className="font-bold text-slate-800 dark:text-white">Midnight Mode</div>
                <div className="text-sm text-gray-400 dark:text-gray-500 font-medium mt-0.5">Toggle between light and dark aesthetics</div>
              </div>
            </div>

            <button 
              onClick={toggleTheme}
              className={`w-16 h-9 rounded-full relative transition-all duration-500 shadow-inner p-1 ${isDark ? 'bg-[#5265ec]' : 'bg-slate-200'}`}
            >
              <div className={`w-7 h-7 bg-white rounded-full shadow-lg transform transition-transform duration-500 flex items-center justify-center ${isDark ? 'translate-x-7' : 'translate-x-0'}`}>
                <div className={`w-4 h-4 rounded-full ${isDark ? 'bg-[#5265ec]' : 'bg-amber-400'} transition-colors duration-500`}></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal (Glass UI) */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-xl animate-fade-in">
          <div className="bg-white/80 backdrop-blur-2xl border border-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.2)] w-full max-w-lg overflow-hidden relative animate-bounce-in">
            {/* Header Decoration */}
            <div className="h-2 w-full bg-gradient-to-r from-[#5265ec] to-teal-400"></div>

            <div className="p-8 md:p-12">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">Recover Account</h2>
                  <p className="text-slate-500 text-sm font-medium mt-1">Identity validation required</p>
                </div>
                <button onClick={() => setShowForgotModal(false)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {forgotStep === 'email' && (
                <div className="animate-fade-in">
                  <div className="mb-6">
                    <label className="text-[10px] font-black text-[#5265ec] uppercase tracking-widest block mb-2 px-1">Registered Address</label>
                    <div className="w-full bg-white/50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-400 select-none flex items-center gap-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      {patientData.email}
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium mt-3 italic px-1">Verification code will be dispatched to this secure node natively.</p>
                  </div>
                  <button onClick={sendForgotOtp} disabled={forgotIsLoading} className="w-full bg-[#5265ec] hover:bg-[#4254d3] text-white py-4 rounded-2xl font-black shadow-lg shadow-[#5265ec]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                    {forgotIsLoading ? <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div> : <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>}
                    {forgotIsLoading ? 'Requesting Secure Code...' : 'Send Verification OTP'}
                  </button>
                </div>
              )}

              {forgotStep === 'otp' && (
                <div className="animate-slide-up">
                  <div className="mb-6">
                    <label className="text-[10px] font-black text-[#5265ec] uppercase tracking-widest block mb-3 px-1">Identity Verification Code</label>
                    <input
                      autoFocus
                      maxLength={6}
                      type="text"
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-white border-2 border-slate-100 focus:border-[#5265ec] rounded-2xl px-6 py-5 text-4xl text-center font-black tracking-[1rem] text-slate-800 outline-none transition-all shadow-inner"
                      placeholder="000000"
                    />
                  </div>
                  <button onClick={handleForgotOtpSubmit} className="w-full bg-slate-800 hover:bg-slate-900 text-white py-4 rounded-2xl font-black shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-3">
                    Verify & Proceed
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </button>
                </div>
              )}

              {forgotStep === 'reset' && (
                <div className="animate-slide-up">
                  <div className="grid grid-cols-1 gap-4 mb-6">
                    <div>
                      <label className="text-[10px] font-black text-[#5265ec] uppercase tracking-widest block mb-2 px-1">New Secure Password</label>
                      <input
                        type="password"
                        value={forgotPasswordData.newPassword}
                        onChange={(e) => setForgotPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full bg-white border border-slate-100 focus:border-[#5265ec] rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none shadow-sm"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-[#5265ec] uppercase tracking-widest block mb-2 px-1">Confirm Identity Selection</label>
                      <input
                        type="password"
                        value={forgotPasswordData.confirmPassword}
                        onChange={(e) => setForgotPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full bg-white border border-slate-100 focus:border-[#5265ec] rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none shadow-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <button onClick={submitForgotReset} disabled={forgotIsLoading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 uppercase tracking-wider">
                    {forgotIsLoading ? 'Mutating Data...' : 'Finalize Recovery'}
                  </button>
                </div>
              )}

              {forgotMessage && (
                <div className={`mt-6 p-4 rounded-2xl flex items-center gap-3 animate-fade-in ${forgotMessage.includes('successful') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                  <div className={`w-2 h-2 rounded-full ${forgotMessage.includes('successful') ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`}></div>
                  <span className="text-xs font-black uppercase tracking-tight">{forgotMessage}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
