import { type Ref, useImperativeHandle, useRef } from 'react'
import { MARCA_VIEWBOX, PALAVRA_AFETO, PALAVRA_SUB, PECAS, type Peca } from './logo-paths'

export const COR_PECA = { salvia: '#a6d2b3', ambar: '#f5a64c', terracota: '#b74b17' } as const

export interface MosaicoControle {
  /** 0 = peças afastadas, 1 = mosaico montado */
  definir: (p: number) => void
}

const transformar = (p: Peca, v: number) =>
  `translate(${(p.dx * (1 - v)).toFixed(2)}px, ${(p.dy * (1 - v)).toFixed(2)}px) rotate(${(p.r * (1 - v)).toFixed(2)}deg)`

/**
 * O mosaico do logo (triângulo + gota), peça por peça.
 * Com `controle`, as peças começam afastadas (`inicial`) e se encaixam conforme `definir(p)`.
 */
export function Mosaico({
  controle,
  inicial = 1,
  className,
  titulo,
}: {
  controle?: Ref<MosaicoControle>
  inicial?: number
  className?: string
  titulo?: string
}) {
  const refs = useRef<(SVGPathElement | null)[]>([])
  useImperativeHandle(controle, () => ({
    definir: (v: number) => {
      refs.current.forEach((el, i) => {
        if (el) el.style.transform = transformar(PECAS[i], v)
      })
    },
  }))
  return (
    <svg
      viewBox={MARCA_VIEWBOX}
      className={className}
      role={titulo ? 'img' : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
      focusable="false"
      overflow="visible"
    >
      {PECAS.map((p, i) => (
        <path
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          d={p.d}
          fill={COR_PECA[p.cor]}
          className={controle ? 'peca' : undefined}
          style={
            controle
              ? { transform: transformar(p, inicial), transformOrigin: `${p.ox}px ${p.oy}px`, transformBox: 'view-box' }
              : undefined
          }
        />
      ))}
    </svg>
  )
}

/** Logo completo (marca + AFETO + ESPAÇO TERAPÊUTICO), vetorizado do arquivo original. */
export function LogoCompleto({ className, cor = '#b74b17' }: { className?: string; cor?: string }) {
  return (
    <svg viewBox="180 75 1085 1230" className={className} role="img" aria-label="Afeto Espaço Terapêutico">
      {PECAS.map((p, i) => (
        <path key={i} d={p.d} fill={COR_PECA[p.cor]} />
      ))}
      <path d={PALAVRA_AFETO} fill={cor} fillRule="evenodd" />
      <path d={PALAVRA_SUB} fill={cor} fillRule="evenodd" />
    </svg>
  )
}

/** Versão compacta para o cabeçalho: marca à esquerda, palavra à direita (mesmos desenhos do logo). */
export function LogoCompacto({ className, cor = '#b74b17' }: { className?: string; cor?: string }) {
  // Marca ocupa x 270..1175 / y 70..860 no desenho original; palavra x 190..1255 / y 880..1295.
  // Aqui: marca reduzida à esquerda; palavra à direita.
  const escalaMarca = 0.5
  return (
    <svg viewBox="0 0 1600 420" className={className} role="img" aria-label="Afeto Espaço Terapêutico">
      <g transform={`translate(-125 -25) scale(${escalaMarca})`}>
        {PECAS.map((p, i) => (
          <path key={i} d={p.d} fill={COR_PECA[p.cor]} />
        ))}
      </g>
      <g transform="translate(395 -830) scale(0.95)" fill={cor}>
        <path d={PALAVRA_AFETO} fillRule="evenodd" />
        <path d={PALAVRA_SUB} fillRule="evenodd" />
      </g>
    </svg>
  )
}
