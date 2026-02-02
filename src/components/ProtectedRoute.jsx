import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Jika ada batasan role dan role user tidak sesuai
  // Note: Backend mengirim role sebagai string (misal "ADMIN", "USER")
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Jika user coba akses halaman Admin, lempar balik ke Dashboard mereka
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;