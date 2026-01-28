import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { role } = useRole();

  const handleLogout = () => {
    // Perform logout logic here (e.g., clear tokens)
    navigate('/');
  };

  return (
    <header className="w-full h-20 bg-white shadow-sm flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Left: Greeting */}
      <div className="flex items-center">
        <h2 className="text-2xl font-['Carlito']">
          <span className="font-bold text-slate-800">Good Morning, </span>
          <span className="font-bold text-red-600 capitalize">{role}</span>
          <span className="font-bold text-slate-800">!</span>
        </h2>
      </div>

      {/* Right: User Actions */}
      <div className="flex items-center gap-6">
        <Link to="/notifications" className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
          <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white"></span>
        </Link>
        
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
              <svg className="w-6 h-6 text-slate-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-bold text-slate-800 font-['Carlito'] capitalize">{role === 'admin' ? 'Super Admin' : 'User Employee'}</p>
              <p className="text-xs text-slate-500 font-['Carlito'] capitalize">{role}</p>
            </div>
            <svg className={`w-4 h-4 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 animate-in fade-in zoom-in-95 duration-100">
              <Link 
                to="/profile/edit" 
                className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-red-600 font-bold transition-colors flex items-center gap-2"
                onClick={() => setIsProfileOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Edit Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-red-600 font-bold transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;