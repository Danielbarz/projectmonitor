import React, { useState, useEffect, useRef } from 'react';
import AnimatedCounter from './AnimatedCounter';

const AnimatedDonutChart = ({
  percentage,
  color = '#14B8A6',
  bgColor = '#f1f5f9',
  size = 192, // w-48 = 192px
  strokeWidth = 24,
  duration = 1500,
  centerLabel = '',
  centerSuffix = '',
  children
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const startTimeRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      const progressRatio = Math.min(progress / duration, 1);

      // Ease-out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progressRatio, 3);
      const currentPercentage = easeOut * percentage;

      setAnimatedPercentage(currentPercentage);

      if (progressRatio < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    // Reset and start animation
    startTimeRef.current = null;
    setAnimatedPercentage(0);

    // Small delay to ensure component is mounted
    const timeout = setTimeout(() => {
      animationRef.current = requestAnimationFrame(animate);
    }, 100);

    return () => {
      clearTimeout(timeout);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [percentage, duration]);

  // Calculate the gradient for conic-gradient
  const gradientStyle = {
    background: `conic-gradient(${color} 0% ${animatedPercentage}%, ${bgColor} ${animatedPercentage}% 100%)`,
    transform: 'rotate(-90deg)', // Start from top
  };

  const innerSize = size - (strokeWidth * 2);

  return (
    <div
      className="relative rounded-full shadow-inner transition-all duration-300"
      style={{ width: size, height: size, ...gradientStyle }}
    >
      <div
        className="absolute bg-white rounded-full flex flex-col items-center justify-center shadow-sm"
        style={{
          width: innerSize,
          height: innerSize,
          top: strokeWidth,
          left: strokeWidth,
          transform: 'rotate(90deg)', // Counter-rotate to keep text upright
        }}
      >
        {children || (
          <>
            <span className="text-4xl font-bold text-slate-800">
              <AnimatedCounter value={percentage} duration={duration} suffix={centerSuffix} />
            </span>
            {centerLabel && (
              <span className="text-[10px] font-bold text-slate-400 uppercase">{centerLabel}</span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AnimatedDonutChart;
