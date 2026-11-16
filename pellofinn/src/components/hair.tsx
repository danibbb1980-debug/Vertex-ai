import { motion, useReducedMotion } from "motion/react";

/** Fio afilado: raiz em (0,0), ponta em (curva, -h). Grosso na raiz, fino na ponta. */
export function hairPath(h: number, w: number, curva: number) {
  const r = w / 2;
  return [
    `M ${-r} 0`,
    `C ${-r} ${-h * 0.42} ${curva * 0.55 - r * 0.35} ${-h * 0.78} ${curva} ${-h}`,
    `C ${curva * 0.55 + r * 0.35} ${-h * 0.78} ${r} ${-h * 0.42} ${r} 0`,
    "Z",
  ].join(" ");
}

export function Hair({ h, w, curva, cor }: { h: number; w: number; curva: number; cor: string }) {
  return (
    <g fill={cor}>
      <path d={hairPath(h, w, curva)} />
      <ellipse cx={0} cy={0} rx={w * 0.85} ry={w * 0.95} />
    </g>
  );
}

/** Pseudoaleatório determinístico (o desenho é igual em todo carregamento). */
export function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

/** Linha de fios para os blocos bordô: crescem uma vez ao entrar na tela. */
export function HairRow({
  n = 14,
  altura = 120,
  largura = 600,
  seed = 1,
  className = "",
  destaque = [] as number[],
}: {
  n?: number;
  altura?: number;
  largura?: number;
  seed?: number;
  className?: string;
  destaque?: number[];
}) {
  const reduz = useReducedMotion();
  const gap = largura / (n + 1);
  return (
    <svg
      viewBox={`0 0 ${largura} ${altura + 10}`}
      className={className}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMinYMax meet"
    >
      <line x1="0" x2={largura} y1={altura + 2} y2={altura + 2} stroke="currentColor" strokeOpacity=".25" strokeWidth="1" />
      {Array.from({ length: n }, (_, i) => {
        const r = rand(seed + i);
        const h = altura * (0.35 + r * 0.6);
        const cor = destaque.includes(i) ? "var(--color-vermelho-claro)" : "var(--color-fio-claro)";
        return (
          <g key={i} transform={`translate(${gap * (i + 1) + (r - 0.5) * gap * 0.5} ${altura + 2})`}>
            <motion.g
              initial={reduz ? false : { scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.9, delay: 0.05 * i + r * 0.2, ease: [0.2, 0.7, 0.2, 1] }}
              style={{ originY: 1, originX: 0.5 }}
            >
              <Hair h={h} w={4 + r * 3} curva={6 + r * 10} cor={cor} />
            </motion.g>
          </g>
        );
      })}
    </svg>
  );
}

/** Fio isolado como detalhe tipográfico (equipe, rodapé). */
export function FioDetalhe({ className = "", cor = "var(--color-fio)" }: { className?: string; cor?: string }) {
  return (
    <svg viewBox="-8 -64 30 70" className={className} aria-hidden="true" focusable="false">
      <Hair h={60} w={4} curva={12} cor={cor} />
    </svg>
  );
}
