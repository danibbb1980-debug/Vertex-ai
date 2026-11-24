import { useEffect, useState } from 'react'
import { CONFIG } from '../config'
import { waUrl } from '../lib/whatsapp'
import { Monograma } from './Logo'

const LINKS = [
  { href: '#atendimentos', txt: 'Atendimentos', secao: 'atendimentos' },
  { href: '#como-funciona', txt: 'Como funciona', secao: 'comoFunciona' },
  { href: '#duvidas', txt: 'Dúvidas', secao: 'duvidas' },
  { href: '#contato', txt: 'Contato', secao: 'contato' },
] as const

export function Marca() {
  return (
    <span className="marca">
      <Monograma className="marca-mono" />
      <span className="marca-nome">
        <span className="marca-nome-1">{CONFIG.nomeCurto}</span>
        <span className="marca-nome-2">{CONFIG.cidade}</span>
      </span>
    </span>
  )
}

export function Cabecalho() {
  const [aberto, setAberto] = useState(false)
  const [solido, setSolido] = useState(false)

  useEffect(() => {
    let raf = 0
    const ver = () => {
      raf = 0
      setSolido(window.scrollY > 24)
    }
    const aoRolar = () => {
      if (!raf) raf = requestAnimationFrame(ver)
    }
    ver()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  useEffect(() => {
    if (!aberto) return
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false)
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [aberto])

  const links = LINKS.filter((l) => CONFIG.secoes[l.secao])

  return (
    <header className={`cab${solido || aberto ? ' cab--solido' : ''}${aberto ? ' cab--aberto' : ''}`}>
      <div className="cab-in">
        <a className="cab-marca" href="#topo" aria-label={`${CONFIG.nome}, voltar ao início`}>
          <Marca />
        </a>
        <nav className="cab-nav" id="menu-principal" aria-label="Principal">
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                <a className="link" href={l.href} onClick={() => setAberto(false)}>
                  {l.txt}
                </a>
              </li>
            ))}
            {CONFIG.usarWhatsapp && (
              <li className="cab-nav-cta">
                <a className="btn btn--tinta" href={waUrl()} target="_blank" rel="noopener noreferrer">
                  <span className="btn-txt">Agendar avaliação</span>
                  <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
                </a>
              </li>
            )}
          </ul>
        </nav>
        <button
          type="button"
          className="cab-menu"
          aria-expanded={aberto}
          aria-controls="menu-principal"
          onClick={() => setAberto((v) => !v)}
        >
          <span className="cab-menu-traco" aria-hidden="true" />
          {aberto ? 'Fechar' : 'Menu'}
        </button>
      </div>
    </header>
  )
}
