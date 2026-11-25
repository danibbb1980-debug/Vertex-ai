import { useId } from 'react'

/** Vetor fiel ao símbolo do logo oficial (referencias/logo-lumivo.png): L em duas peças + ponto de luz. */
export function MarcaLumivo({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className={className} viewBox="0 0 262 380" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EDCB7D" />
          <stop offset="1" stopColor="#B0842F" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F7E8C0" />
          <stop offset="1" stopColor="#D5AE58" />
        </linearGradient>
      </defs>
      <path d="M0 0H80V295L0 375Z" fill={`url(#${id}a)`} />
      <path d="M85 300H262V380H5Z" fill={`url(#${id}b)`} />
      <circle cx="222" cy="237" r="21.5" fill="#EDD597" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`logo ${className ?? ''}`}>
      <MarcaLumivo className="logo__marca" />
      <span className="logo__nome">Lumivo</span>
    </span>
  )
}
