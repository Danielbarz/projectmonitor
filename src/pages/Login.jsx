import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoLight from '../assets/images/Logo/logo_light.png';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', { email, password: '***' });

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Response:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex bg-slate-100 font-['Carlito'] overflow-hidden">
      {/* Left Side - Image Overlay */}
      <div className="hidden lg:block lg:w-[60%] h-full relative">
        <img
          className="w-full h-full object-cover"
          src="/images/big.png"
          alt="Background"
        />
        <div className="absolute inset-0 bg-slate-800 opacity-60"></div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-[40%] h-full bg-slate-100 flex flex-col justify-center items-center px-8 py-6">
        {/* Logo */}
        <div className="mb-6">
          <img className="w-52 h-36 object-contain" src={logoLight} alt="Logo" />
        </div>

        <div className="w-full max-w-sm">
          <h2 className="text-red-600 text-3xl font-bold mb-5 text-left">Login</h2>

          {/* Error Message */}
          {error && (
            <div className="mb-3 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-slate-800 text-lg font-bold mb-1.5">Email</label>
              <input
                type="email"
                placeholder="Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-10 px-4 rounded-xl bg-white border-none focus:ring-2 focus:ring-red-600 outline-none text-base placeholder-neutral-400/50"
              />
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label className="block text-slate-800 text-lg font-bold mb-1.5">Password</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-10 px-4 rounded-xl bg-white border-none focus:ring-2 focus:ring-red-600 outline-none text-base placeholder-neutral-400/50"
              />
            </div>

            {/* Remember Me & Register Link */}
            <div className="flex justify-between items-center mb-6 mt-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-5 h-5 bg-neutral-400/20 rounded-md border-none text-red-600 focus:ring-0 cursor-pointer"
                />
                <span className="text-slate-800 text-sm font-normal">Remember Me</span>
              </div>
              <Link to="/register" className="text-red-600 text-sm font-normal underline">
                Register an account
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full h-12 bg-red-600 rounded-xl text-white text-lg font-bold transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-700'}`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
