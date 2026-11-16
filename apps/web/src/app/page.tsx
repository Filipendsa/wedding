'use client';

import React from 'react';
import { Navbar } from '../features/wedding-story/Navbar';
import { HeroInvite } from '../features/wedding-story/HeroInvite';
import { StorySection } from '../features/wedding-story/StorySection';
import { PhotoBoothCtaSection } from '../features/wedding-story/PhotoBoothCtaSection';
import { GiftsCatalogSection } from '../features/gifts-checkout/GiftsCatalogSection';
import { RsvpSection } from '../features/rsvp/RsvpSection';
import { WEDDING_DETAILS } from '@wending/utils';

export default function WeddingHomePage() {
  return (
    <main className="safe-bottom-page" style={{ minHeight: '100vh', backgroundColor: '#FBF9F5' }}>
      <Navbar />
      <HeroInvite />
      <StorySection />
      <PhotoBoothCtaSection />
      <GiftsCatalogSection />
      <RsvpSection />

      <footer
        style={{
          padding: '48px 20px',
          backgroundColor: '#363D28',
          color: '#FBF9F5',
          textAlign: 'center',
          borderTop: '1px solid rgba(223, 213, 198, 0.25)',
        }}
      >
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <p
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: '36px',
              marginBottom: '6px',
              color: '#F3ECE1',
            }}
          >
            {WEDDING_DETAILS.coupleNickname}
          </p>
          <p
            style={{
              fontSize: '12px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(243, 236, 225, 0.72)',
              marginBottom: '14px',
            }}
          >
            {WEDDING_DETAILS.dateNumeric} • {WEDDING_DETAILS.hashtag}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: '17px',
              color: '#DFD5C6',
              marginBottom: '10px',
            }}
          >
            &ldquo;Acima de tudo, porém, revistam-se do amor, que é o elo perfeito.&rdquo; —
            Colossenses 3:14
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(251, 249, 245, 0.6)' }}>
            Celebração cristã 100% sem álcool • Feito com carinho para nossa família, igreja e amigos
          </p>
        </div>
      </footer>
    </main>
  );
}
