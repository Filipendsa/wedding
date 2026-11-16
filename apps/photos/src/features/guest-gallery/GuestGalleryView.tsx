'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Trash2, X, Eye, Camera } from 'lucide-react';
import { ChallengePhotoPrimitives } from '@wending/domain';
import { WEDDING_MISSIONS } from '@wending/utils';
import { photosContainer } from '../../infrastructure/container';
import { PhotoBoothDock } from '../shared/PhotoBoothDock';

export function GuestGalleryView() {
  const [photos, setPhotos] = useState<ChallengePhotoPrimitives[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<ChallengePhotoPrimitives | null>(null);

  const loadPhotos = async () => {
    const board = await photosContainer.getChallengeBoardUseCase.execute();
    setPhotos(board.photos);
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const getMissionTitle = (missionId: string) => {
    const m = WEDDING_MISSIONS.find((item) => item.id === missionId);
    return m ? m.title : 'Missão Especial';
  };

  const handleDownload = (photo: ChallengePhotoPrimitives) => {
    const link = document.createElement('a');
    link.href = photo.dataUrl;
    link.download = `casamento-isa-e-vini-${photo.missionId}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string) => {
    await photosContainer.deleteGuestPhotoUseCase.execute(id);
    setSelectedPhoto(null);
    await loadPhotos();
  };

  return (
    <main
      className="safe-bottom-booth"
      style={{ minHeight: '100vh', backgroundColor: '#FBF9F5', display: 'flex', flexDirection: 'column' }}
    >
      <header
        style={{
          padding: '16px 20px',
          backgroundColor: '#F3ECE1',
          borderBottom: '1px solid #E8DFD1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          href="/missions"
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
          Missões
        </Link>

        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '21px', fontWeight: 600, color: '#2C2623' }}>
            Minhas Fotos
          </h1>
          <p style={{ fontSize: '12px', color: '#6E655F' }}>
            {photos.length} {photos.length === 1 ? 'foto salva' : 'fotos salvas'}
          </p>
        </div>

        <Link
          href="/camera"
          style={{
            textDecoration: 'none',
            padding: '8px 14px',
            borderRadius: '999px',
            backgroundColor: '#5A6346',
            color: '#FBF9F5',
            fontSize: '11.5px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <Camera size={14} />
          Foto
        </Link>
      </header>

      <div style={{ flex: 1, padding: '20px' }}>
        {photos.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '60vh',
              textAlign: 'center',
              color: '#6E655F',
            }}
          >
            <span style={{ fontSize: '44px', marginBottom: '14px' }}>📸</span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '24px',
                color: '#2C2623',
                marginBottom: '8px',
              }}
            >
              Nenhuma foto ainda
            </h2>
            <p style={{ fontSize: '14px', maxWidth: '300px', lineHeight: 1.55, marginBottom: '20px' }}>
              Escolha uma missão e clique em &ldquo;Cumprir Missão&rdquo; para inaugurar sua galeria.
            </p>
            <Link
              href="/missions"
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
              }}
            >
              Ver Missões
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '16px',
              maxWidth: '900px',
              margin: '0 auto',
            }}
          >
            {photos.map((photo) => (
              <div
                key={photo.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 6px 18px rgba(44, 38, 35, 0.06)',
                  border: '1px solid #E8DFD1',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '120%',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo.dataUrl}
                    alt={photo.caption || 'Foto de casamento'}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: 'rgba(44,38,35,0.65)',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FBF9F5',
                    }}
                  >
                    <Eye size={14} />
                  </div>
                </div>

                <div
                  style={{
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <p
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#2C2623',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {getMissionTitle(photo.missionId)}
                    </p>
                    {photo.caption && (
                      <p
                        style={{
                          fontSize: '11px',
                          color: '#6E655F',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        &ldquo;{photo.caption}&rdquo;
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDownload(photo)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#5A6346',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                    title="Baixar foto"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPhoto && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(28, 24, 21, 0.94)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(251,249,245,0.2)',
              border: 'none',
              color: '#FBF9F5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={22} />
          </button>

          <img
            src={selectedPhoto.dataUrl}
            alt="Foto do casamento"
            style={{
              maxHeight: '75vh',
              maxWidth: '90vw',
              borderRadius: '10px',
              objectFit: 'contain',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
          />

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button
              onClick={() => handleDownload(selectedPhoto)}
              style={{
                padding: '10px 22px',
                borderRadius: '999px',
                backgroundColor: '#5A6346',
                border: '1px solid #DFD5C6',
                color: '#FBF9F5',
                fontWeight: 600,
                fontSize: '12.5px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <Download size={16} />
              Baixar no Celular
            </button>

            <button
              onClick={() => {
                if (confirm('Tem certeza que deseja apagar esta foto?')) {
                  handleDelete(selectedPhoto.id);
                }
              }}
              style={{
                padding: '10px 18px',
                borderRadius: '999px',
                backgroundColor: 'rgba(251,249,245,0.14)',
                border: '1px solid rgba(251,249,245,0.25)',
                color: '#FBF9F5',
                fontWeight: 600,
                fontSize: '12.5px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <Trash2 size={15} />
              Excluir
            </button>
          </div>
        </div>
      )}
      <PhotoBoothDock activeTab="gallery" photosCount={photos.length} />
    </main>
  );
}
