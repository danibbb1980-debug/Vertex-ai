import type { CSSProperties } from "react";

/** Estrela de quatro pontas, traço suave. Decorativa. */
export function Sparkle({ className = "", style, filled = false }: { className?: string; style?: CSSProperties; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden focusable={false}>
      <path
        d="M12 2.5c.6 4.6 2.9 6.9 9.5 9.5-6.6 2.6-8.9 4.9-9.5 9.5-.6-4.6-2.9-6.9-9.5-9.5 6.6-2.6 8.9-4.9 9.5-9.5Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.4}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Moon({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden focusable={false}>
      <path
        d="M19.5 14.2A8 8 0 0 1 9.8 4.5a8 8 0 1 0 9.7 9.7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Forma orgânica preenchida. As variações são formas próprias, desenhadas à mão. */
const BLOBS = {
  a: "M421 82c58 50 79 141 54 222s-95 152-181 168-187-24-238-101S1 191 46 118 172 0 253 1s110 31 168 81Z",
  b: "M390 61c62 41 108 115 96 187s-82 140-160 177-164 42-223-6S4 288 15 205 88 49 162 17s166 3 228 44Z",
  c: "M437 135c35 71 25 172-35 234s-169 85-252 54S8 309 3 219 64 46 151 14s251 50 286 121Z",
};

export function Blob({
  variant = "a",
  className = "",
  style,
}: {
  variant?: keyof typeof BLOBS;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg viewBox="0 0 500 500" className={className} style={style} aria-hidden focusable={false}>
      <path d={BLOBS[variant]} fill="currentColor" />
    </svg>
  );
}

/** Onda para transição entre seções. `cor` é a cor da seção de baixo. */
export function Onda({ cor, flip = false, className = "" }: { cor: string; flip?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={`block h-10 w-full md:h-16 ${flip ? "rotate-180" : ""} ${className}`}
      aria-hidden
      focusable={false}
    >
      <path d="M0 48c180-34 360-46 560-22s390 50 590 24 230-30 290-26v56H0Z" fill={cor} />
    </svg>
  );
}
