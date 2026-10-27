"use client";

import Image from "next/image";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { cases } from "@/lib/site";

/**
 * Abas acessíveis (padrão WAI-ARIA tabs): setas navegam entre os casos.
 * Cada caso mostra o par Antes/Depois lado a lado no desktop e empilhado no
 * celular — as fotos não têm o mesmo enquadramento, então um "slider" de
 * sobreposição distorceria a comparação.
 */
export function CaseViewer() {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = cases[active];

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: 1,
      ArrowDown: 1,
      ArrowLeft: -1,
      ArrowUp: -1,
    };
    let next: number | null = null;
    if (e.key in keys) next = (active + keys[e.key] + cases.length) % cases.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = cases.length - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div
        role="tablist"
        aria-label="Casos"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:col-span-4 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {cases.map((c, i) => {
          const selected = i === active;
          return (
            <button
              key={c.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              type="button"
              id={`${baseId}-tab-${c.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={`group shrink-0 cursor-pointer rounded-full border px-5 py-3 text-left text-sm font-semibold transition-colors duration-200 lg:flex lg:items-baseline lg:gap-5 lg:rounded-none lg:border-x-0 lg:border-t-0 lg:border-b-white/12 lg:px-0 lg:py-5 lg:text-base ${
                selected
                  ? "border-sun bg-sun text-navy-deep lg:bg-transparent lg:text-sun"
                  : "border-white/20 text-white/75 hover:text-white"
              }`}
            >
              <span className="hidden text-xs tabular-nums text-white/60 lg:inline">0{i + 1}</span>
              <span className="lg:font-display lg:text-[1.45rem] lg:font-[420]">{c.title}</span>
            </button>
          );
        })}
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${current.id}`}
        className="lg:col-span-8"
      >
        <div key={current.id} className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          {(["before", "after"] as const).map((side) => {
            const photo = current[side];
            return (
              <figure key={side} className="case-fade relative overflow-hidden rounded-2xl bg-navy">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 31vw"
                    className="object-cover"
                  />
                </div>
                <figcaption
                  className={`absolute left-3 top-3 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] ${
                    side === "after" ? "bg-sun text-navy-deep" : "bg-navy-deep/85 text-white"
                  }`}
                >
                  {side === "before" ? "Antes" : "Depois"}
                </figcaption>
              </figure>
            );
          })}
        </div>
        <p className="mt-5 text-sm text-white/65">
          <span className="font-semibold text-white">{current.title}</span> · {current.treatment}
        </p>
      </div>
    </div>
  );
}
