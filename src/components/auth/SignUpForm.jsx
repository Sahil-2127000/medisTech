import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpForm = ({ onSwitch }) => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const role = "patient";

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5001/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, phone })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to resend OTP');

      setTimer(60);
      setCanResend(false);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
          body: JSON.stringify({ email, phone })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to send OTP');

        setOtpSent(true);
        setTimer(60);
        setCanResend(false);
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
          navigate('/doctor/dashboard');
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
    <form onSubmit={handleSubmit} className="space-y-4">

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
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-b border-gray-300 py-2 pr-10 focus:outline-none focus:border-blue-500 text-sm text-gray-800 placeholder-gray-300 transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex="-1"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.978 9.978 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1 pb-1">
            <label className="text-xs font-semibold text-blue-500">Phone Number</label>
            <div className="relative flex items-center">
              <span className="absolute left-0 text-sm text-gray-400">+91</span>
              <input
                type="text"
                required
                value={phone}
                maxLength={10}
                minLength={10}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                className="w-full pl-8 border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500 text-sm text-gray-800 tracking-wider placeholder-gray-300 transition-colors"
              />
            </div>
          </div>

          {role === 'patient' && (
            <>
              <div className="flex gap-4">
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

            </>
          )}

        </>
      ) : (
        <div className="space-y-2 transition-all">
          <div className="bg-blue-50 text-blue-600 text-center text-[13px] p-3 rounded-lg border border-blue-100 animate-pulse">
            We've sent a 6-digit OTP to your email.
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
          <div className="flex flex-col items-center gap-2 mt-4">
            {!canResend ? (
              <p className="text-xs text-gray-500">
                Resend OTP in <span className="font-bold text-blue-500">{timer}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                className="text-xs font-bold text-[#3963F9] hover:text-blue-700 transition-colors hover:underline"
              >
                {loading ? 'Resending...' : 'Resend OTP'}
              </button>
            )}
          </div>
        </div>
      )}

      {error && <div className="text-xs text-red-500 mt-2">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#3963F9] hover:bg-blue-700 text-white font-medium py-3 rounded-xl mt-4 transition-all shadow-lg shadow-blue-500/30 hover:cursor-pointer disabled:opacity-50"
      >
        {loading ? 'Processing...' : (otpSent ? 'Verify & Register' : 'Sign Up')}
      </button>

      <div className="text-center pt-2 mt-4">
        {otpSent ? (
          <button
            type="button"
            onClick={() => setOtpSent(false)}
            className="text-sm text-[#3963F9] font-semibold hover:text-blue-700 transition-colors"
          >
            Back to sign up info
          </button>
        ) : (
          <div className="text-sm -mt-5 font-medium text-gray-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitch}
              className="text-[#3963F9] font-bold hover:text-blue-700 transition-colors hover:underline"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default SignUpForm;
