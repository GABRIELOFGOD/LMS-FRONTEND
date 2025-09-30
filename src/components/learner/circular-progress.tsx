"use client";

import { useEffect, useState } from "react";

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  completedLessons?: number;
  totalLessons?: number;
}

export const CircularProgress = ({ 
  percentage, 
  size = 120, 
  strokeWidth = 8,
  color = "hsl(var(--primary))",
  completedLessons,
  totalLessons
}: CircularProgressProps) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  // Format percentage to maximum 1 decimal place and remove unnecessary decimals
  const formattedPercentage = percentage % 1 === 0 ? 
    Math.round(animatedPercentage).toString() : 
    animatedPercentage.toFixed(1);

  // Calculate responsive text size based on circle size
  const getTextSize = () => {
    if (size <= 48) return "text-xs";
    if (size <= 80) return "text-sm";
    if (size <= 120) return "text-base";
    return "text-lg";
  };

  const getSubTextSize = () => {
    if (size <= 48) return "text-[10px]";
    if (size <= 80) return "text-xs";
    return "text-xs";
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-20"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 4px ${color}30)`
          }}
        />
      </svg>
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-1"
        style={{ fontSize: size <= 48 ? '10px' : 'inherit' }}
      >
        <span className={`${getTextSize()} font-bold text-foreground leading-none`}>
          {formattedPercentage}%
        </span>
        {completedLessons !== undefined && totalLessons !== undefined && size > 48 && (
          <span className={`${getSubTextSize()} text-muted-foreground mt-0.5 leading-none`}>
            {completedLessons}/{totalLessons}
          </span>
        )}
      </div>
    </div>
  );
};
