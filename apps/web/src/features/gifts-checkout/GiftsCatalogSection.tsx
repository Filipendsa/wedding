'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Gift,
  Copy,
  Check,
  QrCode,
  CreditCard,
  X,
  CheckCircle2,
  AlertCircle,
  Lock,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  GiftContributionPrimitives,
  GiftOption,
  Money,
  PaymentMethod,
  PixBrCode,
} from '@wending/domain';
import {
  AnimatedContent,
  Badge,
  Button,
  Card,
  ClickSpark,
  Modal,
  QrCodeSvg,
  SplitText,
  SpotlightCard,
} from '@wending/ui';
import { GiftItem, WEDDING_DETAILS, WEDDING_GIFTS } from '@wending/utils';
import { webContainer } from '../../infrastructure/container';

type GiftFilter = 'todos' | GiftItem['category'];

function formatCardNumber(raw: string): string {
  return raw
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
    .trim();
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function GiftsCatalogSection() {
  const [selectedCategory, setSelectedCategory] = useState<GiftFilter>('todos');
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null);
  const [customAmountInput, setCustomAmountInput] = useState('100');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [donorName, setDonorName] = useState('');
  const [donorMessage, setDonorMessage] = useState('');

  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installments, setInstallments] = useState(1);

  const [copiedPayload, setCopiedPayload] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<GiftContributionPrimitives | null>(null);
  const [contributions, setContributions] = useState<GiftContributionPrimitives[]>([]);

  useEffect(() => {
    async function loadInitial() {
      const [guest, list] = await Promise.all([
        webContainer.guestRepository.getCurrentGuest(),
        webContainer.listGuestContributionsUseCase.execute(),
      ]);
      if (guest) {
        setDonorName(guest.name.value);
      }
      setContributions(list);
    }
    loadInitial();
  }, []);

  const giftEntities = useMemo(() => {
    return WEDDING_GIFTS.map((item) =>
      GiftOption.create({
        id: item.id,
        title: item.title,
        description: item.description,
        priceReais: item.price,
        category: item.category,
        icon: item.icon,
        supportsCustomAmount: item.supportsCustomAmount,
      })
    )
      .filter((r) => r.isSuccess)
      .map((r) => r.getValue().toPrimitives());
  }, []);

  const filteredGifts = useMemo(() => {
    if (selectedCategory === 'todos') return giftEntities;
    return giftEntities.filter((g) => g.category === selectedCategory);
  }, [giftEntities, selectedCategory]);

  const activeAmountReais = useMemo(() => {
    if (!selectedGift) return 0;
    if (selectedGift.supportsCustomAmount) {
      const parsed = Number(customAmountInput.replace(',', '.'));
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    }
    return selectedGift.price;
  }, [selectedGift, customAmountInput]);

  const activePixPayload = useMemo(() => {
    if (!selectedGift || activeAmountReais <= 0) return '';
    const moneyRes = Money.fromReais(activeAmountReais);
    if (moneyRes.isFailure) return '';
    const pixRes = PixBrCode.generate({
      pixKey: WEDDING_DETAILS.pixKey,
      recipientName: WEDDING_DETAILS.pixRecipient,
      city: WEDDING_DETAILS.pixCity,
      amount: moneyRes.getValue(),
      txId: `WEND${selectedGift.id.slice(0, 8).toUpperCase()}`,
    });
    return pixRes.isSuccess ? pixRes.getValue().payload : '';
  }, [selectedGift, activeAmountReais]);

  const openGiftModal = (gift: GiftItem) => {
    const original = WEDDING_GIFTS.find((item) => item.id === gift.id) ?? gift;
    setSelectedGift(original);
    setCustomAmountInput(String(original.price));
    setPaymentMethod('PIX');
    setCheckoutError(null);
    setReceipt(null);
    setDonorMessage('');
    setCopiedPayload(false);
  };

  const handleCopyPix = () => {
    const toCopy = activePixPayload || WEDDING_DETAILS.pixKey;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(toCopy);
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2500);
    }
  };

  const handleConfirmContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGift) return;
    setCheckoutError(null);
    setIsSubmitting(true);

    const result = await webContainer.contributeToGiftUseCase.execute({
      giftId: selectedGift.id,
      giftTitle: selectedGift.title,
      giftIcon: selectedGift.icon,
      donorName,
      amountReais: activeAmountReais,
      paymentMethod,
      message: donorMessage,
      pixConfig:
        paymentMethod === 'PIX'
          ? {
              pixKey: WEDDING_DETAILS.pixKey,
              recipientName: WEDDING_DETAILS.pixRecipient,
            }
          : undefined,
      cardInput:
        paymentMethod === 'CREDIT_CARD'
          ? {
              holderName: cardHolder,
              cardNumber,
              expiry: cardExpiry,
              cvv: cardCvv,
              installments,
            }
          : undefined,
    });

    setIsSubmitting(false);

    if (result.isFailure) {
      setCheckoutError(result.getError());
      return;
    }

    await webContainer.identifyGuestUseCase.execute({ name: donorName });

    const created = result.getValue();
    setReceipt(created);
    const updatedList = await webContainer.listGuestContributionsUseCase.execute();
    setContributions(updatedList);

    confetti({
      particleCount: 80,
      spread: 65,
      origin: { y: 0.6 },
      colors: ['#5A6346', '#8C9275', '#DFD5C6', '#B97A57'],
    });
  };

  const activeMoneyFormatted = useMemo(() => {
    const res = Money.fromReais(activeAmountReais);
    return res.isSuccess ? res.getValue().formatBRL() : 'R$ 0,00';
  }, [activeAmountReais]);

  return (
    <section
      id="presentes"
      style={{
        padding: '84px 20px',
        backgroundColor: '#F3ECE1',
        borderTop: '1px solid #E8DFD1',
      }}
    >
      <div style={{ maxWidth: '1040px', margin: '0 auto', textAlign: 'center' }}>
        <p className="editorial-label" style={{ marginBottom: '10px' }}>
          Lista de Presentes • PIX &amp; Cartão
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(30px, 4vw, 42px)',
            fontWeight: 500,
            color: '#2C2623',
            marginBottom: '12px',
          }}
        >
          <SplitText text="Presenteie os Noivos" />
        </h2>

        <p
          style={{
            fontSize: '15px',
            color: '#6E655F',
            maxWidth: '580px',
            margin: '0 auto 24px',
            lineHeight: 1.7,
          }}
        >
          Sua presença é o nosso maior presente. Caso deseje nos abençoar com um mimo para a lua de
          mel ou novo lar, contribua via <strong>PIX</strong> ou{' '}
          <strong>Cartão em até 6x</strong>.
        </p>

        {/* Filtros por Categoria (Horizontal Swipe no Mobile) */}
        <div
          className="mobile-chip-row hide-scrollbar"
          style={{ marginBottom: '28px' }}
        >
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'viagem', label: 'Lua de Mel' },
            { id: 'romance', label: 'Romance' },
            { id: 'casa', label: 'Casa Nova' },
            { id: 'brincadeira', label: 'Divertidos' },
          ].map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as GiftFilter)}
                className="touch-press"
                style={{
                  padding: '9px 18px',
                  borderRadius: '999px',
                  border: active ? '1px solid #5A6346' : '1px solid #D9CEBE',
                  backgroundColor: active ? '#5A6346' : '#FBF9F5',
                  color: active ? '#FBF9F5' : '#2C2623',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Grid de Presentes */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '18px',
            textAlign: 'left',
          }}
        >
          {filteredGifts.map((gift, idx) => (
            <AnimatedContent key={gift.id} direction="up" delayMs={Math.min(idx * 55, 280)}>
              <SpotlightCard
                backgroundColor="#FBF9F5"
                borderColor="#E8DFD1"
                borderRadius="18px"
                padding="24px"
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: '#F3ECE1',
                        border: '1px solid #DFD5C6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                      }}
                    >
                      {gift.icon}
                    </span>
                    {gift.supportsCustomAmount && <Badge variant="olive">Valor Livre</Badge>}
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '21px',
                      fontWeight: 600,
                      color: '#2C2623',
                      marginBottom: '8px',
                      lineHeight: 1.25,
                    }}
                  >
                    {gift.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '13.5px',
                      color: '#6E655F',
                      lineHeight: 1.6,
                      marginBottom: '20px',
                    }}
                  >
                    {gift.description}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: '1px solid #E8DFD1',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '22px',
                      fontWeight: 600,
                      color: '#434B32',
                    }}
                  >
                    {gift.supportsCustomAmount ? 'A partir de ' : ''}
                    {gift.formattedPrice}
                  </span>

                  <ClickSpark sparkColor="#C6A972">
                    <Button
                      size="sm"
                      onClick={() =>
                        openGiftModal({
                          id: gift.id,
                          title: gift.title,
                          description: gift.description,
                          price: gift.priceReais,
                          category: gift.category,
                          icon: gift.icon,
                          supportsCustomAmount: gift.supportsCustomAmount,
                        })
                      }
                    >
                      Presentear
                    </Button>
                  </ClickSpark>
                </div>
              </SpotlightCard>
            </AnimatedContent>
          ))}
        </div>

        {/* Resumo dos presentes enviados */}
        {contributions.length > 0 && (
          <Card
            padding="20px 24px"
            style={{
              marginTop: '34px',
              textAlign: 'left',
              backgroundColor: '#FBF9F5',
              border: '1px solid #D9CEBE',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#2C2623',
                  }}
                >
                  Você já enviou {contributions.length}{' '}
                  {contributions.length === 1 ? 'presente' : 'presentes'} aos noivos
                </h3>
                <p style={{ fontSize: '13px', color: '#6E655F', marginTop: '2px' }}>
                  Acompanhe seus comprovantes e recados no Painel do Convidado.
                </p>
              </div>
              <Link
                href="/painel"
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
                <UserCheck size={14} />
                Ver no Meu Painel
              </Link>
            </div>
          </Card>
        )}
      </div>

      {/* Modal de Checkout Híbrido */}
      <Modal isOpen={!!selectedGift} onClose={() => setSelectedGift(null)} maxWidth="500px">
        {selectedGift && (
          <div>
            <button
              onClick={() => setSelectedGift(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: '#F3ECE1',
                border: '1px solid #DFD5C6',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6E655F',
                cursor: 'pointer',
              }}
              aria-label="Fechar modal"
            >
              <X size={18} />
            </button>

            {receipt ? (
              <div style={{ textAlign: 'center', padding: '12px 4px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#5A6346',
                    color: '#FBF9F5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <CheckCircle2 size={36} />
                </div>

                <Badge variant="olive" style={{ marginBottom: '10px' }}>
                  <Sparkles size={13} />
                  Presente Registrado
                </Badge>

                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '26px',
                    color: '#2C2623',
                    marginBottom: '6px',
                  }}
                >
                  Muito obrigado, {receipt.donorName}!
                </h3>

                <p style={{ fontSize: '14px', color: '#6E655F', marginBottom: '20px' }}>
                  {receipt.giftIcon} <strong>{receipt.giftTitle}</strong> •{' '}
                  <strong>{receipt.formattedAmount}</strong>
                </p>

                <Card variant="sand" padding="16px" style={{ textAlign: 'left', marginBottom: '20px' }}>
                  <p style={{ fontSize: '13px', color: '#2C2623', marginBottom: '6px' }}>
                    <strong>Forma de pagamento:</strong>{' '}
                    {receipt.paymentMethod === 'PIX'
                      ? 'PIX Instantâneo'
                      : `Cartão ${receipt.cardBrand} •••• ${receipt.cardLast4} (${receipt.installments}x)`}
                  </p>
                  <p style={{ fontSize: '13px', color: '#2C2623', marginBottom: '6px' }}>
                    <strong>Código da transação:</strong> {receipt.transactionCode}
                  </p>
                  {receipt.message && (
                    <p style={{ fontSize: '13px', color: '#6E655F', fontStyle: 'italic' }}>
                      &ldquo;{receipt.message}&rdquo;
                    </p>
                  )}
                </Card>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <Button variant="outline" onClick={() => setSelectedGift(null)}>
                    Fechar
                  </Button>
                  <Link
                    href="/painel"
                    style={{
                      textDecoration: 'none',
                      padding: '12px 22px',
                      borderRadius: '999px',
                      backgroundColor: '#5A6346',
                      color: '#FBF9F5',
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <UserCheck size={15} />
                    Ver no Painel
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmContribution}>
                <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                  <span style={{ fontSize: '36px', display: 'block', marginBottom: '6px' }}>
                    {selectedGift.icon}
                  </span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '24px',
                      color: '#2C2623',
                      marginBottom: '4px',
                    }}
                  >
                    {selectedGift.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '28px',
                      fontWeight: 600,
                      color: '#5A6346',
                    }}
                  >
                    {activeMoneyFormatted}
                  </p>
                </div>

                {selectedGift.supportsCustomAmount && (
                  <div style={{ marginBottom: '14px' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: '#6E655F',
                        marginBottom: '6px',
                      }}
                    >
                      Valor do presente (R$)
                    </label>
                    <input
                      type="number"
                      min="5"
                      step="1"
                      required
                      value={customAmountInput}
                      onChange={(e) => setCustomAmountInput(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid #DFD5C6',
                        backgroundColor: '#FFFFFF',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: '#2C2623',
                      }}
                    />
                  </div>
                )}

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '6px',
                    backgroundColor: '#F3ECE1',
                    padding: '5px',
                    borderRadius: '999px',
                    border: '1px solid #DFD5C6',
                    marginBottom: '16px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('PIX');
                      setCheckoutError(null);
                    }}
                    style={{
                      padding: '9px',
                      borderRadius: '999px',
                      border: 'none',
                      backgroundColor: paymentMethod === 'PIX' ? '#5A6346' : 'transparent',
                      color: paymentMethod === 'PIX' ? '#FBF9F5' : '#6E655F',
                      fontWeight: 600,
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <QrCode size={15} />
                    PIX Instantâneo
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('CREDIT_CARD');
                      setCheckoutError(null);
                    }}
                    style={{
                      padding: '9px',
                      borderRadius: '999px',
                      border: 'none',
                      backgroundColor:
                        paymentMethod === 'CREDIT_CARD' ? '#5A6346' : 'transparent',
                      color: paymentMethod === 'CREDIT_CARD' ? '#FBF9F5' : '#6E655F',
                      fontWeight: 600,
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <CreditCard size={15} />
                    Cartão (até 6x)
                  </button>
                </div>

                {checkoutError && (
                  <div
                    style={{
                      backgroundColor: 'rgba(185, 122, 87, 0.12)',
                      border: '1px solid #B97A57',
                      color: '#8C4327',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '12px',
                    }}
                  >
                    <AlertCircle size={16} />
                    <span>{checkoutError}</span>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
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
                      placeholder="Ex: Tia Maria, Lucas e Ana..."
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #DFD5C6',
                        backgroundColor: '#FFFFFF',
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
                      Mensagem aos noivos (opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Desejamos toda felicidade do mundo!"
                      value={donorMessage}
                      onChange={(e) => setDonorMessage(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #DFD5C6',
                        backgroundColor: '#FFFFFF',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                </div>

                {paymentMethod === 'PIX' ? (
                  <div style={{ textAlign: 'center' }}>
                    {activePixPayload && (
                      <div
                        style={{
                          padding: '14px',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '14px',
                          border: '1px solid #E8DFD1',
                          display: 'inline-block',
                          marginBottom: '12px',
                        }}
                      >
                        <QrCodeSvg value={activePixPayload} size={148} darkColor="#2C2623" />
                        <p style={{ fontSize: '11px', color: '#6E655F', marginTop: '6px' }}>
                          QR Code PIX com valor de <strong>{activeMoneyFormatted}</strong>
                        </p>
                      </div>
                    )}

                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E8DFD1',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        marginBottom: '14px',
                      }}
                    >
                      <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                        <span
                          style={{
                            fontSize: '10px',
                            color: '#8C9275',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                            display: 'block',
                          }}
                        >
                          PIX Copia e Cola ({WEDDING_DETAILS.pixKey})
                        </span>
                        <p
                          style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#2C2623',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {activePixPayload || WEDDING_DETAILS.pixKey}
                        </p>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        variant={copiedPayload ? 'secondary' : 'outline'}
                        onClick={handleCopyPix}
                      >
                        {copiedPayload ? <Check size={14} /> : <Copy size={14} />}
                        {copiedPayload ? 'Copiado' : 'Copiar'}
                      </Button>
                    </div>

                    <Button type="submit" fullWidth disabled={isSubmitting}>
                      <CheckCircle2 size={16} />
                      {isSubmitting ? 'Registrando...' : 'Já fiz o PIX — Confirmar'}
                    </Button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                        Nome impresso no cartão *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="COMO NO CARTÃO"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          border: '1px solid #DFD5C6',
                          backgroundColor: '#FFFFFF',
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
                        Número do cartão *
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        required
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          border: '1px solid #DFD5C6',
                          backgroundColor: '#FFFFFF',
                          fontSize: '14px',
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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
                          Validade (MM/AA) *
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          required
                          placeholder="12/29"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '10px',
                            border: '1px solid #DFD5C6',
                            backgroundColor: '#FFFFFF',
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
                          CVV *
                        </label>
                        <input
                          type="password"
                          inputMode="numeric"
                          maxLength={4}
                          required
                          placeholder="123"
                          value={cardCvv}
                          onChange={(e) =>
                            setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))
                          }
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '10px',
                            border: '1px solid #DFD5C6',
                            backgroundColor: '#FFFFFF',
                            fontSize: '14px',
                          }}
                        />
                      </div>
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
                        Parcelamento
                      </label>
                      <select
                        value={installments}
                        onChange={(e) => setInstallments(Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          border: '1px solid #DFD5C6',
                          backgroundColor: '#FFFFFF',
                          fontSize: '14px',
                        }}
                      >
                        {[1, 2, 3, 4, 5, 6].map((n) => {
                          const money = Money.fromReais(activeAmountReais);
                          const perInstallment = money.isSuccess
                            ? money.getValue().divideByInstallments(n).formatBRL()
                            : activeMoneyFormatted;
                          return (
                            <option key={n} value={n}>
                              {n}x de {perInstallment} sem juros
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        fontSize: '11.5px',
                        color: '#6E655F',
                        margin: '4px 0',
                      }}
                    >
                      <Lock size={13} color="#5A6346" />
                      <span>Ambiente simulado seguro • Nenhum dado real é cobrado</span>
                    </div>

                    <Button type="submit" fullWidth disabled={isSubmitting}>
                      <CreditCard size={16} />
                      {isSubmitting
                        ? 'Processando...'
                        : `Pagar ${activeMoneyFormatted} no Cartão`}
                    </Button>
                  </div>
                )}
              </form>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
}
