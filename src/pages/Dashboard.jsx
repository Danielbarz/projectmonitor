import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import GanttChart from '../components/GanttChart';
import ProjectMap from '../components/ProjectMap';
import DateRangePicker from '../components/DateRangePicker';

const Dashboard = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Projects
    fetch('http://localhost:5000/api/projects')
        .then(res => res.json())
        .then(data => {
            setAllProjects(data);
            setLoading(false);
        })
        .catch(err => {
            console.error('Error fetching projects:', err);
            setLoading(false);
        });
  }, []);

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
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                   {[
                     { label: 'Total Project', value: stats.total_projects, color: 'text-amber-500', border: 'border-amber-500' },
                     { label: 'OGP', value: stats.ogp, color: 'text-teal-500', border: 'border-teal-500' },
                     { label: 'JT', value: stats.jt, color: 'text-red-600', border: 'border-red-600' },
                     { label: 'Completed', value: stats.completed, color: 'text-cyan-500', border: 'border-cyan-500' }
                   ].map((stat, idx) => (
                     <div key={idx} className={`bg-white rounded-xl p-6 shadow-sm border-l-4 ${stat.border} flex items-center justify-between hover:shadow-md transition-shadow`}>
                       <div>
                         <p className="text-slate-600 text-xs font-bold uppercase mb-1 opacity-60">{stat.label}</p>
                         <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
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
                                        ? `conic-gradient(#22c55e 0% ${(stats.completed/stats.total_projects)*100}%, #3b82f6 ${(stats.completed/stats.total_projects)*100}% ${((stats.completed+stats.ogp)/stats.total_projects)*100}%, #f59e0b ${((stats.completed+stats.ogp)/stats.total_projects)*100}% 100%)` 
                                        : '#f1f5f9'
                                }}
                            />
                            <div className="absolute inset-6 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                                <span className="text-4xl font-bold text-slate-800">{stats.total_projects}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Projects</span>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-center gap-4 w-full">
                            {[{ label: 'Done', c: 'bg-green-500', v: stats.completed }, { label: 'OGP', c: 'bg-blue-500', v: stats.ogp }, { label: 'JT', c: 'bg-amber-500', v: stats.jt }].map((item, i) => (
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
                                style={{ background: `conic-gradient(#10b981 0% ${onTimePercentage}%, #f1f5f9 ${onTimePercentage}% 100%)` }}
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
                                style={{ background: `conic-gradient(#3b82f6 0% ${achievedPercentage}%, #f1f5f9 ${achievedPercentage}% 100%)` }}
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