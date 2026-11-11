import { useState } from 'react'
import { CONFIG } from '../config'
import { enderecoLinha1, enderecoLinha2, linkWhatsApp, resumoHorarios, temTexto } from '../lib/dados'
import { Mosaico } from '../brand/Marca'
import { TituloEnfase } from './Enfase'
import { IconeInstagram, IconeMapa, IconeWhatsApp } from './Icones'

/** O mapa do Google só carrega quando a pessoa pede (sem cookies de terceiros antes disso). */
function Mapa() {
  const [ativo, setAtivo] = useState(false)
  if (!temTexto(CONFIG.maps.busca)) return null
  const src = `https://www.google.com/maps?q=${encodeURIComponent(CONFIG.maps.busca)}&output=embed`
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] rounded-tr-[45%] bg-salvia-clara lg:aspect-auto lg:h-full lg:min-h-[28rem]">
      {ativo ? (
        <iframe
          title={`Mapa: ${CONFIG.nome}`}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-start justify-end gap-4 p-7 sm:p-10">
          <Mosaico className="absolute -right-4 -top-6 w-[42%] opacity-90 lg:w-[55%]" />
          <p className="relative max-w-[13rem] font-display text-[1.9rem] leading-tight text-tinta">
            {CONFIG.endereco.bairro}, {CONFIG.endereco.cidade}
          </p>
          <button type="button" onClick={() => setAtivo(true)} className="botao botao-secundario relative bg-creme-claro">
            <IconeMapa /> Mostrar mapa aqui
          </button>
          <p className="relative text-[0.8rem] text-tinta-suave">O mapa é carregado do Google Maps.</p>
        </div>
      )}
    </div>
  )
}

export function Contato() {
  const zap = linkWhatsApp()
  const horarios = resumoHorarios()
  return (
    <section id="contato" aria-labelledby="titulo-contato" className="bg-creme-claro py-20 lg:py-32">
      <div className="mx-auto grid max-w-[84rem] gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-10">
        <div className="lg:col-span-6">
          <p className="rotulo mb-5 text-terracota-texto">Localização e contato</p>
          <h2 id="titulo-contato" className="text-[clamp(2.4rem,5.6vw,4.6rem)] text-tinta">
            <TituloEnfase texto="Venha nos *visitar*." />
          </h2>

          <dl className="mt-10 border-t border-tinta/70">
            <div className="grid gap-1 border-b border-fio py-5 sm:grid-cols-[9rem_1fr]">
              <dt className="rotulo pt-1 text-tinta-suave">Endereço</dt>
              <dd>
                <address className="not-italic">
                  {enderecoLinha1()}
                  <br />
                  {enderecoLinha2()}
                </address>
              </dd>
            </div>
            {horarios.length > 0 && (
              <div className="grid gap-1 border-b border-fio py-5 sm:grid-cols-[9rem_1fr]">
                <dt className="rotulo pt-1 text-tinta-suave">Horários</dt>
                <dd>
                  <ul>
                    {horarios.map((h) => (
                      <li key={h.dias} className="flex flex-wrap justify-between gap-x-6">
                        <span>{h.dias}</span>
                        <span className="tabular-nums">{h.texto}</span>
                      </li>
                    ))}
                  </ul>
                  {CONFIG.avisoHorarios && <p className="mt-2 text-[0.9rem] text-tinta-suave">{CONFIG.avisoHorarios}</p>}
                </dd>
              </div>
            )}
            {zap && (
              <div className="grid gap-1 border-b border-fio py-5 sm:grid-cols-[9rem_1fr]">
                <dt className="rotulo pt-1 text-tinta-suave">WhatsApp</dt>
                <dd>
                  <a href={zap} target="_blank" rel="noopener noreferrer" className="link-fio">
                    {CONFIG.whatsappExibicao}
                  </a>
                </dd>
              </div>
            )}
            {CONFIG.instagram.url && (
              <div className="grid gap-1 border-b border-fio py-5 sm:grid-cols-[9rem_1fr]">
                <dt className="rotulo pt-1 text-tinta-suave">Instagram</dt>
                <dd>
                  <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="link-fio">
                    {CONFIG.instagram.usuario}
                  </a>
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {zap && (
              <a href={zap} target="_blank" rel="noopener noreferrer" className="botao botao-primario">
                <IconeWhatsApp /> Agendar pelo WhatsApp
              </a>
            )}
            {CONFIG.maps.url && (
              <a href={CONFIG.maps.url} target="_blank" rel="noopener noreferrer" className="botao botao-secundario">
                <IconeMapa /> Ver no Google Maps
              </a>
            )}
            {CONFIG.instagram.url && (
              <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="botao botao-secundario">
                <IconeInstagram /> Instagram
              </a>
            )}
          </div>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <Mapa />
        </div>
      </div>
    </section>
  )
}
