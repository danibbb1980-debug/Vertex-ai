"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { Arrow } from "@/components/ui/primitives";
import { bodyAreas, type Gender } from "@/lib/site";

const figures: Record<Gender, { src: string; w: number; h: number; alt: string }> = {
  feminino: { src: "/img/corpo/feminino.png", w: 169, h: 643, alt: "Silhueta feminina com as áreas de depilação" },
  masculino: { src: "/img/corpo/masculino.png", w: 201, h: 646, alt: "Silhueta masculina com as áreas de depilação" },
};

/**
 * Mapa interativo das áreas atendidas (mesmo conteúdo do site original).
 * A lista é a navegação principal — acessível por teclado —, e os pontos no
 * corpo acompanham a seleção.
 */
export function BodyMap({
  initialGender = "feminino",
  lockGender = false,
  ctaHref = "#agendar",
  tone = "light",
}: {
  initialGender?: Gender;
  lockGender?: boolean;
  ctaHref?: string;
  tone?: "light" | "dark";
}) {
  const [gender, setGender] = useState<Gender>(initialGender);
  const [active, setActive] = useState<string>(bodyAreas[0].id);
  const uid = useId();
  const area = bodyAreas.find((a) => a.id === active) ?? bodyAreas[0];
  const fig = figures[gender];
  const dark = tone === "dark";

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
      {/* Lista de áreas */}
      <div className="lg:col-span-6 xl:col-span-5">
        {!lockGender ? (
          <div role="tablist" aria-label="Escolha o público" className="mb-10 flex gap-8">
            {(["feminino", "masculino"] as Gender[]).map((g) => (
              <button
                key={g}
                role="tab"
                type="button"
                aria-selected={gender === g}
                onClick={() => setGender(g)}
                className={`eyebrow relative pb-2 transition-colors duration-500 ${
                  gender === g ? (dark ? "text-bone" : "text-ink") : dark ? "text-mist hover:text-bone" : "text-stone hover:text-ink"
                }`}
              >
                {g === "feminino" ? "Feminino" : "Masculino"}
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 left-0 h-px w-full origin-left bg-current transition-transform duration-700 ease-[var(--ease-out-expo)] ${
                    gender === g ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            ))}
          </div>
        ) : null}

        <ul className={`border-t ${dark ? "border-bone/15" : "border-ink/12"}`} aria-label="Áreas atendidas">
          {bodyAreas.map((a, i) => {
            const isActive = a.id === active;
            return (
              <li key={a.id} className={`border-b ${dark ? "border-bone/15" : "border-ink/12"}`}>
                <button
                  type="button"
                  onClick={() => setActive(a.id)}
                  aria-pressed={isActive}
                  aria-controls={`${uid}-desc`}
                  className="group flex w-full items-baseline gap-5 py-3.5 text-left md:py-4"
                >
                  <span className={`eyebrow w-6 tabular-nums transition-colors ${isActive ? (dark ? "text-gold" : "text-gold-deep") : dark ? "text-mist" : "text-stone"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`font-display text-[1.65rem] leading-none transition-[transform,opacity] duration-500 ease-[var(--ease-out-expo)] md:text-[2rem] ${
                      isActive ? "translate-x-2 italic opacity-100" : "opacity-55 group-hover:translate-x-1 group-hover:opacity-90"
                    }`}
                  >
                    {a.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`ml-auto self-center transition-[opacity,transform] duration-500 ${isActive ? "opacity-100" : "-translate-x-2 opacity-0"}`}
                  >
                    <span className="plus-mark text-[0.75rem]" />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Figura com pontos */}
      <div className="grid items-center gap-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:col-span-6 xl:col-span-6 xl:col-start-7">
        <div className={`relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden ${dark ? "bg-ink-2" : "bg-sand/60"}`}>
          <div className="absolute inset-x-0 bottom-[3%] top-[5%] flex justify-center">
            <div className="relative h-full" style={{ aspectRatio: `${fig.w} / ${fig.h}` }}>
              <Image
                key={gender}
                src={fig.src}
                alt={fig.alt}
                width={fig.w}
                height={fig.h}
                sizes="200px"
                className="h-full w-full object-contain animate-[fade-up_0.9s_var(--ease-out-expo)_both]"
              />
              {bodyAreas.map((a) => {
                const [x, y] = a.pin[gender];
                const isActive = a.id === active;
                return (
                  <button
                    key={a.id}
                    type="button"
                    tabIndex={-1}
                    aria-hidden="true"
                    onClick={() => setActive(a.id)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 p-2"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <span className="relative block h-2.5 w-2.5">
                      {isActive ? <span className="pin-ping absolute inset-0 rounded-full bg-gold" /> : null}
                      <span
                        className={`absolute inset-0 rounded-full border transition-all duration-500 ${
                          isActive ? "scale-125 border-gold bg-gold" : "border-ink/50 bg-bone/80"
                        }`}
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <p className={`eyebrow absolute bottom-4 left-4 ${dark ? "text-mist" : "text-stone"}`}>
            {gender === "feminino" ? "Feminino" : "Masculino"}
          </p>
        </div>

        <div id={`${uid}-desc`} aria-live="polite" className="sm:self-end sm:pb-6">
          <p className={`eyebrow mb-4 ${dark ? "text-gold" : "text-gold-deep"}`}>Área selecionada</p>
          <p key={area.id} className="font-display text-4xl italic leading-none animate-[fade-up_0.8s_var(--ease-out-expo)_both] md:text-5xl">
            {area.label}
          </p>
          <p key={`${area.id}-t`} className={`mt-5 max-w-xs text-[0.9375rem] animate-[fade-up_0.8s_var(--ease-out-expo)_80ms_both] ${dark ? "text-mist" : "text-stone"}`}>
            {area.text}
          </p>
          <a href={ctaHref} className={`btn mt-8 ${dark ? "btn-outline-light" : "btn-outline-dark"}`}>
            <span>Quero agendar</span>
            <Arrow />
          </a>
        </div>
      </div>
    </div>
  );
}
