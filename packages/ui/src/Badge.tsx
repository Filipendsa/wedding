'use client';

import React from 'react';

export type BadgeVariant = 'fuchsia' | 'sunset' | 'olive' | 'orchid' | 'sand';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const BADGE_STYLES: Record<BadgeVariant, React.CSSProperties> = {
  fuchsia: { backgroundColor: '#5A6346', color: '#FBF9F5' },
  sunset: { backgroundColor: '#EFE7DA', color: '#5A6346' },
  olive: { backgroundColor: 'rgba(90, 99, 70, 0.12)', color: '#434B32' },
  orchid: { backgroundColor: '#F3ECE1', color: '#6E655F' },
  sand: { backgroundColor: '#F3ECE1', color: '#2C2623' },
};

export function Badge({ variant = 'olive', children, style }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '5px 14px',
        borderRadius: '999px',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        ...BADGE_STYLES[variant],
        ...style,
      }}
    >
      {children}
    </span>
  );
}
