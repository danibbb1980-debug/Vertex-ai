import { CONFIG } from '../config'
import { Dial24 } from '../components/Dial24'
import { CallButton, WaButton } from '../components/ui'

const LINE_2 = ['Nosso', 'atendimento', 'também', 'não.']

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative overflow-hidden">
      {/* arco fino de fundo, eco do arco do logo */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -right-[22rem] -top-40 hidden h-[60rem] w-[60rem] text-line lg:block"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle cx="50" cy="50" r="49.5" stroke="currentColor" strokeWidth=".12" />
        <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth=".12" strokeDasharray=".4 1.2" />
      </svg>

      <div className="wrap relative grid gap-10 pb-12 pt-7 sm:pt-12 lg:grid-cols-12 lg:gap-12 lg:pb-20 lg:pt-14">
        <div className="lg:col-span-7 lg:pt-6">
          <p className="eyebrow flex flex-wrap items-center gap-x-2.5 gap-y-1 !text-[0.7rem] !tracking-[0.1em] sm:gap-x-3 sm:!text-xs sm:!tracking-[0.16em]">
            <span>Odontologia de urgência</span>
            <span aria-hidden="true" className="h-px w-4 bg-brand-ink/40 sm:w-5" />
            <span>
              {CONFIG.cidade} - {CONFIG.uf}
            </span>
          </p>

          <h1 id="hero-title" className="mt-4 text-[2.12rem] font-bold leading-[1.04] sm:mt-5 sm:text-[3.6rem] lg:text-[4.1rem] xl:text-[4.5rem]">
            <span className="block">Dor de dente não marca hora.</span>
            <span className="block text-brand-ink">
              {LINE_2.map((w, i) => (
                <span key={w}>
                  <span className="cut">
                    <span style={{ ['--i' as string]: i }}>{w}</span>
                  </span>
                  {i < LINE_2.length - 1 ? ' ' : ''}
                </span>
              ))}
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-[1.06rem] leading-relaxed text-muted sm:mt-6 sm:text-xl">
            Atendimento odontológico de urgência, 24 horas, com avaliação individual e explicação clara.
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:gap-3">
            <WaButton className="w-full sm:w-auto" />
            <CallButton className="btn-dark w-full sm:w-auto" />
          </div>

          <p className="mt-5 flex items-center gap-2.5 text-[0.92rem] text-muted">
            <span className="pulse-dot" aria-hidden="true" />
            <span>
              <strong className="font-semibold text-forest">Atendimento 24 horas.</strong> {CONFIG.horarioObservacao}
            </span>
          </p>
        </div>

        <div className="relative lg:col-span-5">
          <HeroVisual />
        </div>
      </div>

      <div className="wrap">
        <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line text-[0.95rem] sm:grid-cols-3">
          {/* Fonte: frases da ficha do Google */}
          {[
            ['Urgência odontológica', 'Para dor, fraturas e traumas'],
            ['Todas as idades', 'Crianças, adultos e idosos'],
            ['Fácil de achar', CONFIG.endereco.referencia],
          ].map(([t, d]) => (
            <li key={t} className="flex items-baseline gap-3 bg-ivory px-5 py-4">
              <span className="h-1.5 w-1.5 flex-none translate-y-[-2px] rounded-full bg-brand" aria-hidden="true" />
              <span>
                <strong className="font-semibold text-forest">{t}</strong>
                <span className="text-muted"> · {d}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Marquee() {
  const items = [
    'Urgência odontológica',
    'Atendimento 24 horas',
    'Todas as idades',
    'Atendimento pediátrico',
    'Odontologia estética',
    'Sedação conforme avaliação',
    `${CONFIG.cidade} - ${CONFIG.uf}`,
  ]
  const row = (dup?: boolean) =>
    items.map((t, i) => (
      <li key={`${dup ? 'd' : 'o'}${i}`} data-dup={dup || undefined} aria-hidden={dup || undefined} className="flex items-center gap-6 pr-6">
        <span className="font-display text-[1.35rem] font-semibold tracking-[-0.01em] text-paper/90 sm:text-2xl">{t}</span>
        <span className="h-1.5 w-1.5 rounded-full bg-amber" aria-hidden="true" />
      </li>
    ))
  return (
    <div className="mt-14 border-y border-white/10 bg-forest py-5 lg:mt-20">
      <div className="marquee overflow-hidden">
        <ul className="marquee-track" aria-label="Atendimentos">
          {row()}
          {row(true)}
        </ul>
      </div>
    </div>
  )
}

/** Foto real do responsável técnico, com o mostrador 24h (momento de assinatura) sobreposto. */
function HeroVisual() {
  const foto = CONFIG.fotos.hero
  const rt = CONFIG.responsavelTecnico
  return (
    <figure className="on-dark relative isolate m-0 overflow-hidden rounded-[1.75rem] bg-forest text-white aspect-[4/5] sm:aspect-[5/4] lg:aspect-auto lg:h-full lg:min-h-[34rem]">
      <img
        src={foto}
        srcSet="/fotos/dr-antonio-480.webp 480w, /fotos/dr-antonio.webp 800w"
        sizes="(min-width: 1024px) 40vw, (min-width: 640px) 90vw, 100vw"
        alt={CONFIG.fotos.heroAlt}
        width={800}
        height={1203}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-[50%_18%]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-forest via-forest/35 via-45% to-transparent" />

      <p className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-forest/75 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-white/85 backdrop-blur-sm sm:left-5 sm:top-5">
        <span className="pulse-dot !bg-[#3fd17a]" aria-hidden="true" />
        Urgência odontológica
      </p>

      <figcaption className="absolute inset-x-0 bottom-0 flex items-end gap-4 p-4 sm:gap-5 sm:p-6">
        <span className="flex-none rounded-full bg-forest/85 p-1 backdrop-blur-sm">
          <Dial24 dark className="w-[6.5rem] sm:w-32 lg:w-36" />
        </span>
        <span className="pb-1 leading-snug">
          <strong className="block font-display text-[1.05rem] font-semibold text-paper sm:text-lg">{rt.nome}</strong>
          <span className="block text-[0.85rem] text-white/75">
            Responsável técnico · <span className="whitespace-nowrap">CRO-{CONFIG.uf} {rt.cro}</span>
          </span>
        </span>
      </figcaption>
    </figure>
  )
}
