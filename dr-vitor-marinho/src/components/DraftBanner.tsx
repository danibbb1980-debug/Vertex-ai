import { CONFIG } from '../config'

export function DraftBanner() {
  if (!CONFIG.rascunho) return null
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-8 items-center justify-center bg-night px-4 text-center text-[0.64rem] font-medium tracking-[0.01em] whitespace-nowrap sm:text-[0.72rem] sm:tracking-[0.04em] text-paper/90"
    >
      <span aria-hidden="true" className="mr-2 inline-block size-1.5 bg-teal" />
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  )
}
