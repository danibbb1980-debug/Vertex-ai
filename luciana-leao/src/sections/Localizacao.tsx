import { useState } from 'react'
import { CONFIG } from '../config'
import { OrquideaMarca } from '../brand/Logo'
import { EnderecoTexto, LinkWhatsApp, Rotulo } from '../components/Comum'
import { IconeExterno, IconeInstagram, IconeLocal, IconeRelogio } from '../components/Icones'
import { enderecoCompleto, horariosResumidos } from '../lib/dados'

function MapaSobDemanda() {
  const [carregar, setCarregar] = useState(false)
  const src = `https://www.google.com/maps?q=${encodeURIComponent(enderecoCompleto())}&output=embed`
  if (carregar) {
    return <iframe title={`Mapa: ${enderecoCompleto()}`} src={src} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-full w-full border-0" />
  }
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#efe6e3]">
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full text-pedra-50" viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor">
        <path d="M-20 300C120 260 200 330 320 280S520 180 640 210" strokeWidth="18" />
        <path d="M-20 300C120 260 200 330 320 280S520 180 640 210" strokeWidth="1" className="text-filete" />
        <path d="M180 -20C210 120 160 220 230 440" strokeWidth="10" />
        <path d="M440 -20C420 140 470 260 430 440" strokeWidth="8" />
        <path d="M-20 120C160 140 300 90 640 110" strokeWidth="6" />
        <path d="M60 440C120 360 80 250 140 160" strokeWidth="5" />
      </svg>
      <div className="relative flex flex-col items-center px-6 text-center">
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-vinho text-pedra shadow-cartao">
          <OrquideaMarca className="h-6 w-8" />
          <span aria-hidden="true" className="absolute -bottom-2 h-4 w-4 rotate-45 bg-vinho" />
        </span>
        <button type="button" onClick={() => setCarregar(true)} className="btn btn-secundario mt-7 bg-pedra-50">
          Mostrar o mapa aqui
        </button>
        <p className="mt-3 max-w-xs text-sm text-tinta-suave">O mapa é carregado do Google só quando você pedir.</p>
      </div>
    </div>
  )
}

export function Localizacao() {
  const e = CONFIG.endereco
  if (!e.rua) return null
  const horarios = horariosResumidos()
  return (
    <section id="contato" className="secao" aria-labelledby="titulo-local">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5" data-revelar>
            <Rotulo className="mb-6">Localização e contato</Rotulo>
            <h2 id="titulo-local" className="titulo-secao">
              Venha nos <em>visitar</em>.
            </h2>

            <dl className="mt-10 space-y-7">
              <div className="flex gap-4">
                <dt className="mt-0.5">
                  <IconeLocal className="text-vinho" width={22} height={22} />
                  <span className="sr-only">Endereço</span>
                </dt>
                <dd>
                  <address className="not-italic text-tinta">
                    <EnderecoTexto />
                  </address>
                  {e.referencia && <p className="mt-1 font-serif italic text-vinho">{e.referencia}</p>}
                </dd>
              </div>
              {horarios.length > 0 && (
                <div className="flex gap-4">
                  <dt className="mt-0.5">
                    <IconeRelogio className="text-vinho" width={22} height={22} />
                    <span className="sr-only">Horários</span>
                  </dt>
                  <dd className="text-tinta">
                    {horarios.map((h) => (
                      <span key={h.rotulo} className="block">
                        {h.rotulo}: {h.fechado ? 'fechado' : h.texto}
                      </span>
                    ))}
                    {CONFIG.avisoFeriados && <span className="mt-1 block text-[0.95rem] text-tinta-suave">{CONFIG.avisoFeriados}</span>}
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {CONFIG.mapsUrl && (
                <a href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primario" aria-label="Como chegar (abre o Google Maps em nova aba)">
                  Como chegar
                  <IconeExterno width={18} height={18} />
                </a>
              )}
              <LinkWhatsApp className="btn btn-secundario" rotuloAcessivel={`WhatsApp ${CONFIG.whatsappExibicao}`}>
                {CONFIG.whatsappExibicao}
              </LinkWhatsApp>
              {CONFIG.instagram.url && (
                <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-secundario" aria-label="Instagram da Dra. Luciana Leão (abre em nova aba)">
                  <IconeInstagram />
                  Instagram
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-7" data-revelar>
            <div className="h-[22rem] overflow-hidden rounded-[1.75rem] border border-filete shadow-cartao sm:h-[28rem] lg:h-full lg:min-h-[30rem]">
              <MapaSobDemanda />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
