/**
 * Ilustração original: linhas de respiração ritmada.
 * Curvas suaves e paralelas, sem eixos nem traçado de exame.
 */
export function Onda({ className = "", linhas = 7, cor = "#9dc0e3" }: { className?: string; linhas?: number; cor?: string }) {
  const largura = 1200;
  const caminhos = Array.from({ length: linhas }, (_, i) => {
    const y = 40 + i * 18;
    const amp = 10 + Math.sin((i / (linhas - 1)) * Math.PI) * 26;
    let d = `M0 ${y}`;
    // três ciclos lentos: inspira (sobe devagar) e expira (desce mais longa)
    const ciclo = largura / 3;
    for (let c = 0; c < 3; c++) {
      const x0 = c * ciclo;
      d += ` C ${x0 + ciclo * 0.18} ${y}, ${x0 + ciclo * 0.24} ${y - amp}, ${x0 + ciclo * 0.4} ${y - amp}`;
      d += ` S ${x0 + ciclo * 0.78} ${y}, ${x0 + ciclo} ${y}`;
    }
    return d;
  });
  return (
    <svg
      viewBox={`0 0 ${largura} ${60 + linhas * 18}`}
      preserveAspectRatio="none"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      {caminhos.map((d, i) => (
        <path key={i} d={d} stroke={cor} strokeWidth="1" vectorEffect="non-scaling-stroke" opacity={0.35 + (i % 3) * 0.2} />
      ))}
    </svg>
  );
}
