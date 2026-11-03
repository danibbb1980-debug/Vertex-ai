import { useState } from 'react'
import { Clock, MapPin, Navigation, Phone } from 'lucide-react'
import { CONFIG } from '../config'
import { mapsEmbedUrl, telLink } from '../lib/contato'
import { horariosAgrupados } from '../lib/horarios'
import { BotaoWhatsApp, Reveal, SectionTitle } from './ui'
import { IconInstagram } from './icons'

/** Mapa só carrega ao clicar: sem cookies de terceiros e sem peso extra na abertura da página. */
function Mapa() {
  const [ativo, setAtivo] = useState(false)
  if (ativo)
    return (
      <iframe
        title={`Mapa com a localização da ${CONFIG.nome}`}
        src={mapsEmbedUrl()}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full min-h-[22rem] w-full border-0"
      />
    )
  return (
    <div className="relative flex h-full min-h-[22rem] flex-col items-center justify-center gap-5 overflow-hidden bg-mist p-8 text-center">
      {/* Mapa ilustrado (traço), não é uma imagem do Google */}
      <svg aria-hidden="true" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <g fill="none" stroke="var(--color-line)" strokeWidth="10" strokeLinecap="round">
          <path d="M-20 90C80 110 160 60 260 80S380 140 430 120" />
          <path d="M60 -20C80 80 70 180 110 320" />
          <path d="M300 -20C280 90 320 200 290 320" />
          <path d="M-20 230C100 210 220 250 430 220" />
        </g>
        <path d="M110 250C170 262 250 258 320 222" fill="none" stroke="var(--color-aqua)" strokeWidth="5" strokeLinecap="round" opacity=".6" />
      </svg>
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white shadow-lift">
        <MapPin size={26} aria-hidden="true" />
      </span>
      <p className="relative max-w-[18rem] font-medium text-navy">{CONFIG.endereco.rua}, {CONFIG.endereco.bairro}</p>
      <button type="button" onClick={() => setAtivo(true)} className="btn btn-ghost relative !bg-white">
        Mostrar mapa interativo
      </button>
      <p className="relative max-w-[20rem] text-[0.82rem] text-muted">O mapa é carregado do Google Maps somente se você tocar no botão.</p>
    </div>
  )
}

export function Contato() {
  const horarios = horariosAgrupados()
  return (
    <section id="contato" aria-labelledby="t-contato" className="py-20 sm:py-28">
      <div className="wrap">
        <SectionTitle id="t-contato" eyebrow="Localização e contato" titulo="Venha nos" enfase="visitar" depois="." />
        <div className="mt-12 grid gap-4 lg:grid-cols-[1fr_1.15fr]">
          <Reveal className="card flex flex-col gap-8 p-7 sm:p-9">
            <div className="flex gap-4">
              <MapPin size={24} strokeWidth={1.6} className="mt-0.5 shrink-0 text-aqua-ink" aria-hidden="true" />
              <div>
                <h3 className="text-xl">Endereço</h3>
                <address className="mt-1.5 not-italic">
                  {CONFIG.endereco.rua}
                  <br />
                  {CONFIG.endereco.bairro}, {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}
                  <br />
                  CEP {CONFIG.endereco.cep}
                </address>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock size={24} strokeWidth={1.6} className="mt-0.5 shrink-0 text-aqua-ink" aria-hidden="true" />
              <div className="w-full">
                <h3 className="text-xl">Horários</h3>
                <dl className="mt-2 divide-y divide-line">
                  {horarios.map((h) => (
                    <div key={h.dias} className="flex flex-wrap justify-between gap-x-4 py-2">
                      <dt className="text-navy">{h.dias}</dt>
                      <dd className={h.aberto ? 'font-semibold text-navy' : 'text-muted'}>{h.texto}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-2 text-[0.92rem] text-muted">{CONFIG.avisoHorarios} É recomendado marcar hora.</p>
              </div>
            </div>
            <div className="grid gap-3">
              <BotaoWhatsApp className="btn-aqua">Agendar pelo WhatsApp</BotaoWhatsApp>
              <a href={telLink()} className="btn btn-ghost">
                <Phone size={18} aria-hidden="true" /> Ligar {CONFIG.telefone}
              </a>
              <a href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                <Navigation size={18} aria-hidden="true" /> Como chegar
                <span className="sr-only"> (abre o Google Maps em nova aba)</span>
              </a>
              <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                <IconInstagram size={18} /> {CONFIG.instagramUsuario}
                <span className="sr-only"> no Instagram (abre em nova aba)</span>
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="overflow-hidden rounded-[var(--radius-card)] ring-1 ring-line">
            <Mapa />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
