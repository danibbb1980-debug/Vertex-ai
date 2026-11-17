import { CONFIG } from "../config";

type Props = { tom?: "claro" | "escuro"; compacto?: boolean; className?: string };

/** Monograma FV desenhado a partir do nome; o traço direito do V sobe como um tick de régua. */
export function Monograma({ tinta, latao, className }: { tinta: string; latao: string; className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <g fill={tinta}>
        <rect x="5" y="9" width="3.4" height="23" />
        <rect x="5" y="9" width="11.5" height="1.6" />
        <rect x="5" y="19.4" width="8.6" height="1.4" />
        <rect x="3.4" y="31" width="6.6" height="1" />
      </g>
      <path d="M17.6 9 L26 32" stroke={tinta} strokeWidth="3.4" />
      <path d="M26 32 L33.4 9" stroke={tinta} strokeWidth="1.2" />
      <path d="M15.8 9.5 H20.4" stroke={tinta} strokeWidth="1" />
      <path d="M33.4 9 V1.5" stroke={latao} strokeWidth="1.2" />
      <path d="M31.6 5 H33.4 M32.4 1.5 H33.4" stroke={latao} strokeWidth="0.8" />
    </svg>
  );
}

export default function Logo({ tom = "claro", compacto, className = "" }: Props) {
  if (CONFIG.logo) return <img src={CONFIG.logo} alt={CONFIG.nome} className={`h-10 w-auto ${className}`} />;
  const escuro = tom === "escuro";
  const tinta = escuro ? "#f4f0e6" : "#16211b";
  const latao = escuro ? "#b39553" : "#8a7034";
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Monograma tinta={tinta} latao={latao} className="h-10 w-10 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.3rem] tracking-[-0.01em]" style={{ color: tinta }}>
          {CONFIG.nome}
        </span>
        {!compacto && (
          <span className="mt-1.5 font-mono text-[0.6rem] tracking-[0.2em] uppercase" style={{ color: escuro ? "#cfc6b2" : "#5f5a50" }}>
            {CONFIG.profissao} · {CONFIG.registro}
          </span>
        )}
      </span>
    </span>
  );
}
