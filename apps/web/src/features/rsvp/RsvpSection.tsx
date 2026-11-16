'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Send, Edit3, UserCheck, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AttendanceConfirmationPrimitives } from '@wending/domain';
import { Button, Card, ClickSpark } from '@wending/ui';
import { webContainer } from '../../infrastructure/container';

function formatPhoneMask(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function RsvpSection() {
  const [savedRsvp, setSavedRsvp] = useState<AttendanceConfirmationPrimitives | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    attending: 'yes' as 'yes' | 'no',
    companionsCount: '0',
    dietary: '',
    message: '',
  });

  useEffect(() => {
    async function loadInitial() {
      const [existingRsvp, existingGuest] = await Promise.all([
        webContainer.getGuestRsvpStatusUseCase.execute(),
        webContainer.guestRepository.getCurrentGuest(),
      ]);

      if (existingRsvp) {
        setSavedRsvp(existingRsvp);
        setFormData({
          name: existingRsvp.guestName,
          phone: existingRsvp.formattedPhone,
          attending: existingRsvp.status === 'CONFIRMED' ? 'yes' : 'no',
          companionsCount: String(existingRsvp.companionsCount),
          dietary: existingRsvp.dietaryRestrictions || '',
          message: existingRsvp.message || '',
        });
      } else if (existingGuest) {
        const g = existingGuest.toPrimitives();
        setFormData((prev) => ({
          ...prev,
          name: g.name,
          phone: g.formattedPhone || prev.phone,
        }));
      }
    }
    loadInitial();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const attending = formData.attending === 'yes';
    const companionsCount = attending ? parseInt(formData.companionsCount, 10) : 0;

    const result = await webContainer.confirmAttendanceUseCase.execute({
      guestName: formData.name,
      phone: formData.phone,
      attending,
      companionsCount,
      dietaryRestrictions: formData.dietary,
      message: formData.message,
    });

    if (result.isFailure) {
      setErrorMsg(result.getError());
      return;
    }

    await webContainer.identifyGuestUseCase.execute({
      name: formData.name,
      phone: formData.phone,
    });

    const confirmation = result.getValue();
    setSavedRsvp(confirmation);
    setIsEditing(false);

    if (attending) {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#5A6346', '#8C9275', '#DFD5C6', '#B97A57'],
      });
    }
  };

  return (
    <section
      id="confirmar"
      style={{
        backgroundColor: '#434B32',
        padding: '84px 20px',
      }}
    >
      <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
        <p
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            color: '#DFD5C6',
            marginBottom: '10px',
          }}
        >
          Confirmação de Presença • RSVP
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4.5vw, 44px)',
            fontWeight: 500,
            color: '#FBF9F5',
            marginBottom: '12px',
          }}
        >
          Você Estará Conosco?
        </h2>

        <p
          style={{
            fontSize: '14.5px',
            color: '#E5DFD3',
            lineHeight: 1.7,
            marginBottom: '10px',
          }}
        >
          Por favor, confirme sua presença para prepararmos cada detalhe da recepção com muito
          carinho.
        </p>

        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '17px',
            color: '#DFD5C6',
            marginBottom: '34px',
          }}
        >
          &ldquo;Grandes coisas fez o Senhor por nós, por isso estamos alegres.&rdquo; — Salmos 126:3
        </p>

        {savedRsvp && !isEditing ? (
          <Card padding="36px 28px" style={{ backgroundColor: '#FBF9F5', border: '1px solid #DFD5C6' }}>
            <div
              style={{
                width: '62px',
                height: '62px',
                borderRadius: '50%',
                backgroundColor: savedRsvp.status === 'CONFIRMED' ? '#5A6346' : '#6E655F',
                color: '#FBF9F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <CheckCircle2 size={34} />
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '26px',
                color: '#2C2623',
                marginBottom: '8px',
              }}
            >
              {savedRsvp.status === 'CONFIRMED'
                ? 'Presença Confirmada!'
                : 'Resposta Registrada'}
            </h3>

            <p
              style={{
                fontSize: '14px',
                color: '#6E655F',
                maxWidth: '460px',
                margin: '0 auto 18px',
                lineHeight: 1.65,
              }}
            >
              {savedRsvp.status === 'CONFIRMED' ? (
                <>
                  Muito obrigado, <strong>{savedRsvp.guestName}</strong>! Confirmamos{' '}
                  <strong>
                    {savedRsvp.totalPartySize}{' '}
                    {savedRsvp.totalPartySize === 1 ? 'pessoa' : 'pessoas'}
                  </strong>{' '}
                  no total ({savedRsvp.formattedPhone}).
                </>
              ) : (
                <>
                  Recebemos sua resposta, <strong>{savedRsvp.guestName}</strong>. Sentiremos sua
                  falta nesse dia especial!
                </>
              )}
            </p>

            {savedRsvp.dietaryRestrictions && (
              <p style={{ fontSize: '13px', color: '#5A6346', marginBottom: '12px' }}>
                Restrição alimentar registrada: <strong>{savedRsvp.dietaryRestrictions}</strong>
              </p>
            )}

            <div
              style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginTop: '18px',
              }}
            >
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit3 size={14} />
                Editar Resposta
              </Button>

              <Link
                href="/painel"
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 18px',
                  borderRadius: '999px',
                  backgroundColor: '#5A6346',
                  color: '#FBF9F5',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                <UserCheck size={14} />
                Ir para Meu Painel
              </Link>
            </div>
          </Card>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              backgroundColor: '#FBF9F5',
              borderRadius: '18px',
              padding: '34px 28px',
              border: '1px solid #DFD5C6',
              boxShadow: '0 20px 50px rgba(20, 24, 15, 0.25)',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            {errorMsg && (
              <div
                style={{
                  backgroundColor: 'rgba(185, 122, 87, 0.12)',
                  border: '1px solid #B97A57',
                  color: '#8C4327',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#2C2623',
                  marginBottom: '6px',
                }}
              >
                Nome Completo *
              </label>
              <input
                type="text"
                required
                placeholder="Seu nome e sobrenome"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #DFD5C6',
                  backgroundColor: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none',
                  color: '#2C2623',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#2C2623',
                  marginBottom: '6px',
                }}
              >
                WhatsApp ou Celular (com DDD) *
              </label>
              <input
                type="tel"
                required
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: formatPhoneMask(e.target.value) })
                }
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #DFD5C6',
                  backgroundColor: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none',
                  color: '#2C2623',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#2C2623',
                  marginBottom: '8px',
                }}
              >
                Você estará presente? *
              </label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <label
                  style={{
                    flex: 1,
                    minWidth: '180px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px',
                    borderRadius: '10px',
                    border:
                      formData.attending === 'yes' ? '1.5px solid #5A6346' : '1px solid #DFD5C6',
                    backgroundColor: formData.attending === 'yes' ? '#F3ECE1' : '#FFFFFF',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  <input
                    type="radio"
                    name="attending"
                    value="yes"
                    checked={formData.attending === 'yes'}
                    onChange={() => setFormData({ ...formData, attending: 'yes' })}
                  />
                  Sim, estarei lá!
                </label>

                <label
                  style={{
                    flex: 1,
                    minWidth: '180px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px',
                    borderRadius: '10px',
                    border:
                      formData.attending === 'no' ? '1.5px solid #6E655F' : '1px solid #DFD5C6',
                    backgroundColor: formData.attending === 'no' ? '#F3ECE1' : '#FFFFFF',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  <input
                    type="radio"
                    name="attending"
                    value="no"
                    checked={formData.attending === 'no'}
                    onChange={() => setFormData({ ...formData, attending: 'no' })}
                  />
                  Não poderei ir
                </label>
              </div>
            </div>

            {formData.attending === 'yes' && (
              <>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#2C2623',
                      marginBottom: '6px',
                    }}
                  >
                    Acompanhantes além de você
                  </label>
                  <select
                    value={formData.companionsCount}
                    onChange={(e) =>
                      setFormData({ ...formData, companionsCount: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #DFD5C6',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                      color: '#2C2623',
                    }}
                  >
                    <option value="0">Vou sozinho(a) (total: 1 pessoa)</option>
                    <option value="1">+ 1 acompanhante (total: 2 pessoas)</option>
                    <option value="2">+ 2 acompanhantes (total: 3 pessoas)</option>
                    <option value="3">+ 3 acompanhantes (total: 4 pessoas)</option>
                    <option value="4">+ 4 acompanhantes (total: 5 pessoas)</option>
                    <option value="5">+ 5 acompanhantes (total: 6 pessoas)</option>
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#2C2623',
                      marginBottom: '6px',
                    }}
                  >
                    Restrições alimentares ou alergias (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: vegetariano, vegano, sem lactose, alergia a nozes..."
                    value={formData.dietary}
                    onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #DFD5C6',
                      backgroundColor: '#FFFFFF',
                      fontSize: '14px',
                      outline: 'none',
                      color: '#2C2623',
                    }}
                  />
                </div>
              </>
            )}

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#2C2623',
                  marginBottom: '6px',
                }}
              >
                Mensagem carinhosa para os noivos (opcional)
              </label>
              <textarea
                rows={3}
                placeholder="Deixe um recado especial para Isabelle e Vinícius..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #DFD5C6',
                  backgroundColor: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none',
                  color: '#2C2623',
                  resize: 'vertical',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              {isEditing && (
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
              )}
              <ClickSpark sparkColor="#C6A972" style={{ width: '100%' }}>
                <Button type="submit" fullWidth size="lg">
                  <Send size={16} />
                  {isEditing ? 'Salvar Alterações' : 'Confirmar Presença'}
                </Button>
              </ClickSpark>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
