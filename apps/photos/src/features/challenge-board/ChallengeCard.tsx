'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, CheckCircle2, Award, Image as ImageIcon } from 'lucide-react';
import { ChallengePhotoPrimitives, PhotoChallengePrimitives } from '@wending/domain';
import { AnimatedContent, ClickSpark, SpotlightCard } from '@wending/ui';

interface ChallengeCardProps {
  challenge: PhotoChallengePrimitives;
  completedPhoto?: ChallengePhotoPrimitives;
  index?: number;
}

export function ChallengeCard({ challenge, completedPhoto, index = 0 }: ChallengeCardProps) {
  const isCompleted = Boolean(completedPhoto);

  return (
    <AnimatedContent direction="up" delayMs={Math.min(index * 55, 280)}>
      <SpotlightCard
        backgroundColor="#FFFFFF"
        borderColor={isCompleted ? '#5A6346' : '#E8DFD1'}
        borderRadius="16px"
        padding="20px"
        spotlightColor="rgba(90, 99, 70, 0.14)"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: isCompleted
            ? '0 8px 24px rgba(90, 99, 70, 0.1)'
            : '0 4px 16px rgba(44, 38, 35, 0.04)',
          position: 'relative',
        }}
      >
      {isCompleted && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: '#5A6346',
            color: '#FBF9F5',
            fontSize: '10.5px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            padding: '4px 10px',
            borderRadius: '999px',
          }}
        >
          <CheckCircle2 size={12} />
          CONCLUÍDA
        </div>
      )}

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#F3ECE1',
              border: '1px solid #DFD5C6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
            }}
          >
            {challenge.icon}
          </span>
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 600,
                color: '#2C2623',
                margin: 0,
              }}
            >
              {challenge.title}
            </h3>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11.5px',
                fontWeight: 600,
                color: '#5A6346',
                marginTop: '2px',
              }}
            >
              <Award size={12} /> +{challenge.rewardPoints} pts
            </span>
          </div>
        </div>

        <p
          style={{
            fontSize: '13.5px',
            color: '#6E655F',
            lineHeight: 1.5,
            marginBottom: '18px',
          }}
        >
          {challenge.description}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        {isCompleted ? (
          <>
            <Link
              href="/gallery"
              style={{
                flex: 1,
                textDecoration: 'none',
                padding: '10px 14px',
                borderRadius: '999px',
                border: '1px solid #5A6346',
                background: '#FBF9F5',
                color: '#434B32',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <ImageIcon size={14} />
              Ver Foto
            </Link>

            <Link
              href={`/camera?mission=${encodeURIComponent(challenge.id)}`}
              style={{
                textDecoration: 'none',
                padding: '10px 16px',
                borderRadius: '999px',
                background: '#F3ECE1',
                border: '1px solid #DFD5C6',
                color: '#2C2623',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Camera size={14} />
              Refazer
            </Link>
          </>
        ) : (
          <ClickSpark sparkColor="#C6A972" style={{ width: '100%' }}>
            <Link
              href={`/camera?mission=${encodeURIComponent(challenge.id)}`}
              className="touch-press"
              style={{
                width: '100%',
                textDecoration: 'none',
                padding: '12px',
                borderRadius: '999px',
                backgroundColor: '#5A6346',
                color: '#FBF9F5',
                fontSize: '12.5px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Camera size={16} />
              Cumprir Missão
            </Link>
          </ClickSpark>
        )}
      </div>
      </SpotlightCard>
    </AnimatedContent>
  );
}
