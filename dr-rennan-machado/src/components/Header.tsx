import { useEffect, useRef, useState } from 'react';
import { CONFIG } from '../config';
import { waLink } from '../lib/whatsapp';
import { Logo } from './Logo';
import { Close, Menu, WhatsApp } from './Icons';

export function DraftBanner() {
  if (!CONFIG.rascunho) return null;
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-[34px] items-center justify-center bg-ink px-4 text-center text-[0.72rem] font-medium tracking-wide text-cream-sand"
    >
      <span className="mr-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
      <span className="truncate">Rascunho para avaliação. Informações sujeitas a confirmação.</span>
    </div>
  );
}

export type NavItem = { href: string; label: string };

export function Header({ nav }: { nav: NavItem[] }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const first = panelRef.current?.querySelector<HTMLElement>('a,button');
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();
      }
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('a,button');
        const a = f[0];
        const b = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault();
          b.focus();
        } else if (!e.shiftKey && document.activeElement === b) {
          e.preventDefault();
          a.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={`fixed inset-x-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        solid || open ? 'bg-cream/95 shadow-[0_1px_0_rgba(126,92,18,.18)] backdrop-blur-md' : 'bg-transparent'
      }`}
      style={{ top: 'var(--banner-h)' }}
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-3 focus:text-cream"
      >
        Pular para o conteúdo
      </a>
      <div className="wrap flex h-[72px] items-center justify-between gap-4">
        <a href="#inicio" className="flex min-h-[48px] items-center gap-3">
          <Logo size={42} />
          <span className="leading-tight">
            <span className="block font-serif text-[1.05rem] text-ink">{CONFIG.nome}</span>
            <span className="block text-[0.62rem] font-semibold uppercase tracking-label text-gold-deep">
              {CONFIG.titulo}
            </span>
          </span>
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  className="group relative inline-flex min-h-[48px] items-center px-3 text-[0.9rem] font-medium text-ink-soft hover:text-ink"
                >
                  {n.label}
                  <span className="absolute inset-x-3 bottom-3 h-px origin-left scale-x-0 bg-gold-deep transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Conversar pelo WhatsApp (abre em nova aba)"
            className="hidden h-12 w-12 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-gold-deep hover:text-gold-deep sm:inline-flex"
          >
            <WhatsApp size={22} />
          </a>
          <a href="#agendar" className="btn btn-primary hidden sm:inline-flex">
            Agendar avaliação
          </a>
          <button
            ref={btnRef}
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movel"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <Close size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div
        id="menu-movel"
        ref={panelRef}
        hidden={!open}
        className="border-t border-cream-line bg-cream lg:hidden"
        style={{ height: 'calc(100dvh - var(--banner-h) - 72px)' }}
      >
        <nav aria-label="Menu" className="wrap flex h-full flex-col justify-between pb-8 pt-4">
          <ul>
            {nav.map((n, i) => (
              <li key={n.href} className="border-b border-cream-line">
                <a href={n.href} onClick={close} className="flex min-h-[60px] items-center justify-between font-serif text-2xl">
                  {n.label}
                  <span className="text-xs font-sans tracking-label text-gold-deep">0{i + 1}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3">
            <a href="#agendar" onClick={close} className="btn btn-primary w-full">
              Agendar avaliação
            </a>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-ghost w-full">
              <WhatsApp size={20} /> Conversar pelo WhatsApp
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
