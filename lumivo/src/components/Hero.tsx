import { config } from '../config'
import { useAbrirQuiz } from '../quizContexto'
import { rolarPara } from '../motion/useLenis'
import { Seta } from './Seta'
import { PalavraLuz } from './PalavraLuz'

const { hero } = config

/** Divide uma linha do título marcando as palavras que pertencem à ênfase. */
function linhaComEnfase(linha: string) {
  const enfase = hero.palavraEnfase.split(' ')
  return linha.split(' ').map((p, i, arr) => {
    const limpa = p.replace(/[.,]/g, '')
    const espaco = i < arr.length - 1 ? ' ' : ''
    return enfase.includes(limpa) ? (
      <em key={i}>{p + espaco}</em>
    ) : (
      <span key={i}>{p + espaco}</span>
    )
  })
}

export function Hero() {
  const abrirQuiz = useAbrirQuiz()
  return (
    <section id="topo" className="hero" aria-labelledby="hero-titulo">
      <div className="hero__luz" aria-hidden="true" />
      <div className="hero__conteudo container">
        <p className="rotulo hero__rotulo entra" style={{ '--i': 0 } as React.CSSProperties}>{hero.rotulo}</p>
        <h1 id="hero-titulo" className="hero__titulo" aria-label={hero.linhasTitulo.join(' ')}>
          {hero.linhasTitulo.map((linha, i) => (
            <span className="linha" key={i} aria-hidden="true">
              <span className="linha__in" style={{ '--i': i } as React.CSSProperties}>
                {linhaComEnfase(linha)}
              </span>
            </span>
          ))}
        </h1>
        <p className="hero__texto">{hero.texto}</p>

        {hero.provas.length > 0 && (
          <dl className="provas">
            {hero.provas.map((p, i) => (
              <div className="provas__linha entra" key={p.rotulo} style={{ '--i': i + 4 } as React.CSSProperties}>
                <dt className="rotulo">{p.rotulo}</dt>
                <dd>{p.dado}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="hero__acoes entra" style={{ '--i': 8 } as React.CSSProperties}>
          <button className="botao botao--primario botao--largo" onClick={(e) => abrirQuiz(e.currentTarget)}>
            {hero.ctaPrincipal}
            <Seta className="botao__seta" />
          </button>
          {hero.microtexto && <p className="rotulo hero__micro">{hero.microtexto}</p>}
          <a
            className="link-secundario"
            href="#metodo"
            onClick={(e) => {
              e.preventDefault()
              rolarPara('#metodo')
            }}
          >
            {hero.ctaSecundario}
          </a>
        </div>
      </div>
      <PalavraLuz />
    </section>
  )
}
