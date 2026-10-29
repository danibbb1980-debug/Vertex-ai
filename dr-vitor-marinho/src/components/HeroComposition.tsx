import type { CSSProperties } from 'react'

/**
 * Momento de assinatura: quadrados nas cores do logo chegam dispersos e se encaixam.
 * A última peça (a "restauração") entra por último e o contorno de um dente é traçado por cima.
 * Tudo em CSS (transform/opacity); com movimento reduzido aparece montado.
 */
type Piece = { c: number; r: number; s: number; tone: string; x: string; y: string; rot: string }

const PIECES: Piece[] = [
  { c: 0, r: 2, s: 2, tone: 'var(--color-sage)', x: '-60%', y: '-40%', rot: '-14deg' },
  { c: 1, r: 1, s: 1, tone: 'var(--color-mint)', x: '-140%', y: '-120%', rot: '22deg' },
  { c: 2, r: 0, s: 2, tone: 'var(--color-mint)', x: '30%', y: '-80%', rot: '-9deg' },
  { c: 4, r: 1, s: 1, tone: 'var(--color-sage)', x: '160%', y: '-60%', rot: '30deg' },
  { c: 4, r: 2, s: 2, tone: 'color-mix(in oklab, var(--color-sage) 55%, var(--color-paper))', x: '70%', y: '20%', rot: '12deg' },
  { c: 0, r: 4, s: 1, tone: 'var(--color-mint)', x: '-180%', y: '90%', rot: '-28deg' },
  { c: 1, r: 4, s: 1, tone: 'color-mix(in oklab, var(--color-teal) 45%, var(--color-paper))', x: '-90%', y: '160%', rot: '18deg' },
  { c: 2, r: 4, s: 2, tone: 'var(--color-sage)', x: '10%', y: '70%', rot: '-16deg' },
  { c: 4, r: 4, s: 1, tone: 'var(--color-mint)', x: '150%', y: '120%', rot: '24deg' },
  { c: 5, r: 0, s: 1, tone: 'color-mix(in oklab, var(--color-teal) 30%, var(--color-paper))', x: '120%', y: '-150%', rot: '-20deg' },
  { c: 5, r: 4, s: 1, tone: 'color-mix(in oklab, var(--color-sage) 55%, var(--color-paper))', x: '200%', y: '60%', rot: '-12deg' },
]

const U = 100 / 6

export function HeroComposition() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px]" aria-hidden="true">
      {PIECES.map((p, i) => (
        <div
          key={i}
          className="absolute p-[3px] sm:p-1"
          style={{ left: `${p.c * U}%`, top: `${p.r * U}%`, width: `${p.s * U}%`, height: `${p.s * U}%` }}
        >
          <div
            className="piece h-full w-full"
            style={{ background: p.tone, '--x': p.x, '--y': p.y, '--r': p.rot, '--i': i } as CSSProperties}
          />
        </div>
      ))}

      {/* encaixe: a peça que restaura a composição */}
      <div className="absolute p-[3px] sm:p-1" style={{ left: `${2 * U}%`, top: `${2 * U}%`, width: `${2 * U}%`, height: `${2 * U}%` }}>
        <div className="h-full w-full border border-dashed border-teal-deep/30" />
      </div>
      <div className="absolute p-[3px] sm:p-1" style={{ left: `${2 * U}%`, top: `${2 * U}%`, width: `${2 * U}%`, height: `${2 * U}%` }}>
        <div className="piece-final relative h-full w-full bg-teal">
          <span className="absolute bottom-2 right-2 font-display text-[clamp(0.8rem,2.2vw,1.05rem)] italic text-night/80">Dr.</span>
        </div>
      </div>

      {/* traço do dente */}
      <svg viewBox="0 0 200 200" className="pointer-events-none absolute inset-[6%] h-[88%] w-[88%] overflow-visible">
        <path
          className="tooth-line"
          pathLength={1}
          d="M62 38c-22 0-33 19-31 46 2 26 13 41 18 66 5 26 12 42 23 42 13 0 15-22 19-42 3-13 6-20 9-20s6 7 9 20c4 20 6 42 19 42 11 0 18-16 23-42 5-25 16-40 18-66 2-27-9-46-31-46-15 0-22 9-38 9s-23-9-38-9Z"
          fill="none"
          stroke="var(--color-teal-ink)"
          strokeWidth="0.9"
        />
      </svg>

      {/* marcações técnicas */}
      <div className="fade-late absolute -left-2 top-[calc(33.3%-0.5rem)] -translate-x-full font-sans text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-ink-soft max-md:hidden">
        <span className="mr-2">01</span>
        <span className="inline-block h-px w-8 bg-sand align-middle" />
      </div>
      <p
        className="fade-late absolute -bottom-9 left-0 right-0 text-center font-sans text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-ink-soft"
        style={{ '--d': '3s' } as CSSProperties}
      >
        Peça por peça, com precisão
      </p>
    </div>
  )
}
