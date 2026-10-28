import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }

const base = (size = 20): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
})

export const IconArrow = ({ size, className = '', ...p }: P) => (
  <svg {...base(size ?? 18)} className={`arrow ${className}`} {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
)
export const IconArrowDown = ({ size, ...p }: P) => (
  <svg {...base(size ?? 18)} {...p}>
    <path d="M12 4v15M6 13l6 6 6-6" />
  </svg>
)
export const IconWhatsApp = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M4.5 19.5l1.1-3.9A8 8 0 1 1 8.6 18.5z" />
    <path d="M9.2 8.6c.2-.5.5-.6.9-.6h.4c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.7l-.5.6c-.1.2-.1.4 0 .6.6 1 1.4 1.8 2.4 2.4.2.1.4.1.6 0l.6-.5c.2-.2.5-.2.7-.1l1.6.7c.3.1.4.3.4.5v.4c0 .4-.2.8-.6.9-.9.4-2 .3-3.2-.3a9.6 9.6 0 0 1-4.1-4.1c-.6-1.2-.7-2.3-.3-3.2z" />
  </svg>
)
export const IconPhone = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M5 4.5h3l1.5 4-2 1.3a10.5 10.5 0 0 0 6.7 6.7l1.3-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 3.5 6.1 1.5 1.5 0 0 1 5 4.5z" />
  </svg>
)
export const IconMail = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="M4 7l8 6 8-6" />
  </svg>
)
export const IconInstagram = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
  </svg>
)
export const IconPin = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
)
export const IconClock = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
)
export const IconCalendar = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4M8 14h3" />
  </svg>
)
export const IconCompass = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 3v3M7 21l5-15 5 15M8.6 16h6.8" />
  </svg>
)
export const IconAccess = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="11" cy="4.5" r="1.5" />
    <path d="M11 7.5v6h5l2.5 5M11 10.5h5" />
    <path d="M8.2 11.2a5 5 0 1 0 7.3 6.3" />
  </svg>
)
export const IconCard = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="6" width="18" height="12.5" rx="2" />
    <path d="M3 10h18M7 15h4" />
  </svg>
)
export const IconContactless = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M8 8.5a5 5 0 0 1 0 7M11.5 6a8.5 8.5 0 0 1 0 12M15 3.5a12 12 0 0 1 0 17" />
  </svg>
)
export const IconPlus = ({ size, ...p }: P) => (
  <svg {...base(size ?? 18)} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)
export const IconMenu = ({ size, ...p }: P) => (
  <svg {...base(size ?? 22)} {...p}>
    <path d="M4 8h16M4 16h16" />
  </svg>
)
export const IconClose = ({ size, ...p }: P) => (
  <svg {...base(size ?? 22)} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)
export const IconListen = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M5 11a7 7 0 1 1 14 0c0 3-2 4-3 5.5s-1 3.5-3.5 3.5" />
    <path d="M9 11a3 3 0 0 1 6 0" />
  </svg>
)
export const IconPlan = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M5 4.5h14v15H5z" />
    <path d="M8.5 9h7M8.5 12.5h7M8.5 16h4" />
  </svg>
)
export const IconLoop = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M19 12a7 7 0 0 1-12.2 4.7M5 12a7 7 0 0 1 12.2-4.7" />
    <path d="M17.5 3.5v4h-4M6.5 20.5v-4h4" />
  </svg>
)
