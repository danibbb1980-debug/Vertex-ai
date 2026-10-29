import type { CSSProperties } from 'react'
import { useNaTela } from '../lib/hooks'

const LARGURA = 1440

/**
 * Caminho de onda periódico com 2× a largura, para o trilho deslizar
 * -50% e emendar sem corte. `comp` precisa dividir LARGURA.
 */
export function caminhoOnda(alt: number, base: number, amp: number, comp: number, fase = 0) {
  const w = LARGURA * 2
  const q = comp / 4
  const ini = -fase
  let d = `M${ini} ${base} Q${ini + q} ${base - amp * 2} ${ini + comp / 2} ${base}`
  for (let x = ini + comp / 2; x < w + comp; x += comp / 2) d += ` T${x + comp / 2} ${base}`
  return `${d} V${alt} H${ini} Z`
}

/** Linha de onda (só traço), para filetes. */
export function linhaOnda(base: number, amp: number, comp: number, fase = 0) {
  const w = LARGURA * 2
  const q = comp / 4
  const ini = -fase
  let d = `M${ini} ${base} Q${ini + q} ${base - amp * 2} ${ini + comp / 2} ${base}`
  for (let x = ini + comp / 2; x < w + comp; x += comp / 2) d += ` T${x + comp / 2} ${base}`
  return d
}

export interface Camada {
  cor: string
  base: number
  amp: number
  comp: number
  fase?: number
  dur: number
  reverso?: boolean
  opacidade?: number
  linha?: boolean
  espessura?: number
}

interface Props {
  camadas: Camada[]
  altura: number
  className?: string
  style?: CSSProperties
}

/** Pilha de ondas animadas, pausadas fora da tela e estáticas com movimento reduzido. */
export function Ondas({ camadas, altura, className = '', style }: Props) {
  const [ref, visivel] = useNaTela<HTMLDivElement>()
  return (
    <div ref={ref} aria-hidden="true" data-pausado={!visivel} className={`pointer-events-none overflow-hidden ${className}`} style={style}>
      {camadas.map((c, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{ opacity: c.opacidade ?? 1 }}
        >
          <svg
            className="onda-trilho"
            viewBox={`0 0 ${LARGURA * 2} ${altura}`}
            preserveAspectRatio="none"
            style={{ '--dur': `${c.dur}s`, '--dir': c.reverso ? 'reverse' : 'normal' } as CSSProperties}
          >
            {c.linha ? (
              <path
                d={linhaOnda(c.base, c.amp, c.comp, c.fase)}
                fill="none"
                stroke={c.cor}
                strokeWidth={c.espessura ?? 1.5}
                vectorEffect="non-scaling-stroke"
              />
            ) : (
              <path d={caminhoOnda(altura, c.base, c.amp, c.comp, c.fase)} fill={c.cor} />
            )}
          </svg>
        </div>
      ))}
    </div>
  )
}

/**
 * Transição entre seções: a onda da cor da próxima seção "sobe" sobre a atual.
 * É o fio condutor visual que leva o visitante do hero até o contato.
 */
export function Divisor({
  de,
  para,
  variante = 0,
  className = '',
}: {
  de: string
  para: string
  variante?: number
  className?: string
}) {
  const v = [
    { comp: 1440, amp: 14, fase: 0, dur: 60 },
    { comp: 720, amp: 10, fase: 180, dur: 70 },
    { comp: 1440, amp: 18, fase: 520, dur: 80 },
  ][variante % 3]
  return (
    <div className={`relative h-16 sm:h-24 ${className}`} style={{ background: de }}>
      <Ondas
        altura={100}
        className="absolute inset-0"
        camadas={[
          { cor: para, base: 46, amp: v.amp, comp: v.comp, fase: v.fase + 240, dur: v.dur * 1.3, reverso: true, opacidade: 0.45 },
          { cor: para, base: 62, amp: v.amp * 0.8, comp: v.comp, fase: v.fase, dur: v.dur },
        ]}
      />
    </div>
  )
}
