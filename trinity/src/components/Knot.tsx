import knot from '../knot.json'

type Props = {
  /** laço aceso (0 = atendimentos, 1 = cursos, 2 = contato); null = nenhum */
  active?: number | null
  /** desenha o nó em traço único, um laço de cada vez */
  draw?: boolean
  /** cor de fundo atrás do nó: usada para o "por cima e por baixo" nos cruzamentos */
  gap: string
  ink: string
  on: string
  width?: number
  widthOn?: number
  circle?: boolean
  className?: string
  title?: string
  idPrefix: string
}

/**
 * O nó de três laços do emblema da Trinity, redesenhado em três paths.
 * O entrelaçado é feito com cópias do laço "de cima" recortadas em cada cruzamento,
 * com um contorno largo na cor do fundo por baixo.
 */
export function Knot({
  active = null,
  draw = false,
  gap,
  ink,
  on,
  width = 9,
  widthOn,
  circle = true,
  className = '',
  title,
  idPrefix,
}: Props) {
  const wOn = widthOn ?? width * 1.35
  const vars = {
    '--k-ink': ink,
    '--k-on': on,
    '--k-gap': gap,
    '--k-w': width,
    '--k-w-on': wOn,
    '--k-gap-w': wOn + width * 1.6,
  } as React.CSSProperties

  const lobeClass = (i: number) =>
    `knot-lobe${active === i ? ' is-on' : ''}${draw ? ' is-drawing' : ''}`
  const delay = (i: number) => (draw ? { animationDelay: `${0.25 + i * 0.85}s` } : undefined)

  return (
    <svg
      viewBox="-320 -320 640 640"
      className={`knot ${className}`}
      style={vars}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <defs>
        {knot.crossings.map((c, k) => (
          <g key={k}>
            <clipPath id={`${idPrefix}-x${k}`}>
              <circle cx={c.x} cy={c.y} r={34} />
            </clipPath>
            <clipPath id={`${idPrefix}-y${k}`}>
              <circle cx={c.x} cy={c.y} r={44} />
            </clipPath>
          </g>
        ))}
      </defs>
      {circle && (
        <g className={`knot-ring${draw ? ' is-drawing' : ''}`} fill="none" stroke={ink}>
          <circle r={302} strokeWidth={Math.max(1.2, width * 0.28)} pathLength={1} />
          <circle r={286} strokeWidth={Math.max(1.2, width * 0.28)} pathLength={1} />
        </g>
      )}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {knot.paths.map((d, i) => (
          <path key={i} d={d} pathLength={1} className={lobeClass(i)} style={delay(i)} />
        ))}
        {knot.crossings.map((c, k) => (
          <g key={k}>
            <path
              d={knot.paths[c.over]}
              pathLength={1}
              clipPath={`url(#${idPrefix}-x${k})`}
              className={`${lobeClass(c.over)} knot-gap`}
              style={delay(c.over)}
            />
            <path
              d={knot.paths[c.over]}
              pathLength={1}
              clipPath={`url(#${idPrefix}-y${k})`}
              className={lobeClass(c.over)}
              style={delay(c.over)}
            />
          </g>
        ))}
      </g>
    </svg>
  )
}
