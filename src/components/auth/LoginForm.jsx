import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onSwitch }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      {error && <div className="text-xs text-red-500 mt-2">{error}</div>}

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
