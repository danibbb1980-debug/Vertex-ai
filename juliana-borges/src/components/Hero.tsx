import { Fragment } from 'react'
import { CONFIG } from '../config'
import { BotaoWhatsApp, Foto, Logo, Seta } from './ui'

/** Revela palavra por palavra com um corte vertical (inspirado no "Vertical Cut Reveal" do 21st.dev). */
function TituloRevelado({ partes }: { partes: { t: string; enfase?: boolean }[] }) {
  let i = 0
  return (
    <>
      {partes.map((p, pi) =>
        p.t.split(' ').filter(Boolean).map((palavra, wi) => {
          const n = i++
          return (
            <Fragment key={`${pi}-${wi}`}>
              <span className="revela-palavra">
                <span style={{ animationDelay: `${n * 45}ms` }} className={p.enfase ? 'enfase' : undefined}>
                  {palavra}
                </span>
              </span>{' '}
            </Fragment>
          )
        }),
      )}
    </>
  )
}

export function Hero() {
  const temFoto = !!CONFIG.fotos.retrato
  const temAtendimentos = CONFIG.secoes.atendimentos && CONFIG.atendimentos.length > 0

  return (
    <section id="inicio" aria-labelledby="titulo-hero" className="degrade-nude relative overflow-hidden">
      <div className={`container-site relative grid items-end gap-10 lg:items-start pb-16 md:pb-20 lg:grid-cols-12 lg:gap-6 ${CONFIG.rascunho ? 'pt-36 md:pt-44' : 'pt-28 md:pt-36'}`}>
        <div className="relative z-10 lg:col-span-7 lg:pb-16">
          <p data-no-linha className="rotulo hero-entra mb-7 max-w-md leading-[1.9]" style={{ animationDelay: '0ms' }}>
            Massoterapeuta · Beleza e Estética · {CONFIG.cidade} - {CONFIG.uf}
          </p>
          <h1
            id="titulo-hero"
            className="font-serif text-choco"
            style={{ fontSize: 'clamp(2.6rem, 1.4rem + 5.2vw, 5.4rem)', lineHeight: 1.02, fontWeight: 430 }}
          >
            <TituloRevelado partes={[{ t: 'Cuidado com hora marcada e atenção a cada' }, { t: 'detalhe.', enfase: true }]} />
          </h1>
          <p className="hero-entra mt-8 max-w-xl text-[1.12rem] leading-relaxed text-choco/90" style={{ animationDelay: '380ms' }}>
            Massoterapia, depilação e estética facial e corporal, com atendimento individual e avaliação antes de cada procedimento.
          </p>
          <div className="hero-entra mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ animationDelay: '480ms' }}>
            <BotaoWhatsApp />
            {temAtendimentos && (
              <a href="#atendimentos" className="btn btn-secundario">
                Ver atendimentos <Seta />
              </a>
            )}
          </div>
        </div>

        <div className="relative lg:col-span-5 lg:mt-6">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[26rem] lg:max-w-none">
            {/* arco com degradê nude, como nas artes dela */}
            <div
              aria-hidden="true"
              className="absolute inset-x-[4%] bottom-0 top-[6%] rounded-t-full"
              style={{ background: 'linear-gradient(180deg, #ecd1c1 0%, #e6c3af 55%, #dcb39c 100%)' }}
            />
            <Logo
              variante="monograma"
              decorativo
              className="pointer-events-none absolute left-1/2 top-[9%] h-[62%] -translate-x-1/2 text-creme/70"
            />
            {temFoto ? (
              <Foto
                src={CONFIG.fotos.retrato}
                alt="Juliana Borges, massoterapeuta e depiladora, sorrindo, de camisa branca e óculos"
                sizes="(min-width: 1024px) 34vw, (min-width: 640px) 26rem, 92vw"
                prioridade
                className="absolute bottom-0 left-0 right-[4%] block"
                imgClassName="hero-retrato w-full h-auto"
              />
            ) : (
              <Logo variante="completo" className="absolute inset-x-[18%] top-[22%] text-ouro" />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
