import { useEffect, useState } from 'react'
import { CONFIG } from './config'
import { Agendar } from './components/Agendar'
import {
  Atendimentos,
  BotaoAgendar,
  Casa,
  ComoFunciona,
  CtaFinal,
  Duvidas,
  Espaco,
  Hero,
  Horarios,
  Localizacao,
  Rodape,
} from './components/secoes'
import { Pausa } from './components/ui'

const LINKS = [
  { href: '#atendimentos', texto: 'Atendimentos', on: CONFIG.secoes.atendimentos },
  { href: '#horarios', texto: 'Horários', on: CONFIG.secoes.horarios },
  { href: '#duvidas', texto: 'Dúvidas', on: CONFIG.secoes.duvidas },
  { href: '#contato', texto: 'Contato', on: CONFIG.secoes.localizacao },
].filter((l) => l.on)

const Header = () => {
  const [solido, setSolido] = useState(false)
  const [aberto, setAberto] = useState(false)
  useEffect(() => {
    const f = () => setSolido(window.scrollY > 24)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  useEffect(() => {
    if (!aberto) return
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [aberto])
  return (
    <header className={`header ${solido || aberto ? 'is-solido' : ''}`}>
      <div className="wrap header__in">
        <a href="#inicio" className="selo" aria-label={`${CONFIG.nome}, voltar ao início`}>
          <img src={CONFIG.logo.horizontal} width={212} height={60} alt={CONFIG.nome} />
        </a>
        <nav className="nav" aria-label="Principal">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.texto}
            </a>
          ))}
        </nav>
        <BotaoAgendar className="btn header__cta" />
        <button
          className="menu-botao"
          type="button"
          aria-expanded={aberto}
          aria-controls="menu-movel"
          onClick={() => setAberto((v) => !v)}
        >
          <Pausa />
          {aberto ? 'Fechar' : 'Menu'}
        </button>
      </div>
      <nav id="menu-movel" className="menu-movel" hidden={!aberto} aria-label="Menu">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setAberto(false)}>
            {l.texto}
          </a>
        ))}
        <BotaoAgendar />
      </nav>
    </header>
  )
}

/** Observa elementos .observar e aplica .is-in uma única vez; atualiza o progresso de .passos */
const useMovimento = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.observar')
    const io = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }),
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    )
    els.forEach((el) => io.observe(el))

    const passos = document.querySelector<HTMLElement>('[data-progresso]')
    const barra = document.querySelector('.barra-movel')
    const flut = document.querySelector('.flutuante')
    const hero = document.getElementById('inicio')
    let raf = 0
    const quadro = () => {
      raf = 0
      const vh = window.innerHeight
      if (passos) {
        const r = passos.getBoundingClientRect()
        const p = Math.min(1, Math.max(0, (vh * 0.6 - r.top) / r.height))
        passos.style.setProperty('--progresso', p.toFixed(3))
      }
      const passou = hero ? hero.getBoundingClientRect().bottom < vh * 0.4 : true
      const agendar = document.getElementById('agendar')?.getBoundingClientRect()
      const naSecaoAgendar = agendar ? agendar.top < vh && agendar.bottom > 0 : false
      const mostrar = passou && !naSecaoAgendar
      barra?.classList.toggle('is-visivel', mostrar)
      flut?.classList.toggle('is-visivel', mostrar)
    }
    const agendar = () => {
      if (!raf) raf = requestAnimationFrame(quadro)
    }
    quadro()
    window.addEventListener('scroll', agendar, { passive: true })
    window.addEventListener('resize', agendar)
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', agendar)
      window.removeEventListener('resize', agendar)
    }
  }, [])
}

export default function App() {
  useMovimento()
  const s = CONFIG.secoes
  let n = 0
  const prox = () => ++n
  return (
    <div className={CONFIG.rascunho ? 'tem-rascunho' : ''}>
      <a className="pular" href="#conteudo">
        Pular para o conteúdo
      </a>
      {CONFIG.rascunho && (
        <p className="faixa-rascunho" role="note">
          Rascunho para avaliação. Informações sujeitas a confirmação.
        </p>
      )}
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        {s.atendimentos && <Atendimentos n={prox()} />}
        {s.espaco && CONFIG.fotos.length > 0 && <Espaco n={prox()} />}
        {s.horarios && <Horarios n={prox()} />}
        {s.casa && CONFIG.responsavel && <Casa n={prox()} />}
        {s.comoFunciona && <ComoFunciona n={prox()} />}
        {s.duvidas && <Duvidas n={prox()} />}
        {s.localizacao && <Localizacao n={prox()} />}
        {s.agendar && CONFIG.usarWhatsapp && <Agendar n={prox()} />}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Rodape />
      {CONFIG.usarWhatsapp && (
        <>
          <div className="barra-movel">
            <BotaoAgendar />
            <a className="btn btn--linha" href={CONFIG.rotaUrl} target="_blank" rel="noopener noreferrer">
              Como chegar
            </a>
          </div>
          <BotaoAgendar className="btn flutuante" />
        </>
      )}
    </div>
  )
}
