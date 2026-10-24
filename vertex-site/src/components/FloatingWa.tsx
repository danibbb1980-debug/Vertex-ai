import { useEffect, useState } from "react";
import { waLink } from "../config";
import { IconWhatsApp } from "./Icons";

/**
 * Atalho para o WhatsApp que aparece depois do hero e some no CTA final
 * (onde já há um botão grande). No celular vira uma barra fina no rodapé;
 * o rodapé da página tem espaço extra para a barra não cobrir conteúdo.
 */
export function FloatingWa() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("topo");
    const cta = document.getElementById("contato");
    if (!hero || !cta) return;
    let pastHero = false;
    let inCta = false;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) pastHero = !e.isIntersecting && e.boundingClientRect.top < 0;
        if (e.target === cta) inCta = e.isIntersecting;
      }
      setShow(pastHero && !inCta);
    });
    io.observe(hero);
    io.observe(cta);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <a
        href={waLink()}
        target="_blank"
        rel="noopener"
        aria-label="Conversar com a Vertex pelo WhatsApp"
        tabIndex={show ? 0 : -1}
        className={`fixed right-6 bottom-6 z-40 hidden size-14 items-center justify-center rounded-full border border-gold/40 bg-ink-0/90 text-gold-hi shadow-[0_12px_40px_-12px_rgba(0,0,0,0.9)] backdrop-blur transition-all duration-500 hover:border-gold-hi hover:text-champ md:flex ${
          show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <IconWhatsApp className="size-6" />
      </a>

      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-gold/20 bg-ink-0/92 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-xl transition-transform duration-500 md:hidden ${
          show ? "translate-y-0" : "pointer-events-none translate-y-full"
        }`}
      >
        <a href={waLink()} target="_blank" rel="noopener" tabIndex={show ? 0 : -1} className="btn btn-gold w-full !min-h-12">
          <IconWhatsApp />
          Quero ver o meu rascunho
        </a>
      </div>
    </>
  );
}
