import { CONFIG } from "../config";

/** Faixa fixa e discreta de rascunho. Controlada por CONFIG.rascunho. */
export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null;
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-[var(--faixa-h)] items-center justify-center gap-2 bg-noite px-4 text-center text-[0.7rem] leading-tight tracking-[0.04em] text-champanhe sm:text-[0.74rem]"
    >
      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-champanhe/80" />
      <span>
        <strong className="font-semibold text-marfim">Rascunho para avaliação.</strong>{" "}
        <span className="hidden min-[400px]:inline">Informações sujeitas a confirmação.</span>
        <span className="min-[400px]:hidden">Sujeito a confirmação.</span>
      </span>
    </div>
  );
}
