type P = { className?: string }

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export const IconWhatsApp = ({ className = 'size-[18px]' }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M3.5 20.5l1.3-4.1A8.5 8.5 0 1 1 8 19.4l-4.5 1.1z" />
    <path d="M9 8.6c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.7 1.6c.1.3 0 .5-.1.7l-.5.6c-.1.1-.1.3 0 .5.6 1 1.4 1.8 2.5 2.4.2.1.4.1.5 0l.6-.6c.2-.2.4-.2.7-.1l1.5.7c.3.1.4.3.4.5v.5c0 .4-.2.8-.6 1-.6.3-1.4.4-2.2.1-2.5-.8-4.3-2.6-5.2-5-.3-.9-.1-1.8.4-2.5z" />
  </svg>
)

export const IconPin = ({ className = 'size-[18px]' }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
)

export const IconClock = ({ className = 'size-[18px]' }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
)

export const IconArrow = ({ className = 'size-4' }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
)

export const IconInstagram = ({ className = 'size-[18px]' }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
  </svg>
)
