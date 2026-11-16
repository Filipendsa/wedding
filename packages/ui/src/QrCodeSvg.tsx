'use client';

import React, { useMemo } from 'react';
import { generateQrMatrix } from '@wending/utils';

export interface QrCodeSvgProps {
  value: string;
  size?: number;
  darkColor?: string;
  lightColor?: string;
}

export function QrCodeSvg({
  value,
  size = 160,
  darkColor = '#27211D',
  lightColor = '#FFFFFF',
}: QrCodeSvgProps) {
  const matrix = useMemo(() => generateQrMatrix(value), [value]);
  const count = matrix.length;
  const quietZone = 2;
  const viewSize = count + quietZone * 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewSize} ${viewSize}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label="QR Code"
      style={{ display: 'block', borderRadius: '8px' }}
    >
      <rect width={viewSize} height={viewSize} fill={lightColor} />
      {matrix.map((row, r) =>
        row.map((isDark, c) =>
          isDark ? (
            <rect
              key={`${r}-${c}`}
              x={c + quietZone}
              y={r + quietZone}
              width={1}
              height={1}
              fill={darkColor}
            />
          ) : null
        )
      )}
    </svg>
  );
}
