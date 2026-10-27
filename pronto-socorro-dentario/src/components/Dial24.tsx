/**
 * Momento de assinatura: um mostrador de 24 horas cujo arco se completa ao carregar.
 * Só CSS (stroke-dashoffset + rotate), sem JS. Com reduced-motion, já aparece completo.
 */
const TICKS = Array.from({ length: 24 }, (_, i) => i)
// A animação usa uma curva "ease-out"; para cada marca acender quando o arco passa por ela,
// invertemos a curva de forma aproximada: p = 1 - (1 - t)^4  =>  t = 1 - (1 - p)^(1/4)
const delayFor = (i: number) => {
  const p = i / 24
  const t = 1 - Math.pow(1 - p, 1 / 4)
  return 0.25 + t * 2.2
}

export function Dial24({ className = '', dark = false }: { className?: string; dark?: boolean }) {
  const tickColor = dark ? '#ffffff' : '#0b2418'
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="Atendimento 24 horas"
    >
      <circle cx="100" cy="100" r="96" fill={dark ? 'rgba(255,255,255,0.03)' : '#fffdf8'} stroke={dark ? 'rgba(255,255,255,0.14)' : '#ddd6c7'} />
      {TICKS.map((i) => {
        const major = i % 6 === 0
        const a = (i / 24) * Math.PI * 2 - Math.PI / 2
        const r1 = 88
        const r2 = major ? 78 : 83
        return (
          <line
            key={i}
            className="dial-tick"
            style={{ animationDelay: `${delayFor(i).toFixed(2)}s` }}
            x1={(100 + Math.cos(a) * r1).toFixed(2)}
            y1={(100 + Math.sin(a) * r1).toFixed(2)}
            x2={(100 + Math.cos(a) * r2).toFixed(2)}
            y2={(100 + Math.sin(a) * r2).toFixed(2)}
            stroke={major ? '#00a346' : tickColor}
            strokeOpacity={major ? 1 : 0.5}
            strokeWidth={major ? 2 : 1.2}
            strokeLinecap="round"
          />
        )
      })}
      <circle cx="100" cy="100" r="68" fill="none" stroke={dark ? 'rgba(255,255,255,0.1)' : '#efeadf'} strokeWidth="5" />
      <circle
        className="dial-arc"
        cx="100"
        cy="100"
        r="68"
        fill="none"
        stroke="#00a346"
        strokeWidth="5"
        strokeLinecap="round"
        pathLength={1}
        transform="rotate(-90 100 100)"
      />
      <g className="dial-head">
        <circle cx="100" cy="32" r="7" fill="#ffb224" />
        <circle cx="100" cy="32" r="2.6" fill="#1a1405" />
      </g>
      <text
        x="100"
        y="108"
        textAnchor="middle"
        fontFamily="'Bricolage Grotesque Variable', system-ui, sans-serif"
        fontWeight="700"
        fontSize="46"
        letterSpacing="-2"
        fill={dark ? '#fffdf8' : '#0b2418'}
      >
        24h
      </text>
      <text
        x="100"
        y="130"
        textAnchor="middle"
        fontFamily="'Manrope Variable', system-ui, sans-serif"
        fontWeight="700"
        fontSize="9"
        letterSpacing="2.4"
        fill={dark ? 'rgba(255,255,255,0.7)' : '#4b5a51'}
      >
        ATENDIMENTO
      </text>
    </svg>
  )
}
