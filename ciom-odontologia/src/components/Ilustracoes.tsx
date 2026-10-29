import type { Atendimento } from '../config'

/** Ilustrações originais de traço, abstratas, no estilo de desenho técnico. */

const common = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  vectorEffect: 'non-scaling-stroke' as const,
}

function Cota({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <path d={`M${x1} ${y1}L${x2} ${y2}`} {...common} strokeDasharray="2 3" opacity={0.55} />
}

function Alinhador() {
  // arcada vista de cima: dentes como cápsulas ao longo de uma curva
  const n = 12
  const teeth = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1)
    const a = Math.PI * (0.08 + 0.84 * t)
    const x = 80 - Math.cos(a) * 54
    const y = 100 - Math.sin(a) * 70
    const rot = (Math.atan2(Math.cos(a) * 70, Math.sin(a) * 54) * 180) / Math.PI
    const w = i < 2 || i > n - 3 ? 13 : i < 4 || i > n - 5 ? 11 : 9
    return { x, y, rot, w }
  })
  return (
    <svg viewBox="0 0 160 120" aria-hidden="true">
      <path d="M20 108C18 40 50 18 80 18s62 22 60 90" {...common} opacity={0.9} />
      <path d="M34 106C33 52 56 34 80 34s47 18 46 72" {...common} opacity={0.9} />
      {teeth.map((t, i) => (
        <rect
          key={i}
          x={t.x - t.w / 2}
          y={t.y - 5}
          width={t.w}
          height={10}
          rx={4}
          transform={`rotate(${-t.rot} ${t.x} ${t.y})`}
          {...common}
          opacity={0.75}
        />
      ))}
      <Cota x1={80} y1={6} x2={80} y2={30} />
      <circle cx={80} cy={18} r={2} fill="currentColor" />
    </svg>
  )
}

function Implante() {
  return (
    <svg viewBox="0 0 160 120" aria-hidden="true">
      <path d="M58 30c0-12 10-18 22-18s22 6 22 18c0 9-4 14-8 16H66c-4-2-8-7-8-16Z" {...common} />
      <path d="M70 46h20l-2 10H72Z" {...common} />
      <path d="M72 56h16l-1.5 46c-.2 4-3 7-6.5 7s-6.3-3-6.5-7Z" {...common} />
      {[64, 72, 80, 88, 96].map((y) => (
        <path key={y} d={`M71 ${y}l18 4`} {...common} opacity={0.7} />
      ))}
      <path d="M30 60h100" {...common} strokeDasharray="1 4" opacity={0.5} />
      <Cota x1={118} y1={12} x2={118} y2={109} />
      <path d="M114 12h8M114 109h8" {...common} opacity={0.55} />
    </svg>
  )
}

function Faceta() {
  return (
    <svg viewBox="0 0 160 120" aria-hidden="true">
      <path d="M50 22c6-6 24-8 30-8s24 2 30 8c5 6 4 30 0 50-4 22-14 34-30 34S54 94 50 72c-4-20-5-44 0-50Z" {...common} />
      <path d="M44 20c7-8 28-11 36-11s29 3 36 11" {...common} opacity={0.9} />
      <path d="M44 20c-5 8-5 32-1 54" {...common} opacity={0.9} />
      <path d="M116 20c5 8 5 32 1 54" {...common} opacity={0.9} />
      <Cota x1={30} y1={14} x2={44} y2={20} />
      <circle cx={30} cy={14} r={2} fill="currentColor" />
      <path d="M80 30v56" {...common} strokeDasharray="1 4" opacity={0.45} />
    </svg>
  )
}

function Siso() {
  return (
    <svg viewBox="0 0 160 120" aria-hidden="true">
      <g transform="rotate(-18 80 60)">
        <path d="M52 34c4-10 14-12 20-8 4-4 12-4 16 0 6-4 16-2 20 8 4 12 0 22-4 26H56c-4-4-8-14-4-26Z" {...common} />
        <path d="M58 60c0 18-4 34-2 44 4 4 10 0 12-10l4-18 4 18c2 10 8 14 12 10 2-10-2-26-2-44" {...common} />
        <path d="M66 36c4 3 10 3 14 0 4 3 10 3 14 0" {...common} opacity={0.6} />
      </g>
      <path d="M18 64c30-6 94-6 124 0" {...common} strokeDasharray="3 4" opacity={0.55} />
      <circle cx={132} cy={30} r={10} {...common} opacity={0.6} />
      <path d="M124 38 112 50" {...common} opacity={0.55} />
    </svg>
  )
}

export function Ilustracao({ tipo }: { tipo: Atendimento['ilustracao'] }) {
  switch (tipo) {
    case 'alinhador':
      return <Alinhador />
    case 'implante':
      return <Implante />
    case 'faceta':
      return <Faceta />
    case 'siso':
      return <Siso />
  }
}
