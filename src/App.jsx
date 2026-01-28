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
import MasterData from './pages/MasterData';
import ManageRoles from './pages/ManageRoles';
import { RoleProvider } from './context/RoleContext';
import RoleToggle from './components/RoleToggle';
import './App.css';

function App() {
  return (
    <RoleProvider>
      <Router>
        <RoleToggle />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<AllProjects />} />
          <Route path="/projects/new" element={<NewProject />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/projects/:id/edit" element={<UpdateProject />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/master-data" element={<MasterData />} />
          <Route path="/manage-roles" element={<ManageRoles />} />
        </Routes>
      </Router>
    </RoleProvider>
  );
}

export default App;