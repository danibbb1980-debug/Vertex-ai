import { useState } from 'react'
import { CONFIG } from '../config'
import { enderecoCompleto } from '../lib/utils'
import { TabelaHorarios } from './Horarios'
import { BotaoWhatsApp, CabecalhoSecao, IconeInstagram, IconeMapa, Revelar, Seta } from './ui'

/** Mapa do Google carregado só quando a pessoa pede (sem cookies de terceiros antes disso). */
function Mapa() {
  const [carregar, setCarregar] = useState(false)
  const q = encodeURIComponent(enderecoCompleto())
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-choco/10 bg-nude-claro md:aspect-auto md:h-full md:min-h-[26rem]">
      {carregar ? (
        <iframe
          title={`Mapa: ${enderecoCompleto()}`}
          src={`https://www.google.com/maps?q=${q}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div className="degrade-nude absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-center">
          {/* ruas estilizadas, decorativas */}
          <svg aria-hidden="true" className="absolute inset-0 h-full w-full text-creme/80" preserveAspectRatio="none" viewBox="0 0 400 300" fill="none" stroke="currentColor">
            <path d="M-10 210 C 90 180, 160 240, 410 170" strokeWidth="10" />
            <path d="M120 -10 C 140 90, 110 180, 170 310" strokeWidth="8" />
            <path d="M260 -10 L 300 310" strokeWidth="6" />
            <path d="M-10 80 L 410 110" strokeWidth="5" />
          </svg>
          <span className="relative flex size-14 items-center justify-center rounded-full bg-choco text-creme shadow-lg">
            <IconeMapa className="size-6" />
          </span>
          <p className="relative max-w-xs font-serif text-[1.25rem] leading-snug text-choco">{CONFIG.endereco.rua}, {CONFIG.endereco.bairro}</p>
          <button type="button" onClick={() => setCarregar(true)} className="btn btn-secundario relative bg-creme/70">
            Mostrar mapa
          </button>
          <p className="relative text-xs text-choco/80">O mapa é carregado do Google Maps ao clicar.</p>
        </div>
      )}
    </div>
  )
}

export function Localizacao() {
  return (
    <section id="contato" aria-labelledby="titulo-contato" className="bg-nude-claro/45 py-24 md:py-32" data-no-linha>
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <CabecalhoSecao
            id="titulo-contato"
            rotulo="Localização e contato"
            titulo={
              <>
                Venha nos <em>visitar</em>.
              </>
            }
          />
          <Revelar atraso={0.05} className="mt-8">
            <address className="not-italic">
              <p className="font-serif text-[1.35rem] leading-snug text-choco">{CONFIG.endereco.rua}</p>
              <p className="text-choco/85">
                {CONFIG.endereco.bairro}, {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}
                <br />
                CEP {CONFIG.endereco.cep}
              </p>
            </address>
            <div className="mt-8">
              <TabelaHorarios legenda="Horários de atendimento" />
              <p className="mt-3 text-sm text-choco/80">{CONFIG.avisoHorarios}</p>
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <BotaoWhatsApp />
              {CONFIG.maps && (
                <a href={CONFIG.maps} target="_blank" rel="noopener noreferrer" className="btn btn-secundario">
                  <IconeMapa className="size-[1.1rem]" /> Como chegar <Seta />
                </a>
              )}
            </div>
            <ul className="mt-6 space-y-1 text-[0.98rem]">
              {CONFIG.whatsapp && <li>WhatsApp: <span className="font-medium">{CONFIG.whatsappExibicao}</span></li>}
              {CONFIG.instagram && (
                <li>
                  <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 hover:text-ouro-esc">
                    <IconeInstagram className="size-[1.1rem] text-ouro" /> {CONFIG.instagramUsuario}
                  </a>
                </li>
              )}
            </ul>
          </Revelar>
        </div>
        <Revelar atraso={0.1} className="lg:col-span-7">
          <Mapa />
        </Revelar>
      </div>
    </section>
  )
}
