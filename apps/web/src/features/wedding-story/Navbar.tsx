'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, CalendarHeart, Camera, Gift, Heart, UserCheck } from 'lucide-react';
import { MobileDock, MobileDockItem } from '@wending/ui';
import { WEDDING_DETAILS } from '@wending/utils';

const MOBILE_DOCK_ITEMS: MobileDockItem[] = [
  { id: 'historia', label: 'História', href: '/#historia', icon: <BookOpen size={18} /> },
  { id: 'eventos', label: 'Dia', href: '/#eventos', icon: <CalendarHeart size={18} /> },
  { id: 'presentes', label: 'Presentes', href: '/#presentes', icon: <Gift size={18} /> },
  { id: 'rsvp', label: 'RSVP', href: '/#confirmar', icon: <Heart size={18} /> },
  {
    id: 'photo-booth',
    label: 'Fotos',
    href: '/#photo-booth',
    highlight: true,
    icon: <Camera size={18} />,
  },
];

export function Navbar() {
  return (
    <>
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 500,
          backgroundColor: 'rgba(251, 249, 245, 0.94)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E8DFD1',
          padding: '12px 18px',
        }}
      >
        <div
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '23px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                color: '#2C2623',
              }}
            >
              {WEDDING_DETAILS.monogram}
            </span>
            <span
              style={{
                width: '1px',
                height: '15px',
                backgroundColor: '#DFD5C6',
              }}
            />
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#8C9275',
              }}
            >
              {WEDDING_DETAILS.dateNumeric}
            </span>
          </Link>

          {/* Atalho compacto mobile para o Painel do Convidado */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              className="desktop-only-links"
              style={{
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <Link
                href="/#historia"
                style={{
                  textDecoration: 'none',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#2C2623',
                }}
              >
                História
              </Link>

              <Link
                href="/#eventos"
                style={{
                  textDecoration: 'none',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#2C2623',
                }}
              >
                O Grande Dia
              </Link>

              <Link
                href="/#presentes"
                style={{
                  textDecoration: 'none',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#2C2623',
                }}
              >
                Presentes
              </Link>

              <Link
                href="/#confirmar"
                style={{
                  textDecoration: 'none',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#2C2623',
                }}
              >
                RSVP
              </Link>
            </div>

            <Link
              href="/painel"
              className="touch-press"
              style={{
                textDecoration: 'none',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#434B32',
                backgroundColor: '#F3ECE1',
                border: '1px solid #DFD5C6',
                padding: '7px 13px',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <UserCheck size={14} color="#5A6346" />
              Painel
            </Link>

            <Link
              href="/#photo-booth"
              className="desktop-only-links touch-press"
              style={{
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '999px',
                backgroundColor: '#5A6346',
                color: '#FBF9F5',
                fontSize: '11.5px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(67, 75, 50, 0.2)',
              }}
            >
              <Camera size={14} />
              Photo Booth
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile-First Bottom Thumb Dock */}
      <MobileDock
        items={MOBILE_DOCK_ITEMS}
        renderLink={(item, children) => (
          <Link href={item.href || '/'} style={{ textDecoration: 'none' }}>
            {children}
          </Link>
        )}
      />
    </>
  );
}
