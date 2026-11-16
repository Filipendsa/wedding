'use client';

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'sand' | 'highlighted';
  padding?: string;
}

export function Card({
  variant = 'default',
  padding = '28px',
  style,
  children,
  ...rest
}: CardProps) {
  const variantStyles: Record<'default' | 'sand' | 'highlighted', React.CSSProperties> = {
    default: {
      backgroundColor: '#FFFFFF',
      border: '1px solid #E8DFD1',
      boxShadow: '0 8px 28px rgba(44, 38, 35, 0.04)',
    },
    sand: {
      backgroundColor: '#F3ECE1',
      border: '1px solid #DFD5C6',
      boxShadow: 'none',
    },
    highlighted: {
      backgroundColor: '#FFFFFF',
      border: '1.5px solid #5A6346',
      boxShadow: '0 10px 30px rgba(90, 99, 70, 0.1)',
    },
  };

  return (
    <div
      style={{
        borderRadius: '16px',
        padding,
        ...variantStyles[variant],
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
