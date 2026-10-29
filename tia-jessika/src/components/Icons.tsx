import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }

const base = (size = 22): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
})

export const IconWhats = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p} fill="currentColor" stroke="none">
    <path d="M12 2.2A9.7 9.7 0 0 0 3.7 16.9L2.3 21.8l5-1.3A9.7 9.7 0 1 0 12 2.2zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 1.9 2.9 4.6 4 1.7.7 2.4.8 3.2.7.5-.1 1.4-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.3z" />
  </svg>
)
export const IconFone = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M5 3.5h3l1.6 4.2-2 1.3a11 11 0 0 0 5.4 5.4l1.3-2 4.2 1.6v3A2 2 0 0 1 16.4 19 14.5 14.5 0 0 1 3 5.6a2 2 0 0 1 2-2.1z" />
  </svg>
)
export const IconInsta = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="3.9" />
    <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
  </svg>
)
export const IconPin = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.4" />
  </svg>
)
export const IconRelogio = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
)
export const IconSeta = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
export const IconMais = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)
export const IconMenu = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
)
export const IconFechar = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)
export const IconCadeira = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="11" cy="4.5" r="1.6" />
    <path d="M11 7.5v6h5l2 5" />
    <path d="M8 10.5a5.5 5.5 0 1 0 7 7.4" />
  </svg>
)
export const IconCalendario = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="3" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
)
export const IconCartao = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="3" />
    <path d="M3 10h18M7 15h3" />
  </svg>
)
export const IconAproximacao = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M8.5 8.5a5 5 0 0 1 0 7M12 6a8.5 8.5 0 0 1 0 12M15.5 3.5a12 12 0 0 1 0 17" />
  </svg>
)
export const IconCoracao = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 19.5s-7.5-4.6-7.5-10.1A4.2 4.2 0 0 1 12 7.2a4.2 4.2 0 0 1 7.5 2.2c0 5.5-7.5 10.1-7.5 10.1z" />
  </svg>
)
export const IconConversa = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M4 5.5h16v10H9l-5 4z" />
    <path d="M8.5 10.5h7" />
  </svg>
)
export const IconBroto = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 20v-8" />
    <path d="M12 12c0-4 3-6.5 7-6.5 0 4-3 6.5-7 6.5zM12 14.5c0-3-2.4-5-5.5-5 0 3 2.4 5 5.5 5z" />
  </svg>
)
export const IconLupa = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="11" cy="11" r="6" />
    <path d="M20 20l-4.6-4.6" />
  </svg>
)
export const IconEstrelaTraco = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 3.5l2.4 5 5.4.6-4 3.7 1.1 5.4L12 15.5l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6z" />
  </svg>
)
export const IconCheck = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M5 12.5l4.2 4.2L19 7" />
  </svg>
)
export const IconAlerta = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5v5.5M12 16.3v.2" />
  </svg>
)
