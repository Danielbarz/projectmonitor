import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock states for editable fields
  const [actualRevenue, setActualRevenue] = useState('');
  const [actualRFS, setActualRFS] = useState('');
  
  // Modal States
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [milestoneStatus, setMilestoneStatus] = useState('On Progress');

  return (
    <div className="min-h-screen bg-slate-50 font-['Carlito'] relative">
      <Sidebar />
      
      <div className="ml-64 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div className="flex items-start gap-4">
                 <button onClick={() => navigate(-1)} className="mt-2 p-2 hover:bg-slate-200 rounded-full transition-colors group">
                   <svg className="w-6 h-6 text-slate-600 group-hover:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                   </svg>
                 </button>
                 <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                      Update Project
                    </h1>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-slate-500 font-bold">#PRJCTCODE123</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        milestoneStatus === 'Fallout' 
                          ? 'bg-red-100 text-red-700 border-red-200' 
                          : milestoneStatus === 'Finished'
                            ? 'bg-slate-100 text-slate-600 border-slate-200'
                            : 'bg-lime-100 text-lime-700 border-lime-200'
                      }`}>
                        {milestoneStatus === 'Fallout' ? 'Dropped' : (milestoneStatus === 'Finished' ? 'Closed' : 'Active')}
                      </span>
                    </div>
                 </div>
              </div>

              <div className="flex gap-4">
                <button className="flex items-center justify-center gap-3 h-14 px-8 rounded-2xl bg-zinc-300 text-white text-xl font-bold hover:bg-zinc-400 transition-colors group">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                    </svg>
                    Save Draft
                </button>
                <button className="flex items-center gap-3 bg-red-600 text-white px-8 h-14 rounded-2xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 group">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                    </svg>
                    <span className="font-bold text-xl">Save Update</span>
                </button>
              </div>
            </div>

            {/* Project Title Placeholder */}
            <div className="mb-8">
               <h2 className="text-4xl font-bold text-slate-800">Project Dummy <span className="text-red-600">#1</span></h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Fixed Info Display */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                     <div className="space-y-1">
                        <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Service</label>
                        <p className="text-slate-800 text-xl font-bold">Pijar Sekolah</p>
                     </div>
                     <div className="space-y-1">
                        <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Start Date</label>
                        <p className="text-slate-800 text-xl font-bold">26 Januari 2026</p>
                     </div>
                     <div className="space-y-1">
                        <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Witel — Telda</label>
                        <p className="text-slate-800 text-xl font-bold">Bali — Denpasar</p>
                     </div>
                     <div className="space-y-1 md:col-span-2">
                        <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Address</label>
                        <p className="text-slate-800 text-xl font-bold leading-relaxed">
                          Jl. Sam Ratulangi II No. 35 RT06/RW08, Kota Denpasar, Provinsi Bali 70988
                        </p>
                     </div>
                  </div>
                </div>

                {/* Editable Revenue & RFS Card */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                      <div className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Target Revenue</label>
                            <p className="text-slate-800 text-xl font-bold">Rp300.000.000,00</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Actual Revenue</label>
                            <input 
                                type="text"
                                value={actualRevenue}
                                onChange={(e) => setActualRevenue(e.target.value)}
                                className="w-full h-10 px-4 bg-slate-100 rounded-lg border-none outline-none focus:ring-2 focus:ring-red-500 transition-all text-slate-800 font-bold"
                                placeholder="Enter actual revenue"
                            />
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Target RFS <span className="text-lime-600 text-xs normal-case bg-lime-100 px-2 py-0.5 rounded-full ml-1">Active</span></label>
                            <p className="text-slate-800 text-xl font-bold">10 Februari 2026</p>
                        </div>
                         <div className="space-y-2">
                            <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Actual RFS <span className="text-lime-600 text-xs normal-case bg-lime-100 px-2 py-0.5 rounded-full ml-1">Active</span></label>
                            <input 
                                type="date"
                                value={actualRFS}
                                onChange={(e) => setActualRFS(e.target.value)}
                                className="w-full h-10 px-4 bg-slate-100 rounded-lg border-none outline-none focus:ring-2 focus:ring-red-500 transition-all text-slate-800 font-bold"
                            />
                        </div>
                      </div>
                   </div>
                </div>

                {/* Activity Log / Description with "Add New Notes" */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative min-h-[400px]">
                   <h3 className="text-slate-400 font-bold text-lg uppercase tracking-wide mb-8">Description</h3>
                   <div className="relative pb-24">
                      {/* Vertical Line */}
                      <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-800/10"></div>

                      <div className="space-y-10">
                        {[
                          { date: 'Rabu, 21 Januari 2026 - 09:45:23', title: 'Pengetesan' },
                          { date: 'Selasa, 20 Januari 2026 - 09:45:23', title: 'Pemasangan' },
                          { date: 'Senin, 19 Januari 2026 - 09:45:23', title: 'Fiksasi proyek' },
                          { date: 'Kamis, 15 Januari 2026 - 09:45:23', title: 'Survei lokasi dan pengukuran' },
                        ].map((log, idx) => (
                          <div key={idx} className="relative pl-10 group">
                             <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-slate-800 border-4 border-white shadow-sm z-10 transition-transform group-hover:scale-125"></div>
                             <div className="flex flex-col gap-1">
                                <span className="text-slate-400 text-sm font-medium tracking-tight">{log.date}</span>
                                <span className="text-xl font-bold text-slate-800">{log.title}</span>
                             </div>
                          </div>
                        ))}
                      </div>
                   </div>
                   
                   {/* Add New Notes Button */}
                   <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                      <button 
                        onClick={() => setIsNoteModalOpen(true)}
                        className="flex items-center gap-3 bg-slate-800 text-white px-8 py-3 rounded-xl hover:bg-slate-900 transition-colors shadow-lg"
                      >
                        <span className="text-2xl font-bold">+</span>
                        <span className="font-bold text-lg">Add New Notes</span>
                      </button>
                   </div>
                </div>

              </div>

              {/* Right Column */}
              <div className="space-y-8">
                
                {/* PIC Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
                   <div className="w-16 h-16 bg-slate-200 rounded-full flex-shrink-0"></div>
                   <div className="flex-1">
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-wide">PIC</p>
                      <p className="text-slate-800 text-xl font-bold">Daniel Bara</p>
                   </div>
                   <div className="flex gap-2">
                      <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-red-600">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                         </svg>
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-red-600">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                         </svg>
                      </button>
                   </div>
                </div>

                {/* Supervisor Notes */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 min-h-[128px]">
                   <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wide mb-4">Supervisor’s Notes</h3>
                   <div className="text-center py-4">
                      <p className="text-slate-300 text-xs italic">You don’t have any notes from your supervisor.</p>
                   </div>
                </div>

                {/* Project Milestone with "Edit Milestone" */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative pb-24">
                   <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wide mb-8">Project Milestone</h3>
                   
                   <div className="relative pt-12">
                      {/* Curved Connecting Lines */}
                      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none hidden md:block" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ zIndex: 0 }}>
                        {/* Path 1: Planning -> Survey (Green) */}
                        <path 
                          d="M 6 14 L 6 20 Q 6 28 14 28 L 86 28 Q 94 28 94 36 L 94 39" 
                          fill="none" 
                          stroke="#84cc16" 
                          strokeWidth="2" 
                          strokeDasharray="8 6"
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                        />
                        {/* Path 2: Survey -> Installation (Green) */}
                        <path 
                          d="M 94 39 L 94 45 Q 94 53 86 53 L 14 53 Q 6 53 6 61 L 6 64" 
                          fill="none" 
                          stroke="#84cc16" 
                          strokeWidth="2" 
                          strokeDasharray="8 6"
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                        />
                        {/* Path 3: Installation -> RFS (Gray) */}
                        <path 
                          d="M 6 64 L 6 70 Q 6 78 14 78 L 86 78 Q 94 78 94 86 L 94 89" 
                          fill="none" 
                          stroke="#cbd5e1" 
                          strokeWidth="2" 
                          strokeDasharray="8 6"
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>

                      <div className="space-y-10 relative z-10">
                        <div className="relative flex flex-row items-center gap-4">
                           <div className="w-12 h-12 rounded-full border-4 border-lime-500 bg-white flex items-center justify-center z-10 shrink-0 text-lime-600 shadow-sm">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                           </div>
                           <div className="flex-1">
                              <p className="text-slate-800 font-bold text-base">Project Planning</p>
                              <p className="text-[10px] text-lime-600">Finished <span className="text-slate-400">at 28 Aug 2025</span></p>
                           </div>
                        </div>

                        <div className="relative flex flex-row items-center gap-4 md:flex-row-reverse md:text-right">
                           <div className="w-12 h-12 rounded-full border-4 border-lime-500 bg-white flex items-center justify-center z-10 shrink-0 text-lime-600 shadow-sm">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                              </svg>
                           </div>
                           <div className="flex-1">
                              <p className="text-slate-800 font-bold text-base">Initial Survey</p>
                              <p className="text-[10px] text-lime-600">Finished <span className="text-slate-400">at 28 Aug 2025</span></p>
                           </div>
                        </div>

                        <div className="relative flex flex-row items-center gap-4">
                           <div className="w-12 h-12 rounded-full border-4 border-lime-500 bg-white flex items-center justify-center z-10 shrink-0 text-lime-600 shadow-sm">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeDasharray="4 4"></path>
                              </svg>
                           </div>
                           <div className="flex-1">
                              <p className="text-slate-800 font-bold text-base">Project Installation</p>
                              <p className="text-[10px] text-lime-600">On Progress</p>
                           </div>
                        </div>

                        <div className="relative flex flex-row items-center gap-4 md:flex-row-reverse md:text-right">
                           <div className="w-12 h-12 rounded-full border-4 border-slate-300 bg-white flex items-center justify-center z-10 shrink-0 opacity-50 text-slate-400 shadow-sm">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              </svg>
                           </div>
                           <div className="flex-1">
                              <p className="text-slate-800 font-bold text-base">Ready for Service</p>
                              <p className="text-[10px] text-slate-400">Not done yet</p>
                           </div>
                        </div>
                   </div>
                </div>

                   {/* Edit Milestone Button */}
                   <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full px-6">
                      <button 
                        onClick={() => setIsMilestoneModalOpen(true)}
                        className="w-full flex items-center justify-center gap-3 bg-slate-800 text-white py-3 rounded-xl hover:bg-slate-900 transition-colors shadow-lg"
                      >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        <span className="font-bold">Edit Milestone</span>
                      </button>
                   </div>
                </div>

              </div>
            </div>
          </div>
        </main>
      </div>

      {/* New Note Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">New Note</h2>
              
              <textarea 
                className="w-full h-40 bg-slate-50 rounded-xl p-4 text-slate-800 placeholder-slate-400 text-lg border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none resize-none mb-8"
                placeholder="Write your note here ..."
              ></textarea>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsNoteModalOpen(false)}
                  className="flex-1 h-12 rounded-xl border-2 border-slate-300 text-slate-500 font-bold text-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setIsNoteModalOpen(false)}
                  className="flex-1 flex items-center justify-center gap-3 h-12 rounded-xl bg-red-600 text-white font-bold text-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 group"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                  </svg>
                  Save
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Edit Milestone Modal */}
      {isMilestoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl p-8 relative animate-in zoom-in-95 duration-200 flex flex-col md:flex-row gap-8 max-h-[90vh] overflow-y-auto">
              
              {/* Left Side: Form */}
              <div className="flex-1 flex flex-col">
                  <h2 className="text-4xl font-bold text-slate-800 mb-8">Edit Milestone</h2>
                  
                  <div className="space-y-6 flex-1">
                      <div className="space-y-2">
                          <label className="text-slate-500 text-xl font-bold">Milestone</label>
                          <div className="relative">
                              <select className="w-full h-12 px-4 bg-slate-100 rounded-lg border-none outline-none appearance-none text-slate-700 font-bold text-lg">
                                  <option>Ready for Service</option>
                                  <option>Project Installation</option>
                                  <option>Initial Survey</option>
                                  <option>Project Planning</option>
                              </select>
                              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                              </svg>
                          </div>
                      </div>

                      <div className="space-y-2">
                          <label className="text-slate-500 text-xl font-bold">Status</label>
                          <div className="relative">
                              <select 
                                value={milestoneStatus}
                                onChange={(e) => setMilestoneStatus(e.target.value)}
                                className="w-full h-12 px-4 bg-slate-100 rounded-lg border-none outline-none appearance-none text-slate-700 font-bold text-lg"
                              >
                                  <option value="On Progress">On Progress</option>
                                  <option value="Finished">Finished</option>
                                  <option value="Not Started">Not Started</option>
                                  <option value="Fallout">Fallout</option>
                              </select>
                              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                              </svg>
                          </div>
                      </div>

                      <div className="space-y-2">
                          <label className="text-slate-500 text-xl font-bold">Finished at</label>
                          <input type="date" className="w-full h-12 px-4 bg-slate-100 rounded-lg border-none outline-none text-slate-700 font-bold text-lg" />
                      </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                      <button 
                        onClick={() => setIsMilestoneModalOpen(false)}
                        className="flex-1 h-14 rounded-2xl bg-gray-500 text-white font-bold text-xl hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                         onClick={() => setIsMilestoneModalOpen(false)}
                         className="flex-1 h-14 rounded-2xl bg-red-600 text-white font-bold text-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 group"
                      >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                        </svg>
                        Save
                      </button>
                  </div>
              </div>

              <div className="flex-1 border-l border-slate-200 pl-8 hidden md:block relative pt-12">
                   {/* Curved Connecting Lines */}
                   <svg className="absolute top-8 left-8 w-[calc(100%-4rem)] h-[calc(100%-4rem)] pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ zIndex: 0 }}>
                        {/* Path 1: Planning -> Survey (Green) */}
                        <path 
                          d="M 8 14 L 8 20 Q 8 28 16 28 L 84 28 Q 92 28 92 36 L 92 39" 
                          fill="none" 
                          stroke="#84cc16" 
                          strokeWidth="2" 
                          strokeDasharray="8 6"
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                        />
                        {/* Path 2: Survey -> Installation (Green) */}
                        <path 
                          d="M 92 39 L 92 45 Q 92 53 84 53 L 16 53 Q 8 53 8 61 L 8 64" 
                          fill="none" 
                          stroke="#84cc16" 
                          strokeWidth="2" 
                          strokeDasharray="8 6"
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                        />
                        {/* Path 3: Installation -> RFS (Gray) */}
                        <path 
                          d="M 8 64 L 8 70 Q 8 78 16 78 L 84 78 Q 92 78 92 86 L 92 89" 
                          fill="none" 
                          stroke="#cbd5e1" 
                          strokeWidth="2" 
                          strokeDasharray="8 6"
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                        />
                   </svg>

                   <div className="space-y-12 py-8 pr-4 relative z-10">
                        {/* Project Planning */}
                        <div className="relative flex flex-row items-center gap-4">
                           <div className="w-16 h-16 rounded-full border-4 border-lime-500 bg-white flex items-center justify-center z-10 shrink-0 text-lime-600 shadow-sm">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                           </div>
                           <div className="flex-1">
                              <p className="text-slate-800 font-bold text-lg">Project Planning</p>
                              <p className="text-xs text-lime-600 font-medium">Finished <span className="text-slate-400">at 28 Aug 2025</span></p>
                           </div>
                        </div>

                         {/* Initial Survey */}
                        <div className="relative flex flex-row items-center gap-4 md:flex-row-reverse md:text-right">
                           <div className="w-16 h-16 rounded-full border-4 border-lime-500 bg-white flex items-center justify-center z-10 shrink-0 text-lime-600 shadow-sm">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                              </svg>
                           </div>
                           <div className="flex-1">
                              <p className="text-slate-800 font-bold text-lg">Initial Survey</p>
                              <p className="text-xs text-lime-600 font-medium">Finished <span className="text-slate-400">at 28 Aug 2025</span></p>
                           </div>
                        </div>

                         {/* Project Installation */}
                        <div className="relative flex flex-row items-center gap-4">
                           <div className={`w-16 h-16 rounded-full border-4 bg-white flex items-center justify-center z-10 shrink-0 shadow-sm ${
                             milestoneStatus === 'Fallout' 
                               ? 'border-red-500 text-red-600' 
                               : 'border-lime-500 text-lime-600'
                           }`}>
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                 {milestoneStatus === 'Fallout' ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                 ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeDasharray="4 4"></path>
                                 )}
                              </svg>
                           </div>
                           <div className="flex-1">
                              <p className="text-slate-800 font-bold text-lg">Project Installation</p>
                              <p className={`text-xs font-medium ${
                                milestoneStatus === 'Fallout' ? 'text-red-600' : 'text-lime-600'
                              }`}>
                                {milestoneStatus === 'Fallout' ? 'Cancelled' : milestoneStatus}
                              </p>
                           </div>
                        </div>

                        {/* Ready for Service */}
                        <div className="relative flex flex-row items-center gap-4 md:flex-row-reverse md:text-right">
                           <div className="w-16 h-16 rounded-full border-4 border-neutral-400 bg-white flex items-center justify-center z-10 shrink-0 text-slate-400 shadow-sm">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              </svg>
                           </div>
                           <div className="flex-1">
                              <p className="text-slate-800 font-bold text-lg">Ready for Service</p>
                              <p className="text-xs text-slate-400 font-medium">Not done yet</p>
                           </div>
                        </div>
                   </div>
              </div>

           </div>
        </div>
      )}

    </div>
  );
};

export default UpdateProject;

