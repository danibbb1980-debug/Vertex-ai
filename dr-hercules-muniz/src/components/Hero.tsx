import type { CSSProperties } from 'react'
import { CONFIG, linkWhats, secaoAtiva } from '../config'
import { AnelDourado, Botao } from './ui'
import { DenteTraco, IconeSeta, IconeWhats } from './Icones'

/**
 * Revelação de texto por palavra com corte vertical (adaptado do padrão "vertical cut reveal").
 * Animação em CSS pura: começa no primeiro paint, sem esperar o JavaScript.
 */
function TituloRevelado({ texto, id }: { texto: string; id: string }) {
  const palavras = texto.split(' ')
  return (
    <h1 id={id} className="text-[2.6rem] leading-[1.04] text-ivory sm:text-6xl lg:text-[4.6rem]">
      {palavras.map((w, i) => {
        const enfase = w.startsWith('*')
        const limpa = w.replace(/\*/g, '')
        return (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-top">
            <span
              className={`palavra inline-block ${enfase ? 'font-[330] italic text-gold-soft' : ''}`}
              style={{ '--i': i } as CSSProperties}
            >
              {limpa}
            </span>
            {i < palavras.length - 1 && ' '}
          </span>
        )
      })}
    </h1>
  )
}

function Medalhao() {
  const textoSelo = `${CONFIG.nome} · ${CONFIG.titulo} · ${CONFIG.cro} · `
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[19rem] sm:max-w-[24rem] lg:max-w-[30rem]" aria-hidden>
      <AnelDourado className="absolute inset-0 size-full" duracao={2.4} atraso={0.4} />
      <svg data-giro="50" viewBox="0 0 200 200" className="absolute inset-[9%] size-[82%] transition-transform duration-200 ease-linear">
        <defs>
          <path id="selo-circulo" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text fill="var(--color-gold)" fillOpacity=".7" fontSize="7.2" fontFamily="var(--font-sans)" fontWeight="600">
          <textPath href="#selo-circulo" textLength="486" lengthAdjust="spacing">
            {textoSelo.toUpperCase()}
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-[24%] rounded-full border border-gold/20" />
      <div className="dente-entrada absolute inset-[30%] text-gold">
        <DenteTraco className="size-full" />
      </div>
      {/* Cruzes de registro, como num desenho técnico */}
      {[
        'left-0 top-1/2 -translate-x-[140%] h-px w-4',
        'right-0 top-1/2 translate-x-[140%] h-px w-4',
        'left-1/2 top-0 -translate-y-[140%] h-4 w-px',
        'left-1/2 bottom-0 translate-y-[140%] h-4 w-px',
      ].map((pos) => (
        <span key={pos} className={`absolute ${pos} bg-gold/50`} />
      ))}
    </div>
  )
}

export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="titulo-hero"
      className={`on-dark relative isolate overflow-hidden bg-ink text-ivory ${CONFIG.rascunho ? 'pt-[8.5rem]' : 'pt-28'} pb-20 lg:pb-28`}
    >
      <div className="grid-fina absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_75%)]" />
      <div className="absolute -right-40 top-10 -z-10 size-[42rem] rounded-full bg-[radial-gradient(circle,rgb(195_164_107/0.10),transparent_65%)]" />

      <div className="container-site grid items-center gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        <div>
          <p className="eyebrow flex items-center gap-3 text-gold-soft">
            <span aria-hidden className="h-px w-8 shrink-0 bg-gold" />
            {CONFIG.titulo} · {CONFIG.cidade} - {CONFIG.uf}
          </p>
          <div className="mt-6">
            <TituloRevelado id="titulo-hero" texto="Planejamento claro, do primeiro *passo* ao acompanhamento." />
          </div>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ivory/75">
            Avaliação individual, explicações claras e atendimento com hora marcada.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Botao href={linkWhats()} externo variante="ouro">
              <IconeWhats className="size-5" />
              Agendar minha avaliação
            </Botao>
            {secaoAtiva('atendimentos') && (
              <Botao href="#atendimentos" variante="contorno-claro">
                Ver atendimentos
                <IconeSeta className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Botao>
            )}
          </div>
          <p className="mt-10 inline-flex items-center gap-3 rounded-full border border-gold/25 px-4 py-2 text-sm text-ivory/80">
            <span aria-hidden className="size-1.5 rounded-full bg-gold" />
            {CONFIG.nome} · {CONFIG.cro}
          </p>
        </div>
        <Medalhao />
      </div>
    </section>
  )
}

/** Marquee discreto (adaptado do padrão "infinite text marquee"): CSS, pausa fora da tela e no hover. */
export function Faixa() {
  const itens = [...CONFIG.atendimentos.map((a) => a.nome), 'Hora marcada', `${CONFIG.cidade} - ${CONFIG.uf}`]
  const linha = (
    <ul className="flex shrink-0 items-center">
      {itens.map((t) => (
        <li key={t} className="flex items-center gap-8 pr-8 font-serif text-xl italic text-ink/80 sm:text-2xl">
          {t}
          <span aria-hidden className="size-1.5 rounded-full bg-gold-deep/60" />
        </li>
      ))}
    </ul>
  )
  return (
    <div data-pausavel="" className="marquee overflow-hidden border-y border-line bg-sand py-5" aria-hidden>
      <div className="marquee-track flex w-max">
        {linha}
        {linha}
      </div>
    </div>
  )
}
