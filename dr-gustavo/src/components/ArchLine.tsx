import { useCallback, useRef, type ReactNode } from 'react'
import { useScrollProgress } from '../lib/scroll'

/**
 * Momento de assinatura: uma linha fina contínua, em arcos como a curva de
 * uma arcada, desenhada conforme a rolagem e atravessando as seções.
 * Fica atrás do conteúdo; cartões e blocos escuros passam por cima.
 *
 * Desempenho: cada arco é revelado por uma "janela" que desliza (caixa
 * externa com overflow hidden sobe, conteúdo interno desce na mesma medida).
 * Só transform muda, sem repintar a linha a cada quadro.
 */
function segment(i: number) {
  const x = i % 2 === 0 ? 88 : 9
  const nx = i % 2 === 0 ? 9 : 91
  return `M ${x} 0 C ${x} 55, ${nx} 45, ${nx} 100`
}

function Arc({ i, opacity, width }: { i: number; opacity: number; width: number }) {
  return (
    <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
      <path d={segment(i)} stroke="currentColor" strokeOpacity={opacity} strokeWidth={width} vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export function ArchLine({ children, arcs = 9 }: { children: ReactNode; arcs?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const outer = useRef<(HTMLDivElement | null)[]>([])
  const inner = useRef<(HTMLDivElement | null)[]>([])
  const last = useRef<number[]>([])
  const draw = useCallback(
    (p: number) => {
      for (let i = 0; i < arcs; i++) {
        const local = Math.min(1, Math.max(0, p * arcs - i))
        if (last.current[i] === local) continue
        last.current[i] = local
        const off = (1 - local) * 100
        const o = outer.current[i]
        const n = inner.current[i]
        if (o && n) {
          o.style.transform = `translateY(${-off}%)`
          n.style.transform = `translateY(${off}%)`
        }
      }
    },
    [arcs],
  )
  useScrollProgress(ref, draw, { start: 0.85, end: 0.7 })

  return (
    <div ref={ref} className="relative isolate">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 text-accent opacity-60 md:opacity-100">
        {Array.from({ length: arcs }, (_, i) => (
          <div key={i} className="absolute left-0 w-full" style={{ top: `${(i * 100) / arcs}%`, height: `${100 / arcs}%` }}>
            <Arc i={i} opacity={0.08} width={1} />
            <div
              ref={(el) => {
                outer.current[i] = el
              }}
              className="absolute inset-0 overflow-hidden will-change-transform"
              style={{ transform: 'translateY(-100%)' }}
            >
              <div
                ref={(el) => {
                  inner.current[i] = el
                }}
                className="absolute inset-0 will-change-transform"
                style={{ transform: 'translateY(100%)' }}
              >
                <Arc i={i} opacity={0.42} width={1.2} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {children}
    </div>
  )
}
