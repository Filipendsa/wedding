'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, Clock } from 'lucide-react';
import {
  AnimatedContent,
  BotanicalBranchIllustration,
  CeremonyArchIllustration,
  CountUp,
  DinnerCutleryIllustration,
  OpenBibleHeartIllustration,
  PartyMusicIllustration,
  RingsIllustration,
  SplitText,
  SpotlightCard,
  TiltedCard,
  TornPaperDivider,
  WeddingCakeIllustration,
} from '@wending/ui';
import { WEDDING_DETAILS, WEDDING_PHOTOS } from '@wending/utils';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetIso: string): TimeLeft {
  const diff = Math.max(0, new Date(targetIso).getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function StorySection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(WEDDING_DETAILS.targetDateISO)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(WEDDING_DETAILS.targetDateISO));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* 1. THE BIG DAY — Contador Regressivo + Polaroid Inclinada */}
      <section
        style={{
          backgroundColor: '#FBF9F5',
          padding: '48px 20px 76px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            maxWidth: '1040px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            alignItems: 'center',
            gap: '32px',
          }}
        >
          {/* Ramo Botânico à Esquerda */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <BotanicalBranchIllustration size={92} color="#8C9275" />
            <p
              style={{
                fontFamily: 'var(--font-script)',
                fontSize: '26px',
                color: '#5A6346',
                marginTop: '6px',
              }}
            >
              Contando os dias...
            </p>
          </div>

          {/* Contador Central */}
          <div style={{ textAlign: 'center' }}>
            <p className="editorial-label" style={{ marginBottom: '16px' }}>
              O Grande Dia
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 'clamp(16px, 4vw, 34px)',
                marginBottom: '18px',
              }}
            >
              {[
                { value: timeLeft.days, label: 'Dias' },
                { value: timeLeft.hours, label: 'Horas' },
                { value: timeLeft.minutes, label: 'Min' },
                { value: timeLeft.seconds, label: 'Seg' },
              ].map((item) => (
                <div key={item.label} style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(36px, 5vw, 54px)',
                      fontWeight: 500,
                      color: '#2C2623',
                      lineHeight: 1,
                    }}
                  >
                    <CountUp to={item.value} padDigits={2} durationMs={750} />
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: '#8C9275',
                      marginTop: '8px',
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: '13.5px', color: '#6E655F' }}>
              {WEDDING_DETAILS.dateEstimate} • {WEDDING_DETAILS.venueName}
            </p>
          </div>

          {/* Polaroid Inclinada à Direita */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TiltedCard initialRotateDeg={3.5} maxTiltDeg={7} style={{ width: '210px' }}>
              <div className="polaroid-frame-editorial" style={{ position: 'relative' }}>
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '4 / 5',
                    overflow: 'hidden',
                    backgroundColor: '#EFE7DA',
                  }}
                >
                  <img
                    src={WEDDING_PHOTOS.countdownPolaroid}
                    alt="Isabelle e Vinícius"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-script)',
                    fontSize: '21px',
                    color: '#5A6346',
                    textAlign: 'center',
                    marginTop: '10px',
                  }}
                >
                  Para sempre nós dois
                </p>
              </div>
            </TiltedCard>
          </div>
        </div>
      </section>

      {/* 2. OUR STORY — Duas Pessoas, Uma Linda Jornada */}
      <section
        id="historia"
        style={{
          backgroundColor: '#F3ECE1',
          padding: '76px 20px',
          borderTop: '1px solid #E8DFD1',
          borderBottom: '1px solid #E8DFD1',
        }}
      >
        <div
          style={{
            maxWidth: '980px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          {/* Foto Moldurada Inclinada + Ramo Botânico */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <TiltedCard
              initialRotateDeg={-2.5}
              maxTiltDeg={7}
              style={{ width: '100%', maxWidth: '340px' }}
            >
              <div
                className="polaroid-frame-editorial"
                style={{ padding: '12px 12px 24px 12px' }}
              >
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '4 / 5',
                    overflow: 'hidden',
                    backgroundColor: '#E8DFD1',
                  }}
                >
                  <img
                    src={WEDDING_PHOTOS.storyCouple}
                    alt="Nossa história"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
            </TiltedCard>
            <div style={{ position: 'absolute', bottom: '-18px', right: '18px' }}>
              <BotanicalBranchIllustration size={86} color="#5A6346" />
            </div>
          </div>

          {/* Texto Editorial */}
          <AnimatedContent direction="up" delayMs={100}>
            <div style={{ textAlign: 'left' }}>
              <p className="editorial-label" style={{ marginBottom: '10px' }}>
                Nossa História
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(30px, 4vw, 42px)',
                  fontWeight: 500,
                  color: '#2C2623',
                  lineHeight: 1.15,
                  marginBottom: '18px',
                }}
              >
                <SplitText text="Duas Pessoas, Uma Linda Jornada" align="left" />
              </h2>

            <p
              style={{
                fontSize: '15px',
                color: '#6E655F',
                lineHeight: 1.85,
                marginBottom: '18px',
              }}
            >
              Desde o primeiro encontro, vimos a mão de Deus guiando os nossos passos. Entre
              orações, risadas e tantos planos compartilhados, construímos uma história cheia de
              propósito, fé e carinho.
            </p>

            <p
              style={{
                fontSize: '15px',
                color: '#6E655F',
                lineHeight: 1.85,
                marginBottom: '26px',
              }}
            >
              Chegou o momento de consagrarmos o nosso amor diante do Senhor, cercados pelas pessoas
              que sempre oraram e torceram por nós: nossa família, irmãos na fé e amigos queridos.
            </p>

            <div
              style={{
                borderLeft: '2px solid #5A6346',
                paddingLeft: '18px',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontSize: '19px',
                  color: '#2C2623',
                  marginBottom: '6px',
                }}
              >
                &ldquo;Melhor é serem dois do que um... o cordão de três dobras não se rompe com
                facilidade.&rdquo;
              </p>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#5A6346',
                }}
              >
                Eclesiastes 4:9, 12
              </span>
            </div>
            </div>
          </AnimatedContent>
        </div>

        {/* Faixa Fofa de Passagens Bíblicas */}
        <div
          style={{
            maxWidth: '980px',
            margin: '54px auto 0',
            paddingTop: '42px',
            borderTop: '1px solid #DFD5C6',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '26px' }}>
            <OpenBibleHeartIllustration size={40} color="#5A6346" style={{ marginBottom: '6px' }} />
            <p className="editorial-label" style={{ marginBottom: '4px' }}>
              Palavras que Guardamos no Coração
            </p>
          </div>

          <div className="mobile-snap-grid hide-scrollbar">
            {[
              {
                verse:
                  '“O amor é paciente, o amor é bondoso... Tudo sofre, tudo crê, tudo espera, tudo suporta.”',
                ref: '1 Coríntios 13:4, 7',
              },
              {
                verse:
                  '“As muitas águas não podem apagar esse amor, nem os rios conseguem afogá-lo.”',
                ref: 'Cântico dos Cânticos 8:7',
              },
              {
                verse:
                  '“Aonde quer que fores, irei eu... o teu povo é o meu povo, e o teu Deus é o meu Deus.”',
                ref: 'Rute 1:16',
              },
            ].map((item, idx) => (
              <AnimatedContent key={item.ref} direction="up" delayMs={idx * 90}>
                <SpotlightCard
                  backgroundColor="#FBF9F5"
                  borderColor="#E8DFD1"
                  borderRadius="14px"
                  padding="22px 20px"
                  spotlightColor="rgba(198, 169, 114, 0.16)"
                  style={{ height: '100%', textAlign: 'center' }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontStyle: 'italic',
                      fontSize: '17px',
                      color: '#2C2623',
                      lineHeight: 1.55,
                      marginBottom: '10px',
                    }}
                  >
                    {item.verse}
                  </p>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: '#5A6346',
                    }}
                  >
                    {item.ref}
                  </span>
                </SpotlightCard>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>

      {/* 3. THE EVENTS + TIMELINE VERTICAL DO GRANDE DIA */}
      <section
        id="eventos"
        style={{
          backgroundColor: '#FBF9F5',
          padding: '84px 20px',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '1040px', margin: '0 auto', textAlign: 'center' }}>
          <p className="editorial-label" style={{ marginBottom: '10px' }}>
            Os Eventos
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(30px, 4vw, 42px)',
              fontWeight: 500,
              color: '#2C2623',
              marginBottom: '44px',
            }}
          >
            <SplitText text="Vamos Celebrar Juntos" />
          </h2>

          {/* 3 Cards com Ilustrações Line-Art (Swipeable no mobile) */}
          <div className="mobile-snap-grid hide-scrollbar" style={{ marginBottom: '64px' }}>
            <AnimatedContent direction="up" delayMs={0}>
              <SpotlightCard
                backgroundColor="#FFFFFF"
                borderColor="#E8DFD1"
                borderRadius="14px"
                padding="32px 22px"
                style={{ height: '100%', textAlign: 'center' }}
              >
                <RingsIllustration size={46} color="#5A6346" style={{ marginBottom: '14px' }} />
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '23px',
                    fontWeight: 600,
                    color: '#2C2623',
                    marginBottom: '8px',
                  }}
                >
                  Cerimônia Religiosa
                </h3>
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    color: '#8C9275',
                    textTransform: 'uppercase',
                    marginBottom: '12px',
                  }}
                >
                  {WEDDING_DETAILS.ceremonyTime} • Culto de Gratidão
                </p>
                <p style={{ fontSize: '13.5px', color: '#6E655F', lineHeight: 1.65 }}>
                  {WEDDING_DETAILS.venueName}
                  <br />
                  {WEDDING_DETAILS.venueAddress}
                </p>
              </SpotlightCard>
            </AnimatedContent>

            <AnimatedContent direction="up" delayMs={90}>
              <SpotlightCard
                backgroundColor="#FFFFFF"
                borderColor="#E8DFD1"
                borderRadius="14px"
                padding="32px 22px"
                style={{ height: '100%', textAlign: 'center' }}
              >
                <WeddingCakeIllustration size={46} color="#5A6346" style={{ marginBottom: '14px' }} />
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '23px',
                    fontWeight: 600,
                    color: '#2C2623',
                    marginBottom: '8px',
                  }}
                >
                  Recepção &amp; Jantar
                </h3>
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    color: '#8C9275',
                    textTransform: 'uppercase',
                    marginBottom: '12px',
                  }}
                >
                  18h00 • Comunhão Sem Álcool
                </p>
                <p style={{ fontSize: '13.5px', color: '#6E655F', lineHeight: 1.65 }}>
                  Jantar festivo especial, mesa de doces, sucos naturais e muita comunhão cristã (evento
                  100% sem álcool).
                </p>
              </SpotlightCard>
            </AnimatedContent>

            <AnimatedContent direction="up" delayMs={180}>
              <SpotlightCard
                backgroundColor="#FFFFFF"
                borderColor="#E8DFD1"
                borderRadius="14px"
                padding="32px 22px"
                style={{ height: '100%', textAlign: 'center' }}
              >
                <CeremonyArchIllustration size={46} color="#5A6346" style={{ marginBottom: '14px' }} />
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '23px',
                    fontWeight: 600,
                    color: '#2C2623',
                    marginBottom: '8px',
                  }}
                >
                  Traje &amp; Dicas
                </h3>
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    color: '#8C9275',
                    textTransform: 'uppercase',
                    marginBottom: '12px',
                  }}
                >
                  Social Leve / Esporte Fino
                </p>
                <p style={{ fontSize: '13.5px', color: '#6E655F', lineHeight: 1.65 }}>
                  Tons claros, terrosos ou florais combinam com o jardim. Tudo preparado com leveza e
                  alegria para toda a família!
                </p>
              </SpotlightCard>
            </AnimatedContent>
          </div>

          {/* Cronograma Vertical Inspirado na Referência Direita */}
          <div
            style={{
              maxWidth: '580px',
              margin: '0 auto',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E8DFD1',
              borderRadius: '18px',
              padding: '40px 28px',
            }}
          >
            <p className="editorial-label" style={{ marginBottom: '8px' }}>
              Programação
            </p>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '28px',
                fontWeight: 500,
                color: '#2C2623',
                marginBottom: '32px',
              }}
            >
              Linha do Tempo do Dia
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', textAlign: 'left' }}>
              {[
                {
                  time: '15:30',
                  title: 'Chegada dos Convidados',
                  desc: 'Recepção no jardim com águas saborizadas, sucos naturais e música ambiente',
                  icon: <MapPin size={22} color="#5A6346" strokeWidth={1.6} />,
                },
                {
                  time: '16:30',
                  title: 'A Cerimônia',
                  desc: 'Louvor, Palavra de Deus e o nosso “sim” ao pôr do sol sob as oliveiras',
                  icon: <RingsIllustration size={30} color="#5A6346" />,
                },
                {
                  time: '18:00',
                  title: 'Corte do Bolo & Photo Booth',
                  desc: 'Fotos com a família, corte do bolo e desafios fotográficos pelo QR Code',
                  icon: <WeddingCakeIllustration size={30} color="#5A6346" />,
                },
                {
                  time: '19:30',
                  title: 'Jantar de Confraternização',
                  desc: 'Gastronomia especial preparada com carinho e bebidas 100% sem álcool',
                  icon: <DinnerCutleryIllustration size={30} color="#5A6346" />,
                },
                {
                  time: '21:00',
                  title: 'Louvor & Comunhão',
                  desc: 'Música especial ao vivo, homenagens e alegria na presença de Deus',
                  icon: <PartyMusicIllustration size={30} color="#5A6346" />,
                },
              ].map((step, index, arr) => (
                <AnimatedContent key={step.time} direction="up" delayMs={index * 70}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '56px 40px 1fr',
                      alignItems: 'center',
                      gap: '12px',
                      position: 'relative',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '19px',
                        fontWeight: 600,
                        color: '#5A6346',
                        textAlign: 'right',
                      }}
                    >
                      {step.time}
                    </span>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#F3ECE1',
                          border: '1px solid #DFD5C6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 2,
                        }}
                      >
                        {step.icon}
                      </div>
                      {index < arr.length - 1 && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '40px',
                            width: '1px',
                            height: '28px',
                            backgroundColor: '#DFD5C6',
                          }}
                        />
                      )}
                    </div>

                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#2C2623' }}>
                        {step.title}
                      </h4>
                      <p style={{ fontSize: '13px', color: '#6E655F', marginTop: '2px' }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </AnimatedContent>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE GALLERY — Faixa Horizontal de Momentos */}
      <section
        style={{
          backgroundColor: '#F3ECE1',
          padding: '72px 20px 0',
          borderTop: '1px solid #E8DFD1',
        }}
      >
        <div style={{ maxWidth: '1080px', margin: '0 auto', textAlign: 'center' }}>
          <p className="editorial-label" style={{ marginBottom: '10px' }}>
            Galeria do Casal
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 4vw, 38px)',
              fontWeight: 500,
              color: '#2C2623',
              marginBottom: '32px',
            }}
          >
            <SplitText text="Momentos que Guardaremos para Sempre" />
          </h2>

          <div
            className="mobile-snap-grid mobile-snap-gallery hide-scrollbar"
            style={{ marginBottom: '36px' }}
          >
            {[
              WEDDING_PHOTOS.gallery1,
              WEDDING_PHOTOS.gallery2,
              WEDDING_PHOTOS.gallery3,
              WEDDING_PHOTOS.gallery4,
            ].map((src, idx) => (
              <TiltedCard key={idx} maxTiltDeg={5} scaleOnHover={1.03}>
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '8px',
                    border: '1px solid #E8DFD1',
                    boxShadow: '0 8px 20px rgba(44, 38, 35, 0.06)',
                  }}
                >
                  <div style={{ aspectRatio: '4 / 3', overflow: 'hidden', backgroundColor: '#EFE7DA' }}>
                    <img
                      src={src}
                      alt={`Momento do casal ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </TiltedCard>
            ))}
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#5A6346',
              marginBottom: '28px',
            }}
          >
            <Clock size={15} />
            <span style={{ fontSize: '12.5px', fontWeight: 600 }}>
              Fotos ilustrativas — em breve com o ensaio oficial de {WEDDING_DETAILS.coupleNickname}
            </span>
          </div>
        </div>

        <TornPaperDivider fill="#FBF9F5" />
      </section>
    </>
  );
}
