import React from 'react';

interface EnteraLogoProps {
  className?: string;
  size?: number;
  withText?: boolean;
  textSize?: string;
}

export const EnteraLogo: React.FC<EnteraLogoProps> = ({
  className = '',
  size = 36,
  withText = false,
  textSize = 'text-xl'
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm"
      >
        <defs>
          {/* Outer arch gradient: purple bottom-left to luminous cyan-blue right */}
          <linearGradient id="enteraArchGrad" x1="15" y1="85" x2="85" y2="15" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="35%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          {/* Right pillar / top highlight */}
          <linearGradient id="enteraPillarRight" x1="50" y1="10" x2="85" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="60%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>

          {/* Perspective door leaf */}
          <linearGradient id="enteraDoorLeaf" x1="50" y1="35" x2="62" y2="75" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>

          {/* Perspective threshold / floor */}
          <linearGradient id="enteraFloor" x1="30" y1="80" x2="60" y2="65" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        {/* Outer Arched Gateway Body */}
        {/* Outer perimeter with slight peak at top, rounded shoulders, and bottom angled cut */}
        <path
          d="M 50 14
             C 62 14 74 20 74 34
             L 74 76
             L 60 76
             L 60 40
             C 60 32 54 28 50 28
             C 46 28 40 32 40 40
             L 40 76
             L 26 82
             L 26 34
             C 26 20 38 14 50 14 Z"
          fill="url(#enteraArchGrad)"
        />

        {/* Right side facet highlight */}
        <path
          d="M 50 14
             C 62 14 74 20 74 34
             L 74 76
             L 62 70
             L 62 38
             C 62 30 56 26 50 26
             Z"
          fill="url(#enteraPillarRight)"
          opacity="0.95"
        />

        {/* Deep Portal Interior (Dark Void) */}
        <path
          d="M 40 40
             C 40 32 46 28 50 28
             C 54 28 60 32 60 40
             L 60 72
             L 51 66
             L 40 73
             Z"
          fill="#090d16"
        />

        {/* Slanted Floor / Doorstep Threshold in Perspective */}
        <polygon
          points="28,81 50,68 60,72 38,85"
          fill="url(#enteraFloor)"
        />

        {/* The Open Portal Door / Gateway Leaf swung open inward */}
        <polygon
          points="51,36 59,42 59,72 51,66"
          fill="url(#enteraDoorLeaf)"
        />

        {/* Highlight edge on the door */}
        <line
          x1="51"
          y1="36"
          x2="51"
          y2="66"
          stroke="#93c5fd"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {withText && (
        <span className={`font-extrabold tracking-tight text-slate-900 ${textSize}`}>
          Entera
        </span>
      )}
    </div>
  );
};
