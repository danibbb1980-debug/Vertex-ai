import type { SVGProps } from 'react'
import type { Atendimento } from '../config'

type P = SVGProps<SVGSVGElement> & { size?: number }

const base = (size = 24) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
})

// contorno de dente reutilizado nos ícones
const dente = 'M7.5 3.5c-2.3 0-3.8 1.9-3.5 4.6.3 2.6 1.1 4.3 1.6 6.6.4 2.1.8 5.8 2.3 5.8 1.3 0 1.4-3.7 2.1-5.1.4-.8 1.6-.8 2 0 .7 1.4.8 5.1 2.1 5.1 1.5 0 1.9-3.7 2.3-5.8.5-2.3 1.3-4 1.6-6.6.3-2.7-1.2-4.6-3.5-4.6-1.7 0-2.6.8-4.5.8S9.2 3.5 7.5 3.5Z'

export function IconeAtendimento({ tipo, size = 28 }: { tipo: Atendimento['icone']; size?: number }) {
  const b = base(size)
  switch (tipo) {
    case 'estetica':
      return (
        <svg {...b}>
          <path d="M3 13a9 9 0 0 1 9-9v9H3Z" />
          <rect x="12" y="13" width="9" height="7" />
        </svg>
      )
    case 'clareamento':
      return (
        <svg {...b}>
          <path d={dente} />
          <path d="M19.5 2.5v3M18 4h3" />
        </svg>
      )
    case 'restauracao':
      return (
        <svg {...b}>
          <path d={dente} />
          <path d="M9 7.5h6v3H9z" />
        </svg>
      )
    case 'ortodontia':
      return (
        <svg {...b}>
          <rect x="3" y="8" width="4.5" height="8" rx="1" />
          <rect x="9.75" y="8" width="4.5" height="8" rx="1" />
          <rect x="16.5" y="8" width="4.5" height="8" rx="1" />
          <path d="M2 12h20" />
        </svg>
      )
    case 'implante':
      return (
        <svg {...b}>
          <path d="M7 3.5h10a2 2 0 0 1 0 4H7a2 2 0 0 1 0-4Z" />
          <path d="M9 9.5h6M9.5 12h5M10 14.5h4M10.5 17h3M12 19.5v1" />
        </svg>
      )
    case 'protese':
      return (
        <svg {...b}>
          <path d="M3 9c0 6 4 10 9 10s9-4 9-10" />
          <path d="M6.5 11v3M10 12v4M14 12v4M17.5 11v3" />
        </svg>
      )
    case 'canal':
      return (
        <svg {...b}>
          <path d={dente} />
          <path d="M10.5 8v6M13.5 8v6" />
        </svg>
      )
    case 'gengiva':
      return (
        <svg {...b}>
          <path d="M3 8c3 3 6 3 9 0s6-3 9 0" />
          <path d="M6 10v7M10 9.5v8M14 9.5v8M18 10v7" />
        </svg>
      )
    case 'siso':
      return (
        <svg {...b}>
          <path d={dente} />
          <path d="M16.5 15.5l4 4M20.5 15.5l-4 4" />
        </svg>
      )
    default:
      return (
        <svg {...b}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      )
  }
}

export const IconeWhatsApp = ({ size = 20, ...p }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false" {...p}>
    <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5.1 5.24-1.37A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.1.82.83-3.03-.2-.31a8.2 8.2 0 1 1 6.95 3.85Zm4.5-6.13c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.78.97-.15.16-.29.18-.54.06a6.7 6.7 0 0 1-3.34-2.92c-.25-.43.25-.4.72-1.34.08-.16.04-.3-.02-.43l-.76-1.83c-.2-.48-.4-.41-.56-.42h-.48a.92.92 0 0 0-.66.31 2.8 2.8 0 0 0-.87 2.07 4.86 4.86 0 0 0 1.02 2.58 11.1 11.1 0 0 0 4.25 3.75c1.58.68 2.2.74 2.99.62.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.08.14-1.18-.06-.1-.22-.17-.47-.29Z" />
  </svg>
)

export const IconeInstagram = ({ size = 20 }: P) => (
  <svg {...base(size)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
  </svg>
)

export const IconeTelefone = ({ size = 20 }: P) => (
  <svg {...base(size)}>
    <path d="M5 4h3.5l1.7 4.3-2.2 1.4a11 11 0 0 0 6.3 6.3l1.4-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z" />
  </svg>
)

export const IconeMapa = ({ size = 20 }: P) => (
  <svg {...base(size)}>
    <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.4" />
  </svg>
)

export const IconeRelogio = ({ size = 20 }: P) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
)

export const IconeSeta = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const IconeCheck = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="M4.5 12.5l4.5 4.5L19.5 7" />
  </svg>
)

export const IconeMais = ({ size = 18, aberto }: P & { aberto?: boolean }) => (
  <svg {...base(size)}>
    <path d="M5 12h14" />
    <path d="M12 5v14" style={{ transition: 'transform .3s var(--ease-encaixe)', transformOrigin: 'center', transform: aberto ? 'scaleY(0)' : 'scaleY(1)' }} />
  </svg>
)

export const IconeAcesso = ({ size = 22 }: P) => (
  <svg {...base(size)}>
    <circle cx="12" cy="4.5" r="1.6" />
    <path d="M9 9h6M12 9v5h4l1.5 5" />
    <path d="M9.5 12.5a4.5 4.5 0 1 0 5.8 5.8" />
  </svg>
)

export const IconeCartao = ({ size = 22 }: P) => (
  <svg {...base(size)}>
    <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
    <path d="M3 10h18M6.5 15h4" />
  </svg>
)

export const IconeCarro = ({ size = 22 }: P) => (
  <svg {...base(size)}>
    <path d="M4 16.5V12l2-5h12l2 5v4.5" />
    <path d="M3 16.5h18M4 12h16" />
    <circle cx="7.5" cy="16.5" r="1.8" />
    <circle cx="16.5" cy="16.5" r="1.8" />
  </svg>
)

export const IconeCalendario = ({ size = 22 }: P) => (
  <svg {...base(size)}>
    <rect x="3.5" y="5" width="17" height="15" rx="1" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
)

export const IconeAcolhimento = ({ size = 22 }: P) => (
  <svg {...base(size)}>
    <path d="M3 12a9 9 0 0 1 9-9v9H3Z" />
    <path d="M21 12a9 9 0 0 1-9 9v-9h9Z" />
  </svg>
)
