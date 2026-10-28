import { CONFIG } from '../config'

export function DraftBanner() {
  if (!CONFIG.rascunho) return null
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-8 items-center justify-center border-b border-ink/10 bg-sand px-4 text-center text-[0.68rem] font-semibold tracking-[0.01em] text-ink-2 sm:text-[0.72rem] sm:tracking-[0.06em]"
    >
      <span className="line-clamp-1">{CONFIG.textoRascunho}</span>
    </div>
  )
}
