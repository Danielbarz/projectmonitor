import React, { useState, useRef, useEffect } from 'react';

const DateRangePicker = ({ startDate, endDate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localStart, setLocalStart] = useState(startDate || '');
  const [localEnd, setLocalEnd] = useState(endDate || '');
  const containerRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApply = () => {
    onChange(localStart, localEnd);
    setIsOpen(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  const displayValue = localStart && localEnd
    ? `${formatDate(localStart)} | ${formatDate(localEnd)}`
    : 'Select Date Range';

  return (
    <div className="relative flex-1 min-w-[200px]" ref={containerRef}>
      <label className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-1 block">Start Date | End Date</label>

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-100 rounded-xl h-10 px-4 flex items-center justify-between cursor-pointer hover:bg-white transition-colors group text-left"
      >
        <span className={`text-sm font-medium ${localStart ? 'text-slate-700' : 'text-slate-400'}`}>
          {displayValue}
        </span>
        <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      </button>

      {/* Popup */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-slate-600 text-xs font-bold uppercase">From</label>
              <div className="relative">
                 <input
                    type="date"
                    value={localStart}
                    onChange={(e) => setLocalStart(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:border-slate-400"
                 />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-600 text-xs font-bold uppercase">To</label>
              <div className="relative">
                 <input
                    type="date"
                    value={localEnd}
                    onChange={(e) => setLocalEnd(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:border-slate-400"
                 />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
               <button
                 onClick={() => {
                    setLocalStart('');
                    setLocalEnd('');
                    onChange('', '');
                    setIsOpen(false);
                 }}
                 className="flex-1 h-9 rounded-lg border border-slate-200 text-slate-500 text-sm font-bold hover:bg-slate-50 transition-colors"
               >
                 Clear
               </button>
               <button
                 onClick={handleApply}
                 className="flex-1 h-9 rounded-lg bg-slate-800 text-white text-sm font-bold hover:bg-slate-700 transition-colors"
               >
                 Apply
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;