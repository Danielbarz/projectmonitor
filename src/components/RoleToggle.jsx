import React from 'react';
import { useRole } from '../context/RoleContext';

const RoleToggle = () => {
  const { role, toggleRole } = useRole();

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <button 
        onClick={toggleRole}
        className="bg-purple-600 text-yellow-300 border-4 border-dashed border-lime-400 p-4 font-mono text-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all rotate-3"
      >
        CURRENT MODE: {role.toUpperCase()}
        <br/>
        <span className="text-xs text-white">(Click to Swap)</span>
      </button>
    </div>
  );
};

export default RoleToggle;