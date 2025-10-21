"use client";

import React from "react";

interface MasterCertificateBadgeProps {
  totalCourses: number;
  completionDate?: string;
  size?: "sm" | "md" | "lg";
}

const MasterCertificateBadge: React.FC<MasterCertificateBadgeProps> = ({ 
  totalCourses,
  completionDate,
  size = "lg"
}) => {
  const sizeConfig = {
    sm: { width: 240, height: 240, fontSize: 14, titleFontSize: 18 },
    md: { width: 320, height: 320, fontSize: 16, titleFontSize: 22 },
    lg: { width: 400, height: 400, fontSize: 18, titleFontSize: 26 },
  };

  const config = sizeConfig[size];

  const formattedDate = completionDate 
    ? new Date(completionDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="w-full max-w-[400px] mx-auto px-4">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${config.width} ${config.height}`}
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-2xl w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
      <defs>
        {/* Gold gradient */}
        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Radial gradient for glow */}
        <radialGradient id="glow-gradient">
          <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
        </radialGradient>

        {/* Shine effect */}
        <linearGradient id="shine-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Shadow filter */}
        <filter id="shadow-master">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Outer glow */}
      <circle
        cx={config.width / 2}
        cy={config.height / 2}
        r={config.width / 2 - 10}
        fill="url(#glow-gradient)"
      />

      {/* Decorative outer ring */}
      <circle
        cx={config.width / 2}
        cy={config.height / 2}
        r={config.width / 2 - 10}
        fill="none"
        stroke="#F59E0B"
        strokeWidth="3"
        strokeDasharray="8,4"
        opacity="0.6"
      />

      {/* Main badge circle */}
      <circle
        cx={config.width / 2}
        cy={config.height / 2}
        r={config.width / 2 - 25}
        fill="url(#gold-gradient)"
        filter="url(#shadow-master)"
      />

      {/* Shine overlay */}
      <circle
        cx={config.width / 2}
        cy={config.height / 2}
        r={config.width / 2 - 25}
        fill="url(#shine-gradient)"
      />

      {/* Decorative stars around the perimeter */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, index) => {
        const radian = (angle * Math.PI) / 180;
        const radius = config.width / 2 - 15;
        const x = config.width / 2 + radius * Math.cos(radian);
        const y = config.height / 2 + radius * Math.sin(radian);
        return (
          <g key={index}>
            <path
              d={`M ${x} ${y - 8} L ${x + 2} ${y - 2} L ${x + 8} ${y} L ${x + 2} ${y + 2} L ${x} ${y + 8} L ${x - 2} ${y + 2} L ${x - 8} ${y} L ${x - 2} ${y - 2} Z`}
              fill="#FFFFFF"
              opacity="0.9"
            />
          </g>
        );
      })}

      {/* Crown/Trophy icon */}
      <g transform={`translate(${config.width / 2 - 35}, ${config.height / 2 - 90})`}>
        {/* Trophy body */}
        <path
          d="M20 10 L50 10 L50 15 L47 15 L47 35 L45 40 L25 40 L23 35 L23 15 L20 15 Z"
          fill="#FFFFFF"
          stroke="#D97706"
          strokeWidth="2"
        />
        {/* Trophy handles */}
        <path d="M20 12 L15 12 L15 20 L20 20" fill="none" stroke="#FFFFFF" strokeWidth="2" />
        <path d="M50 12 L55 12 L55 20 L50 20" fill="none" stroke="#FFFFFF" strokeWidth="2" />
        {/* Trophy base */}
        <rect x="22" y="40" width="26" height="5" rx="2" fill="#FFFFFF" stroke="#D97706" strokeWidth="2" />
        {/* Star on trophy */}
        <path
          d="M35 20 L37 26 L43 27 L38 31 L40 37 L35 33 L30 37 L32 31 L27 27 L33 26 Z"
          fill="#F59E0B"
        />
      </g>

      {/* "MASTER" text */}
      <text
        x={config.width / 2}
        y={config.height / 2 - 20}
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize={config.fontSize}
        fontWeight="700"
        letterSpacing="4"
      >
        MASTER
      </text>

      {/* "CERTIFICATE" text */}
      <text
        x={config.width / 2}
        y={config.height / 2 + 5}
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize={config.titleFontSize}
        fontWeight="900"
        letterSpacing="2"
      >
        CERTIFICATE
      </text>

      {/* Total courses completed */}
      <text
        x={config.width / 2}
        y={config.height / 2 + 35}
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize={config.fontSize}
        fontWeight="600"
        opacity="0.95"
      >
        {totalCourses} {totalCourses === 1 ? 'Course' : 'Courses'} Completed
      </text>

      {/* Completion date */}
      <text
        x={config.width / 2}
        y={config.height / 2 + 55}
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize={config.fontSize - 4}
        fontWeight="500"
        opacity="0.85"
      >
        {formattedDate}
      </text>

      {/* Decorative ribbon at bottom */}
      <g transform={`translate(${config.width / 2}, ${config.height / 2 + 80})`}>
        <path
          d="M -50 0 L -50 20 L -40 25 L 0 10 L 40 25 L 50 20 L 50 0 Z"
          fill="#DC2626"
          opacity="0.8"
        />
        <path
          d="M -40 10 L 0 0 L 40 10"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          opacity="0.6"
        />
      </g>

      {/* Excellence seal */}
      <circle
        cx={config.width / 2}
        cy={config.height / 2 + 85}
        r="12"
        fill="#DC2626"
        stroke="#FFFFFF"
        strokeWidth="2"
      />
      <text
        x={config.width / 2}
        y={config.height / 2 + 90}
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="14"
        fontWeight="900"
      >
        ★
      </text>
      </svg>
    </div>
  );
};

export default MasterCertificateBadge;
