import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
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
        
        {/* Logo Placeholder - Positioned absolute top in original, making it consistent */}
        <div className="absolute top-10">
             <img className="w-52 h-40 object-contain" src="https://placehold.co/210x161" alt="Logo" />
        </div>

        <div className="w-full max-w-sm mt-32">
          <h2 className="text-red-600 text-4xl font-bold mb-6 text-left">Register</h2>

          {/* Username Field */}
          <div className="mb-4 relative">
            <label className="block text-slate-800 text-2xl font-bold mb-1">Username</label>
            <input 
              type="text" 
              placeholder="Username"
              className="w-full h-11 px-4 rounded-xl bg-white border-none focus:ring-2 focus:ring-red-600 outline-none text-xl placeholder-neutral-400/50"
            />
          </div>

          {/* Email Field */}
          <div className="mb-4 relative">
            <label className="block text-slate-800 text-2xl font-bold mb-1">Email</label>
            <input 
              type="email" 
              placeholder="Email ID"
              className="w-full h-11 px-4 rounded-xl bg-white border-none focus:ring-2 focus:ring-red-600 outline-none text-xl placeholder-neutral-400/50"
            />
          </div>

          {/* Password Field */}
          <div className="mb-4 relative">
            <label className="block text-slate-800 text-2xl font-bold mb-1">Password</label>
            <input 
              type="password" 
              placeholder="Password"
              className="w-full h-11 px-4 rounded-xl bg-white border-none focus:ring-2 focus:ring-red-600 outline-none text-xl placeholder-neutral-400/50"
            />
          </div>

          {/* Confirm Password Field */}
          <div className="mb-8 relative">
            <label className="block text-slate-800 text-2xl font-bold mb-1">Confirm Password</label>
            <input 
              type="password" 
              placeholder="Confirm Password"
              className="w-full h-11 px-4 rounded-xl bg-white border-none focus:ring-2 focus:ring-red-600 outline-none text-xl placeholder-neutral-400/50"
            />
          </div>

          {/* Register Button */}
          <button className="w-full h-16 bg-red-600 rounded-3xl text-white text-2xl font-bold hover:bg-red-700 transition-colors mb-4">
            Register
          </button>

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
