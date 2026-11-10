import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }

const base = ({ size = 20, ...p }: P) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
  ...p,
})

export const IcTelefone = (p: P) => (
  <svg {...base(p)}>
    <path d="M5.5 3.5h3l1.5 4-2 1.3a11 11 0 0 0 5.2 5.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 3.5 5.7a2 2 0 0 1 2-2.2Z" />
  </svg>
)
export const IcWhatsapp = (p: P) => (
  <svg {...base(p)}>
    <path d="M4.5 19.5 5.6 16A8 8 0 1 1 8.4 18.6Z" />
    <path d="M9.2 8.6c.2-.5.5-.5.8-.5h.4c.2 0 .4.1.5.4l.6 1.4c.1.2 0 .4-.1.6l-.4.5c.5 1 1.4 1.9 2.4 2.4l.5-.4c.2-.1.4-.2.6-.1l1.4.6c.3.1.4.3.4.5v.4c0 .3 0 .6-.5.8-.5.3-1.4.5-2.6 0a8 8 0 0 1-3.8-3.8c-.5-1.2-.3-2.1 0-2.6Z" />
  </svg>
)
export const IcInstagram = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
  </svg>
)
export const IcPin = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
)
export const IcRelogio = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
)
export const IcSeta = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
export const IcSetaExterna = (p: P) => (
  <svg {...base(p)}>
    <path d="M8 16 16 8M9 8h7v7" />
  </svg>
)
export const IcMais = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)
export const IcMenu = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 8h16M4 16h16" />
  </svg>
)
export const IcFechar = (p: P) => (
  <svg {...base(p)}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
)
export const IcCalendario = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="5" width="17" height="15" rx="3" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
)
export const IcConversa = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5Z" />
    <path d="M8.5 9h7M8.5 12h4.5" />
  </svg>
)
export const IcBroto = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 20v-8" />
    <path d="M12 12c0-3.5-2.5-5.5-6.5-5.5 0 3.5 2.5 5.5 6.5 5.5Z" />
    <path d="M12 14c0-3 2.2-5 5.8-5 0 3-2.2 5-5.8 5Z" />
    <path d="M6 20.5c2-.8 4-.8 6 0s4 .8 6 0" />
  </svg>
)
export const IcAlerta = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5v5.5M12 16.2v.3" />
  </svg>
)
export const IcEnviar = (p: P) => (
  <svg {...base(p)}>
    <path d="M20 4 10.5 13.5M20 4l-6 16-3.5-6.5L4 10Z" />
  </svg>
)
export const IcCheck = (p: P) => (
  <svg {...base(p)}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)
export const IcFolha = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 19C5 10 10 5 19 5c0 9-5 14-14 14Z" />
    <path d="M5 19 13 11" />
  </svg>
)

/** A tulipa do "m" da logo, como ornamento de traço. */
export const Tulipa = ({ className = '', stroke = 'currentColor', sw = 1.5 }: { className?: string; stroke?: string; sw?: number }) => (
  <svg viewBox="560 660 220 260" className={className} fill="none" stroke={stroke} strokeWidth={sw * 8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M650 906C603 892 575 860 575 800V722C575 694 596 678 622 678S670 694 670 722V826" />
    <path d="M690 906C737 892 765 860 765 800V722C765 694 744 678 718 678S670 694 670 722" />
  </svg>
)

/* ---------- Ilustrações originais de traço (nunca corpo humano) ---------- */

type Ilus = { className?: string }

/** Mastologia: botão de tulipa com caule e folha. */
export const IlusBotao = ({ className }: Ilus) => (
  <svg viewBox="0 0 160 160" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M80 148V86" stroke="var(--color-salvia-tinta)" strokeWidth="1.6" />
    <path d="M80 120c-6-14-20-20-34-18 4 14 18 22 34 18Z" stroke="var(--color-salvia-tinta)" strokeWidth="1.6" />
    <path d="M80 86c-17-3-27-17-25-38 9 2 17 8 22 15" stroke="var(--color-lilas-tinta)" strokeWidth="1.6" />
    <path d="M80 86c17-3 27-17 25-38-9 2-17 8-22 15" stroke="var(--color-lilas-tinta)" strokeWidth="1.6" />
    <path d="M80 86c-8-8-9-26 0-44 9 18 8 36 0 44Z" stroke="var(--color-lilas-tinta)" strokeWidth="1.6" />
    <path d="M30 148c17-6 33-6 50 0s33 6 50 0" stroke="var(--color-salvia)" strokeWidth="1.6" />
  </svg>
)

/** Ginecologia: ramo com folhas ao longo de uma curva (as fases). */
export const IlusRamo = ({ className }: Ilus) => (
  <svg viewBox="0 0 160 160" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M28 138C52 120 66 92 78 62s28-40 48-44" stroke="var(--color-salvia-tinta)" strokeWidth="1.6" />
    <path d="M46 124c-12-2-20-10-22-22 12 0 20 8 22 22Z" stroke="var(--color-salvia-tinta)" strokeWidth="1.6" />
    <path d="M62 104c4-12 14-18 26-18-2 12-12 18-26 18Z" stroke="var(--color-salvia-tinta)" strokeWidth="1.6" />
    <path d="M72 78c-11-5-15-15-13-27 11 4 15 14 13 27Z" stroke="var(--color-salvia-tinta)" strokeWidth="1.6" />
    <path d="M90 50c5-11 14-15 25-13-4 11-13 15-25 13Z" stroke="var(--color-salvia-tinta)" strokeWidth="1.6" />
    <circle cx="128" cy="17" r="5" stroke="var(--color-lilas-tinta)" strokeWidth="1.6" />
    <circle cx="128" cy="17" r="1.6" fill="var(--color-lilas)" stroke="none" />
  </svg>
)

/** Obstetrícia: broto nascendo de uma linha ondulada. */
export const IlusBroto = ({ className }: Ilus) => (
  <svg viewBox="0 0 160 160" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M80 132V78" stroke="var(--color-salvia-tinta)" strokeWidth="1.6" />
    <path d="M80 92c-2-20-16-32-38-32 0 20 14 32 38 32Z" stroke="var(--color-salvia-tinta)" strokeWidth="1.6" />
    <path d="M80 80c2-18 15-28 34-28 0 18-13 28-34 28Z" stroke="var(--color-salvia-tinta)" strokeWidth="1.6" />
    <circle cx="80" cy="44" r="10" stroke="var(--color-lilas-tinta)" strokeWidth="1.6" />
    <circle cx="80" cy="44" r="18" stroke="var(--color-lilas)" strokeWidth="1.2" strokeDasharray="2 5" />
    <path d="M22 134c19-8 39-8 58 0s39 8 58 0" stroke="var(--color-salvia)" strokeWidth="1.6" />
  </svg>
)
