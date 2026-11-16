'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RefreshCw, X, Sparkles, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { PhotoFrameStyle, PhotoStampMetadata } from '@wending/domain';
import { WEDDING_DETAILS, WEDDING_MISSIONS } from '@wending/utils';
import { getCameraStream } from '../../infrastructure/camera/CameraStrategies';
import { photosContainer } from '../../infrastructure/container';
import { sessionPhotoDraftStore } from '../../infrastructure/persistence/SessionPhotoDraftStore';

const FRAME_LABELS: Record<PhotoFrameStyle, string> = {
  'tropical-badge': 'Selo Oliva',
  polaroid: 'Polaroid',
  clean: 'Sem Selo',
};

const FRAME_ORDER: PhotoFrameStyle[] = ['tropical-badge', 'polaroid', 'clean'];

export function CameraBoothView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const missionId = searchParams.get('mission') || WEDDING_MISSIONS[0].id;

  const mission = useMemo(
    () => WEDDING_MISSIONS.find((m) => m.id === missionId) ?? WEDDING_MISSIONS[0],
    [missionId]
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [guestName, setGuestName] = useState('Convidado Especial');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [frameStyle, setFrameStyle] = useState<PhotoFrameStyle>('tropical-badge');
  const [isCapturing, setIsCapturing] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    photosContainer.guestRepository.getCurrentGuest().then((g) => {
      if (g) setGuestName(g.name.value);
    });
  }, []);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    let isCancelled = false;

    async function initCamera() {
      setErrorMessage(null);
      try {
        const newStream = await getCameraStream({ facingMode });
        if (isCancelled) {
          newStream.getTracks().forEach((t) => t.stop());
          return;
        }
        activeStream = newStream;
        setStream(newStream);

        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
          videoRef.current.play().catch(console.error);
        }
      } catch {
        if (!isCancelled) {
          setErrorMessage(
            'Não foi possível abrir a câmera ao vivo. Você pode tirar ou escolher uma foto usando o botão abaixo.'
          );
        }
      }
    }

    initCamera();

    return () => {
      isCancelled = true;
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const cycleFrameStyle = () => {
    const idx = FRAME_ORDER.indexOf(frameStyle);
    setFrameStyle(FRAME_ORDER[(idx + 1) % FRAME_ORDER.length]);
  };

  const navigateToReview = (dataUrl: string) => {
    sessionPhotoDraftStore.saveDraft({
      missionId: mission.id,
      dataUrl,
      frameStyle,
      capturedAt: Date.now(),
    });
    router.push(`/review?mission=${encodeURIComponent(mission.id)}`);
  };

  const handleCapture = async () => {
    if (!videoRef.current || !stream || isCapturing) return;

    try {
      setIsCapturing(true);
      setFlashActive(true);
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([40, 20, 40]);
        } catch {
          // Ignore vibration error
        }
      }
      setTimeout(() => setFlashActive(false), 320);

      const metadata = PhotoStampMetadata.create({
        coupleNickname: WEDDING_DETAILS.coupleNickname,
        missionTitle: mission.title,
        guestName,
        frameStyle,
      });

      const photoDataUrl = await photosContainer.cameraCoordinator.captureAndStamp(
        { videoElement: videoRef.current, stream },
        metadata
      );

      navigateToReview(photoDataUrl);
    } catch (err) {
      console.error('Erro durante a captura:', err);
      setErrorMessage('Erro ao capturar foto. Tente usar a câmera nativa do aparelho abaixo.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleNativeCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const rawDataUrl = event.target?.result as string;
      if (!rawDataUrl) return;

      const img = new Image();
      img.onload = async () => {
        const metadata = PhotoStampMetadata.create({
          coupleNickname: WEDDING_DETAILS.coupleNickname,
          missionTitle: mission.title,
          guestName,
          frameStyle,
        });
        const stamped = await photosContainer.stampRenderer.renderWithStamp(img, metadata);
        navigateToReview(stamped);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 900,
        backgroundColor: '#181512',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
      }}
    >
      {flashActive && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#FFFFFF',
            zIndex: 999,
            pointerEvents: 'none',
            animation: 'cameraFlash 0.35s ease-out',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 950,
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(to bottom, rgba(24,21,18,0.75) 0%, transparent 100%)',
        }}
      >
        <button
          onClick={() => router.push('/missions')}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: 'rgba(24,21,18,0.55)',
            border: '1px solid rgba(243,236,225,0.3)',
            color: '#FBF9F5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          aria-label="Voltar para missões"
        >
          <X size={22} />
        </button>

        <div
          style={{
            backgroundColor: 'rgba(67, 75, 50, 0.9)',
            padding: '8px 16px',
            borderRadius: '999px',
            border: '1px solid #DFD5C6',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            maxWidth: '58%',
          }}
        >
          <span style={{ fontSize: '16px' }}>{mission.icon}</span>
          <span
            style={{
              color: '#FBF9F5',
              fontSize: '12.5px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {mission.title}
          </span>
        </div>

        <button
          onClick={cycleFrameStyle}
          style={{
            padding: '8px 12px',
            borderRadius: '999px',
            backgroundColor: frameStyle === 'clean' ? 'rgba(24,21,18,0.55)' : '#5A6346',
            border: '1px solid rgba(243,236,225,0.35)',
            color: '#FBF9F5',
            fontSize: '11px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
          }}
        >
          <Sparkles size={13} />
          {FRAME_LABELS[frameStyle]}
        </button>
      </div>

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#181512',
        }}
      >
        {errorMessage ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#FBF9F5', maxWidth: '380px' }}>
            <AlertCircle size={48} color="#DFD5C6" style={{ marginBottom: '16px' }} />
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '24px',
                marginBottom: '8px',
              }}
            >
              Câmera do Navegador
            </h3>
            <p style={{ fontSize: '14px', color: '#DFD5C6', marginBottom: '24px', lineHeight: 1.55 }}>
              {errorMessage}
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '14px 26px',
                borderRadius: '999px',
                border: '1px solid #DFD5C6',
                backgroundColor: '#5A6346',
                color: '#FBF9F5',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Abrir Câmera Nativa / Galeria
            </button>
          </div>
        ) : (
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
            }}
          />
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleNativeCapture}
          style={{ display: 'none' }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 950,
          padding: '24px 32px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          background:
            'linear-gradient(to top, rgba(24,21,18,0.85) 0%, rgba(24,21,18,0.4) 60%, transparent 100%)',
        }}
      >
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: 'rgba(251,249,245,0.16)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(243,236,225,0.35)',
            color: '#FBF9F5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          title="Escolher da galeria ou câmera nativa"
        >
          <ImageIcon size={22} />
        </button>

        <button
          onClick={handleCapture}
          disabled={isCapturing || Boolean(errorMessage)}
          style={{
            width: '82px',
            height: '82px',
            borderRadius: '50%',
            border: '3px solid #FBF9F5',
            padding: '5px',
            backgroundColor: 'transparent',
            cursor: isCapturing || errorMessage ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isCapturing ? 0.7 : 1,
          }}
          aria-label="Tirar foto"
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              backgroundColor: '#5A6346',
              border: '2px solid #DFD5C6',
            }}
          />
        </button>

        <button
          onClick={() =>
            setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))
          }
          disabled={Boolean(errorMessage)}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: 'rgba(251,249,245,0.16)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(243,236,225,0.35)',
            color: '#FBF9F5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: errorMessage ? 'not-allowed' : 'pointer',
          }}
          title="Alternar Câmera Frontal/Traseira"
        >
          <RefreshCw size={22} />
        </button>
      </div>
    </div>
  );
}
