import { useState } from 'react'
import { CONFIG } from '../config'
import { resumoHorarios } from '../lib/horarios'
import { waLink } from '../lib/whatsapp'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import { IconArrowUpRight, IconClock, IconPin, IconWhatsApp } from '../components/Icons'

export function Localizacao() {
  const [mapa, setMapa] = useState(false)
  const e = CONFIG.endereco
  const fachada = CONFIG.fotos.fachada.trim()
  return (
    <section id="contato" aria-labelledby="titulo-contato" className="relative py-24 lg:py-36">
      <div className="container-x">
        <SectionHeading id="titulo-contato" label="Localização e contato" title="Venha *conhecer* o consultório." />

        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          <Reveal className="flex flex-col border border-ink/10 bg-paper p-7 sm:p-9 lg:col-span-5">
            <div className="flex gap-4">
              <IconPin className="mt-1 size-5 shrink-0 text-teal-deep" />
              <address className="not-italic">
                <p className="eyebrow text-ink-soft">Endereço</p>
                <p className="mt-2 text-[1.05rem] text-ink">
                  {e.rua}, {e.complemento}
                  <br />
                  {e.bairro}, {e.cidade} - {e.uf}
                  <br />
                  CEP {e.cep}
                </p>
              </address>
            </div>
            <div className="my-7 h-px bg-ink/10" />
            <div className="flex gap-4">
              <IconClock className="mt-1 size-5 shrink-0 text-teal-deep" />
              <div className="flex-1">
                <p className="eyebrow text-ink-soft">Horários, com agendamento</p>
                <dl className="mt-2 space-y-1.5 text-[1rem]">
                  {resumoHorarios().map((h) => (
                    <div key={h.dias} className="flex justify-between gap-4 border-b border-dotted border-ink/15 pb-1.5">
                      <dt className="text-ink">{h.dias}</dt>
                      <dd className={h.horas === 'Fechado' ? 'text-ink-soft' : 'text-ink'}>{h.horas}</dd>
                    </div>
                  ))}
                </dl>
                {CONFIG.observacaoHorarios && <p className="mt-3 text-sm text-ink-soft">{CONFIG.observacaoHorarios}</p>}
              </div>
            </div>

            {fachada && (
              <figure className="mt-8 flex items-center gap-4">
                <img src={fachada} alt="Fachada do edifício onde fica o consultório" width={197} height={100} loading="lazy" decoding="async" className="h-[76px] w-auto border border-ink/10" />
                <figcaption className="text-sm text-ink-soft">Fachada do edifício. O consultório fica na sala 206.</figcaption>
              </figure>
            )}

            <div className="mt-auto flex flex-col gap-3 pt-9 sm:flex-row">
              <a href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost flex-1">
                Como chegar
                <IconArrowUpRight className="size-4" />
              </a>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1">
                <IconWhatsApp className="size-5" />
                {CONFIG.whatsappExibicao}
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="relative min-h-[380px] overflow-hidden border border-ink/10 bg-ivory-2 lg:col-span-7">
            {mapa ? (
              <iframe
                title={`Mapa: ${CONFIG.consultorio}, ${e.rua}, ${e.cidade}`}
                src={CONFIG.mapsEmbed}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <div aria-hidden="true" className="grid-lines absolute inset-0 opacity-80 [mask-image:radial-gradient(60%_60%_at_50%_50%,black,transparent)]" />
                <svg aria-hidden="true" viewBox="0 0 400 260" className="absolute inset-0 h-full w-full text-sand" preserveAspectRatio="xMidYMid slice">
                  <path d="M-10 190 C 80 170, 140 120, 210 128 S 330 90, 420 60" fill="none" stroke="currentColor" strokeWidth="10" opacity=".45" />
                  <path d="M120 -10 L 150 280" fill="none" stroke="currentColor" strokeWidth="6" opacity=".35" />
                  <path d="M-10 70 L 420 150" fill="none" stroke="currentColor" strokeWidth="4" opacity=".3" />
                </svg>
                <div className="relative flex flex-col items-center">
                  <span className="relative inline-flex size-14 items-center justify-center bg-teal-deep text-paper">
                    <IconPin className="size-6" />
                  </span>
                  <p className="mt-5 font-display text-[1.5rem] text-ink">{e.bairro}, {e.cidade}</p>
                  <p className="mt-1 text-sm text-ink-soft">{e.rua} · {e.complemento}</p>
                  <button type="button" onClick={() => setMapa(true)} className="btn-light mt-6 border border-ink/15">
                    Carregar mapa interativo
                  </button>
                  <p className="mt-3 max-w-xs text-xs text-ink-soft">O mapa é do Google e só é carregado se você pedir.</p>
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
