import { site } from "@/lib/site-data";

/** Faixa fixa de rascunho. Liga e desliga por site.rascunho (lib/site-data.ts). */
export function DraftBanner() {
  if (!site.rascunho) return null;
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-7 items-center justify-center border-b border-orange/40 bg-graphite px-4 text-center text-[0.7rem] font-medium text-mist sm:text-xs"
    >
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  );
}
