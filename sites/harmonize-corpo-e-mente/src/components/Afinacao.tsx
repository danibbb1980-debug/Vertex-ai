import { forwardRef } from "react";
import { useMenorQue, useVisto } from "../hooks";

const LAMBDA = 200;
const MEIO = 50;

function onda(ciclos: number, amplitude: number) {
  const ini = -LAMBDA;
  const fim = ciclos * LAMBDA + LAMBDA;
  const passo = 5;
  let d = "";
  for (let x = ini; x <= fim; x += passo) {
    const y = MEIO - Math.sin(((x - ini) / LAMBDA) * Math.PI * 2) * amplitude;
    d += `${x === ini ? "M" : "L"}${x} ${y.toFixed(2)}`;
  }
  return d;
}

type Props = {
  /** "afinar": deslize de fase no carregamento (só no hero). "estatico": já em fase. */
  modo?: "afinar" | "estatico";
  /** 0 a 1, amplitude inicial */
  amplitude?: number;
  /** cor da linha da mente */
  tom?: "tinta" | "areia";
  altura?: string;
  className?: string;
  rotulos?: boolean;
};

/**
 * As duas linhas: corpo (terracota) e mente (tinta).
 * Começam fora de fase e se afinam. A amplitude é controlada pela variável CSS --amp.
 */
export const Afinacao = forwardRef<HTMLDivElement, Props>(function Afinacao(
  { modo = "estatico", amplitude = 1, tom = "tinta", altura, className = "", rotulos = false },
  ref,
) {
  const pequeno = useMenorQue(640);
  const ciclos = pequeno ? 3 : 7;
  const amp = pequeno ? 26 : 34;
  const d = onda(ciclos, amp);
  const largura = ciclos * LAMBDA;
  const corMente = tom === "areia" ? "#EEE8DE" : "#1F2638";

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`afinacao relative ${className}`}
      style={{ ["--amp" as string]: amplitude, ["--fase-ini" as string]: modo === "afinar" ? `${-LAMBDA / 2}px` : "0px" }}
    >
      <svg
        viewBox={`0 0 ${largura} 100`}
        preserveAspectRatio="none"
        className="block w-full overflow-hidden"
        style={{ height: altura ?? (pequeno ? "64px" : "104px") }}
        focusable="false"
      >
        <g className="onda">
          <path
            className={modo === "afinar" ? "corpo" : ""}
            style={modo === "estatico" ? { transform: "translateY(2.2px)" } : undefined}
            d={d}
            fill="none"
            stroke="#B5532F"
            strokeWidth={1.25}
            vectorEffect="non-scaling-stroke"
          />
          <path
            className={modo === "afinar" ? "mente" : ""}
            d={d}
            fill="none"
            stroke={corMente}
            strokeWidth={1.25}
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>
      {rotulos && (
        <div className="pointer-events-none absolute -top-1 left-0 flex gap-5 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em]">
          <span className="text-terracota-esc">corpo</span>
          <span className={tom === "areia" ? "text-areia" : "text-tinta"}>mente</span>
        </div>
      )}
    </div>
  );
});

/** Divisor reto: a linha já calma, que se desenha da esquerda para a direita. */
export function Fio({ tom = "tinta", className = "" }: { tom?: "tinta" | "areia"; className?: string }) {
  const ref = useVisto<HTMLDivElement>("0px 0px -8% 0px");
  return (
    <div ref={ref} aria-hidden="true" className={`fio ${className}`}>
      <div className={tom === "areia" ? "h-px bg-areia/60" : "h-px bg-tinta"} />
      <div className="mt-[1.5px] h-px bg-terracota" />
    </div>
  );
}
