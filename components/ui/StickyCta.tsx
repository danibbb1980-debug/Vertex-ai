"use client";

import { useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { LinkButton } from "./Button";
import { whatsappUrl, brl, site } from "@/lib/site";

/**
 * Barra fixa de conversão, só no mobile.
 *
 * Antes usava AnimatePresence + motion do framer-motion. Agora a transição é
 * CSS e a visibilidade é alternada por uma única classe — o estado nem passa
 * pelo React, então mostrar/esconder não dispara re-render.
 *
 * O listener de scroll é passivo e agrupado em requestAnimationFrame, para não
 * fazer leitura de layout a cada evento de scroll.
 */
export function StickyCta() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const finalCta = document.getElementById("contato");
    let ticking = false;
    let visible = false;

    const update = () => {
      ticking = false;
      const past = window.scrollY > window.innerHeight * 0.9;
      const atEnd = finalCta
        ? finalCta.getBoundingClientRect().top < window.innerHeight
        : false;
      const next = past && !atEnd;
      if (next === visible) return;
      visible = next;
      bar.classList.toggle("is-in", next);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={barRef}
      className="sticky-bar fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/92 px-4 pt-3 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-semibold leading-tight">
            {brl(site.price)}
            <span className="text-sm font-normal text-mist">/mês</span>
          </p>
          <p className="truncate text-[0.7rem] text-mist-dim">
            Sem fidelidade · Sem taxa de setup
          </p>
        </div>
        <LinkButton
          href={whatsappUrl("barra-fixa")}
          target="_blank"
          rel="noopener noreferrer"
          variant="whatsapp"
          className="shrink-0 px-4"
          aria-label="Falar no WhatsApp"
          trackAs="sticky-whatsapp"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
        </LinkButton>
        <LinkButton href="#contato" className="shrink-0" trackAs="sticky-bar">
          Quero meu site
        </LinkButton>
      </div>
    </div>
  );
}
