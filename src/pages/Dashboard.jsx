import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import GanttChart from '../components/GanttChart';
import ProjectMap from '../components/ProjectMap';
import DateRangePicker from '../components/DateRangePicker';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { token } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Projects
    if (!token) return;

    fetch('http://localhost:5000/api/projects', {
        headers: { Authorization: token }
    })
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch');
            return res.json();
        })
        .then(data => {
            if (Array.isArray(data)) {
                setAllProjects(data);
            }
            setLoading(false);
        })
        .catch(err => {
            console.error('Error fetching projects:', err);
            setLoading(false);
        });
  }, [token]);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Filter Logic
  const filteredProjects = useMemo(() => {
    return allProjects.filter(p => {
        const matchesSearch = p.order_id?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             p.lokasi?.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (!startDate || !endDate) return matchesSearch;
        
        const projectDate = new Date(p.input_date || p.created_at);
        const start = new Date(startDate);
        const end = new Date(endDate);
        // Reset time for fair comparison
        projectDate.setHours(0,0,0,0);
        start.setHours(0,0,0,0);
        end.setHours(0,0,0,0);

        const matchesDate = projectDate >= start && projectDate <= end;
        return matchesSearch && matchesDate;
    });
  }, [allProjects, searchQuery, startDate, endDate]);

  // Dynamic Stats Calculation
  const stats = useMemo(() => {
    const total = filteredProjects.length;
    const completed = filteredProjects.filter(p => p.status_name === 'Completed').length;
    const jt = filteredProjects.filter(p => p.status_name === 'JT').length;
    const cancelled = filteredProjects.filter(p => p.status_name === 'Cancelled').length;
    const ogp = total - completed - jt - cancelled;
    
    const on_time_rfs = filteredProjects.filter(p => {
        if (!p.actual_rfs || !p.target_rfs) return false;
        return new Date(p.actual_rfs) <= new Date(p.target_rfs);
    }).length;

    return { total_projects: total, completed, jt, ogp, on_time_rfs };
  }, [filteredProjects]);

  const onTimePercentage = stats.completed > 0 ? Math.round((stats.on_time_rfs / stats.completed) * 100) : 0;
  const achievedPercentage = stats.total_projects > 0 ? Math.round((stats.completed / stats.total_projects) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 font-['Carlito']">
      <Sidebar />
      
      <div className="ml-64 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800">
                Dashboard <span className="text-red-600">Project Monitoring</span>
              </h1>
            </div>

            {/* Filters Bar (Compact) */}
            <div className="bg-slate-800 rounded-2xl p-3 mb-8 flex items-center justify-between gap-4 shadow-lg">
              <div className="w-60">
                <DateRangePicker startDate={startDate} endDate={endDate} onChange={handleDateChange} />
              </div>

              <div className="w-full max-w-xs">
                <div className="bg-slate-100 h-10 rounded-full px-5 flex items-center justify-between hover:bg-white transition-colors border-2 border-transparent focus-within:border-red-500/50 group">
                  <input 
                    type="text" 
                    placeholder="Search Order ID, Location..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder-slate-400"
                  />
                  <svg className="w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            {loading ? (
                <div className="py-20 text-center text-slate-400 font-bold animate-pulse">Loading dashboard data...</div>
            ) : (
                <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                   {[
                     { 
                       label: 'Total Project', 
                       value: stats.total_projects, 
                       color: 'text-amber-700', 
                       border: 'border-amber-500', 
                       grad: 'from-white to-amber-100',
                       icon: (
                         <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                         </svg>
                       )
                     },
                     { 
                       label: 'OGP', 
                       value: stats.ogp, 
                       color: 'text-teal-700', 
                       border: 'border-teal-500', 
                       grad: 'from-white to-teal-100',
                       icon: (
                         <svg className="w-12 h-12 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeDasharray="4 4"></path>
                         </svg>
                       )
                     },
                     { 
                       label: 'JT', 
                       value: stats.jt, 
                       color: 'text-red-700', 
                       border: 'border-red-600', 
                       grad: 'from-white to-red-100',
                       icon: (
                         <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 2h14v5c0 3-3 3-3 5s3 2 3 5v5H5v-5c0-3 3-3 3-5s-3-2-3-5V2z"></path>
                         </svg>
                       )
                     },
                     { 
                       label: 'Completed', 
                       value: stats.completed, 
                       color: 'text-cyan-700', 
                       border: 'border-cyan-500', 
                       grad: 'from-white to-cyan-100',
                       icon: (
                         <svg className="w-12 h-12 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                         </svg>
                       )
                     }
                   ].map((stat, idx) => (
                     <div key={idx} className={`bg-gradient-to-r ${stat.grad} rounded-xl p-6 shadow-sm border-l-4 ${stat.border} flex items-center justify-between hover:shadow-md transition-all group`}>
                       <div>
                         <p className="text-slate-600 text-xs font-bold uppercase mb-1 opacity-60">{stat.label}</p>
                         <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
                       </div>
                       <div className="transition-transform group-hover:scale-110 duration-300">
                          {stat.icon}
                       </div>
                     </div>
                   ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  
                  {/* Chart 1: Project Status */}
                  <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col items-center">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 text-center uppercase tracking-wider text-sm opacity-70">Project Status</h3>
                    <div className="flex flex-col items-center w-full">
                        <div className="relative w-48 h-48">
                            <div className="w-full h-full rounded-full shadow-inner"
                                style={{
                                    background: stats.total_projects > 0 
                                        ? `conic-gradient(#14B8A6 0% ${(stats.completed/stats.total_projects)*100}%, #1F2A44 ${(stats.completed/stats.total_projects)*100}% ${((stats.completed+stats.ogp)/stats.total_projects)*100}%, #f59e0b ${((stats.completed+stats.ogp)/stats.total_projects)*100}% 100%)` 
                                        : '#f1f5f9'
                                }}
                            />
                            <div className="absolute inset-6 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                                <span className="text-4xl font-bold text-slate-800">{stats.total_projects}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Projects</span>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-center gap-4 w-full">
                            {[{ label: 'Done', c: 'bg-[#14B8A6]', v: stats.completed }, { label: 'OGP', c: 'bg-[#1F2A44]', v: stats.ogp }, { label: 'JT', c: 'bg-[#f59e0b]', v: stats.jt }].map((item, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <span className={`w-2 h-2 rounded-full ${item.c}`}></span>
                                        <span className="text-xl font-bold text-slate-700">{item.v}</span>
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                  </div>

                  {/* Chart 2: Target RFS Achievement */}
                  <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col items-center">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 text-center uppercase tracking-wider text-sm opacity-70">RFS Achievement</h3>
                    <div className="flex flex-col items-center w-full">
                        <div className="relative w-48 h-48">
                            <div className="w-full h-full rounded-full shadow-inner"
                                style={{ background: `conic-gradient(#14B8A6 0% ${onTimePercentage}%, #f1f5f9 ${onTimePercentage}% 100%)` }}
                            />
                            <div className="absolute inset-6 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                                <span className="text-4xl font-bold text-slate-800">{onTimePercentage}%</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">On Time</span>
                            </div>
                        </div>
                        <div className="mt-8 flex items-center justify-center gap-6 w-full">
                            <div className="flex flex-col items-center">
                                <span className="text-xl font-bold text-slate-700">{stats.on_time_rfs}</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">On Time</span>
                            </div>
                            <div className="w-px h-8 bg-slate-100"></div>
                            <div className="flex flex-col items-center">
                                <span className="text-xl font-bold text-slate-700">{stats.completed}</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Completed</span>
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* Chart 3: Overall Achievement */}
                  <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col items-center">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 text-center uppercase tracking-wider text-sm opacity-70">Overall Progress</h3>
                    <div className="flex flex-col items-center w-full">
                        <div className="relative w-48 h-48">
                            <div className="w-full h-full rounded-full shadow-inner"
                                style={{ background: `conic-gradient(#06B6D4 0% ${achievedPercentage}%, #f1f5f9 ${achievedPercentage}% 100%)` }}
                            />
                            <div className="absolute inset-6 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                                <span className="text-4xl font-bold text-slate-800">{achievedPercentage}%</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Progress</span>
                            </div>
                        </div>
                        <div className="mt-8 flex items-center justify-center gap-6 w-full">
                            <div className="flex flex-col items-center">
                                <span className="text-xl font-bold text-slate-700">{stats.completed}</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Finished</span>
                            </div>
                            <div className="w-px h-8 bg-slate-100"></div>
                            <div className="flex flex-col items-center">
                                <span className="text-xl font-bold text-slate-700">{stats.total_projects}</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Total</span>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-slate-800 rounded-full"></div>
                        <h2 className="text-xl font-bold text-slate-800">Project Mapping</h2>
                     </div>
                     <ProjectMap data={filteredProjects} center={[-7.250445, 112.768845]} />
                  </div>
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-slate-800 rounded-full"></div>
                        <h2 className="text-xl font-bold text-slate-800">Project Timeline</h2>
                     </div>
                     <GanttChart projects={filteredProjects} />
                  </div>
                </div>
                </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;