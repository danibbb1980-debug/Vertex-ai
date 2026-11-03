import type { SVGProps } from 'react'

/** Ícones de traço originais, mesmo peso dos ícones de interface (1.6px). */
type P = SVGProps<SVGSVGElement> & { size?: number }

const base = (size = 24): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
})

export const IconWhatsApp = ({ size = 20, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M4.2 19.8l1.1-3.9A8 8 0 1 1 8.4 19z" />
    <path d="M9.1 8.6c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .4-.1.6l-.5.6c-.1.1-.1.3 0 .5.5.9 1.3 1.7 2.3 2.2.2.1.4.1.5-.1l.6-.7c.1-.2.4-.2.6-.1l1.4.7c.2.1.3.3.3.5 0 .7-.6 1.5-1.4 1.6-1 .1-2.5-.3-4-1.6-1.6-1.4-2.4-3-2.4-4 0-.6.2-1.1.6-1.5z" fill="currentColor" stroke="none" />
  </svg>
)

export const IconInstagram = ({ size = 20, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
  </svg>
)

/** Contorno de dente usado nos ícones de atendimento. */
const dente = 'M7 4.5c-1.9 0-3 1.6-3 3.7 0 2.1.8 3.6 1.4 5.6.5 1.8.7 5.7 2.2 5.7 1.3 0 1.4-3.3 2.3-4.6.5-.7 1.7-.7 2.2 0 .9 1.3 1 4.6 2.3 4.6 1.5 0 1.7-3.9 2.2-5.7.6-2 1.4-3.5 1.4-5.6 0-2.1-1.1-3.7-3-3.7-1.6 0-2.1.9-3.5.9S8.6 4.5 7 4.5z'

export const IconImplante = ({ size = 28, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M7.5 3.5h9c.8 0 1.5.7 1.5 1.5v1.2c0 1.6-1.3 2.8-2.8 2.8H8.8C7.3 9 6 7.8 6 6.2V5c0-.8.7-1.5 1.5-1.5z" />
    <path d="M9.5 9h5l-.6 10.2c0 .7-.6 1.3-1.3 1.3h-1.2c-.7 0-1.3-.6-1.3-1.3z" />
    <path d="M9.4 12h5.2M9.6 14.8h4.8M9.8 17.6h4.4" />
  </svg>
)

export const IconOrtodontia = ({ size = 28, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="7" width="5" height="10" rx="2.2" />
    <rect x="9.5" y="6" width="5" height="12" rx="2.2" />
    <rect x="16" y="7" width="5" height="10" rx="2.2" />
    <path d="M2 12h20" />
    <rect x="4.4" y="10.6" width="2.2" height="2.8" rx=".5" fill="currentColor" stroke="none" />
    <rect x="10.9" y="10.6" width="2.2" height="2.8" rx=".5" fill="currentColor" stroke="none" />
    <rect x="17.4" y="10.6" width="2.2" height="2.8" rx=".5" fill="currentColor" stroke="none" />
  </svg>
)

export const IconProtese = ({ size = 28, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M3 9.5c0-1.7 1.1-3 2.7-3 1.1 0 1.6.6 2.3.6.6 0 1.1-.6 2.2-.6 1.6 0 2.7 1.3 2.7 3" />
    <path d="M11 9.5c0-1.7 1.1-3 2.7-3 1.1 0 1.6.6 2.3.6.6 0 1.1-.6 2.2-.6 1.6 0 2.8 1.3 2.8 3" />
    <path d="M3 9.5c0 1.5.5 2.7 1 4 .4 1.2.6 3.5 1.6 3.5s1.1-2 1.8-2.8c.4-.5 1.1-.5 1.5 0 .7.8.8 2.8 1.8 2.8s1.2-2.3 1.5-3.5" />
    <path d="M12.2 13.5c.4 1.2.6 3.5 1.6 3.5s1.1-2 1.8-2.8c.4-.5 1.1-.5 1.5 0 .7.8.8 2.8 1.8 2.8s1.2-2.3 1.6-3.5c.5-1.3 1-2.5 1-4" />
    <path d="M2.5 20h19" />
  </svg>
)

export const IconHarmonizacao = ({ size = 28, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M14 3c-3.6 0-6.4 2.6-6.6 6.2l-.1 1.3-1.6 2.6c-.2.4 0 .8.4.9l1.2.3v2.3c0 1.1.9 2 2 2h1.4v2.4" />
    <path d="M14 3c3.6 0 6.5 2.9 6.5 6.6 0 2.3-1 4.2-2.6 5.4V21" />
    <path d="M10.8 13.6c.6.4 1.4.5 2.1.2" />
    <circle cx="11.6" cy="8.8" r=".7" fill="currentColor" stroke="none" />
  </svg>
)

export const IconPeriodontia = ({ size = 28, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d={dente} />
    <path d="M3 12.5c2.2-1.6 4-1.6 6 0s4 1.6 6 0 4-1.6 6 0" strokeDasharray="0" />
  </svg>
)

export const IconEndodontia = ({ size = 28, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d={dente} />
    <path d="M10 8.5c-.4 2.4-1 5.6-1.9 9.3M14 8.5c.4 2.4 1 5.6 1.9 9.3" strokeDasharray="1.4 1.6" />
  </svg>
)

export const IconeAtendimento: Record<string, (p: P) => React.JSX.Element> = {
  implantes: IconImplante,
  ortodontia: IconOrtodontia,
  proteses: IconProtese,
  harmonizacao: IconHarmonizacao,
  periodontia: IconPeriodontia,
  endodontia: IconEndodontia,
}

/** Dente simples usado no "encaixe" do fim da curva e como separador. */
export const DenteSimples = ({ size = 24, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d={dente} />
  </svg>
)
