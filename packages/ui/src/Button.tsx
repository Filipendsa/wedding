'use client';

import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: '#5A6346',
    color: '#FBF9F5',
    border: '1px solid #5A6346',
    boxShadow: '0 4px 14px rgba(67, 75, 50, 0.2)',
  },
  secondary: {
    backgroundColor: '#434B32',
    color: '#FBF9F5',
    border: '1px solid #434B32',
    boxShadow: '0 4px 12px rgba(67, 75, 50, 0.18)',
  },
  outline: {
    backgroundColor: 'transparent',
    color: '#2C2623',
    border: '1.5px solid #C8BDAE',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: '#6E655F',
    border: 'none',
  },
};

const SIZE_STYLES: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '8px 18px', fontSize: '12px', borderRadius: '999px', letterSpacing: '0.08em' },
  md: { padding: '12px 24px', fontSize: '13px', borderRadius: '999px', letterSpacing: '0.08em' },
  lg: { padding: '14px 30px', fontSize: '13.5px', borderRadius: '999px', letterSpacing: '0.1em' },
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  style,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: 600,
        textTransform: 'uppercase',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.65 : 1,
        transition: 'transform 0.15s ease, background-color 0.2s ease, box-shadow 0.2s ease',
        width: fullWidth ? '100%' : undefined,
        ...VARIANT_STYLES[variant],
        ...SIZE_STYLES[size],
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
