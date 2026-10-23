import { useId } from "react";

/**
 * O V da logo como vetor. Proporções tiradas da logo oficial:
 * dois braços (ouro denso e champanhe) com uma fresta fina entre eles.
 */
export function VMark({ className = "", glow = false, title }: { className?: string; glow?: boolean; title?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={className}
      style={glow ? { filter: "drop-shadow(0 0 28px rgba(201,162,75,0.28))" } : undefined}
      viewBox="0 0 429 370"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#E9C876" />
          <stop offset="1" stopColor="#AC7E28" />
        </linearGradient>
        <linearGradient id={`c${id}`} x1="1" y1="0" x2="0.65" y2="1">
          <stop offset="0" stopColor="#FAECC4" />
          <stop offset="1" stopColor="#D4B25C" />
        </linearGradient>
      </defs>
      <path fill={`url(#g${id})`} d="M0 0h105l105 185v185z" />
      <path fill={`url(#c${id})`} d="M429 0H325L220 185v185z" />
    </svg>
  );
}

/** Logo horizontal para header e rodapé: V + VERTEX / WEB STUDIOS */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <VMark className="h-6 w-auto" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[0.95rem] font-normal tracking-[0.32em] text-pearl uppercase">Vertex</span>
        <span className="mt-1 font-display text-[0.55rem] font-medium tracking-[0.42em] text-gold uppercase">Web Studios</span>
      </span>
    </span>
  );
}
