'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Download, Check, RotateCcw, Sparkles, Camera } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ClickSpark, TiltedCard } from '@wending/ui';
import { WEDDING_DETAILS, WEDDING_MISSIONS } from '@wending/utils';
import { photosContainer } from '../../infrastructure/container';
import {
  PendingPhotoDraft,
  sessionPhotoDraftStore,
} from '../../infrastructure/persistence/SessionPhotoDraftStore';

export function PhotoReviewView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [draft, setDraft] = useState<PendingPhotoDraft | null>(null);
  const [guestName, setGuestName] = useState('Convidado Especial');
  const [caption, setCaption] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadedDraft = sessionPhotoDraftStore.getDraft();
    setDraft(loadedDraft);
    photosContainer.guestRepository.getCurrentGuest().then((g) => {
      if (g) setGuestName(g.name.value);
    });
  }, []);

  const missionId = searchParams.get('mission') || draft?.missionId || WEDDING_MISSIONS[0].id;
  const mission = useMemo(
    () => WEDDING_MISSIONS.find((m) => m.id === missionId) ?? WEDDING_MISSIONS[0],
    [missionId]
  );

  const handleConfirm = async () => {
    if (!draft) return;
    setIsSaving(true);

    const res = await photosContainer.reviewAndSubmitPhotoUseCase.execute({
      missionId: mission.id,
      guestName,
      dataUrl: draft.dataUrl,
      caption,
      frameStyle: draft.frameStyle,
    });

    if (res.isFailure) {
      alert(res.getError());
      setIsSaving(false);
      return;
    }

    confetti({
      particleCount: 85,
      spread: 65,
      origin: { y: 0.6 },
      colors: ['#5A6346', '#8C9275', '#DFD5C6', '#B97A57'],
    });

    sessionPhotoDraftStore.clearDraft();
    setTimeout(() => {
      router.push('/missions');
    }, 500);
  };

  const handleDownload = () => {
    if (!draft) return;
    const link = document.createElement('a');
    link.href = draft.dataUrl;
    link.download = `isa-vini-${mission.id}-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!draft) {
    return (
      <main
        style={{
          minHeight: '100vh',
          backgroundColor: '#FBF9F5',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: '44px', marginBottom: '12px' }}>📸</span>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '26px',
            color: '#2C2623',
            marginBottom: '8px',
          }}
        >
          Nenhuma foto em revisão
        </h1>
        <p style={{ fontSize: '14px', color: '#6E655F', marginBottom: '20px' }}>
          Tire uma foto em uma das missões para visualizar e enviar aqui.
        </p>
        <Link
          href={`/camera?mission=${encodeURIComponent(mission.id)}`}
          style={{
            textDecoration: 'none',
            padding: '12px 24px',
            borderRadius: '999px',
            backgroundColor: '#5A6346',
            color: '#FBF9F5',
            fontWeight: 600,
            fontSize: '12.5px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Camera size={16} />
          Ir para Câmera
        </Link>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#2C2623',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '440px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#DFD5C6',
              fontWeight: 600,
              fontSize: '14px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            <Sparkles size={16} />
            <span>Revise sua foto</span>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: '15px',
              color: 'rgba(243, 236, 225, 0.8)',
              marginTop: '4px',
            }}
          >
            &ldquo;Alegrem-se sempre no Senhor!&rdquo; — Filipenses 4:4
          </p>
        </div>

        <TiltedCard maxTiltDeg={6} style={{ width: '100%', maxWidth: '380px' }}>
          <div className="polaroid-frame" style={{ width: '100%' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              paddingTop: '125%',
              backgroundColor: '#181512',
              borderRadius: '3px',
              overflow: 'hidden',
            }}
          >
            <img
              src={draft.dataUrl}
              alt={mission.title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          <div
            style={{
              marginTop: '16px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 600,
                color: '#2C2623',
              }}
            >
              {mission.title}
            </p>
            <p style={{ fontSize: '12px', color: '#5A6346', fontWeight: 600 }}>
              {WEDDING_DETAILS.coupleNickname} • Por {guestName}
            </p>
          </div>
        </div>
        </TiltedCard>

        <input
          type="text"
          placeholder="Escreva uma legenda especial (opcional)..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '380px',
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid #DFD5C6',
            backgroundColor: '#FBF9F5',
            fontSize: '14px',
            outline: 'none',
            color: '#2C2623',
          }}
        />

        <div
          style={{
            display: 'flex',
            gap: '10px',
            width: '100%',
            maxWidth: '380px',
          }}
        >
          <button
            onClick={() => router.push(`/camera?mission=${encodeURIComponent(mission.id)}`)}
            disabled={isSaving}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '999px',
              backgroundColor: 'rgba(251,249,245,0.12)',
              border: '1px solid rgba(223,213,198,0.4)',
              color: '#FBF9F5',
              fontSize: '12.5px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <RotateCcw size={15} />
            Refazer
          </button>

          <button
            onClick={handleDownload}
            style={{
              padding: '12px 16px',
              borderRadius: '999px',
              backgroundColor: 'rgba(251,249,245,0.12)',
              border: '1px solid rgba(223,213,198,0.4)',
              color: '#FBF9F5',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Baixar foto"
          >
            <Download size={16} />
          </button>

          <ClickSpark sparkColor="#C6A972" style={{ flex: 2 }}>
            <button
              onClick={handleConfirm}
              disabled={isSaving}
              className="touch-press"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '999px',
                border: '1px solid #DFD5C6',
                backgroundColor: '#5A6346',
                color: '#FBF9F5',
                fontSize: '12.5px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Check size={16} />
              {isSaving ? 'Salvando...' : 'Concluir Missão'}
            </button>
          </ClickSpark>
        </div>
      </div>
    </main>
  );
}
