import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoLight from '../assets/images/Logo/logo_light.png';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
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
        
        {/* Logo Placeholder */}
        <div className="mb-8">
             <img className="w-52 h-40 object-contain" src={logoLight} alt="Logo" />
        </div>

        <div className="w-full max-w-sm">
          <h2 className="text-red-600 text-4xl font-bold mb-10 text-left">Login</h2>

          {/* Email Field */}
          <div className="mb-6 relative">
            <label className="block text-slate-800 text-2xl font-bold mb-2">Email</label>
            <input 
              type="email" 
              placeholder="Email ID"
              className="w-full h-11 px-4 rounded-xl bg-white border-none focus:ring-2 focus:ring-red-600 outline-none text-xl placeholder-neutral-400/50"
            />
          </div>

          {/* Password Field */}
          <div className="mb-6 relative">
            <label className="block text-slate-800 text-2xl font-bold mb-2">Password</label>
            <input 
              type="password" 
              placeholder="Password"
              className="w-full h-11 px-4 rounded-xl bg-white border-none focus:ring-2 focus:ring-red-600 outline-none text-xl placeholder-neutral-400/50"
            />
          </div>

          {/* Remember Me & Register Link */}
          <div className="flex justify-between items-center mb-10 mt-8">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                className="w-7 h-7 bg-neutral-400/20 rounded-[10px] border-none text-red-600 focus:ring-0 cursor-pointer"
              />
              <span className="text-slate-800 text-xl font-normal">Remember Me</span>
            </div>
            <Link to="/register" className="text-red-600 text-xl font-normal underline">
              Register an account
            </Link>
          </div>

          {/* Login Button */}
          <button 
            onClick={handleLogin}
            className="w-full h-16 bg-red-600 rounded-3xl text-white text-2xl font-bold hover:bg-red-700 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
