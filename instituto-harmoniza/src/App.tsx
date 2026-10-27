import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { CONFIG } from "./config";
import { quandoOcioso, useRevelarAoRolar } from "./lib/movimento";
import { FaixaRascunho } from "./components/FaixaRascunho";
import { Header } from "./components/Header";
import { Marquee } from "./components/Marquee";
import { WhatsAppFixo } from "./components/WhatsAppFixo";
import { Hero } from "./secoes/Hero";
import { Instituto } from "./secoes/Instituto";
import { Atendimentos } from "./secoes/Atendimentos";
import { ParaQuem } from "./secoes/ParaQuem";
import { ComoFunciona } from "./secoes/ComoFunciona";
import { Profissionais } from "./secoes/Profissionais";
import { Estrutura } from "./secoes/Estrutura";
import { AvaliacoesGoogle } from "./secoes/AvaliacoesGoogle";
import { Duvidas } from "./secoes/Duvidas";
import { Contato } from "./secoes/Contato";
import { CtaFinal } from "./secoes/CtaFinal";
import { Rodape } from "./secoes/Rodape";

// Efeitos pesados carregados sob demanda, depois da primeira pintura.
const CurvaAssinatura = lazy(() => import("./components/CurvaAssinatura"));

/** Cada seção é um limite de hidratação: o React hidrata uma por vez e devolve a vez ao navegador entre elas. */
const Bloco = ({ children }: { children: ReactNode }) => <Suspense fallback={null}>{children}</Suspense>;

export default function App() {
  const s = CONFIG.secoes;
  const areaCurva = useRef<HTMLDivElement>(null);
  const [montado, setMontado] = useState(false);
  useRevelarAoRolar();

  useEffect(() => {
    let ativo = true;
    quandoOcioso().then(() => ativo && setMontado(true));
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fino = window.matchMedia("(pointer: fine)").matches;
    if (!CONFIG.movimento.rolagemSuave || reduzido || !fino) return () => void (ativo = false);
    let destruir: (() => void) | undefined;
    quandoOcioso().then(async () => {
      if (!ativo) return;
      const { default: Lenis } = await import("lenis");
      // anchors: true já respeita o scroll-margin-top das seções (compensa header e faixa)
      const lenis = new Lenis({ duration: 1.05, anchors: true, autoRaf: true });
      (window as unknown as { __lenis?: unknown }).__lenis = lenis;
      destruir = () => lenis.destroy();
    });
    return () => {
      ativo = false;
      destruir?.();
    };
  }, []);

  const areas = CONFIG.atendimentos.filter((a) => a.ativo).map((a) => a.titulo);

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only z-[70] rounded-full bg-tinta px-5 py-3 text-marfim focus:not-sr-only focus:fixed focus:top-12 focus:left-4"
      >
        Pular para o conteúdo
      </a>
      <FaixaRascunho />
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <div ref={areaCurva} data-area-curva className="relative">
          {montado && CONFIG.movimento.curvaAssinatura && (
            <Suspense fallback={null}>
              <CurvaAssinatura area={areaCurva} />
            </Suspense>
          )}
          {s.hero && <Hero />}
          {s.instituto && <Bloco><Instituto /></Bloco>}
          {s.atendimentos && <Bloco><Atendimentos /></Bloco>}
          {s.faixaAreas && <Bloco><Marquee itens={[...areas, "Avaliação individual"]} /></Bloco>}
          {s.paraQuem && <Bloco><ParaQuem /></Bloco>}
          {s.comoFunciona && <Bloco><ComoFunciona /></Bloco>}
          {s.profissionais && <Bloco><Profissionais /></Bloco>}
          {s.estrutura && <Bloco><Estrutura /></Bloco>}
          {s.avaliacoesGoogle && <Bloco><AvaliacoesGoogle /></Bloco>}
          {s.duvidas && <Bloco><Duvidas /></Bloco>}
          {s.contato && <Bloco><Contato /></Bloco>}
        </div>
        {s.ctaFinal && <Bloco><CtaFinal /></Bloco>}
      </main>
      <Bloco>
        <Rodape />
      </Bloco>
      <WhatsAppFixo />
    </>
  );
}
