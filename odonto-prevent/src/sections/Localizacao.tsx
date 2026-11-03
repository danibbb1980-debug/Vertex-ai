import type { ReactNode } from 'react'
import { useState } from 'react'
import { CONFIG } from '../config'
import { enderecoCompleto, linkTelefone, linkWhatsapp } from '../lib/whatsapp'
import { textoHorario } from '../lib/horarios'
import { CabecalhoSecao } from '../components/CabecalhoSecao'
import { Revelar } from '../components/Revelar'
import { IconeInstagram, IconeLocal, IconeMapa, IconeRelogio, IconeSetaDiagonal, IconeTelefone, IconeWhatsapp } from '../components/Icones'

/** Mapa do Google carregado só quando a pessoa pede (sem cookies de terceiros antes disso). */
function Mapa() {
  const [carregar, setCarregar] = useState(false)
  const src = `https://www.google.com/maps?q=${encodeURIComponent(CONFIG.mapsEmbedQuery)}&output=embed`
  return (
    <div className="relative h-full min-h-[22rem] overflow-hidden rounded-[1.75rem] border border-linha bg-grafite-900">
      {carregar ? (
        <iframe
          title={`Mapa: ${CONFIG.nome}, ${enderecoCompleto()}`}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div className="grade-calendario absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-center text-white">
          <svg viewBox="0 0 200 200" className="w-40 text-menta" aria-hidden="true">
            <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(255,255,255,.1)" />
            <circle cx="100" cy="100" r="58" fill="none" stroke="rgba(255,255,255,.08)" strokeDasharray="2 6" />
            <path d="M20 128 C70 110 120 150 182 96" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="6" strokeLinecap="round" />
            <path d="M58 30 C80 90 96 120 120 186" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="4" strokeLinecap="round" />
            <path d="M100 112s-20-18-20-34a20 20 0 0 1 40 0c0 16-20 34-20 34Z" fill="#232427" stroke="currentColor" strokeWidth="2" />
            <circle cx="100" cy="78" r="6" fill="currentColor" />
          </svg>
          <p className="max-w-xs text-sm text-grafite-200">{enderecoCompleto()}</p>
          <button
            type="button"
            onClick={() => setCarregar(true)}
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 px-5 font-display text-sm font-medium transition-colors hover:border-menta hover:text-menta"
          >
            <IconeMapa tamanho={18} /> Carregar mapa do Google
          </button>
        </div>
      )}
    </div>
  )
}

function Linha({ icone, titulo, children }: { icone: ReactNode; titulo: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 border-t border-linha py-6">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-menta-suave text-menta-texto">{icone}</span>
      <div className="min-w-0">
        <h3 className="rotulo text-[0.7rem] text-tinta-suave">{titulo}</h3>
        <div className="mt-1.5 text-tinta">{children}</div>
      </div>
    </div>
  )
}

export function Localizacao() {
  const e = CONFIG.endereco
  const contatoLink = 'inline-flex min-h-12 items-center gap-2 rounded-full border border-linha bg-white px-5 font-display font-medium text-tinta transition-colors hover:border-menta-texto hover:text-menta-texto'
  return (
    <section id="contato" aria-labelledby="titulo-contato" className="sobre-claro bg-gelo py-24 lg:py-36">
      <div className="container-site">
        <CabecalhoSecao id="titulo-contato" rotulo="Localização e contato" titulo="Venha nos *visitar.*" />
        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          <Revelar>
            <Linha icone={<IconeLocal tamanho={22} />} titulo="Endereço">
              <address className="not-italic leading-relaxed">
                {e.rua}
                <br />
                {e.bairro}, {e.cidade} - {e.uf}
                <br />
                CEP {e.cep}
              </address>
              <a
                href={CONFIG.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-12 items-center gap-1.5 font-display font-medium text-menta-texto underline-offset-4 hover:underline"
              >
                Como chegar <IconeSetaDiagonal tamanho={16} />
              </a>
            </Linha>
            {CONFIG.horarios.length > 0 && (
              <Linha icone={<IconeRelogio tamanho={22} />} titulo="Horários">
                <dl className="space-y-1">
                  {CONFIG.horarios.map((h) => (
                    <div key={h.rotulo} className="flex flex-wrap justify-between gap-x-6">
                      <dt>{h.rotulo}</dt>
                      <dd className="font-display font-medium tabular-nums">{textoHorario(h)}</dd>
                    </div>
                  ))}
                </dl>
                {CONFIG.avisoHorarios && <p className="mt-2 text-sm text-tinta-suave">{CONFIG.avisoHorarios}</p>}
              </Linha>
            )}
            <Linha icone={<IconeTelefone tamanho={22} />} titulo="Fale com a clínica">
              <div className="mt-2 flex flex-wrap gap-2">
                <a href={linkWhatsapp()} target="_blank" rel="noopener noreferrer" className={contatoLink}>
                  <IconeWhatsapp tamanho={18} /> WhatsApp
                </a>
                <a href={linkTelefone()} className={contatoLink}>
                  <IconeTelefone tamanho={18} /> {CONFIG.telefone}
                </a>
                <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className={contatoLink}>
                  <IconeInstagram tamanho={18} /> {CONFIG.instagramHandle}
                </a>
              </div>
            </Linha>
          </Revelar>
          <Revelar atraso={0.1}>
            <Mapa />
          </Revelar>
        </div>
      </div>
    </section>
  )
}
