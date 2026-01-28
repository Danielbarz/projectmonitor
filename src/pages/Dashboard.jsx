import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import GanttChart from '../components/GanttChart';
import ProjectMap from '../components/ProjectMap';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-['Carlito']">
      <Sidebar />
      
      <div className="ml-64 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800">
                Dashboard <span className="text-red-600">Project Monitoring</span>
              </h1>
            </div>

            {/* Filters Bar */}
            <div className="bg-slate-800 rounded-2xl p-4 mb-8 flex flex-wrap items-center gap-4 lg:gap-6 shadow-lg">
              {/* Date Filter */}
              <div className="flex flex-col gap-1 min-w-[200px] flex-1">
                <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Start Date | End Date</label>
                <div className="bg-slate-100 rounded-lg h-10 px-4 flex items-center justify-between cursor-pointer hover:bg-white transition-colors group">
                  <span className="text-slate-700 text-sm font-medium">01/03/2025 | 01/06/2025</span>
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>

              {/* Witel Filter */}
              <div className="flex flex-col gap-1 min-w-[140px] flex-1">
                <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Witel</label>
                <div className="bg-slate-100 rounded-lg h-10 px-4 flex items-center justify-between cursor-pointer hover:bg-white transition-colors group">
                  <span className="text-slate-700 text-sm font-medium">All Witel</span>
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>

              {/* Telda Filter */}
              <div className="flex flex-col gap-1 min-w-[140px] flex-1">
                <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Telda</label>
                <div className="bg-slate-100 rounded-lg h-10 px-4 flex items-center justify-between cursor-pointer hover:bg-white transition-colors group">
                  <span className="text-slate-700 text-sm font-medium">All Telda</span>
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>

              {/* Project Filter */}
              <div className="flex flex-col gap-1 min-w-[140px] flex-1">
                <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Project Name</label>
                <div className="bg-slate-100 rounded-lg h-10 px-4 flex items-center justify-between cursor-pointer hover:bg-white transition-colors group">
                  <span className="text-slate-700 text-sm font-medium">All Project</span>
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>

              {/* Search Box */}
              <div className="flex-1 min-w-[240px] self-end">
                <div className="bg-slate-100 h-10 rounded-full px-5 flex items-center justify-between hover:bg-white transition-colors border-2 border-transparent focus-within:border-red-500/50 group">
                  <input 
                    type="text" 
                    placeholder="Search Project Name, PM" 
                    className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder-slate-400"
                  />
                  <svg className="w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
               {[
                 { 
                   label: 'Total Project', 
                   value: '1.287', 
                   color: 'text-amber-500', 
                   border: 'border-amber-500',
                   icon: (
                     <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11l3-3m0 0l-3-3m3 3H9" transform="rotate(-90 12 12) translate(0, -2)"></path>
                     </svg>
                   )
                 },
                 { 
                   label: 'OGP', 
                   value: '937', 
                   color: 'text-teal-500', 
                   border: 'border-teal-500',
                   icon: (
                     <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeDasharray="4 4"></path>
                     </svg>
                   )
                 },
                 { 
                   label: 'JT', 
                   value: '37', 
                   color: 'text-red-600', 
                   border: 'border-red-600',
                   icon: (
                     <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 2h14v5c0 3-3 3-3 5s3 2 3 5v5H5v-5c0-3 3-3 3-5s-3-2-3-5V2z"></path>
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 2h14M5 22h14"></path>
                     </svg>
                   )
                 },
                 { 
                   label: 'Completed', 
                   value: '313', 
                   color: 'text-cyan-500', 
                   border: 'border-cyan-500',
                   icon: (
                     <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                     </svg>
                   )
                 }
               ].map((stat, idx) => (
                 <div key={idx} className={`bg-white rounded-xl p-6 shadow-sm border-l-4 ${stat.border} flex items-center justify-between hover:shadow-md transition-shadow group`}>
                   <div>
                     <p className="text-slate-600 text-sm font-medium mb-1">{stat.label}</p>
                     <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
                   </div>
                   <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center transition-colors group-hover:bg-slate-100">
                      {stat.icon}
                   </div>
                 </div>
               ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Project Status */}
              <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col items-center">
                <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">Project Status</h3>
                <div className="flex items-center justify-center gap-8 w-full">
                  <div className="relative w-40 h-40 flex-shrink-0">
                     {/* Donut Chart using Conic Gradient */}
                     <div 
                        className="w-full h-full rounded-full shadow-inner"
                        style={{
                          background: `conic-gradient(
                            #14b8a6 0% 35%, 
                            #1e293b 35% 60%, 
                            #f59e0b 60% 85%, 
                            #06b6d4 85% 100%
                          )`
                        }}
                     />
                     {/* Inner White Circle (Hole) */}
                     <div className="absolute inset-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-3xl font-bold text-slate-800">987</span>
                     </div>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { label: 'Completed', color: 'bg-teal-500' },
                      { label: 'OSS Provisioning', color: 'bg-slate-800' },
                      { label: 'Fallout', color: 'bg-amber-500' },
                      { label: 'UN SC', color: 'bg-cyan-500' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
                        <span className="text-xs font-medium text-slate-600">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-center text-sm font-medium text-slate-400 mt-6">Order In-Progress</p>
              </div>

              {/* Gauges */}
              {[
                { title: 'Target RFS', value: '44%', delta: '-30', deltaColor: 'text-red-600', ringColor: 'border-red-600' },
                { title: 'Target Revenue', value: '86%', delta: '+23', deltaColor: 'text-teal-500', ringColor: 'border-teal-500' }
              ].map((gauge, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm flex flex-col items-center">
                  <h3 className="text-lg font-bold text-slate-800 mb-6">{gauge.title}</h3>
                  <div className="relative w-48 h-48">
                    <div className="w-full h-full rounded-full border-[12px] border-slate-100"></div>
                    <div className={`absolute top-0 left-0 w-full h-full rounded-full border-[12px] ${gauge.ringColor} border-b-transparent border-l-transparent rotate-[135deg]`}></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-slate-800">{gauge.value}</span>
                      <div className="flex items-center gap-1 mt-1">
                        {gauge.delta.startsWith('-') && (
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                          </svg>
                        )}
                        <span className={`text-sm font-bold ${gauge.deltaColor}`}>{gauge.delta}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Sections Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mapping */}
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-slate-800 rounded-full"></div>
                    <h2 className="text-xl font-bold text-slate-800">Project Mapping</h2>
                 </div>
                 {/* Replaced Image with ProjectMap Component */}
                 <ProjectMap />
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-slate-800 rounded-full"></div>
                    <h2 className="text-xl font-bold text-slate-800">Project Timeline</h2>
                 </div>
                 {/* Replaced with GanttChart Component */}
                 <GanttChart />
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;