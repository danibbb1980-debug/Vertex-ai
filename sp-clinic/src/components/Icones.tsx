type P = { className?: string }
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export const IconeWhatsapp = ({ className = 'size-5' }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M3.6 20.4 4.8 16.3A8.4 8.4 0 1 1 7.9 19.3Z" />
    <path d="M9 8.2c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.7 1.6c.1.3 0 .5-.1.7l-.5.6c-.1.2-.1.4 0 .6.6 1.1 1.5 2 2.6 2.6.2.1.4.1.6 0l.6-.5c.2-.2.5-.2.7-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.6-.6.8-.6.3-1.6.4-2.8-.1a9.9 9.9 0 0 1-4.6-4.6c-.5-1.2-.4-2.2-.1-2.8Z" />
  </svg>
)

export const IconeTelefone = ({ className = 'size-5' }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M6.6 3.8h2.6l1.4 4-1.9 1.2a11 11 0 0 0 6.3 6.3l1.2-1.9 4 1.4v2.6a2 2 0 0 1-2.2 2A16.2 16.2 0 0 1 4.6 6a2 2 0 0 1 2-2.2Z" />
  </svg>
)

export const IconeInstagram = ({ className = 'size-5' }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="3.9" />
    <circle cx="17.1" cy="6.9" r=".6" fill="currentColor" stroke="none" />
  </svg>
)

export const IconeRota = ({ className = 'size-5' }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
)

export const IconeSeta = ({ className = 'size-4' }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
)

/** Pequeno arco com numeração tabular — marcador da marca. */
export function ArcoNumero({
  n,
  aceso = false,
  tom = 'claro',
  className = '',
}: {
  n: number
  aceso?: boolean
  tom?: 'claro' | 'escuro'
  className?: string
}) {
  const linha = tom === 'claro' ? 'border-cafe/45' : 'border-creme/40'
  return (
    <span
      aria-hidden="true"
      className={`num relative inline-flex h-11 w-8 shrink-0 items-end justify-center overflow-hidden rounded-t-full border pb-1.5 text-[0.8rem] font-medium ${linha} ${className}`}
    >
      <span
        className={`absolute inset-0 origin-bottom rounded-t-full bg-caramelo transition-transform duration-700 ease-[var(--ease-porta)] ${
          aceso ? 'scale-y-100' : 'scale-y-0'
        }`}
      />
      <span className={`relative ${aceso ? 'text-cafe' : tom === 'claro' ? 'text-cafe-suave' : 'text-creme-suave'}`}>
        {String(n).padStart(2, '0')}
      </span>
    </span>
  )
}
