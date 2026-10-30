import type { CSSProperties } from 'react'
import { CONFIG } from '../config'
import { faixaHorario, waLink } from '../lib/util'
import { IconArrow, IconChat } from './Icons'

/** animações do hero em CSS: rodam já no HTML pré-renderizado, sem esperar o JavaScript */
const delay = (d: number) => ({ animationDelay: `${d}s` }) as CSSProperties

/** Título revelado palavra a palavra, com corte vertical (cada palavra sobe de dentro de uma máscara). */
function TituloRevelado() {
  const partes: { t: string; em?: boolean }[] = [
    { t: 'Cada' },
    { t: 'sorriso' },
    { t: 'começa' },
    { t: 'com' },
    { t: 'um' },
    { t: 'planejamento.', em: true },
  ]
  return (
    <h1 className="h1 text-[clamp(2.75rem,7.4vw,5.6rem)] leading-[1.02] text-ink">
      {partes.map((p, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <span className="hero-word inline-block" style={delay(0.1 + i * 0.075)}>
            {p.em ? <em>{p.t}</em> : p.t}
          </span>
          {i < partes.length - 1 && ' '}
        </span>
      ))}
    </h1>
  )
}

function DiagramaArcada() {
  const n = 14
  const cx = 260
  const teeth = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1)
    const a = Math.PI * (0.06 + 0.88 * t)
    const x = cx - Math.cos(a) * 168
    const y = 430 - Math.sin(a) * 270
    const rot = (Math.atan2(Math.cos(a) * 270, Math.sin(a) * 168) * 180) / Math.PI
    const molar = i < 3 || i > n - 4
    const w = molar ? 40 : i < 5 || i > n - 6 ? 32 : 26
    return { x, y, rot, w, h: molar ? 30 : 24 }
  })
  const draw = (d: number, c = '') => ({ pathLength: 1, className: `hero-draw ${c}`, style: delay(d) })
  const fade = (d: number) => ({ className: 'hero-fade', style: delay(d) })

  const S = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

  return (
    <svg viewBox="0 0 520 540" className="h-auto w-full text-ink" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="glow" cx="50%" cy="58%" r="55%">
          <stop offset="0%" stopColor="#53b792" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#53b792" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={cx} cy={300} rx={250} ry={240} fill="url(#glow)" />

      {/* eixo e guias */}
      <g {...fade(0.1)}>
        <path d={`M${cx} 40V520`} {...S} strokeWidth={1} strokeDasharray="2 6" opacity={0.45} />
        <path d="M30 430H490" {...S} strokeWidth={1} strokeDasharray="2 6" opacity={0.45} />
      </g>

      {/* arcos de contorno (externo, médio, interno) */}
      <path d="M48 470C40 190 150 92 260 92s220 98 212 378" {...S} strokeWidth={1} strokeDasharray="4 6" opacity={0.35} />
      <path d="M74 462C70 222 162 130 260 130s190 92 186 332" {...S} strokeWidth={1.4} {...draw(0.45, 'text-sage-deep')} />
      <path d="M126 454C126 268 190 206 260 206s134 62 134 248" {...S} strokeWidth={1.2} opacity={0.55} {...draw(0.6)} />

      {/* dentes */}
      {teeth.map((t, i) => (
        <rect
          key={i}
          x={t.x - t.w / 2}
          y={t.y - t.h / 2}
          width={t.w}
          height={t.h}
          rx={t.h / 2.4}
          transform={`rotate(${-t.rot} ${t.x} ${t.y})`}
          {...S}
          strokeWidth={1.2}
          className="hero-fade"
          style={delay(0.9 + i * 0.05)}
        />
      ))}

      {/* cota horizontal */}
      <g {...fade(1.5)}>
        <path d="M86 504H434" {...S} strokeWidth={1} />
        <path d="M86 496v16M434 496v16" {...S} strokeWidth={1} />
        <text x={cx} y={530} textAnchor="middle" className="fill-current font-sans" fontSize="10.5" letterSpacing="2.6" opacity={0.75} stroke="#f7f3ec" strokeWidth={5} paintOrder="stroke">
          PLANEJAMENTO INDIVIDUAL
        </text>
      </g>

      {/* anotações das etapas */}
      {[
        { x: teeth[2].x, y: teeth[2].y, lx: 14, ly: 372, t: '01  AVALIAÇÃO', a: 'start' },
        { x: teeth[7].x, y: teeth[7].y, lx: 318, ly: 40, t: '02  PLANO', a: 'start' },
        { x: teeth[11].x, y: teeth[11].y, lx: 516, ly: 126, t: '03  ACOMPANHAMENTO', a: 'end' },
      ].map((n, i) => (
        <g key={i} {...fade(1.7 + i * 0.18)}>
          <path d={`M${n.x} ${n.y}L${n.a === 'end' ? n.lx - 8 : n.lx + 8} ${n.ly + 10}`} {...S} strokeWidth={1} opacity={0.5} />
          <circle cx={n.x} cy={n.y} r={4.5} className="fill-sage-deep" />
          <circle cx={n.x} cy={n.y} r={10} {...S} strokeWidth={1} className="text-sage-deep" opacity={0.6} />
          <text
            x={n.lx}
            y={n.ly}
            textAnchor={n.a as 'start' | 'end'}
            className="fill-current font-sans"
            fontSize="11"
            fontWeight={600}
            letterSpacing="2"
            stroke="#f7f3ec"
            strokeWidth={5}
            paintOrder="stroke"
            strokeLinejoin="round"
          >
            {n.t}
          </text>
        </g>
      ))}

      {/* mira central */}
      <g {...fade(1.2)}>
        <circle cx={cx} cy={300} r={16} {...S} strokeWidth={1} opacity={0.6} />
        <path d={`M${cx - 26} 300h52M${cx} 274v52`} {...S} strokeWidth={1} opacity={0.6} />
      </g>
    </svg>
  )
}

export function Hero() {
  const fotoHero = CONFIG.fotos.fachada
  const semana = CONFIG.horarios.find((h) => h.abre && h.fecha)

  return (
    <section id="inicio" aria-labelledby="titulo-hero" className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="blueprint absolute inset-0 -z-10"
        style={{
          maskImage: 'radial-gradient(ellipse 70% 70% at 75% 45%, #000 20%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 75% 45%, #000 20%, transparent 75%)',
        }}
      />
      <div className={`wrap grid items-center gap-10 pb-16 lg:grid-cols-12 lg:gap-8 lg:pb-24 ${CONFIG.rascunho ? 'pt-[148px] lg:pt-[168px]' : 'pt-[116px] lg:pt-[136px]'}`}>
        <div className="lg:col-span-7">
          <p className="hero-up eyebrow flex items-center gap-3 !tracking-[0.14em] text-sage-deep sm:!tracking-[0.2em]" style={delay(0.05)}>
            <span aria-hidden="true" className="h-px w-8 bg-current" />
            Odontologia · Pouso Alegre - MG
          </p>
          <div id="titulo-hero" className="mt-6">
            <TituloRevelado />
          </div>
          <p className="hero-up mt-7 max-w-xl text-lg text-muted md:text-xl" style={delay(0.6)}>
            Avaliação individual, explicação clara de cada etapa e atendimento com hora marcada.
          </p>
          <div className="hero-up mt-9 flex flex-col gap-3 sm:flex-row" style={delay(0.72)}>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <IconChat size={19} /> Agendar minha avaliação
            </a>
            {CONFIG.atendimentos.length > 0 && CONFIG.secoes.atendimentos && (
              <a href="#atendimentos" className="btn btn-ghost">
                Ver atendimentos <IconArrow size={18} />
              </a>
            )}
          </div>
          <dl className="hero-up mt-12 grid max-w-xl grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-6 text-sm sm:grid-cols-3" style={delay(0.85)}>
            {semana && (
              <div>
                <dt className="eyebrow !text-[0.68rem] text-muted">Atendimento</dt>
                <dd className="mt-1 font-medium text-ink">Seg a sex · {faixaHorario(semana)}</dd>
              </div>
            )}
            <div>
              <dt className="eyebrow !text-[0.68rem] text-muted">Endereço</dt>
              <dd className="mt-1 font-medium text-ink">{CONFIG.endereco.bairro} · {CONFIG.endereco.cidade}</dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="eyebrow !text-[0.68rem] text-muted">Consultas</dt>
              <dd className="mt-1 font-medium text-ink">Com hora marcada</dd>
            </div>
          </dl>
        </div>

        <div className="relative mx-auto mt-2 w-full max-w-[440px] lg:col-span-5 lg:mt-0 lg:max-w-none">
          <DiagramaArcada />
          {fotoHero && (
            <figure
              className="hero-up absolute left-0 top-0 w-[29%] max-w-[150px]"
              style={delay(1.2)}
            >
              <div className="relative rounded-[18px] bg-paper p-2 shadow-[0_24px_50px_-28px_rgb(15_45_40/0.55)] ring-1 ring-line">
                <img
                  src={fotoHero.src}
                  alt={fotoHero.alt}
                  width={fotoHero.largura}
                  height={fotoHero.altura}
                  className="aspect-[3/4] w-full rounded-[12px] object-cover"
                  fetchPriority="high"
                />
              </div>
              <figcaption className="mt-2 whitespace-nowrap pl-1 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-muted">
                {fotoHero.legenda}
              </figcaption>
            </figure>
          )}
        </div>
      </div>
    </section>
  )
}
