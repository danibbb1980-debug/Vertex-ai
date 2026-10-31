import { useState } from 'react'
import { CONFIG, enderecoCompleto } from '../config'
import { resumoHorarios } from '../lib/horarios'
import { waLink } from '../lib/whatsapp'
import { IconArrow, IconClock, IconInstagram, IconPin, IconWhatsApp } from '../components/Icons'
import { Reveal } from '../components/motion'
import { SectionHead } from '../components/SectionHead'

function Mapa() {
  const [carregar, setCarregar] = useState(false)
  const q = encodeURIComponent(enderecoCompleto())
  return (
    <div className="relative h-full min-h-[22rem] overflow-hidden rounded-[1.75rem] border border-line bg-sand/60">
      {carregar ? (
        <iframe
          title={`Mapa com a localização da ${CONFIG.nome}`}
          src={`https://www.google.com/maps?q=${q}&output=embed`}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8 text-center">
          {/* mapa estilizado em traço (decorativo) */}
          <svg aria-hidden viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
            <g fill="none" stroke="#B3A494" strokeWidth="1" opacity=".55">
              <path d="M-10 80 C 90 60, 160 120, 410 70" />
              <path d="M-10 190 C 120 210, 250 150, 410 210" />
              <path d="M120 -10 C 130 90, 100 200, 140 310" />
              <path d="M290 -10 C 270 110, 300 190, 280 310" />
              <path d="M-10 140 L 410 130" strokeDasharray="3 6" />
            </g>
          </svg>
          <div className="relative flex flex-col items-center gap-4 rounded-[50%] border border-copper/60 bg-paper/85 px-10 py-9 backdrop-blur-[2px]">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream text-copper-ink">
              <IconPin size={22} />
            </span>
            <p className="max-w-[13rem] text-sm leading-snug text-ink">
              {CONFIG.endereco.rua} · {CONFIG.endereco.bairro}
              <br />
              {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}
            </p>
          </div>
          <button type="button" onClick={() => setCarregar(true)} className="btn btn-ghost relative bg-paper/80">
            Ver mapa aqui
          </button>
        </div>
      )}
    </div>
  )
}

export function Contato() {
  const horarios = resumoHorarios()
  const wa = waLink()
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="py-24 md:py-36">
      <div className="container-n grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <SectionHead eyebrow="Localização e contato" id="contato-titulo" title="Venha nos *visitar*." />

          <Reveal delay={0.1} className="mt-12 space-y-10">
            <div className="flex gap-5">
              <IconPin className="mt-1 shrink-0 text-copper-ink" />
              <div>
                <h3 className="eyebrow text-[0.6875rem]">Endereço</h3>
                <address className="mt-2 not-italic text-lg leading-relaxed text-espresso">
                  {CONFIG.endereco.rua} - {CONFIG.endereco.bairro}
                  <br />
                  {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}, {CONFIG.endereco.cep}
                </address>
                {CONFIG.mapsUrl && (
                  <a href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer" className="link-arrow mt-1">
                    Como chegar <IconArrow />
                  </a>
                )}
              </div>
            </div>

            {horarios.length > 0 && (
              <div className="flex gap-5">
                <IconClock className="mt-1 shrink-0 text-copper-ink" />
                <div className="w-full max-w-sm">
                  <h3 className="eyebrow text-[0.6875rem]">Horários</h3>
                  <dl className="mt-3 divide-y divide-line border-y border-line">
                    {horarios.map((h) => (
                      <div key={h.dias} className="flex items-baseline justify-between gap-4 py-3">
                        <dt className="text-espresso">{h.dias}</dt>
                        <dd className={h.horas === 'Fechado' ? 'text-muted' : 'font-medium text-espresso'}>{h.horas}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-3 text-sm text-muted">{CONFIG.avisoHorarios}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              {wa && (
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <IconWhatsApp size={18} /> {CONFIG.telefoneExibicao}
                </a>
              )}
              {CONFIG.instagram && (
                <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  <IconInstagram size={18} /> {CONFIG.instagramUsuario}
                </a>
              )}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="lg:pt-24">
          <Mapa />
        </Reveal>
      </div>
    </section>
  )
}
