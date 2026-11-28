import { lazy, Suspense, useEffect, useState } from 'react'
import { CONFIG, MSG_GERAL, waLink } from './config'
import Hero from './hero/Hero'
import Agendar from './sections/Agendar'
import { ComoFunciona, Contato, CtaFinal, Duvidas, Estetica, Footer, Horarios, OTraco, Silencio, Trabalhos } from './sections/Sections'
import { Arrow, OpeningProvider, Wordmark, useRevealObserver } from './ui'

const Splash = lazy(() => import('./hero/Splash'))

const NAV = [
  ['Estética', '#estetica'],
  ['Como funciona', '#como-funciona'],
  ['Dúvidas', '#duvidas'],
  ['Contato', '#contato']
]

const DraftBar = () =>
  CONFIG.rascunho ? (
    <div className='draft' role='note'>
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  ) : null

const Header = () => {
  const [solid, setSolid] = useState(false)
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    if (!menu) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menu])

  return (
    <header className={`site-header${solid || menu ? ' is-solid' : ''}`}>
      <div className='wrap header-in'>
        <a href='#topo' className='brand' aria-label='Chronos Estética Automotiva, voltar ao início'>
          <span className='fg-logo'>
            <Wordmark />
          </span>
          <span className='brand-sub' aria-hidden='true'>
            Estética automotiva
          </span>
        </a>
        <nav aria-label='Principal' className='nav-desk'>
          <ul>
            {NAV.map(([l, h]) => (
              <li key={h}>
                <a href={h} className='ulink'>
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a className='btn btn--primary btn--sm header-cta' href={waLink(MSG_GERAL)} target='_blank' rel='noopener noreferrer'>
          <span>Pedir horário</span>
          <span className='sr-only'> pelo WhatsApp (abre em nova aba)</span>
        </a>
        <button type='button' className='menu-btn' aria-expanded={menu} aria-controls='menu-mobile' onClick={() => setMenu(m => !m)}>
          <span className='sr-only'>{menu ? 'Fechar menu' : 'Abrir menu'}</span>
          <span className='menu-ico' aria-hidden='true' />
        </button>
      </div>
      <nav id='menu-mobile' className='nav-mob' aria-label='Principal (celular)' hidden={!menu}>
        <ul>
          {NAV.map(([l, h], i) => (
            <li key={h} className='row'>
              <a href={h} onClick={() => setMenu(false)}>
                <span className='row-k tnum'>{String(i + 1).padStart(2, '0')}</span>
                {l}
              </a>
            </li>
          ))}
          <li className='row'>
            <a href='#agendar' onClick={() => setMenu(false)}>
              <span className='row-k tnum'>05</span>Pedir horário
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}

/** Botão flutuante discreto no desktop e barra fixa no celular, depois do hero */
const StickyCta = () => {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const hero = document.getElementById('topo')
    const end = document.querySelector('.footer')
    if (!hero || !('IntersectionObserver' in window)) return
    let heroOut = false
    let footIn = false
    const apply = () => setShow(heroOut && !footIn)
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.target === hero) heroOut = !e.isIntersecting
        else footIn = e.isIntersecting
      })
      apply()
    })
    io.observe(hero)
    if (end) io.observe(end)
    return () => io.disconnect()
  }, [])
  return (
    <div className={`sticky-cta${show ? ' is-on' : ''}`} aria-hidden={!show}>
      <a className='btn btn--primary' href={waLink(MSG_GERAL)} target='_blank' rel='noopener noreferrer' tabIndex={show ? 0 : -1}>
        <span>Pedir horário</span>
        <Arrow />
        <span className='sr-only'> pelo WhatsApp (abre em nova aba)</span>
      </a>
    </div>
  )
}

const SplashGate = () => {
  const [load, setLoad] = useState(false)
  useEffect(() => setLoad(true), [])
  return load ? (
    <Suspense fallback={null}>
      <Splash />
    </Suspense>
  ) : null
}

export default function App() {
  useRevealObserver()
  const S = CONFIG.secoes
  return (
    <OpeningProvider>
      <a className='skip' href='#conteudo'>
        Pular para o conteúdo
      </a>
      <DraftBar />
      <Header />
      <main id='conteudo' tabIndex={-1}>
        <Hero />
        {S.estetica && <Estetica />}
        {S.traco && <OTraco />}
        {S.trabalhos && <Trabalhos />}
        {S.silencio && <Silencio />}
        {S.comoFunciona && <ComoFunciona />}
        {S.horarios && <Horarios />}
        {S.duvidas && <Duvidas />}
        {S.contato && <Contato />}
        {S.agendar && CONFIG.usarWhatsapp && <Agendar />}
        {S.ctaFinal && <CtaFinal />}
      </main>
      <Footer />
      <StickyCta />
      <SplashGate />
    </OpeningProvider>
  )
}
