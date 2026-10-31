import type { SVGProps } from "react";
import type { IconeArea } from "../config";

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...p,
});

/* Ícones de área: traço original, sem estetoscópio. */
const areaPaths: Record<IconeArea, JSX.Element> = {
  dente: (
    <path d="M7.5 3.5c-2.2 0-3.6 1.8-3.4 4.3.2 2.4 1.2 3.6 1.6 6 .4 2.6.8 6.7 2.4 6.7 1.4 0 1.5-3.7 2.2-5.3.4-.9 1-1.2 1.7-1.2s1.3.3 1.7 1.2c.7 1.6.8 5.3 2.2 5.3 1.6 0 2-4.1 2.4-6.7.4-2.4 1.4-3.6 1.6-6 .2-2.5-1.2-4.3-3.4-4.3-1.8 0-2.6 1-4.5 1s-2.7-1-4.5-1Z" />
  ),
  "dente-infantil": (
    <>
      <path d="M8.5 6.5c-1.7 0-2.8 1.4-2.6 3.3.1 1.8.9 2.7 1.2 4.6.3 2 .6 5.1 1.8 5.1 1.1 0 1.1-2.8 1.7-4 .3-.7.8-.9 1.4-.9s1 .2 1.3.9c.6 1.2.6 4 1.7 4 1.2 0 1.5-3.1 1.8-5.1.3-1.9 1.1-2.8 1.2-4.6.2-1.9-.9-3.3-2.6-3.3-1.4 0-2 .8-3.4.8s-2.1-.8-3.5-.8Z" />
      <path d="M17.5 2.8l.5 1.2 1.2.5-1.2.5-.5 1.2-.5-1.2-1.2-.5 1.2-.5z" />
    </>
  ),
  coracao: (
    <>
      <path d="M12 20s-7.5-4.4-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.6 12 20 12 20Z" />
      <path d="M6.5 12.5h3l1.2-2.2 1.8 4.2 1.3-2h3.7" />
    </>
  ),
  mente: (
    <>
      <path d="M9.5 20v-3.2c-2.8-.8-4.8-3.3-4.8-6.3a6.8 6.8 0 0 1 13.4-1.6l1.4 3.1h-1.9v2.6a1.9 1.9 0 0 1-1.9 1.9h-1.6V20" />
      <path d="M10 8.5a2 2 0 0 1 3.6 1.2c0 1.3-1.6 1.5-1.6 2.8" />
    </>
  ),
  conversa: (
    <>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h7A2.5 2.5 0 0 1 16 6.5v4a2.5 2.5 0 0 1-2.5 2.5H9l-3.5 3v-3A2.5 2.5 0 0 1 4 10.5Z" />
      <path d="M16 9h1.5A2.5 2.5 0 0 1 20 11.5v3a2.5 2.5 0 0 1-2.5 2.5V20L14 17h-2" />
    </>
  ),
  coluna: (
    <>
      <rect x="9" y="3" width="6" height="3.2" rx="1.4" />
      <rect x="8.4" y="7.6" width="7.2" height="3.2" rx="1.4" />
      <rect x="8.8" y="12.2" width="6.4" height="3.2" rx="1.4" />
      <rect x="9.6" y="16.8" width="4.8" height="3.2" rx="1.4" />
      <path d="M5.5 5.5c-1 2.2-1 10.8 0 13M18.5 5.5c1 2.2 1 10.8 0 13" />
    </>
  ),
  folha: (
    <>
      <path d="M5 19c0-8 5-13.5 14.5-14-.3 9.5-5.8 14.5-13.8 14.5Z" />
      <path d="M5 19 13 11" />
    </>
  ),
  prato: (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2" />
    </>
  ),
  corrida: (
    <>
      <circle cx="15" cy="4.5" r="1.8" />
      <path d="m8.5 9.5 3.5-2 3 2.5 2.5.5M12 7.5l-1.5 5 3.5 2.5-1 5M10.5 12.5 8 16.5l-3.5.5" />
    </>
  ),
  pele: (
    <>
      <path d="M12 3c3.6 0 6 2.8 6 6.8 0 4.6-2.8 8.7-6 10.2-3.2-1.5-6-5.6-6-10.2C6 5.8 8.4 3 12 3Z" />
      <path d="M9.5 10.5c.8.6 1.6.6 2.5 0M12 13.5v1" />
      <path d="M19.5 3.2l.4 1 1 .4-1 .4-.4 1-.4-1-1-.4 1-.4z" />
    </>
  ),
  cuidado: (
    <>
      <circle cx="12" cy="8.5" r="4.5" />
      <path d="M12 13v8M9 18h6" />
    </>
  ),
};

export function AreaIcon({ name, ...p }: P & { name: IconeArea }) {
  return <svg {...base(p)}>{areaPaths[name]}</svg>;
}

export const WhatsIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor" aria-hidden {...p}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.15a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.24 8.24 0 1 1 6.98 3.86Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48a.92.92 0 0 0-.66.31c-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
  </svg>
);

export const InstaIcon = (p: P) => (
  <svg {...base({ width: 20, height: 20, ...p })}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
  </svg>
);
export const PhoneIcon = (p: P) => (
  <svg {...base({ width: 20, height: 20, ...p })}>
    <path d="M5 4h3.2l1.6 4-2 1.3a10.5 10.5 0 0 0 4.9 4.9l1.3-2 4 1.6V17a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
);
export const PinIcon = (p: P) => (
  <svg {...base({ width: 20, height: 20, ...p })}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.4" />
  </svg>
);
export const ClockIcon = (p: P) => (
  <svg {...base({ width: 20, height: 20, ...p })}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);
export const ArrowIcon = (p: P) => (
  <svg {...base({ width: 18, height: 18, ...p })}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const ChevronIcon = (p: P) => (
  <svg {...base({ width: 20, height: 20, ...p })}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
export const CheckIcon = (p: P) => (
  <svg {...base({ width: 18, height: 18, ...p })}>
    <path d="m5 12.5 4.2 4L19 7" />
  </svg>
);
export const AccessIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="4.5" r="1.6" />
    <path d="M9 21a5 5 0 1 1 6.6-7.5M11 8v6h5l2.5 5" />
  </svg>
);
export const CardIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="M3 10h18M7 15h3" />
  </svg>
);
export const CalendarIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="5" width="17" height="15" rx="3" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
);
export const LayersIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="5" y="15" width="14" height="5" rx="1.6" />
    <rect x="5" y="9.5" width="14" height="5" rx="1.6" />
    <rect x="5" y="4" width="14" height="5" rx="1.6" />
  </svg>
);
export const HandIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 20s-7-4-7-9.3A3.8 3.8 0 0 1 12 8.5a3.8 3.8 0 0 1 7 2.2C19 16 12 20 12 20Z" />
  </svg>
);
export const MenuIcon = (p: P) => (
  <svg {...base({ width: 22, height: 22, ...p })}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);
export const CloseIcon = (p: P) => (
  <svg {...base({ width: 22, height: 22, ...p })}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
