"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { caseSrc, cases, site, whatsappUrl } from "@/lib/site-data";
import { CompareSlider } from "@/components/ui/CompareSlider";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";

/*
  Casos reais publicados por Matheus Tonon no Instagram, separados em antes e
  depois (scripts/prepare-images.mjs), sem retoque. Nenhuma promessa de
  resultado: o texto lembra que cada caso depende de avaliação individual.
*/
export function Cases() {
  const [active, setActive] = useState(0);
  const current = cases[active];
  const ratio = current.width / current.height;

  return (
    <section id="trabalhos" aria-labelledby="trabalhos-title" className="relative bg-paper py-24 sm:py-32 lg:py-40">
      <div className="container-site">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <SectionLabel index="03">Trabalhos</SectionLabel>
            <h2 id="trabalhos-title" className="display h-section mt-8 text-graphite">
              Antes e depois, <em>em detalhe</em>.
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-4 lg:col-start-9">
            <p className="text-[0.95rem] leading-relaxed text-ink">
              Casos publicados por Matheus Tonon. Arraste a linha sobre a imagem — ou use as setas do teclado — para
              comparar.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          {/* Palco */}
          <Reveal variant="scale" className="min-w-0 lg:col-span-8">
            <div className="flex min-h-[18rem] items-center justify-center bg-paper-2 lg:min-h-[min(72svh,40rem)]">
              <div
                className="relative w-full"
                style={
                  {
                    aspectRatio: `${current.width} / ${current.height}`,
                    maxWidth: `calc(min(72svh, 40rem) * ${ratio.toFixed(4)})`,
                  } as CSSProperties
                }
              >
                <CompareSlider
                  key={current.id}
                  before={{ src: caseSrc(current.id, "antes"), alt: current.before }}
                  after={{ src: caseSrc(current.id, "depois"), alt: current.after }}
                  width={current.width}
                  height={current.height}
                  sizes="(min-width: 1024px) 60vw, 100vw"
                />
              </div>
            </div>
            <p className="mt-4 flex items-baseline justify-between gap-4 text-xs tracking-[0.06em] text-ink" aria-live="polite">
              <span>
                <span className="font-semibold text-graphite tabular-nums">Caso {String(active + 1).padStart(2, "0")}</span>
                {" · "}
                {current.label}
              </span>
              <span className="tabular-nums">
                {String(active + 1).padStart(2, "0")} / {String(cases.length).padStart(2, "0")}
              </span>
            </p>
          </Reveal>

          {/* Seletor de casos */}
          <Reveal delay={120} className="flex min-w-0 flex-col lg:col-span-4">
            <ul className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-2">
              {cases.map((c, i) => {
                const selected = i === active;
                return (
                  <li key={c.id} className="w-36 shrink-0 snap-start sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      aria-pressed={selected}
                      className={`group block w-full text-left transition-opacity duration-300 ${
                        selected ? "opacity-100" : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <span className="relative block aspect-[4/3] overflow-hidden bg-paper-2">
                        <Image
                          src={caseSrc(c.id, "depois")}
                          alt=""
                          width={c.width}
                          height={c.height}
                          sizes="(min-width: 1024px) 14vw, 9rem"
                          className={`h-full w-full object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.04] ${
                            c.shape === "tall" ? "object-[50%_40%]" : ""
                          }`}
                        />
                        <span
                          aria-hidden="true"
                          className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-graphite transition-transform duration-500 ease-out-soft ${
                            selected ? "scale-x-100" : "scale-x-0"
                          }`}
                        />
                      </span>
                      <span className="mt-2.5 block text-[0.7rem] font-semibold tracking-[0.16em] text-graphite uppercase tabular-nums">
                        Caso {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="block text-xs text-ink">{c.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-10 border-t border-graphite/15 pt-6 lg:mt-auto">
              <p className="text-[0.85rem] leading-relaxed text-ink">
                Cada caso é único: o planejamento depende de uma avaliação individual. As imagens foram publicadas
                no perfil{" "}
                <a href={site.links.instagram} target="_blank" rel="noopener noreferrer" className="link-line text-graphite">
                  {site.links.instagramHandle}
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
                .
              </p>
              <Button href={whatsappUrl("cases")} external variant="outline" className="mt-6 w-full sm:w-auto">
                Quero conversar sobre o meu caso
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
