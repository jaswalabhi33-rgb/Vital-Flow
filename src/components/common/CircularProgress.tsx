import React from 'react';

interface CircularProgressProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: string; // hex or tailwind class color
  gradientId?: string;
  gradientColors?: [string, string];
  showValue?: boolean;
  valueSuffix?: string;
  label?: string;
  children?: React.ReactNode;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 90,
  strokeWidth = 8,
  color = '#10B981',
  gradientId,
  gradientColors,
  showValue = false,
  valueSuffix = '%',
  label,
  children,
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  const gid = gradientId || `grad_${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="relative inline-flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        {gradientColors && (
          <defs>
            <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradientColors[0]} />
              <stop offset="100%" stopColor={gradientColors[1]} />
            </linearGradient>
          </defs>
        )}
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress bar */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={gradientColors ? `url(#${gid})` : color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* Central content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
        {children ? (
          children
        ) : showValue ? (
          <>
            <span className="text-sm font-bold text-slate-100 tracking-tight">
              {Math.round(clampedValue)}
              <span className="text-[10px] text-slate-400 font-normal">{valueSuffix}</span>
            </span>
            {label && <span className="text-[9px] text-slate-400 uppercase tracking-wider">{label}</span>}
          </>
        ) : null}
      </div>
    </div>
  );
};
