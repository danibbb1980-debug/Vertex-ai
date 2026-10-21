/** Ícones de traço fino desenhados para o site (sem bibliotecas). */
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const Dente = (p: P) => (
  <svg {...base} {...p}>
    <path d="M7.5 3.5c-2.4 0-4 1.9-4 4.6 0 2.1.9 3.6 1.4 5.4.6 2.3.7 7 2.6 7 1.6 0 1.5-4.4 2.6-5.6.5-.5 1.3-.5 1.8 0 1.1 1.2 1 5.6 2.6 5.6 1.9 0 2-4.7 2.6-7 .5-1.8 1.4-3.3 1.4-5.4 0-2.7-1.6-4.6-4-4.6-1.8 0-2.6 1-4.5 1s-2.7-1-4.5-1Z" />
  </svg>
);
export const Brilho = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.2 2.2M15.5 15.5l2.2 2.2M6.3 17.7l2.2-2.2M15.5 8.5l2.2-2.2" />
  </svg>
);
export const Coracao = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 20s-7.5-4.4-7.5-10A4.2 4.2 0 0 1 12 7.4 4.2 4.2 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10Z" />
  </svg>
);
export const Crescimento = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 21v-9M12 12c0-3.5 2.5-6 6-6 0 3.5-2.5 6-6 6ZM12 15c0-3-2-5-5-5 0 3 2 5 5 5Z" />
  </svg>
);
export const Familia = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="8" cy="7" r="2.5" />
    <circle cx="16.5" cy="9.5" r="2" />
    <path d="M3.5 20c0-3 2-5.5 4.5-5.5s4.5 2.5 4.5 5.5M13 20c0-2.3 1.5-4.2 3.5-4.2S20 17.7 20 20" />
  </svg>
);
export const Conversa = (p: P) => (
  <svg {...base} {...p}>
    <path d="M20 11.5a8 8 0 0 1-11.6 7.1L4 20l1.4-4.2A8 8 0 1 1 20 11.5Z" />
    <path d="M9 10.5h6M9 13.5h4" />
  </svg>
);
export const Lupa = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </svg>
);
export const Prancheta = (p: P) => (
  <svg {...base} {...p}>
    <rect x="5" y="4.5" width="14" height="16" rx="2.5" />
    <path d="M9 4.5V3.8c0-.7.5-1.3 1.2-1.3h3.6c.7 0 1.2.6 1.2 1.3v.7M8.5 11l2 2 4-4M8.5 16.5h7" />
  </svg>
);
export const Pin = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
);
export const Relogio = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);
export const Telefone = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 4.5h3l1.5 4-2 1.3a10 10 0 0 0 6.7 6.7l1.3-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 3.5 6.1 1.5 1.5 0 0 1 5 4.5Z" />
  </svg>
);
export const Instagram = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
  </svg>
);
export const Seta = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const Mais = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const Menu = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 8h16M4 16h16" />
  </svg>
);
export const Fechar = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const Escudo = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3 5 6v5.5c0 4.4 3 8 7 9.5 4-1.5 7-5.1 7-9.5V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
export const Gengiva = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3.5 9.5c2 1.5 4 2 8.5 2s6.5-.5 8.5-2" />
    <path d="M6 11v4.5c0 1.5.8 3 2 3s1.5-1.4 2-3M14 15.5c.5 1.6.8 3 2 3s2-1.5 2-3V11" />
  </svg>
);
export const Sorriso = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M8.5 14c1 1.4 2.2 2 3.5 2s2.5-.6 3.5-2M9.2 9.5h.01M14.8 9.5h.01" strokeWidth={2} />
  </svg>
);

/** Estrela de quatro pontas (ornamento). */
export const Estrela = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden fill="currentColor" {...p}>
    <path d="M12 1.5c.6 5.6 4.9 9.9 10.5 10.5-5.6.6-9.9 4.9-10.5 10.5C11.4 16.9 7.1 12.6 1.5 12 7.1 11.4 11.4 7.1 12 1.5Z" />
  </svg>
);

/** Nuvem orgânica (ornamento). */
export const Nuvem = (p: P) => (
  <svg viewBox="0 0 120 60" aria-hidden fill="currentColor" {...p}>
    <path d="M28 54C14 54 6 46 6 37s8-16 18-15c2-11 12-18 24-18 11 0 19 6 22 14 3-2 7-3 11-3 11 0 19 8 19 18 8 1 14 7 14 14 0 4-3 7-8 7H28Z" />
  </svg>
);
