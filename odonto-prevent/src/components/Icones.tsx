import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { tamanho?: number }

function Base({ tamanho = 24, children, ...rest }: P) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const IconeDente = (p: P) => (
  <Base {...p}>
    <path d="M8.2 3.5C5.6 3.5 4 5.4 4 8.1c0 2.4 1 3.7 1.6 6.2.6 2.4.9 5.2 2.3 5.2 1.6 0 1.4-3.9 2.8-5.4a1.7 1.7 0 0 1 2.6 0c1.4 1.5 1.2 5.4 2.8 5.4 1.4 0 1.7-2.8 2.3-5.2.6-2.5 1.6-3.8 1.6-6.2 0-2.7-1.6-4.6-4.2-4.6-1.7 0-2.3.9-3.8.9s-2-.9-3.8-.9Z" />
  </Base>
)

export const IconeEscudo = (p: P) => (
  <Base {...p}>
    <path d="M12 3 5 5.8v5.4c0 4.4 3 8.1 7 9.8 4-1.7 7-5.4 7-9.8V5.8L12 3Z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </Base>
)

export const IconeCalendario = (p: P) => (
  <Base {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    <circle cx="12" cy="15" r="1.6" />
  </Base>
)

export const IconeRelogio = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Base>
)

export const IconeEscova = (p: P) => (
  <Base {...p}>
    <path d="M4 20 14.5 9.5" />
    <path d="m13 8 3-3 3.5 3.5-3 3a2.1 2.1 0 0 1-3 0l-.5-.5a2.1 2.1 0 0 1 0-3Z" />
    <path d="M15.5 4.5 17 3M18 7l1.5-1.5M19.5 9.5 21 8" />
  </Base>
)

export const IconeLupa = (p: P) => (
  <Base {...p}>
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="m15 15 5 5" />
  </Base>
)

export const IconeFolha = (p: P) => (
  <Base {...p}>
    <path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14" />
    <path d="M5 19c3-4 6-7 10-9" />
  </Base>
)

export const IconePasta = (p: P) => (
  <Base {...p}>
    <rect x="4" y="3.5" width="16" height="17" rx="2.5" />
    <path d="M8.5 8h7M8.5 12h7M8.5 16h4" />
  </Base>
)

export const IconeAcessivel = (p: P) => (
  <Base {...p}>
    <circle cx="11" cy="4.5" r="1.6" />
    <path d="M11 8v5h5l2.5 5" />
    <path d="M8 10.5a5.5 5.5 0 1 0 7.6 7.2" />
  </Base>
)

export const IconeCartao = (p: P) => (
  <Base {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="M3 10h18M7 15h3" />
  </Base>
)

export const IconeAproximacao = (p: P) => (
  <Base {...p}>
    <path d="M8 8.5a5 5 0 0 1 0 7M11.5 6a8.5 8.5 0 0 1 0 12M15 4a11.5 11.5 0 0 1 0 16" />
  </Base>
)

export const IconeLocal = (p: P) => (
  <Base {...p}>
    <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </Base>
)

export const IconeTelefone = (p: P) => (
  <Base {...p}>
    <path d="M6.6 3.5h2.6l1.4 4-2 1.3a10.5 10.5 0 0 0 6.6 6.6l1.3-2 4 1.4v2.6a2 2 0 0 1-2.1 2 15.5 15.5 0 0 1-13.8-13.8 2 2 0 0 1 2-2.1Z" />
  </Base>
)

export const IconeInstagram = (p: P) => (
  <Base {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.1" cy="6.9" r="0.6" fill="currentColor" stroke="none" />
  </Base>
)

export const IconeWhatsapp = (p: P) => (
  <Base {...p}>
    <path d="M4 20.5 5.2 16.6A8.5 8.5 0 1 1 8.5 19.6L4 20.5Z" />
    <path d="M9.2 8.6c.2-.4.5-.4.8-.4h.5c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .5-.1.6l-.5.6c.6 1.1 1.5 2 2.7 2.6l.6-.6c.2-.2.4-.2.6-.1l1.4.7c.3.1.4.3.4.5v.5c0 .4-.3.8-.7 1-.6.2-1.5.3-2.8-.3a8.3 8.3 0 0 1-3.6-3.4c-.6-1.2-.6-2.1-.4-2.6Z" />
  </Base>
)

export const IconeSeta = (p: P) => (
  <Base {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Base>
)

export const IconeSetaDiagonal = (p: P) => (
  <Base {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Base>
)

export const IconeMais = (p: P) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
)

export const IconeMenu = (p: P) => (
  <Base {...p}>
    <path d="M4 8h16M4 16h16" />
  </Base>
)

export const IconeFechar = (p: P) => (
  <Base {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Base>
)

export const IconeCheck = (p: P) => (
  <Base {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Base>
)

export const IconeConversa = (p: P) => (
  <Base {...p}>
    <path d="M4 5.5h16v10H9.5L5 19.5v-4H4z" />
    <path d="M8.5 10.5h7" />
  </Base>
)

export const IconeMapa = (p: P) => (
  <Base {...p}>
    <path d="M9 4.5 3.5 6.5v13l5.5-2 6 2 5.5-2v-13l-5.5 2-6-2Z" />
    <path d="M9 4.5v13M15 6.5v13" />
  </Base>
)
