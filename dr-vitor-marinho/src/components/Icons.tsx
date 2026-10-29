import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>

const Base = ({ children, ...p }: P) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    width="1em"
    height="1em"
    {...p}
  >
    {children}
  </svg>
)

export const IconWhatsApp = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" width="1em" height="1em" {...p}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.24-.64.8-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.06 0 1.22.89 2.39 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
  </svg>
)

export const IconArrow = (p: P) => (
  <Base {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Base>
)
export const IconArrowUpRight = (p: P) => (
  <Base {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Base>
)
export const IconPin = (p: P) => (
  <Base {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21Z" />
    <circle cx="12" cy="10" r="2.3" />
  </Base>
)
export const IconClock = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Base>
)
export const IconCalendar = (p: P) => (
  <Base {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    <rect x="7.5" y="12.5" width="3" height="3" />
  </Base>
)
export const IconAccess = (p: P) => (
  <Base {...p}>
    <circle cx="11" cy="4.5" r="1.6" />
    <path d="M11 7.5v6h5l2.5 5" />
    <path d="M8 10.5a5.5 5.5 0 1 0 7.2 7.6" />
  </Base>
)
export const IconParking = (p: P) => (
  <Base {...p}>
    <rect x="4" y="4" width="16" height="16" rx="1.5" />
    <path d="M9.5 16.5v-9h3.25a2.75 2.75 0 0 1 0 5.5H9.5" />
  </Base>
)
export const IconCard = (p: P) => (
  <Base {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
    <path d="M3 9.5h18M7 15h4" />
  </Base>
)
export const IconContactless = (p: P) => (
  <Base {...p}>
    <path d="M8 8.5a5 5 0 0 1 0 7M11.5 6a8.5 8.5 0 0 1 0 12M15 3.5a12 12 0 0 1 0 17" />
  </Base>
)
export const IconEmbrace = (p: P) => (
  <Base {...p}>
    <circle cx="8.5" cy="7" r="2.5" />
    <circle cx="15.5" cy="7" r="2.5" />
    <path d="M3.5 19c0-3 2.2-5.5 5-5.5 1.4 0 2.6.6 3.5 1.5.9-.9 2.1-1.5 3.5-1.5 2.8 0 5 2.5 5 5.5" />
  </Base>
)
export const IconMenu = (p: P) => (
  <Base {...p}>
    <path d="M4 8h16M4 16h16" />
  </Base>
)
export const IconClose = (p: P) => (
  <Base {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Base>
)
export const IconPlus = (p: P) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
)
export const IconCheck = (p: P) => (
  <Base {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Base>
)
export const IconAlert = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 8v4.5M12 16h.01" />
  </Base>
)

/* Ilustrações de traço para os atendimentos (originais, geométricas). */
export const IlluRestauracao = (p: P) => (
  <Base viewBox="0 0 48 48" strokeWidth={1.2} {...p}>
    <path d="M14 9c-4 0-6 3.5-5.6 8.5.4 5 2.4 8 3.4 13 .9 4.7 2.1 8.5 4.2 8.5 2.4 0 2.8-4.1 3.7-8 .5-2.3 1.2-3.5 4.3-3.5s3.8 1.2 4.3 3.5c.9 3.9 1.3 8 3.7 8 2.1 0 3.3-3.8 4.2-8.5 1-5 3-8 3.4-13 .4-5-1.6-8.5-5.6-8.5-3.2 0-5.2 1.8-10 1.8S17.2 9 14 9Z" />
    <rect x="19" y="12" width="7" height="7" fill="currentColor" fillOpacity=".18" />
    <rect x="26" y="12" width="4" height="4" />
  </Base>
)
export const IlluEstetica = (p: P) => (
  <Base viewBox="0 0 48 48" strokeWidth={1.2} {...p}>
    <path d="M8 20c5 9 11 13 16 13s11-4 16-13" />
    <path d="M12 21.5c3.5 2 7.5 3 12 3s8.5-1 12-3" />
    <path d="M17 23.5v3.5M24 24.5v4M31 23.5v3.5" />
    <rect x="21" y="8" width="6" height="6" />
    <path d="M24 4v2M24 16v2M18 11h2M28 11h2" />
  </Base>
)
export const IlluProteseFixa = (p: P) => (
  <Base viewBox="0 0 48 48" strokeWidth={1.2} {...p}>
    <rect x="7" y="12" width="10" height="13" rx="1" />
    <rect x="19" y="12" width="10" height="13" rx="1" fill="currentColor" fillOpacity=".18" />
    <rect x="31" y="12" width="10" height="13" rx="1" />
    <path d="M9 25v9M15 25v9M33 25v9M39 25v9" />
    <path d="M7 38h34" />
  </Base>
)
export const IlluImplante = (p: P) => (
  <Base viewBox="0 0 48 48" strokeWidth={1.2} {...p}>
    <path d="M16 8h16c1.5 0 2.5 1.5 2.2 3.5L33 19H15l-1.2-7.5C13.5 9.5 14.5 8 16 8Z" fill="currentColor" fillOpacity=".18" />
    <path d="M20 19v3h8v-3" />
    <path d="M19.5 22h9l-1 4h-7zM20.5 26h7l-.8 3.5h-5.4zM21.3 29.5h5.4l-.7 3.5h-4zM22 33h4l-2 6z" />
    <path d="M8 26h8M32 26h8" strokeDasharray="1.5 2.5" />
  </Base>
)
export const IlluRemovivel = (p: P) => (
  <Base viewBox="0 0 48 48" strokeWidth={1.2} {...p}>
    <path d="M7 30c0-10 7.6-18 17-18s17 8 17 18" />
    <path d="M12 30c0-7.3 5.4-13 12-13s12 5.7 12 13" />
    <rect x="13" y="20" width="4" height="4" fill="currentColor" fillOpacity=".18" />
    <rect x="22" y="15.5" width="4" height="4" fill="currentColor" fillOpacity=".18" />
    <rect x="31" y="20" width="4" height="4" fill="currentColor" fillOpacity=".18" />
    <path d="M7 30h5M36 30h5" />
    <path d="M18 38h12" strokeDasharray="1.5 2.5" />
  </Base>
)
