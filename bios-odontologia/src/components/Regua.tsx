import { useId } from "react";
import { useEntrou, useMenosMovimento } from "../hooks";

/**
 * Régua de graduação: o divisor da marca. Marcas a cada 8px, maiores a cada 5,
 * desenhada da esquerda para a direita quando entra na tela.
 */
export function Regua({ className = "", cor }: { className?: string; cor?: string }) {
  const [ref, entrou] = useEntrou<SVGSVGElement>();
  const reduz = useMenosMovimento();
  const id = "marcas" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg
      ref={ref}
      className={`regua ${className}`}
      style={{
        color: cor,
        transform: reduz || entrou ? "scaleX(1)" : "scaleX(0)",
        transition: reduz ? undefined : "transform 1.4s cubic-bezier(0.2, 0.7, 0.2, 1)",
      }}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id={id} width="40" height="14" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="1" height="13" fill="currentColor" />
          <rect x="8" y="7" width="1" height="6" fill="currentColor" />
          <rect x="16" y="7" width="1" height="6" fill="currentColor" />
          <rect x="24" y="7" width="1" height="6" fill="currentColor" />
          <rect x="32" y="7" width="1" height="6" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="13" fill={`url(#${id})`} />
      <rect y="13" width="100%" height="1" fill="currentColor" />
    </svg>
  );
}

/** Aro da lente com graduação (72 marcas, maiores a cada 30°). */
export function AroLente({ className = "", espessura = 1.5 }: { className?: string; espessura?: number }) {
  const marcas = Array.from({ length: 72 }, (_, i) => {
    const a = (i * 5 * Math.PI) / 180;
    const longa = i % 6 === 0;
    const r1 = 100;
    const r2 = longa ? 112 : 106;
    return (
      <line
        key={i}
        x1={120 + r1 * Math.cos(a)}
        y1={120 + r1 * Math.sin(a)}
        x2={120 + r2 * Math.cos(a)}
        y2={120 + r2 * Math.sin(a)}
        stroke="currentColor"
        strokeWidth={longa ? 1.4 : 0.9}
        vectorEffect="non-scaling-stroke"
      />
    );
  });
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden="true" focusable="false">
      <circle cx="120" cy="120" r="99" fill="none" stroke="currentColor" strokeWidth={espessura} vectorEffect="non-scaling-stroke" />
      {marcas}
    </svg>
  );
}
