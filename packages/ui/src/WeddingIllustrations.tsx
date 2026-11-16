'use client';

import React from 'react';

interface IllustrationProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function RingsIllustration({ size = 44, color = '#5A6346', style }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style} aria-hidden="true">
      <circle cx="24" cy="36" r="14" stroke={color} strokeWidth="1.6" />
      <circle cx="40" cy="36" r="14" stroke={color} strokeWidth="1.6" />
      <path d="M36 17L40 12L44 17L40 22L36 17Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M40 7V10M31 11L33 13M49 11L47 13" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function CeremonyArchIllustration({ size = 44, color = '#5A6346', style }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style} aria-hidden="true">
      <path d="M14 54V28C14 18.0589 22.0589 10 32 10C41.9411 10 50 18.0589 50 28V54" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M20 54V29C20 22.3726 25.3726 17 32 17C38.6274 17 44 22.3726 44 29V54" stroke={color} strokeWidth="1.3" strokeDasharray="3 3" />
      <path d="M10 54H54" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M32 6V10M25 11C27 13 29 14 32 14C35 14 37 13 39 11" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function WeddingCakeIllustration({ size = 44, color = '#5A6346', style }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style} aria-hidden="true">
      <path d="M12 52H52" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <rect x="16" y="38" width="32" height="14" rx="2" stroke={color} strokeWidth="1.6" />
      <rect x="21" y="26" width="22" height="12" rx="2" stroke={color} strokeWidth="1.6" />
      <path
        d="M16 43C19 46 23 46 26 43C29 46 35 46 38 43C41 46 45 46 48 43"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M32 14C30 11 25 12 25 16C25 20 32 24 32 24C32 24 39 20 39 16C39 12 34 11 32 14Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function OpenBibleHeartIllustration({ size = 44, color = '#5A6346', style }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style} aria-hidden="true">
      <path
        d="M10 20C10 18 12 16 15 16C21 16 28 18 32 22C36 18 43 16 49 16C52 16 54 18 54 20V46C54 48 52 49 49 49C43 49 36 50 32 53C28 50 21 49 15 49C12 49 10 48 10 46V20Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M32 22V53" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M16 26H25M16 33H25M39 26H48M39 33H48"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M32 10C30.4 8 27 8.5 27 11.3C27 13.8 32 16.5 32 16.5C32 16.5 37 13.8 37 11.3C37 8.5 33.6 8 32 10Z"
        stroke={color}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DinnerCutleryIllustration({ size = 40, color = '#5A6346', style }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style} aria-hidden="true">
      <circle cx="32" cy="34" r="16" stroke={color} strokeWidth="1.5" />
      <circle cx="32" cy="34" r="10.5" stroke={color} strokeWidth="1.2" strokeDasharray="2 2" />
      <path d="M10 14V26C10 28.5 12 30 12 30V52M7 14V24M13 14V24" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M52 14V52M52 14C55 18 55 28 52 32" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function PartyMusicIllustration({ size = 40, color = '#5A6346', style }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style} aria-hidden="true">
      <path d="M24 44V18L48 13V39" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="19" cy="45" r="5" stroke={color} strokeWidth="1.6" />
      <circle cx="43" cy="40" r="5" stroke={color} strokeWidth="1.6" />
      <path d="M14 20L17 23M17 20L14 23M53 24L56 27M56 24L53 27" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function BotanicalBranchIllustration({ size = 90, color = '#8C9275', style }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" style={style} aria-hidden="true">
      <path d="M16 104C38 78 64 46 102 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M36 82C26 78 21 67 24 58C33 61 40 71 36 82Z" stroke={color} strokeWidth="1.3" />
      <path d="M44 73C56 76 66 70 69 60C59 58 49 63 44 73Z" stroke={color} strokeWidth="1.3" />
      <path d="M60 54C50 49 46 39 50 30C59 34 65 44 60 54Z" stroke={color} strokeWidth="1.3" />
      <path d="M68 46C79 49 88 44 92 35C82 32 72 37 68 46Z" stroke={color} strokeWidth="1.3" />
      <path d="M84 31C76 26 74 17 79 10C87 15 90 24 84 31Z" stroke={color} strokeWidth="1.3" />
      <circle cx="48" cy="68" r="2.2" fill={color} opacity="0.6" />
      <circle cx="72" cy="41" r="2.2" fill={color} opacity="0.6" />
    </svg>
  );
}

export function TornPaperDivider({
  fill = '#FBF9F5',
  flip = false,
}: {
  fill?: string;
  flip?: boolean;
}) {
  return (
    <div
      style={{
        width: '100%',
        overflow: 'hidden',
        lineHeight: 0,
        transform: flip ? 'rotate(180deg)' : undefined,
        pointerEvents: 'none',
      }}
    >
      <svg
        viewBox="0 0 1440 56"
        preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: '38px' }}
        aria-hidden="true"
      >
        <path
          d="M0,28 C120,48 220,8 360,26 C490,42 600,10 740,28 C880,46 1010,12 1140,26 C1260,39 1350,18 1440,24 L1440,56 L0,56 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
