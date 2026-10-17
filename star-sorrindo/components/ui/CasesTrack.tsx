"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Item = { src: string; alt: string };

/**
 * Faixa horizontal com scroll-snap. Funciona com toque, trackpad e teclado
 * (a faixa recebe foco e rola com as setas); os botões são um atalho.
 */
export function CasesTrack({ items }: { items: Item[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () =>
      setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const move = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * step, behavior: reduce ? "auto" : "smooth" });
  };

  const btn =
    "flex h-12 w-12 items-center justify-center rounded-full border border-navy/20 text-navy transition-[border-color,background-color,opacity] hover:border-navy hover:bg-navy hover:text-ivory disabled:pointer-events-none disabled:opacity-30";

  return (
    <div className="mt-12">
      <ul
        ref={track}
        tabIndex={0}
        aria-label="Casos de antes e depois — role para o lado para ver mais"
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-[max(1.25rem,calc((100vw-80rem)/2+2.5rem))] pb-4 [scrollbar-width:none] focus-visible:outline-offset-[-4px] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <li key={item.src} className="w-[78%] max-w-[22rem] shrink-0 snap-start sm:w-[22rem]">
            <figure className="overflow-hidden rounded-2xl border border-line bg-[#e9d9bd] shadow-[0_24px_50px_-36px_rgb(14_29_54/0.5)]">
              {/* eslint-disable-next-line @next/next/no-img-element -- exportação estática */}
              <img src={item.src} alt={item.alt} width={720} height={900} loading="lazy" decoding="async" className="h-auto w-full" />
            </figure>
          </li>
        ))}
      </ul>
      <div className="container-site mt-6 flex items-center justify-between gap-4">
        <p className="text-xs text-mineral">Imagens ilustrativas de casos individuais. Não representam garantia de resultado.</p>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => move(-1)} disabled={edge.start} className={btn} aria-label="Ver caso anterior">
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => move(1)} disabled={edge.end} className={btn} aria-label="Ver próximo caso">
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
