import { LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react'

// Momento de assinatura: uma linha contínua, como um gesto de alongamento,
// que se desenha uma única vez (≈2,5 s) ao carregar e depois fica parada.
// Adaptado do componente "Path drawing" (motion.dev, via 21st.dev): mesma
// variante pathLength 0 → 1, agora com um só traço, easing calmo e sem mola.

const caminho =
  'M -40 548 C 120 560 260 520 400 470 C 560 412 660 330 760 250 C 850 178 960 118 1060 138 C 1160 158 1170 278 1080 316 C 990 354 900 290 940 214 C 972 152 1050 96 1150 58'

export function LinhaMovimento({
  className = '',
  cor = 'var(--color-teal)',
  animar = true,
}: {
  className?: string
  cor?: string
  animar?: boolean
}) {
  const reduzir = useReducedMotion()
  const estatico = !animar || reduzir

  return (
    <LazyMotion features={domAnimation} strict>
      <svg
        className={className}
        viewBox="0 0 1200 600"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        focusable="false"
      >
        <m.path
          d={caminho}
          stroke={cor}
          strokeWidth="1.75"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={estatico ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { delay: 0.5, duration: 2.5, ease: [0.45, 0.05, 0.25, 1] },
            opacity: { delay: 0.5, duration: 0.01 },
          }}
        />
        <m.circle
          cx="1158"
          cy="54"
          r="9"
          fill={cor}
          initial={estatico ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ transformOrigin: '1158px 54px' }}
          transition={{ delay: 2.9, duration: 0.5, ease: [0.22, 0.61, 0.24, 1] }}
        />
      </svg>
    </LazyMotion>
  )
}
