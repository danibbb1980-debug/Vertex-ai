import { useId } from "react";

type Props = {
  className?: string;
  /** "cor" = vinho + ouro (marca). "linha" = só contornos finos, para composições grandes. */
  variant?: "cor" | "linha";
  title?: string;
};

/**
 * Emblema redesenhado em vetor a partir do logo (hexágono vinho + coluna dourada + balança).
 * Sem o selo e sem a legenda do logo original.
 */
export function Emblem({ className, variant = "cor", title }: Props) {
  const id = useId().replace(/:/g, "");
  const a11y = title ? { role: "img", "aria-label": title } : { "aria-hidden": true as const };

  if (variant === "linha") {
    return (
      <svg viewBox="0 20 480 650" className={className} fill="none" stroke="currentColor" strokeWidth={1.1} vectorEffect="non-scaling-stroke" {...a11y}>
        <path d="M18 240 L155 160 L155 655 L18 570 Z" />
        <path d="M462 240 L325 160 L325 655 L462 570 Z" />
        <path d="M170 40 L312 128 L312 485 L170 598 Z" />
        <path d="M92 245 Q240 222 388 245" />
        <circle cx="92" cy="245" r="11" />
        <circle cx="388" cy="245" r="11" />
        <path d="M92 256 L44 352 M92 256 L140 352 M92 256 V352 M388 256 L340 352 M388 256 L436 352 M388 256 V352" />
        <path d="M36 352 H148 Q144 384 92 386 Q40 384 36 352 Z" />
        <path d="M332 352 H444 Q440 384 388 386 Q336 384 332 352 Z" />
        <path d="M228 222 L240 206 L252 222 V410 H228 Z" />
        <path d="M188 410 H292 V426 H188 Z M146 452 H334 V480 H146 Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 20 480 650" className={className} {...a11y}>
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={`g${id}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#8E6F33" />
          <stop offset="0.45" stopColor="#D2B272" />
          <stop offset="0.7" stopColor="#B08D4C" />
          <stop offset="1" stopColor="#7C5F2A" />
        </linearGradient>
      </defs>
      <path d="M18 240 L155 160 L155 655 L18 570 Z" fill="#8A2A2B" />
      <path d="M462 240 L325 160 L325 655 L462 570 Z" fill="#8A2A2B" />
      <path d="M170 40 L312 128 L312 485 L170 598 Z" fill={`url(#g${id})`} />
      <g fill="#F5F0E6">
        <path d="M92 240 Q240 214 388 240 L388 251 Q240 230 92 251 Z" />
        <circle cx="92" cy="245" r="13" />
        <circle cx="388" cy="245" r="13" />
        <path d="M228 222 L240 204 L252 222 V412 H228 Z" />
        <rect x="188" y="410" width="104" height="18" rx="2" />
        <path d="M146 446 H334 V482 H146 Z" />
        <path d="M36 350 H148 Q144 386 92 388 Q40 386 36 350 Z" />
        <path d="M332 350 H444 Q440 386 388 388 Q336 386 332 350 Z" />
      </g>
      <rect x="170" y="456" width="140" height="8" fill="#B08D4C" />
      <g stroke="#F5F0E6" strokeWidth="4" fill="none" strokeLinecap="round">
        <path d="M92 256 L46 350 M92 256 L138 350 M92 256 V350" />
        <path d="M388 256 L342 350 M388 256 L434 350 M388 256 V350" />
      </g>
    </svg>
  );
}
