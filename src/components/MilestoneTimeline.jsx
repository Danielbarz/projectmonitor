import React, { useRef, useEffect, useState } from 'react';

const MilestoneTimeline = ({ statusName, statusSequence, hasJT, lastStatusSequence }) => {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
        if(containerRef.current) setWidth(containerRef.current.offsetWidth);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const seqMap = { 
      'Belum Input': 1, 
      'Survey': 2, 
      'JT': 3, 
      'Progres PT 1': 4, 
      'Completed': 5,
      'Cancelled': 6
  };

  // 1. Define Base Steps
  let steps = [
    { name: 'Belum Input', label: 'Sudah Input', icon: '📝' },
    { name: 'Survey', label: 'Survey Lokasi', icon: '📋' },
    { name: 'Progres PT 1', label: 'Progress PT 1', icon: '⚙️' },
    { name: 'Completed', label: 'Completed', icon: '🚀' }
  ];

  // Determine resolved sequence (renamed from currentSeq to avoid confusion)
  const resolvedSeq = statusSequence || seqMap[statusName] || 1;

  // Add JT Logic
  if (hasJT || statusName === 'JT' || (lastStatusSequence === 3 && statusName === 'Cancelled')) {
    steps.splice(2, 0, { name: 'JT', label: 'JT', icon: '⚠️' });
  }

  // Handle Cancelled Logic
  if (statusName === 'Cancelled') {
      const cutOffSeq = lastStatusSequence || 1;
      steps = steps.filter(s => (seqMap[s.name] || 0) <= cutOffSeq);
      steps.push({ name: 'Cancelled', label: 'Project Cancelled', icon: '❌' });
  }

  // Render SVG Paths
  const renderPaths = () => {
    if (width === 0) return null;

    const rowHeight = 160; 
    const iconSize = 56;   
    const centerX = 28;    
    const leftX = centerX;      
    const rightX = width - centerX; 

    return steps.map((step, i) => {
      if (i === steps.length - 1) return null;

      const stepSeq = seqMap[step.name];
      const isFinished = resolvedSeq > stepSeq || (resolvedSeq === stepSeq && step.name === 'Completed');
      const isCancelledLine = steps[i+1].name === 'Cancelled';
      
      let color = isFinished ? "#22c55e" : "#cbd5e1"; 
      let dashArray = isFinished ? "0" : "8 6";
      
      if (isCancelledLine) {
          color = "#ef4444"; 
          dashArray = "0";
      }

      const startY = (i * rowHeight) + iconSize; 
      const endY = ((i + 1) * rowHeight);      
      
      const midY = (startY + endY) / 2;
      const radius = 30; 

      let d = "";
      if (i % 2 === 0) {
        d = `M ${leftX} ${startY} L ${leftX} ${midY - radius} Q ${leftX} ${midY} ${leftX + radius} ${midY} L ${rightX - radius} ${midY} Q ${rightX} ${midY} ${rightX} ${midY + radius} L ${rightX} ${endY}`;
      } else {
        d = `M ${rightX} ${startY} L ${rightX} ${midY - radius} Q ${rightX} ${midY} ${rightX - radius} ${midY} L ${leftX + radius} ${midY} Q ${leftX} ${midY} ${leftX} ${midY + radius} L ${leftX} ${endY}`;
      }

      return (
        <path key={i} d={d} fill="none" stroke={color} strokeWidth="3" strokeDasharray={dashArray} strokeLinecap="round" />
      );
    });
  };

  return (
    <div className="relative py-4" ref={containerRef}>
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        {renderPaths()}
      </svg>

      <div className="relative z-10 flex flex-col"> 
        {steps.map((step, idx) => {
            const stepSeq = seqMap[step.name];
            // Use resolvedSeq here
            const isFinished = resolvedSeq > stepSeq || (resolvedSeq === stepSeq && step.name === 'Completed');
            const isCurrent = resolvedSeq === stepSeq && step.name !== 'Completed' && step.name !== 'Cancelled';
            const isCancelled = step.name === 'Cancelled';
            
            let bubbleClass = "bg-white border-2 border-slate-300 text-slate-400";
            if (isFinished) bubbleClass = "bg-green-500 border-green-500 text-white shadow-lg shadow-green-200";
            if (isCurrent) bubbleClass = "bg-white border-2 border-dashed border-blue-500 text-blue-600 shadow-lg shadow-blue-100 ring-4 ring-blue-50";
            if (isCancelled) bubbleClass = "bg-red-500 border-red-500 text-white shadow-lg shadow-red-200";

            const isLeft = idx % 2 === 0;

            return (
                <div key={idx} style={{ height: idx === steps.length - 1 ? 'auto' : '160px' }} className={`flex items-start w-full ${isLeft ? 'flex-row' : 'flex-row-reverse text-right'}`}>
                    
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 z-10 ${bubbleClass}`}>
                        {isFinished ? (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        ) : isCancelled ? (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                        ) : (
                            <span className="text-2xl select-none">{step.icon}</span>
                        )}
                    </div>

                    <div className={`flex-1 px-4 mt-2 ${isLeft ? 'text-left' : 'text-right'}`}>
                        <p className={`font-bold text-lg leading-tight ${isCancelled ? 'text-red-600' : isCurrent ? 'text-blue-700' : 'text-slate-800'}`}>
                            {step.label}
                        </p>
                        <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${isCancelled ? 'text-red-500' : isCurrent ? 'text-blue-500' : isFinished ? 'text-green-600' : 'text-slate-400'}`}>
                            {isCancelled ? 'Terminated' : isCurrent ? 'On Progress' : isFinished ? 'Finished' : 'Pending'}
                        </p>
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default MilestoneTimeline;