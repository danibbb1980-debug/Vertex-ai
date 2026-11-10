import { CONFIG } from "../config";

export function DraftBanner() {
  if (!CONFIG.rascunho) return null;
  return (
    <div role="note" className="fixed inset-x-0 top-0 z-50 flex h-8 items-center justify-center bg-petroleo-950 px-4 text-center text-[0.72rem] font-medium sm:text-[0.8rem] text-white/90">
      <span>Rascunho para avaliação. Informações sujeitas a confirmação.</span>
    </div>
  );
}
