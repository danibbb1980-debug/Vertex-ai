import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { m, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { Clock, MapPin, Navigation, Plus } from 'lucide-react'
import { CONFIG } from '../config'
import { enderecoLinha1, enderecoLinha2, hora, preencherTokens, resumoHorarios, temTexto } from '../lib/util'
import { Aquarela, BotaoLigar, BotaoWhatsApp, Credenciais, Enfase, IconeInstagram, Revela } from './base'

/* ---------------- Como funciona: linha do tempo com progresso ao rolar ---------------- */

export function ComoFunciona() {
  const passos = CONFIG.comoFunciona
  const ref = useRef<HTMLOListElement>(null)
  const reduzir = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] })
  const progresso = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const escala = useTransform(progresso, [0, 1], [0, 1])
  const [ativo, setAtivo] = useState(0)
  useEffect(() => {
    if (reduzir) setAtivo(passos.length)
  }, [reduzir, passos.length])
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!reduzir) setAtivo(Math.min(passos.length, Math.floor(v * passos.length + 0.35)))
  })
  if (!passos.length) return null

  return (
    <section id="como-funciona" aria-labelledby="titulo-como" className="relative bg-marfim-2/60 py-24 md:py-36">
      <div className="container-site grid gap-14 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
        <Revela className="md:sticky md:top-36 md:self-start">
          <p className="rotulo">Como funciona</p>
          <h2 id="titulo-como" className="titulo-secao mt-5 text-marinho">
            <Enfase texto="Do primeiro contato ao *acompanhamento*." />
          </h2>
          <p className="mt-6 max-w-md text-[1.08rem] text-tinta">
            Um caminho simples, com tempo para conversar e entender cada etapa.
          </p>
        </Revela>

        <ol ref={ref} className="relative">
          <span className="absolute bottom-6 left-[1.45rem] top-6 w-px bg-linha" aria-hidden="true" />
          <m.span
            className="absolute bottom-6 left-[1.45rem] top-6 w-px origin-top bg-vinho"
            style={{ scaleY: reduzir ? 1 : escala }}
            aria-hidden="true"
          />
          {passos.map((p, i) => {
            const feito = i < ativo
            return (
              <li key={p.titulo} className="relative grid grid-cols-[3rem_1fr] gap-6 pb-12 last:pb-0">
                <span
                  className={`relative z-10 flex size-[2.9rem] items-center justify-center rounded-full border font-serif text-[1.15rem] transition-colors duration-500 ${
                    feito ? 'border-vinho bg-vinho text-marfim' : 'border-linha bg-marfim text-marinho'
                  }`}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <div className="pt-1.5">
                  <h3 className={`text-[1.75rem] leading-tight transition-colors duration-500 ${feito ? 'text-marinho' : 'text-marinho/80'}`}>
                    <span className="sr-only">Etapa {i + 1}: </span>
                    {p.titulo}
                  </h3>
                  <p className="mt-2 max-w-lg text-[1rem] text-tinta">{p.texto}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

/* ---------------- Dúvidas: acordeão acessível ---------------- */

/** Mantém telefone e horários inteiros na mesma linha. */
function semQuebra(texto: string): ReactNode {
  const partes = texto.split(new RegExp(`(${CONFIG.telefone.replace(/[()]/g, '\\$&')}|\\d{2}h\\d{2})`))
  return partes.map((p, i) => (i % 2 ? <span key={i} className="whitespace-nowrap">{p}</span> : p))
}

function ItemDuvida({ p, r, aberto, onToggle }: { p: string; r: string; aberto: boolean; onToggle: () => void }) {
  const id = useId()
  return (
    <li className="border-b border-linha">
      <h3 className="!font-sans !text-base !leading-normal !tracking-normal">
        <button
          type="button"
          id={`${id}-b`}
          aria-expanded={aberto}
          aria-controls={`${id}-r`}
          onClick={onToggle}
          className="group flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left"
        >
          <span className={`font-serif text-[1.4rem] leading-snug transition-colors md:text-[1.6rem] ${aberto ? 'text-vinho' : 'text-marinho group-hover:text-vinho'}`}>
            {p}
          </span>
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-full border transition-[transform,background-color,border-color] duration-500 ease-[var(--ease-flui)] ${
              aberto ? 'rotate-45 border-vinho bg-vinho text-marfim' : 'border-linha text-vinho group-hover:border-vinho'
            }`}
            aria-hidden="true"
          >
            <Plus className="size-4" strokeWidth={1.6} />
          </span>
        </button>
      </h3>
      <div id={`${id}-r`} role="region" aria-labelledby={`${id}-b`} hidden={!aberto}>
        <p className="faq-resposta max-w-2xl pb-7 pr-12 text-[1.02rem] leading-relaxed text-tinta">{semQuebra(r)}</p>
      </div>
    </li>
  )
}

export function Duvidas() {
  const lista = CONFIG.duvidas.filter((d) => temTexto(d.p) && temTexto(d.r))
  const [aberto, setAberto] = useState<number | null>(0)
  if (!lista.length) return null
  return (
    <section id="duvidas" aria-labelledby="titulo-duvidas" className="relative py-24 md:py-36">
      <div className="container-site grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
        <Revela>
          <p className="rotulo">Dúvidas frequentes</p>
          <h2 id="titulo-duvidas" className="titulo-secao mt-5 text-marinho">
            <Enfase texto="Perguntas que costumam *aparecer*." />
          </h2>
          <p className="mt-6 max-w-md text-[1.08rem] text-tinta">
            Respostas gerais, de caráter informativo. Cada situação é avaliada individualmente na consulta.
          </p>
        </Revela>
        <Revela>
          <ul className="border-t border-linha">
            {lista.map((d, i) => (
              <ItemDuvida key={d.p} p={d.p} r={preencherTokens(d.r)} aberto={aberto === i} onToggle={() => setAberto(aberto === i ? null : i)} />
            ))}
          </ul>
        </Revela>
      </div>
    </section>
  )
}

/* ---------------- Localização e contato ---------------- */

export function Contato() {
  const h = resumoHorarios()
  const foto = CONFIG.fotoLocal
  const [mapaVisivel, setMapaVisivel] = useState(false)
  const mapaRef = useRef<HTMLDivElement>(null)
  return (
    <section id="contato" aria-labelledby="titulo-contato" className="relative overflow-hidden bg-marfim-2/60 py-24 md:py-36">
      <Aquarela tipo="base" className="-right-32 bottom-0 w-[50rem] max-w-none opacity-70" />
      <div className="container-site relative">
        <Revela className="max-w-2xl">
          <p className="rotulo">Localização e contato</p>
          <h2 id="titulo-contato" className="titulo-secao mt-5 text-marinho">
            <Enfase texto="Venha nos *visitar*." />
          </h2>
        </Revela>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <Revela className="flex flex-col gap-6 rounded-[1.75rem] border border-linha bg-white/80 p-7 md:p-9">
            <div className="flex gap-4">
              <MapPin className="mt-1 size-5 shrink-0 text-vinho" strokeWidth={1.6} aria-hidden="true" />
              <address className="not-italic">
                <span className="block font-serif text-[1.5rem] leading-tight text-marinho">{CONFIG.endereco.predio}</span>
                <span className="mt-1 block text-tinta">{enderecoLinha1}</span>
                <span className="block text-tinta">{enderecoLinha2}</span>
              </address>
            </div>

            <div className="flex gap-4 border-t border-linha pt-6">
              <Clock className="mt-1 size-5 shrink-0 text-vinho" strokeWidth={1.6} aria-hidden="true" />
              <div className="w-full">
                <p className="font-serif text-[1.5rem] leading-tight text-marinho">Horários</p>
                <dl className="mt-3 space-y-2 text-[0.98rem]">
                  {h.grupos.map((g) => (
                    <div key={g.dias} className="flex flex-wrap justify-between gap-x-4">
                      <dt className="text-marinho">{g.dias}</dt>
                      <dd className="text-tinta">{g.periodos.map((p) => `${hora(p.inicio)} às ${hora(p.fim)}`).join(' · ')}</dd>
                    </div>
                  ))}
                  {h.pausas.length > 0 && (
                    <div className="flex flex-wrap justify-between gap-x-4">
                      <dt className="text-marinho">Pausa para almoço</dt>
                      <dd className="text-tinta">{h.pausas.map((p) => `${hora(p.inicio)} às ${hora(p.fim)}`)[0]}</dd>
                    </div>
                  )}
                  {h.fechados && (
                    <div className="flex flex-wrap justify-between gap-x-4">
                      <dt className="text-marinho">{h.fechados}</dt>
                      <dd className="text-tinta">Fechado</dd>
                    </div>
                  )}
                </dl>
                {temTexto(CONFIG.avisoFeriados) && <p className="mt-3 text-[0.88rem] italic text-tinta">{CONFIG.avisoFeriados}</p>}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-linha pt-6">
              <BotaoWhatsApp>Agendar pelo WhatsApp</BotaoWhatsApp>
              <BotaoLigar />
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <a href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 text-marinho hover:text-vinho">
                <Navigation className="size-4 text-vinho" strokeWidth={1.6} aria-hidden="true" />
                <span className="link-sublinhado">Como chegar</span>
              </a>
              <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 text-marinho hover:text-vinho">
                <IconeInstagram className="size-4 text-vinho" />
                <span className="link-sublinhado">{CONFIG.instagram.usuario}</span>
              </a>
              <a href={CONFIG.telefoneLink} className="inline-flex min-h-12 items-center gap-2 text-marinho hover:text-vinho">
                <span className="link-sublinhado">{CONFIG.telefone}</span>
              </a>
            </div>
          </Revela>

          <Revela atraso={120} className="grid gap-6">
            {foto && (
              <figure className="overflow-hidden rounded-[1.75rem] bg-pessego">
                <img src={foto.src} alt={foto.alt} width={foto.largura} height={foto.altura} loading="lazy" decoding="async" className="aspect-[16/9] w-full object-cover" />
              </figure>
            )}
            {temTexto(CONFIG.mapsEmbed) && (
              <div ref={mapaRef} className="relative overflow-hidden rounded-[1.75rem] border border-linha bg-pessego/50">
                {mapaVisivel ? (
                  <iframe
                    title={`Mapa: ${CONFIG.endereco.predio}, ${enderecoLinha1}, ${enderecoLinha2}`}
                    src={CONFIG.mapsEmbed}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="aspect-[16/10] w-full border-0"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setMapaVisivel(true)}
                    className="group flex aspect-[16/10] w-full flex-col items-center justify-center gap-3 p-6 text-center"
                  >
                    <svg className="absolute inset-0 size-full text-pessego-3/50" aria-hidden="true">
                      <defs>
                        <pattern id="ruas" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
                          <path d="M0 40h80M40 0v80" stroke="currentColor" strokeWidth="1" fill="none" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#ruas)" />
                    </svg>
                    <span className="relative flex size-14 items-center justify-center rounded-full bg-vinho text-marfim shadow-lg transition-transform duration-500 group-hover:-translate-y-1">
                      <MapPin className="size-6" strokeWidth={1.6} aria-hidden="true" />
                    </span>
                    <span className="relative rounded-full bg-marfim/95 px-5 py-2.5 text-[0.95rem] text-marinho">Mostrar mapa interativo</span>
                    <span className="relative text-[0.8rem] text-marinho/80">O mapa é carregado do Google Maps ao clicar.</span>
                  </button>
                )}
              </div>
            )}
          </Revela>
        </div>
      </div>
    </section>
  )
}

/* ---------------- CTA final ---------------- */

export function CtaFinal() {
  return (
    <section aria-labelledby="titulo-cta" className="sobre-escuro relative overflow-hidden bg-marinho py-24 text-marfim md:py-32">
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-vinho-claro/70 to-transparent" aria-hidden="true" />
      <svg className="absolute -right-20 top-1/2 h-[140%] -translate-y-1/2 text-vinho-claro/25" viewBox="0 0 400 600" fill="none" aria-hidden="true">
        <path d="M380 0C260 120 360 220 220 300S120 520 0 600" stroke="currentColor" strokeWidth="1" />
        <path d="M400 40C290 150 380 250 250 330S150 540 40 620" stroke="currentColor" strokeWidth="1" opacity=".5" />
      </svg>
      <div className="container-site relative max-w-3xl text-center">
        <Revela>
          <p className="rotulo !text-vinho-claro">Agende com calma</p>
          <h2 id="titulo-cta" className="mt-6 text-[clamp(2.5rem,6vw,4.4rem)] font-light">
            Sua avaliação é o <em className="font-medium italic text-pessego">primeiro</em> passo.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[1.08rem] text-marfim/80">
            Fale com a clínica pelo WhatsApp ou por telefone e escolha o melhor horário para você.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <BotaoWhatsApp variante="claro">Agendar pelo WhatsApp</BotaoWhatsApp>
            <BotaoLigar variante="contorno-claro" />
            <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-contorno-claro">
              <IconeInstagram />
              <span>Ver no Instagram</span>
            </a>
          </div>
          {CONFIG.secoes.agendar && (
            <a href="#agendar" className="mt-8 inline-flex min-h-12 items-center text-[0.95rem] text-marfim/85 hover:text-marfim">
              <span className="link-sublinhado !decoration-marfim/40">Prefere escolher dia e horário? Use o formulário</span>
            </a>
          )}
        </Revela>
      </div>
    </section>
  )
}

/* ---------------- Rodapé ---------------- */

export function Rodape() {
  return (
    <footer className="relative border-t border-linha bg-marfim pb-28 pt-16 md:pb-14">
      <div className="container-site grid gap-12 md:grid-cols-[1.1fr_1fr_1fr]">
        <div>
          <img src="/img/logo-completo.webp" alt={`${CONFIG.nome}, cirurgia vascular e endolaser`} width={560} height={290} loading="lazy" className="h-auto w-56" />
          <p className="mt-6 text-[0.95rem] text-marinho">
            {CONFIG.nome} · {CONFIG.titulo} · <Credenciais />
          </p>
        </div>
        <div className="text-[0.95rem] text-tinta">
          <p className="rotulo !text-marinho">Endereço</p>
          <address className="mt-4 not-italic leading-relaxed">
            {CONFIG.endereco.predio}
            <br />
            {enderecoLinha1}
            <br />
            {enderecoLinha2}
          </address>
          <a href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-12 items-center text-marinho hover:text-vinho">
            <span className="link-sublinhado">Como chegar</span>
          </a>
        </div>
        <div className="text-[0.95rem] text-tinta">
          <p className="rotulo !text-marinho">Contato</p>
          <ul className="mt-3">
            <li>
              <a href={CONFIG.telefoneLink} className="inline-flex min-h-12 items-center text-marinho hover:text-vinho">
                <span className="link-sublinhado">{CONFIG.telefone}</span>
              </a>
            </li>
            <li>
              <a href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.mensagens.geral)}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center text-marinho hover:text-vinho">
                <span className="link-sublinhado">WhatsApp</span>
              </a>
            </li>
            <li>
              <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center text-marinho hover:text-vinho">
                <span className="link-sublinhado">Instagram {CONFIG.instagram.usuario}</span>
              </a>
            </li>
            <li>
              <a href="/privacidade.html" className="inline-flex min-h-12 items-center text-marinho hover:text-vinho">
                <span className="link-sublinhado">Privacidade</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-site mt-12 border-t border-linha pt-8 text-[0.85rem] leading-relaxed text-tinta">
        <p>Conteúdo informativo, sem finalidade de diagnóstico. A indicação de cada tratamento depende de avaliação médica individual.</p>
        <p className="mt-2">© {new Date().getFullYear()} {CONFIG.nome}. Responsável técnica: {CONFIG.nome}, {CONFIG.crm}, {CONFIG.rqe}.</p>
      </div>
    </footer>
  )
}
