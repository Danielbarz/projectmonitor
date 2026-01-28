import React, { useState, useMemo } from 'react';

const GanttChart = () => {
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'week' | 'day'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date('2026-01-01'));

  // Mock Data with specific start/end dates
  const rawProjects = [
    { name: 'PRJ-2026-001', startDate: '2026-02-01', endDate: '2026-04-15', color: 'bg-teal-500' },
    { name: 'PRJ-2026-002', startDate: '2026-01-10', endDate: '2026-02-28', color: 'bg-teal-500' },
    { name: 'PRJ-2026-003', startDate: '2026-05-01', endDate: '2026-08-30', color: 'bg-red-500' },
    { name: 'PRJ-2026-004', startDate: '2026-03-15', endDate: '2026-07-20', color: 'bg-teal-500' },
    { name: 'PRJ-2026-005', startDate: '2026-09-01', endDate: '2026-11-30', color: 'bg-teal-500' },
  ];

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') newDate.setFullYear(newDate.getFullYear() - 1);
    else if (viewMode === 'week') newDate.setMonth(newDate.getMonth() - 3); // Shift by quarter
    else if (viewMode === 'day') newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') newDate.setFullYear(newDate.getFullYear() + 1);
    else if (viewMode === 'week') newDate.setMonth(newDate.getMonth() + 3);
    else if (viewMode === 'day') newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  // Helper to get day of year (1-366)
  const getDayOfYear = (dateStr) => {
    const date = new Date(dateStr);
    const start = new Date(currentDate.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  // Helper to get month index (0-11) relative to current year
  const getMonthIndex = (dateStr) => {
    const date = new Date(dateStr);
    return (date.getFullYear() - currentDate.getFullYear()) * 12 + date.getMonth();
  };

  // Helper to get week number (1-52)
  const getWeekNumber = (dateStr) => {
    const date = new Date(dateStr);
    const start = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - start) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + start.getDay() + 1) / 7);
  };

  // Helper to generate days for the header based on currentDate
  const getDaysInView = () => {
    if (viewMode === 'month') {
        // Return 12 months for the current year
        return Array(12).fill(0).map((_, i) => new Date(currentDate.getFullYear(), i, 1));
    }
    // For simplicity in this demo, week/day modes will just use standard ranges relative to currentDate
    // Real implementation would need dynamic range calculations
    const days = [];
    const year = currentDate.getFullYear();
    const date = new Date(year, 0, 1);
    while (date.getFullYear() === year) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const daysInView = useMemo(() => getDaysInView(), [currentDate, viewMode]);
  const weeksInYear = 53;

  const filteredProjects = rawProjects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[400px]">
      
      {/* Controls Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center gap-4">
        {/* Search */}
        <div className="relative w-64 group">
           <input 
             type="text" 
             placeholder="Search project code..." 
             className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-slate-500 transition-colors"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
           <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
           </svg>
        </div>

        <div className="flex items-center gap-4">
            {/* Pagination Controls */}
            <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
                <button onClick={handlePrev} className="p-1 hover:bg-slate-100 rounded text-slate-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
                <span className="text-xs font-bold text-slate-700 min-w-[60px] text-center">
                    {currentDate.getFullYear()}
                </span>
                <button onClick={handleNext} className="p-1 hover:bg-slate-100 rounded text-slate-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>
            </div>

            {/* View Toggle */}
            <div className="flex bg-slate-200 rounded-lg p-1">
            <button 
                onClick={() => setViewMode('month')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'month' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Months
            </button>
            <button 
                onClick={() => setViewMode('week')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'week' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Weeks
            </button>
            <button 
                onClick={() => setViewMode('day')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'day' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Days
            </button>
            </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Fixed Left Column: Project Names */}
        <div className="w-40 flex-shrink-0 border-r border-slate-200 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] flex flex-col">
           <div className="h-10 border-b border-slate-200 bg-slate-50 flex items-center px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Project Code
           </div>
           <div className="flex-1 overflow-hidden">
              {filteredProjects.map((p, i) => (
                 <div key={i} className="h-12 border-b border-slate-100 flex items-center px-4 text-xs font-medium text-slate-700 truncate" title={p.name}>
                    {p.name}
                 </div>
              ))}
           </div>
        </div>

        {/* Scrollable Timeline Area */}
        <div className="flex-1 overflow-auto relative">
           <div 
             className={`relative ${
               viewMode === 'day' ? 'w-[4000px]' : 
               viewMode === 'week' ? 'w-[2000px]' : 
               'w-full'
             }`}
           >
              
              {/* Timeline Header */}
              <div className="h-10 border-b border-slate-200 bg-slate-50 flex sticky top-0 z-10">
                 {viewMode === 'month' && (
                    daysInView.map((date, i) => (
                       <div key={i} className="flex-1 border-r border-slate-200 flex items-center justify-center text-xs font-bold text-slate-400">
                          {date.toLocaleString('default', { month: 'short' })}
                       </div>
                    ))
                 )}

                 {viewMode === 'week' && (
                    Array(weeksInYear).fill(0).map((_, i) => (
                       <div key={i} className="flex-1 border-r border-slate-200 flex items-center justify-center text-xs font-bold text-slate-400">
                          W{i + 1}
                       </div>
                    ))
                 )}

                 {viewMode === 'day' && (
                    daysInView.map((date, i) => {
                       const isStartOfMonth = date.getDate() === 1;
                       return (
                         <div key={i} className={`flex-1 min-w-[30px] border-r border-slate-100 flex flex-col items-center justify-center ${isStartOfMonth ? 'border-l-2 border-l-slate-300' : ''}`}>
                            {isStartOfMonth && <span className="text-[9px] font-bold text-slate-500 mb-0.5">{date.toLocaleString('default', { month: 'short' })}</span>}
                            <span className="text-[10px] text-slate-400 font-medium">{date.getDate()}</span>
                         </div>
                       )
                    })
                 )}
              </div>

              {/* Timeline Grid & Bars */}
              <div className="relative">
                 {/* Grid Background */}
                 <div className="absolute inset-0 flex pointer-events-none h-full">
                    {viewMode === 'month' && daysInView.map((_, i) => (
                        <div key={i} className="flex-1 border-r border-slate-50 h-full"></div>
                    ))}
                    {viewMode === 'week' && Array(weeksInYear).fill(0).map((_, i) => (
                        <div key={i} className="flex-1 border-r border-slate-50 h-full"></div>
                    ))}
                    {viewMode === 'day' && daysInView.map((_, i) => (
                        <div key={i} className="flex-1 min-w-[30px] border-r border-slate-50 h-full"></div>
                    ))}
                 </div>

                 {/* Project Rows */}
                 {filteredProjects.map((proj, idx) => {
                    // Calculation logic
                    let left = 0;
                    let width = 0;

                    if (viewMode === 'month') {
                       const startMonth = getMonthIndex(proj.startDate);
                       const endMonth = getMonthIndex(proj.endDate);
                       // 12 months in view
                       left = (startMonth / 12) * 100;
                       const durationMonths = (endMonth - startMonth) + 1; // inclusive
                       width = (durationMonths / 12) * 100;
                    } else if (viewMode === 'week') {
                       const startWeek = getWeekNumber(proj.startDate);
                       const endWeek = getWeekNumber(proj.endDate);
                       left = ((startWeek - 1) / weeksInYear) * 100;
                       width = ((endWeek - startWeek + 1) / weeksInYear) * 100;
                    } else {
                       const startDay = getDayOfYear(proj.startDate);
                       const endDay = getDayOfYear(proj.endDate);
                       // For day view, we are showing ~365 days in this simplified demo
                       const totalDays = 365;
                       left = ((startDay - 1) / totalDays) * 100;
                       width = ((endDay - startDay + 1) / totalDays) * 100;
                    }

                    return (
                       <div key={idx} className="h-12 border-b border-slate-50 relative hover:bg-slate-50/30 transition-colors">
                          <div 
                             className={`absolute top-3.5 h-5 rounded shadow-sm ${proj.color} opacity-90 hover:opacity-100 transition-all cursor-pointer group`}
                             style={{ left: `${left}%`, width: `${width}%` }}
                          >
                             {/* Tooltip on hover */}
                             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-20 shadow-lg">
                                {proj.startDate} - {proj.endDate}
                             </div>
                          </div>
                       </div>
                    )
                 })}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
