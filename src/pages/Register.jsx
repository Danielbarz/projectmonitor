import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoLight from '../assets/images/Logo/logo_light.png';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex bg-white font-['Carlito'] overflow-hidden">
      {/* Left Side - Image Overlay */}
      <div className="hidden lg:block lg:w-[65%] h-full relative">
        <img 
          className="w-full h-full object-cover" 
          src="https://placehold.co/932x1024" 
          alt="Background" 
        />
        <div className="absolute inset-0 bg-slate-800 opacity-60"></div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-[35%] h-full bg-slate-100 flex flex-col justify-center items-center relative p-8">
        
        {/* Logo */}
        <div className="absolute top-10">
             <img className="w-52 h-40 object-contain" src={logoLight} alt="Logo" />
        </div>

        <div className="w-full max-w-sm mt-32">
          <h2 className="text-red-600 text-4xl font-bold mb-6 text-left">Register</h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            {/* Username Field */}
            <div className="mb-4 relative">
              <label className="block text-slate-800 text-2xl font-bold mb-1">Username</label>
              <input 
                type="text" 
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full h-11 px-4 rounded-xl bg-white border-none focus:ring-2 focus:ring-red-600 outline-none text-xl placeholder-neutral-400/50"
              />
            </div>

            {/* Email Field */}
            <div className="mb-4 relative">
              <label className="block text-slate-800 text-2xl font-bold mb-1">Email</label>
              <input 
                type="email" 
                placeholder="Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-11 px-4 rounded-xl bg-white border-none focus:ring-2 focus:ring-red-600 outline-none text-xl placeholder-neutral-400/50"
              />
            </div>

            {/* Password Field */}
            <div className="mb-4 relative">
              <label className="block text-slate-800 text-2xl font-bold mb-1">Password</label>
              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-11 px-4 rounded-xl bg-white border-none focus:ring-2 focus:ring-red-600 outline-none text-xl placeholder-neutral-400/50"
              />
            </div>

            {/* Confirm Password Field */}
            <div className="mb-8 relative">
              <label className="block text-slate-800 text-2xl font-bold mb-1">Confirm Password</label>
              <input 
                type="password" 
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full h-11 px-4 rounded-xl bg-white border-none focus:ring-2 focus:ring-red-600 outline-none text-xl placeholder-neutral-400/50"
              />
            </div>

            {/* Register Button */}
            <button 
              type="submit"
              disabled={loading}
              className={`w-full h-16 bg-red-600 rounded-3xl text-white text-2xl font-bold transition-colors mb-4 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-700'}`}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-right">
             <Link to="/" className="text-red-600 text-xl font-normal underline">
              Already have an account?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
