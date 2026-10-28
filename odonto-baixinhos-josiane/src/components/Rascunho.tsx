import { CONFIG } from "../config";

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null;
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-8 items-center justify-center border-b border-linha bg-marfim-2 px-2 text-center text-[0.68rem] font-semibold text-tinta-2 sm:px-4 sm:text-[0.72rem] sm:tracking-wide"
    >
      <span className="mr-2 hidden h-1.5 w-1.5 shrink-0 rounded-full bg-ouro sm:inline-block" aria-hidden="true" />
      <span className="truncate">Rascunho para avaliação. Informações sujeitas a confirmação.</span>
    </div>
  );
}
