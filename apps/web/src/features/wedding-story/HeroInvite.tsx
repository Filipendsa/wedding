'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, UserCheck } from 'lucide-react';
import {
  AnimatedContent,
  BlurText,
  ClickSpark,
  ShinyText,
  TornPaperDivider,
} from '@wending/ui';
import { WEDDING_DETAILS, WEDDING_PHOTOS } from '@wending/utils';

export function HeroInvite() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '82dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#3A342E',
        overflow: 'hidden',
      }}
    >
      {/* Foto Full-Bleed de Casal ao Pôr do Sol */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("${WEDDING_PHOTOS.heroCouple}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          filter: 'brightness(0.72) sepia(0.12)',
        }}
      />

      {/* Gradiente Editorial Suave (Papel Creme no topo + Sombra Quente embaixo) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(251, 249, 245, 0.55) 0%, rgba(44, 38, 35, 0.36) 45%, rgba(44, 38, 35, 0.72) 100%)',
        }}
      />

      {/* Espaçador superior */}
      <div style={{ position: 'relative', zIndex: 10, paddingTop: '32px', textAlign: 'center' }}>
        <ShinyText
          text="Save The Date • Sob a Bênção de Deus"
          baseColor="#2C2623"
          shineColor="#FBF9F5"
          speedSec={4.5}
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
          }}
        />
      </div>

      {/* Conteúdo Editorial Central */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '780px',
          margin: '0 auto',
          padding: '40px 20px 56px',
          textAlign: 'center',
          color: '#FBF9F5',
        }}
      >
        <BlurText
          as="h1"
          text={WEDDING_DETAILS.coupleNickname}
          animateBy="words"
          delayMs={60}
          stepDelayMs={130}
          style={{
            fontFamily: 'var(--font-script)',
            fontSize: 'clamp(48px, 11vw, 92px)',
            fontWeight: 400,
            lineHeight: 1.08,
            color: '#FBF9F5',
            textShadow: '0 4px 24px rgba(24, 20, 17, 0.45)',
            marginBottom: '16px',
          }}
        />

        <AnimatedContent direction="up" delayMs={220}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              marginBottom: '10px',
            }}
          >
            <span
              style={{
                height: '1px',
                width: '40px',
                backgroundColor: 'rgba(251, 249, 245, 0.7)',
              }}
            />
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: 600,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: '#FBF9F5',
              }}
            >
              Vamos Nos Casar
            </span>
            <span
              style={{
                height: '1px',
                width: '40px',
                backgroundColor: 'rgba(251, 249, 245, 0.7)',
              }}
            />
          </div>

          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(20px, 3vw, 26px)',
              fontWeight: 500,
              letterSpacing: '0.2em',
              color: '#F3ECE1',
              marginBottom: '12px',
            }}
          >
            {WEDDING_DETAILS.dateNumeric}
          </p>

          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 'clamp(16px, 2.4vw, 19px)',
              color: 'rgba(251, 249, 245, 0.94)',
              textShadow: '0 2px 12px rgba(24, 20, 17, 0.45)',
              marginBottom: '28px',
            }}
          >
            &ldquo;Nós amamos porque Ele nos amou primeiro.&rdquo; — 1 João 4:19
          </p>

          {/* CTAs Estilo Editorial com ClickSpark */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'center',
            }}
          >
            <ClickSpark sparkColor="#F3ECE1">
              <a
                href="#confirmar"
                className="touch-press"
                style={{
                  textDecoration: 'none',
                  padding: '14px 28px',
                  borderRadius: '999px',
                  backgroundColor: '#5A6346',
                  color: '#FBF9F5',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                }}
              >
                <Heart size={15} />
                Confirmar Presença
              </a>
            </ClickSpark>

            <ClickSpark sparkColor="#5A6346">
              <Link
                href="/painel"
                className="touch-press"
                style={{
                  textDecoration: 'none',
                  padding: '14px 26px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(251, 249, 245, 0.94)',
                  color: '#2C2623',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <UserCheck size={15} color="#5A6346" />
                Painel do Convidado
              </Link>
            </ClickSpark>
          </div>
        </AnimatedContent>
      </div>

      {/* Divisor de Borda de Papel Orgânico */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <TornPaperDivider fill="#FBF9F5" />
      </div>
    </section>
  );
}
