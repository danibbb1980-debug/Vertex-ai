import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }

function Base({ size = 24, children, ...p }: P) {
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
      {...p}
    >
      {children}
    </svg>
  )
}

const TOOTH =
  'M7.6 3.2C5.2 3.2 3.7 5.1 3.7 7.5c0 2 .8 3.4 1.3 5 .6 2 .7 4.3 1.2 6.3.3 1.3.9 2.1 1.7 2.1 1.2 0 1.5-1.4 1.8-3 .3-1.5.6-2.9 2.3-2.9s2 1.4 2.3 2.9c.3 1.6.6 3 1.8 3 .8 0 1.4-.8 1.7-2.1.5-2 .6-4.3 1.2-6.3.5-1.6 1.3-3 1.3-5 0-2.4-1.5-4.3-3.9-4.3-1.8 0-2.7 1-4.4 1s-2.6-1-4.4-1Z'

export const Tooth = (p: P) => (
  <Base {...p}>
    <path d={TOOTH} />
  </Base>
)

/** Dor forte: dente + ondas */
export const ToothPain = (p: P) => (
  <Base {...p}>
    <path d={TOOTH} transform="translate(3 3) scale(.75)" />
    <path d="M2.5 6.5c.8-.6.8-1.6 0-2.2M21.5 6.5c-.8-.6-.8-1.6 0-2.2M2 10.5c1.1-.8 1.1-2.4 0-3.2M22 10.5c-1.1-.8-1.1-2.4 0-3.2" />
  </Base>
)

/** Dente quebrado: dente + trinca */
export const ToothCrack = (p: P) => (
  <Base {...p}>
    <path d={TOOTH} />
    <path d="M12.6 4.3 10.9 7.6l2.4 1.6-1.9 3.4" />
  </Base>
)

/** Trauma ou pancada: dente + arco de impacto */
export const ToothImpact = (p: P) => (
  <Base {...p}>
    <path d={TOOTH} transform="translate(5 4) scale(.78)" />
    <path d="M4.2 3.5 6 5.3M2.5 8.4h2.4M4.2 13.2 6 11.4" />
  </Base>
)

/** Inchaço na gengiva ou na face */
export const FaceSwelling = (p: P) => (
  <Base {...p}>
    <path d="M12 3c-4.2 0-7 3.2-7 7.6 0 3.7 2 6.6 4.4 8.6 1 .8 1.8 1.8 2.6 1.8s1.6-1 2.6-1.8c.7-.6 1.4-1.3 2-2.1" />
    <path d="M16.6 17.1c2.6.2 4.4-1.6 4.4-3.9 0-2.2-1.6-3.6-3.4-3.6-.5 0-.9.1-1.3.2" />
    <path d="M9.3 10.2h.01M14.3 10.2h.01M10 14.6c1.2.8 2.8.8 4 0" />
  </Base>
)

/** Restauração ou prótese que soltou */
export const ToothLoose = (p: P) => (
  <Base {...p}>
    <path d={TOOTH} transform="translate(0 4) scale(.8)" />
    <rect x="15.5" y="2.5" width="5.5" height="4.5" rx="1.2" transform="rotate(14 18.2 4.7)" />
    <path d="M14.7 9.4l1.4-1" strokeDasharray="1 2" />
  </Base>
)

/** Sangramento (traço fino, sem vermelho) */
export const Drop = (p: P) => (
  <Base {...p}>
    <path d="M12 3.2c2.9 3.6 6 7 6 10.6a6 6 0 0 1-12 0C6 10.2 9.1 6.8 12 3.2Z" />
    <path d="M9.2 14.3a2.9 2.9 0 0 0 2.6 2.7" />
  </Base>
)

export const Child = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="7" r="3.2" />
    <path d="M6.5 20.5c0-3.4 2.4-6.2 5.5-6.2s5.5 2.8 5.5 6.2" />
    <path d="M10.6 6.6h.01M13.4 6.6h.01" />
  </Base>
)

export const Spark = (p: P) => (
  <Base {...p}>
    <path d={TOOTH} transform="translate(2 4) scale(.7)" />
    <path d="M18.5 2.8v4.4M16.3 5h4.4" />
  </Base>
)

export const Moon = (p: P) => (
  <Base {...p}>
    <path d="M20 14.3A8 8 0 0 1 9.7 4a8 8 0 1 0 10.3 10.3Z" />
  </Base>
)

export const Shield = (p: P) => (
  <Base {...p}>
    <path d="M12 3 5 5.8v5.4c0 4.4 3 8.2 7 9.8 4-1.6 7-5.4 7-9.8V5.8L12 3Z" />
  </Base>
)

export const Phone = (p: P) => (
  <Base {...p}>
    <path d="M5.2 3.5h3l1.5 4-2 1.3a11 11 0 0 0 5.5 5.5l1.3-2 4 1.5v3a2 2 0 0 1-2 2A15.5 15.5 0 0 1 3.2 5.5a2 2 0 0 1 2-2Z" />
  </Base>
)

export const Pin = (p: P) => (
  <Base {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </Base>
)

export const Clock = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Base>
)

export const Arrow = (p: P) => (
  <Base {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Base>
)

export const ArrowUpRight = (p: P) => (
  <Base {...p}>
    <path d="M7 17 17 7M8.5 7H17v8.5" />
  </Base>
)

export const Plus = (p: P) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
)

export const Menu = (p: P) => (
  <Base {...p}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </Base>
)

export const Close = (p: P) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
)

export const Alert = (p: P) => (
  <Base {...p}>
    <path d="M12 3.5 2.8 19.5h18.4L12 3.5Z" />
    <path d="M12 10v4M12 17h.01" />
  </Base>
)

export const Check = (p: P) => (
  <Base {...p}>
    <path d="m5 12.5 4.2 4.2L19 7" />
  </Base>
)

export const Calm = (p: P) => (
  <Base {...p}>
    <path d="M3 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
    <path d="M3 17c2-3 4-3 6 0s4 3 6 0 4-3 6 0" opacity=".5" />
  </Base>
)

export const Pill = (p: P) => (
  <Base {...p}>
    <rect x="3" y="8.5" width="18" height="7" rx="3.5" transform="rotate(-35 12 12)" />
    <path d="M9.4 8.3l5.2 7.4" />
    <path d="M4 4l16 16" />
  </Base>
)

export const Jar = (p: P) => (
  <Base {...p}>
    <path d="M7 7h10v11a2.5 2.5 0 0 1-2.5 2.5h-5A2.5 2.5 0 0 1 7 18V7Z" />
    <path d="M6 4h12v3H6zM10.5 12.5c0-1 .7-1.6 1.5-1.6s1.5.6 1.5 1.6c0 .8-.5 1.4-.8 2.3h-1.4c-.3-.9-.8-1.5-.8-2.3Z" />
  </Base>
)

export const Car = (p: P) => (
  <Base {...p}>
    <path d="M5 16.5V12l1.8-4.6A2 2 0 0 1 8.7 6h6.6a2 2 0 0 1 1.9 1.4L19 12v4.5" />
    <path d="M3.5 16.5h17v2.5h-3v-2.5M6.5 19H3.5v-2.5M5 12h14" />
    <path d="M7.5 14.2h.01M16.5 14.2h.01" />
  </Base>
)

export const Access = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="4.5" r="1.6" />
    <path d="M5 8.5c2.3.8 4.6 1.2 7 1.2s4.7-.4 7-1.2M12 9.7V14m0 0-3 6.5M12 14l3 6.5" />
  </Base>
)

export const Card = (p: P) => (
  <Base {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="M3 10h18M7 15h3" />
  </Base>
)

export const Users = (p: P) => (
  <Base {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 19.5c0-3 2.5-5.3 5.5-5.3s5.5 2.3 5.5 5.3" />
    <path d="M15.5 5.3a3 3 0 0 1 0 5.4M17.5 14.6c1.8.7 3 2.6 3 4.9" />
  </Base>
)

export const Instagram = (p: P) => (
  <Base {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="3.8" />
    <path d="M17 7h.01" strokeWidth={2.2} />
  </Base>
)

/** Ícone oficial do WhatsApp (Simple Icons, CC0). */
export const WhatsApp = ({ size = 22, ...p }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...p}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)
