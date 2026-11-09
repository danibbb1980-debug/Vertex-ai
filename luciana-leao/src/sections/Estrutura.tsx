import { useEffect, useState } from 'react'
import { CONFIG, type DiaSemana } from '../config'
import { EnderecoTexto, Rotulo } from '../components/Comum'
import { IconeInstagram, IconeLocal, IconeWhatsApp } from '../components/Icones'
import { NOMES_DIAS, horaCurta, linkWhatsApp, temWhatsApp } from '../lib/dados'

/** Hoje no fuso de Poços de Caldas (America/Sao_Paulo). */
function diaHojeSP(): number {
  const nome = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'America/Sao_Paulo' }).format(new Date())
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(nome)
}

export function Estrutura() {
  const [hoje, setHoje] = useState<number | null>(null)
  useEffect(() => setHoje(diaHojeSP()), [])
  const dias = [...CONFIG.horarios].sort((a, b) => ((a.dia + 6) % 7) - ((b.dia + 6) % 7))
  const e = CONFIG.endereco
  if (!dias.length && !e.rua) return null

  return (
    <section id="horarios" className="secao" aria-labelledby="titulo-estrutura">
      <div className="container-site">
        <div className="max-w-3xl" data-revelar>
          <Rotulo className="mb-6">Funcionamento</Rotulo>
          <h2 id="titulo-estrutura" className="titulo-secao">
            Horários, endereço e <em>contato</em>.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-12">
          {dias.length > 0 && (
            <div className="rounded-[1.75rem] border border-filete bg-pedra-50 p-6 shadow-leve sm:p-9 lg:col-span-7" data-revelar>
              <table className="w-full border-collapse text-left">
                <caption className="mb-5 text-left font-serif text-2xl text-vinho">Horário de atendimento</caption>
                <thead className="sr-only">
                  <tr>
                    <th scope="col">Dia</th>
                    <th scope="col">Horário</th>
                  </tr>
                </thead>
                <tbody>
                  {dias.map((d) => {
                    const ehHoje = d.dia === hoje
                    return (
                      <tr key={d.dia} className={`border-t border-filete first:border-t-0 ${ehHoje ? 'bg-rose/55' : ''}`} aria-current={ehHoje ? 'date' : undefined}>
                        <th scope="row" className={`py-4 pl-3 pr-4 font-medium ${ehHoje ? 'text-vinho' : 'text-tinta'}`}>
                          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            {NOMES_DIAS[d.dia as DiaSemana]}
                            {ehHoje && <span className="rounded-full bg-vinho px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-pedra">Hoje</span>}
                          </span>
                        </th>
                        <td className={`whitespace-nowrap py-4 pr-3 text-right font-serif text-lg sm:text-xl ${d.fechado ? 'italic text-tinta-suave' : 'text-vinho'}`}>
                          {d.fechado || !d.abre || !d.fecha ? 'Fechado' : `${horaCurta(d.abre)} às ${horaCurta(d.fecha)}`}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {CONFIG.avisoFeriados && <p className="mt-5 border-t border-filete pt-5 text-[0.95rem] text-tinta-suave">{CONFIG.avisoFeriados}</p>}
            </div>
          )}

          <div className="grid gap-6 lg:col-span-5">
            {e.rua && (
              <div className="rounded-[1.75rem] bg-vinho p-7 text-pedra em-escuro sm:p-9" data-revelar>
                <IconeLocal className="text-lilas" width={26} height={26} />
                <h3 className="mt-5 font-serif text-2xl !text-pedra">Endereço</h3>
                <address className="mt-3 not-italic leading-relaxed text-pedra/90">
                  <EnderecoTexto />
                </address>
                {e.referencia && <p className="mt-4 font-serif text-lg italic text-[#e6d3ea]">{e.referencia}.</p>}
              </div>
            )}
            <div className="rounded-[1.75rem] border border-filete bg-pedra-50 p-7 shadow-leve sm:p-9" data-revelar>
              <h3 className="font-serif text-2xl">Contato</h3>
              <ul className="mt-4 space-y-1">
                {temWhatsApp && (
                  <li>
                    <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center gap-3 text-tinta hover:text-vinho">
                      <IconeWhatsApp className="text-vinho" />
                      <span>
                        WhatsApp <span className="font-semibold">{CONFIG.whatsappExibicao}</span>
                      </span>
                    </a>
                  </li>
                )}
                {CONFIG.instagram.url && (
                  <li>
                    <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center gap-3 break-all text-tinta hover:text-vinho">
                      <IconeInstagram className="shrink-0 text-vinho" />
                      {CONFIG.instagram.usuario}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
