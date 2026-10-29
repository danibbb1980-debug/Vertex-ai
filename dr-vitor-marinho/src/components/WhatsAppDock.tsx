import { useEffect, useState } from 'react'
import { waLink } from '../lib/whatsapp'
import { cn } from '../lib/cn'
import { IconWhatsApp } from './Icons'

/** Celular: barra fixa inferior. Desktop: botão flutuante discreto. Aparecem depois do hero. */
export function WhatsAppDock() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.6)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <>
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-ivory/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-transform duration-500 md:hidden',
          show ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn-primary w-full" tabIndex={show ? 0 : -1}>
          <IconWhatsApp className="size-5" />
          Agendar pelo WhatsApp
        </a>
      </div>
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar pelo WhatsApp"
        tabIndex={show ? 0 : -1}
        className={cn(
          'fixed bottom-6 right-6 z-40 hidden size-14 items-center justify-center bg-teal-deep text-paper shadow-[0_8px_24px_-12px_rgba(15,36,32,0.5)] transition-[opacity,transform,background-color] duration-500 hover:bg-teal-ink md:inline-flex',
          show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
        )}
      >
        <IconWhatsApp className="size-6" />
      </a>
    </>
  )
}
