import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CONFIG, identificacao, temWhatsapp, waLink } from '../config'
import { Monograma } from './Monograma'
import { Assinatura, IconeWhatsapp, Titulo } from './ui'

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-[var(--faixa)] items-center justify-center bg-cafe px-4 text-center text-[0.75rem] leading-tight tracking-[0.02em] text-creme"
    >
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  )
}

const LINKS = [
  { href: '#medica', rotulo: 'A médica', secao: 'medica' },
  { href: '#atendimentos', rotulo: 'Atendimentos', secao: 'atendimentos' },
  { href: '#como-funciona', rotulo: 'Como funciona', secao: 'comoFunciona' },
  { href: '#duvidas', rotulo: 'Dúvidas', secao: 'duvidas' },
  { href: '#contato', rotulo: 'Contato', secao: 'contato' },
] as const

export function Cabecalho() {
  const [rolou, setRolou] = useState(false)
  const [aberto, setAberto] = useState(false)
  const painelRef = useRef<HTMLDivElement>(null)
  const botaoRef = useRef<HTMLButtonElement>(null)
  const links = LINKS.filter((l) => CONFIG.secoes[l.secao])
  const destinoAgendar = CONFIG.secoes.agendar ? '#agendar' : waLink()

  useEffect(() => {
    const f = () => setRolou(window.scrollY > 24)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])

  useEffect(() => {
    if (!aberto) return
    const painel = painelRef.current
    painel?.querySelector<HTMLElement>('a,button')?.focus()
    document.body.style.overflow = 'hidden'
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAberto(false)
        botaoRef.current?.focus()
      }
      if (e.key === 'Tab' && painel) {
        const focaveis = [...painel.querySelectorAll<HTMLElement>('a,button')]
        const primeiro = focaveis[0]
        const ultimo = focaveis[focaveis.length - 1]
        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault()
          ultimo.focus()
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault()
          primeiro.focus()
        }
      }
    }
    document.addEventListener('keydown', tecla)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', tecla)
    }
  }, [aberto])

  const fechar = () => setAberto(false)

  return (
    <header
      className={`fixed inset-x-0 top-[var(--faixa)] z-50 transition-[background-color,border-color] duration-500 ${
        rolou || aberto ? 'border-b border-linha bg-creme/95 backdrop-blur-[2px]' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <a href="#conteudo" className="sr-only-foco botao botao-cheio absolute left-4 top-2 z-10">
        Pular para o conteúdo
      </a>
      <div className="wrap flex h-[4.5rem] items-center justify-between gap-6 md:h-20">
        <a href="#topo" className="flex min-h-12 items-center gap-3">
          <Monograma className="h-11 w-auto md:h-12" peso={2.2} />
          <Assinatura compacta />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[0.95rem]">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="link-sutil inline-flex min-h-12 items-center text-tinta decoration-transparent hover:decoration-current">
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href={destinoAgendar} className="botao botao-cheio hidden !min-h-12 !px-5 !text-[0.92rem] sm:inline-flex">
            Agendar consulta
          </a>
          <button
            ref={botaoRef}
            type="button"
            className="inline-flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-full px-3 text-[0.95rem] lg:hidden"
            aria-expanded={aberto}
            aria-controls="menu-celular"
            onClick={() => setAberto((v) => !v)}
          >
            <span aria-hidden="true" className="relative inline-block h-3 w-6 shrink-0">
              <span className={`absolute left-0 top-0 h-px w-6 bg-tinta transition-transform duration-300 ${aberto ? 'translate-y-1.5 rotate-[20deg]' : ''}`} />
              <span className={`absolute bottom-0 left-0 h-px w-6 bg-tinta transition-transform duration-300 ${aberto ? '-translate-y-1.5 -rotate-[20deg]' : ''}`} />
            </span>
            {aberto ? 'Fechar' : 'Menu'}
          </button>
        </div>
      </div>

      <div
        id="menu-celular"
        ref={painelRef}
        hidden={!aberto}
        className="h-[calc(100dvh-var(--faixa)-4.5rem)] overflow-y-auto border-t border-linha bg-creme lg:hidden"
      >
        <nav aria-label="Menu" className="wrap flex h-full flex-col justify-between pb-10 pt-6">
          <ul>
            {links.map((l, i) => (
              <li key={l.href} className="border-b border-linha">
                <a href={l.href} onClick={fechar} className="flex min-h-16 items-baseline gap-4 py-3">
                  <span className="num text-sm text-ouro-texto">{String(i + 1).padStart(2, '0')}</span>
                  <span className="display text-[2rem]">{l.rotulo}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3">
            <a href={destinoAgendar} onClick={fechar} className="botao botao-cheio">
              Solicitar agendamento
            </a>
            {temWhatsapp() && (
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="botao botao-linha">
                <IconeWhatsapp /> WhatsApp {CONFIG.whatsappExibicao}
              </a>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

export function Hero() {
  const e = CONFIG.endereco
  const h = CONFIG.horarios[0]
  return (
    <section id="topo" aria-labelledby="titulo-hero" className="relative pt-[calc(var(--faixa)+4.5rem)] md:pt-[calc(var(--faixa)+5rem)]">
      <div className="wrap relative pb-16 pt-8 md:pb-24 lg:min-h-[44rem] lg:pb-44 lg:pt-20">
        {/* monograma: no celular, acima do título; no desktop, à direita */}
        <div className="mb-6 flex justify-end lg:absolute lg:right-[var(--pad)] lg:top-16 lg:mb-0">
          <Monograma desenhar titulo="Monograma VM do Espaço Saúde e Mulher" className="h-auto w-[11.5rem] sm:w-[15rem] lg:w-[29rem]" />
        </div>

        <div className="relative max-w-[44rem]">
          <p className="rotulo aparece text-ouro-texto" style={{ ['--d' as string]: '0.2s' }}>
            {CONFIG.especialidades[0].nome} · {e.cidade} - {e.uf}
          </p>
          <h1 id="titulo-hero" className="display mt-6 text-[clamp(2.6rem,7.4vw,5.4rem)] text-bronze">
            <span className="linha-revela"><span style={{ ['--d' as string]: '0.35s' }}>Cuidado com</span></span>
            <span className="linha-revela"><span style={{ ['--d' as string]: '0.5s' }}>a mulher</span></span>
            <span className="linha-revela"><span style={{ ['--d' as string]: '0.65s' }}><Titulo texto="em todas as *fases*" /></span></span>
            <span className="linha-revela"><span style={{ ['--d' as string]: '0.8s' }}>da vida.</span></span>
          </h1>
          <p className="aparece mt-7 max-w-[30rem] text-[1.125rem] leading-relaxed text-taupe" style={{ ['--d' as string]: '1.1s' }}>
            Consultório com escuta, avaliação individual e acompanhamento, com hora marcada.
          </p>
          <div className="aparece mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ ['--d' as string]: '1.3s' }}>
            {temWhatsapp() && (
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="botao botao-cheio">
                <IconeWhatsapp /> Agendar minha consulta
              </a>
            )}
            {CONFIG.secoes.atendimentos && (
              <a href="#atendimentos" className="botao botao-linha">
                Conhecer os atendimentos
              </a>
            )}
          </div>

          <div className="aparece mt-12 max-w-[34rem] border-t border-linha pt-5" style={{ ['--d' as string]: '1.5s' }}>
            <p className="text-[0.95rem] font-medium text-tinta">{identificacao()}</p>
            <p className="mt-1 text-[0.95rem] text-taupe">
              {e.complemento} · {e.bairro}
              {h && (
                <>
                  <span aria-hidden="true"> · </span>
                  <span className="num">
                    {h.rotulo.replace('Segunda a sexta', 'Seg. a sex.')}, {h.abre.replace(':', 'h')} às {h.fecha.replace(':', 'h')}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* o fio: continua do fim do M e desce até o trilho à esquerda (desktop) */}
        <FioHero />
      </div>
    </section>
  )
}

function FioHero() {
  const ref = useRef<HTMLDivElement>(null)
  const [t, setT] = useState<{ w: number; h: number } | null>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const medir = () => setT({ w: el.clientWidth, h: el.clientHeight })
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const w = t?.w ?? 0
  const h = t?.h ?? 0
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 left-[var(--pad)] hidden lg:block"
      style={{ right: 'calc(var(--pad) + 3.35rem)', top: '29.6rem' }}
    >
      {w > 0 && h > 0 && (
        <svg className="fio-hero block size-full overflow-visible" viewBox={`0 0 ${w} ${h}`} focusable="false">
          <path
            d={`M${w} 0C${w} ${h * 0.48} ${w * 0.93} ${h * 0.72} ${w * 0.66} ${h * 0.78}C${w * 0.4} ${h * 0.84} ${w * 0.05} ${h * 0.81} 1 ${h * 0.93}C0 ${h * 0.96} 0 ${h * 0.98} 0 ${h}`}
            fill="none"
            stroke="#B48E57"
            strokeWidth="1"
            strokeLinecap="round"
            pathLength={1}
          />
        </svg>
      )}
    </div>
  )
}
