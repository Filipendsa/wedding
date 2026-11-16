'use client';

import React from 'react';

export interface ProgressBarProps {
  percent: number;
  height?: number;
}

export function ProgressBar({ percent, height = 8 }: ProgressBarProps) {
  const safePercent = Math.max(0, Math.min(100, percent));

  return (
    <div
      style={{
        width: '100%',
        height: `${height}px`,
        backgroundColor: '#EFE7DA',
        borderRadius: `${height}px`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${safePercent}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #8C9275 0%, #5A6346 60%, #434B32 100%)',
          borderRadius: `${height}px`,
          transition: 'width 0.45s ease-out',
        }}
      />
    </div>
  );
}
