/**
 * Marca da VIP Shape redesenhada em SVG a partir do logotipo enviado
 * (public/brand/logo-original.jpg, 150 × 150 px). Hexágono duplo aberto à
 * direita + halter, como no original. Substitua pelo vetor oficial quando a
 * academia fornecer o arquivo — o componente é o único lugar a mudar.
 */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 130" className={className} aria-hidden="true" focusable="false">
      <g fill="none" stroke="var(--color-orange)" strokeWidth="5" strokeLinejoin="miter">
        <path d="M110 36 60 7 10 36v58l50 29 50-29" />
        <path d="M100 40 60 17 20 40v50l40 23 40-23" strokeWidth="3" opacity=".9" />
      </g>
      <g fill="#d9d9d9">
        <rect x="31" y="56" width="4" height="18" rx="1" />
        <rect x="37" y="49" width="6" height="32" rx="1.2" />
        <rect x="45" y="52" width="5" height="26" rx="1" />
        <rect x="50" y="62.5" width="20" height="5" />
        <rect x="70" y="52" width="5" height="26" rx="1" />
        <rect x="77" y="49" width="6" height="32" rx="1.2" />
        <rect x="85" y="56" width="4" height="18" rx="1" />
      </g>
    </svg>
  );
}

export function Logo({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className={compact ? "h-9 w-auto" : "h-11 w-auto"} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.05rem] font-bold tracking-[0.04em] text-white">
          VIP SHAPE
        </span>
        <span className="mt-1 text-[0.6rem] font-medium tracking-[0.42em] text-mist">ACADEMIA</span>
      </span>
    </span>
  );
}
