import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size = 24, p: P) => ({
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
  ...p,
});

/** Dente em traço (mesma linguagem do dente do monograma). */
export const Tooth = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M7.2 3.6c-2.3 0-3.7 1.9-3.7 4.3 0 2 .8 3.4 1.4 5 .6 1.7.7 3.8 1.2 5.6.4 1.5 1 2.4 1.9 2.4 1.5 0 1.5-2.2 1.9-4 .3-1.4.8-2.4 1.9-2.4s1.6 1 1.9 2.4c.4 1.8.4 4 1.9 4 .9 0 1.5-.9 1.9-2.4.5-1.8.6-3.9 1.2-5.6.6-1.6 1.4-3 1.4-5 0-2.4-1.4-4.3-3.7-4.3-1.9 0-2.9 1.1-4.8 1.1S9.1 3.6 7.2 3.6Z" />
  </svg>
);
export const ToothRoot = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M7.2 3.6c-2.3 0-3.7 1.9-3.7 4.3 0 2 .8 3.4 1.4 5 .6 1.7.7 3.8 1.2 5.6.4 1.5 1 2.4 1.9 2.4 1.5 0 1.5-2.2 1.9-4 .3-1.4.8-2.4 1.9-2.4s1.6 1 1.9 2.4c.4 1.8.4 4 1.9 4 .9 0 1.5-.9 1.9-2.4.5-1.8.6-3.9 1.2-5.6.6-1.6 1.4-3 1.4-5 0-2.4-1.4-4.3-3.7-4.3-1.9 0-2.9 1.1-4.8 1.1S9.1 3.6 7.2 3.6Z" />
    <path d="M9.4 9.5c.4 2.5.2 5 0 7.6M14.6 9.5c-.4 2.5-.2 5 0 7.6" strokeDasharray="1.6 1.6" />
  </svg>
);
export const Arch = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M3.5 17c0-6.5 3.8-11 8.5-11s8.5 4.5 8.5 11" />
    <path d="M6.2 15.2c.3-4.8 2.8-7.4 5.8-7.4s5.5 2.6 5.8 7.4" />
    <path d="M3.4 13.2h17.2" />
    <circle cx="6.6" cy="13.2" r=".9" /><circle cx="12" cy="13.2" r=".9" /><circle cx="17.4" cy="13.2" r=".9" />
  </svg>
);
export const Implant = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M7.5 3.5h9c.6 0 1 .4 1 1 0 2.4-1.6 4-5.5 4s-5.5-1.6-5.5-4c0-.6.4-1 1-1Z" />
    <path d="M9.5 10.5h5M9.8 13h4.4M10.2 15.5h3.6M10.6 18h2.8M11.4 20.5h1.2" />
  </svg>
);
export const WhatsApp = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M4.2 19.8 5.3 16A8 8 0 1 1 8.2 18.8Z" />
    <path d="M9.2 8.4c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.6l-.5.6c-.1.2-.2.4 0 .6.4.7 1.4 1.8 2.5 2.3.2.1.4.1.6-.1l.6-.7c.2-.2.4-.2.6-.1l1.5.7c.3.1.4.3.4.5 0 .5-.2 1.2-.8 1.6-.6.4-1.4.6-2.5.2-1.6-.6-3.5-2-4.6-3.9-.7-1.2-.6-2.3-.2-2.8Z" strokeWidth={1.1} />
  </svg>
);
export const Instagram = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="3.9" />
    <circle cx="17.1" cy="6.9" r=".7" fill="currentColor" stroke="none" />
  </svg>
);
export const Pin = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 1 1 13 0c0 5-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
);
export const Clock = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);
export const Calendar = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
  </svg>
);
export const CardIcon = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <rect x="3" y="6" width="18" height="12.5" rx="2.5" />
    <path d="M3 10h18M6.5 15h3" />
  </svg>
);
export const Contactless = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M8 8.5a5 5 0 0 1 0 7M11.5 6a8.6 8.6 0 0 1 0 12M15 3.8a12 12 0 0 1 0 16.4" />
  </svg>
);
export const Door = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M6 20.5V4.5c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v16M4 20.5h16" />
    <circle cx="14.8" cy="12.2" r=".8" />
  </svg>
);
export const Heart = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M12 19.5s-7.5-4.4-7.5-10A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 7.5 2.5c0 5.6-7.5 10-7.5 10Z" />
  </svg>
);
export const Ear = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M7 9.5a5 5 0 1 1 10 0c0 3-2.5 3.8-2.5 6.5a3 3 0 0 1-5.5 1.6" />
    <path d="M10 10a2 2 0 1 1 3.4 1.4" />
  </svg>
);
export const Document = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M6.5 3.5h7.5l4 4v12c0 .6-.4 1-1 1h-10.5c-.6 0-1-.4-1-1v-15c0-.6.4-1 1-1Z" />
    <path d="M13.5 3.5V8h4.5M9 12h6M9 15.5h6" />
  </svg>
);
export const Compass = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
  </svg>
);
export const Arrow = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const ArrowUpRight = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M7 17 17 7M8.5 7H17v8.5" />
  </svg>
);
export const Plus = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const Close = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const Menu = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M4 8h16M4 16h16" />
  </svg>
);
export const Check = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="m5 12.5 4.2 4L19 7" />
  </svg>
);
export const Pause = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M9 6v12M15 6v12" />
  </svg>
);
export const Play = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />
  </svg>
);
