import { useState } from 'react'
import { CONFIG, enderecoTexto } from '../config'
import { faixaHorario, temTexto, waLink } from '../lib/util'
import { Reveal, SectionHead } from './Base'
import { IconArrowUpRight, IconChat, IconClock, IconInstagram, IconPin } from './Icons'

function MapaSobDemanda() {
  const [ativo, setAtivo] = useState(false)
  const src = `https://www.google.com/maps?q=${encodeURIComponent(CONFIG.mapsBusca)}&z=16&output=embed`
  return (
    <div className="relative aspect-square overflow-hidden rounded-[26px] sm:aspect-[4/3] border border-line bg-paper lg:aspect-auto lg:h-full lg:min-h-[460px]">
      {ativo ? (
        <iframe
          title={`Mapa: ${CONFIG.nome}, ${enderecoTexto()}`}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <>
          {/* mapa ilustrado, em traço, até a pessoa pedir o mapa do Google */}
          <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full text-ink" aria-hidden="true">
            <rect width="400" height="300" fill="#fbf9f5" />
            <g stroke="currentColor" fill="none" opacity=".09" strokeWidth="1">
              {Array.from({ length: 16 }, (_, i) => (
                <path key={'v' + i} d={`M${i * 26} 0V300`} />
              ))}
              {Array.from({ length: 12 }, (_, i) => (
                <path key={'h' + i} d={`M0 ${i * 26}H400`} />
              ))}
            </g>
            <g stroke="#d9cfbd" strokeWidth="14" fill="none" strokeLinecap="round">
              <path d="M-10 190C80 170 150 175 230 150s120-40 190-30" />
              <path d="M120 -10C130 80 150 150 170 310" />
              <path d="M300 -10c-20 90-10 180 30 320" />
            </g>
            <g stroke="#ece3d4" strokeWidth="8" fill="none" strokeLinecap="round">
              <path d="M-10 90c90 10 170 0 420 20" />
              <path d="M40 310c20-60 40-120 30-200" />
            </g>
            <path d="M-10 190C80 170 150 175 230 150s120-40 190-30" stroke="#2c6b5a" strokeWidth="1.4" strokeDasharray="4 5" fill="none" />
          </svg>
          <div className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-full text-sage-deep">
            <span className="absolute left-1/2 top-full h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sage/25" />
            <svg width="44" height="54" viewBox="0 0 44 54" aria-hidden="true" className="relative drop-shadow-md">
              <path d="M22 53S4 34 4 21a18 18 0 0 1 36 0c0 13-18 32-18 32Z" fill="#0f2d28" />
              <circle cx="22" cy="21" r="7" fill="#a9d0c1" />
            </svg>
          </div>
          <div className="absolute inset-x-4 bottom-4 flex flex-col gap-3 rounded-2xl bg-ivory/95 p-4 shadow-sm ring-1 ring-line backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              <span className="font-semibold text-ink">{CONFIG.endereco.rua}</span> · {CONFIG.endereco.bairro}
            </p>
            <button type="button" onClick={() => setAtivo(true)} className="btn btn-ghost !min-h-12 !py-2 !text-sm">
              Mostrar mapa do Google
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export function Localizacao() {
  if (!CONFIG.secoes.localizacao) return null
  return (
    <section id="contato" aria-labelledby="t-contato" className="sec bg-shell">
      <div className="wrap">
        <SectionHead
          id="t-contato"
          numero="07"
          rotulo="Localização e contato"
          titulo={
            <>
              Venha nos <em>visitar</em>.
            </>
          }
          intro={`No Centro de ${CONFIG.endereco.cidade}, com atendimento de hora marcada.`}
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          <Reveal className="rounded-[26px] border border-line bg-paper p-7 md:p-9 lg:col-span-5">
            <div className="flex gap-4">
              <IconPin size={24} className="mt-1 shrink-0 text-sage-deep" />
              <div>
                <h3 className="eyebrow text-sage-deep">Endereço</h3>
                <address className="mt-2 text-lg not-italic text-ink">{enderecoTexto()}</address>
                <p className="mt-2 text-muted">WhatsApp {CONFIG.telefoneExibicao}</p>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <IconClock size={24} className="mt-1 shrink-0 text-sage-deep" />
              <div className="flex-1">
                <h3 className="eyebrow text-sage-deep">Horários</h3>
                <table className="mt-3 w-full text-[0.98rem]">
                  <caption className="sr-only">Horário de funcionamento</caption>
                  <tbody>
                    {CONFIG.horarios.map((h) => (
                      <tr key={h.dia} className="border-b border-line/70 last:border-0">
                        <th scope="row" className="py-2 text-left font-normal text-text">
                          {h.nome}
                        </th>
                        <td className={`py-2 text-right tabular-nums ${h.abre ? 'font-medium text-ink' : 'text-muted'}`}>
                          {faixaHorario(h)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {temTexto(CONFIG.avisoHorario) && <p className="mt-3 text-sm text-muted">{CONFIG.avisoHorario}</p>}
              </div>
            </div>

            <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <a href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <IconPin size={18} /> Como chegar
              </a>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                <IconChat size={18} /> WhatsApp
              </a>
            </div>
            <a
              href={CONFIG.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-12 items-center gap-2 font-medium text-ink"
            >
              <IconInstagram size={20} className="text-sage-deep" />
              <span className="link">{CONFIG.instagram.usuario}</span>
              <IconArrowUpRight size={15} className="opacity-60" />
            </a>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-7">
            <MapaSobDemanda />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function CtaFinal() {
  if (!CONFIG.secoes.ctaFinal) return null
  return (
    <section aria-labelledby="t-cta" className="on-dark relative isolate overflow-hidden bg-ink py-24 text-ivory md:py-36">
      <div aria-hidden="true" className="blueprint-dark absolute inset-0 -z-10" />
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 -z-10 h-[70%] w-full text-sage"
      >
        <path d="M-20 400C200 140 420 60 600 60s400 80 620 340" fill="none" stroke="currentColor" strokeWidth="1" opacity=".35" />
        <path d="M80 400C260 200 440 140 600 140s340 60 520 260" fill="none" stroke="currentColor" strokeWidth="1" opacity=".22" />
        <path d="M200 400C330 260 470 220 600 220s270 40 400 180" fill="none" stroke="currentColor" strokeWidth="1" opacity=".14" />
      </svg>
      <div className="wrap text-center">
        <Reveal>
          <p className="eyebrow text-sage-soft">Agende pelo WhatsApp</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 id="t-cta" className="h2 mx-auto mt-6 max-w-4xl !text-[clamp(2.5rem,6.4vw,5rem)] text-ivory">
            Sua avaliação é o <em>primeiro passo</em>.
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="mt-11 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-light">
              <IconChat size={19} /> Agendar pelo WhatsApp
            </a>
            <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <IconInstagram size={19} /> Ver no Instagram
            </a>
          </div>
          {CONFIG.secoes.agendar && (
            <p className="mt-7 text-ivory/75">
              Prefere escolher dia e horário?{' '}
              <a href="#agendar" className="link font-medium text-ivory">
                Solicite pelo formulário
              </a>
              .
            </p>
          )}
        </Reveal>
      </div>
    </section>
  )
}

export function Footer() {
  const rt = CONFIG.responsavelTecnico
  const semana = CONFIG.horarios.find((h) => h.abre && h.fecha)
  return (
    <footer className="on-dark border-t border-ivory/10 bg-ink text-ivory/80">
      <div className="wrap grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="font-serif text-3xl text-ivory">
            CIOM <em className="text-sage-soft">Odontologia</em>
          </p>
          <p className="mt-3 max-w-xs text-sm">Odontologia com planejamento individual em {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}.</p>
        </div>
        <div className="md:col-span-3">
          <h2 className="eyebrow !text-[0.7rem] text-sage-soft">Endereço</h2>
          <address className="mt-3 text-sm not-italic leading-relaxed">{enderecoTexto()}</address>
          {semana && (
            <p className="mt-3 text-sm">
              Seg a sex · {faixaHorario(semana)}
              <br />
              {CONFIG.avisoHorario}
            </p>
          )}
        </div>
        <div className="md:col-span-3">
          <h2 className="eyebrow !text-[0.7rem] text-sage-soft">Contato</h2>
          <ul className="mt-2 text-sm">
            <li>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center">
                WhatsApp {CONFIG.telefoneExibicao}
              </a>
            </li>
            <li>
              <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center">
                Instagram {CONFIG.instagram.usuario}
              </a>
            </li>
            <li>
              <a href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center">
                Google Maps
              </a>
            </li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <h2 className="eyebrow !text-[0.7rem] text-sage-soft">Site</h2>
          <ul className="mt-2 text-sm">
            <li>
              <a href="/privacidade.html" className="link inline-flex min-h-11 items-center">
                Privacidade
              </a>
            </li>
            <li>
              <a href="#inicio" className="link inline-flex min-h-11 items-center">
                Voltar ao topo
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="wrap">
       <div className="flex flex-col gap-2 border-t border-ivory/10 py-7 text-xs text-ivory/65 md:flex-row md:items-center md:justify-between">
        <p>Conteúdo informativo; a indicação de cada tratamento depende de avaliação individual.</p>
        <p>
          {temTexto(rt.nome) && temTexto(rt.cro) && (
            <>
              Responsável técnico: {rt.nome} · {rt.cro} ·{' '}
            </>
          )}
          © {new Date().getFullYear()} {CONFIG.nome}
        </p>
       </div>
      </div>
      {/* espaço para a barra fixa do celular não cobrir o rodapé */}
      <div aria-hidden="true" className="h-[84px] md:hidden" />
    </footer>
  )
}
