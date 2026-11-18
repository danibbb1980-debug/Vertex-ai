import { CONFIG } from '../config'

type Props = { tom?: 'claro' | 'escuro'; compacto?: boolean; className?: string }

/**
 * Logotipo tipográfico PROVISÓRIO. Se CONFIG.logo for preenchido, a imagem do cliente substitui este.
 * tom "claro" = grafite sobre papel; tom "escuro" = papel sobre grafite.
 */
export function Logo({ tom = 'claro', compacto = false, className = '' }: Props) {
  const label = `${CONFIG.advogado.nome} · ${CONFIG.advogado.profissao}`
  if (CONFIG.logo) return <img src={CONFIG.logo} alt={label} className={className} />
  const tinta = tom === 'claro' ? '#1C1D20' : '#F2EFE8'
  const acento = tom === 'claro' ? '#2A3FA6' : '#F2EFE8'
  return (
    <svg
      viewBox={compacto ? '0 0 168 48' : '0 0 236 48'}
      role="img"
      aria-label={label}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{label}</title>
      {/* folha com a orelha dobrada */}
      <path d="M1.5 4.5h17l8 8v31h-25z" fill="none" stroke={tinta} strokeWidth="1.25" strokeLinejoin="miter" />
      <path d="M18.5 4.5v8h8" fill="none" stroke={tinta} strokeWidth="1.25" />
      {/* o fio da margem */}
      <path d="M7 17v20" stroke={acento} strokeWidth="1.25" />
      <text
        x="40"
        y={compacto ? 32 : 26}
        fill={tinta}
        fontFamily="Newsreader, Georgia, serif"
        fontSize="23"
        textLength="124"
        lengthAdjust="spacing"
      >
        FLORINDO
      </text>
      {!compacto && (
        <text
          x="40.5"
          y="41"
          fill={tinta}
          fontFamily="'Hanken Grotesk', system-ui, sans-serif"
          fontSize="7.4"
          fontWeight="600"
          textLength="194"
          lengthAdjust="spacing"
        >
          DE ALMEIDA SOUZA · ADVOGADO
        </text>
      )}
    </svg>
  )
}
