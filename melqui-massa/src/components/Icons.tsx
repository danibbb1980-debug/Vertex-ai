/** Ícones de traço fino com quinas a 45°, na mesma linguagem do cérebro do logo. */
type P = { className?: string; size?: number };

const base = (size = 20) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinejoin: "miter" as const,
  strokeLinecap: "square" as const,
  "aria-hidden": true,
  focusable: false,
});

export function Seta({ className, size = 18 }: P) {
  return (
    <svg {...base(size)} className={`seta ${className ?? ""}`}>
      <path d="M4 12h14M13 7l5 5-5 5" />
    </svg>
  );
}

/** Balão de conversa chanfrado (WhatsApp). */
export function Conversa({ className, size }: P) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M7 4h11l3 3v8l-3 3H11l-5 3v-3H6l-3-3V7z" />
      <path d="M8 10h8M8 13.5h5" />
    </svg>
  );
}

export function Instagram({ className, size }: P) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M7 3h12l2 2v12l-4 4H5l-2-2V7z" />
      <path d="M12 8.5l3.5 3.5-3.5 3.5L8.5 12z" />
      <path d="M17 6.5h.01" />
    </svg>
  );
}

export function Marcador({ className, size }: P) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M8 3h8l3 3v6l-7 9-7-9V6z" />
      <path d="M12 8l2 2-2 2-2-2z" />
    </svg>
  );
}

export function Mais({ className, size = 22 }: P) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
