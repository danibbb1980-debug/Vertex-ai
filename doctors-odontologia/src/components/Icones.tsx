import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { tamanho?: number }

const base = ({ tamanho = 24, ...p }: P) => ({
  width: tamanho,
  height: tamanho,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
  ...p,
})

/** Contorno de dente usado em vários ícones */
const DENTE =
  'M7.2 3.5c-2.3 0-3.7 1.9-3.7 4.4 0 2 .8 3.4 1.3 5.2.5 1.9.7 4 1.2 5.6.4 1.3 1 1.8 1.6 1.8.9 0 1.2-.9 1.5-2.4.3-1.6.6-3.6 2.9-3.6s2.6 2 2.9 3.6c.3 1.5.6 2.4 1.5 2.4.6 0 1.2-.5 1.6-1.8.5-1.6.7-3.7 1.2-5.6.5-1.8 1.3-3.2 1.3-5.2 0-2.5-1.4-4.4-3.7-4.4-1.8 0-2.7.9-4.8.9s-3-.9-4.8-.9Z'

export const IconeDente = (p: P) => (
  <svg {...base(p)}>
    <path d={DENTE} />
  </svg>
)

export const IconeImplante = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 3.5c-1.8 0-3 1.4-3 3.3 0 1.6 1 2.7 2 3.2h12c1-.5 2-1.6 2-3.2 0-1.9-1.2-3.3-3-3.3-1.5 0-2.4.8-5 .8s-3.5-.8-5-.8Z" />
    <path d="M9 10v1.5h6V10M9.5 13h5M10 15h4M10.5 17h3M11 19h2l-1 1.8z" />
  </svg>
)

export const IconeOrtodontia = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 9c3 4 15 4 18 0" />
    <rect x="5" y="9.6" width="3" height="3" rx=".6" />
    <rect x="10.5" y="10.6" width="3" height="3" rx=".6" />
    <rect x="16" y="9.6" width="3" height="3" rx=".6" />
    <path d="M3 15.5c3 3 15 3 18 0" />
  </svg>
)

export const IconeCanal = (p: P) => (
  <svg {...base(p)}>
    <path d={DENTE} />
    <path d="M9.6 8.5c.6 2 .4 5 .1 7.5M14.4 8.5c-.6 2-.4 5-.1 7.5" strokeDasharray="1.6 1.6" />
  </svg>
)

export const IconeCirurgia = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 20 14.5 9.5M14.5 9.5l2-5 3 3-5 2" />
    <path d="M6.5 17.5 8 19" />
    <circle cx="18" cy="17" r="2.5" />
  </svg>
)

export const IconeProtese = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 8.5h18M4 8.5v5.2c0 1.7 1.1 2.8 2.6 2.8S9 15.4 9 13.7M9 8.5v5.2c0 1.7 1.1 2.8 2.6 2.8h.8c1.5 0 2.6-1.1 2.6-2.8V8.5M15 13.7c0 1.7.9 2.8 2.4 2.8S20 15.4 20 13.7V8.5" />
  </svg>
)

export const IconeClinico = (p: P) => (
  <svg {...base(p)}>
    <circle cx="10.5" cy="10.5" r="5.5" />
    <path d="m15 15 5 5M8.5 10.5h4M10.5 8.5v4" />
  </svg>
)

export const IconeInfantil = (p: P) => (
  <svg {...base(p)}>
    <path d="M8.3 6.5c-1.7 0-2.8 1.4-2.8 3.3 0 1.5.6 2.6 1 3.9.4 1.4.5 3 .9 4.2.3 1 .7 1.3 1.2 1.3.7 0 .9-.7 1.1-1.8.2-1.2.5-2.7 2.3-2.7s2.1 1.5 2.3 2.7c.2 1.1.4 1.8 1.1 1.8.5 0 .9-.3 1.2-1.3.4-1.2.5-2.8.9-4.2.4-1.3 1-2.4 1-3.9 0-1.9-1.1-3.3-2.8-3.3-1.4 0-2 .7-3.7.7s-2.3-.7-3.7-.7Z" />
    <path d="m18.5 2.5.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5z" />
  </svg>
)

export const IconeRelogio = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7v5l3.2 2" />
  </svg>
)

export const IconeCalendario = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4M8 13.5h2M14 13.5h2M8 16.5h2" />
  </svg>
)

export const IconeCamadas = (p: P) => (
  <svg {...base(p)}>
    <path d="m12 3.5 8.5 4.5-8.5 4.5L3.5 8z" />
    <path d="m3.5 12 8.5 4.5 8.5-4.5M3.5 16l8.5 4.5 8.5-4.5" />
  </svg>
)

export const IconeCadeirante = (p: P) => (
  <svg {...base(p)}>
    <circle cx="10" cy="4" r="1.6" />
    <path d="M10 7v6h5.5l2 5.5H19" />
    <path d="M10 10h4.5" />
    <path d="M7.4 10.3A5.2 5.2 0 1 0 14.6 17" />
  </svg>
)

export const IconeCartao = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="5.5" width="18" height="13" rx="2" />
    <path d="M3 9.5h18M6.5 14.5h4" />
  </svg>
)

export const IconeAproximacao = (p: P) => (
  <svg {...base(p)}>
    <path d="M8 8.5a5 5 0 0 1 0 7M11.5 6a8.5 8.5 0 0 1 0 12M15 3.5a12 12 0 0 1 0 17" />
  </svg>
)

export const IconePin = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
)

export const IconeSeta = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const IconeSetaDiagonal = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
)

export const IconeMais = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const IconeMenu = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 8h16M4 16h16" />
  </svg>
)

export const IconeFechar = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const IconeCheck = (p: P) => (
  <svg {...base(p)}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)

export const IconeInstagram = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
  </svg>
)

export const IconeWhatsApp = ({ tamanho = 24, ...p }: P) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable={false} {...p}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
  </svg>
)

export const iconeAtendimento = {
  implante: IconeImplante,
  ortodontia: IconeOrtodontia,
  canal: IconeCanal,
  cirurgia: IconeCirurgia,
  protese: IconeProtese,
  clinico: IconeClinico,
  infantil: IconeInfantil,
}
