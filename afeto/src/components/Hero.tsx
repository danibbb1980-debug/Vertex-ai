import { useRef } from 'react'
import { useProgressoRolagem } from '../lib/rolagem'
import { CONFIG } from '../config'
import { horarioCurto, linkWhatsApp } from '../lib/dados'
import { Mosaico, type MosaicoControle } from '../brand/Marca'
import { Enfase } from './Enfase'
import { IconeWhatsApp } from './Icones'

/** Título revelado palavra por palavra (estrutura do "Vertical Cut Reveal", 21st.dev). */
function TituloRevelado({ antes, enfase, depois }: { antes: string; enfase: string; depois: string }) {
  const palavras = antes.split(' ').filter(Boolean)
  const total = palavras.length
  return (
    <h1 className="text-[clamp(3.1rem,13vw,7.4rem)] leading-[0.95] tracking-[-0.025em] text-tinta">
      <span className="sr-only">{`${antes} ${enfase}${depois}`}</span>
      <span aria-hidden="true">
        {palavras.map((p, i) => (
          <span key={i} className="corte-palavra mr-[0.22em]">
            <span style={{ ['--i' as string]: i }}>{p}</span>
          </span>
        ))}
        <span className="corte-palavra">
          <span style={{ ['--i' as string]: total }}>
            <Enfase>{enfase}</Enfase>
            {depois}
          </span>
        </span>
      </span>
    </h1>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const mosaico = useRef<MosaicoControle>(null)
  // Momento de assinatura: as peças do logo se encaixam na primeira metade da rolagem do hero.
  const INICIO = 0.08
  useProgressoRolagem(
    ref,
    (r) => INICIO + (1 - INICIO) * (-r.top / (r.height * 0.45)),
    (p) => mosaico.current?.definir(p),
  )
  const zap = linkWhatsApp()
  const horas = horarioCurto()

  return (
    <section
      id="inicio"
      ref={ref}
      aria-labelledby="titulo-hero"
      className={`relative overflow-x-clip ${CONFIG.rascunho ? 'pt-[6.5rem]' : 'pt-[4.5rem]'}`}
    >
      <div className="mx-auto grid max-w-[84rem] gap-y-10 px-4 pb-14 pt-10 sm:px-6 lg:grid-cols-12 lg:gap-x-8 lg:px-10 lg:pb-20 lg:pt-16">
        <div className="relative z-10 lg:col-span-7 lg:pt-10" id="titulo-hero">
          <p className="rotulo mb-7 text-terracota-texto">
            Espaço terapêutico <span aria-hidden="true">·</span>{' '}
            <span className="whitespace-nowrap">
              {CONFIG.cidade} - {CONFIG.uf}
            </span>
          </p>
          <TituloRevelado antes="Cuidar do outro com" enfase="respeito" depois="." />
          <p className="mt-8 max-w-[34rem] text-[1.125rem] leading-relaxed text-tinta-suave sm:text-[1.2rem]">
            Um espaço multiprofissional para a saúde física, cognitiva e emocional, com avaliação individual e hora
            marcada.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {zap && (
              <a href={zap} target="_blank" rel="noopener noreferrer" className="botao botao-primario">
                <IconeWhatsApp /> Agendar pelo WhatsApp
              </a>
            )}
            {CONFIG.secoes.espaco && (
              <a href="#espaco" className="botao botao-secundario">
                Conhecer o espaço
              </a>
            )}
          </div>
        </div>

        <div className="relative lg:col-span-5 lg:-mr-6">
          {/* fundo: grande meia-lua sálvia, cortada pela borda */}
          <div
            aria-hidden="true"
            className="absolute -right-24 top-[8%] -z-0 aspect-square w-[95%] rounded-full bg-salvia-clara sm:w-[80%] lg:-right-40 lg:w-[105%]"
          />
          <Mosaico
            controle={mosaico}
            inicial={INICIO}
            className="relative mx-auto block w-[86%] max-w-[34rem] sm:w-[70%] lg:w-full"
          />
        </div>
      </div>

      <div className="mx-auto max-w-[84rem] px-4 sm:px-6 lg:px-10">
        <dl className="grid grid-cols-1 gap-y-3 border-t border-fio py-5 text-[0.95rem] sm:grid-cols-3 sm:gap-x-8">
          <div className="flex gap-3">
            <dt className="rotulo pt-[0.2rem] text-terracota-texto">Cuidado</dt>
            <dd>Físico, cognitivo e emocional</dd>
          </div>
          {horas && (
            <div className="flex gap-3">
              <dt className="rotulo pt-[0.2rem] text-terracota-texto">Horário</dt>
              <dd>{horas}, com hora marcada</dd>
            </div>
          )}
          <div className="flex gap-3">
            <dt className="rotulo pt-[0.2rem] text-terracota-texto">Bairro</dt>
            <dd>{CONFIG.endereco.bairro}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
