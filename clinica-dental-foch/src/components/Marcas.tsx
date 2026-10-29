/** Ícones de marca (WhatsApp, Instagram) em traço, coerentes com os demais. */
export function IconeWhatsapp({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3.5 20.5l1.2-4.3A8.5 8.5 0 1 1 8 19.4l-4.5 1.1z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9.1 8.2c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.2.3 0 .5.3.5.8 1.1 1.3 1.5.6.5 1.1.7 1.4.9.2.1.4 0 .5-.1l.6-.7c.2-.2.3-.2.5-.1l1.6.8c.2.1.3.2.3.3 0 .4-.1.9-.4 1.2-.4.4-1.1.8-1.8.8-.8 0-2-.4-3.4-1.6-1.3-1.1-2.2-2.5-2.4-3-.3-.6-.4-1.5.1-2.3z"
        fill="currentColor"
      />
    </svg>
  )
}

export function IconeInstagram({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}
