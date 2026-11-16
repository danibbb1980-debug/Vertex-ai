import { useMemo } from "react";

type Props = {
  /** Número de linhas */
  n?: number;
  /** Cor das linhas comuns */
  cor?: string;
  /** Cor das linhas de destaque (a cada `cada` linhas) */
  corForte?: string;
  cada?: number;
  /** Frequência e fase da ondulação de densidade: muda o "caimento" das pregas */
  freq?: number;
  fase?: number;
  className?: string;
};

/**
 * "A prega": campo de linhas verticais de 1px com espaçamento variável,
 * como as dobras de um tecido. Um único SVG, sem centenas de elementos no layout.
 */
export function posicoesPregas(n: number, freq: number, fase: number) {
  const passos: number[] = [];
  for (let i = 0; i < n; i++) {
    const onda = 0.5 + 0.5 * Math.sin(i * freq + fase);
    const onda2 = 0.5 + 0.5 * Math.sin(i * freq * 0.37 + fase * 1.7);
    passos.push(0.18 + Math.pow(onda, 2.2) * 0.9 + onda2 * 0.35);
  }
  const total = passos.reduce((a, b) => a + b, 0);
  let acc = 0;
  return passos.map((p) => {
    acc += p;
    return (acc - p / 2) / total;
  });
}

export function Pregas({
  n = 44,
  cor = "rgba(42,36,31,0.32)",
  corForte = "rgba(42,36,31,0.7)",
  cada = 7,
  freq = 0.42,
  fase = 0,
  className = "",
}: Props) {
  const xs = useMemo(() => posicoesPregas(n, freq, fase), [n, freq, fase]);
  return (
    <svg className={className} width="100%" height="100%" aria-hidden="true" focusable="false">
      {xs.map((x, i) => (
        <line
          key={i}
          x1={`${(x * 100).toFixed(3)}%`}
          x2={`${(x * 100).toFixed(3)}%`}
          y1="0"
          y2="100%"
          stroke={i % cada === 3 ? corForte : cor}
          strokeWidth="1"
          shapeRendering="crispEdges"
        />
      ))}
    </svg>
  );
}
