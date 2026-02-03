import React, { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({ value, duration = 1000, suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - percentage, 3);
      const currentValue = Math.round(easeOut * value);

      setDisplayValue(currentValue);

      if (percentage < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    // Reset for new value
    startTimeRef.current = null;
    setDisplayValue(0);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  return <span>{displayValue}{suffix}</span>;
};

export default AnimatedCounter;
