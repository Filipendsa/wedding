'use client';

import React from 'react';
import { Camera, ArrowRight, Sparkles } from 'lucide-react';
import {
  AnimatedContent,
  ClickSpark,
  QrCodeSvg,
  ShinyText,
  SpotlightCard,
  TiltedCard,
} from '@wending/ui';
import { WEDDING_DETAILS, WEDDING_PHOTOS } from '@wending/utils';

export function PhotoBoothCtaSection() {
  return (
    <section
      id="photo-booth"
      style={{
        padding: '72px 18px',
        backgroundColor: '#FBF9F5',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <AnimatedContent direction="up">
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E8DFD1',
              padding: '36px 24px',
              boxShadow: '0 14px 36px rgba(44, 38, 35, 0.05)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '34px',
              alignItems: 'center',
            }}
          >
            {/* Lado Esquerdo: Foto Romântica + Hashtag */}
            <div style={{ textAlign: 'center' }}>
              <TiltedCard
                initialRotateDeg={-1.5}
                maxTiltDeg={6}
                style={{ maxWidth: '290px', margin: '0 auto 18px' }}
              >
                <div className="polaroid-frame-editorial">
                  <div style={{ aspectRatio: '4 / 4', overflow: 'hidden', backgroundColor: '#F3ECE1' }}>
                    <img
                      src={WEDDING_PHOTOS.shareLoveCouple}
                      alt="Compartilhe o amor no Photo Booth"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-script)',
                      fontSize: '24px',
                      color: '#5A6346',
                      marginTop: '10px',
                    }}
                  >
                    Compartilhe cada sorriso
                  </p>
                </div>
              </TiltedCard>

              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: '#5A6346',
                  padding: '7px 20px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                }}
              >
                <ShinyText
                  text={WEDDING_DETAILS.hashtag}
                  baseColor="#FBF9F5"
                  shineColor="#C6A972"
                  speedSec={3.6}
                />
              </span>
            </div>

            {/* Lado Direito: Explicativo + QR Code */}
            <div>
              <p className="editorial-label" style={{ marginBottom: '8px' }}>
                Share The Love • Photo Booth
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(28px, 4vw, 34px)',
                  fontWeight: 500,
                  color: '#2C2623',
                  lineHeight: 1.2,
                  marginBottom: '14px',
                }}
              >
                Desafios Fotográficos pelo QR Code
              </h2>

              <p
                style={{
                  fontSize: '14.5px',
                  color: '#6E655F',
                  lineHeight: 1.7,
                  marginBottom: '22px',
                }}
              >
                Ajude a registrar o nosso grande dia! Escaneie o QR Code na sua mesa para abrir a
                câmera no celular, cumprir missões divertidas e aplicar o carimbo comemorativo{' '}
                <strong>Isa &amp; Vini</strong> nas suas fotos.
              </p>

              <SpotlightCard
                backgroundColor="#F3ECE1"
                borderColor="#DFD5C6"
                borderRadius="14px"
                padding="18px 20px"
                spotlightColor="rgba(90, 99, 70, 0.14)"
                style={{ marginBottom: '22px' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '18px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid #E8DFD1',
                    }}
                  >
                    <QrCodeSvg value={WEDDING_DETAILS.photoBoothUrl} size={92} darkColor="#2C2623" />
                  </div>

                  <div style={{ flex: 1, minWidth: '170px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#434B32',
                        fontWeight: 700,
                        fontSize: '13px',
                        marginBottom: '4px',
                      }}
                    >
                      <Sparkles size={15} />
                      <span>Aponte a câmera do celular</span>
                    </div>
                    <p style={{ fontSize: '12.5px', color: '#6E655F', lineHeight: 1.5 }}>
                      Sem baixar aplicativos. Todas as suas fotos ficam salvas na sua galeria em alta
                      resolução.
                    </p>
                  </div>
                </div>
              </SpotlightCard>

              <ClickSpark sparkColor="#C6A972">
                <a
                  href={WEDDING_DETAILS.photoBoothUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-press"
                  style={{
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '14px 26px',
                    borderRadius: '999px',
                    backgroundColor: '#5A6346',
                    color: '#FBF9F5',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    boxShadow: '0 6px 18px rgba(67, 75, 50, 0.22)',
                  }}
                >
                  <Camera size={16} />
                  Abrir Photo Booth Agora
                  <ArrowRight size={15} />
                </a>
              </ClickSpark>
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
