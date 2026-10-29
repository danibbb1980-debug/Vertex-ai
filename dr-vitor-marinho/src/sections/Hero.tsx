import type { CSSProperties } from 'react'
import { CONFIG, exibirEspecialista } from '../config'
import { waLink } from '../lib/whatsapp'
import { resumoHorarios } from '../lib/horarios'
import { CutReveal } from '../components/CutReveal'
import { HeroComposition } from '../components/HeroComposition'
import { MagneticLink } from '../components/MagneticButton'
import { IconArrow, IconWhatsApp } from '../components/Icons'
import { scrollToHash } from '../lib/scroll'

export function Hero() {
  const h = resumoHorarios()[0]
  const cro = CONFIG.cro.trim()
  return (
    <section id="inicio" aria-labelledby="titulo-hero" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="grid-lines absolute inset-0 [mask-image:radial-gradient(70%_60%_at_75%_45%,black,transparent)]"
      />
      <div aria-hidden="true" className="grain absolute inset-0 opacity-70" />

      <div className={`container-x relative grid items-center gap-16 pb-24 lg:grid-cols-12 lg:gap-10 lg:pb-32 ${CONFIG.rascunho ? 'pt-[148px] lg:pt-[184px]' : 'pt-[116px] lg:pt-[152px]'}`}>
        <div className="lg:col-span-7">
          <p className="eyebrow rise mb-7 flex items-start gap-3 text-teal-deep" style={{ '--d': '0s' } as CSSProperties}>
            <span aria-hidden="true" className="mt-[0.3em] block size-2 shrink-0 bg-teal-deep" />
            <span>Odontologia estética e Dentística · Alfenas - MG</span>
          </p>

          <h1 id="titulo-hero" className="text-[2.75rem] leading-[1.02] text-ink sm:text-6xl lg:text-[4.6rem] xl:text-[5.1rem]">
            <CutReveal text="Restaurar com *precisão*, cuidar com atenção." />
          </h1>

          <p className="rise mt-8 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl" style={{ '--d': '0.55s' } as CSSProperties}>
            Restaurações, estética do sorriso e próteses, com planejamento individual e explicações claras.
          </p>

          <div className="rise mt-10 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ '--d': '0.75s' } as CSSProperties}>
            <MagneticLink href={waLink()} external className="btn-primary">
              <IconWhatsApp className="size-5" />
              Agendar minha avaliação
            </MagneticLink>
            <a
              href="#atendimentos"
              onClick={(e) => {
                e.preventDefault()
                scrollToHash('#atendimentos')
              }}
              className="btn-ghost group"
            >
              Conhecer os atendimentos
              <IconArrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>

          <dl className="rise mt-14 grid max-w-xl grid-cols-1 gap-x-10 gap-y-5 border-t border-sand/70 pt-7 text-sm sm:grid-cols-2" style={{ '--d': '0.95s' } as CSSProperties}>
            <div>
              <dt className="eyebrow text-ink-soft">Profissional</dt>
              <dd className="mt-1.5 font-medium text-ink">
                {CONFIG.nome}
                <span className="block font-normal text-ink-soft">
                  {CONFIG.profissao}
                  {cro && ` · ${cro}`}
                </span>
                {exibirEspecialista() && <span className="block font-normal text-ink-soft">Especialista em {CONFIG.especialidade}</span>}
              </dd>
            </div>
            {h && (
              <div>
                <dt className="eyebrow text-ink-soft">Com hora marcada</dt>
                <dd className="mt-1.5 font-medium text-ink">
                  {h.dias}
                  <span className="block font-normal text-ink-soft">{h.horas}</span>
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="relative pb-10 lg:col-span-5">
          <HeroComposition />
        </div>
      </div>
    </section>
  )
}
