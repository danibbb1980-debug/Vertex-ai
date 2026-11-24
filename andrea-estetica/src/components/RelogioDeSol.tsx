import { useEffect, useState } from "react";
import { CONFIG } from "../config";
import { escala, status, type Status } from "../tempo";

/**
 * Momento de assinatura: um relógio de sol em meia-volta (08 a 21).
 * A haste parte da marca das 08 e desliza (só transform) até a hora atual em
 * São Paulo; fora do expediente, pousa na próxima abertura.
 */
const W = 400;
const H = 230;
const CX = W / 2;
const CY = 206;
const R = 168;

export default function RelogioDeSol({ className = "" }: { className?: string }) {
  const { ini, fim } = escala();
  const [st, setSt] = useState<Status>(() => status());
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Dois frames: garante que a posição inicial (08) foi pintada antes de mover.
    let id2 = 0;
    const id = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => setPronto(true));
    });
    if (reduz) setPronto(true);
    const t = window.setInterval(() => setSt(status()), 60_000);
    return () => {
      cancelAnimationFrame(id);
      cancelAnimationFrame(id2);
      clearInterval(t);
    };
  }, []);

  // 08 = 180° (esquerda), 21 = 360° (direita).
  const ang = (h: number) => 180 + ((h - ini) / (fim - ini)) * 180;
  const pt = (a: number, r: number) => {
    const rad = (a * Math.PI) / 180;
    return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
  };
  const giro = ang(Math.min(Math.max(st.hasteEm, ini), fim)) - 180;

  const marcas = [];
  for (let h = ini; h <= fim; h++) {
    const a = ang(h);
    const [x1, y1] = pt(a, R);
    const [x2, y2] = pt(a, R - (h % 3 === 2 ? 14 : 8));
    const [tx, ty] = pt(a, R + 16);
    marcas.push(
      <g key={h}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1" />
        <text
          x={tx}
          y={ty}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="10.5"
          fill="currentColor"
          style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "0.04em" }}
        >
          {String(h).padStart(2, "0")}
        </text>
      </g>,
    );
  }

  // Cunha de sombra: um setor estreito atrás da haste, apontando para 180°.
  const [sx1, sy1] = pt(180, R - 22);
  const [sx2, sy2] = pt(187, R - 30);

  return (
    <figure className={className} aria-labelledby="relogio-status">
      <svg
        viewBox={`0 -14 ${W} ${H + 14}`}
        className="w-full h-auto text-grafite overflow-visible"
        role="img"
        aria-label={`Relógio de sol do expediente, das ${String(ini).padStart(2, "0")} às ${fim} horas. ${st.texto}.`}
      >
        <path
          d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line x1={CX - R - 12} y1={CY} x2={CX + R + 12} y2={CY} stroke="currentColor" strokeWidth="1" />
        {marcas}
        <g
          style={{
            transformOrigin: `${CX}px ${CY}px`,
            transformBox: "view-box",
            transform: `rotate(${pronto ? giro : 0}deg)`,
            transition: "transform 2.5s cubic-bezier(0.33, 0, 0.12, 1)",
          }}
        >
          <path
            d={`M ${CX} ${CY} L ${sx1} ${sy1} L ${sx2} ${sy2} Z`}
            fill="var(--color-ardosia)"
            opacity="0.16"
          />
          <line
            x1={CX}
            y1={CY}
            x2={CX - (R - 22)}
            y2={CY}
            stroke="var(--color-ocre)"
            strokeWidth="2.25"
            strokeLinecap="square"
          />
          <circle cx={CX - (R - 22)} cy={CY} r="3" fill="var(--color-ocre)" />
        </g>
        <circle cx={CX} cy={CY} r="4.5" fill="var(--color-grafite)" />
      </svg>
      <figcaption className="mt-5 flex flex-col items-start gap-1 sm:items-center">
        <span id="relogio-status" className="flex items-center gap-2.5 text-[1.02rem] font-medium" aria-live="polite">
          <span
            aria-hidden="true"
            className={`inline-block size-2 ${st.aberto ? "bg-ocre" : "border border-grafite"}`}
          />
          {st.texto}
        </span>
        <span className="text-sm text-cinza">
          {CONFIG.horarios.aviso}
        </span>
      </figcaption>
    </figure>
  );
}
