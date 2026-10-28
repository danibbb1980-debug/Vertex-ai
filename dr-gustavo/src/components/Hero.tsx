import { CONFIG } from '../config'
import { waLink } from '../lib/links'
import { IconArrowDown, IconClock, IconPin, IconWhatsApp } from './Icons'
import { Portrait } from './Portrait'
import { TextReveal } from './TextReveal'

export function Hero() {
  const e = CONFIG.endereco
  return (
    <section
      id="topo"
      aria-labelledby="hero-titulo"
      className="relative overflow-hidden pt-[calc(var(--banner-h)+var(--header-h)+2.5rem)] pb-16 md:pt-[calc(var(--banner-h)+var(--header-h)+4.5rem)] md:pb-24"
    >
      <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,#000,transparent_85%)]" />
      <div className="shell relative grid items-start gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <h1 id="hero-titulo" className="hero-title">
            <span className="eyebrow fade-in mb-7 block" style={{ ['--d' as string]: '0ms' }}>
              Odontologia em Alfenas - MG
            </span>
            <span className="block text-[clamp(2.4rem,1rem+4.2vw,4.6rem)] leading-[1.02]">
              <TextReveal text={'Cuidado com\n*precisão*, atenção\na cada paciente.'} />
            </span>
          </h1>
          <p className="lead fade-in mt-7 max-w-[36rem]" style={{ ['--d' as string]: '650ms' }}>
            Implantes, ortodontia, tratamento de canal, clareamento e estética do sorriso, com atendimento individual
            e hora marcada.
          </p>
          <div className="fade-in mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ ['--d' as string]: '800ms' }}>
            <a href={waLink()} target="_blank" rel="noopener" className="btn btn-primary">
              <IconWhatsApp size={19} />
              Agendar minha avaliação
            </a>
            <a href="#atendimentos" className="btn btn-ghost">
              Conhecer os atendimentos
              <IconArrowDown size={17} />
            </a>
          </div>
          <ul className="fade-in mt-12 grid max-w-[36rem] grid-cols-1 gap-4 border-t border-line pt-6 text-sm sm:grid-cols-2" style={{ ['--d' as string]: '950ms' }}>
            <li className="flex items-start gap-3">
              <IconClock className="mt-0.5 shrink-0 text-accent" />
              <div>
                <p className="font-semibold text-ink">Hora marcada</p>
                <p className="text-mute">Atendimento por agendamento</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <IconPin className="mt-0.5 shrink-0 text-accent" />
              <div>
                <p className="font-semibold text-ink">{e.bairro}</p>
                <p className="text-mute">
                  {e.cidade} - {e.uf}
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div className="lg:col-span-5">
          <Portrait />
        </div>
      </div>
    </section>
  )
}
