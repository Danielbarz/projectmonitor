import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoDark from '../assets/images/Logo/logo_dark.png';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const activePage = location.pathname;
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"></path>
        </svg>
      )
    },
    {
      path: '/projects',
      label: 'All Projects',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
        </svg>
      )
    },
  ];

  if (isAdmin) {
    menuItems.push(
      {
        path: '/manage-roles',
        label: 'Manage Roles',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
        )
      }
    );
  }

  return (
    <div className="w-64 h-screen bg-slate-800 flex flex-col fixed left-0 top-0 shadow-lg z-50">
      {/* Logo Area */}
      <div className="h-28 flex items-center justify-center border-b border-slate-700/50">
         <img className="h-24 w-auto object-contain" src={logoDark} alt="Logo" />
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6 px-3 space-y-2">
        {menuItems.map((item, index) => {
          const isActive = activePage === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative animate-slide-in-left ${
                isActive
                  ? 'active bg-slate-700/50 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-700/30 hover:text-white hover:translate-x-1'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`transition-all duration-300 ${isActive ? 'opacity-100 scale-110' : 'opacity-70 group-hover:opacity-100 group-hover:scale-110'}`}>
                {item.icon}
              </div>
              <span className="font-['Carlito'] font-bold text-lg tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 text-center text-slate-500 text-xs font-['Carlito']">
        v1.0.0
      </div>
    </div>
  );
};

export default Sidebar;