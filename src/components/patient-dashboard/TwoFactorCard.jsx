import React, { useState } from 'react';

// Enable / disable e-mail OTP based two-factor authentication
const TwoFactorCard = ({ initiallyEnabled }) => {
  const [enabled, setEnabled] = useState(!!initiallyEnabled);
  const [step, setStep] = useState('idle'); // idle | otp
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const call = async (url, body) => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`http://localhost:5001/api/auth/2fa/${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body || {})
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Request failed');
      return true;
    } catch (err) {
      setMessage(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const startSetup = async () => {
    if (await call('setup')) {
      setStep('otp');
      setMessage('A 6-digit code has been sent to your e-mail.');
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    if (await call('setup-verify', { otp })) {
      setEnabled(true);
      setStep('idle');
      setOtp('');
      setMessage('Two-factor authentication is now active.');
    }
  };

  const disable = async () => {
    if (await call('disable')) {
      setEnabled(false);
      setMessage('Two-factor authentication disabled.');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900/40 rounded-4xl border-2 border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 p-8 transition-colors">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
        <svg className="w-6 h-6 text-[#5265ec]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        Two-Factor Authentication
      </h2>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-50/50 dark:bg-slate-800/40 rounded-3xl border-2 border-slate-200 dark:border-slate-700">
        <div>
          <div className="font-bold text-slate-800 dark:text-white">
            E-mail OTP at login {enabled && <span className="ml-2 text-[10px] uppercase tracking-wider bg-emerald-100 text-emerald-600 px-2 py-1 rounded-md">Active</span>}
          </div>
          <div className="text-sm text-gray-400 font-medium mt-0.5">A one-time code is e-mailed to you every time you sign in.</div>
        </div>
        {step === 'otp' ? (
          <form onSubmit={verify} className="flex gap-2">
            <input value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} required placeholder="6-digit code"
              className="w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 font-bold tracking-widest text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-[#5265ec]/30" />
            <button disabled={loading} className="bg-[#5265ec] text-white font-bold px-5 rounded-xl disabled:opacity-60">Verify</button>
          </form>
        ) : enabled ? (
          <button onClick={disable} disabled={loading} className="bg-rose-50 text-rose-600 border border-rose-100 font-bold px-5 py-2.5 rounded-xl disabled:opacity-60">Disable</button>
        ) : (
          <button onClick={startSetup} disabled={loading} className="bg-[#5265ec] text-white font-bold px-5 py-2.5 rounded-xl disabled:opacity-60">Enable 2FA</button>
        )}
      </div>
      {message && <p className="text-sm font-semibold text-slate-500 mt-3 ml-1">{message}</p>}
    </div>
  );
};

export default TwoFactorCard;
