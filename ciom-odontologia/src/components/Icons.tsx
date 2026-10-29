import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }

function Base({ size = 20, children, ...rest }: P) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
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

export const IconChat = (p: P) => (
  <Base {...p}>
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    <path d="M9.2 8.6c0 3.4 2.8 6.2 6.2 6.2l1.2-1.4-2-1.1-.9.8a4 4 0 0 1-2.8-2.8l.8-.9-1.1-2Z" />
  </Base>
)
export const IconInstagram = (p: P) => (
  <Base {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.4" cy="6.6" r=".6" fill="currentColor" />
  </Base>
)
export const IconPin = (p: P) => (
  <Base {...p}>
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </Base>
)
export const IconClock = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Base>
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
export const IconCheck = (p: P) => (
  <Base {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Base>
)
export const IconPlus = (p: P) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
)
export const IconMenu = (p: P) => (
  <Base {...p}>
    <path d="M4 8h16M4 16h16" />
  </Base>
)
export const IconClose = (p: P) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
)
export const IconWheelchair = (p: P) => (
  <Base {...p}>
    <circle cx="11" cy="4.5" r="1.6" />
    <path d="M11 7.5v6h5l2.5 5.5" />
    <path d="M11 10.5h4.5" />
    <path d="M8.2 11.3a5.2 5.2 0 1 0 7.3 6.2" />
  </Base>
)
export const IconEar = (p: P) => (
  <Base {...p}>
    <path d="M6.5 9a5.5 5.5 0 0 1 11 0c0 3.2-3 4-3 6.5a3.5 3.5 0 0 1-6.6 1.6" />
    <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.3-1.2 1.7-1.2 3" />
  </Base>
)
export const IconParking = (p: P) => (
  <Base {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
    <path d="M9.5 16.5v-9h3.2a2.6 2.6 0 0 1 0 5.2H9.5" />
  </Base>
)
export const IconCard = (p: P) => (
  <Base {...p}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" />
    <path d="M2.5 10h19M6 15h4" />
  </Base>
)
export const IconCalendar = (p: P) => (
  <Base {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="3" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </Base>
)
export const IconHeart = (p: P) => (
  <Base {...p}>
    <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z" />
  </Base>
)
export const IconSeat = (p: P) => (
  <Base {...p}>
    <path d="M7 4v9h9l1.5 7" />
    <path d="M7 13 5.5 20M7 9h7" />
  </Base>
)
export const IconRestroom = (p: P) => (
  <Base {...p}>
    <circle cx="7" cy="5" r="1.6" />
    <circle cx="17" cy="5" r="1.6" />
    <path d="M5 21v-6H4l1-6h4l1 6H9v6M15 21v-6.5M19 21v-6.5M15 9h4v5.5h-4zM12 3v18" />
  </Base>
)
export const IconPlan = (p: P) => (
  <Base {...p}>
    <path d="M4 20V4M4 20h16" />
    <path d="M7 16c3-1 4-8 7-9s4 2 6 1" />
    <circle cx="14" cy="7" r="1.3" />
  </Base>
)
export const IconLock = (p: P) => (
  <Base {...p}>
    <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
  </Base>
)
