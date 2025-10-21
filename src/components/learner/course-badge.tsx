"use client";

import React from "react";

interface CourseBadgeProps {
  courseTitle: string;
  completionDate?: string;
  size?: "sm" | "md" | "lg";
  variant?: "blue" | "green" | "purple" | "gold";
}

const CourseBadge: React.FC<CourseBadgeProps> = ({ 
  courseTitle, 
  completionDate,
  size = "md",
  variant = "blue"
}) => {
  // Size configurations
  const sizeConfig = {
    sm: { width: 200, height: 200, fontSize: 14, titleFontSize: 16 },
    md: { width: 280, height: 280, fontSize: 16, titleFontSize: 18 },
    lg: { width: 360, height: 360, fontSize: 18, titleFontSize: 20 },
  };

  const config = sizeConfig[size];

  // Color variants
  const colorSchemes = {
    blue: {
      gradient1: "#3B82F6",
      gradient2: "#1D4ED8",
      accent: "#60A5FA",
      text: "#FFFFFF",
    },
    green: {
      gradient1: "#10B981",
      gradient2: "#047857",
      accent: "#34D399",
      text: "#FFFFFF",
    },
    purple: {
      gradient1: "#8B5CF6",
      gradient2: "#6D28D9",
      accent: "#A78BFA",
      text: "#FFFFFF",
    },
    gold: {
      gradient1: "#F59E0B",
      gradient2: "#D97706",
      accent: "#FBBF24",
      text: "#FFFFFF",
    },
  };

  const colors = colorSchemes[variant];

  // Truncate course title if too long
  const truncateTitle = (title: string, maxLength: number) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength - 3) + "...";
  };

  const displayTitle = truncateTitle(courseTitle, size === "sm" ? 25 : size === "md" ? 35 : 45);
  const formattedDate = completionDate 
    ? new Date(completionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <div className="w-full max-w-[360px] mx-auto px-2">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${config.width} ${config.height}`}
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
      <defs>
        {/* Gradient definitions */}
        <linearGradient id={`badge-gradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.gradient1} />
          <stop offset="100%" stopColor={colors.gradient2} />
        </linearGradient>
        
        <linearGradient id={`shine-gradient-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Filter for shadow */}
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Outer decorative circle */}
      <circle
        cx={config.width / 2}
        cy={config.height / 2}
        r={config.width / 2 - 5}
        fill="none"
        stroke={colors.accent}
        strokeWidth="2"
        strokeDasharray="5,5"
        opacity="0.5"
      />

      {/* Main badge circle with gradient */}
      <circle
        cx={config.width / 2}
        cy={config.height / 2}
        r={config.width / 2 - 15}
        fill={`url(#badge-gradient-${variant})`}
        filter="url(#shadow)"
      />

      {/* Shine effect */}
      <circle
        cx={config.width / 2}
        cy={config.height / 2}
        r={config.width / 2 - 15}
        fill={`url(#shine-gradient-${variant})`}
      />

      {/* Decorative stars/points around the badge */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => {
        const radian = (angle * Math.PI) / 180;
        const radius = config.width / 2 - 8;
        const x = config.width / 2 + radius * Math.cos(radian);
        const y = config.height / 2 + radius * Math.sin(radian);
        return (
          <circle
            key={`star-${index}`}
            cx={x}
            cy={y}
            r="3"
            fill={colors.accent}
            opacity="0.8"
          />
        );
      })}

      {/* Trophy/Star icon in the center */}
      <g transform={`translate(${config.width / 2 - 20}, ${config.height / 2 - 60})`}>
        <path
          d="M20 5 L26 17 L39 19 L29.5 28 L32 41 L20 34 L8 41 L10.5 28 L1 19 L14 17 Z"
          fill={colors.text}
          opacity="0.9"
        />
        <circle cx="20" cy="20" r="3" fill={colors.accent} />
      </g>

      {/* "COMPLETED" text */}
      <text
        x={config.width / 2}
        y={config.height / 2 - 15}
        textAnchor="middle"
        fill={colors.text}
        fontSize={config.fontSize - 2}
        fontWeight="600"
        letterSpacing="2"
        opacity="0.9"
      >
        COMPLETED
      </text>

      {/* Course Title - wrapped if needed */}
      <text
        x={config.width / 2}
        y={config.height / 2 + 15}
        textAnchor="middle"
        fill={colors.text}
        fontSize={config.titleFontSize}
        fontWeight="700"
      >
        {displayTitle.split(' ').reduce<string[]>((acc, word) => {
          const line = acc[acc.length - 1];
          if (line && (line + ' ' + word).length <= (size === "sm" ? 20 : size === "md" ? 28 : 35)) {
            acc[acc.length - 1] = line + ' ' + word;
          } else {
            acc.push(word);
          }
          return acc;
        }, []).map((line, i) => (
          <tspan key={i} x={config.width / 2} dy={i === 0 ? 0 : config.titleFontSize + 2}>
            {line}
          </tspan>
        ))}
      </text>

      {/* Completion Date */}
      <text
        x={config.width / 2}
        y={config.height / 2 + 55}
        textAnchor="middle"
        fill={colors.text}
        fontSize={config.fontSize - 4}
        fontWeight="500"
        opacity="0.8"
      >
        {formattedDate}
      </text>

      {/* Bottom ribbon effect */}
      <path
        d={`M ${config.width / 2 - 30} ${config.height / 2 + 70} 
            L ${config.width / 2 - 30} ${config.height / 2 + 85}
            L ${config.width / 2 - 25} ${config.height / 2 + 90}
            L ${config.width / 2} ${config.height / 2 + 75}
            L ${config.width / 2 + 25} ${config.height / 2 + 90}
            L ${config.width / 2 + 30} ${config.height / 2 + 85}
            L ${config.width / 2 + 30} ${config.height / 2 + 70}
            Z`}
        fill={colors.accent}
        opacity="0.6"
      />

      {/* Achievement icon on ribbon */}
      <circle
        cx={config.width / 2}
        cy={config.height / 2 + 75}
        r="5"
        fill={colors.text}
      />
      <text
        x={config.width / 2}
        y={config.height / 2 + 79}
        textAnchor="middle"
        fill={colors.gradient2}
        fontSize="10"
        fontWeight="900"
      >
        ✓
      </text>
      </svg>
    </div>
  );
};

export default CourseBadge;
