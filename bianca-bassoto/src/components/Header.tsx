import { useEffect, useRef, useState } from 'react';
import { CONFIG, waLink } from '../config';
import { Logo, Pear } from './Logo';

const links = [
  { href: '#atendimentos', label: 'Atendimentos', on: CONFIG.secoes.atendimentos },
  { href: '#sobre', label: 'Sobre', on: CONFIG.secoes.sobre },
  { href: '#duvidas', label: 'Dúvidas', on: CONFIG.secoes.duvidas },
  { href: '#contato', label: 'Contato', on: CONFIG.secoes.contato },
].filter((l) => l.on);

export function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    if (!open) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btn.current?.focus();
      }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open]);

  return (
    <header className={`site-header ${solid || open ? 'is-solid' : ''}`}>
      <div className="site-header__in">
        <a href="#topo" className="brand" aria-label="Bianca Bassoto, Nutricionista: início">
          <Pear className="brand__pear" />
          <span className="brand__name">Bianca Bassoto</span>
          <Logo className="brand__logo" />
        </a>
        <nav className="nav" aria-label="Principal">
          <ul className="nav__list">
            {links.map((l) => (
              <li key={l.href}>
                <a className="nav__link" href={l.href}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {CONFIG.usarWhatsapp && (
          <a className="btn btn--ink btn--sm site-header__cta" href={waLink()} target="_blank" rel="noopener noreferrer">
            Agendar consulta
          </a>
        )}
        <button
          ref={btn}
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="menu-movel"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="menu-btn__lines" aria-hidden="true" />
          <span className="menu-btn__txt">{open ? 'Fechar' : 'Menu'}</span>
        </button>
      </div>
      <div id="menu-movel" className="mmenu" hidden={!open}>
        <ul>
          {links.map((l, i) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)}>
                <span className="mmenu__n">{String(i + 1).padStart(2, '0')}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        {CONFIG.usarWhatsapp && (
          <a className="btn btn--ink" href={waLink()} target="_blank" rel="noopener noreferrer">
            Agendar consulta
          </a>
        )}
      </div>
    </header>
  );
}
