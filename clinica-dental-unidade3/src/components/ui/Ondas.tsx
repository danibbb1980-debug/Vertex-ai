/*
  Ondas em SVG nas cores do logo. Cada camada tem dois períodos idênticos e
  desliza -50% em loop (só transform). Pausa fora da viewport.
*/
import { useInView } from "../../lib/useInView";
import { cn } from "../../lib/cn";

const periodo = (amp: number, y: number) =>
  `M0 ${y} C 150 ${y - amp}, 350 ${y - amp}, 500 ${y} S 850 ${y + amp}, 1000 ${y} ` +
  `S 1350 ${y - amp}, 1500 ${y} S 1850 ${y + amp}, 2000 ${y} V 200 H 0 Z`;

export function Ondas({ className, corBase = "var(--color-ice)" }: { className?: string; corBase?: string }) {
  const [ref, visivel] = useInView<HTMLDivElement>();
  const camadas = [
    { d: periodo(26, 92), fill: "var(--color-navy-700)", op: 0.55, dur: "38s" },
    { d: periodo(20, 112), fill: "var(--color-teal-600)", op: 0.35, dur: "28s" },
    { d: periodo(16, 140), fill: corBase, op: 1, dur: "46s" },
  ];
  return (
    <div ref={ref} aria-hidden="true" className={cn("pointer-events-none overflow-hidden", !visivel && "pausado", className)}>
      <div className="relative h-full w-full">
        {camadas.map((c, i) => (
          <svg
            key={i}
            className="onda absolute inset-y-0 left-0 h-full w-[200%]"
            style={{ ["--dur" as string]: c.dur }}
            viewBox="0 0 2000 200"
            preserveAspectRatio="none"
          >
            <path d={c.d} fill={c.fill} opacity={c.op} />
          </svg>
        ))}
        <svg className="onda absolute inset-y-0 left-0 h-full w-[200%]" style={{ ["--dur" as string]: "46s" }} viewBox="0 0 2000 200" preserveAspectRatio="none">
          <path d={periodo(16, 140).split(" V")[0]} fill="none" stroke="var(--color-gold-400)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" opacity="0.9" />
        </svg>
      </div>
    </div>
  );
}
