import type { ReactNode } from 'react'
import { CONFIG, type Foto } from '../config'

/** Monograma provisório: "MQ" dentro de um anel fino (o prato). */
export function Monogram({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <circle cx="20" cy="20" r="19" fill="none" stroke="var(--accent)" strokeWidth="1" />
      <text
        x="20"
        y="24.6"
        textAnchor="middle"
        fontFamily="Bricolage, 'Bricolage Fallback', Arial, sans-serif"
        fontWeight="700"
        fontSize="13.5"
        letterSpacing="-0.6"
        fill="currentColor"
      >
        MQ
      </text>
    </svg>
  )
}

export function Brand() {
  if (CONFIG.logo) {
    return (
      <a href="#inicio" className="brand" aria-label={`${CONFIG.nome}, início`}>
        <img src={CONFIG.logo} alt={CONFIG.nome} height={40} />
      </a>
    )
  }
  return (
    <a href="#inicio" className="brand">
      <Monogram className="brand-mark" />
      <span className="brand-name">
        <b>{CONFIG.nome}</b>
        <small>
          {CONFIG.descritor} · {CONFIG.registro}
        </small>
      </span>
    </a>
  )
}

/** Título com revelação por linha (mecanismo A). Cada item de `lines` é uma linha mascarada. */
export function RevealTitle({
  as: Tag = 'h2',
  lines,
  className = '',
  id,
}: {
  as?: 'h2' | 'h3' | 'p'
  lines: ReactNode[]
  className?: string
  id?: string
}) {
  return (
    <Tag className={`reveal ${className}`} id={id} data-reveal>
      {lines.map((l, i) => (
        <span className="reveal-line" key={i}>
          <span data-line>{l}</span>
        </span>
      ))}
    </Tag>
  )
}

/** Cabeçalho de seção: anel miniatura que se desenha (mecanismo B) + número + rótulo. */
export function SectionHead({ n, label }: { n: string; label: string }) {
  return (
    <div className="sec-head reveal" data-reveal>
      <span className="sec-ring" aria-hidden="true">
        <svg viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="19.5" pathLength={1} />
        </svg>
        <span className="tnum">{n}</span>
      </span>
      <span className="label">{label}</span>
    </div>
  )
}

export function WaButton({
  text,
  children,
  variant = 'solid',
  small = false,
  className = '',
  ariaLabel,
}: {
  text: string
  children: ReactNode
  variant?: 'solid' | 'ghost'
  small?: boolean
  className?: string
  ariaLabel?: string
}) {
  if (!CONFIG.usarWhatsapp || !CONFIG.whatsapp) return null
  return (
    <a
      className={`btn ${variant === 'ghost' ? 'btn-ghost' : ''} ${small ? 'btn-small' : ''} ${className}`}
      href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel ? `${ariaLabel} (abre o WhatsApp em nova aba)` : undefined}
    >
      <span className="dot" aria-hidden="true" />
      {children}
    </a>
  )
}

export function ExtButton({
  href,
  children,
  variant = 'ghost',
}: {
  href: string
  children: ReactNode
  variant?: 'solid' | 'ghost'
}) {
  if (!href) return null
  return (
    <a
      className={`btn ${variant === 'ghost' ? 'btn-ghost' : ''}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  )
}

export function Picture({
  foto,
  sizes,
  className = '',
  eager = false,
}: {
  foto: Foto | null | undefined
  sizes: string
  className?: string
  eager?: boolean
}) {
  if (!foto) return null
  const srcSet = foto.larguras.map((w) => `${foto.src}-${w}.webp ${w}w`).join(', ')
  return (
    <div className={`photo ${className}`} style={{ aspectRatio: `${foto.largura} / ${foto.altura}` }}>
      <img
        src={`${foto.src}-${foto.larguras[foto.larguras.length - 1]}.webp`}
        srcSet={srcSet}
        sizes={sizes}
        width={foto.largura}
        height={foto.altura}
        alt={foto.alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    </div>
  )
}
