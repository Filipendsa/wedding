'use client';

import React, { useState } from 'react';
import { User, Sparkles } from 'lucide-react';
import { Button, Modal } from '@wending/ui';
import { photosContainer } from '../../infrastructure/container';

interface GuestIdentificationModalProps {
  isOpen: boolean;
  initialName?: string;
  onSave: (name: string) => void;
}

export function GuestIdentificationModal({
  isOpen,
  initialName = '',
  onSave,
}: GuestIdentificationModalProps) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await photosContainer.identifyGuestUseCase.execute({ name });
    if (res.isFailure) {
      setError(res.getError());
      return;
    }
    onSave(res.getValue().name);
  };

  return (
    <Modal isOpen={isOpen} maxWidth="420px">
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '62px',
            height: '62px',
            borderRadius: '50%',
            backgroundColor: '#5A6346',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: '#FBF9F5',
          }}
        >
          <Sparkles size={28} />
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
            fontWeight: 600,
            color: '#2C2623',
            marginBottom: '8px',
          }}
        >
          Bem-vindo ao Photo Booth
        </h2>

        <p
          style={{
            fontSize: '14px',
            color: '#6E655F',
            marginBottom: '22px',
            lineHeight: 1.55,
          }}
        >
          Como você gostaria de assinar suas fotos e carimbos comemorativos de{' '}
          <strong>Isabelle &amp; Vinícius</strong>?
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative', marginBottom: '14px' }}>
            <User
              size={18}
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#8C9275',
              }}
            />
            <input
              type="text"
              placeholder="Ex: Tio Carlos, Mari, Pedro..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              autoFocus
              style={{
                width: '100%',
                padding: '13px 16px 13px 44px',
                borderRadius: '10px',
                border: error ? '1.5px solid #B97A57' : '1px solid #DFD5C6',
                fontSize: '15px',
                outline: 'none',
                backgroundColor: '#FFFFFF',
                color: '#2C2623',
              }}
            />
          </div>

          {error && (
            <p style={{ color: '#B97A57', fontSize: '13px', marginBottom: '12px' }}>{error}</p>
          )}

          <Button type="submit" fullWidth size="lg">
            Começar Desafios
          </Button>
        </form>
      </div>
    </Modal>
  );
}
