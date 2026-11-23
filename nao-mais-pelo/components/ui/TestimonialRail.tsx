"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Arrow } from "@/components/ui/primitives";
import { PlayIcon, VideoDialog } from "@/components/ui/VideoDialog";

type Item = { name: string; videoId: string; image: string };

/**
 * Faixa horizontal de retratos em vídeo, com rolagem nativa (scroll-snap),
 * setas no desktop e barra de progresso. Sem biblioteca de carrossel.
 */
export function TestimonialRail({ items }: { items: readonly Item[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });

  const onScroll = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const p = max > 0 ? el.scrollLeft / max : 0;
    setProgress(p);
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft > max - 8 });
  }, []);

  useEffect(() => {
    onScroll();
    window.addEventListener("resize", onScroll);
    return () => window.removeEventListener("resize", onScroll);
  }, [onScroll]);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const amount = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div className="mt-16 md:mt-24">
      <ul
        ref={track}
        onScroll={onScroll}
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-pl-5 px-5 pb-2 md:scroll-pl-10 md:px-10 xl:scroll-pl-16 xl:px-16"
        aria-label="Depoimentos em vídeo"
      >
        {items.map((t, i) => (
          <li key={t.videoId} className={`w-[72vw] shrink-0 snap-start sm:w-[42vw] lg:w-[26vw] xl:w-[22vw] ${i % 2 ? "md:mt-16" : ""}`}>
            <VideoDialog videoId={t.videoId} title={`Depoimento — ${t.name}`} className="group block w-full text-left">
              <span className="relative block aspect-[3/4] overflow-hidden bg-sand">
                <Image
                  src={t.image}
                  alt={`Retrato de ${t.name}, cliente Não+Pelo`}
                  fill
                  sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 26vw, (min-width: 640px) 42vw, 72vw"
                  className="object-cover object-top grayscale-[35%] transition-[transform,filter] duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04] group-hover:grayscale-0"
                />
                <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,rgb(18_17_15/0.55),transparent_45%)]" />
                <span className="absolute bottom-5 left-5 flex items-center gap-3 text-bone">
                  <span className="flex h-11 w-11 items-center justify-center border border-bone/50 backdrop-blur-sm transition-colors duration-500 group-hover:border-bone group-hover:bg-bone group-hover:text-ink">
                    <PlayIcon className="ml-0.5 h-3 w-3" />
                  </span>
                  <span className="eyebrow">Assistir</span>
                </span>
              </span>
              <span className="mt-5 flex items-baseline justify-between gap-4">
                <span className="font-display text-2xl leading-tight">{t.name}</span>
                <span className="eyebrow text-stone">Cliente</span>
              </span>
            </VideoDialog>
          </li>
        ))}
      </ul>

      <div className="container-x mt-10 flex items-center gap-8">
        <div className="relative h-px flex-1 bg-ink/15" aria-hidden="true">
          <div className="absolute inset-y-0 left-0 bg-ink transition-[width] duration-300" style={{ width: `${Math.max(12, progress * 100)}%` }} />
        </div>
        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={edges.start}
            aria-label="Depoimentos anteriores"
            className="flex h-12 w-12 items-center justify-center border border-ink/25 transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-bone disabled:pointer-events-none disabled:opacity-30"
          >
            <Arrow className="rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={edges.end}
            aria-label="Próximos depoimentos"
            className="flex h-12 w-12 items-center justify-center border border-ink/25 transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-bone disabled:pointer-events-none disabled:opacity-30"
          >
            <Arrow />
          </button>
        </div>
      </div>
    </div>
  );
}
