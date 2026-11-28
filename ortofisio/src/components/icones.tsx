// Poucos ícones, todos de traço fino e coerentes entre si.
type P = { className?: string }

export const IconeWhatsApp = ({ className = 'h-5 w-5' }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4.2 19.8 5.3 16A8.2 8.2 0 1 1 8.4 19l-4.2.8Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M9.2 8.4c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .4-.1.6l-.5.6c-.1.1-.1.3 0 .5.5.9 1.3 1.7 2.3 2.2.2.1.4.1.5 0l.6-.6c.2-.2.4-.2.6-.1l1.4.7c.2.1.3.3.3.5 0 .5-.2 1.2-.9 1.5-.6.3-1.6.4-3.3-.4-1.9-.9-3.3-2.7-3.6-3.6-.4-1-.4-2.3.3-3.3Z"
      fill="currentColor"
    />
  </svg>
)

export const IconeTelefone = ({ className = 'h-5 w-5' }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M6.6 3.8h2.6l1.4 4-1.9 1.3a10.6 10.6 0 0 0 6.2 6.2l1.3-1.9 4 1.4v2.6a1.8 1.8 0 0 1-1.9 1.8C10.5 18.8 5.2 13.5 4.8 5.7a1.8 1.8 0 0 1 1.8-1.9Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
)

// Traço curto com ponto: eco da linha de movimento, usado nos botões
export const Traco = ({ className = 'traco' }: P) => (
  <svg className={className} viewBox="0 0 22 12" fill="none" aria-hidden="true">
    <path d="M1 9.5C6 10.5 10 3 16 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="19.5" cy="3.2" r="2" fill="currentColor" />
  </svg>
)
