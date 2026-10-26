"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";

type Props = {
  before: { src: string; alt: string };
  after: { src: string; alt: string };
  width: number;
  height: number;
  sizes: string;
};

/**
 * Comparador antes/depois. O controle é um <input type="range"> nativo que
 * cobre toda a imagem: funciona com mouse, toque e teclado (setas, Home/End)
 * e é anunciado pelos leitores de tela sem ARIA extra.
 */
export function CompareSlider({ before, after, width, height, sizes }: Props) {
  const [pos, setPos] = useState(50);

  return (
    <div
      className="compare group relative h-full w-full touch-pan-y overflow-hidden bg-graphite-2 select-none"
      style={{ "--pos": `${pos}%` } as CSSProperties}
    >
      <Image
        src={before.src}
        alt={before.alt}
        width={width}
        height={height}
        sizes={sizes}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <div className="compare-after absolute inset-0">
        <Image
          src={after.src}
          alt={after.alt}
          width={width}
          height={height}
          sizes={sizes}
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>

      {/* Rótulos fixos nos cantos. */}
      <span className="pointer-events-none absolute top-4 left-4 bg-graphite/70 px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.22em] text-paper uppercase backdrop-blur-sm">
        Antes
      </span>
      <span className="pointer-events-none absolute top-4 right-4 bg-paper/85 px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.22em] text-graphite uppercase backdrop-blur-sm">
        Depois
      </span>

      {/* Linha e alça. */}
      <div aria-hidden="true" className="compare-handle pointer-events-none absolute inset-y-0 w-px -translate-x-1/2 bg-paper/90">
        <span className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-paper/80 bg-graphite/35 text-paper backdrop-blur-md transition-transform duration-300 ease-out-soft group-active:scale-90">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 6l-5 6 5 6M15 6l5 6-5 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Comparar antes e depois: arraste para os lados"
        aria-valuetext={`${100 - pos}% da imagem mostra o depois`}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0 focus-visible:opacity-100"
      />
      {/* Anel de foco visível para quem navega pelo teclado. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 ring-2 ring-champagne ring-inset opacity-0 transition-opacity group-has-[input:focus-visible]:opacity-100"
      />
    </div>
  );
}
