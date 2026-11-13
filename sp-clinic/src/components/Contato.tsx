import { useEffect, useRef, useState } from 'react'
import { CONFIG, enderecoLinha, hm, temWhatsapp, waLink } from '../config'
import { IconeInstagram, IconeRota, IconeTelefone, IconeWhatsapp } from './Icones'

export function Contato() {
  const mapaRef = useRef<HTMLDivElement>(null)
  const [carregarMapa, setCarregarMapa] = useState(false)

  useEffect(() => {
    const el = mapaRef.current
    if (!el || !CONFIG.mapaEmbed) return
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setCarregarMapa(true)
          io.disconnect()
        }
      },
      { rootMargin: '300px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const hoje = new Date().getDay()

  return (
    <section id="contato" aria-labelledby="titulo-contato" className="bg-areia">
      <div className="mx-auto grid max-w-[1320px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:py-36">
        <div className="lg:col-span-6">
          <p className="rotulo text-caramelo-queimado">Localização e contato</p>
          <h2 id="titulo-contato" className="mt-5 text-[clamp(2.6rem,7vw,5rem)]">
            Venha nos <em className="not-italic text-caramelo-queimado">visitar</em>.
          </h2>

          <address className="mt-10 not-italic">
            <p className="font-display text-[clamp(1.6rem,3.4vw,2.2rem)] leading-tight">{CONFIG.endereco.rua}</p>
            <p className="mt-2 text-cafe-suave">
              {CONFIG.endereco.bairro}, {CONFIG.endereco.cidade} - {CONFIG.endereco.uf} ·{' '}
              <span className="num">CEP {CONFIG.endereco.cep}</span>
            </p>
          </address>

          <div className="mt-10">
            <h3 className="rotulo !font-sans !tracking-[0.22em] text-cafe-suave">Horários</h3>
            <dl className="mt-4 border-t border-fio">
              {CONFIG.horarios.map((h) => (
                <div
                  key={h.dia}
                  className={`flex items-baseline justify-between gap-6 border-b border-fio py-2.5 ${
                    h.diaSemana === hoje ? 'font-medium' : ''
                  }`}
                >
                  <dt>
                    {h.dia}
                    {h.diaSemana === hoje && <span className="sr-only"> (hoje)</span>}
                  </dt>
                  <dd className={`num ${h.abre ? '' : 'text-cafe-suave'}`}>
                    {h.abre && h.fecha ? `${hm(h.abre)} às ${hm(h.fecha)}` : 'Fechado'}
                  </dd>
                </div>
              ))}
            </dl>
            {CONFIG.avisoHorario && <p className="mt-3 text-[0.92rem] text-cafe-suave">{CONFIG.avisoHorario}</p>}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <a href={CONFIG.rotaUrl} target="_blank" rel="noopener noreferrer" className="botao botao-cheio">
              <IconeRota />
              Como chegar
            </a>
            {temWhatsapp && (
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="botao botao-linha">
                <IconeWhatsapp />
                WhatsApp
              </a>
            )}
            {CONFIG.telefone.tel && (
              <a href={`tel:${CONFIG.telefone.tel}`} className="botao botao-linha">
                <IconeTelefone />
                Ligar
              </a>
            )}
            {CONFIG.instagram.url && (
              <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="botao botao-linha">
                <IconeInstagram />
                Ver no Instagram
              </a>
            )}
          </div>
          <ul className="mt-8 space-y-1 text-[0.95rem] text-cafe-suave">
            {temWhatsapp && <li className="num">WhatsApp e telefone: {CONFIG.telefone.exibicao}</li>}
            {CONFIG.email && (
              <li>
                E-mail:{' '}
                <a className="link-sublinhado text-cafe" href={`mailto:${CONFIG.email}`}>
                  {CONFIG.email}
                </a>
              </li>
            )}
            {CONFIG.instagram.usuario && <li>Instagram: {CONFIG.instagram.usuario}</li>}
          </ul>
        </div>

        {CONFIG.mapaEmbed && (
          <div className="lg:col-span-5 lg:col-start-8 lg:pt-28">
            <div
              ref={mapaRef}
              className="moldura-arco relative aspect-[4/5] w-full overflow-hidden bg-[#e3d3bd] ring-1 ring-cafe/15"
            >
              {carregarMapa && (
                <iframe
                  title={`Mapa com a localização da ${CONFIG.nome}: ${enderecoLinha}`}
                  src={CONFIG.mapaEmbed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0 grayscale-[35%] sepia-[18%]"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
