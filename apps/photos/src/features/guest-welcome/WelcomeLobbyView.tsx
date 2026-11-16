'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Camera,
  Image as ImageIcon,
  Award,
  User,
  ArrowRight,
  ListChecks,
} from 'lucide-react';
import { ChallengeBoardOutput } from '@wending/domain';
import {
  AnimatedContent,
  Badge,
  BlurText,
  BotanicalBranchIllustration,
  Card,
  ClickSpark,
  CountUp,
  ProgressBar,
  ShinyText,
} from '@wending/ui';
import { WEDDING_DETAILS } from '@wending/utils';
import { photosContainer } from '../../infrastructure/container';
import { PhotoBoothDock } from '../shared/PhotoBoothDock';
import { GuestIdentificationModal } from './GuestIdentificationModal';

export function WelcomeLobbyView() {
  const searchParams = useSearchParams();
  const [guestName, setGuestName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [board, setBoard] = useState<ChallengeBoardOutput | null>(null);

  useEffect(() => {
    async function init() {
      const guestParam = searchParams.get('guest');
      if (guestParam && guestParam.trim().length >= 2) {
        const res = await photosContainer.identifyGuestUseCase.execute({
          name: guestParam.trim(),
        });
        if (res.isSuccess) {
          setGuestName(res.getValue().name);
        }
      } else {
        const existing = await photosContainer.guestRepository.getCurrentGuest();
        if (existing) {
          setGuestName(existing.name.value);
        } else {
          setIsModalOpen(true);
        }
      }

      const boardData = await photosContainer.getChallengeBoardUseCase.execute();
      setBoard(boardData);
    }
    init();
  }, [searchParams]);

  const nextMissionId = board?.progress.nextSuggestedMission?.id ?? 'selfie-noivos';

  return (
    <main className="safe-bottom-booth" style={{ minHeight: '100vh', backgroundColor: '#FBF9F5' }}>
      <header
        style={{
          backgroundColor: '#F3ECE1',
          borderBottom: '1px solid #E8DFD1',
          padding: '32px 20px 26px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.35 }}>
          <BotanicalBranchIllustration size={96} color="#8C9275" />
        </div>

        <ShinyText
          text={`Photo Booth Oficial • ${WEDDING_DETAILS.hashtag}`}
          baseColor="#5A6346"
          shineColor="#C6A972"
          speedSec={4}
          style={{
            fontSize: '10.5px',
            fontWeight: 700,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}
        />

        <BlurText
          as="h1"
          text={WEDDING_DETAILS.coupleNickname}
          animateBy="words"
          delayMs={50}
          stepDelayMs={110}
          style={{
            fontFamily: 'var(--font-script)',
            fontSize: '46px',
            fontWeight: 400,
            color: '#2C2623',
            lineHeight: 1.1,
            marginBottom: '6px',
          }}
        />

        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '15px',
            color: '#5A6346',
            letterSpacing: '0.14em',
            marginBottom: '16px',
          }}
        >
          {WEDDING_DETAILS.dateNumeric}
        </p>

        {guestName && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FBF9F5',
              padding: '7px 16px',
              borderRadius: '999px',
              border: '1px solid #DFD5C6',
              fontSize: '13px',
              color: '#2C2623',
            }}
          >
            <User size={14} color="#5A6346" />
            <span>
              Olá, <strong>{guestName}</strong>
            </span>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#5A6346',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              trocar
            </button>
          </div>
        )}
      </header>

      <div
        style={{
          maxWidth: '580px',
          margin: '0 auto',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <Card padding="22px">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={18} color="#5A6346" />
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '21px',
                    fontWeight: 600,
                    color: '#2C2623',
                  }}
                >
                  {board?.progress.rankTitle || 'Seu Álbum de Desafios'}
                </h2>
              </div>
              <p style={{ fontSize: '13px', color: '#6E655F', marginTop: '3px' }}>
                <CountUp to={board?.progress.completedMissionsCount ?? 0} /> de{' '}
                {board?.progress.totalMissions ?? 8} missões •{' '}
                <CountUp to={board?.progress.totalPoints ?? 0} /> pts
              </p>
            </div>

            <Badge variant="olive">
              <CountUp to={board?.progress.progressPercent ?? 0} suffix="%" />
            </Badge>
          </div>

          <ProgressBar percent={board?.progress.progressPercent ?? 0} />

          <p style={{ fontSize: '13.5px', color: '#6E655F', marginTop: '14px', lineHeight: 1.6 }}>
            Capture os momentos mais especiais desse dia abençoado, aplique o carimbo comemorativo e
            guarde todas as lembranças em alta resolução.
          </p>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: '15px',
              color: '#5A6346',
              marginTop: '10px',
            }}
          >
            &ldquo;Tudo o que vocês fizerem, façam com amor.&rdquo; — 1 Coríntios 16:14
          </p>
        </Card>

        <Link
          href="/missions"
          style={{
            textDecoration: 'none',
            padding: '18px 22px',
            borderRadius: '16px',
            backgroundColor: '#5A6346',
            color: '#FBF9F5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 8px 24px rgba(67, 75, 50, 0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ListChecks size={24} />
            <div>
              <strong style={{ fontSize: '15px', display: 'block', letterSpacing: '0.04em' }}>
                Ver Missões Fotográficas
              </strong>
              <span style={{ fontSize: '12.5px', opacity: 0.88 }}>
                Escolha um desafio e ganhe pontos
              </span>
            </div>
          </div>
          <ArrowRight size={20} />
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Link
            href={`/camera?mission=${encodeURIComponent(nextMissionId)}`}
            style={{
              textDecoration: 'none',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '18px 14px',
              border: '1px solid #E8DFD1',
              color: '#2C2623',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              textAlign: 'center',
            }}
          >
            <Camera size={22} color="#5A6346" />
            <strong style={{ fontSize: '13.5px' }}>Câmera Rápida</strong>
            <span style={{ fontSize: '11.5px', color: '#6E655F' }}>Próximo desafio</span>
          </Link>

          <Link
            href="/gallery"
            style={{
              textDecoration: 'none',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '18px 14px',
              border: '1px solid #E8DFD1',
              color: '#2C2623',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              textAlign: 'center',
            }}
          >
            <ImageIcon size={22} color="#5A6346" />
            <strong style={{ fontSize: '13.5px' }}>
              Minha Galeria ({board?.photos.length ?? 0})
            </strong>
            <span style={{ fontSize: '11.5px', color: '#6E655F' }}>Ver e baixar fotos</span>
          </Link>
        </div>
      </div>

      <PhotoBoothDock
        activeTab="home"
        nextMissionId={nextMissionId}
        photosCount={board?.photos.length}
      />

      <GuestIdentificationModal
        isOpen={isModalOpen}
        initialName={guestName}
        onSave={(savedName) => {
          setGuestName(savedName);
          setIsModalOpen(false);
        }}
      />
    </main>
  );
}
