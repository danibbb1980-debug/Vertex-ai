import { useEffect, useRef } from "react";
import { CONFIG } from "./config";
import { Header, WhatsAppFixo } from "./components/Header";
import { LinhaCrescimento } from "./components/LinhaCrescimento";
import { Marquee } from "./components/Marquee";
import { Hero } from "./sections/Hero";
import { Consultorio } from "./sections/Consultorio";
import { Atendimento } from "./sections/Atendimento";
import { Pais } from "./sections/Pais";
import { PrimeiraConsulta } from "./sections/PrimeiraConsulta";
import { Profissional } from "./sections/Profissional";
import { Estrutura } from "./sections/Estrutura";
import { Duvidas } from "./sections/Duvidas";
import { Contato, CtaFinal } from "./sections/Contato";
import { Avaliacoes, Rodape } from "./sections/Rodape";

/** Revela elementos .reveal ao entrarem na tela (só transform e opacidade). */
function useRevelar() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("visivel"));
      return;
    }
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            e.target.classList.add("visivel");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function App() {
  const s = CONFIG.secoes;
  const corpo = useRef<HTMLDivElement>(null);
  useRevelar();

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only z-[60] rounded-full bg-ink px-5 py-3 font-bold text-cream focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <div ref={corpo} className="relative">
          <LinhaCrescimento alvo={corpo} />
          {s.consultorio && <Consultorio />}
          {s.marquee && <Marquee />}
          {s.atendimento && <Atendimento />}
          {s.pais && <Pais />}
          {s.primeiraConsulta && <PrimeiraConsulta />}
          {s.profissional && <Profissional />}
          {s.estrutura && <Estrutura />}
          {s.avaliacoes && <Avaliacoes />}
          {s.duvidas && <Duvidas />}
          {s.contato && <Contato />}
        </div>
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Rodape />
      <WhatsAppFixo />
    </>
  );
}
