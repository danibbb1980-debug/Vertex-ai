import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { tamanho?: number };

const base = (tamanho = 24, props: SVGProps<SVGSVGElement>) => ({
  width: tamanho,
  height: tamanho,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: "false",
  ...props,
});

/** Estrela de cinco pontas com cantos arredondados (motivo da marca). */
export function Estrela({ tamanho, ...p }: P) {
  return (
    <svg {...base(tamanho, p)}>
      <path d="M12 3.2l2.5 5.3 5.8.7-4.3 4 1.1 5.7L12 16.1l-5.1 2.8 1.1-5.7-4.3-4 5.8-.7z" />
    </svg>
  );
}

/** Brilho de quatro pontas, preenchido. */
export function Brilho({ tamanho, ...p }: P) {
  return (
    <svg {...base(tamanho, { fill: "currentColor", stroke: "none", ...p })}>
      <path d="M12 1.5c.7 5.2 2.6 8.3 10.5 10.5-7.9 2.2-9.8 5.3-10.5 10.5-.7-5.2-2.6-8.3-10.5-10.5C9.4 9.8 11.3 6.7 12 1.5z" />
    </svg>
  );
}

/** Lua crescente. */
export function Lua({ tamanho, ...p }: P) {
  return (
    <svg {...base(tamanho, p)}>
      <path d="M19.5 14.6A8 8 0 0 1 9.4 4.5a8 8 0 1 0 10.1 10.1z" />
    </svg>
  );
}

/** Escova de dentes em traço simples. */
export function Escova({ tamanho, ...p }: P) {
  return (
    <svg {...base(tamanho, p)}>
      <path d="M4 19.5l9.2-9.2" />
      <path d="M12.2 11.3l2.6 2.6" />
      <rect x="13.6" y="3.4" width="5" height="9" rx="1.6" transform="rotate(45 16.1 7.9)" />
      <path d="M15.2 5.9l.9.9M16.6 4.5l.9.9M13.8 7.3l.9.9" />
    </svg>
  );
}

/** Copo com escova (rotina). */
export function Copo({ tamanho, ...p }: P) {
  return (
    <svg {...base(tamanho, p)}>
      <path d="M6.5 9.5h11l-1.3 10.2a1.6 1.6 0 0 1-1.6 1.3H9.4a1.6 1.6 0 0 1-1.6-1.3z" />
      <path d="M14.5 9.5l2.8-6.3" />
      <path d="M16.6 2.4l1.8.8" />
    </svg>
  );
}

export function WhatsApp({ tamanho = 20, ...p }: P) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false" {...p}>
      <path d="M12.04 2.5a9.43 9.43 0 0 0-8.1 14.27L2.5 21.5l4.86-1.4A9.43 9.43 0 1 0 12.04 2.5zm0 17.2c-1.47 0-2.9-.4-4.15-1.15l-.3-.18-2.89.83.86-2.8-.2-.31a7.77 7.77 0 1 1 6.68 3.61zm4.27-5.82c-.23-.12-1.38-.68-1.6-.76-.21-.08-.37-.12-.53.12-.15.23-.6.76-.74.92-.14.15-.27.17-.5.06-.24-.12-.99-.37-1.89-1.17-.7-.62-1.17-1.39-1.3-1.62-.14-.24-.02-.37.1-.48.1-.1.24-.27.35-.41.12-.14.16-.24.24-.4.08-.15.04-.29-.02-.4-.06-.12-.53-1.27-.72-1.74-.19-.46-.39-.39-.53-.4h-.45c-.16 0-.41.06-.62.29-.21.24-.82.8-.82 1.94 0 1.15.84 2.26.95 2.41.12.16 1.64 2.5 3.97 3.5.56.24.99.38 1.33.49.56.18 1.07.15 1.47.09.45-.07 1.38-.56 1.57-1.11.2-.55.2-1.02.14-1.11-.06-.1-.21-.16-.45-.27z" />
    </svg>
  );
}

export function Instagram({ tamanho = 20, ...p }: P) {
  return (
    <svg {...base(tamanho, { strokeWidth: 1.8, ...p })}>
      <rect x="3" y="3" width="18" height="18" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Forma orgânica (blob) para fundos. */
export function Blob({ className, variante = 1 }: { className?: string; variante?: 1 | 2 | 3 }) {
  const caminhos = {
    1: "M44.6-58.9C56.5-50.5 63.6-35.3 67.4-19.4 71.2-3.5 71.7 13.1 65.3 26.4 58.9 39.7 45.6 49.7 31.1 56.9 16.6 64.1.9 68.5-15.6 67.1-32.1 65.7-49.4 58.5-59.8 45.6-70.2 32.7-73.7 14.1-71.2-2.9-68.7-19.9-60.2-35.3-47.6-43.9-35-52.5-17.5-54.3-.4-53.8 16.7-53.3 32.7-67.3 44.6-58.9Z",
    2: "M38.9-51.7C50.1-45.3 58.6-33.7 63.9-20.3 69.2-6.9 71.3 8.3 66.2 20.9 61.1 33.5 48.8 43.5 35.4 51.6 22 59.7 7.5 65.9-7.6 66.5-22.7 67.1-38.4 62.1-49.6 52-60.8 41.9-67.5 26.7-69.1 11.3-70.7-4.1-67.2-19.7-58.6-30.9-50-42.1-36.3-48.9-23-54.6-9.7-60.3 3.2-64.9 15.4-62.9 27.6-60.9 27.7-58.1 38.9-51.7Z",
    3: "M51.3-62.4C64.3-50.6 70.9-32.1 72.1-14.4 73.3 3.3 69.1 20.2 59.6 33.4 50.1 46.6 35.3 56.1 19.2 62.1 3.1 68.1-14.3 70.6-29.3 65.2-44.3 59.8-56.9 46.5-64.2 30.9-71.5 15.3-73.5-2.6-68.6-18.1-63.7-33.6-51.9-46.7-38.1-58.2-24.3-69.7-8.5-79.6 7.9-79.1 24.3-78.6 38.3-74.2 51.3-62.4Z",
  };
  return (
    <svg viewBox="-80 -80 160 160" className={className} aria-hidden focusable="false">
      <path d={caminhos[variante]} fill="currentColor" />
    </svg>
  );
}
