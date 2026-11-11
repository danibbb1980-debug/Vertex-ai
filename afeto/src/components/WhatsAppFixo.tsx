import { useEffect, useState } from 'react'
import { linkWhatsApp } from '../lib/dados'
import { IconeWhatsApp } from './Icones'

/** Botão flutuante (desktop) e barra fixa (celular). Aparecem depois do hero. */
export function WhatsAppFixo() {
  const [visivel, setVisivel] = useState(false)
  useEffect(() => {
    const aoRolar = () => setVisivel(window.scrollY > window.innerHeight * 0.6)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])
  const zap = linkWhatsApp()
  if (!zap) return null
  const anim = `transition-[transform,opacity] duration-500 ${visivel ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'}`
  return (
    <>
      <a
        href={zap}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Agendar pelo WhatsApp (abre em nova aba)"
        tabIndex={visivel ? 0 : -1}
        className={`fixed bottom-6 right-6 z-30 hidden size-16 items-center justify-center rounded-full rounded-br-md bg-terracota-texto text-papel shadow-[0_6px_20px_-8px_rgba(58,42,34,0.6)] hover:bg-tinta lg:flex ${anim}`}
      >
        <IconeWhatsApp className="size-7" />
      </a>
      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-fio bg-creme/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm lg:hidden ${anim}`}
      >
        <a href={zap} target="_blank" rel="noopener noreferrer" tabIndex={visivel ? 0 : -1} className="botao botao-primario w-full">
          <IconeWhatsApp /> Agendar pelo WhatsApp
        </a>
      </div>
    </>
  )
}
