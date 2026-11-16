import { CONFIG } from "../config";
import { Hair } from "./hair";

/** Logotipo recriado: "Pe" + dois fios no lugar do "ll" + "oFinn". */
export default function Logo({ escuro = false, descritor = true, className = "" }: { escuro?: boolean; descritor?: boolean; className?: string }) {
  if (CONFIG.logo) {
    return <img src={CONFIG.logo} alt={`${CONFIG.nome} | ${CONFIG.descritor}`} className={className} />;
  }
  const cor = escuro ? "var(--color-marfim)" : "var(--color-vermelho-texto)";
  const fio = escuro ? "var(--color-fio-claro)" : "var(--color-fio)";
  return (
    <span className={`inline-flex flex-col leading-none ${className}`} role="img" aria-label={`${CONFIG.nome} | ${CONFIG.descritor}`}>
      <span className="flex items-end font-display font-medium tracking-[-0.02em]" style={{ color: cor, fontSize: "1em" }} aria-hidden="true">
        <span>Pe</span>
        <svg viewBox="-3 -128 40 132" style={{ height: "1.18em", width: "0.36em", marginBottom: "0.04em", overflow: "visible" }} focusable="false">
          <g transform="translate(6 0)"><Hair h={124} w={7} curva={20} cor={fio} /></g>
          <g transform="translate(22 0)"><Hair h={124} w={7} curva={20} cor={fio} /></g>
        </svg>
        <span>oFinn</span>
      </span>
      {descritor && (
        <span
          className="font-display italic mt-[0.28em] whitespace-nowrap"
          style={{ fontSize: "0.27em", letterSpacing: "0.01em", color: escuro ? "var(--color-marfim)" : "var(--color-grafite-2)" }}
          aria-hidden="true"
        >
          {CONFIG.descritor}
        </span>
      )}
    </span>
  );
}
