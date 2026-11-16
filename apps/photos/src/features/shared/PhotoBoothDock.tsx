'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, Home, Image as ImageIcon, ListChecks } from 'lucide-react';
import { MobileDock, MobileDockItem } from '@wending/ui';

export interface PhotoBoothDockProps {
  activeTab: 'home' | 'missions' | 'gallery';
  nextMissionId?: string;
  photosCount?: number;
}

export function PhotoBoothDock({
  activeTab,
  nextMissionId = 'selfie-noivos',
  photosCount,
}: PhotoBoothDockProps) {
  const items: MobileDockItem[] = [
    {
      id: 'home',
      label: 'Início',
      href: '/',
      active: activeTab === 'home',
      icon: <Home size={18} />,
    },
    {
      id: 'missions',
      label: 'Missões',
      href: '/missions',
      active: activeTab === 'missions',
      icon: <ListChecks size={18} />,
    },
    {
      id: 'camera',
      label: 'Câmera',
      href: `/camera?mission=${encodeURIComponent(nextMissionId)}`,
      highlight: true,
      icon: <Camera size={19} />,
    },
    {
      id: 'gallery',
      label: 'Galeria',
      href: '/gallery',
      active: activeTab === 'gallery',
      badgeText: photosCount && photosCount > 0 ? String(photosCount) : undefined,
      icon: <ImageIcon size={18} />,
    },
  ];

  return (
    <MobileDock
      items={items}
      renderLink={(item, children) => (
        <Link href={item.href || '/'} style={{ textDecoration: 'none' }}>
          {children}
        </Link>
      )}
    />
  );
}
