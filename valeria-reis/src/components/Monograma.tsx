import { useId, type CSSProperties } from 'react'

/**
 * Monograma VM do Espaço Saúde e Mulher, redesenhado em traço contínuo a partir do logo original.
 * Traços em cinza-taupe (letras) e degradê bronze-ouro (linhas internas), como no arquivo da marca.
 * `desenhar` = animação de stroke-dashoffset (desligada com prefers-reduced-motion via CSS).
 */

// letras (taupe)
const LETRAS = [
  'M24 396C60 400 100 520 125 650C140 720 150 780 158 800C170 700 190 560 225 440C250 360 285 325 325 335',
  'M545 668C565 650 575 600 545 575C505 545 430 560 400 620C370 690 388 790 468 805C538 815 594 742 634 642C664 562 684 472 704 397C699 500 689 620 691 700C739 620 819 470 865 392C843 470 797 600 797 700C797 750 807 775 820 787',
]
// linhas internas (degradê bronze-ouro)
const FIOS = [
  'M210 40C190 80 150 130 118 167C94 192 94 230 118 250C138 262 168 265 175 280C165 300 160 330 168 360C178 390 200 410 220 430',
  'M210 150C205 200 230 245 270 260C300 268 335 255 362 236',
  'M377 312C355 340 350 390 380 420C410 450 470 470 500 495C530 520 555 555 562 595',
  'M225 500C228 550 250 590 268 620C280 645 290 670 293 695',
  'M264 545L272 562',
  'M352 568C340 620 320 700 312 760C308 790 309 820 310 835',
]

// ordem do desenho: V, linhas da silhueta, C+M
const ORDEM: { d: string; tipo: 'letra' | 'fio'; atraso: number; dur: number }[] = [
  { d: LETRAS[0], tipo: 'letra', atraso: 0.2, dur: 1.5 },
  { d: FIOS[0], tipo: 'fio', atraso: 1.1, dur: 1.4 },
  { d: FIOS[1], tipo: 'fio', atraso: 1.7, dur: 0.9 },
  { d: FIOS[2], tipo: 'fio', atraso: 2.1, dur: 1.2 },
  { d: FIOS[3], tipo: 'fio', atraso: 2.5, dur: 0.8 },
  { d: FIOS[4], tipo: 'fio', atraso: 2.9, dur: 0.3 },
  { d: FIOS[5], tipo: 'fio', atraso: 2.8, dur: 0.9 },
  { d: LETRAS[1], tipo: 'letra', atraso: 3.0, dur: 2.4 },
]

type Props = {
  className?: string
  desenhar?: boolean
  /** espessura relativa do traço (1 = como no logo) */
  peso?: number
  /** variante sobre fundo escuro */
  claro?: boolean
  titulo?: string
}

export function Monograma({ className, desenhar = false, peso = 1, claro = false, titulo }: Props) {
  const id = useId().replace(/:/g, '')
  const grad = `vm-ouro-${id}`
  const taupe = claro ? '#CFC6B4' : '#A39D8F'
  return (
    <svg
      viewBox="0 0 928 840"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={[className, desenhar ? 'vm-desenhar' : ''].filter(Boolean).join(' ')}
      role={titulo ? 'img' : undefined}
      aria-hidden={titulo ? undefined : true}
      aria-label={titulo}
      focusable="false"
    >
      <defs>
        <linearGradient id={grad} gradientUnits="userSpaceOnUse" x1="120" y1="20" x2="420" y2="840">
          <stop offset="0" stopColor={claro ? '#C9A56E' : '#6E5838'} />
          <stop offset=".45" stopColor="#B08D5B" />
          <stop offset="1" stopColor={claro ? '#EADBB8' : '#D2BC90'} />
        </linearGradient>
      </defs>
      {ORDEM.map((p, i) => (
        <path
          key={i}
          d={p.d}
          pathLength={1}
          stroke={p.tipo === 'letra' ? taupe : `url(#${grad})`}
          strokeWidth={(p.tipo === 'letra' ? 7 : 6) * peso}
          style={
            desenhar
              ? ({ '--vm-atraso': `${p.atraso}s`, '--vm-dur': `${p.dur}s` } as CSSProperties)
              : undefined
          }
        />
      ))}
    </svg>
  )
}

/** tempo total do desenho (s), usado para encadear o fio do hero */
export const DURACAO_MONOGRAMA = 5.4
