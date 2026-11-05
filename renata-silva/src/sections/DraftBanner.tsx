import { CONFIG } from "../config";

export function DraftBanner() {
  if (!CONFIG.rascunho) return null;
  return (
    <aside
      aria-label="Aviso de rascunho"
      className="fixed inset-x-0 top-0 z-50 flex h-[var(--banner-h)] items-center justify-center bg-navy-950 px-4 text-center font-label text-[0.72rem] leading-tight tracking-[0.06em] text-rose-200 sm:text-xs sm:tracking-[0.12em]"
    >
      <span>Rascunho para avaliação. Informações sujeitas a confirmação.</span>
    </aside>
  );
}
