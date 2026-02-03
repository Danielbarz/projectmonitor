import React, { useState, useEffect, useRef } from 'react';
import AnimatedCounter from './AnimatedCounter';

const AnimatedMultiDonut = ({
  segments = [], // [{ value, color, label }]
  total,
  size = 192,
  strokeWidth = 24,
  duration = 1500,
  centerValue,
  centerLabel = ''
}) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const startTimeRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      const progressRatio = Math.min(progress / duration, 1);

      // Ease-out cubic
      const easeOut = 1 - Math.pow(1 - progressRatio, 3);
      setAnimationProgress(easeOut);

      if (progressRatio < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    startTimeRef.current = null;
    setAnimationProgress(0);

    const timeout = setTimeout(() => {
      animationRef.current = requestAnimationFrame(animate);
    }, 100);

    return () => {
      clearTimeout(timeout);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [segments, total, duration]);

  // Build animated conic-gradient
  const buildGradient = () => {
    if (total === 0) return '#f1f5f9';

    let gradientParts = [];
    let currentAngle = 0;

    segments.forEach((seg) => {
      const segmentPercentage = (seg.value / total) * 100 * animationProgress;
      const nextAngle = currentAngle + segmentPercentage;

      if (segmentPercentage > 0) {
        gradientParts.push(`${seg.color} ${currentAngle}% ${nextAngle}%`);
      }
      currentAngle = nextAngle;
    });

    // Fill remaining with background
    if (currentAngle < 100) {
      gradientParts.push(`#f1f5f9 ${currentAngle}% 100%`);
    }

    return `conic-gradient(${gradientParts.join(', ')})`;
  };

  const gradientStyle = {
    background: buildGradient(),
    transform: 'rotate(-90deg)',
  };

  const innerSize = size - (strokeWidth * 2);

  return (
    <div
      className="relative rounded-full shadow-inner transition-all duration-100"
      style={{ width: size, height: size, ...gradientStyle }}
    >
      <div
        className="absolute bg-white rounded-full flex flex-col items-center justify-center shadow-sm"
        style={{
          width: innerSize,
          height: innerSize,
          top: strokeWidth,
          left: strokeWidth,
          transform: 'rotate(90deg)',
        }}
      >
        <span className="text-4xl font-bold text-slate-800">
          <AnimatedCounter value={centerValue ?? total} duration={duration} />
        </span>
        {centerLabel && (
          <span className="text-[10px] font-bold text-slate-400 uppercase">{centerLabel}</span>
        )}
      </div>
    </div>
  );
};

export default AnimatedMultiDonut;
