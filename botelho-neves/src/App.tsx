import { LazyMotion, domAnimation, m, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { CONFIG, linkWhatsapp, temWhatsapp } from "./config";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Advogados, Areas, ComoFunciona, Contato, CtaFinal, Duvidas, Escritorio, QuandoProcurar } from "./components/Secoes";
import { Agendar } from "./components/Agendar";
import { Rodape } from "./components/Rodape";
import { IconeTelefone, IconeWhatsapp } from "./components/ui";

const ROMANOS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export default function App() {
  const topo = CONFIG.rascunho ? "var(--faixa)" : "0px";
  const s = CONFIG.secoes;
  const ordem = [
    s.escritorio && ((n: string) => <Escritorio key="e" n={n} />),
    s.advogados && CONFIG.socios.length > 0 && ((n: string) => <Advogados key="a" n={n} />),
    s.areas && CONFIG.areas.length > 0 && ((n: string) => <Areas key="ar" n={n} />),
    s.quandoProcurar && ((n: string) => <QuandoProcurar key="q" n={n} />),
    s.comoFunciona && ((n: string) => <ComoFunciona key="c" n={n} />),
    s.duvidas && ((n: string) => <Duvidas key="d" n={n} />),
    s.contato && ((n: string) => <Contato key="ct" n={n} />),
    s.agendar && temWhatsapp() && ((n: string) => <Agendar key="ag" n={n} />),
  ].filter(Boolean) as ((n: string) => React.ReactElement)[];

  return (
    <LazyMotion features={domAnimation} strict>
      {CONFIG.rascunho && (
        <div
          role="note"
          className="fixed inset-x-0 top-0 z-50 flex items-center justify-center bg-tinta px-4 text-center text-[0.75rem] leading-tight tracking-[0.03em] text-osso sm:text-[0.78rem]"
          style={{ height: "var(--faixa)" }}
        >
          Rascunho para avaliação. Informações sujeitas a confirmação.
        </div>
      )}
      <Header topo={topo} />
      <main id="conteudo" className="relative">
        <FioDeLeitura />
        <Hero />
        {ordem.map((f, i) => f(ROMANOS[i]))}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Rodape />
      <ContatoFixo />
    </LazyMotion>
  );
}

/** Filete vertical na margem: liga as seções e avança com a leitura (desktop). */
function FioDeLeitura() {
  const reduzir = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useSpring(scrollYProgress, { stiffness: 80, damping: 28, restDelta: 0.001 });
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 top-0 z-10 hidden w-px bg-fio/70 xl:block"
      style={{ left: "max(1.5rem, calc((100% - 84rem) / 2 + 1.25rem))" }}
    >
      <m.div className="h-full w-[3px] -translate-x-px origin-top bg-tinta" style={{ scaleY: reduzir ? 1 : y }} />
    </div>
  );
}

/** Celular: barra fixa inferior. Desktop: botão flutuante discreto, depois do hero. */
function ContatoFixo() {
  const [visivel, setVisivel] = useState(false);
  useEffect(() => {
    const f = () => setVisivel(window.scrollY > window.innerHeight * 0.6);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  const whats = temWhatsapp();
  const href = whats ? linkWhatsapp(CONFIG.mensagens.geral) : CONFIG.telefoneHref;
  const ext = whats ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-0 z-30 flex border-t border-tinta bg-osso transition-transform duration-300 lg:hidden ${
          visivel ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <a href={CONFIG.telefoneHref} className="flex min-h-14 flex-1 items-center justify-center gap-3 font-medium text-tinta no-underline" tabIndex={visivel ? 0 : -1}>
          <IconeTelefone />
          Ligar <span className="num text-pedra">{CONFIG.telefone}</span>
        </a>
        {whats && (
          <a href={href} {...ext} className="flex min-h-14 flex-1 items-center justify-center gap-3 border-l border-fio bg-tinta font-medium text-osso no-underline" tabIndex={visivel ? 0 : -1}>
            <IconeWhatsapp />
            WhatsApp
          </a>
        )}
      </div>
      <a
        href={href}
        {...ext}
        tabIndex={visivel ? 0 : -1}
        aria-hidden={!visivel}
        className={`btn btn-cheio fixed bottom-8 right-8 z-30 hidden !min-h-12 shadow-none transition-opacity duration-300 lg:inline-flex ${
          visivel ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {whats ? <IconeWhatsapp /> : <IconeTelefone />}
        {whats ? "WhatsApp" : "Ligar"}
      </a>
    </>
  );
}
