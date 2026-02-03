import React, { useState, useMemo } from 'react';

const GanttChart = ({ projects = [] }) => {
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'week' | 'day'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') newDate.setFullYear(newDate.getFullYear() - 1);
    else if (viewMode === 'week') newDate.setMonth(newDate.getMonth() - 3);
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
    if (!dateStr) return 1;
    const date = new Date(dateStr);
    const start = new Date(currentDate.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  // Helper to get month index relative to current year
  const getMonthIndex = (dateStr) => {
    if (!dateStr) return 0;
    const date = new Date(dateStr);
    return (date.getFullYear() - currentDate.getFullYear()) * 12 + date.getMonth();
  };

  // Helper to get week number
  const getWeekNumber = (dateStr) => {
    if (!dateStr) return 1;
    const date = new Date(dateStr);
    const start = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - start) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + start.getDay() + 1) / 7);
  };

  const getDaysInView = () => {
    if (viewMode === 'month') {
        return Array(12).fill(0).map((_, i) => new Date(currentDate.getFullYear(), i, 1));
    }
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

  // Process and Filter Projects
  const processedProjects = useMemo(() => {
    return projects.map(p => {
        const isCompleted = p.status_name === 'Completed';

        // Start Date: input_date
        const start = p.input_date || p.created_at;

        // End Date: target_rfs if ongoing, actual_rfs if completed
        let end = isCompleted ? (p.actual_rfs || p.target_rfs) : p.target_rfs;

        // Color Logic
        let color = 'bg-[#06B6D4]'; // Ongoing (Cyan)
        if (isCompleted) {
            const actualDate = new Date(p.actual_rfs);
            const targetDate = new Date(p.target_rfs);

            if (p.actual_rfs && p.target_rfs) {
                if (actualDate <= targetDate) {
                    color = 'bg-[#14B8A6]'; // Teal
                } else {
                    color = 'bg-[#E31E24]'; // Red
                }
            } else {
                color = 'bg-[#14B8A6]'; // Default Completed
            }
        }

        return {
            ...p,
            startDate: start,
            endDate: end,
            color
        };
    }).filter(p =>
        p.order_id?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[400px]">

      {/* Controls Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center gap-4">
        <div className="relative w-64 group">
           <input
             type="text"
             placeholder="Search Order ID..."
             className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-slate-500 transition-colors"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
           <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
           </svg>
        </div>

        <div className="flex items-center gap-4">
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

            <div className="flex bg-slate-200 rounded-lg p-1">
                {['month', 'week', 'day'].map((mode) => (
                    <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold capitalize transition-all ${viewMode === mode ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        {mode}s
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="flex min-w-fit">
          {/* Sticky Left Column - Order ID */}
          <div className="w-40 flex-shrink-0 bg-white sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
            <div className="h-10 border-b border-r border-slate-200 bg-slate-50 flex items-center px-4 text-xs font-bold text-slate-500 uppercase tracking-wider sticky top-0 z-30">
              Order ID
            </div>
            {processedProjects.map((p, i) => (
              <div key={i} className="h-12 border-b border-r border-slate-100 flex items-center px-4 text-[10px] font-bold text-slate-700 truncate bg-white" title={p.order_id}>
                {p.order_id}
              </div>
            ))}
          </div>

          {/* Timeline Area */}
          <div className={`flex-1 ${viewMode === 'day' ? 'min-w-[4000px]' : viewMode === 'week' ? 'min-w-[2000px]' : 'min-w-0'}`}>
            {/* Timeline Header */}
            <div className="h-10 border-b border-slate-200 bg-slate-50 flex sticky top-0 z-10">
              {viewMode === 'month' && daysInView.map((date, i) => (
                <div key={i} className="flex-1 border-r border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">
                  {date.toLocaleString('default', { month: 'short' })}
                </div>
              ))}
              {viewMode === 'week' && Array(weeksInYear).fill(0).map((_, i) => (
                <div key={i} className="flex-1 border-r border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">
                  W{i + 1}
                </div>
              ))}
              {viewMode === 'day' && daysInView.map((date, i) => (
                <div key={i} className="flex-1 min-w-[30px] border-r border-slate-100 flex flex-col items-center justify-center">
                  <span className="text-[9px] text-slate-400 font-medium">{date.getDate()}</span>
                </div>
              ))}
            </div>

            {/* Timeline Rows */}
            <div className="relative">
              {/* Grid Background */}
              <div className="absolute inset-0 flex pointer-events-none h-full">
                {viewMode === 'month' && daysInView.map((_, i) => <div key={i} className="flex-1 border-r border-slate-50 h-full"></div>)}
                {viewMode === 'week' && Array(weeksInYear).fill(0).map((_, i) => <div key={i} className="flex-1 border-r border-slate-50 h-full"></div>)}
                {viewMode === 'day' && daysInView.map((_, i) => <div key={i} className="flex-1 min-w-[30px] border-r border-slate-50 h-full"></div>)}
              </div>

              {/* Project Bars */}
              {processedProjects.map((proj, idx) => {
                let left = 0;
                let width = 0;

                if (proj.startDate && proj.endDate) {
                  if (viewMode === 'month') {
                    const startMonth = getMonthIndex(proj.startDate);
                    const endMonth = getMonthIndex(proj.endDate);
                    left = (startMonth / 12) * 100;
                    width = Math.max(((endMonth - startMonth) + 1) / 12 * 100, 2);
                  } else if (viewMode === 'week') {
                    const startWeek = getWeekNumber(proj.startDate);
                    const endWeek = getWeekNumber(proj.endDate);
                    left = ((startWeek - 1) / weeksInYear) * 100;
                    width = Math.max(((endWeek - startWeek + 1) / weeksInYear) * 100, 2);
                  } else {
                    const startDay = getDayOfYear(proj.startDate);
                    const endDay = getDayOfYear(proj.endDate);
                    left = ((startDay - 1) / 365) * 100;
                    width = Math.max(((endDay - startDay + 1) / 365) * 100, 1);
                  }
                }

                return (
                  <div key={idx} className="h-12 border-b border-slate-50 relative hover:bg-slate-50/30 transition-colors">
                    {proj.startDate && proj.endDate && (
                      <div
                        className={`absolute top-3.5 h-5 rounded shadow-sm ${proj.color} opacity-90 hover:opacity-100 transition-all cursor-pointer group`}
                        style={{ left: `${left}%`, width: `${width}%` }}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-800 text-white text-[10px] rounded py-1 px-2 whitespace-nowrap z-20 shadow-lg">
                          {new Date(proj.startDate).toLocaleDateString()} - {new Date(proj.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    )}
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