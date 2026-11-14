import { motion, type MotionValue } from 'motion/react'
import { prefereReduzir } from '../lib/hooks'

/**
 * Monograma B Clinic redesenhado em vetor a partir do perfil da clínica:
 * círculo de traço único + "B" de linhas retas em duas peças encaixadas
 * (a peça superior desloca a barra para a esquerda).
 * Coordenadas medidas no print do logo (viewBox 400 × 400).
 */
export const PATH_SUPERIOR =
  'M229.3 181H126V100.8H252C266 100.8 277 112 277 126V146C277 166 264 181 244.7 181'
export const PATH_INFERIOR =
  'M148.1 202H250C281 202 297.7 219 297.7 250.5C297.7 282 281 299.2 250 299.2H126V195.9'
export const ANEL_R = 180

type Props = {
  className?: string
  /** cor do traço (padrão: champanhe) */
  cor?: string
  /** espessura do anel (unidades do viewBox) */
  anel?: number
  /** espessura do B */
  traco?: number
  /** anima o desenho em traço único */
  desenhar?: boolean
  /** opacidade do anel controlada por scroll (assinatura) */
  anelOpacity?: MotionValue<number>
  bOpacity?: MotionValue<number>
  titulo?: string
  svgRef?: React.Ref<SVGSVGElement>
}

const ease = [0.65, 0, 0.35, 1] as const

export function Monograma({
  className,
  cor = 'var(--color-champanhe)',
  anel = 6,
  traco = 12,
  desenhar = false,
  anelOpacity,
  bOpacity,
  titulo,
  svgRef,
}: Props) {
  const instantaneo = prefereReduzir()
  const draw = (delay: number, duration: number) =>
    desenhar
      ? {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: instantaneo
            ? { duration: 0 }
            : {
                pathLength: { delay, duration, ease },
                opacity: { delay, duration: 0.01 },
              },
        }
      : {}

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 400"
      className={className}
      fill="none"
      role={titulo ? 'img' : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
      focusable="false"
    >
      <motion.g style={anelOpacity ? { opacity: anelOpacity } : undefined}>
        <motion.circle
          cx="200"
          cy="200"
          r={ANEL_R}
          stroke={cor}
          strokeWidth={anel}
          transform="rotate(-90 200 200)"
          {...draw(0.15, 1.5)}
        />
      </motion.g>
      <motion.g
        stroke={cor}
        strokeWidth={traco}
        strokeLinejoin="miter"
        strokeLinecap="butt"
        style={bOpacity ? { opacity: bOpacity } : undefined}
      >
        <motion.path d={PATH_SUPERIOR} {...draw(1.45, 1.05)} />
        <motion.path d={PATH_INFERIOR} {...draw(2.25, 1.1)} />
      </motion.g>
    </svg>
  )
}
