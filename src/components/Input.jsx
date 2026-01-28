import React from 'react';

const Input = ({ label, type = 'text', placeholder, value, onChange, className = '' }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-slate-800 text-lg font-bold font-['Carlito']">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full h-11 px-4 bg-white rounded-xl border border-transparent focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-slate-800 transition-all shadow-sm placeholder-slate-400 ${type === 'date' ? 'pr-10' : ''}`}
        />
        {type === 'date' && (
          <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        )}
      </div>
    </div>
  );
};

export default Input;
