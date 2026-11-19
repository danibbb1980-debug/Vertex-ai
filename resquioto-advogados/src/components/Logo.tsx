import { CONFIG } from "../config";

type Props = {
  tom: "ouro" | "preto" | "claro";
  className?: string;
  /** "linha" = marca + nome lado a lado; "marca" = só a coluna com o monograma */
  forma?: "linha" | "marca";
  titulo?: string;
};

const CORES = { ouro: "#B39257", preto: "#0F0F10", claro: "#ECEDEA" };

/**
 * Coluna com o monograma RA — redesenho do logotipo original, todo em traços
 * (sem texto SVG, para renderizar igual em qualquer navegador).
 * Usada SOMENTE como parte do logo.
 */
function Marca({ cor }: { cor: string }) {
  const voluta = (cx: number, cy: number) => (
    <g>
      <circle cx={cx} cy={cy} r={4.4} fill="none" stroke={cor} strokeWidth={1.2} />
      <circle cx={cx} cy={cy} r={2.1} fill="none" stroke={cor} strokeWidth={0.9} />
      <circle cx={cx} cy={cy} r={0.9} fill={cor} />
    </g>
  );
  return (
    <g>
      {/* capitel */}
      <rect x={4} y={2} width={56} height={2.6} fill={cor} />
      <rect x={13} y={7} width={38} height={1.2} fill={cor} />
      {voluta(8.6, 12.2)}
      {voluta(55.4, 12.2)}
      {/* fuste */}
      <rect x={14.6} y={17} width={1.2} height={46} fill={cor} />
      <rect x={48.2} y={17} width={1.2} height={46} fill={cor} />
      {/* monograma R + A entrelaçados */}
      <g fill="none" stroke={cor} strokeLinecap="butt" strokeLinejoin="miter">
        {/* R */}
        <path d="M21.5 23.5 V56.5" strokeWidth={2.4} />
        <path d="M21.5 24.2 H28 C34.6 24.2 34.6 39 28 39 H21.5" strokeWidth={1.5} />
        <path d="M27.5 39 L34.8 56.5" strokeWidth={1.1} />
        <path d="M18.4 23.6 H24.4 M18.4 56.4 H24.6" strokeWidth={1} />
        {/* A */}
        <path d="M31.6 56.5 L39.4 23.2" strokeWidth={1} />
        <path d="M39.4 23.2 L46.2 56.5" strokeWidth={2.4} />
        <path d="M34.4 45 H43.6" strokeWidth={1} />
        <path d="M29.6 56.4 H34 M43.6 56.4 H47.6" strokeWidth={1} />
      </g>
      {/* base */}
      <rect x={13} y={64.8} width={38} height={1.2} fill={cor} />
      {voluta(8.6, 69.8)}
      {voluta(55.4, 69.8)}
      <rect x={4} y={75.4} width={56} height={2.6} fill={cor} />
    </g>
  );
}

export function Logo({ tom, className, forma = "linha", titulo = CONFIG.nome }: Props) {
  const cor = CORES[tom];
  if (CONFIG.logo) return <img src={CONFIG.logo} alt={titulo} className={className} />;
  if (forma === "marca")
    return (
      <svg viewBox="0 0 64 80" className={className} role="img" aria-label={titulo}>
        <Marca cor={cor} />
      </svg>
    );
  // Nome em texto HTML (não SVG): a largura acompanha a fonte de verdade, sem cortes no Safari.
  return (
    <span role="img" aria-label={titulo} className={`logo inline-flex items-center ${className ?? ""}`} style={{ color: cor }}>
      <svg viewBox="0 0 64 80" aria-hidden="true" className="h-full w-auto shrink-0">
        <Marca cor={cor} />
      </svg>
      <span aria-hidden="true" className="logo-nome">
        <span className="logo-resquioto">
          <span className="logo-r">R</span>ESQUIOTO
        </span>
        <span className="logo-advogados">A D V O G A D O S</span>
      </span>
    </span>
  );
}
