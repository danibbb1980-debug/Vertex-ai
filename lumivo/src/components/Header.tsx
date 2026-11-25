import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { Logo } from './Logo'
import { useFocoPreso } from './useFocoPreso'
import { useAbrirQuiz } from '../quizContexto'
import { rolarPara, travarRolagem } from '../motion/useLenis'
import { config } from '../config'
import { dur, ease, stagger } from '../motion/tokens'

const LINKS = [
  { href: '#conceito', rotulo: 'Conceito' },
  { href: '#servicos', rotulo: 'O que você recebe' },
  { href: '#metodo', rotulo: 'Como funciona' },
  { href: '#sobre', rotulo: 'Sobre' },
]

export function Header() {
  const [rolado, setRolado] = useState(false)
  const [aberto, setAberto] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const botaoRef = useRef<HTMLButtonElement>(null)
  const abrirQuiz = useAbrirQuiz()

  useEffect(() => {
    const aoRolar = () => setRolado(window.scrollY > 24)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  const fechar = useCallback(() => {
    setAberto(false)
    travarRolagem(false)
    botaoRef.current?.focus()
  }, [])

  useFocoPreso(menuRef, aberto, fechar)

  const alternar = () => {
    const novo = !aberto
    setAberto(novo)
    travarRolagem(novo)
  }

  const irPara = (href: string) => {
    setAberto(false)
    travarRolagem(false)
    rolarPara(href)
  }

  return (
    <header className={`topo ${rolado ? 'topo--rolado' : ''} ${aberto ? 'topo--aberto' : ''}`}>
      <div className="topo__barra">
        <a href="#topo" className="topo__logo" aria-label={`${config.marca.nome}, voltar ao início`} onClick={(e) => { e.preventDefault(); irPara('#topo') }}>
          <Logo />
        </a>
        <button
          className="botao botao--primario botao--compacto topo__cta"
          onClick={(e) => abrirQuiz(e.currentTarget)}
        >
          {config.hero.ctaPrincipal}
        </button>
        <button
          ref={botaoRef}
          className="hamburguer"
          aria-expanded={aberto}
          aria-controls="menu"
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
          onClick={alternar}
        >
          <span />
          <span />
        </button>
      </div>
      <AnimatePresence>
        {aberto && (
          <m.div
            id="menu"
            ref={menuRef}
            className="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: dur.media, ease: ease.inOut }}
          >
            <nav aria-label="Seções">
              <ul className="menu__lista">
                {LINKS.map((l, i) => (
                  <m.li
                    key={l.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * stagger.linhas, duration: dur.media, ease: ease.outExpo }}
                  >
                    <a href={l.href} onClick={(e) => { e.preventDefault(); irPara(l.href) }}>
                      <span className="menu__num">0{i + 1}</span>
                      {l.rotulo}
                    </a>
                  </m.li>
                ))}
              </ul>
            </nav>
            <div className="menu__rodape">
              <button
                className="botao botao--primario botao--largo"
                onClick={(e) => {
                  setAberto(false)
                  travarRolagem(false)
                  abrirQuiz(e.currentTarget.ownerDocument.querySelector<HTMLElement>('.hamburguer'))
                }}
              >
                {config.hero.ctaPrincipal}
              </button>
              <p className="rotulo">{config.contato.cidade} · {config.contato.whatsappExibicao}</p>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  )
}
