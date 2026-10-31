import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { tamanho?: number };

const base = ({ tamanho = 20, ...p }: P) => ({
  width: tamanho,
  height: tamanho,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
  ...p,
});

export const IconeWhatsApp = ({ tamanho = 20, ...p }: P) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable={false} {...p}>
    <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5.1 5.2-1.37A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.09.81.83-3.01-.2-.31a8.2 8.2 0 1 1 6.94 3.84Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.16.25-.63.8-.78.97-.14.16-.29.18-.53.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.71-1.33.08-.16.04-.3-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.75 2.75 0 0 0-.86 2.04 4.77 4.77 0 0 0 1 2.53 10.9 10.9 0 0 0 4.18 3.69c1.55.67 2.16.73 2.94.61.47-.07 1.46-.6 1.66-1.17.2-.58.2-1.07.15-1.17-.06-.1-.22-.16-.47-.28Z" />
  </svg>
);
export const IconeInstagram = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
);
export const IconeSeta = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const IconeSetaDiagonal = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);
export const IconePino = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
export const IconeRelogio = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
export const IconeCalendario = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="5" width="17" height="15" rx="3" />
    <path d="M8 3v4M16 3v4M3.5 10h17" />
  </svg>
);
export const IconeCartao = (p: P) => (
  <svg {...base(p)}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" />
    <path d="M2.5 10h19M6.5 15h4" />
  </svg>
);
export const IconeAproximacao = (p: P) => (
  <svg {...base(p)}>
    <path d="M8.5 8.5a5 5 0 0 1 0 7M12 6a8.5 8.5 0 0 1 0 12M15.5 3.5a12 12 0 0 1 0 17" />
  </svg>
);
export const IconePorta = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 21V4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21M4 21h16" />
    <circle cx="14.5" cy="12" r="0.8" fill="currentColor" />
  </svg>
);
export const IconeCheck = (p: P) => (
  <svg {...base(p)}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
export const IconeMenu = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 8h16M4 16h16" />
  </svg>
);
export const IconeFechar = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const IconeMapa = (p: P) => (
  <svg {...base(p)}>
    <path d="m9 4-5.5 2v14L9 18l6 2 5.5-2V4L15 6 9 4Z" />
    <path d="M9 4v14M15 6v14" />
  </svg>
);
export const IconeConversa = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5v-9Z" />
  </svg>
);
export const IconePrancheta = (p: P) => (
  <svg {...base(p)}>
    <rect x="5" y="4" width="14" height="17" rx="2.5" />
    <path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3" />
  </svg>
);
export const IconeCiclo = (p: P) => (
  <svg {...base(p)}>
    <path d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 13a8 8 0 0 0 14.3 4.9L20 16" />
    <path d="M4 4v4h4M20 20v-4h-4" />
  </svg>
);

/* Ilustrações de traço originais para os atendimentos (48×48) */
const ilus = (p: P) => ({ ...base({ tamanho: 48, ...p }), viewBox: "0 0 48 48", strokeWidth: 1.4 });
const DENTE =
  "M15 8c-5.5 0-8.5 4.5-8.5 10 0 4.2 1.7 7 2.6 10.6C10.3 33.6 11 42 15.4 42c3 0 3.2-5 4-8.6.7-3 2-4.8 4.6-4.8s3.9 1.8 4.6 4.8c.8 3.6 1 8.6 4 8.6 4.4 0 5.1-8.4 6.3-13.4.9-3.6 2.6-6.4 2.6-10.6 0-5.5-3-10-8.5-10-3.6 0-5.6 1.8-9 1.8S18.6 8 15 8Z";

export const IlusClinico = (p: P) => (
  <svg {...ilus(p)}>
    <path d={DENTE} />
    <path d="M13 17c5-3.2 12 1.6 22-2.4" className="text-gold-400" stroke="currentColor" />
  </svg>
);
export const IlusImplante = (p: P) => (
  <svg {...ilus(p)}>
    <path d="M15 5c-4.5 0-7 3.5-7 8 0 3.5 1.6 5.6 2.6 8h26.8c1-2.4 2.6-4.5 2.6-8 0-4.5-2.5-8-7-8-3 0-4.6 1.4-9 1.4S18 5 15 5Z" />
    <path d="M17 25h14M18.5 29h11M19.5 33h9M20.5 37h7M22 41h4" />
    <path d="M24 21v-2" className="text-gold-400" stroke="currentColor" />
  </svg>
);
export const IlusOrtodontia = (p: P) => (
  <svg {...ilus(p)}>
    <rect x="5" y="14" width="9" height="20" rx="4.5" />
    <rect x="14" y="13" width="10" height="22" rx="5" />
    <rect x="24" y="13" width="10" height="22" rx="5" />
    <rect x="34" y="14" width="9" height="20" rx="4.5" />
    <path d="M4 24h40" className="text-gold-400" stroke="currentColor" />
    <rect x="7.5" y="22" width="4" height="4" rx="1" />
    <rect x="17" y="22" width="4" height="4" rx="1" />
    <rect x="27" y="22" width="4" height="4" rx="1" />
    <rect x="36.5" y="22" width="4" height="4" rx="1" />
  </svg>
);
export const IlusEstetica = (p: P) => (
  <svg {...ilus(p)}>
    <path d={DENTE} />
    <path d="M30 12a7 7 0 0 1 4.5 6" className="text-gold-400" stroke="currentColor" />
    <path d="M14 34c3 2.4 7 2.4 10 0s7-2.4 10 0" opacity=".55" />
  </svg>
);

export const ILUSTRACOES: Record<string, (p: P) => JSX.Element> = {
  "clinico-geral": IlusClinico,
  implantes: IlusImplante,
  ortodontia: IlusOrtodontia,
  estetica: IlusEstetica,
};
