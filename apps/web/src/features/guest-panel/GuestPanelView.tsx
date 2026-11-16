'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  User,
  Heart,
  Gift,
  Camera,
  CheckCircle2,
  Clock,
  ArrowRight,
  Save,
  ExternalLink,
} from 'lucide-react';
import { GuestDashboardSummary } from '@wending/domain';
import { Badge, Button, Card, QrCodeSvg } from '@wending/ui';
import { resolvePhotoBoothUrl, WEDDING_DETAILS } from '@wending/utils';
import { webContainer } from '../../infrastructure/container';

export function GuestPanelView() {
  const [summary, setSummary] = useState<GuestDashboardSummary | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [tableHintInput, setTableHintInput] = useState('');
  const [profileSavedMsg, setProfileSavedMsg] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const loadSummary = async () => {
    const data = await webContainer.getGuestDashboardSummaryUseCase.execute();
    setSummary(data);
    if (data.guest) {
      setNameInput(data.guest.name);
      setPhoneInput(data.guest.formattedPhone || '');
      setTableHintInput(data.guest.tableHint || '');
    } else if (data.rsvp) {
      setNameInput(data.rsvp.guestName);
      setPhoneInput(data.rsvp.formattedPhone);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSavedMsg(null);

    const res = await webContainer.identifyGuestUseCase.execute({
      name: nameInput,
      phone: phoneInput,
      tableHint: tableHintInput,
    });

    if (res.isFailure) {
      setProfileError(res.getError());
      return;
    }

    setProfileSavedMsg('Seus dados foram atualizados no painel.');
    await loadSummary();
  };

  const [photoBoothUrlWithGuest, setPhotoBoothUrlWithGuest] = useState(WEDDING_DETAILS.photoBoothUrl);

  useEffect(() => {
    setPhotoBoothUrlWithGuest(resolvePhotoBoothUrl(summary?.guest?.name));
  }, [summary?.guest?.name]);

  return (
    <div style={{ maxWidth: '1020px', margin: '0 auto', padding: '48px 20px 84px' }}>
      <div style={{ marginBottom: '36px', textAlign: 'center' }}>
        <p className="editorial-label" style={{ marginBottom: '10px' }}>
          Área Exclusiva do Convidado
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4.5vw, 44px)',
            fontWeight: 500,
            color: '#2C2623',
            marginBottom: '10px',
          }}
        >
          {summary?.guest
            ? `Olá, ${summary.guest.firstName}! Bem-vindo(a)`
            : 'Painel do Convidado'}
        </h1>
        <p style={{ fontSize: '15px', color: '#6E655F', maxWidth: '600px', margin: '0 auto' }}>
          Acompanhe sua confirmação de presença (RSVP), visualize seus presentes enviados e acesse
          seu passe direto para o Photo Booth do casamento.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '20px',
          marginBottom: '24px',
        }}
      >
        {/* Card 1: Perfil */}
        <Card padding="24px">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: '#5A6346',
                color: '#FBF9F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '15px',
              }}
            >
              {summary?.guest?.initials || <User size={20} />}
            </div>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '21px',
                  fontWeight: 600,
                  color: '#2C2623',
                }}
              >
                Seu Perfil
              </h2>
              <p style={{ fontSize: '12.5px', color: '#6E655F' }}>
                Identificação para fotos e presentes
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSaveProfile}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#2C2623',
                  marginBottom: '4px',
                }}
              >
                Seu Nome *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Ana Paula Silva"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #DFD5C6',
                  fontSize: '14px',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#2C2623',
                  marginBottom: '4px',
                }}
              >
                WhatsApp (opcional)
              </label>
              <input
                type="tel"
                placeholder="(11) 99999-9999"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #DFD5C6',
                  fontSize: '14px',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#2C2623',
                  marginBottom: '4px',
                }}
              >
                Grupo / Família (opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: Família da Noiva, Amigos..."
                value={tableHintInput}
                onChange={(e) => setTableHintInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #DFD5C6',
                  fontSize: '14px',
                }}
              />
            </div>

            {profileError && (
              <p style={{ fontSize: '12.5px', color: '#B97A57', fontWeight: 600 }}>
                {profileError}
              </p>
            )}
            {profileSavedMsg && (
              <p style={{ fontSize: '12.5px', color: '#5A6346', fontWeight: 600 }}>
                {profileSavedMsg}
              </p>
            )}

            <Button type="submit" size="sm">
              <Save size={14} />
              Salvar Perfil
            </Button>
          </form>
        </Card>

        {/* Card 2: Status RSVP */}
        <Card
          padding="24px"
          variant={summary?.rsvp?.status === 'CONFIRMED' ? 'highlighted' : 'default'}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Heart size={18} color="#5A6346" />
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '21px',
                  fontWeight: 600,
                  color: '#2C2623',
                }}
              >
                Presença (RSVP)
              </h2>
            </div>

            {summary?.rsvp ? (
              <Badge variant={summary.rsvp.status === 'CONFIRMED' ? 'olive' : 'sand'}>
                {summary.rsvp.status === 'CONFIRMED' ? 'Confirmado' : 'Não irá'}
              </Badge>
            ) : (
              <Badge variant="sunset">Pendente</Badge>
            )}
          </div>

          {summary?.rsvp ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2C2623' }}>
                <CheckCircle2 size={16} color="#5A6346" />
                <span style={{ fontSize: '14px' }}>
                  <strong>{summary.rsvp.guestName}</strong> ({summary.rsvp.formattedPhone})
                </span>
              </div>

              {summary.rsvp.status === 'CONFIRMED' && (
                <p style={{ fontSize: '14px', color: '#6E655F' }}>
                  Total confirmado: <strong>{summary.rsvp.totalPartySize}</strong>{' '}
                  {summary.rsvp.totalPartySize === 1 ? 'pessoa' : 'pessoas'}
                </p>
              )}

              {summary.rsvp.dietaryRestrictions && (
                <p style={{ fontSize: '13px', color: '#6E655F' }}>
                  Restrições: <strong>{summary.rsvp.dietaryRestrictions}</strong>
                </p>
              )}

              {summary.rsvp.message && (
                <p style={{ fontSize: '13px', color: '#6E655F', fontStyle: 'italic' }}>
                  Recado: &ldquo;{summary.rsvp.message}&rdquo;
                </p>
              )}
            </div>
          ) : (
            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#5A6346',
                  marginBottom: '6px',
                }}
              >
                <Clock size={16} />
                <span style={{ fontSize: '14px', fontWeight: 600 }}>
                  Confirmação pendente
                </span>
              </div>
              <p style={{ fontSize: '13.5px', color: '#6E655F', lineHeight: 1.55 }}>
                Avise os noivos se você vai celebrar esse dia especial conosco.
              </p>
            </div>
          )}

          <Link
            href="/#confirmar"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '999px',
              backgroundColor: '#F3ECE1',
              border: '1px solid #DFD5C6',
              color: '#2C2623',
              fontSize: '11.5px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {summary?.rsvp ? 'Atualizar RSVP' : 'Confirmar Presença'}
            <ArrowRight size={14} />
          </Link>
        </Card>

        {/* Card 3: Passe Photo Booth */}
        <Card padding="24px" variant="sand" style={{ textAlign: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '10px',
            }}
          >
            <Camera size={18} color="#5A6346" />
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '21px',
                fontWeight: 600,
                color: '#2C2623',
              }}
            >
              Passe Photo Booth
            </h2>
          </div>

          <p style={{ fontSize: '13px', color: '#6E655F', marginBottom: '14px', lineHeight: 1.55 }}>
            No dia da festa, abra sua câmera personalizada e cumpra os desafios fotográficos.
          </p>

          <div
            style={{
              display: 'inline-block',
              backgroundColor: '#FFFFFF',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid #DFD5C6',
              marginBottom: '14px',
            }}
          >
            <QrCodeSvg value={photoBoothUrlWithGuest} size={122} darkColor="#2C2623" />
          </div>

          <div>
            <a
              href={photoBoothUrlWithGuest}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '999px',
                backgroundColor: '#5A6346',
                color: '#FBF9F5',
                fontSize: '11.5px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              <Camera size={14} />
              Abrir Câmera &amp; Desafios
              <ExternalLink size={13} />
            </a>
          </div>
        </Card>
      </div>

      {/* Histórico de Presentes */}
      <Card padding="26px">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Gift size={20} color="#5A6346" />
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '23px',
                  fontWeight: 600,
                  color: '#2C2623',
                }}
              >
                Meus Presentes &amp; Doações
              </h2>
              <p style={{ fontSize: '13px', color: '#6E655F' }}>
                Total contribuído: <strong>{summary?.totalGiftedFormatted ?? 'R$ 0,00'}</strong>
              </p>
            </div>
          </div>

          <Link
            href="/#presentes"
            style={{
              textDecoration: 'none',
              padding: '9px 18px',
              borderRadius: '999px',
              backgroundColor: '#5A6346',
              color: '#FBF9F5',
              fontSize: '11.5px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Gift size={14} />
            Enviar Novo Presente
          </Link>
        </div>

        {!summary || summary.contributions.length === 0 ? (
          <div
            style={{
              backgroundColor: '#F3ECE1',
              borderRadius: '12px',
              padding: '28px 20px',
              textAlign: 'center',
              border: '1px dashed #DFD5C6',
            }}
          >
            <p style={{ fontSize: '14px', color: '#6E655F' }}>
              Você ainda não enviou nenhum presente por aqui. Confira a lista de cotas via PIX ou
              Cartão de Crédito!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {summary.contributions.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#FBF9F5',
                  borderRadius: '12px',
                  padding: '16px 18px',
                  border: '1px solid #E8DFD1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '28px' }}>{item.giftIcon}</span>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#2C2623' }}>
                      {item.giftTitle}
                    </h3>
                    <p style={{ fontSize: '12.5px', color: '#6E655F' }}>
                      {item.paymentMethod === 'PIX'
                        ? 'PIX Instantâneo'
                        : `Cartão ${item.cardBrand} •••• ${item.cardLast4} (${item.installments}x)`}{' '}
                      • Código: <strong>{item.transactionCode}</strong>
                    </p>
                    {item.message && (
                      <p
                        style={{
                          fontSize: '12px',
                          color: '#5A6346',
                          fontStyle: 'italic',
                          marginTop: '2px',
                        }}
                      >
                        &ldquo;{item.message}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '21px',
                      fontWeight: 600,
                      color: '#434B32',
                    }}
                  >
                    {item.formattedAmount}
                  </p>
                  <Badge variant="olive">Pago</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
