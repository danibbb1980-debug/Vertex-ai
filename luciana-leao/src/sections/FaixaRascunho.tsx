import { CONFIG } from '../config'

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null
  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex h-8 items-center justify-center bg-grafite px-4 text-center text-[0.7rem] font-medium leading-tight sm:text-[0.78rem] sm:tracking-wide text-pedra">
      <p>Rascunho para avaliação. Informações sujeitas a confirmação.</p>
    </div>
  )
}
