import { CONFIG } from "../config";
import { PROFILE_D, PROFILE_VIEWBOX } from "../lib/profile";

type Props = { tom: "claro" | "escuro"; variante?: "linha" | "bloco"; className?: string };

/** Marca do perfil, recriada em SVG. */
export function Marca({ cor, className = "" }: { cor: string; className?: string }) {
  return (
    <svg viewBox={PROFILE_VIEWBOX} className={className} aria-hidden="true" focusable="false">
      <path d={PROFILE_D} fill="none" stroke={cor} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Logotipo recriado: perfil + "Clinic Sculpt" + descritor.
 * Se CONFIG.logo estiver preenchido, usa o arquivo original.
 * tom "claro" = para fundo claro (azul-tinta); "escuro" = para fundo escuro (champanhe).
 */
export default function Logotipo({ tom, variante = "linha", className = "" }: Props) {
  const corMarca = tom === "claro" ? "var(--color-tinta)" : "var(--color-champanhe)";
  const corTexto = tom === "claro" ? "text-tinta" : "text-champanhe";
  const corDesc = tom === "claro" ? "text-ardosia" : "text-nevoa";

  if (CONFIG.logo) {
    return <img src={CONFIG.logo} alt={`${CONFIG.nome} · ${CONFIG.descritor}`} className={className} />;
  }

  if (variante === "bloco") {
    return (
      <span className={`inline-flex flex-col items-center ${className}`}>
        <Marca cor={corMarca} className="h-24 w-auto translate-x-[18%]" />
        <span className={`mt-3 font-sans text-[30px] font-light leading-none tracking-[0.2em] ${corTexto}`}>
          {CONFIG.nome}
        </span>
        <span className={`mt-2 text-[10.5px] uppercase leading-none tracking-[0.42em] ${corDesc}`}>
          {CONFIG.descritor}
        </span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Marca cor={corMarca} className="h-10 w-auto shrink-0" />
      <span className="flex flex-col">
        <span className={`font-sans text-[19px] font-light leading-none tracking-[0.17em] ${corTexto}`}>
          {CONFIG.nome}
        </span>
        <span className={`mt-1.5 text-[8.5px] uppercase leading-none tracking-[0.34em] ${corDesc}`}>
          {CONFIG.descritor}
        </span>
      </span>
    </span>
  );
}
