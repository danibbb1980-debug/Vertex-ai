import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { CONFIG } from '../config'
import { useUnidade } from '../context/unidade'
import { linkGeral } from '../lib/whatsapp'
import { IconeWhatsapp } from './Marcas'
import { Logo } from './Logo'

export interface LinkNav {
  href: string
  rotulo: string
}

function SeletorUnidade({ id }: { id: string }) {
  const { unidade, setUnidadeId, multiplas } = useUnidade()
  if (!multiplas) return null
  return (
    <label className="flex items-center gap-3 text-sm text-teal-900">
      <span>Unidade</span>
      <select
        id={id}
        value={unidade.id}
        onChange={(e) => setUnidadeId(e.target.value)}
        className="campo !min-h-9 !w-auto !rounded-full !py-1 !pl-4 !text-sm"
      >
        {CONFIG.unidades.map((u) => (
          <option key={u.id} value={u.id}>
            {u.rotulo}
          </option>
        ))}
      </select>
    </label>
  )
}

export function Topo({ links }: { links: LinkNav[] }) {
  const { unidade, multiplas } = useUnidade()
  const [rolou, setRolou] = useState(false)
  const [aberto, setAberto] = useState(false)
  const botaoRef = useRef<HTMLButtonElement>(null)
  const painelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fn = () => setRolou(window.scrollY > 24)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    if (!aberto) return
    document.body.style.overflow = 'hidden'
    painelRef.current?.querySelector<HTMLElement>('a, select, button')?.focus()
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAberto(false)
        botaoRef.current?.focus()
      }
    }
    window.addEventListener('keydown', tecla)
    const mq = window.matchMedia('(min-width: 1280px)')
    const fecha = () => mq.matches && setAberto(false)
    mq.addEventListener('change', fecha)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', tecla)
      mq.removeEventListener('change', fecha)
    }
  }, [aberto])

  const solido = rolou || aberto

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      {CONFIG.rascunho && (
        <p className="bg-teal-950 px-4 py-1.5 text-center text-[0.8125rem] leading-snug text-aqua-100">
          Rascunho para avaliação. Informações sujeitas a confirmação.
        </p>
      )}
      {multiplas && (
        <div className="border-b border-teal-800/10 bg-aqua-100">
          <div className="container-site flex min-h-12 items-center justify-end py-1.5">
            <SeletorUnidade id="unidade-topo" />
          </div>
        </div>
      )}
      <header
        className={`transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          solido
            ? 'bg-white/90 shadow-[0_1px_0_rgb(27_77_82/0.08),0_12px_32px_-24px_rgb(19_63_68/0.5)] backdrop-blur-md'
            : 'bg-transparent'
        }`}
      >
        <div className="container-site flex h-[4.5rem] items-center justify-between gap-4">
          <a href="#inicio" className="flex shrink-0 items-center gap-3 rounded-xl">
            <Logo tamanho={56} prioridade className="shrink-0 shadow-[0_0_0_1px_rgb(27_77_82/0.08)]" />
            <span className="block whitespace-nowrap leading-tight">
              <span className="block font-display text-lg text-teal-800">{CONFIG.nome}</span>
              <span className="rotulo block !text-[0.625rem] !tracking-[0.24em] text-teal-700">{unidade.rotulo}</span>
              <span className="sr-only"> (início)</span>
            </span>
          </a>

          <nav aria-label="Principal" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="relative whitespace-nowrap rounded-full px-2.5 py-2 text-[0.95rem] font-medium xl:px-3 text-ink-soft transition-colors hover:text-teal-800 after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-teal-600 after:transition-transform after:duration-500 hover:after:scale-x-100"
                  >
                    {l.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={linkGeral(unidade)}
              target="_blank"
              rel="noopener"
              className="btn btn-primario hidden whitespace-nowrap !min-h-11 !px-5 !text-[0.95rem] sm:inline-flex"
            >
              <IconeWhatsapp size={18} />
              Agendar avaliação
            </a>
            <button
              ref={botaoRef}
              type="button"
              className="grid h-12 w-12 place-items-center rounded-full text-teal-800 hover:bg-aqua-100 xl:hidden"
              aria-expanded={aberto}
              aria-controls="menu-celular"
              onClick={() => setAberto((v) => !v)}
            >
              {aberto ? <X aria-hidden="true" size={24} /> : <Menu aria-hidden="true" size={24} />}
              <span className="sr-only">{aberto ? 'Fechar menu' : 'Abrir menu'}</span>
            </button>
          </div>
        </div>

        <div
          id="menu-celular"
          ref={painelRef}
          hidden={!aberto}
          className="max-h-[calc(100dvh-7rem)] overflow-y-auto border-t border-teal-800/10 bg-white xl:hidden"
        >
          <nav aria-label="Menu do celular" className="container-site py-6">
            <ul className="divide-y divide-teal-800/10">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setAberto(false)}
                    className="flex min-h-14 items-center font-display text-2xl text-teal-800"
                  >
                    {l.rotulo}
                  </a>
                </li>
              ))}
            </ul>
            <a href={linkGeral(unidade)} target="_blank" rel="noopener" className="btn btn-primario mt-6 w-full">
              <IconeWhatsapp size={18} />
              Agendar pelo WhatsApp
            </a>
          </nav>
        </div>
      </header>
    </div>
  )
}

/** Botão flutuante discreto (desktop) e barra fixa (celular). */
export function WhatsappFixo() {
  const { unidade } = useUnidade()
  const [mostrar, setMostrar] = useState(false)
  useEffect(() => {
    const fn = () => setMostrar(window.scrollY > window.innerHeight * 0.6)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  const href = linkGeral(unidade)
  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener"
        aria-label="Conversar pelo WhatsApp"
        className={`group fixed bottom-6 right-6 z-40 hidden items-center gap-2 rounded-full bg-teal-800 p-4 text-white shadow-[0_18px_40px_-18px_rgb(13_48_52/0.8)] transition-[transform,opacity] duration-500 hover:bg-teal-900 md:flex ${
          mostrar ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
        tabIndex={mostrar ? 0 : -1}
      >
        <IconeWhatsapp size={24} />
      </a>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-teal-800/10 bg-white/95 px-4 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
        <a href={href} target="_blank" rel="noopener" className="btn btn-primario w-full">
          <IconeWhatsapp size={20} />
          Agendar pelo WhatsApp
        </a>
      </div>
    </>
  )
}
