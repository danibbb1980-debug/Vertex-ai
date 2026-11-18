import { useEffect, useRef, useState } from 'react';
import { CONFIG } from '../config';
import { MONOGRAMA } from '../brand/marca';
import { LogoHorizontal } from '../components/Marca';
import { BotaoWhats, useReducedMotion } from '../components/ui';

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null;
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-50 flex h-[var(--faixa)] items-center justify-center bg-ameixa px-4 text-center text-[12px] leading-tight tracking-wide text-nevoa"
    >
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  );
}

const LINKS = [
  { href: '#avaliacao', label: 'Avaliação', secao: 'avaliacao' },
  { href: '#atendimento', label: 'Atendimento', secao: 'atendimento' },
  { href: '#profissional', label: 'A profissional', secao: 'profissional' },
  { href: '#como-funciona', label: 'Como funciona', secao: 'comoFunciona' },
  { href: '#duvidas', label: 'Dúvidas', secao: 'duvidas' },
  { href: '#local', label: 'Contato', secao: 'local' },
] as const;

export function Cabecalho() {
  const [solido, setSolido] = useState(false);
  const [menu, setMenu] = useState(false);
  const botaoRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const f = () => setSolido(window.scrollY > 24);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);

  useEffect(() => {
    if (!menu) return;
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenu(false);
        botaoRef.current?.focus();
      }
    };
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', esc);
      document.body.style.overflow = '';
    };
  }, [menu]);

  const links = LINKS.filter((l) => CONFIG.secoes[l.secao]);

  return (
    <header
      className={`fixed inset-x-0 top-[var(--faixa)] z-40 transition-colors duration-300 ${
        solido || menu ? 'border-b border-linha bg-nevoa' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[var(--header)] max-w-[1320px] items-center justify-between gap-6 px-4 sm:px-8">
        <a href="#inicio" className="-ml-1 flex min-h-12 items-center px-1" aria-label="Dra. Roberta Motta, voltar ao início">
          <LogoHorizontal />
        </a>
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[14px]">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="py-3 hover:text-ouro-texto">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <BotaoWhats className="hidden !min-h-11 !px-5 !text-[14px] sm:inline-flex" />
          <button
            ref={botaoRef}
            type="button"
            className="flex h-12 w-12 items-center justify-center lg:hidden"
            aria-expanded={menu}
            aria-controls="menu-movel"
            aria-label={menu ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMenu((m) => !m)}
          >
            <span aria-hidden="true" className="relative block h-3 w-6">
              <span
                className="absolute left-0 top-0 h-px w-6 bg-ameixa transition-transform duration-300"
                style={{ transform: menu ? 'translateY(6px) rotate(45deg)' : 'none' }}
              />
              <span
                className="absolute bottom-0 left-0 h-px w-6 bg-ameixa transition-transform duration-300"
                style={{ transform: menu ? 'translateY(-5px) rotate(-45deg)' : 'none' }}
              />
            </span>
          </button>
        </div>
      </div>
      {menu && (
        <nav
          id="menu-movel"
          aria-label="Menu"
          className="h-[calc(100dvh-var(--faixa)-var(--header))] overflow-y-auto border-t border-linha bg-nevoa px-4 pb-28 pt-4 lg:hidden"
        >
          <ul>
            {links.map((l, i) => (
              <li key={l.href} className="border-b border-linha">
                <a
                  href={l.href}
                  onClick={() => setMenu(false)}
                  className="display flex min-h-16 items-baseline gap-4 py-3 text-[34px]"
                >
                  <span className="num text-[14px] text-ouro-texto">{String(i + 1).padStart(2, '0')}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <BotaoWhats className="mt-8 w-full" />
        </nav>
      )}
    </header>
  );
}

/**
 * Momento de assinatura: o monograma RM em escala monumental.
 * Contorno dourado se desenha (stroke-dashoffset); ao rolar pelo hero,
 * o interior se preenche de ameixa de baixo para cima (clipPath ligado à rolagem).
 */
function MonogramaMonumental() {
  const rectRef = useRef<SVGRectElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduzido = useReducedMotion();

  useEffect(() => {
    const rect = rectRef.current;
    const wrap = wrapRef.current;
    if (!rect || !wrap) return;
    const TOPO = 30;
    const BASE = 266;
    const aplicar = (p: number) => rect.setAttribute('y', String(BASE - (BASE - TOPO) * p));
    if (reduzido) {
      aplicar(1);
      return;
    }
    let raf = 0;
    let visivel = true;
    const calc = () => {
      raf = 0;
      const hero = wrap.closest('section');
      if (!hero) return;
      const h = hero.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -h.top / (h.height * 0.62)));
      aplicar(p);
    };
    const onScroll = () => {
      if (visivel && !raf) raf = requestAnimationFrame(calc);
    };
    const io = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
      if (visivel) onScroll();
    });
    io.observe(wrap);
    calc();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduzido]);

  return (
    <div ref={wrapRef} aria-hidden="true" className="pointer-events-none select-none">
      <svg viewBox="214 30 356 236" className="block h-auto w-full overflow-visible">
        <defs>
          <clipPath id="preenche">
            <rect ref={rectRef} x="200" y="266" width="400" height="260" />
          </clipPath>
        </defs>
        <path d={MONOGRAMA} fill="var(--color-ameixa)" clipPath="url(#preenche)" />
        <path
          d={MONOGRAMA}
          fill="none"
          stroke="var(--color-ouro)"
          strokeWidth="0.55"
          pathLength={1}
          className="mono-traco"
        />
      </svg>
    </div>
  );
}

export function Hero() {
  const p = CONFIG.profissionais[0];
  return (
    <section id="inicio" className="relative overflow-hidden pt-[calc(var(--faixa)+var(--header))]">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 px-4 sm:px-8 lg:min-h-[calc(100svh-var(--faixa)-var(--header))] lg:grid-cols-12 lg:items-center">
        {/* No celular o monograma fica acima do texto e sangra para fora da tela à direita */}
        <div className="relative order-1 -mr-[26%] ml-[34%] mt-2 lg:order-2 lg:col-span-7 lg:col-start-6 lg:-mr-[22%] lg:ml-[4%] lg:mt-0">
          <MonogramaMonumental />
        </div>
        <div className="relative order-2 pb-16 pt-4 lg:order-1 lg:col-span-5 lg:row-start-1 lg:pb-16 lg:pt-8">
          <p className="rotulo text-ouro-texto">
            <span className="block">
              {p.nome} · {p.profissao}
            </span>
            <span className="block">{p.registro}</span>
          </p>
          <h1 className="display mt-6 text-[clamp(44px,7vw,92px)]">
            Cada rosto pede um planejamento <em>próprio</em>.
          </h1>
          <p className="mt-7 max-w-[44ch] text-[18px] text-apoio">
            Harmonização facial com avaliação individual e horário marcado, na {CONFIG.endereco.bairro}, em{' '}
            {CONFIG.endereco.cidade}.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <BotaoWhats />
            {CONFIG.secoes.local && (
              <a href="#local" className="btn btn-secundario">
                Conhecer o consultório
              </a>
            )}
          </div>
        </div>
      </div>
      {/* O fio: a curva final do M continua pela base do hero e vira o filete da página */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1000 80"
        preserveAspectRatio="none"
        className="fio block h-14 w-full lg:h-20"
      >
        <path
          d="M1000 0 C 975 0 960 79 900 79 L 0 79"
          fill="none"
          stroke="var(--color-ouro)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </section>
  );
}
