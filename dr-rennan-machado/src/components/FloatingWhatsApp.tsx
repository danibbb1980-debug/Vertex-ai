import { useEffect, useState } from 'react';
import { waLink } from '../lib/whatsapp';
import { WhatsApp } from './Icons';

/** Desktop: botão flutuante discreto. Celular: barra fixa inferior (o rodapé reserva espaço para ela). */
export function FloatingWhatsApp() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.6);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <>
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar pelo WhatsApp (abre em nova aba)"
        tabIndex={show ? 0 : -1}
        aria-hidden={!show || undefined}
        className={`fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full border border-gold/60 bg-ink text-gold-light shadow-[0_18px_40px_-16px_rgba(30,25,19,.7)] transition-[transform,opacity] duration-500 hover:scale-105 lg:inline-flex ${
          show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <WhatsApp size={26} />
      </a>
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-cream-line bg-cream/95 px-4 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-md transition-[transform,opacity] duration-500 lg:hidden ${
          show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
        }`}
        aria-hidden={!show || undefined}
      >
        <div className="flex gap-2">
          <a href={waLink()} target="_blank" rel="noopener noreferrer" tabIndex={show ? 0 : -1} className="btn btn-primary flex-1">
            <WhatsApp size={20} /> Agendar pelo WhatsApp
          </a>
          <a href="#agendar" tabIndex={show ? 0 : -1} className="btn btn-ghost px-4 text-sm">
            Solicitar
          </a>
        </div>
      </div>
    </>
  );
}
