import { useEffect, useState } from 'react'
import { telLink, waLink } from '../lib/links'
import { IconPhone, IconWhatsApp } from './Icons'

/** Botão flutuante discreto (desktop) e barra fixa no celular. Aparecem depois do hero. */
export function FloatingWhatsApp() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const vis = show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
  return (
    <>
      <a
        href={waLink()}
        target="_blank"
        rel="noopener"
        aria-label="Agendar avaliação pelo WhatsApp"
        tabIndex={show ? undefined : -1}
        className={`group fixed bottom-6 right-6 z-40 hidden items-center gap-3 rounded-full bg-accent py-3 pl-4 pr-5 text-sm font-semibold text-white shadow-[0_12px_30px_-12px_rgba(22,58,67,0.6)] transition-[opacity,transform,background-color] duration-500 hover:bg-accent-deep md:inline-flex ${vis}`}
      >
        <IconWhatsApp size={20} />
        <span>Agendar avaliação</span>
      </a>

      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/95 px-4 pt-3 backdrop-blur-md transition-[opacity,transform] duration-500 md:hidden ${vis}`}
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      >
        <div className="flex gap-3">
          <a href={waLink()} target="_blank" rel="noopener" tabIndex={show ? undefined : -1} className="btn btn-primary flex-1">
            <IconWhatsApp size={19} />
            Agendar pelo WhatsApp
          </a>
          <a
            href={telLink}
            tabIndex={show ? undefined : -1}
            aria-label="Ligar para o consultório"
            className="btn btn-ghost !px-0 w-12 shrink-0"
          >
            <IconPhone size={19} />
          </a>
        </div>
      </div>
    </>
  )
}
