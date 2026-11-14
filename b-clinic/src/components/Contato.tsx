import { useEffect, useRef, useState } from 'react'
import { CONFIG, filled } from '../config'
import { agendarUrl } from '../lib/links'
import { Botao } from './Botao'

const fmt = (h: string) => h.replace(':', 'h')

export function Contato() {
  const e = CONFIG.endereco
  const mapaRef = useRef<HTMLDivElement>(null)
  const [carregarMapa, setCarregarMapa] = useState(false)

  useEffect(() => {
    const el = mapaRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([en]) => {
        if (en.isIntersecting) {
          setCarregarMapa(true)
          io.disconnect()
        }
      },
      { rootMargin: '300px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const dias = CONFIG.horarios.filter((h) => h.dia !== 0 || filled(h.abre))

  return (
    <section id="contato" aria-labelledby="contato-titulo" className="bg-osso py-24 md:py-36">
      <div className="container-b">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="rotulo flex items-center gap-4 text-champanhe-escuro">
              <span aria-hidden="true" className="h-px w-10 bg-champanhe-escuro" />
              Localização e contato
            </p>
            <h2 id="contato-titulo" className="titulo mt-6 text-[clamp(2.4rem,5.4vw,4.25rem)]">
              Venha nos <span className="enfase">visitar</span>.
            </h2>

            <address className="mt-10 not-italic">
              <p className="rotulo text-pedra">Endereço</p>
              <p className="mt-3 text-xl leading-snug">
                {e.logradouro}
                <br />
                {e.bairro} · {e.cidade} - {e.uf}
                <br />
                <span className="num">CEP {e.cep}</span>
              </p>
            </address>

            <div className="mt-10">
              <p className="rotulo text-pedra" id="horarios-rotulo">
                Horários
              </p>
              <dl aria-labelledby="horarios-rotulo" className="mt-3 border-t border-filete">
                {dias.map((h) => (
                  <div key={h.dia} className="flex items-baseline justify-between border-b border-filete py-2.5">
                    <dt>{h.rotulo}</dt>
                    <dd className="num text-pedra">
                      {h.abre && h.fecha ? (
                        <>
                          {fmt(h.abre)} às {fmt(h.fecha)}
                        </>
                      ) : (
                        'Fechado'
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-[0.9375rem] text-pedra">{CONFIG.avisoHorarios}</p>
            </div>

            {filled(CONFIG.telefone) && (
              <p className="mt-10">
                <span className="rotulo block text-pedra">Telefone</span>
                <a href={CONFIG.telefoneLink} className="num mt-2 inline-flex min-h-12 items-center text-xl">
                  {CONFIG.telefone}
                </a>
              </p>
            )}
            {filled(CONFIG.email) && (
              <p className="mt-6">
                <span className="rotulo block text-pedra">E-mail</span>
                <a href={`mailto:${CONFIG.email}`} className="mt-2 inline-flex min-h-12 items-center text-xl">
                  {CONFIG.email}
                </a>
              </p>
            )}
          </div>

          <div className="lg:col-span-7 lg:pt-16">
            <div ref={mapaRef} className="relative aspect-[4/5] w-full border border-preto/20 bg-osso-2 sm:aspect-[4/3]">
              {carregarMapa && (
                <iframe
                  title={`Mapa: ${e.logradouro}, ${e.bairro}, ${e.cidade}`}
                  src={e.mapaEmbed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full grayscale-[35%] contrast-[0.95]"
                />
              )}
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Botao href={agendarUrl()} externo>
                Agendar avaliação
              </Botao>
              <Botao href={e.rota} externo variante="linha">
                Como chegar
              </Botao>
              {filled(CONFIG.telefone) && (
                <Botao href={CONFIG.telefoneLink} variante="linha">
                  Ligar
                </Botao>
              )}
              <Botao href={CONFIG.instagram.url} externo variante="linha">
                Ver no Instagram
              </Botao>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
