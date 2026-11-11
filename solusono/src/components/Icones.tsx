type P = { className?: string };
const base = "shrink-0";

export const IconeWhatsapp = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M3.5 20.5l1.2-4.1A8.5 8.5 0 1 1 8 19.6l-4.5.9z" strokeLinejoin="round" />
    <path d="M9 8.6c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.6l-.5.6c.6 1.2 1.6 2.1 2.8 2.7l.6-.6c.2-.2.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .4-.2.7-.6.9-.6.3-1.4.4-2.3.1-2.3-.8-4.2-2.6-5-4.9-.3-.9-.2-1.7.1-2.4z" strokeLinejoin="round" />
  </svg>
);

export const IconeSeta = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconeInstagram = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r=".8" fill="currentColor" stroke="none" />
  </svg>
);

export const IconeMais = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M12 5v14" className="origin-center transition-transform duration-300 group-aria-expanded:rotate-90" strokeLinecap="round" />
    <path d="M5 12h14" strokeLinecap="round" />
  </svg>
);
