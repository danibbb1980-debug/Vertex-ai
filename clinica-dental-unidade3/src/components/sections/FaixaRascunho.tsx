import { CONFIG } from "../../config";

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null;
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-8 items-center justify-center bg-navy-950 px-3 text-center text-[0.66rem] font-medium text-gold-300 sm:text-xs sm:tracking-[0.04em]"
    >
      <span className="mr-2 hidden size-1.5 rotate-45 bg-gold-400 sm:inline-block" aria-hidden="true" />
      {CONFIG.textoRascunho}
    </div>
  );
}
