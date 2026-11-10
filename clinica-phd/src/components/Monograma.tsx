/**
 * Reprodução em SVG do monograma PHD da clínica (linhas finas de mesma espessura,
 * cantos retos no P e no H, curva no D). Medida a partir do logo original
 * (referencias/logo-original.jpg). Trocar pelo vetor original quando a clínica enviar.
 */
type Props = {
  className?: string;
  cor?: string;
  espessura?: number;
  titulo?: string;
};

export const MONOGRAMA_PATHS = [
  // P: haste externa, topo, bojo e retorno até a haste interna (que vira a haste esquerda do H)
  "M53 306V55.5H134A61.5 61.5 0 0 1 134 178.5H76.5V306",
  // H: travessa
  "M76.5 239.5H199",
  // D: haste (também haste direita do H), topo, curva e base
  "M199 306V178.5H260.5A61.25 61.25 0 0 1 260.5 301H199",
];

export function Monograma({ className, cor = "currentColor", espessura = 10.5, titulo }: Props) {
  return (
    <svg
      viewBox="40 42 296 276"
      className={className}
      fill="none"
      stroke={cor}
      strokeWidth={espessura}
      strokeLinejoin="miter"
      strokeLinecap="butt"
      role={titulo ? "img" : undefined}
      aria-hidden={titulo ? undefined : true}
      aria-label={titulo}
      focusable="false"
    >
      {MONOGRAMA_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
