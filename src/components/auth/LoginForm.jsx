import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onSwitch }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        <input 
          type="password" 
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••" 
          className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500 text-sm text-gray-800 placeholder-gray-300 transition-colors"
        />
      </div>

      {error && <div className="text-xs font-bold text-red-500 text-center mt-2">{error}</div>}

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-[#3963F9] hover:bg-blue-700 text-white font-medium py-3 rounded-xl mt-4 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Sign In'}
      </button>

      <div className="text-center pt-2">
        <button 
          type="button"
          onClick={onSwitch}
          className="text-xs text-pink-500 font-medium hover:text-pink-600"
        >
          Don't have an Account?
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
