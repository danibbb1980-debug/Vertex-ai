import type { CSSProperties } from 'react'
import { CONFIG } from '../config'
import { pesosSorteados } from '../lib/prng'
import { waUrl } from '../lib/whatsapp'
import { Acao } from './Base'

/** Título em duas linhas. `it` = trecho em itálico. */
const LINHAS: { t: string; it?: boolean }[][] = [
  [{ t: 'Cada pele pede' }],
  [{ t: 'um cuidado ' }, { t: 'diferente', it: true }, { t: '.' }],
]

const totalLetras = LINHAS.flat().reduce((s, p) => s + p.t.replace(/ /g, '').length, 0)
const PESOS = pesosSorteados(totalLetras)

/** Reflexo: cada letra com seu próprio peso no eixo wght. Decorativo. */
function Reflexo() {
  let k = 0
  return (
    <div className="espelho" aria-hidden="true">
      <div className="espelho-in">
        {LINHAS.map((linha, li) => (
          <span className="hero-linha" key={li}>
            {linha.map((parte, pi) => {
              const letras = [...parte.t].map((c, ci) => {
                if (c === ' ') return <span className="l l--esp" key={ci}>{' '}</span>
                const i = k++
                return (
                  <span className="l" key={ci} style={{ '--w': PESOS[i], '--i': i } as CSSProperties}>
                    {c}
                  </span>
                )
              })
              return parte.it ? <em key={pi}>{letras}</em> : <span key={pi}>{letras}</span>
            })}
          </span>
        ))}
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="hero" id="topo" aria-labelledby="hero-titulo">
      <div className="grade hero-grade">
        <h1 className="hero-h1" id="hero-titulo">
          <span className="hero-sobre">
            <span>{CONFIG.nome}</span>
            <span aria-hidden="true"> · </span>
            <span>{CONFIG.descritor}</span>
            <span aria-hidden="true"> · </span>
            <span>
              {CONFIG.cidade}/{CONFIG.endereco.uf}
            </span>
            <span className="sr-only">: </span>
          </span>
          <span className="hero-titulo">
            {LINHAS.map((linha, li) => (
              <span className="hero-linha" key={li}>
                {linha.map((p, pi) => (p.it ? <em key={pi}>{p.t}</em> : <span key={pi}>{p.t}</span>))}
                {li < LINHAS.length - 1 ? ' ' : ''}
              </span>
            ))}
          </span>
        </h1>
        <div className="hero-eixo" aria-hidden="true" />
        <Reflexo />
        <div className="hero-pe">
          <p className="hero-sub">
            Estética facial e corporal, a partir de uma avaliação personalizada, com horário marcado em{' '}
            {CONFIG.cidade}.
          </p>
          <div className="hero-acoes">
            {CONFIG.usarWhatsapp && <Acao href={waUrl()}>Agendar avaliação</Acao>}
            {CONFIG.secoes.atendimentos && (
              <a className="btn btn--contorno" href="#atendimentos">
                <span className="btn-txt">Ver atendimentos</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
