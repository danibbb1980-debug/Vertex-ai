import { useEffect, useId, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { Phone } from 'lucide-react'
import { CONFIG } from '../config'
import { linkWhatsApp } from '../lib/util'

/* ---------- Ícones de marca (desenhados à mão, traço fino) ---------- */

export function IconeWhatsApp({ className = 'size-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4.3 19.7l1.1-3.9A8.2 8.2 0 1 1 8.6 19l-4.3.7Z" strokeLinejoin="round" />
      <path
        d="M9.2 8.4c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.1.3 0 .5.5.9 1.3 1.7 2.3 2.2.2.1.4.1.5-.1l.6-.7c.2-.2.4-.2.6-.1l1.5.7c.2.1.4.3.3.5 0 .6-.3 1.2-.8 1.5-.6.3-1.4.4-2.4 0-1.8-.7-3.4-2.2-4.3-3.9-.6-1.2-.6-2.3-.2-2.8Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  )
}

export function IconeInstagram({ className = 'size-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.9" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Ilustrações de traço original para cada atendimento (sem pernas, veias realistas ou sangue). */
export function IlustracaoAtendimento({ id, className = 'size-14' }: { id: string; className?: string }) {
  const comum = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.2, strokeLinecap: 'round' as const }
  if (id === 'fleboestetica')
    return (
      <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="22" fill="var(--color-pessego)" opacity=".7" />
        <path {...comum} d="M32 10c-3 8 4 12 1 20s-6 10-2 24" />
        <path {...comum} d="M33 30c5-2 8 1 12-2M31 40c-5 1-7-2-11 0M33 22c3 0 5-2 8-1" opacity=".75" />
      </svg>
    )
  if (id === 'endolaser')
    return (
      <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="22" fill="var(--color-pessego)" opacity=".7" />
        <path {...comum} d="M14 40c8-2 14-14 22-16s12 2 14 0" />
        <path {...comum} d="M14 40c8-2 14-14 22-16" stroke="var(--color-vinho)" strokeWidth="1.6" />
        <circle cx="36" cy="24" r="2" fill="var(--color-vinho)" />
        <path {...comum} d="M40 18l2-3M42 23h3.5M39.5 28.5l2.5 2.2" opacity=".7" />
      </svg>
    )
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="22" fill="var(--color-pessego)" opacity=".7" />
      <path {...comum} d="M22 10c0 14 10 14 10 22s-10 8-10 22" />
      <path {...comum} d="M42 10c0 14-10 14-10 22s10 8 10 22" stroke="var(--color-vinho)" />
    </svg>
  )
}

/* ---------- Revelação ao rolar (IntersectionObserver + CSS, sem custo no scroll) ---------- */

export function Revela({
  as: Tag = 'div',
  atraso = 0,
  className = '',
  children,
  ...rest
}: {
  as?: ElementType
  atraso?: number
  className?: string
  children: ReactNode
  [k: string]: unknown
}) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('visivel')
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Tag ref={ref} className={`revela ${className}`} style={{ '--atraso': `${atraso}ms` } as CSSProperties} {...rest}>
      {children}
    </Tag>
  )
}

export function useNaTela<T extends HTMLElement>(margem = '0px') {
  const ref = useRef<T>(null)
  const [naTela, setNaTela] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setNaTela(e.isIntersecting), { rootMargin: margem })
    io.observe(el)
    return () => io.disconnect()
  }, [margem])
  return [ref, naTela] as const
}

/* ---------- Botões de contato: WhatsApp + Ligar sempre juntos ---------- */

export function BotaoWhatsApp({
  mensagem,
  children = 'Agendar pelo WhatsApp',
  variante = 'primario',
  className = '',
  rotuloAria,
}: {
  mensagem?: string
  children?: ReactNode
  variante?: 'primario' | 'claro'
  className?: string
  rotuloAria?: string
}) {
  return (
    <a
      href={linkWhatsApp(mensagem)}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn ${variante === 'claro' ? 'btn-claro' : 'btn-primario'} ${className}`}
      aria-label={rotuloAria}
    >
      <IconeWhatsApp />
      <span>{children}</span>
    </a>
  )
}

export function BotaoLigar({
  variante = 'secundario',
  className = '',
}: {
  variante?: 'secundario' | 'contorno-claro'
  className?: string
}) {
  return (
    <a
      href={CONFIG.telefoneLink}
      className={`btn ${variante === 'contorno-claro' ? 'btn-contorno-claro' : 'btn-secundario'} ${className}`}
      aria-label={`Ligar para o consultório: ${CONFIG.telefone}`}
    >
      <Phone className="size-[1.1rem]" strokeWidth={1.6} aria-hidden="true" />
      <span>Ligar</span>
    </a>
  )
}

/* ---------- Texturas de aquarela (recortadas do próprio logo) ---------- */

export function Aquarela({
  tipo = 'topo',
  className = '',
  style,
  imediata = false,
}: {
  tipo?: 'topo' | 'base'
  className?: string
  style?: CSSProperties
  imediata?: boolean
}) {
  return (
    <img
      src={tipo === 'topo' ? '/img/aquarela-topo.webp' : '/img/aquarela-base.webp'}
      alt=""
      aria-hidden="true"
      loading={imediata ? 'eager' : 'lazy'}
      decoding="async"
      width={tipo === 'topo' ? 1100 : 640}
      height={tipo === 'topo' ? 344 : 100}
      className={`pointer-events-none absolute select-none ${className}`}
      style={style}
    />
  )
}

/** Título com uma palavra em ênfase: use *palavra* no texto. */
export function Enfase({ texto }: { texto: string }) {
  const partes = texto.split(/(\*[^*]+\*)/g)
  return (
    <>
      {partes.map((p, i) =>
        p.startsWith('*') ? (
          <em key={i} className="enfase">
            {p.slice(1, -1)}
          </em>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

export function Credenciais({ className = '' }: { className?: string }) {
  return (
    <span className={className}>
      {CONFIG.crm} · {CONFIG.rqe}
    </span>
  )
}

/**
 * Monograma "TL" em vetor, com as mesmas posições e cores das linhas do logo
 * (medidas no arquivo original), sobre uma mancha de aquarela. Usado só como elemento decorativo grande,
 * onde o recorte do JPEG ficaria serrilhado. Header e rodapé usam o logo original.
 */
export function Monograma({ className = '', mancha = true }: { className?: string; mancha?: boolean }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <svg className={className} viewBox="262 200 135 125" aria-hidden="true" focusable="false">
      {mancha && (
        <>
          <defs>
            <filter id={`aq-${id}`} x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" seed="7" />
              <feDisplacementMap in="SourceGraphic" scale="9" />
              <feGaussianBlur stdDeviation="0.6" />
            </filter>
          </defs>
          <g filter={`url(#aq-${id})`}>
            <ellipse cx="331" cy="262" rx="52" ry="48" fill="#f0ddc9" />
            <ellipse cx="322" cy="270" rx="34" ry="30" fill="#ead0b9" opacity=".55" />
          </g>
        </>
      )}
      <path d="M302 232.5H328.2V304.3" fill="none" stroke="#373955" strokeWidth="1.7" />
      <path d="M335 232.5V304.3H380" fill="none" stroke="#94283f" strokeWidth="1.7" />
    </svg>
  )
}
