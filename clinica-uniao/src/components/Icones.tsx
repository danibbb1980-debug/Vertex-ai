/**
 * Ícones de traço originais (desenhados para este site), 48x48, stroke = currentColor.
 * Sem bocas, sem pacientes, sem "antes e depois": só formas simples.
 */
import type { Atendimento } from '../config'

const base = {
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

// contorno de dente reutilizado
const DENTE =
  'M15 9c-4 0-6.5 3-6.5 7.5 0 4 1.6 6.5 2.6 9.6.9 2.8 1 6.6 1.6 10 .5 2.6 1.6 4.4 3 4.4 1.7 0 2.2-2.2 2.6-5 .4-3.2.8-6 3.7-6s3.3 2.8 3.7 6c.4 2.8.9 5 2.6 5 1.4 0 2.5-1.8 3-4.4.6-3.4.7-7.2 1.6-10 1-3.1 2.6-5.6 2.6-9.6C39.5 12 37 9 33 9c-3.3 0-5 1.8-9 1.8S18.3 9 15 9Z'

export function IconeAtendimento({ tipo, className = 'h-11 w-11' }: { tipo: Atendimento['icone']; className?: string }) {
  switch (tipo) {
    case 'estetica':
      return (
        <svg {...base} className={className}>
          <path d={DENTE} />
          <path d="M36.5 4.5v5M34 7h5" />
          <path d="M18 15.5c1.8-1.4 3.8-1.8 6-1" opacity=".55" />
        </svg>
      )
    case 'implante':
      return (
        <svg {...base} className={className}>
          <path d="M14 8.5c0-2 2-3.5 4.5-3.5 2.4 0 3.6 1.3 5.5 1.3S27.1 5 29.5 5C32 5 34 6.5 34 8.5c0 3.4-1.8 5.5-3.5 7H17.5C15.8 14 14 11.9 14 8.5Z" />
          <path d="M17 19.5h14M18.5 24h11M19.5 28.5h9M20.5 33h7M22 37.5h4" />
          <path d="M22.5 41.5 24 44l1.5-2.5" />
        </svg>
      )
    case 'reabilitacao':
      return (
        <svg {...base} className={className}>
          <path d="M6 30c3-10 10.5-16 18-16s15 6 18 16" />
          <path d="M11 27.5v-4.2c0-1.4 1-2.3 2.3-2.3s2.2.9 2.2 2.3v6" />
          <path d="M18 30v-6.8c0-1.5 1.1-2.6 2.6-2.6 1.5 0 2.6 1.1 2.6 2.6V31" />
          <path d="M25 31v-7.8c0-1.5 1.1-2.6 2.6-2.6 1.5 0 2.6 1.1 2.6 2.6V30" />
          <path d="M32.5 29.5v-6.2c0-1.4.9-2.3 2.2-2.3 1.3 0 2.3.9 2.3 2.3v4.2" opacity=".55" />
          <path d="M8 37h32" opacity=".55" />
        </svg>
      )
    case 'canal':
      return (
        <svg {...base} className={className}>
          <path d={DENTE} />
          <path d="M20.5 22c.6 4 .5 8.5 0 12.5M27.5 22c-.6 4-.5 8.5 0 12.5" opacity=".55" strokeDasharray="1.5 2.5" />
          <path d="M19 17.5c1.6 1.4 3.2 2 5 2s3.4-.6 5-2" />
        </svg>
      )
    case 'ortodontia':
      return (
        <svg {...base} className={className}>
          <rect x="5.5" y="17" width="9" height="14" rx="3.5" />
          <rect x="19.5" y="16" width="9" height="16" rx="3.5" />
          <rect x="33.5" y="17" width="9" height="14" rx="3.5" />
          <path d="M3 24h45" />
          <rect x="8" y="21.5" width="4" height="5" rx="1" />
          <rect x="22" y="21.5" width="4" height="5" rx="1" />
          <rect x="36" y="21.5" width="4" height="5" rx="1" />
        </svg>
      )
    case 'crianca':
      return (
        <svg {...base} className={className}>
          <path d="M11 15c-2.7 0-4.4 2-4.4 5 0 2.7 1.1 4.4 1.8 6.5.6 1.9.7 4.4 1.1 6.7.3 1.8 1 3 2 3 1.2 0 1.5-1.5 1.8-3.4.3-2.1.5-4 2.5-4s2.2 1.9 2.5 4c.3 1.9.6 3.4 1.8 3.4 1 0 1.7-1.2 2-3 .4-2.3.5-4.8 1.1-6.7.7-2.1 1.8-3.8 1.8-6.5 0-3-1.7-5-4.4-5-2.2 0-3.3 1.2-6 1.2S13.2 15 11 15Z" />
          <path d="M33 8.5c-3.6 0-5.9 2.7-5.9 6.7 0 3.6 1.4 5.8 2.3 8.5" opacity=".55" />
          <path d="M33 8.5c3 0 4.4 1.6 7.4 1.6M40.6 10.5c1.6 1.2 2.4 3 2.4 5.2 0 3.6-1.4 5.8-2.3 8.5-.8 2.5-.9 5.9-1.4 8.9-.4 2.3-1.4 3.9-2.7 3.9-1.5 0-2-1.9-2.3-4.4-.2-1.6-.4-3-1-4" opacity=".55" />
        </svg>
      )
    case 'face':
      return (
        <svg {...base} className={className}>
          <path d="M24 5c-8 0-13.5 6.5-13.5 15.5 0 8 3.5 15 8 19.5 1.8 1.8 3.6 3 5.5 3s3.7-1.2 5.5-3c4.5-4.5 8-11.5 8-19.5C37.5 11.5 32 5 24 5Z" />
          <path d="M18 21c1.3-1 2.7-1 4 0M26 21c1.3-1 2.7-1 4 0" opacity=".55" />
          <path d="M24 23.5v6l-2 1.2" opacity=".55" />
          <path d="M20.5 35c2.3 1.2 4.7 1.2 7 0" />
        </svg>
      )
  }
}

export function IconePilar({ tipo, className = 'h-10 w-10' }: { tipo: 'areas' | 'relogio' | 'idades'; className?: string }) {
  if (tipo === 'areas')
    return (
      <svg {...base} className={className}>
        <path d="M10 33A17 17 0 0 1 24 7" />
        <path d="M38 15a17 17 0 0 1-14 26" opacity=".6" />
        <circle cx="24" cy="24" r="4" />
        <circle cx="10" cy="33" r="1.6" fill="currentColor" />
        <circle cx="38" cy="15" r="1.6" fill="currentColor" />
      </svg>
    )
  if (tipo === 'relogio')
    return (
      <svg {...base} className={className}>
        <circle cx="24" cy="26" r="16" />
        <path d="M24 17v9l6 4" />
        <path d="M19 5h10M24 5v5" opacity=".6" />
      </svg>
    )
  return (
    <svg {...base} className={className}>
      <circle cx="15" cy="15" r="5" />
      <path d="M6 41v-7.5C6 28.8 10 25 15 25s9 3.8 9 8.5V41" />
      <circle cx="34" cy="22" r="3.6" opacity=".7" />
      <path d="M27.5 41v-5.5c0-3.8 2.9-6.5 6.5-6.5s6.5 2.7 6.5 6.5V41" opacity=".7" />
    </svg>
  )
}

export function IconeEstrutura({ tipo, className = 'h-10 w-10' }: { tipo: 'acessivel' | 'agenda' | 'cartao'; className?: string }) {
  if (tipo === 'acessivel')
    return (
      <svg {...base} className={className}>
        <circle cx="22" cy="8" r="3" />
        <path d="M22 13v12h11l4 10" />
        <path d="M22 18h8" />
        <path d="M16.5 21.5a10 10 0 1 0 14 12.5" />
      </svg>
    )
  if (tipo === 'agenda')
    return (
      <svg {...base} className={className}>
        <rect x="6" y="10" width="36" height="31" rx="5" />
        <path d="M6 19h36M15 6v7M33 6v7" />
        <path d="m18 30 4 4 8-8" />
      </svg>
    )
  return (
    <svg {...base} className={className}>
      <rect x="5" y="12" width="32" height="22" rx="4" />
      <path d="M5 19h32M11 28h8" />
      <path d="M40 20a8 8 0 0 1 0 12M44 17a12.5 12.5 0 0 1 0 18" opacity=".6" />
    </svg>
  )
}

export function IconeWhats({ className = 'h-5 w-5' }: { className?: string }) {
  // balão de conversa simples (discreto)
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20.5 11.6a8.4 8.4 0 0 1-12.4 7.4L3.5 20.5 5 16.1A8.4 8.4 0 1 1 20.5 11.6Z" />
      <path d="M9 9.2c.2 2.6 2.9 5.4 5.8 5.8l1.1-1.4-1.9-1-.9.8c-1-.4-2.1-1.5-2.5-2.5l.8-.9-1-1.9L9 9.2Z" strokeWidth="1.3" />
    </svg>
  )
}
