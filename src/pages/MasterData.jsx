import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const MasterData = () => {
  const [activeTab, setActiveTab] = useState('projectManagers'); // 'projectManagers' | 'accountOfficers'

  // Mock Data
  const data = [
    { name: 'Alfonsius', nipnas: 'xxxxxxxx', segment: 'Regional', city: 'Surabaya', witel: 'SURAMADU' },
    { name: 'Alfonsius', nipnas: 'xxxxxxxx', segment: 'Regional', city: 'Surabaya', witel: 'SURAMADU' },
    { name: 'Alfonsius', nipnas: 'xxxxxxxx', segment: 'Regional', city: 'Surabaya', witel: 'SURAMADU' },
    { name: 'Alfonsius', nipnas: 'xxxxxxxx', segment: 'Regional', city: 'Surabaya', witel: 'SURAMADU' },
    { name: 'Alfonsius', nipnas: 'xxxxxxxx', segment: 'Regional', city: 'Surabaya', witel: 'SURAMADU' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-['Carlito']">
      <Sidebar />
      
      <div className="ml-64 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h1 className="text-3xl font-bold text-slate-800">
                Master <span className="text-red-600">Data</span>
              </h1>
              
              <button className="flex items-center gap-2 bg-slate-800 text-white rounded-full px-6 py-2.5 hover:bg-slate-900 transition-colors shadow-sm active:scale-95 transform duration-100">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                <span className="text-sm font-bold tracking-wide">Edit Master Data</span>
              </button>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-2xl p-8 pt-6 shadow-sm border border-slate-200 relative overflow-hidden min-h-[750px]">
               {/* Red Blur Background Effect */}
               <div className={`absolute top-0 w-48 h-24 bg-red-600/5 blur-[25px] transition-all duration-500 rounded-b-full pointer-events-none ${
                 activeTab === 'projectManagers' ? 'left-4' : 'left-[220px]'
               }`}></div>

               {/* Tabs */}
               <div className="flex gap-12 mb-8 border-b-2 border-neutral-100 pb-2 relative z-10">
                  <button 
                    onClick={() => setActiveTab('projectManagers')}
                    className={`text-2xl font-bold pb-2 relative transition-colors ${activeTab === 'projectManagers' ? 'text-red-600' : 'text-slate-800'}`}
                  >
                    Project Managers
                    {activeTab === 'projectManagers' && (
                        <div className="absolute bottom-[-10px] left-0 w-full h-1 bg-red-600 rounded-t-full shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"></div>
                    )}
                  </button>
                  <button 
                    onClick={() => setActiveTab('accountOfficers')}
                    className={`text-2xl font-bold pb-2 relative transition-colors ${activeTab === 'accountOfficers' ? 'text-red-600' : 'text-slate-800'}`}
                  >
                    Account Officers
                    {activeTab === 'accountOfficers' && (
                        <div className="absolute bottom-[-10px] left-0 w-full h-1 bg-red-600 rounded-t-full shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"></div>
                    )}
                  </button>
               </div>

               {/* Controls: Search and Add */}
               <div className="flex justify-between items-center mb-8">
                  {/* Search */}
                  <div className="relative w-80 h-12 bg-slate-100 rounded-2xl flex items-center px-6 border-2 border-transparent focus-within:border-red-500/50 group transition-colors hover:bg-white">
                     <input 
                        type="text" 
                        placeholder="Cari Nama / NIPNAS"
                        className="w-full bg-transparent border-none outline-none text-slate-700 font-bold placeholder-slate-400 text-lg"
                     />
                     <svg className="w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                     </svg>
                  </div>

                  {/* Add New Button */}
                  <button className="flex items-center gap-3 bg-red-600 text-white pl-4 pr-6 py-2.5 rounded-full hover:bg-red-700 transition-colors shadow-lg active:scale-95 transform duration-100">
                     <span className="text-3xl font-bold leading-none pb-1">+</span>
                     <span className="text-lg font-bold">Insert New Data</span>
                  </button>
               </div>

               {/* Table Container */}
               <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                  {/* Table Header */}
                  <div className="bg-slate-50 h-16 flex items-center px-8 border-b border-neutral-200">
                     <div className="w-1/5 text-slate-500 text-sm font-bold uppercase tracking-wider">Nama PO</div>
                     <div className="w-1/5 text-slate-500 text-sm font-bold uppercase tracking-wider">Nipnas</div>
                     <div className="w-1/5 text-slate-500 text-sm font-bold uppercase tracking-wider">Segment</div>
                     <div className="w-1/5 text-slate-500 text-sm font-bold uppercase tracking-wider">Bill City</div>
                     <div className="w-1/5 text-slate-500 text-sm font-bold uppercase tracking-wider">Witel</div>
                     <div className="w-20 text-center text-slate-500 text-sm font-bold uppercase tracking-wider">Aksi</div>
                  </div>

                  {/* Table Body */}
                  <div>
                     {data.map((item, index) => (
                        <div key={index} className="flex items-center px-8 py-4 border-b border-neutral-100 hover:bg-slate-50/80 transition-colors">
                           <div className="w-1/5 text-slate-800 text-lg font-bold">{item.name}</div>
                           <div className="w-1/5 text-slate-600 text-lg font-normal">{item.nipnas}</div>
                           <div className="w-1/5">
                              <span className="px-4 py-1 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200 text-sm font-bold">
                                 {item.segment}
                              </span>
                           </div>
                           <div className="w-1/5 text-slate-600 text-lg font-normal">{item.city}</div>
                           <div className="w-1/5 text-slate-600 text-lg font-normal">{item.witel}</div>
                           <div className="w-20 flex justify-center">
                              <button className="p-2 hover:bg-red-50 rounded-full group transition-colors">
                                <svg className="w-5 h-5 text-slate-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                  <span className="text-slate-500 text-sm font-bold">Showing <span className="font-bold text-slate-800">1</span> to <span className="font-bold text-slate-800">5</span> of <span className="font-bold text-slate-800">100</span> entries</span>
                  
                  <div className="flex items-center gap-2">
                     <button className="px-3 py-1 text-sm border border-slate-300 rounded-md bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50">Prev</button>
                     <div className="flex gap-1">
                        <button className="px-3 py-1 text-sm rounded-md bg-slate-800 text-white font-bold">1</button>
                        <button className="px-3 py-1 text-sm rounded-md hover:bg-slate-200 text-slate-600 font-bold">2</button>
                        <button className="px-3 py-1 text-sm rounded-md hover:bg-slate-200 text-slate-600 font-bold">3</button>
                     </div>
                     <button className="px-3 py-1 text-sm border border-slate-300 rounded-md bg-white text-slate-600 hover:bg-slate-50">Next</button>
                  </div>
               </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MasterData;