import { useRef, type CSSProperties } from 'react'
import { ArrowDown, CalendarCheck, MapPin } from 'lucide-react'
import { CONFIG } from '../config'
import { useUnidade } from '../context/unidade'
import { linkGeral } from '../lib/whatsapp'
import { resumoHorarios } from '../lib/horarios'
import { useNaTela, useProgressoRolagem } from '../lib/hooks'
import { Ondas } from '../components/Ondas'
import { IconeWhatsapp } from '../components/Marcas'

const TITULO = ['Cuidado', 'para', 'toda', 'a', '*família*,', 'em', 'um', 'só', 'lugar.']

function TituloAnimado() {
  return (
    <h1 className="text-[2.65rem] leading-[1.02] sm:text-6xl lg:text-[4.6rem]">
      {TITULO.map((p, i) => {
        const enfase = p.startsWith('*')
        const texto = enfase ? p.replace(/\*/g, '') : p
        return (
          <span key={i} className="palavra" style={{ '--i': i } as CSSProperties}>
            {enfase ? (
              <em className="enfase">{texto.replace(',', '')}</em>
            ) : (
              texto
            )}
            {enfase && ','}
            {i < TITULO.length - 1 && ' '}
          </span>
        )
      })}
    </h1>
  )
}

/** Ilustração original em traço: um dente com uma onda que o atravessa. */
function Ilustracao() {
  const [ref, visivel] = useNaTela<HTMLDivElement>()
  const { unidade } = useUnidade()
  return (
    <div ref={ref} data-pausado={!visivel} className="relative mx-auto aspect-[4/5] w-[78%] max-w-[25rem] sm:w-full" aria-hidden="true">
      {/* Arco em areia, como uma janela */}
      <div className="absolute inset-0 overflow-hidden rounded-t-[999px] rounded-b-[2.25rem] bg-gradient-to-b from-sand to-aqua-100">
        <Ondas
          altura={200}
          className="absolute inset-x-0 bottom-0 h-[42%]"
          camadas={[
            { cor: '#a3d8db', base: 70, amp: 14, comp: 720, dur: 26, opacidade: 0.55 },
            { cor: '#78c4ca', base: 100, amp: 12, comp: 480, fase: 120, dur: 20, reverso: true, opacidade: 0.6 },
            { cor: '#2a8792', base: 130, amp: 10, comp: 720, fase: 300, dur: 32, opacidade: 0.9 },
          ]}
        />
        <svg viewBox="0 0 200 250" className="absolute left-1/2 top-[14%] w-[58%] -translate-x-1/2">
          <path
            className="traco"
            style={{ '--len': 720 } as CSSProperties}
            d="M62 34C34 34 22 60 26 90c4 30 18 44 22 74 4 30 9 52 22 52 15 0 17-32 25-52 4-9 15-9 19 0 8 20 10 52 25 52 13 0 18-22 22-52 4-30 18-44 22-74 4-30-8-56-36-56-20 0-28 10-41 10S82 34 62 34Z"
            fill="none"
            stroke="#1b4d52"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className="traco"
            style={{ '--len': 260 } as CSSProperties}
            d="M38 96c26-22 52-6 72-14s34-26 56-14"
            fill="none"
            stroke="#2a8792"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Selo giratório "Unidade 1 · Foch" */}
      <div className="absolute -left-4 top-[8%] grid h-32 w-32 place-items-center rounded-full bg-white shadow-[0_18px_40px_-24px_rgb(19_63_68/0.6)] sm:-left-10 sm:h-36 sm:w-36">
        <svg viewBox="0 0 120 120" className="gira absolute inset-0 h-full w-full text-teal-700">
          <defs>
            <path id="circulo-selo" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" />
          </defs>
          <text fontSize="9.2" letterSpacing="2.6" fill="currentColor" fontFamily="DM Sans Variable, sans-serif" fontWeight="600">
            <textPath href="#circulo-selo">{`${unidade.rotulo.toUpperCase()} · ${CONFIG.cidade.toUpperCase()} · `}</textPath>
          </text>
        </svg>
        <span className="font-display text-3xl italic text-teal-800">{unidade.nome}</span>
      </div>
    </div>
  )
}

export function Hero() {
  const { unidade, multiplas } = useUnidade()
  const fundo = useRef<HTMLDivElement>(null)
  const frente = useRef<HTMLDivElement>(null)
  // Parallax leve das ondas (desligado com movimento reduzido)
  const ref = useProgressoRolagem<HTMLElement>(
    (p) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      if (fundo.current) fundo.current.style.transform = `translate3d(0, ${p * 90}px, 0)`
      if (frente.current) frente.current.style.transform = `translate3d(0, ${p * 30}px, 0)`
    },
    { modo: 'saida' },
  )
  const dia = resumoHorarios(unidade.horarios).find((h) => h.aberto)

  return (
    <section ref={ref} id="inicio" aria-labelledby="titulo-hero" className={`relative isolate overflow-hidden bg-ice ${multiplas ? 'pt-48 sm:pt-52' : 'pt-36 sm:pt-40'}`}>
      {/* brilho suave de fundo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60% 50% at 85% 20%, rgb(198 231 232 / 0.75), transparent 70%), radial-gradient(50% 40% at 0% 70%, rgb(244 239 231 / 0.9), transparent 70%)',
        }}
      />
      <div className="container-site grid items-center gap-14 pb-36 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:pb-48">
        <div>
          <p className="rotulo mb-6 text-teal-700">
            Odontologia para toda a família <span aria-hidden="true">·</span> {CONFIG.cidade} - {CONFIG.uf}
          </p>
          <div id="titulo-hero">
            <TituloAnimado />
          </div>
          <p className="reveal mt-7 max-w-xl text-lg text-ink-soft sm:text-xl" style={{ '--d': '600ms' } as CSSProperties}>
            Atendimento odontológico com avaliação individual, explicações claras e hora marcada.
          </p>
          <div className="reveal mt-9 flex flex-col gap-3 sm:flex-row" style={{ '--d': '720ms' } as CSSProperties}>
            <a href={linkGeral(unidade)} target="_blank" rel="noopener" className="btn btn-primario">
              <IconeWhatsapp size={20} />
              Agendar minha avaliação
            </a>
            <a href="#clinica" className="btn btn-secundario">
              Conhecer a clínica
              <ArrowDown aria-hidden="true" size={18} />
            </a>
          </div>
          <ul className="reveal mt-10 flex flex-wrap gap-x-6 gap-y-3 text-[0.95rem] text-ink-soft" style={{ '--d': '840ms' } as CSSProperties}>
            {dia && (
              <li className="flex items-center gap-2">
                <CalendarCheck aria-hidden="true" size={18} className="text-teal-600" />
                {dia.dias}, {dia.horario.replace(' às ', ' às ')}
              </li>
            )}
            <li className="flex items-center gap-2">
              <MapPin aria-hidden="true" size={18} className="text-teal-600" />
              {unidade.endereco.bairro}, {unidade.endereco.cidade}
            </li>
          </ul>
        </div>
        <div className="reveal" style={{ '--d': '200ms' } as CSSProperties}>
          <Ilustracao />
        </div>
      </div>

      {/* Momento de assinatura: ondas do logo, lentas, com parallax leve */}
      <div ref={fundo} className="absolute inset-x-0 bottom-0 h-40 will-change-transform sm:h-52">
        <Ondas
          altura={200}
          className="absolute inset-0"
          camadas={[
            { cor: '#c6e7e8', base: 80, amp: 22, comp: 1440, dur: 46, opacidade: 0.8 },
            { cor: '#78c4ca', base: 112, amp: 18, comp: 720, fase: 200, dur: 34, reverso: true, opacidade: 0.55 },
          ]}
        />
      </div>
      <div ref={frente} className="absolute inset-x-0 -bottom-px h-28 will-change-transform sm:h-36">
        <Ondas
          altura={140}
          className="absolute inset-0"
          camadas={[
            { cor: '#2a8792', base: 70, amp: 12, comp: 1440, fase: 500, dur: 40, linha: true, espessura: 1.5, opacidade: 0.6 },
            { cor: '#ffffff', base: 92, amp: 14, comp: 720, fase: 80, dur: 30 },
          ]}
        />
      </div>
    </section>
  )
}
