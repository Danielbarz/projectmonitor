import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Link, useNavigate } from 'react-router-dom';
import DateRangePicker from '../components/DateRangePicker';

const AllProjects = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('2025-01-03');
  const [endDate, setEndDate] = useState('2025-01-06');

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Mock Data
  const projects = Array(8).fill(null).map((_, i) => ({
    id: `ORD02-29183${i}`,
    date: '25 Jan 2026',
    service: 'HSI BISNIS 67mbps',
    address: 'Jl. Mulyosari Selatan No. 32, Surabaya',
    status: 'OGP'
  }));

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Carlito']">
      <Sidebar />
      
      <div className="ml-64 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h1 className="text-3xl font-bold text-slate-800">
                All <span className="text-red-600">Projects</span>
              </h1>
              
              <Link to="/projects/new" className="flex items-center gap-2 bg-red-600 text-white rounded-full px-6 py-2.5 hover:bg-red-700 transition-colors shadow-sm active:scale-95 transform duration-100">
                <span className="text-2xl font-bold leading-none mb-0.5">+</span>
                <span className="text-sm font-bold tracking-wide">Add New Project</span>
              </Link>
            </div>

            {/* Filter Section (Reused Style) */}
            <div className="bg-slate-800 rounded-2xl p-4 mb-8 flex flex-wrap items-center gap-4 shadow-lg">
               {/* Date Filter */}
               <DateRangePicker startDate={startDate} endDate={endDate} onChange={handleDateChange} />

              {/* Witel & Telda Filter */}
              {['Witel', 'Telda'].map((label) => (
                <div key={label} className="flex flex-col gap-1 min-w-[140px] flex-1">
                  <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">{label}</label>
                  <div className="bg-slate-100 rounded-lg h-10 px-4 flex items-center justify-between cursor-pointer hover:bg-white transition-colors group">
                    <span className="text-slate-700 text-sm font-medium">All {label}</span>
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              ))}

              {/* Search Box */}
              <div className="flex-1 min-w-[240px] self-end">
                <div className="bg-slate-100 h-10 rounded-full px-5 flex items-center justify-between hover:bg-white transition-colors focus-within:ring-2 focus-within:ring-red-500/50 group">
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

            {/* Data Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      {['Order ID', 'Input Date', 'Service', 'Address', 'Status', ''].map((head, i) => (
                        <th key={i} className={`px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap ${i === 5 ? 'w-16' : ''}`}>
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {projects.map((project, index) => (
                      <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-slate-700">{project.id}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{project.date}</td>
                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">{project.service}</td>
                        <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate" title={project.address}>{project.address}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 border border-cyan-200">
                            {project.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right w-16">
                          <button 
                            onClick={() => handleProjectClick(project.id)}
                            className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer group"
                          >
                             <svg className="w-5 h-5 text-slate-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                             </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-sm text-slate-500">Showing <span className="font-bold">1</span> to <span className="font-bold">8</span> of <span className="font-bold">100</span> entries</span>
                
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 text-sm border border-slate-300 rounded-md bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50">Prev</button>
                  <div className="flex gap-1">
                    <button className="px-3 py-1 text-sm rounded-md bg-red-600 text-white font-medium">1</button>
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
    </div>
  );
};

export default AllProjects;