import { useEffect, useRef, useState } from 'react'
import { CONFIG, type Foto } from '../config'
import { NumSecao } from './Marca'
import { Titulo } from './Reveal'

export function Img({ f, sizes, eager = false, className = '' }: { f: Foto; sizes: string; eager?: boolean; className?: string }) {
  return (
    <img
      className={className}
      src={`/fotos/${f.src}-640.webp`}
      srcSet={`/fotos/${f.src}-360.webp 360w, /fotos/${f.src}-640.webp 640w, /fotos/${f.src}-1100.webp 1100w`}
      sizes={sizes}
      width={f.largura}
      height={f.altura}
      alt={f.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  )
}

/** O espaço: fotos num anel em 3D que gira com a rolagem e com os botões. */
export function Espaco({ n }: { n: string }) {
  const fotos = CONFIG.fotos
  const cena = useRef<HTMLDivElement>(null)
  const [passo, setPasso] = useState(0)
  const [atual, setAtual] = useState(0)
  const total = fotos.length

  useEffect(() => {
    const el = cena.current
    if (!el || total < 3) return
    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let rolagem = 0
    let pend = false
    const ang = 360 / total
    const aplicar = () => {
      pend = false
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p = reduz ? 0 : Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)))
      rolagem = p * ang * (total - 1) * 0.6
      const rot = rolagem + passo * ang
      el.style.setProperty('--rot', `${-rot}deg`)
      setAtual(((Math.round(rot / ang) % total) + total) % total)
    }
    const ag = () => {
      if (!pend) {
        pend = true
        requestAnimationFrame(aplicar)
      }
    }
    aplicar()
    window.addEventListener('scroll', ag, { passive: true })
    window.addEventListener('resize', ag)
    return () => {
      window.removeEventListener('scroll', ag)
      window.removeEventListener('resize', ag)
    }
  }, [passo, total])

  if (!total) return null
  return (
    <section className="espaco" id="espaco" aria-labelledby="espaco-titulo">
      <div className="grade espaco-cabeca">
        <NumSecao n={n} rotulo="O espaço" />
        <Titulo id="espaco-titulo" className="titulo-secao" linhas={['Por dentro', <>da <em>clínica</em>.</>]} />
        <p className="texto-apoio">Salas individuais, horário marcado e um café enquanto você espera.</p>
      </div>
      <div className="anel-cena" ref={cena} style={{ ['--n' as string]: total }}>
        <ul className="anel" aria-label="Fotos da clínica">
          {fotos.map((f, i) => (
            <li
              key={f.src}
              className={`anel-item${i === atual ? ' frente' : ''}`}
              style={{ ['--i' as string]: i }}
            >
              <figure>
                <Img f={f} sizes="(max-width: 600px) 44vw, 300px" />
                <figcaption>{f.legenda}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
      <div className="grade anel-controles">
        <button type="button" className="botao botao-linha" onClick={() => setPasso((p) => p - 1)} aria-label="Foto anterior">
          Anterior
        </button>
        <p className="anel-legenda" aria-live="polite">
          <span className="num-tab">
            {String(atual + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>{' '}
          {fotos[atual].legenda}
        </p>
        <button type="button" className="botao botao-linha" onClick={() => setPasso((p) => p + 1)} aria-label="Próxima foto">
          Próxima
        </button>
      </div>
    </section>
  )
}

/** Antes e depois dos cuidados capilares, com inclinação em 3D ao passar o mouse. */
export function AntesDepois({ n }: { n: string }) {
  const itens = CONFIG.antesDepois
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.ad-card'))
    const offs = cards.map((c) => {
      const mv = (e: PointerEvent) => {
        const r = c.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width - 0.5
        const y = (e.clientY - r.top) / r.height - 0.5
        c.style.setProperty('--ry', `${x * 14}deg`)
        c.style.setProperty('--rx', `${-y * 10}deg`)
      }
      const out = () => {
        c.style.setProperty('--ry', '0deg')
        c.style.setProperty('--rx', '0deg')
      }
      c.addEventListener('pointermove', mv)
      c.addEventListener('pointerleave', out)
      return () => {
        c.removeEventListener('pointermove', mv)
        c.removeEventListener('pointerleave', out)
      }
    })
    return () => offs.forEach((f) => f())
  }, [])
  if (!itens.length) return null
  return (
    <section className="ad" id="antes-depois" aria-labelledby="ad-titulo">
      <div className="grade">
        <div className="ad-cabeca">
          <NumSecao n={n} rotulo="Cuidados capilares" />
          <Titulo id="ad-titulo" className="titulo-secao" linhas={['Antes e depois,', <>com <em>acompanhamento</em>.</>]} />
          <p className="texto-apoio">
            Registros de clientes da Homenz Limeira, publicados com autorização. Cada caso é individual: o que é indicado
            para você depende da avaliação.
          </p>
        </div>
        <ul className="ad-lista">
          {itens.map((f, i) => (
            <li key={f.src} className="ad-item" data-io style={{ ['--i' as string]: i }}>
              <figure className="ad-card">
                <Img f={f} sizes="(max-width: 760px) 92vw, 600px" />
                <figcaption>
                  <span className="num-tab">{String(i + 1).padStart(2, '0')}</span> {f.legenda}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p className="nota ad-nota">Imagens publicadas pela clínica com autorização de cada cliente.</p>
      </div>
    </section>
  )
}
