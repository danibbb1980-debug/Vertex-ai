import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'
import { faixa } from '../horarios'
import { BotaoInstagram, BotaoWhats, Enfase } from './ui'

export function Contato() {
  const e = CONFIG.endereco
  const [hoje, setHoje] = useState<number | null>(null)
  const mapaRef = useRef<HTMLDivElement>(null)
  const [mapa, setMapa] = useState(false)
  useEffect(() => setHoje(new Date().getDay()), [])
  // Mapa só é carregado quando se aproxima da tela.
  useEffect(() => {
    const el = mapaRef.current
    if (!el || !e.mapaEmbed) return
    const io = new IntersectionObserver((es) => es[0].isIntersecting && (setMapa(true), io.disconnect()), { rootMargin: '300px' })
    io.observe(el)
    return () => io.disconnect()
  }, [e.mapaEmbed])

  const ordem = [...CONFIG.horarios].sort((a, b) => ((a.diaSemana + 6) % 7) - ((b.diaSemana + 6) % 7))
  return (
    <section id="contato" aria-labelledby="titulo-contato" className="border-t border-fio bg-areia">
      <div className="mx-auto grid max-w-[1320px] grid-cols-12 gap-x-6 gap-y-14 px-5 py-24 sm:px-8 lg:py-36">
        <div className="col-span-12 lg:col-span-5">
          <p className="rotulo text-terracota-escuro">Localização e contato</p>
          <h2 id="titulo-contato" className="mt-6 text-[clamp(2.4rem,5vw,3.9rem)] tracking-[-0.03em]">
            <Enfase texto="Venha nos *visitar*." />
          </h2>
          <address className="mt-10 not-italic">
            <p className="font-display text-[1.6rem] leading-[1.2] tracking-[-0.015em]">
              {e.logradouro}
              <br />
              {e.bairro}, {e.cidade} - {e.uf}
            </p>
            <p className="num mt-2 text-grafite-2">CEP {e.cep}</p>
          </address>

          <h3 className="rotulo mt-12 !font-sans text-grafite-2">Horários</h3>
          <dl className="mt-4 border-t border-fio">
            {ordem.map((h) => {
              const atual = hoje === h.diaSemana
              return (
                <div key={h.dia} className="flex justify-between gap-6 border-b border-fio py-3">
                  <dt className={atual ? 'font-semibold' : ''}>
                    {h.dia}
                    {atual && <span className="rotulo ml-3 !text-[0.625rem] text-terracota-escuro">Hoje</span>}
                  </dt>
                  <dd className={`num ${h.abre ? '' : 'text-grafite-2'}`}>{faixa(h)}</dd>
                </div>
              )
            })}
          </dl>
          <p className="mt-4 text-[0.95rem] text-grafite-2">{CONFIG.avisoHorarios}</p>
        </div>

        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          {e.mapaEmbed && (
            <div ref={mapaRef} className="relative aspect-[4/5] w-full border border-grafite bg-areia-2 sm:aspect-[4/3] lg:aspect-[5/6]">
              {mapa ? (
                <iframe
                  title={`Mapa: ${e.logradouro}, ${e.bairro}, ${e.cidade} - ${e.uf}`}
                  src={e.mapaEmbed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full grayscale-[35%] sepia-[12%]"
                />
              ) : (
                <span className="sr-only">O mapa é carregado ao rolar até aqui.</span>
              )}
            </div>
          )}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {e.rota && (
              <a href={e.rota} target="_blank" rel="noopener noreferrer" className="btn btn-secundario">
                <span>Como chegar</span>
                <span className="sr-only"> (abre o Google Maps em nova aba)</span>
              </a>
            )}
            <BotaoWhats rotuloAcessivel="Agendar pelo WhatsApp">Agendar pelo WhatsApp</BotaoWhats>
            <BotaoInstagram />
          </div>
        </div>
      </div>
    </section>
  )
}
