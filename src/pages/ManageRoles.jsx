import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Input from '../components/Input';

const ManageRoles = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Mock Data
  const users = [
    { name: 'Alfonsius', email: 'xxxxxxxx@telkom.co.id', role: 'User' },
    { name: 'Beni', email: 'xxxxxxxx@telkom.co.id', role: 'Admin' },
    { name: 'Chandra', email: 'xxxxxxxx@telkom.co.id', role: 'Super User' },
  ];

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
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-full hover:bg-red-700 transition-colors shadow-sm active:scale-95 transform duration-100"
              >
                 <span className="text-2xl font-bold leading-none mb-0.5">+</span>
                 <span className="text-sm font-bold tracking-wide">Add New User</span>
              </button>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 relative overflow-hidden min-h-[600px]">
               
               {/* Controls: Search */}
               <div className="flex justify-between items-center mb-8">
                  {/* Search */}
                  <div className="relative w-80 h-10 bg-slate-100 rounded-full flex items-center px-5 border-2 border-transparent focus-within:border-red-500/50 group transition-colors hover:bg-white">
                     <input 
                        type="text" 
                        placeholder="Cari Email"
                        className="w-full bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 text-sm"
                     />
                     <svg className="w-4 h-4 text-slate-400 group-focus-within:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                     </svg>
                  </div>
               </div>

               {/* Table Container */}
               <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  {/* Table Header */}
                  <div className="bg-slate-50 h-14 flex items-center px-8 border-b border-slate-200">
                     <div className="w-1/4 text-slate-500 text-xs font-bold uppercase tracking-wider">Name</div>
                     <div className="w-1/3 text-center text-slate-500 text-xs font-bold uppercase tracking-wider">Email</div>
                     <div className="w-1/4 text-center text-slate-500 text-xs font-bold uppercase tracking-wider">Role</div>
                     <div className="w-1/6 text-center text-slate-500 text-xs font-bold uppercase tracking-wider">Action</div>
                  </div>

                  {/* Table Body */}
                  <div>
                     {users.map((user, index) => (
                        <div key={index} className="flex items-center px-8 py-4 border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                           <div className="w-1/4 text-slate-700 text-sm font-bold">{user.name}</div>
                           <div className="w-1/3 text-center text-slate-600 text-sm font-medium">{user.email}</div>
                           <div className="w-1/4 flex justify-center">
                              <span className={`px-4 py-1 rounded-full border text-xs font-bold ${
                                user.role === 'Admin' ? 'bg-cyan-100 text-cyan-800 border-cyan-200' :
                                user.role === 'Super User' ? 'bg-red-100 text-red-800 border-red-200' :
                                'bg-slate-100 text-slate-600 border-slate-200'
                              }`}>
                                 {user.role}
                              </span>
                           </div>
                           <div className="w-1/6 flex justify-center gap-3">
                              <button 
                                onClick={() => setIsEditModalOpen(true)}
                                className="p-2 hover:bg-slate-200 rounded-full transition-colors group"
                              >
                                <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                              </button>
                              <button className="p-2 hover:bg-red-50 rounded-full transition-colors group">
                                <svg className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Pagination */}
               <div className="mt-8 flex justify-between items-center border-t border-slate-200 pt-6">
                  <span className="text-slate-500 text-sm">Showing <span className="font-bold text-slate-700">1</span> to <span className="font-bold text-slate-700">3</span> of <span className="font-bold text-slate-700">100</span> entries</span>
                  
                  <div className="flex items-center gap-2">
                     <button className="px-3 py-1 text-sm border border-slate-300 rounded-md bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50">Prev</button>
                     <div className="flex gap-1">
                        <button className="px-3 py-1 text-sm rounded-md bg-slate-800 text-white font-bold">1</button>
                        <button className="px-3 py-1 text-sm rounded-md hover:bg-slate-200 text-slate-600">2</button>
                        <button className="px-3 py-1 text-sm rounded-md hover:bg-slate-200 text-slate-600">3</button>
                     </div>
                     <button className="px-3 py-1 text-sm border border-slate-300 rounded-md bg-white text-slate-600 hover:bg-slate-50">Next</button>
                  </div>
               </div>

            </div>
          </div>
        </main>
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
              <h2 className="text-3xl font-bold text-slate-800 mb-8">Edit User</h2>
              
              <div className="flex flex-col gap-6">
                  <div className="flex gap-6">
                      <div className="flex-1">
                          <Input label="Username" placeholder="Alfonsius" />
                      </div>
                      <div className="flex-1">
                          <div className="flex flex-col gap-2">
                              <label className="text-slate-800 text-lg font-bold font-['Carlito']">Role</label>
                              <div className="relative">
                                  <select className="w-full h-11 px-4 bg-white rounded-xl border border-transparent focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-slate-800 transition-all shadow-sm appearance-none">
                                      <option>User</option>
                                      <option>Admin</option>
                                      <option>Super User</option>
                                  </select>
                                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                  </svg>
                              </div>
                          </div>
                      </div>
                  </div>

                  <Input label="Email" type="email" placeholder="Alfonsius@telkom.co.id" />
                  
                  <div className="pt-4 border-t border-slate-100">
                      <p className="text-slate-800 text-lg font-bold font-['Carlito'] mb-6">Change Password (Optional)</p>
                      <div className="flex gap-6">
                          <div className="flex-1">
                              <Input label="Password" type="password" placeholder="••••••••" />
                          </div>
                          <div className="flex-1">
                              <Input label="Confirm Password" type="password" placeholder="••••••••" />
                          </div>
                      </div>
                  </div>
              </div>
              
              <div className="flex gap-4 mt-8 justify-end border-t border-slate-100 pt-6">
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-gray-500 text-white font-bold text-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
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

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
              <h2 className="text-3xl font-bold text-slate-800 mb-8">Add User</h2>
              
              <div className="flex flex-col gap-6">
                  <div className="flex gap-6">
                      <div className="flex-1">
                          <Input label="Username" placeholder="Enter username" />
                      </div>
                      <div className="flex-1">
                          <div className="flex flex-col gap-2">
                              <label className="text-slate-800 text-lg font-bold font-['Carlito']">Role</label>
                              <div className="relative">
                                  <select className="w-full h-11 px-4 bg-white rounded-xl border border-transparent focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-slate-800 transition-all shadow-sm appearance-none">
                                      <option>User</option>
                                      <option>Admin</option>
                                      <option>Super User</option>
                                  </select>
                                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                  </svg>
                              </div>
                          </div>
                      </div>
                  </div>

                  <Input label="Email" type="email" placeholder="email@telkom.co.id" />
                  
                  <div className="flex gap-6">
                      <div className="flex-1">
                          <Input label="Password" type="password" placeholder="••••••••" />
                      </div>
                      <div className="flex-1">
                          <Input label="Confirm Password" type="password" placeholder="••••••••" />
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
                  onClick={() => setIsAddModalOpen(false)}
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