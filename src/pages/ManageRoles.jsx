import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Input from '../components/Input';

const ManageRoles = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form State
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role_id: '3'
  });

  const roles = [
    { id: 1, name: 'SUPERADMIN' },
    { id: 2, name: 'ADMIN' },
    { id: 3, name: 'USER' }
  ];

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter Logic
  const filteredUsers = useMemo(() => {
      return users.filter(u =>
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [users, searchQuery]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role_id: '3'
    });
    setCurrentUser(null);
  };

  // Add User
  const handleAddUser = async () => {
    if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: parseInt(formData.role_id)
            })
        });

        if (response.ok) {
            alert('User added successfully');
            setIsAddModalOpen(false);
            resetForm();
            fetchUsers();
        } else {
            const err = await response.json();
            alert(`Failed: ${err.message}`);
        }
    } catch (error) {
        console.error('Error adding user:', error);
    }
  };

  // Edit User (Role & Password)
  const openEditModal = (user) => {
      setCurrentUser(user);
      setFormData({
          username: user.name,
          email: user.email,
          password: '',
          confirmPassword: '',
          role_id: user.role_id
      });
      setIsEditModalOpen(true);
  };

  const handleUpdateUser = async () => {
      if (!currentUser) return;
      if (formData.password && formData.password !== formData.confirmPassword) {
          alert("Passwords do not match!");
          return;
      }

      try {
          const response = await fetch(`http://localhost:5000/api/users/${currentUser.id}`, {
              method: 'PUT', // Changed route to general update
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  role_id: formData.role_id,
                  password: formData.password // Optional
              })
          });

          if (response.ok) {
              alert('User updated successfully');
              setIsEditModalOpen(false);
              resetForm();
              fetchUsers();
          } else {
              alert('Failed to update user');
          }
      } catch (error) {
          console.error(error);
      }
  };

  // Delete User
  const handleDeleteUser = async () => {
      if (!currentUser) return;
      try {
          const response = await fetch(`http://localhost:5000/api/users/${currentUser.id}`, {
              method: 'DELETE'
          });

          if (response.ok) {
              alert('User deleted successfully');
              setIsDeleteModalOpen(false);
              resetForm();
              fetchUsers();
          } else {
              alert('Failed to delete user');
          }
      } catch (error) {
          console.error(error);
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Carlito'] relative">
      <Sidebar />

      <div className="ml-64 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h1 className="text-3xl font-bold text-slate-800">
                Manage <span className="text-red-600">Roles</span>
              </h1>

              <button
                onClick={() => { resetForm(); setIsAddModalOpen(true); }}
                className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-full hover:bg-red-700 transition-colors shadow-sm active:scale-95 transform duration-100"
              >
                 <span className="text-2xl font-bold leading-none mb-0.5">+</span>
                 <span className="text-sm font-bold tracking-wide">Add New User</span>
              </button>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 relative overflow-hidden min-h-[600px]">

               {/* Controls: Search */}
               <div className="flex justify-between items-center mb-8">
                  <div className="relative w-80 h-10 bg-slate-100 rounded-xl flex items-center px-5 border-2 border-transparent focus-within:border-red-500/50 group transition-colors hover:bg-white">
                     <input
                        type="text"
                        placeholder="Search Email or Name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 text-sm"
                     />
                     <svg className="w-4 h-4 text-slate-400 group-focus-within:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                     </svg>
                  </div>
               </div>

               {/* Table Container */}
               <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 h-14 flex items-center px-8 border-b border-slate-200">
                     <div className="w-1/4 text-slate-500 text-xs font-bold uppercase tracking-wider">Name</div>
                     <div className="w-1/3 text-center text-slate-500 text-xs font-bold uppercase tracking-wider">Email</div>
                     <div className="w-1/4 text-center text-slate-500 text-xs font-bold uppercase tracking-wider">Role</div>
                     <div className="w-1/6 text-center text-slate-500 text-xs font-bold uppercase tracking-wider">Action</div>
                  </div>

                  <div>
                     {loading ? (
                         <div className="p-8 text-center text-slate-400">Loading users...</div>
                     ) : filteredUsers.length === 0 ? (
                         <div className="p-8 text-center text-slate-400">No users found.</div>
                     ) : filteredUsers.map((user, index) => (
                        <div key={index} className="flex items-center px-8 py-4 border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                           <div className="w-1/4 text-slate-700 text-sm font-bold">{user.name}</div>
                           <div className="w-1/3 text-center text-slate-600 text-sm font-medium">{user.email}</div>
                           <div className="w-1/4 flex justify-center">
                              <span className={`px-4 py-1 rounded-full border text-xs font-bold ${
                                user.role === 'ADMIN' ? 'bg-cyan-100 text-cyan-800 border-cyan-200' :
                                user.role === 'SUPERADMIN' ? 'bg-red-100 text-red-800 border-red-200' :
                                'bg-slate-100 text-slate-600 border-slate-200'
                              }`}>
                                 {user.role}
                              </span>
                           </div>
                           <div className="w-1/6 flex justify-center gap-3">
                              <button
                                onClick={() => openEditModal(user)}
                                className="p-2 hover:bg-slate-200 rounded-full transition-colors group"
                                title="Edit User"
                              >
                                <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                              </button>
                              <button
                                onClick={() => { setCurrentUser(user); setIsDeleteModalOpen(true); }}
                                className="p-2 hover:bg-red-50 rounded-full transition-colors group"
                                title="Delete User"
                              >
                                <svg className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </main>
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Edit User</h2>
              <p className="text-slate-500 mb-8">Update details for <span className="font-bold text-slate-700">{currentUser?.name}</span></p>

              <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                      <label className="text-slate-800 text-lg font-bold font-['Carlito']">Role</label>
                      <div className="relative">
                          <select
                            name="role_id"
                            value={formData.role_id}
                            onChange={handleInputChange}
                            className="w-full h-12 px-4 bg-white rounded-xl border-2 border-slate-200 focus:border-red-600 focus:outline-none text-slate-800 transition-all shadow-sm appearance-none font-bold"
                          >
                              {roles.map(role => (
                                  <option key={role.id} value={role.id}>{role.name}</option>
                              ))}
                          </select>
                          <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                      </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                      <p className="text-slate-800 text-lg font-bold font-['Carlito'] mb-6">Change Password (Optional)</p>
                      <div className="flex gap-6">
                          <div className="flex-1">
                              <Input
                                label="New Password"
                                type="password"
                                placeholder="••••••••"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                autoComplete="new-password"
                              />
                          </div>
                          <div className="flex-1">
                              <Input
                                label="Confirm New Password"
                                type="password"
                                placeholder="••••••••"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                autoComplete="new-password"
                              />
                          </div>
                      </div>
                  </div>
              </div>

              <div className="flex gap-4 mt-8 pt-6">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 h-12 rounded-xl bg-gray-200 text-slate-600 font-bold text-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUser}
                  className="flex-1 h-12 rounded-xl bg-red-600 text-white font-bold text-lg hover:bg-red-700 transition-colors shadow-lg"
                >
                  Save Changes
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Delete User Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl p-8 relative animate-in zoom-in-95 duration-200 text-center">
              {/* ... same delete modal content ... */}
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Delete User?</h2>
              <p className="text-slate-500 mb-8">Are you sure you want to delete <span className="font-bold text-slate-700">{currentUser?.name}</span>? This action cannot be undone.</p>

              <div className="flex gap-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 h-12 rounded-xl bg-gray-200 text-slate-600 font-bold text-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="flex-1 h-12 rounded-xl bg-red-600 text-white font-bold text-lg hover:bg-red-700 transition-colors shadow-lg"
                >
                  Delete
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
              <h2 className="text-3xl font-bold text-slate-800 mb-8">Add User</h2>

              <div className="flex flex-col gap-6">
                  {/* ... same add user form ... */}
                  <div className="flex gap-6">
                      <div className="flex-1">
                          <Input
                            label="Username"
                            placeholder="Enter username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                          />
                      </div>
                      <div className="flex-1">
                          <div className="flex flex-col gap-2">
                              <label className="text-slate-800 text-lg font-bold font-['Carlito']">Role</label>
                              <div className="relative">
                                  <select
                                    name="role_id"
                                    value={formData.role_id}
                                    onChange={handleInputChange}
                                    className="w-full h-11 px-4 bg-white rounded-xl border border-transparent focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-slate-800 transition-all shadow-sm appearance-none"
                                  >
                                      {roles.map(role => (
                                          <option key={role.id} value={role.id}>{role.name}</option>
                                      ))}
                                  </select>
                                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                  </svg>
                              </div>
                          </div>
                      </div>
                  </div>

                  <Input
                    label="Email"
                    type="email"
                    placeholder="email@telkom.co.id"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />

                  <div className="flex gap-6">
                      <div className="flex-1">
                          <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            autoComplete="new-password"
                          />
                      </div>
                      <div className="flex-1">
                          <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            autoComplete="new-password"
                          />
                      </div>
                  </div>
              </div>

              <div className="flex gap-4 mt-8 justify-end border-t border-slate-100 pt-6">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-gray-500 text-white font-bold text-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-red-600 text-white font-bold text-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                  </svg>
                  Save
                </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default ManageRoles;