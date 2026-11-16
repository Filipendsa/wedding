'use client';

import React, { useEffect, useRef, useState } from 'react';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/* ============================================================================
 * 1. BlurText — React Bits
 * Revela palavras/caracteres com transição de blur(12px) -> 0 + deslocamento
 * ========================================================================== */
export interface BlurTextProps {
  text: string;
  delayMs?: number;
  stepDelayMs?: number;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  className?: string;
  style?: React.CSSProperties;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
}

export function BlurText({
  text,
  delayMs = 80,
  stepDelayMs = 95,
  animateBy = 'words',
  direction = 'bottom',
  className,
  style,
  as: Tag = 'div',
}: BlurTextProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const tokens = animateBy === 'words' ? text.split(' ') : text.split('');
  const offset = direction === 'top' ? -18 : 18;

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      className={className}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        ...style,
      }}
    >
      {tokens.map((token, idx) => (
        <span
          key={`${token}-${idx}`}
          style={{
            display: 'inline-block',
            willChange: 'transform, opacity, filter',
            opacity: visible ? 1 : 0,
            filter: visible ? 'blur(0px)' : 'blur(12px)',
            transform: visible ? 'translate3d(0, 0, 0)' : `translate3d(0, ${offset}px, 0)`,
            transition: `opacity 680ms cubic-bezier(0.22, 1, 0.36, 1) ${
              delayMs + idx * stepDelayMs
            }ms, filter 680ms cubic-bezier(0.22, 1, 0.36, 1) ${
              delayMs + idx * stepDelayMs
            }ms, transform 680ms cubic-bezier(0.22, 1, 0.36, 1) ${
              delayMs + idx * stepDelayMs
            }ms`,
            marginRight: animateBy === 'words' && idx < tokens.length - 1 ? '0.28em' : undefined,
          }}
        >
          {token === ' ' ? '\u00A0' : token}
        </span>
      ))}
    </Tag>
  );
}

/* ============================================================================
 * 2. SplitText — React Bits
 * Entrada escalonada (staggered) para títulos editoriais e versículos
 * ========================================================================== */
export interface SplitTextProps {
  text: string;
  staggerMs?: number;
  delayMs?: number;
  className?: string;
  style?: React.CSSProperties;
  align?: 'left' | 'center' | 'right';
}

export function SplitText({
  text,
  staggerMs = 45,
  delayMs = 0,
  className,
  style,
  align = 'center',
}: SplitTextProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(' ');
  const justifyContent =
    align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';

  return (
    <span
      ref={ref}
      className={className}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent,
        ...style,
      }}
    >
      {words.map((word, idx) => (
        <span
          key={`${word}-${idx}`}
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            marginRight: idx < words.length - 1 ? '0.26em' : undefined,
            verticalAlign: 'bottom',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              opacity: inView ? 1 : 0,
              transform: inView ? 'translate3d(0, 0, 0)' : 'translate3d(0, 105%, 0)',
              transition: `transform 620ms cubic-bezier(0.22, 1, 0.36, 1) ${
                delayMs + idx * staggerMs
              }ms, opacity 500ms ease ${delayMs + idx * staggerMs}ms`,
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}

/* ============================================================================
 * 3. ShinyText — React Bits
 * Brilho acetinado suave percorrendo o texto
 * ========================================================================== */
export interface ShinyTextProps {
  text: string;
  speedSec?: number;
  baseColor?: string;
  shineColor?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function ShinyText({
  text,
  speedSec = 4.2,
  baseColor = '#5A6346',
  shineColor = '#FBF9F5',
  disabled = false,
  className,
  style,
}: ShinyTextProps) {
  return (
    <>
      <style>{`
        @keyframes rbShinySweep {
          0% { background-position: 180% center; }
          100% { background-position: -180% center; }
        }
      `}</style>
      <span
        className={className}
        style={{
          display: 'inline-block',
          color: baseColor,
          backgroundImage: disabled
            ? undefined
            : `linear-gradient(120deg, ${baseColor} 38%, ${shineColor} 50%, ${baseColor} 62%)`,
          backgroundSize: '220% auto',
          WebkitBackgroundClip: disabled ? undefined : 'text',
          backgroundClip: disabled ? undefined : 'text',
          WebkitTextFillColor: disabled ? baseColor : 'transparent',
          animation: disabled ? undefined : `rbShinySweep ${speedSec}s linear infinite`,
          ...style,
        }}
      >
        {text}
      </span>
    </>
  );
}

/* ============================================================================
 * 4. CountUp — React Bits
 * Contagem progressiva com easeOutExpo ao entrar na viewport
 * ========================================================================== */
export interface CountUpProps {
  to: number;
  from?: number;
  durationMs?: number;
  padDigits?: number;
  suffix?: string;
  prefix?: string;
  style?: React.CSSProperties;
  className?: string;
}

export function CountUp({
  to,
  from = 0,
  durationMs = 900,
  padDigits = 0,
  suffix = '',
  prefix = '',
  style,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState<number>(to);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplay(to);
      return;
    }

    const runAnimation = (startVal: number, endVal: number) => {
      const startTime = performance.now();
      let rafId = 0;

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / durationMs);
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = Math.round(startVal + (endVal - startVal) * eased);
        setDisplay(current);
        if (progress < 1) {
          rafId = requestAnimationFrame(step);
        }
      };

      rafId = requestAnimationFrame(step);
      return () => cancelAnimationFrame(rafId);
    };

    if (hasAnimatedRef.current) {
      setDisplay(to);
      return;
    }

    const el = ref.current;
    if (!el) return;

    let cancelAnim: (() => void) | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          cancelAnim = runAnimation(from, to);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnim?.();
    };
  }, [to, from, durationMs]);

  const formatted = padDigits > 0 ? String(display).padStart(padDigits, '0') : String(display);

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

/* ============================================================================
 * 5. TiltedCard — React Bits
 * Card com inclinação 3D interativa ao toque/cursor e brilho acetinado
 * ========================================================================== */
export interface TiltedCardProps {
  children: React.ReactNode;
  maxTiltDeg?: number;
  scaleOnHover?: number;
  initialRotateDeg?: number;
  glareOpacity?: number;
  style?: React.CSSProperties;
  className?: string;
}

export function TiltedCard({
  children,
  maxTiltDeg = 7,
  scaleOnHover = 1.02,
  initialRotateDeg = 0,
  glareOpacity = 0.18,
  style,
  className,
}: TiltedCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, active: false, gx: 50, gy: 50 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion()) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * (maxTiltDeg * 2);
    const ry = (px - 0.5) * (maxTiltDeg * 2);
    setTilt({ rx, ry, active: true, gx: px * 100, gy: py * 100 });
  };

  const handleReset = () => {
    setTilt({ rx: 0, ry: 0, active: false, gx: 50, gy: 50 });
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handleReset}
      onPointerCancel={handleReset}
      className={className}
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        transform: tilt.active
          ? `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale3d(${scaleOnHover}, ${scaleOnHover}, 1)`
          : `perspective(900px) rotate(${initialRotateDeg}deg) scale3d(1, 1, 1)`,
        transition: tilt.active
          ? 'transform 120ms ease-out'
          : 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)',
        ...style,
      }}
    >
      {children}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          borderRadius: 'inherit',
          opacity: tilt.active ? glareOpacity : 0,
          background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,0.85), transparent 60%)`,
          transition: 'opacity 250ms ease',
        }}
      />
    </div>
  );
}

/* ============================================================================
 * 6. SpotlightCard — React Bits
 * Luz radial que acompanha toque/cursor no card
 * ========================================================================== */
export interface SpotlightCardProps {
  children: React.ReactNode;
  spotlightColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: string;
  padding?: string;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

export function SpotlightCard({
  children,
  spotlightColor = 'rgba(90, 99, 70, 0.14)',
  backgroundColor = '#FFFFFF',
  borderColor = '#E8DFD1',
  borderRadius = '16px',
  padding = '24px',
  style,
  className,
  onClick,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: 50, y: 50, opacity: 0 });

  const updatePos = (clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({
      x: clientX - rect.left,
      y: clientY - rect.top,
      opacity: 1,
    });
  };

  return (
    <div
      ref={ref}
      onClick={onClick}
      onPointerMove={(e) => updatePos(e.clientX, e.clientY)}
      onPointerDown={(e) => updatePos(e.clientX, e.clientY)}
      onPointerLeave={() => setPos((p) => ({ ...p, opacity: 0 }))}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor,
        border: `1px solid ${borderColor}`,
        borderRadius,
        padding,
        transition: 'transform 220ms ease, box-shadow 220ms ease',
        ...style,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: pos.opacity,
          background: `radial-gradient(260px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 75%)`,
          transition: 'opacity 300ms ease',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}

/* ============================================================================
 * 7. AnimatedContent — React Bits
 * Scroll-reveal declarativo com direção e atraso escalonado
 * ========================================================================== */
export interface AnimatedContentProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  distancePx?: number;
  delayMs?: number;
  durationMs?: number;
  scale?: number;
  style?: React.CSSProperties;
  className?: string;
}

export function AnimatedContent({
  children,
  direction = 'up',
  distancePx = 22,
  delayMs = 0,
  durationMs = 620,
  scale = 0.98,
  style,
  className,
}: AnimatedContentProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const initialTransform =
    direction === 'up'
      ? `translate3d(0, ${distancePx}px, 0) scale(${scale})`
      : direction === 'down'
      ? `translate3d(0, -${distancePx}px, 0) scale(${scale})`
      : direction === 'left'
      ? `translate3d(${distancePx}px, 0, 0) scale(${scale})`
      : `translate3d(-${distancePx}px, 0, 0) scale(${scale})`;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        willChange: 'transform, opacity',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate3d(0, 0, 0) scale(1)' : initialTransform,
        transition: `opacity ${durationMs}ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms, transform ${durationMs}ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ============================================================================
 * 8. ClickSpark — React Bits
 * Micro-faíscas vetoriais no toque/clique sem interferir nos eventos filhos
 * ========================================================================== */
interface SparkParticle {
  id: number;
  x: number;
  y: number;
}

export interface ClickSparkProps {
  children: React.ReactNode;
  sparkColor?: string;
  sparkCount?: number;
  style?: React.CSSProperties;
  className?: string;
}

export function ClickSpark({
  children,
  sparkColor = '#C6A972',
  sparkCount = 8,
  style,
  className,
}: ClickSparkProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [sparks, setSparks] = useState<SparkParticle[]>([]);

  const triggerSpark = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion()) return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const id = Date.now() + Math.random();
    setSparks((prev) => [
      ...prev.slice(-4),
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
    ]);
    setTimeout(() => {
      setSparks((prev) => prev.filter((s) => s.id !== id));
    }, 520);
  };

  return (
    <>
      <style>{`
        @keyframes rbSparkBurst {
          0% { transform: translate(-50%, -50%) scale(0.3); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.65); opacity: 0; }
        }
      `}</style>
      <div
        ref={containerRef}
        onPointerDown={triggerSpark}
        className={className}
        style={{
          position: 'relative',
          display: 'inline-block',
          ...style,
        }}
      >
        {children}
        {sparks.map((spark) => (
          <svg
            key={spark.id}
            width="44"
            height="44"
            viewBox="0 0 44 44"
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: spark.x,
              top: spark.y,
              pointerEvents: 'none',
              zIndex: 40,
              animation: 'rbSparkBurst 480ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
            }}
          >
            {Array.from({ length: sparkCount }).map((_, idx) => {
              const angle = (idx * 360) / sparkCount;
              const rad = (angle * Math.PI) / 180;
              const x1 = 22 + Math.cos(rad) * 7;
              const y1 = 22 + Math.sin(rad) * 7;
              const x2 = 22 + Math.cos(rad) * 18;
              const y2 = 22 + Math.sin(rad) * 18;
              return (
                <line
                  key={idx}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={sparkColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
        ))}
      </div>
    </>
  );
}

/* ============================================================================
 * 9. MobileDock — React Bits Dock adaptado para ergonomia de polegar Mobile-First
 * ========================================================================== */
export interface MobileDockItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  highlight?: boolean;
  badgeText?: string;
}

export interface MobileDockProps {
  items: MobileDockItem[];
  renderLink?: (item: MobileDockItem, children: React.ReactNode) => React.ReactNode;
}

export function MobileDock({ items, renderLink }: MobileDockProps) {
  return (
    <>
      <style>{`
        .wending-mobile-dock {
          display: flex;
        }
        @media (min-width: 768px) {
          .wending-mobile-dock {
            display: none !important;
          }
        }
      `}</style>
      <nav
        aria-label="Navegação rápida mobile"
        className="wending-mobile-dock"
        style={{
          position: 'fixed',
          left: '12px',
          right: '12px',
          bottom: 'calc(10px + env(safe-area-inset-bottom, 0px))',
          zIndex: 700,
          justifyContent: 'space-around',
          alignItems: 'center',
          backgroundColor: 'rgba(251, 249, 245, 0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid #DFD5C6',
          borderRadius: '22px',
          padding: '6px 8px',
          boxShadow: '0 12px 32px rgba(44, 38, 35, 0.16)',
        }}
      >
        {items.map((item) => {
          const content = (
            <span
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                minWidth: '52px',
                minHeight: '46px',
                padding: item.highlight ? '8px 14px' : '6px 8px',
                borderRadius: item.highlight ? '16px' : '12px',
                backgroundColor: item.highlight
                  ? '#5A6346'
                  : item.active
                  ? '#F3ECE1'
                  : 'transparent',
                color: item.highlight
                  ? '#FBF9F5'
                  : item.active
                  ? '#434B32'
                  : '#6E655F',
                position: 'relative',
                transition: 'transform 160ms ease, background-color 160ms ease',
              }}
            >
              {item.icon}
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: item.highlight || item.active ? 700 : 600,
                  letterSpacing: '0.02em',
                  lineHeight: 1,
                }}
              >
                {item.label}
              </span>
              {item.badgeText && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '4px',
                    backgroundColor: '#B97A57',
                    color: '#FFFFFF',
                    fontSize: '9px',
                    fontWeight: 700,
                    padding: '1px 5px',
                    borderRadius: '999px',
                  }}
                >
                  {item.badgeText}
                </span>
              )}
            </span>
          );

          if (renderLink && item.href) {
            return (
              <React.Fragment key={item.id}>{renderLink(item, content)}</React.Fragment>
            );
          }

          if (item.href) {
            return (
              <a
                key={item.id}
                href={item.href}
                style={{ textDecoration: 'none', WebkitTapHighlightColor: 'transparent' }}
              >
                {content}
              </a>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {content}
            </button>
          );
        })}
      </nav>
    </>
  );
}
