'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Award, ArrowLeft, Image as ImageIcon, Sparkles } from 'lucide-react';
import { ChallengeBoardOutput, ChallengeCategory } from '@wending/domain';
import { Badge, Card, CountUp, ProgressBar } from '@wending/ui';
import { photosContainer } from '../../infrastructure/container';
import { GuestIdentificationModal } from '../guest-welcome/GuestIdentificationModal';
import { PhotoBoothDock } from '../shared/PhotoBoothDock';
import { ChallengeCard } from './ChallengeCard';

type CategoryFilter = 'todas' | ChallengeCategory;

export function MissionsBoardView() {
  const [board, setBoard] = useState<ChallengeBoardOutput | null>(null);
  const [guestName, setGuestName] = useState('');
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('todas');

  useEffect(() => {
    async function load() {
      const [guest, boardData] = await Promise.all([
        photosContainer.guestRepository.getCurrentGuest(),
        photosContainer.getChallengeBoardUseCase.execute(),
      ]);
      if (guest) {
        setGuestName(guest.name.value);
      } else {
        setIsGuestModalOpen(true);
      }
      setBoard(boardData);
    }
    load();
  }, []);

  const filteredChallenges = (board?.challenges ?? []).filter((c) => {
    if (selectedCategory === 'todas') return true;
    return c.category === selectedCategory;
  });

  const nextMissionId = board?.progress.nextSuggestedMission?.id ?? 'selfie-noivos';

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#FBF9F5', paddingBottom: '96px' }}>
      <header
        style={{
          backgroundColor: '#F3ECE1',
          borderBottom: '1px solid #E8DFD1',
          padding: '16px 20px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: '640px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#2C2623',
              fontWeight: 600,
              fontSize: '13px',
            }}
          >
            <ArrowLeft size={17} />
            Início
          </Link>

          <strong
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '21px',
              fontWeight: 600,
              color: '#2C2623',
            }}
          >
            Desafios Fotográficos
          </strong>

          <Link
            href="/gallery"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '999px',
              backgroundColor: '#FBF9F5',
              border: '1px solid #DFD5C6',
              color: '#2C2623',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            <ImageIcon size={14} color="#5A6346" />
            Galeria ({board?.photos.length ?? 0})
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '20px 16px' }}>
        <Card padding="22px" style={{ marginBottom: '20px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
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
                  {board?.progress.rankTitle || 'Suas Missões'}
                </h2>
              </div>
              <p style={{ fontSize: '13px', color: '#6E655F', marginTop: '2px' }}>
                <CountUp to={board?.progress.completedMissionsCount ?? 0} /> de{' '}
                {board?.progress.totalMissions ?? 8} concluídas •{' '}
                <CountUp to={board?.progress.totalPoints ?? 0} /> pts
              </p>
            </div>
            <Badge variant="olive">
              <CountUp to={board?.progress.progressPercent ?? 0} suffix="%" />
            </Badge>
          </div>

          <ProgressBar percent={board?.progress.progressPercent ?? 0} />

          {board?.progress.isAllCompleted && (
            <div
              style={{
                marginTop: '12px',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: '#F3ECE1',
                border: '1px solid #5A6346',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#434B32',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              <Sparkles size={16} />
              Incrível! Você completou 100% das missões do casamento!
            </div>
          )}
        </Card>

        <div className="mobile-chip-row hide-scrollbar" style={{ marginBottom: '14px' }}>
          {[
            { id: 'todas', label: 'Todas' },
            { id: 'noivos', label: 'Noivos' },
            { id: 'festa', label: 'Festa' },
            { id: 'divertido', label: 'Divertido' },
            { id: 'detalhes', label: 'Detalhes' },
          ].map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as CategoryFilter)}
                className="touch-press"
                style={{
                  padding: '8px 18px',
                  borderRadius: '999px',
                  border: isSelected ? '1px solid #5A6346' : '1px solid #DFD5C6',
                  backgroundColor: isSelected ? '#5A6346' : '#FFFFFF',
                  color: isSelected ? '#FBF9F5' : '#2C2623',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredChallenges.map((challenge, idx) => {
            const completed = board?.photos.find((p) => p.missionId === challenge.id);
            return (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                completedPhoto={completed}
                index={idx}
              />
            );
          })}
        </section>
      </div>

      <PhotoBoothDock
        activeTab="missions"
        nextMissionId={nextMissionId}
        photosCount={board?.photos.length}
      />

      <GuestIdentificationModal
        isOpen={isGuestModalOpen}
        initialName={guestName}
        onSave={(saved) => {
          setGuestName(saved);
          setIsGuestModalOpen(false);
        }}
      />
    </main>
  );
}
