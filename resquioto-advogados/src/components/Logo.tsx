import { CONFIG } from "../config";

type Props = {
  tom: "ouro" | "preto" | "claro";
  className?: string;
  /** "linha" = marca + nome lado a lado; "marca" = só a coluna com o monograma */
  forma?: "linha" | "marca";
  titulo?: string;
};

const CORES = { ouro: "#B39257", preto: "#0F0F10", claro: "#ECEDEA" };

/** Coluna com o monograma RA — redesenho do logotipo original. Usada SOMENTE como parte do logo. */
function Marca({ cor }: { cor: string }) {
  const voluta = (cx: number, cy: number, lado: 1 | -1) => (
    <g>
      <circle cx={cx} cy={cy} r={4.6} fill="none" stroke={cor} strokeWidth={1.3} />
      <path
        d={`M ${cx} ${cy - 2.4} a 2.4 2.4 0 1 ${lado === 1 ? 1 : 0} 0.01 0`}
        fill="none"
        stroke={cor}
        strokeWidth={1}
      />
      <circle cx={cx} cy={cy} r={1.1} fill={cor} />
    </g>
  );
  return (
    <g>
      <rect x={4} y={2} width={56} height={2.6} fill={cor} />
      <rect x={13} y={7} width={38} height={1.2} fill={cor} />
      {voluta(8.6, 12.2, -1)}
      {voluta(55.4, 12.2, 1)}
      <rect x={15} y={17} width={1.2} height={46} fill={cor} />
      <rect x={47.8} y={17} width={1.2} height={46} fill={cor} />
      <text
        x={32}
        y={52}
        textAnchor="middle"
        fontFamily="Newsreader Variable, Georgia, serif"
        fontSize={27}
        fontWeight={430}
        letterSpacing={-2.4}
        fill={cor}
      >
        RA
      </text>
      <rect x={13} y={64.8} width={38} height={1.2} fill={cor} />
      {voluta(8.6, 69.8, -1)}
      {voluta(55.4, 69.8, 1)}
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
  return (
    <svg viewBox="0 0 296 80" className={className} role="img" aria-label={titulo}>
      <Marca cor={cor} />
      <text
        x={80}
        y={47}
        fontFamily="Newsreader Variable, Georgia, serif"
        fontSize={31}
        fontWeight={380}
        textLength={208}
        lengthAdjust="spacing"
        fill={cor}
      >
        <tspan fontSize={38}>R</tspan>ESQUIOTO
      </text>
      <text
        x={82}
        y={67}
        fontFamily="Hanken Grotesk Variable, sans-serif"
        fontSize={13}
        fontWeight={500}
        textLength={204}
        lengthAdjust="spacing"
        fill={cor}
      >
        ADVOGADOS
      </text>
    </svg>
  );
}
