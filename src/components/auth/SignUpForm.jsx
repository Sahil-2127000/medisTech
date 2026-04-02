import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpForm = ({ onSwitch }) => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Strict Password Validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;
    if (!otpSent && !passwordRegex.test(password)) {
      setError("Password must be 8-32 characters, with at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).");
      return;
    }

    setError('');
    setLoading(true);

    try {
      if (!otpSent) {
        // Step 1: Send OTP
        const res = await fetch('http://localhost:5001/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
        
        setOtpSent(true);
      } else {
        // Step 2: Register with OTP
        const res = await fetch('http://localhost:5001/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ fullName, email, password, otp, role, age: age ? Number(age) : undefined, gender, phone })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration failed');
        
        sessionStorage.setItem('user', JSON.stringify(data.user)); // Store active user details
        
        if (data.user.role === 'doctor') {
           navigate('/doctordashboard');
        } else {
           navigate('/patientdashboard');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      
      {!otpSent ? (
        <>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-blue-500">Full Name</label>
            <input 
              type="text" 
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe" 
              className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500 text-sm text-gray-800 placeholder-gray-300 transition-colors"
            />
          </div>

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
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#5265ec] transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-[#5265ec] focus:ring-4 focus:ring-[#5265ec]/10 transition-all font-semibold text-slate-800 placeholder-gray-400 group"
                placeholder="Secure Password"
              />
            </div>

            {role === 'patient' && (
              <>
                <div className="flex gap-4 pt-2">
                  <div className="space-y-1 flex-1">
                    <label className="text-xs font-semibold text-blue-500">Age</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 25" 
                      className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500 text-sm text-gray-800 placeholder-gray-300 transition-colors"
                    />
                  </div>
                  <div className="space-y-1 flex-1">
                    <label className="text-xs font-semibold text-blue-500">Gender</label>
                    <select 
                      required
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500 text-sm text-gray-800 bg-transparent transition-colors"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1 pb-2">
                  <label className="text-xs font-semibold text-blue-500">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    maxLength={10}
                    minLength={10}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9112345678" 
                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500 text-sm text-gray-800 placeholder-gray-300 transition-colors"
                  />
                </div>
              </>
            )}
            
            <div className="flex gap-4 p-1 bg-gray-50 border border-gray-100 rounded-2xl mt-4">
               <button 
                 type="button"
                 onClick={() => setRole('patient')}
                 className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${role === 'patient' ? 'bg-white shadow-sm text-[#5265ec]' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 Patient
               </button>
               <button 
                 type="button" 
                 onClick={() => setRole('doctor')}
                 className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${role === 'doctor' ? 'bg-white shadow-sm text-[#5265ec]' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 Doctor
               </button>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-2 transition-all">
          <div className="bg-blue-50 text-blue-600 text-[10px] md:text-xs p-3 rounded-lg border border-blue-100 animate-pulse">
            We've sent a 6-digit OTP to your email. (Check terminal/console if SMTP isn't running)
          </div>
          <div className="space-y-1 mt-4">
            <label className="text-xs font-semibold text-blue-500">Enter OTP</label>
            <input 
              type="text" 
              required
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456" 
              className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500 text-sm text-gray-800 tracking-widest transition-colors text-center font-bold"
            />
          </div>
        </div>
      )}

      {error && <div className="text-xs text-red-500 mt-2">{error}</div>}

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-[#3963F9] hover:bg-blue-700 text-white font-medium py-3 rounded-xl mt-4 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50"
      >
        {loading ? 'Processing...' : (otpSent ? 'Verify & Register' : 'Sign Up')}
      </button>

      <div className="text-center pt-2">
        <button 
          type="button"
          onClick={() => {
            if (otpSent) {
              setOtpSent(false); // Let them go back if they want
            } else {
              onSwitch();
            }
          }}
          className="text-xs text-pink-500 font-medium hover:text-pink-600"
        >
          {otpSent ? 'Back to sign up info' : 'I have an Account ?'}
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
