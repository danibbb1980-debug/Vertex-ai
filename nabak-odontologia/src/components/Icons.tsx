import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }

const base = (size = 22): SVGProps<SVGSVGElement> => ({
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

export const IconArrow = ({ size, ...p }: P) => (
  <svg {...base(size ?? 18)} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
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
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)
export const IconPin = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
)
export const IconClock = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
)
export const IconPlan = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M7 3.5h7l4 4v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1Z" />
    <path d="M14 3.5v4h4" />
    <path d="M9 12.5h6M9 16h4" />
  </svg>
)
export const IconAccess = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="11" cy="4.5" r="1.6" />
    <path d="M11 7.5v6h5l2.5 5" />
    <path d="M8.2 10.2a5.5 5.5 0 1 0 7.1 7.4" />
  </svg>
)
export const IconCard = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="6" width="18" height="12.5" rx="2.5" />
    <path d="M3 10.5h18M7 15h3" />
  </svg>
)
export const IconContactless = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M8 8.5a5 5 0 0 1 0 7M11.5 6a8.5 8.5 0 0 1 0 12M15 3.8a11.6 11.6 0 0 1 0 16.4" />
  </svg>
)
export const IconCalendar = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
)
export const IconDoor = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M5 21V4.5A1.5 1.5 0 0 1 6.5 3h11A1.5 1.5 0 0 1 19 4.5V21M3 21h18" />
    <circle cx="15.5" cy="12.5" r=".6" fill="currentColor" />
  </svg>
)
export const IconCheck = ({ size, ...p }: P) => (
  <svg {...base(size ?? 18)} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)
export const IconWhatsApp = ({ size = 20, ...p }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable={false} {...p}>
    <path d="M12.04 2.5a9.43 9.43 0 0 0-8.1 14.25L2.5 21.5l4.9-1.4a9.43 9.43 0 1 0 4.64-17.6Zm0 17.2a7.8 7.8 0 0 1-3.98-1.09l-.29-.17-2.9.83.84-2.83-.19-.3a7.8 7.8 0 1 1 6.52 3.56Zm4.28-5.83c-.23-.12-1.38-.68-1.6-.76-.21-.08-.37-.12-.53.12-.15.23-.6.76-.74.92-.14.15-.27.17-.5.06a6.4 6.4 0 0 1-1.88-1.16 7.06 7.06 0 0 1-1.3-1.62c-.14-.23 0-.36.1-.47.1-.1.23-.27.35-.4.11-.14.15-.24.23-.4.08-.15.04-.29-.02-.4-.06-.12-.53-1.27-.72-1.74-.19-.46-.38-.4-.53-.4h-.45a.87.87 0 0 0-.63.29 2.65 2.65 0 0 0-.83 1.97 4.6 4.6 0 0 0 .97 2.45 10.5 10.5 0 0 0 4.03 3.56c.56.24 1 .39 1.35.5.56.18 1.08.15 1.48.09.45-.07 1.38-.56 1.58-1.11.2-.55.2-1.02.13-1.11-.06-.1-.21-.16-.44-.27Z" />
  </svg>
)
export const IconInstagram = ({ size = 20, ...p }: P) => (
  <svg {...base(size)} strokeWidth={1.5} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r=".7" fill="currentColor" stroke="none" />
  </svg>
)

/* ---------- Ilustrações de traço (originais) ---------- */

const ill = {
  viewBox: '0 0 120 120',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.3,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false as const,
}

const TOOTH =
  'M60 22c-7 0-10 3-16 3s-10-3-16 1-7 16-4 26 5 19 7 30 3 14 7 14 5-7 6-14 3-15 9-15 8 8 9 15 3 14 6 14 5-3 7-14 4-20 7-30 2-22-4-26-10-1-16-1-9-3-12-3Z'

export const IllImplante = (p: SVGProps<SVGSVGElement>) => (
  <svg {...ill} {...p}>
    {/* coroa */}
    <path d="M40 30c0-7 6-11 11-11 4 0 6 2 9 2s5-2 9-2c5 0 11 4 11 11 0 6-3 10-6 13H46c-3-3-6-7-6-13Z" />
    <path d="M47 50h26" />
    {/* pilar */}
    <path d="M54 50v6h12v-6" />
    {/* parafuso */}
    <path d="M52 56h16l-2 44c0 3-2 5-6 5s-6-2-6-5l-2-44Z" />
    <path d="M52.6 64l14.8 4M52.9 72l14.3 4M53.3 80l13.6 4M53.6 88l12.9 4M54 96l11 3" opacity=".75" />
    {/* linha de gengiva */}
    <path d="M22 58c10-4 20-4 30-2M68 56c10-2 20-2 30 2" opacity=".55" />
  </svg>
)

export const IllEstetica = (p: SVGProps<SVGSVGElement>) => (
  <svg {...ill} {...p}>
    {/* arco de proporção */}
    <path d="M16 46c12 30 76 30 88 0" opacity=".55" />
    {/* incisivos */}
    <path d="M47 40c0-6 3-9 6.5-9s6.5 3 6.5 9v26c0 6-3 9-6.5 9S47 72 47 66Z" />
    <path d="M60 40c0-6 3-9 6.5-9s6.5 3 6.5 9v26c0 6-3 9-6.5 9S60 72 60 66Z" />
    <path d="M36 44c0-5 2-8 5-8s5 2.5 6 6M73 42c1-3.5 3-6 6-6s5 3 5 8v18c0 5-2 8-5 8" />
    <path d="M36 44v18c0 5 2 8 5 8" />
    {/* marcações de medida */}
    <path d="M47 88v6M60 88v6M73 88v6M47 91h26" opacity=".7" />
    <circle cx="60" cy="20" r="1.6" fill="currentColor" stroke="none" />
    <path d="M60 24v4" opacity=".6" />
  </svg>
)

export const IllClinica = (p: SVGProps<SVGSVGElement>) => (
  <svg {...ill} {...p}>
    <path d={TOOTH} transform="translate(-6 0) scale(1 .95)" />
    {/* espelho clínico */}
    <circle cx="92" cy="34" r="9" />
    <path d="M86 41 70 66" />
    <path d="M89 31a4 4 0 0 1 5-1" opacity=".6" />
    {/* brilho de limpeza (traço, sem estrela) */}
    <path d="M36 44c2-5 6-8 11-9" opacity=".55" />
  </svg>
)

export const IllArco = (p: SVGProps<SVGSVGElement>) => (
  <svg {...ill} viewBox="0 0 200 120" {...p}>
    <path d="M20 30c10 70 150 70 160 0" />
    <path d="M38 34c10 52 114 52 124 0" opacity=".5" />
    {[30, 44, 60, 78, 100, 122, 140, 156, 170].map((x, i) => {
      const t = (x - 20) / 160
      const y = 30 + Math.sin(Math.PI * t) * 52
      return <circle key={i} cx={x} cy={y} r="2.2" fill="currentColor" stroke="none" opacity={0.7} />
    })}
  </svg>
)
