import { MONOGRAMA_PATH } from "../lib/monograma";
import { CONFIG } from "../config";

export function Monograma({ className = "", strokeWidth = 2.2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <path
        d={MONOGRAMA_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ escuro = false, compacto = false }: { escuro?: boolean; compacto?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${escuro ? "text-porcelana" : "text-ameixa"}`}>
      <Monograma className={compacto ? "size-9" : "size-11"} />
      <span className="flex flex-col leading-none">
        <span className={`font-serif ${compacto ? "text-[1.2rem]" : "text-[1.4rem]"} tracking-[-0.01em]`}>
          {CONFIG.marca.nome}
        </span>{" "}
        <span
          className={`mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.34em] ${escuro ? "text-[#c9d3c6]" : "text-salvia-texto"}`}
        >
          {CONFIG.marca.descritor}
        </span>
      </span>
    </span>
  );
}
