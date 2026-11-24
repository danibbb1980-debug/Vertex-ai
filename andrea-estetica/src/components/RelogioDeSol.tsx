import { useEffect, useRef, useState } from "react";
import { CONFIG } from "../config";
import { agoraSP, escala, horaNum, status, type Status } from "../tempo";

/**
 * Momento de assinatura: o relógio de sol como paisagem.
 * Um arco de horizonte a horizonte (08 a 21), com marcas de 15 em 15 minutos.
 * O trecho do expediente de hoje é mais grosso. A haste (e o "sol" na ponta)
 * parte das 08 e desliza até a hora atual em São Paulo; fora do expediente,
 * pousa na próxima abertura. Animação só de transform, via atributo rotate.
 */

type Geo = { w: number; h: number; rx: number; ry: number; fs: number; sol: number; base: number };
const LARGO: Geo = { w: 1200, h: 392, rx: 548, ry: 330, fs: 21, sol: 15, base: 372 };
const ESTREITO: Geo = { w: 400, h: 268, rx: 168, ry: 200, fs: 12.5, sol: 11, base: 250 };

function useGiro(alvo: number) {
  const [g, setG] = useState(0);
  const atual = useRef(0);
  useEffect(() => {
    const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduz) {
      atual.current = alvo;
      setG(alvo);
      return;
    }
    const de = atual.current;
    const dur = 2500;
    let ini = 0;
    let raf = 0;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3.2);
    const passo = (ts: number) => {
      if (!ini) ini = ts;
      const t = Math.min(1, (ts - ini) / dur);
      const v = de + (alvo - de) * ease(t);
      atual.current = v;
      setG(v);
      if (t < 1) raf = requestAnimationFrame(passo);
    };
    // Espera um frame para a posição 08 ser pintada antes de mover.
    raf = requestAnimationFrame(() => (raf = requestAnimationFrame(passo)));
    return () => cancelAnimationFrame(raf);
  }, [alvo]);
  return g;
}

function Arco({ geo, giro, hoje, className }: { geo: Geo; giro: number; hoje: [number, number] | null; className: string }) {
  const { ini, fim } = escala();
  const cx = geo.w / 2;
  const cy = geo.base;
  const ang = (h: number) => Math.PI + ((h - ini) / (fim - ini)) * Math.PI;
  const pt = (h: number, k: number) => {
    const a = ang(h);
    return [cx + k * geo.rx * Math.cos(a), cy + k * geo.ry * Math.sin(a)] as const;
  };
  const arcoEntre = (h1: number, h2: number) => {
    const [x1, y1] = pt(h1, 1);
    const [x2, y2] = pt(h2, 1);
    return `M ${x1} ${y1} A ${geo.rx} ${geo.ry} 0 0 1 ${x2} ${y2}`;
  };

  const marcas = [];
  for (let q = ini * 4; q <= fim * 4; q++) {
    const h = q / 4;
    const cheia = q % 4 === 0;
    const [x1, y1] = pt(h, 1);
    const [x2, y2] = pt(h, cheia ? 0.93 : 0.975);
    marcas.push(
      <line key={q} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeOpacity={cheia ? 1 : 0.45} strokeWidth="1" />,
    );
    if (cheia) {
      const [tx, ty] = pt(h, 1.085);
      marcas.push(
        <text
          key={`t${q}`}
          x={tx}
          y={ty}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={geo.fs}
          fill="currentColor"
          fontFamily="var(--font-display)"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {String(h).padStart(2, "0")}
        </text>,
      );
    }
  }

  const k = geo.ry / geo.rx;
  const L = geo.rx;
  // cunha de sombra (no espaço não escalado do grupo)
  const w1 = [-(L * 0.86), 0];
  const a2 = (183 * Math.PI) / 180;
  const w2 = [L * 0.8 * Math.cos(a2), L * 0.8 * Math.sin(a2)];

  return (
    <svg viewBox={`0 -8 ${geo.w} ${geo.h + 8}`} className={`${className} h-auto w-full overflow-visible text-grafite`} aria-hidden="true">
      <path d={arcoEntre(ini, fim)} fill="none" stroke="currentColor" strokeWidth="1" />
      {hoje && <path d={arcoEntre(hoje[0], hoje[1])} fill="none" stroke="currentColor" strokeWidth="3.5" />}
      {marcas}
      <line x1="0" y1={cy} x2={geo.w} y2={cy} stroke="currentColor" strokeWidth="1" />
      <g transform={`translate(${cx} ${cy}) scale(1 ${k})`}>
        <g transform={`rotate(${giro})`}>
          <path d={`M 0 0 L ${w1[0]} ${w1[1]} L ${w2[0]} ${w2[1]} Z`} fill="var(--color-ardosia)" opacity="0.1" />
          <line x1="0" y1="0" x2={-(L * 0.965)} y2="0" stroke="var(--color-ocre)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          {/* "sol": linha de comprimento zero com ponta redonda = círculo que não deforma */}
          <line
            x1={-L}
            y1="0"
            x2={-L}
            y2="0.001"
            stroke="var(--color-ocre)"
            strokeWidth={geo.sol}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </g>
      <rect x={cx - 5} y={cy - 5} width="10" height="10" fill="var(--color-grafite)" />
    </svg>
  );
}

export default function RelogioDeSol({ className = "" }: { className?: string }) {
  const { ini, fim } = escala();
  const [st, setSt] = useState<Status>(() => status());
  useEffect(() => {
    const t = window.setInterval(() => setSt(status()), 60_000);
    return () => clearInterval(t);
  }, []);
  const giro = useGiro(((Math.min(Math.max(st.hasteEm, ini), fim) - ini) / (fim - ini)) * 180);
  const f = CONFIG.horarios.dias[agoraSP().dia];
  const hoje: [number, number] | null = f ? [horaNum(f.abre), horaNum(f.fecha)] : null;

  return (
    <figure className={className} aria-labelledby="relogio-status">
      <div role="img" aria-label={`Relógio de sol do expediente, das 08 às ${fim} horas. ${st.texto}.`}>
        <Arco geo={ESTREITO} giro={giro} hoje={hoje} className="block sm:hidden" />
        <Arco geo={LARGO} giro={giro} hoje={hoje} className="hidden sm:block" />
      </div>
      <figcaption className="mt-4 flex flex-col items-center gap-1 text-center">
        <span id="relogio-status" className="flex items-center gap-2.5 text-[1.05rem] font-medium" aria-live="polite">
          <span aria-hidden="true" className={`inline-block size-2.5 rounded-full ${st.aberto ? "bg-ocre" : "border border-grafite"}`} />
          {st.texto}
        </span>
        <span className="text-sm text-cinza">
          {hoje ? "O traço grosso no arco é o horário de hoje. " : ""}
          {CONFIG.horarios.aviso}
        </span>
      </figcaption>
    </figure>
  );
}
