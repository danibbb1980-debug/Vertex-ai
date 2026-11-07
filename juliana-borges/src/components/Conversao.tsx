import { useEffect, useState } from 'react'
import { CONFIG } from '../config'
import { linkWhatsApp } from '../lib/utils'
import { IconeWhatsApp } from './ui'

/** Botão flutuante (desktop) e barra fixa (celular). Aparecem depois do hero. */
export function Conversao() {
  const [visivel, setVisivel] = useState(false)
  const [ocultarBarra, setOcultarBarra] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisivel(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    // some quando o formulário ou o CTA final estão na tela (evita botões duplicados)
    const alvos = ['#agendar', '#cta-final'].map((s) => document.querySelector(s)).filter(Boolean) as Element[]
    const vis = new Map<Element, boolean>()
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => vis.set(e.target, e.isIntersecting))
      setOcultarBarra([...vis.values()].some(Boolean))
    })
    alvos.forEach((a) => io.observe(a))
    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
    }
  }, [])

  if (!CONFIG.whatsapp) return null
  const mostrar = visivel && !ocultarBarra
  const href = linkWhatsApp()

  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Agendar pelo WhatsApp (abre em nova aba)"
        tabIndex={mostrar ? 0 : -1}
        aria-hidden={!mostrar}
        className={`fixed bottom-6 right-6 z-40 hidden size-14 items-center justify-center rounded-full bg-choco text-creme shadow-[0_14px_30px_-12px_rgb(42_27_21/0.6)] transition-[opacity,transform] duration-500 hover:bg-ouro-esc md:inline-flex ${
          mostrar ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <IconeWhatsApp className="size-6" />
      </a>

      {/* Barra do celular: o espaço dela é reservado no rodapé para não cobrir conteúdo */}
      <div
        aria-hidden={!mostrar}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-choco/10 bg-creme/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-[opacity,transform] duration-500 md:hidden ${
          mostrar ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
        }`}
      >
        <a href={href} target="_blank" rel="noopener noreferrer" tabIndex={mostrar ? 0 : -1} className="btn btn-primario w-full">
          <IconeWhatsApp className="size-5" /> Agendar pelo WhatsApp
        </a>
      </div>
    </>
  )
}
