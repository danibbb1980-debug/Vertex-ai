import { CONFIG } from "../config";
import { WORDMARK_D, WORDMARK_VIEWBOX } from "./logo-paths";

type Tom = "claro" | "escuro";

/** Só o wordmark BIOS (sem descritor). */
export function Wordmark({
  className,
  cor = "currentColor",
  titulo,
}: {
  className?: string;
  cor?: string;
  titulo?: string;
}) {
  return (
    <svg
      viewBox={WORDMARK_VIEWBOX}
      className={className}
      role={titulo ? "img" : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
      focusable="false"
    >
      <path d={WORDMARK_D} fill={cor} fillRule="evenodd" />
    </svg>
  );
}

/**
 * Logotipo completo: wordmark + filete + descritor em três linhas.
 * tom="escuro": bronze fosco chapado sobre grafite. tom="claro": grafite sobre pedra.
 */
export function Logotipo({ tom, className }: { tom: Tom; className?: string }) {
  if (CONFIG.logo) {
    return <img src={CONFIG.logo} alt={CONFIG.nome} className={className} />;
  }
  const letra = tom === "escuro" ? "#B39462" : "#1F1E20";
  const descr = tom === "escuro" ? "#B39462" : "#1F1E20";
  const filete = tom === "escuro" ? "#A8894F" : "#735A2B";
  return (
    <svg viewBox="40 24 960 480" className={className} role="img" aria-label={CONFIG.nome} focusable="false">
      <path d={WORDMARK_D} fill={letra} fillRule="evenodd" />
      <rect x="44" y="408" width="604" height="12" fill={filete} />
      <g
        fill={descr}
        fontFamily="Hanken Grotesk, system-ui, sans-serif"
        fontWeight="600"
        fontSize="40"
        letterSpacing="2.4"
      >
        <text x="676" y="384">INSTITUTO DE</text>
        <text x="676" y="436">ODONTOLOGIA</text>
        <text x="676" y="488">E ESTÉTICA</text>
      </g>
    </svg>
  );
}
