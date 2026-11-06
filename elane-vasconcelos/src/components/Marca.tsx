import { cn } from "../lib/cn";
import { CONFIG } from "../config";

/** Monograma EV dentro de uma argola fina (marca provisória). */
export function Monograma({ className, escuro = false }: { className?: string; escuro?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" strokeLinecap="round" aria-hidden="true" className={className}>
      <path d="M54.21 13.36A29 29 0 1 1 46.5 6.89" stroke={escuro ? "#C9A97C" : "#B8956A"} strokeWidth="1.1" />
      <circle cx="54.21" cy="13.36" r="1.9" fill={escuro ? "#C9A97C" : "#B8956A"} />
      <g stroke={escuro ? "#F2E0DB" : "#7A3E48"}>
        <path d="M22 21V43" strokeWidth="1.9" />
        <path d="M22 21H30.5M22 32H28.6M22 43H31" strokeWidth="1" />
        <path d="M31.6 21L37.6 43" strokeWidth="1.9" />
        <path d="M37.6 43L43.6 21" strokeWidth="1" />
      </g>
    </svg>
  );
}

export function Marca({ escuro = false, className }: { escuro?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Monograma escuro={escuro} className="h-10 w-10 shrink-0 sm:h-11 sm:w-11" />
      <span className="flex flex-col leading-none">
        <span className={cn("font-serif text-[1.3rem] sm:text-[1.45rem] font-medium tracking-[0.01em]", escuro ? "text-marfim" : "text-cacau")}>
          {CONFIG.marca.nome}
        </span>
        <span className={cn("mt-1 whitespace-nowrap text-[0.56rem] font-medium uppercase tracking-[0.14em] sm:text-[0.6rem] sm:tracking-[0.26em]", escuro ? "text-ouro-claro" : "text-ouro-tinta")}>
          Estética · Furo de orelha infantil
        </span>
      </span>
    </span>
  );
}
