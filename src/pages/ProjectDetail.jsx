import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useParams, useNavigate } from 'react-router-dom';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-['Carlito']">
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
                      Project Dummy <span className="text-red-600">#1</span>
                    </h1>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-slate-500 font-bold">#PRJCTCODE123</span>
                      <span className="px-3 py-1 rounded-full bg-lime-100 text-lime-700 text-xs font-bold border border-lime-200">
                        Active
                      </span>
                    </div>
                 </div>
              </div>

              <button 
                onClick={() => navigate(`/projects/${id}/edit`)}
                className="flex items-center gap-3 bg-slate-800 text-white px-6 py-3 rounded-xl hover:bg-slate-900 transition-colors shadow-lg shadow-slate-800/20 group"
              >
                <svg className="w-5 h-5 text-white group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span className="font-bold">Update Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column (2/3 width on large screens) */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Project Info Card */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                     <div className="space-y-1">
                        <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Layanan</label>
                        <p className="text-slate-800 text-xl font-bold">Pijar Sekolah</p>
                     </div>
                     <div className="space-y-1">
                        <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Tanggal Mulai</label>
                        <p className="text-slate-800 text-xl font-bold">26 Januari 2026</p>
                     </div>
                     <div className="space-y-1">
                        <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Witel — Telda</label>
                        <p className="text-slate-800 text-xl font-bold">Bali — Denpasar</p>
                     </div>
                     <div className="space-y-1 md:col-span-2">
                        <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Alamat</label>
                        <p className="text-slate-800 text-xl font-bold leading-relaxed">
                          Jl. Sam Ratulangi II No. 35 RT06/RW08, Kota Denpasar, Provinsi Bali 70988
                        </p>
                     </div>
                  </div>
                </div>

                {/* Revenue & RFS Card */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                      <div className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Target Revenue</label>
                            <p className="text-slate-800 text-xl font-bold">Rp300.000.000,00</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Actual Revenue</label>
                            <p className="text-slate-800 text-xl font-bold">-</p>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Target RFS <span className="text-lime-600 text-xs normal-case bg-lime-100 px-2 py-0.5 rounded-full ml-1">Active</span></label>
                            <p className="text-slate-800 text-xl font-bold">10 Februari 2026</p>
                        </div>
                         <div className="space-y-1">
                            <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Actual RFS <span className="text-lime-600 text-xs normal-case bg-lime-100 px-2 py-0.5 rounded-full ml-1">Active</span></label>
                            <p className="text-slate-800 text-xl font-bold">-</p>
                        </div>
                      </div>
                   </div>
                </div>

                {/* Activity Log (Timeline Style) */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                   <h3 className="text-slate-400 font-bold text-lg uppercase tracking-wide mb-8">Activity Log</h3>
                   <div className="relative">
                      {/* Vertical Line */}
                      <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200"></div>
                      
                      <div className="space-y-10">
                        {[
                          { date: 'Rabu, 21 Januari 2026 - 09:45:23', title: 'Pengetesan', active: true },
                          { date: 'Selasa, 20 Januari 2026 - 09:45:23', title: 'Pemasangan' },
                          { date: 'Senin, 19 Januari 2026 - 09:45:23', title: 'Fiksasi proyek' },
                          { date: 'Kamis, 15 Januari 2026 - 09:45:23', title: 'Survei lokasi dan pengukuran' },
                        ].map((log, idx) => (
                          <div key={idx} className="relative pl-10 group">
                             {/* Timeline Dot */}
                             <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 transition-transform group-hover:scale-125 ${
                               idx === 0 ? 'bg-red-600 ring-4 ring-red-50' : 'bg-slate-300'
                             }`}></div>
                             
                             <div className="flex flex-col gap-1">
                                <span className="text-slate-400 text-sm font-medium tracking-tight">{log.date}</span>
                                <span className={`text-xl font-bold ${idx === 0 ? 'text-slate-800' : 'text-slate-600'}`}>{log.title}</span>
                             </div>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>

              </div>

              {/* Right Column (1/3 width) */}
              <div className="space-y-8">
                
                {/* PIC Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
                   <div className="w-16 h-16 bg-slate-200 rounded-full flex-shrink-0 flex items-center justify-center text-slate-400 font-bold text-xl">
                      DB
                   </div>
                   <div className="flex-1">
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-wide">PIC Project</p>
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
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 min-h-[200px]">
                   <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wide mb-4">Supervisor’s Notes</h3>
                   <div className="flex flex-col items-center justify-center h-32 text-center">
                      <p className="text-slate-400 italic">You don’t have any notes from your supervisor.</p>
                   </div>
                </div>

                {/* Project Milestone (Zig-zag timeline) */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative">
                   <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wide mb-8">Project Milestone</h3>
                   
                   <div className="relative pb-10 pt-12">
                      {/* Curved Connecting Lines */}
                      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none hidden md:block" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ zIndex: 0 }}>
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

                      <div className="space-y-12 relative z-10">
                        {/* Step 1 - Project Planning (Calendar) */}
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

                         {/* Step 2 - Initial Survey (Clipboard) */}
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

                         {/* Step 3 - Project Installation (Checkmark in dashed circle) */}
                        <div className="relative flex flex-row items-center gap-4">
                           <div className="w-16 h-16 rounded-full border-4 border-lime-500 bg-white flex items-center justify-center z-10 shrink-0 text-lime-600 shadow-sm">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeDasharray="4 4"></path>
                              </svg>
                           </div>
                           <div className="flex-1">
                              <p className="text-slate-800 font-bold text-lg">Project Installation</p>
                              <p className="text-xs text-lime-600 font-medium">On Progress</p>
                           </div>
                        </div>

                        {/* Step 4 - Ready for Service (Hand holding gear) */}
                        <div className="relative flex flex-row items-center gap-4 md:flex-row-reverse md:text-right">
                           <div className="w-16 h-16 rounded-full border-4 border-slate-300 bg-white flex items-center justify-center z-10 shrink-0 text-slate-400 shadow-sm">
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectDetail;
