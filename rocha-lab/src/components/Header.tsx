import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'
import { whatsappLink } from '../lib/links'
import { Botao, IconWhatsApp, Logo } from './ui'

const links = [
  { href: '#trabalhos', label: 'Trabalhos' },
  { href: '#como-enviar', label: 'Como enviar um caso' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#duvidas', label: 'Dúvidas' },
  { href: '#contato', label: 'Contato' },
]

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-[var(--faixa)] items-center justify-center bg-petroleo-950 px-3 text-center text-[0.6875rem] leading-tight text-pessego-claro sm:text-[0.75rem]"
    >
      <span>
        <span className="rotulo mr-2 hidden text-[0.625rem] text-pessego sm:inline">Rascunho</span>
        Rascunho para avaliação. Informações sujeitas a confirmação.
      </span>
    </div>
  )
}

export function Header() {
  const [rolou, setRolou] = useState(false)
  const [aberto, setAberto] = useState(false)
  const [atual, setAtual] = useState<string | null>(null)
  const botaoRef = useRef<HTMLButtonElement>(null)
  const painelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setRolou(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Destaca no menu a seção que está no meio da tela.
  useEffect(() => {
    const secoes = links
      .map((l) => document.querySelector<HTMLElement>(l.href))
      .filter((el): el is HTMLElement => el !== null)
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) if (e.isIntersecting) setAtual(`#${e.target.id}`)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    secoes.forEach((s) => io.observe(s))
    const noTopo = () => window.scrollY < window.innerHeight * 0.5 && setAtual(null)
    window.addEventListener('scroll', noTopo, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', noTopo)
    }
  }, [])

  useEffect(() => {
    if (!aberto) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAberto(false)
        botaoRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    painelRef.current?.querySelector<HTMLElement>('a')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [aberto])

  const solido = rolou || aberto

  return (
    <header
      className={`fixed inset-x-0 top-[var(--faixa)] z-50 transition-[background-color,border-color,box-shadow] duration-300 ${
        solido
          ? 'border-b border-linha/80 bg-perola/92 shadow-[0_10px_30px_-24px_rgb(15_51_53/0.5)] backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-10 focus:rounded focus:bg-petroleo-900 focus:px-4 focus:py-2 focus:text-perola"
      >
        Pular para o conteúdo
      </a>
      <div className="container-site flex h-[4.5rem] items-center justify-between gap-6">
        <a href="#topo" className="flex min-h-11 shrink-0 items-center">
          <Logo />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={atual === l.href ? 'location' : undefined}
                  className="relative py-2 text-[0.875rem] font-medium text-tinta/80 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-petroleo-700 after:transition-transform after:duration-300 hover:text-petroleo-800 hover:after:scale-x-100 aria-[current=location]:text-petroleo-800 aria-[current=location]:after:scale-x-100"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <Botao href={whatsappLink()} externoLink className="min-h-11 px-5 text-sm" icone={<IconWhatsApp size={17} />}>
              Falar com o laboratório
            </Botao>
          </span>
          <button
            ref={botaoRef}
            type="button"
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-petroleo-800 lg:hidden"
            aria-expanded={aberto}
            aria-controls="menu-celular"
            onClick={() => setAberto((v) => !v)}
          >
            <span className="sr-only">{aberto ? 'Fechar menu' : 'Abrir menu'}</span>
            <span className="relative block h-3 w-6" aria-hidden="true">
              <span
                className={`absolute left-0 block h-px w-6 bg-current transition-transform duration-300 ${aberto ? 'top-1.5 rotate-45' : 'top-0'}`}
              />
              <span
                className={`absolute left-0 block h-px w-6 bg-current transition-transform duration-300 ${aberto ? 'top-1.5 -rotate-45' : 'top-3'}`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="menu-celular"
        ref={painelRef}
        hidden={!aberto}
        className="h-[calc(100dvh-4.5rem-var(--faixa))] overflow-y-auto border-t border-linha bg-perola lg:hidden"
      >
        <nav aria-label="Menu do celular" className="container-site flex flex-col py-6">
          <ul>
            {links.map((l, i) => (
              <li key={l.href} className="border-b border-linha/70">
                <a
                  href={l.href}
                  onClick={() => setAberto(false)}
                  className="flex items-baseline gap-4 py-4 font-serif text-[1.625rem] font-light text-petroleo-900"
                >
                  <span className="rotulo w-6 text-petroleo-600">{String(i + 1).padStart(2, '0')}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <Botao href={whatsappLink()} externoLink className="mt-8" icone={<IconWhatsApp size={18} />} magnetico={false}>
            Falar com o laboratório
          </Botao>
        </nav>
      </div>
    </header>
  )
}
