import { useReducedMotion } from "./components/ui";
import { useEffect, useRef, useState } from "react";

import Lenis from "lenis";
import { Header } from "./components/Header";
import { Hero, Manifesto } from "./components/Hero";
import { Areas } from "./components/Areas";
import { Planejamento } from "./components/Planejamento";
import { Processo } from "./components/Processo";
import { Conteudo, Faq, Sobre } from "./components/Sobre";
import { Contato, CtaFinal } from "./components/Contato";
import { Footer } from "./components/Footer";
import { Cursor, ProgressBar } from "./components/Ambient";

type Tone = "dark" | "light";
const HEADER_OFFSET = 88;

export default function App() {
  const [tone, setTone] = useState<Tone>("dark");
  const reduce = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  // Tom do fundo: segue a seção que ocupa o centro da tela.
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-tone]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setTone(e.target.getAttribute("data-tone") as Tone);
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", tone === "dark" ? "#1B1A18" : "#F3EFE8");
  }, [tone]);

  // Rolagem suave (Lenis). Desligada com reduced-motion.
  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenisRef.current = lenis;
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    let id = 0;
    const raf = (t: number) => {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, [reduce]);

  // Âncoras internas: rolam até a seção e levam o foco junto (teclado e leitores de tela).
  useEffect(() => {
    const click = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element).closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const hash = a.getAttribute("href")!;
      const target = hash.length > 1 ? document.querySelector<HTMLElement>(hash) : null;
      if (!target) return;
      e.preventDefault();
      // pequeno atraso para o menu mobile fechar e liberar a rolagem
      window.setTimeout(() => {
        const lenis = lenisRef.current;
        if (lenis) lenis.scrollTo(target, { offset: hash === "#inicio" ? 0 : -HEADER_OFFSET, force: true });
        else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        target.focus({ preventScroll: true });
        history.replaceState(null, "", hash);
      }, 40);
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, [reduce]);

  return (
    <div className={`site tone-${tone}`}>
      <a href="#conteudo-principal" className="skip">
        Pular para o conteúdo
      </a>
      <ProgressBar />
      <Cursor />
      <Header />
      <main id="conteudo-principal" tabIndex={-1} className="outline-none">
        <Hero />
        <Manifesto />
        <Areas />
        <Planejamento />
        <Processo />
        <Sobre />
        <Conteudo />
        <Faq />
        <Contato />
        <CtaFinal />
      </main>
      <Footer />
    </div>
  );
}
