import { MONO_D, MONO_VIEWBOX } from "./monogramPath";

/** Monograma completo B | N, na cor do texto (currentColor). */
export function Monograma({ className = "", titulo }: { className?: string; titulo?: string }) {
  return (
    <svg
      viewBox={MONO_VIEWBOX}
      className={className}
      role={titulo ? "img" : undefined}
      aria-hidden={titulo ? undefined : true}
      aria-label={titulo}
      focusable="false"
    >
      <path fill="currentColor" fillRule="evenodd" d={MONO_D} />
    </svg>
  );
}

/**
 * Metade do monograma: "b" (B, à esquerda da barra) ou "n" (N e quadro, à direita).
 * A barra em si é desenhada à parte, para poder ser animada.
 */
export function MeioMonograma({ lado, className = "" }: { lado: "b" | "n"; className?: string }) {
  const vb = lado === "b" ? "6 5 140 152" : "151 5 166 152";
  return (
    <svg viewBox={vb} className={className} aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
      <defs>
        <clipPath id={`clip-${lado}`}>
          {lado === "b" ? <rect x="0" y="0" width="145.6" height="170" /> : <rect x="151.4" y="0" width="200" height="170" />}
        </clipPath>
      </defs>
      <path fill="currentColor" fillRule="evenodd" d={MONO_D} clipPath={`url(#clip-${lado})`} />
    </svg>
  );
}

/** Nome por extenso, vetorizado do logo (arquivo estático, fora do JS). */
export function Assinatura({ className = "", clara = true }: { className?: string; clara?: boolean }) {
  return (
    <img
      src={clara ? "/img/assinatura-clara.svg" : "/img/assinatura-escura.svg"}
      width={634}
      height={104}
      alt="Botelho & Neves Advogados Associados"
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}
