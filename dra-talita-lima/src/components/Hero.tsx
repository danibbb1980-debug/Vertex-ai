import { ArrowDown } from 'lucide-react'
import type { CSSProperties } from 'react'
import { CONFIG } from '../config'
import { Aquarela, BotaoLigar, BotaoWhatsApp, Credenciais, Monograma } from './base'

const TITULO = 'Cuidado com as suas pernas, com *clareza*.'

function TituloRevelado({ texto }: { texto: string }) {
  const palavras = texto.split(' ')
  return (
    <>
      {palavras.map((p, i) => {
        const enfase = p.startsWith('*')
        const limpa = p.replace(/\*/g, '')
        const pontuacao = enfase && limpa.endsWith('.') ? '.' : ''
        const conteudo = pontuacao ? limpa.slice(0, -1) : limpa
        return (
          <span key={i}>
            <span className="palavra" style={{ '--i': i } as CSSProperties}>
              <span>
                {enfase ? <em className="enfase">{conteudo}</em> : conteudo}
                {pontuacao}
              </span>
            </span>
            {i < palavras.length - 1 ? ' ' : ''}
          </span>
        )
      })}
    </>
  )
}

export function Hero() {
  const foto = CONFIG.foto
  return (
    <section id="inicio" aria-labelledby="titulo-hero" className="relative overflow-hidden pb-20 pt-[8.5rem] md:pb-28 md:pt-[10rem]">
      <Aquarela tipo="topo" imediata className="-right-24 -top-6 w-[48rem] max-w-none opacity-90 md:-right-10 md:w-[64rem]" style={{ transform: 'scaleX(-1)' }} />
      <Aquarela tipo="base" imediata className="-bottom-4 -left-20 w-[40rem] max-w-none opacity-80" />

      <div className="container-site relative grid items-center gap-14 md:grid-cols-[1.15fr_0.85fr] md:gap-10 lg:gap-16">
        <div>
          <p className="rotulo surge">
            {CONFIG.titulo} · {CONFIG.cidade} - {CONFIG.uf}
          </p>
          <h1 id="titulo-hero" className="mt-6 text-[clamp(2.9rem,8.4vw,5.6rem)] font-light leading-[1.02] text-marinho">
            <TituloRevelado texto={TITULO} />
          </h1>
          <p className="surge mt-7 max-w-[34rem] text-[1.15rem] text-tinta md:text-[1.2rem]" style={{ '--atraso': '450ms' } as CSSProperties}>
            Avaliação individual, explicações claras e atendimento com hora marcada.
          </p>

          <div className="surge mt-9 flex flex-wrap items-center gap-3" style={{ '--atraso': '600ms' } as CSSProperties}>
            <BotaoWhatsApp>Agendar minha avaliação</BotaoWhatsApp>
            <BotaoLigar />
            {CONFIG.secoes.atendimentos && (
              <a href="#atendimentos" className="group inline-flex min-h-12 items-center gap-2 text-[0.98rem] text-marinho sm:px-2">
                <span className="link-sublinhado">Conhecer os atendimentos</span>
                <ArrowDown className="size-4 text-vinho transition-transform duration-500 group-hover:translate-y-1" strokeWidth={1.6} aria-hidden="true" />
              </a>
            )}
          </div>

          <p
            className="surge mt-10 flex w-fit items-center gap-3 rounded-full border border-linha bg-white/70 py-2 pl-2 pr-5 text-[0.88rem] text-marinho shadow-[0_10px_30px_-24px_rgba(37,42,69,.6)] backdrop-blur-sm"
            style={{ '--atraso': '800ms' } as CSSProperties}
          >
            <Monograma className="size-9 rounded-full bg-marfim" />
            <span>
              <strong className="font-medium">{CONFIG.nome}</strong> <span className="text-tinta">·</span>{' '}
              <Credenciais />
            </span>
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[24rem] md:max-w-none" data-fluxo="inicio">
          {foto ? (
            <figure className="surge relative" style={{ '--atraso': '200ms' } as CSSProperties}>
              <div className="absolute -inset-5 -z-0 rounded-t-full rounded-b-[2.5rem] border border-vinho/25" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-t-full rounded-b-[2rem] bg-pessego shadow-[0_40px_80px_-50px_rgba(37,42,69,.55)]">
                <img
                  src={foto.src}
                  srcSet={foto.srcPequena ? `${foto.srcPequena} 400w, ${foto.src} ${foto.largura}w` : undefined}
                  sizes="(min-width: 768px) 40vw, 90vw"
                  alt={foto.alt}
                  width={foto.largura}
                  height={foto.altura}
                  fetchPriority="high"
                  className="aspect-[4/5] w-full object-cover object-top"
                />
              </div>
              <figcaption className="absolute -bottom-6 -left-4 rounded-2xl bg-marfim/95 px-5 py-3 shadow-[0_20px_40px_-28px_rgba(37,42,69,.6)] md:-left-10">
                <span className="block font-serif text-[1.35rem] leading-tight text-marinho">{CONFIG.nome}</span>
                <span className="rotulo !text-[0.66rem] !tracking-[0.2em]">{CONFIG.titulo}</span>
              </figcaption>
            </figure>
          ) : (
            <div className="surge relative mx-auto aspect-square w-full max-w-[26rem]" aria-hidden="true">
              <div className="absolute inset-0 rounded-full border border-vinho/25" />
              <div className="absolute inset-8 rounded-full bg-pessego/70 blur-2xl" />
              <Monograma className="relative size-full p-8" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
