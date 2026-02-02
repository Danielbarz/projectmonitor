import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AllProjects from './pages/AllProjects';
import NewProject from './pages/NewProject';
import ProjectDetail from './pages/ProjectDetail';
import UpdateProject from './pages/UpdateProject';
import Notifications from './pages/Notifications';
import EditProfile from './pages/EditProfile';
import ManageRoles from './pages/ManageRoles';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes (Accessible by USER, ADMIN, SUPERADMIN) */}
          <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN', 'SUPERADMIN']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<AllProjects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile/edit" element={<EditProfile />} />
          </Route>

          {/* Admin Routes (Accessible only by ADMIN, SUPERADMIN) */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']} />}>
            <Route path="/projects/new" element={<NewProject />} />
            <Route path="/projects/:id/edit" element={<UpdateProject />} />
            <Route path="/manage-roles" element={<ManageRoles />} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;