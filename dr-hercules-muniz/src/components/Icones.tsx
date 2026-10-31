import type { SVGProps } from 'react'
import type { Atendimento } from '../config'

type P = SVGProps<SVGSVGElement>

const base = (p: P): P => ({
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
  ...p,
})

export const IconeWhats = (p: P) => (
  <svg viewBox="0 0 24 24" {...base(p)}>
    <path d="M4.5 19.5 5.6 16A8 8 0 1 1 8.4 18.6Z" />
    <path d="M9.2 8.6c.2-.4.5-.5.8-.5h.4c.2 0 .3.1.4.3l.6 1.4c.1.2 0 .4-.1.6l-.4.5c-.1.1-.1.3 0 .4.6 1 1.4 1.7 2.4 2.2.2.1.3.1.4 0l.5-.6c.2-.2.4-.2.6-.1l1.3.6c.2.1.3.3.3.5 0 .9-.7 1.6-1.6 1.6-2.9 0-6-3-6-5.9 0-.4.1-.8.4-1.1Z" />
  </svg>
)

export const IconeInstagram = (p: P) => (
  <svg viewBox="0 0 24 24" {...base(p)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
  </svg>
)

export const IconePin = (p: P) => (
  <svg viewBox="0 0 24 24" {...base(p)}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
)

export const IconeRelogio = (p: P) => (
  <svg viewBox="0 0 24 24" {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
)

export const IconeSeta = (p: P) => (
  <svg viewBox="0 0 24 24" {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const IconeMais = (p: P) => (
  <svg viewBox="0 0 24 24" {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const IconeCheck = (p: P) => (
  <svg viewBox="0 0 24 24" {...base(p)}>
    <path d="m5 12.5 4.2 4L19 7" />
  </svg>
)

export const IconeAcessivel = (p: P) => (
  <svg viewBox="0 0 24 24" {...base(p)}>
    <circle cx="12" cy="4.6" r="1.6" />
    <path d="M7 8.5h10M12 8.5v5M12 13.5l-3 6.5M12 13.5l3 6.5" />
  </svg>
)

export const IconeCartao = (p: P) => (
  <svg viewBox="0 0 24 24" {...base(p)}>
    <rect x="3" y="6" width="18" height="12.5" rx="2.2" />
    <path d="M3 10h18M7 14.5h3.5" />
  </svg>
)

export const IconeCalendario = (p: P) => (
  <svg viewBox="0 0 24 24" {...base(p)}>
    <rect x="3.5" y="5" width="17" height="15" rx="2.2" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
  </svg>
)

export const IconeMenu = (p: P) => (
  <svg viewBox="0 0 24 24" {...base(p)}>
    <path d="M4 8h16M4 16h16" />
  </svg>
)

export const IconeFechar = (p: P) => (
  <svg viewBox="0 0 24 24" {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

/* ---------- Ilustrações de traço dos atendimentos (originais) ---------- */

/** Implante: coroa sobre pilar e parafuso com roscas. */
const Implante = (p: P) => (
  <svg viewBox="0 0 64 64" {...base({ strokeWidth: 1.2, ...p })}>
    <path d="M20 14c0-4 3.4-6 6.5-5.2 2.4.6 3.6 1.4 5.5 1.4s3.1-.8 5.5-1.4C40.6 8 44 10 44 14c0 4-1.4 7.4-3.3 10H23.3C21.4 21.4 20 18 20 14Z" />
    <path d="M27 24v4h10v-4" />
    <path d="M28.5 28v26l3.5 4 3.5-4V28" />
    <path d="M26.5 33h11M27 38.5h10M27.5 44h9M28 49.5h8" />
  </svg>
)

/** Ortodontia: arco dentário com fio e bráquetes. */
const Ortodontia = (p: P) => (
  <svg viewBox="0 0 64 64" {...base({ strokeWidth: 1.2, ...p })}>
    <path d="M10 44c0-15 9.8-27 22-27s22 12 22 27" />
    <path d="M14.5 44c0-12 7.8-22 17.5-22s17.5 10 17.5 22" />
    <path d="M12 37c6 1 34 1 40 0" strokeDasharray="0" />
    <rect x="15" y="33.5" width="5" height="5" rx="1" />
    <rect x="23" y="27" width="5" height="5" rx="1" />
    <rect x="29.5" y="24.5" width="5" height="5" rx="1" />
    <rect x="36" y="27" width="5" height="5" rx="1" />
    <rect x="44" y="33.5" width="5" height="5" rx="1" />
    <path d="M17.5 36 25.5 29.5 32 27 38.5 29.5 46.5 36" />
  </svg>
)

/** Harmonização: perfil facial em traço único com linhas de proporção. */
const Harmonizacao = (p: P) => (
  <svg viewBox="0 0 64 64" {...base({ strokeWidth: 1.2, ...p })}>
    <path d="M36 8c-7 0-13 5-13 13 0 3 .4 4.6-1.6 7.4L19 32.5c-.5.8 0 1.6.9 1.7l2.6.3c.2 2.4-.2 3.4.6 4.4.6.6-.6 1.3-.2 2 .5.8.9.9.5 1.9-.6 1.6-.5 4 1.6 4.6 2.3.7 5.8.2 7.4.6 1.6.5 2.2 3.2 2.6 6" />
    <path d="M36 8c8 0 13 6 13 14 0 7-4 11-6 15" opacity=".45" />
    <path d="M12 21.5h40M12 34h40M12 46.5h40" strokeDasharray="1.5 3.5" opacity=".6" />
  </svg>
)

/** Estética do sorriso: curva do sorriso com contorno de dentes. */
const Estetica = (p: P) => (
  <svg viewBox="0 0 64 64" {...base({ strokeWidth: 1.2, ...p })}>
    <path d="M8 26c7 3 15.5 4.5 24 4.5S49 29 56 26" />
    <path d="M8 26c4.5 11 13 18 24 18s19.5-7 24-18" />
    <path d="M20.5 29.5v5.5c0 2.5 1.6 3.6 3.3 3.6S27 37.5 27 35v-4.6M27 30.4V36c0 2.6 2.2 3.4 5 3.4s5-.8 5-3.4v-5.6M37 30.4V35c0 2.5 1.4 3.6 3.2 3.6s3.3-1.1 3.3-3.6v-5.5" />
    <circle cx="32" cy="32" r="24" opacity=".25" />
  </svg>
)

export function IlustracaoAtendimento({ tipo, ...p }: { tipo: Atendimento['icone'] } & P) {
  switch (tipo) {
    case 'implante':
      return <Implante {...p} />
    case 'ortodontia':
      return <Ortodontia {...p} />
    case 'harmonizacao':
      return <Harmonizacao {...p} />
    case 'estetica':
      return <Estetica {...p} />
  }
}

/** Dente em traço fino, usado na composição do hero. */
export const DenteTraco = (p: P) => (
  <svg viewBox="0 0 120 140" {...base({ strokeWidth: 1, ...p })}>
    <path d="M60 22c-8 0-12-6-26-6C20 16 12 28 12 44c0 18 8 30 12 46 4 15 5 34 15 34 9 0 9-14 11-24 2-9 5-14 10-14s8 5 10 14c2 10 2 24 11 24 10 0 11-19 15-34 4-16 12-28 12-46 0-16-8-28-22-28-14 0-18 6-26 6Z" />
  </svg>
)
