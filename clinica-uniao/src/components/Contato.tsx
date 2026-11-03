import { useId, useRef, useState } from 'react'
import { MapPin, Navigation, Phone, Instagram, Clock } from 'lucide-react'
import { CONFIG } from '../config'
import { AVISO_LEGAL, CTA_FINAL, FAQ } from '../content'
import { linhasHorario } from '../lib/horarios'
import { useProgressoRolagem } from '../lib/movimento'
import { comoChegarLink, enderecoLinha1, enderecoLinha2, mapaEmbed, telLink, waLink } from '../lib/links'
import { IconeWhats } from './Icones'
import { Logo } from './Topo'
import { CabecalhoSecao, Reveal } from './ui'

/* ------------------------------------------------------------------ Dúvidas */
function ItemFaq({ p, r, i }: { p: string; r: string; i: number }) {
  const [aberto, setAberto] = useState(i === 0)
  const id = useId()
  return (
    <Reveal as="li" delay={0.03 * i} className={`rounded-xl2 border transition-colors duration-300 ${aberto ? 'border-choco-700/25 bg-cream' : 'border-choco-700/[0.12] bg-ivory'}`}>
      <h3 className="font-sans text-base">
        <button
          type="button"
          id={`${id}-b`}
          aria-expanded={aberto}
          aria-controls={`${id}-p`}
          onClick={() => setAberto((v) => !v)}
          className="flex min-h-14 w-full items-center justify-between gap-4 rounded-xl2 px-5 py-4 text-left text-[1.08rem] font-semibold text-choco-900 sm:px-6"
        >
          {p}
          <span
            aria-hidden
            className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-choco-700/25 transition-transform duration-300 ${aberto ? 'rotate-45 bg-choco-800 text-ivory' : 'text-choco-800'}`}
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M8 2v12M2 8h12" />
            </svg>
          </span>
        </button>
      </h3>
      <div id={`${id}-p`} role="region" aria-labelledby={`${id}-b`} hidden={!aberto}>
        <p className="acordeao-conteudo px-5 pb-6 text-choco-700 sm:px-6 sm:pr-16">{r}</p>
      </div>
    </Reveal>
  )
}

export function Duvidas() {
  if (FAQ.itens.length === 0) return null
  return (
    <section id="duvidas" aria-labelledby="t-duvidas" className="bg-ivory py-20 sm:py-28">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <CabecalhoSecao id="t-duvidas" rotulo={FAQ.rotulo} antes={FAQ.tituloAntes} enfase={FAQ.enfase} depois={FAQ.tituloDepois} />
          {CONFIG.whatsapp && (
            <Reveal delay={0.1}>
              <p className="mt-6 text-choco-700">Ficou alguma dúvida? Pergunte direto à clínica.</p>
              <a href={waLink('Olá! Vi o site da Clínica União e tenho uma dúvida.')} target="_blank" rel="noopener noreferrer" className="btn btn-contorno mt-5">
                <IconeWhats /> Enviar dúvida
              </a>
            </Reveal>
          )}
        </div>
        <ul className="space-y-3 lg:col-span-8">
          {FAQ.itens.map((f, i) => (
            <ItemFaq key={f.p} p={f.p} r={f.r} i={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ----------------------------------------------------- Localização e contato */
function Mapa() {
  const [carregar, setCarregar] = useState(false)
  if (carregar)
    return (
      <iframe
        title={`Mapa: ${CONFIG.nome}, ${enderecoLinha1}`}
        src={mapaEmbed}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full min-h-[360px] w-full rounded-xl2 border-0"
      />
    )
  return (
    <div className="relative flex h-full min-h-[360px] flex-col items-center justify-center overflow-hidden rounded-xl2 bg-sand/70 p-8 text-center">
      {/* desenho de ruas, só decorativo */}
      <svg aria-hidden viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" fill="none" stroke="#624B36" strokeOpacity=".09">
        <path d="M-10 70 410 40M-10 170 410 150M-10 260 410 250M70 -10 110 310M210 -10 190 310M320 -10 340 310" strokeWidth="14" />
        <path d="M-10 115 410 95M150 -10 150 310M265 -10 270 310" strokeWidth="5" />
      </svg>
      <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-choco-800 text-ivory shadow-lift">
        <MapPin className="h-7 w-7" aria-hidden />
      </span>
      <p className="relative mt-5 font-serif text-2xl text-choco-900">{enderecoLinha1}</p>
      <p className="relative text-choco-700">{enderecoLinha2}</p>
      <button type="button" onClick={() => setCarregar(true)} className="btn btn-claro relative mt-6">
        Mostrar mapa interativo
      </button>
      <p className="relative mt-3 max-w-xs text-[0.85rem] text-choco-700">O mapa do Google só é carregado quando você toca no botão.</p>
    </div>
  )
}

export function Localizacao() {
  const linhas = linhasHorario()
  return (
    <section id="contato" aria-labelledby="t-contato" className="bg-cream py-20 sm:py-28">
      <div className="container-site">
        <CabecalhoSecao id="t-contato" rotulo="Localização e contato" antes="Venha nos" enfase="visitar" depois="." />
        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <Reveal className="space-y-8 lg:col-span-5">
            <div className="flex gap-4">
              <MapPin className="mt-1 h-6 w-6 shrink-0 text-olive" aria-hidden />
              <address className="not-italic">
                <p className="font-semibold text-choco-900">Endereço</p>
                <p className="text-choco-800">{enderecoLinha1}</p>
                <p className="text-choco-800">{enderecoLinha2}</p>
              </address>
            </div>
            <div className="flex gap-4">
              <Clock className="mt-1 h-6 w-6 shrink-0 text-olive" aria-hidden />
              <div className="w-full">
                <p className="font-semibold text-choco-900">Horários</p>
                <dl className="mt-1 divide-y divide-choco-700/10">
                  {linhas.map((l) => (
                    <div key={l.rotulo} className="flex justify-between gap-4 py-2">
                      <dt className="text-choco-800">{l.rotulo}</dt>
                      <dd className={l.fechado ? 'text-choco-600' : 'font-medium text-choco-900'}>{l.valor}</dd>
                    </div>
                  ))}
                </dl>
                {CONFIG.avisoHorario && <p className="mt-2 text-[0.9rem] text-choco-700">{CONFIG.avisoHorario}</p>}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <a href={comoChegarLink} target="_blank" rel="noopener noreferrer" className="btn btn-primario">
                <Navigation className="h-[18px] w-[18px]" aria-hidden /> Como chegar
              </a>
              {CONFIG.whatsapp && (
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-contorno">
                  <IconeWhats /> WhatsApp
                </a>
              )}
              {telLink && (
                <a href={telLink} className="btn btn-contorno">
                  <Phone className="h-[18px] w-[18px]" aria-hidden /> {CONFIG.telefone}
                </a>
              )}
              {CONFIG.instagram.url && (
                <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-contorno">
                  <Instagram className="h-[18px] w-[18px]" aria-hidden /> Instagram
                </a>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-7">
            <Mapa />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------- CTA final: os arcos se unem */
export function CtaFinal() {
  const ref = useRef<HTMLElement>(null)
  const arte = useRef<SVGSVGElement>(null)
  // de "topo da seção no pé da tela" até "centro da seção a 55% da tela"
  useProgressoRolagem(
    ref,
    (r, vh) => (vh - r.top) / (vh - 0.55 * vh + r.height / 2),
    (p) => arte.current?.style.setProperty('--p', p.toFixed(3)),
  )

  return (
    <section ref={ref} id="cta-final" aria-labelledby="t-cta" className="on-dark relative overflow-hidden bg-choco-900 py-20 text-ivory sm:py-28">
      <div className="container-site grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="relative z-10 order-2 lg:order-1 lg:col-span-7">
          <p className="rotulo">Agende</p>
          <h2 id="t-cta" className="titulo-secao mt-4 !text-ivory sm:!text-[3.2rem] lg:!text-[3.6rem]">
            {CTA_FINAL.tituloAntes} <em className="!text-camel-300">{CTA_FINAL.enfase}</em>
            {CTA_FINAL.tituloDepois}
          </h2>
          <p className="mt-6 max-w-lg text-lg text-camel-300">{CTA_FINAL.texto}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {CONFIG.whatsapp && (
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-claro btn-brilho">
                <IconeWhats /> Agendar pelo WhatsApp
              </a>
            )}
            {CONFIG.secoes.agendar && (
              <a href="#agendar" className="btn btn-contorno-claro">
                Preencher solicitação
              </a>
            )}
            {CONFIG.instagram.url && (
              <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-contorno-claro">
                <Instagram className="h-[18px] w-[18px]" aria-hidden /> Ver no Instagram
              </a>
            )}
          </div>
        </div>

        {/* momento de assinatura: dois arcos se desenham ao rolar e fecham o círculo */}
        <div aria-hidden className="pointer-events-none order-1 w-44 sm:w-56 lg:order-2 lg:col-span-5 lg:w-full">
          <svg ref={arte} viewBox="0 0 400 400" className="arcos-uniao h-auto w-full overflow-visible" fill="none">
            <defs>
              <linearGradient id="ctaA" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#E3D3BF" />
                <stop offset="1" stopColor="#9A7656" />
              </linearGradient>
              <linearGradient id="ctaB" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#BEA385" />
                <stop offset="1" stopColor="#E3D3BF" />
              </linearGradient>
              <radialGradient id="ctaLuz" cx=".5" cy=".5" r=".5">
                <stop offset="0" stopColor="#BEA385" stopOpacity=".28" />
                <stop offset="1" stopColor="#BEA385" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle className="arco-brilho" cx="200" cy="200" r="190" fill="url(#ctaLuz)" />
            {/* arco maior: direita, de cima até embaixo */}
            <path
              className="arco-a"
              d="M200 40 A160 160 0 1 1 200 360"
              stroke="url(#ctaA)"
              strokeWidth="12"
              strokeLinecap="round"
              pathLength={1}
            />
            {/* arco menor: esquerda, vem de fora e encaixa */}
            <path
              className="arco-b"
              d="M200 360 A160 160 0 0 1 200 40"
              stroke="url(#ctaB)"
              strokeWidth="5"
              strokeLinecap="round"
              pathLength={1}
            />
            <text
              className="arco-brilho"
              x="200"
              y="214"
              textAnchor="middle"
              fill="#E3D3BF"
              fontFamily="Fraunces Variable, Georgia, serif"
              fontStyle="italic"
              fontSize="44"
            >
              união
            </text>
          </svg>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------- Rodapé */
export function Rodape() {
  const rt = CONFIG.responsavelTecnico
  return (
    <footer className="border-t border-choco-700/10 bg-ivory pb-28 pt-16 lg:pb-12">
      <div className="container-site grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo className="h-16 w-auto" sizes="180px" />
          <p className="mt-5 max-w-xs text-[0.95rem] text-choco-700">{AVISO_LEGAL}</p>
        </div>
        <div className="md:col-span-4">
          <p className="font-semibold text-choco-900">Endereço</p>
          <address className="mt-2 not-italic text-choco-800">
            {enderecoLinha1}
            <br />
            {enderecoLinha2}
          </address>
          <ul className="mt-4 space-y-1 text-[0.95rem] text-choco-800">
            {linhasHorario().map((l) => (
              <li key={l.rotulo}>
                {l.rotulo}: {l.valor}
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-4">
          <p className="font-semibold text-choco-900">Contato</p>
          <ul className="mt-1 text-choco-800">
            {telLink && (
              <li>
                <a href={telLink} className="inline-flex min-h-11 items-center link-sublinhado">
                  Telefone {CONFIG.telefone}
                </a>
              </li>
            )}
            {CONFIG.whatsapp && (
              <li>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center link-sublinhado">
                  WhatsApp
                </a>
              </li>
            )}
            {CONFIG.instagram.url && (
              <li>
                <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center link-sublinhado">
                  Instagram {CONFIG.instagram.usuario}
                </a>
              </li>
            )}
            <li>
              <a href="/privacidade.html" className="inline-flex min-h-11 items-center link-sublinhado">
                Privacidade
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-site mt-12 flex flex-col gap-2 border-t border-choco-700/10 pt-6 text-[0.85rem] text-choco-700 sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {CONFIG.nome} · {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}
        </p>
        {rt && rt.nome && rt.cro && (
          <p>
            Responsável técnico: {rt.nome} · {rt.cro}
          </p>
        )}
      </div>
    </footer>
  )
}

/* ------------------------------------------- WhatsApp flutuante e barra móvel */
export function BotoesFixos() {
  if (!CONFIG.whatsapp && !telLink) return null
  return (
    <>
      {CONFIG.whatsapp && (
        <a
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Conversar pelo WhatsApp"
          className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-olive text-ivory shadow-lift transition-transform duration-200 hover:-translate-y-0.5 hover:bg-olive-700 lg:flex"
        >
          <IconeWhats className="h-6 w-6" />
        </a>
      )}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-choco-700/[0.12] bg-ivory/95 px-4 pb-[max(.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-md gap-3">
          {CONFIG.whatsapp && (
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primario flex-1 !px-4">
              <IconeWhats /> WhatsApp
            </a>
          )}
          {telLink && (
            <a href={telLink} className="btn btn-contorno flex-1 !px-4">
              <Phone className="h-[18px] w-[18px]" aria-hidden /> Ligar
            </a>
          )}
        </div>
      </div>
    </>
  )
}
