import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onSwitch }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState(null);
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      
      if (data.requires2FA) {
         setRequires2FA(true);
         setTwoFactorData(data);
         return;
      }
      
      sessionStorage.setItem('user', JSON.stringify(data.user)); // Store active user details
      
      if (data.user.role === 'doctor') {
         navigate('/doctordashboard');
      } else {
         navigate('/patientdashboard'); // Default redirect for standard patients
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5001/api/auth/login-2fa-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: twoFactorData.userId, role: twoFactorData.role, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'OTP Verification failed');
      
      sessionStorage.setItem('user', JSON.stringify(data.user));
      if (data.user.role === 'doctor') {
         navigate('/doctordashboard');
      } else {
         navigate('/patientdashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (requires2FA) {
     return (
       <form onSubmit={handleVerify2FA} className="space-y-5 animate-fade-in">
         <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Two-Factor Authentication</h3>
            <p className="text-xs text-gray-500 mt-1">{twoFactorData?.message}</p>
         </div>
         <div className="space-y-1">
           <label className="text-xs font-semibold text-blue-500 uppercase tracking-widest">Enter 6-Digit Code</label>
           <input 
             type="text" 
             required
             maxLength="6"
             value={otp}
             onChange={(e) => setOtp(e.target.value)}
             placeholder="------" 
             className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500 text-2xl tracking-widest text-center font-black text-gray-800 placeholder-gray-300 transition-colors"
           />
         </div>
         {error && <div className="text-xs font-bold text-red-500 text-center mt-2">{error}</div>}
         
         <button 
           type="submit" 
           disabled={loading}
           className="w-full bg-[#3963F9] hover:bg-blue-700 text-white font-medium py-3 rounded-xl mt-4 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50"
         >
           {loading ? 'Verifying...' : 'Verify Secure Login'}
         </button>
         
         <div className="text-center pt-4">
           <button 
             type="button"
             onClick={() => handleSubmit()}
             className="text-xs text-blue-500 font-bold hover:underline"
           >
             Resend Code
           </button>
         </div>
         <div className="text-center pt-2">
           <button type="button" onClick={() => setRequires2FA(false)} className="text-xs text-gray-400 hover:text-gray-600">Cancel Login</button>
         </div>
       </form>
     );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1">
        <label className="text-xs font-semibold text-blue-500">Email</label>
        <input 
          type="email" 
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="johndoe@email.com" 
          className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500 text-sm text-gray-800 placeholder-gray-300 transition-colors"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-blue-500">Password</label>
        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"} 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" 
            className="w-full border-b border-gray-300 py-2 pr-10 focus:outline-none focus:border-blue-500 text-sm text-gray-800 placeholder-gray-300 transition-colors"
          />
          <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.978 9.978 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  )}
                </button>
        </div>
        <div className="flex justify-end pt-1">
          <button type="button" className="text-xs text-gray-500 hover:text-blue-600 font-medium transition-colors">
            Forgot password?
          </button>
        </div>
      </div>

      {error && <div className="text-xs font-bold text-red-500 text-center mt-2">{error}</div>}

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-[#3963F9] hover:bg-blue-700 text-white font-medium py-3 rounded-xl mt-4 transition-all shadow-lg shadow-blue-500/30 hover:cursor-pointer disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Sign In'}
      </button>

      <div className="text-center pt-4">
        <span className="text-sm text-gray-500 font-medium">
          Don't have an account?{' '}
        </span>
        <button 
          type="button"
          onClick={onSwitch}
          className="text-sm text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors"
    
        >
          Create an account
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
