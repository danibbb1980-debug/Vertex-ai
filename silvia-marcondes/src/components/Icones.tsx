// Ícones em traço fino (desenhados para o site, estilo linha contínua).
type P = { className?: string };
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false as const,
};

export const IconeWhatsapp = ({ className = "size-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M4.5 19.5l1.1-3.6A8 8 0 1 1 8.4 18.6z" />
    <path d="M9.2 8.6c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .5-.1.6l-.5.6c.5 1 1.4 1.9 2.4 2.4l.6-.5c.2-.1.4-.2.6-.1l1.5.6c.3.1.4.3.4.5v.5c0 .3 0 .6-.5.8-.7.4-1.6.5-2.6.1a7.6 7.6 0 0 1-3.9-3.9c-.4-1-.3-1.9.1-2.6z" />
  </svg>
);
export const IconeInstagram = ({ className = "size-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="4" y="4" width="16" height="16" rx="5" />
    <circle cx="12" cy="12" r="3.6" />
    <circle cx="16.8" cy="7.3" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);
export const IconeMapa = ({ className = "size-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 21c-4-4.6-6.5-8-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 13 16 16.4 12 21z" />
    <circle cx="12" cy="9.8" r="2.3" />
  </svg>
);
export const IconeRelogio = ({ className = "size-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);
export const IconeAcessivel = ({ className = "size-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="12" cy="4.6" r="1.6" />
    <path d="M10.5 8.5v5h5l2 5" />
    <path d="M8.2 11.6a5 5 0 1 0 7.2 6.2" />
  </svg>
);
export const IconeSeta = ({ className = "size-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const IconeMais = ({ className = "size-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const IconeMenu = ({ className = "size-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M4 8h16M4 16h11" />
  </svg>
);
export const IconeFechar = ({ className = "size-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const IconeCheck = ({ className = "size-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M5 12.5l4.2 4.2L19 7" />
  </svg>
);
export const IconeGota = ({ className = "size-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 3.5c3.4 4.3 5.5 7.6 5.5 10.4a5.5 5.5 0 0 1-11 0c0-2.8 2.1-6.1 5.5-10.4z" />
  </svg>
);

/* Glifos abstratos dos cartões de atendimento (sem figura humana) */
export const GlifoDepilacao = ({ className = "" }: P) => (
  <svg viewBox="0 0 120 80" className={className} {...base} strokeWidth={1.4}>
    <path d="M6 56C26 56 30 22 50 22s22 34 42 34c10 0 16-6 22-14" />
    <path d="M6 66c20 0 24-10 44-10s24 10 44 10" opacity=".45" />
  </svg>
);
export const GlifoLimpeza = ({ className = "" }: P) => (
  <svg viewBox="0 0 120 80" className={className} {...base} strokeWidth={1.4}>
    <circle cx="60" cy="40" r="26" />
    <circle cx="60" cy="40" r="15" opacity=".5" />
    <path d="M60 8c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z" />
  </svg>
);
export const GlifoDermaplaning = ({ className = "" }: P) => (
  <svg viewBox="0 0 120 80" className={className} {...base} strokeWidth={1.4}>
    <path d="M14 62C34 20 86 20 106 62" />
    <path d="M60 14c10 10 14 20 0 34C46 34 50 24 60 14z" />
  </svg>
);
