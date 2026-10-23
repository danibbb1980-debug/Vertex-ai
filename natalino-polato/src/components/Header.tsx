import { useEffect, useState } from 'react'
import { m as motion, useScroll, useSpring } from 'motion/react'
import { CONFIG, whatsappUrl } from '../config'
import { WhatsAppIcon } from './ui'

const LINKS = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#atuacao', label: 'Atuação' },
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#duvidas', label: 'Dúvidas' },
  { href: '#contato', label: 'Contato' },
]

export function Signature({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <img src={CONFIG.logo.monograma} alt="" width={52} height={40} className="h-10 w-auto" />
      <span className="flex flex-col leading-none">
        <span className="display text-[1.3rem] text-ivory">{CONFIG.nome}</span>
        <span className="label mt-1.5 text-[0.6rem] text-mist">{CONFIG.profissao}</span>
      </span>
    </span>
  )
}

export function DraftBanner() {
  if (!CONFIG.rascunho) return null
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-8 items-center justify-center bg-bronze px-4 whitespace-nowrap text-center text-[0.64rem] font-medium text-ink sm:text-[0.72rem] sm:tracking-wide"
    >
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  )
}

export function Header() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const bg = solid || open ? 'bg-ink/95 backdrop-blur-md border-line-dark' : 'bg-transparent border-transparent'

  return (
    <header className={`fixed inset-x-0 z-50 border-b transition-colors duration-500 ${bg}`} style={{ top: 'var(--banner-h, 0px)' }}>
      <div className="wrap flex h-[4.5rem] items-center justify-between gap-6">
        <a href="#inicio" className="shrink-0" aria-label={`${CONFIG.nome}, ${CONFIG.profissao}. Ir para o início`}>
          <Signature />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="relative text-[0.9rem] text-mist transition-colors duration-300 hover:text-ivory after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-bronze after:transition-transform after:duration-500 hover:after:scale-x-100">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 border border-bronze/70 px-5 py-2.5 text-[0.85rem] font-medium text-ivory transition-colors duration-300 hover:bg-bronze hover:text-ink sm:inline-flex"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" />
            Entrar em contato
          </a>
          <button
            type="button"
            className="grid h-11 w-11 cursor-pointer place-items-center text-ivory lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movel"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" className="relative block h-3 w-6">
              <span className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
            </span>
          </button>
        </div>
      </div>

      <motion.div aria-hidden="true" className="absolute inset-x-0 -bottom-px h-px origin-left bg-bronze/70" style={{ scaleX: progress }} />

      <div
        id="menu-movel"
        hidden={!open}
        className="h-[calc(100dvh-4.5rem-var(--banner-h,0px))] overflow-y-auto border-t border-line-dark bg-ink lg:hidden"
      >
        <nav aria-label="Menu" className="wrap py-8">
          <ul>
            {LINKS.map((l, i) => (
              <li key={l.href} className="border-b border-line-dark">
                <a href={l.href} onClick={() => setOpen(false)} className="flex items-baseline gap-5 py-5">
                  <span className="label tabular-nums text-bronze">{String(i + 1).padStart(2, '0')}</span>
                  <span className="display text-[2rem] text-ivory">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 bg-bronze px-5 py-4 text-[0.95rem] font-medium text-ink"
          >
            <WhatsAppIcon />
            Entrar em contato
          </a>
          <p className="label mt-6 text-center text-mist">{CONFIG.oab}</p>
        </nav>
      </div>
    </header>
  )
}
