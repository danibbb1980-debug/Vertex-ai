import { forwardRef } from 'react'
import { CONFIG } from '../config'
import { BotaoWhats } from './ui'
import { CorteVertical } from './CorteVertical'

export const Hero = forwardRef<HTMLElement>(function Hero(_, ref) {
  const anos = CONFIG.anosAtuacao && CONFIG.anosAtuacao > 0 ? CONFIG.anosAtuacao : null
  return (
    <section ref={ref} id="inicio" aria-labelledby="titulo-hero" className="relative bg-areia">
      <div className="relative z-[2] mx-auto grid min-h-[min(100svh,980px)] max-w-[1320px] grid-cols-12 content-center px-5 pb-20 pt-40 sm:px-8 lg:pb-16 lg:pt-36">
        <div className="col-span-12 lg:col-span-8 xl:col-span-7">
          <p className="rotulo text-terracota-escuro">
            Estética <span aria-hidden="true">·</span> {CONFIG.cidade} - {CONFIG.uf}
          </p>
          <h1 id="titulo-hero" className="mt-6 text-[clamp(2.75rem,7.6vw,5.6rem)] leading-[0.98] tracking-[-0.035em]">
            <CorteVertical texto="Rosto, corpo, sobrancelhas e unhas, em um só *lugar*." atraso={0.15} />
          </h1>
          <p className="mt-7 max-w-[34ch] text-[1.125rem] leading-relaxed text-grafite-2 sm:text-[1.2rem]">
            Atendimento individual, com tempo e atenção, no Centro de {CONFIG.cidade}.
          </p>
          {anos && (
            <p className="mt-6 flex items-center gap-4 text-[0.95rem]">
              <span className="h-px w-10 bg-terracota" aria-hidden="true" />
              <span className="num">Há {anos} anos na estética</span>
            </p>
          )}
          <div className="mt-9 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
            <BotaoWhats rotuloAcessivel="Agendar horário" />
            <a href="#atendimentos" className="btn btn-secundario bg-areia/80">
              Conhecer os atendimentos
            </a>
          </div>
        </div>
      </div>
    </section>
  )
})
