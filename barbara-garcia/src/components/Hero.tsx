import { CONFIG } from '../config'
import { linkWhatsapp, temWhatsapp } from '../lib/dados'
import { Botao } from './Botao'
import { IconeSeta, IconeWhatsapp } from './Icones'
import { Favo, Monograma } from './Marca'

const TITULO: { t: string; em?: boolean }[] = [
  { t: 'Uma' },
  { t: 'pausa' },
  { t: 'no' },
  { t: 'seu' },
  { t: 'dia,' },
  { t: 'com' },
  { t: 'hora' },
  { t: 'marcada.', em: true },
]

export function Hero() {
  const { endereco } = CONFIG
  return (
    <section id="inicio" aria-labelledby="titulo-hero" className="relative overflow-hidden pt-[7.5rem] md:pt-40">
      {/* luz quente ao fundo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[20%] -top-[10%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(closest-side,rgb(217_164_65/0.20),transparent)] md:h-[52rem] md:w-[52rem]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[15%] bottom-0 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(closest-side,rgb(185_113_79/0.10),transparent)]"
      />

      <div className="container-site relative grid items-center gap-10 pb-16 md:pb-24 lg:grid-cols-[1.25fr_0.75fr] lg:gap-6">
        <div>
          <p className="rotulo surge" style={{ ['--atraso' as string]: '80ms' }}>
            Estética · {endereco.bairro} · {endereco.cidade} - {endereco.uf}
          </p>
          <h1
            id="titulo-hero"
            className="mt-6 text-[clamp(2.6rem,8.6vw,5.4rem)] leading-[1.04] text-grafite"
          >
            {TITULO.map((p, i) => (
              <span key={i} className="linha-mascara">
                <span className="palavra-sobe" style={{ ['--atraso' as string]: `${160 + i * 70}ms` }}>
                  {p.em ? <em>{p.t}</em> : p.t}
                </span>
                {i < TITULO.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h1>
          <p className="surge mt-7 max-w-[34rem] text-[1.12rem] leading-relaxed text-suave md:text-[1.2rem]" style={{ ['--atraso' as string]: '780ms' }}>
            Massagens, terapias faciais e corporais e depilação com cera, com atendimento individual e horários ao longo da semana.
          </p>
          <div className="surge mt-9 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ ['--atraso' as string]: '900ms' }}>
            {temWhatsapp && (
              <Botao href={linkWhatsapp()} externo variante="mel">
                <IconeWhatsapp /> Agendar pelo WhatsApp
              </Botao>
            )}
            {CONFIG.secoes.atendimentos && CONFIG.atendimentos.length > 0 && (
              <Botao href="#atendimentos" variante="contorno">
                Ver atendimentos <IconeSeta tamanho={18} className="transition-transform duration-300 group-hover/botao:translate-x-1" />
              </Botao>
            )}
          </div>
        </div>

        {/* composição: favo, monograma e o início do fio de mel */}
        <div className="relative mx-auto aspect-square w-[min(68vw,17rem)] lg:mr-0 lg:w-[min(30vw,24rem)]" aria-hidden="true">
          <Favo className="absolute -left-[18%] top-[6%] w-[42%] text-mel/45 surge" />
          <Favo className="absolute -right-[6%] top-[58%] w-[30%] text-argila/30 surge" />
          <Favo preenchido className="absolute right-[4%] -top-[4%] w-[22%] text-areia surge" />
          <div className="surge absolute inset-[10%]" style={{ ['--atraso' as string]: '300ms' }}>
            <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(closest-side,rgb(246_240_230/1),rgb(232_220_200/0.6),transparent)]" />
            <Monograma className="relative h-full w-full drop-shadow-[0_18px_30px_rgba(52,73,59,0.16)]" />
            {/* ponto exato da gota no monograma (início do fio) */}
            <span data-fio="centro" className="absolute left-1/2 top-[78%] h-px w-px" />
          </div>
        </div>
      </div>
      {/* o fio desce da gota até aqui (abaixo dos botões) antes de seguir pela margem */}
      <span data-fio="desvio" aria-hidden="true" className="absolute bottom-[3.25rem] left-0 h-px w-px md:bottom-[4.5rem]" />
    </section>
  )
}
