import React from 'react';

const Input = ({ label, type = 'text', placeholder, value, onChange, name, autoComplete, className = '' }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-slate-800 text-lg font-bold font-['Carlito']">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full h-11 px-4 bg-white rounded-xl border border-transparent focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-slate-800 transition-all shadow-sm placeholder-slate-400`}
        />
      </div>
    </div>
  );
};

export default Input;
