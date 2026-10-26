"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Objeto 3D do hero com melhoria progressiva:
 *   1. o pôster estático (renderizado da própria cena) aparece de imediato;
 *   2. depois do carregamento da página, se houver WebGL, o canvas é carregado;
 *   3. quando o primeiro quadro é desenhado, o canvas assume o lugar do pôster.
 * Sem WebGL, ou se o carregamento falhar, o pôster permanece.
 */
export function HeroVisual({ heroId }: { heroId: string }) {
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);

    // Só depois do carregamento completo da página e de um momento ocioso:
    // o 3D nunca disputa banda ou CPU com o conteúdo principal.
    let handle: number | undefined;
    const start = () => {
      if (supportsWebGL()) setMount(true);
    };
    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") {
        handle = window.requestIdleCallback(start, { timeout: 1500 });
      } else {
        handle = window.setTimeout(start, 300);
      }
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      media.removeEventListener("change", sync);
      window.removeEventListener("load", schedule);
      if (handle === undefined) return;
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, []);

  return (
    <div className="absolute inset-0">
      <Image
        src="/hero/poster.webp"
        alt=""
        aria-hidden="true"
        width={840}
        height={1200}
        loading="eager"
        fetchPriority="high"
        unoptimized
        className={`absolute top-1/2 left-1/2 h-full w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain transition-opacity duration-700 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      />
      {mount && (
        <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
          <HeroCanvas heroId={heroId} reducedMotion={reducedMotion} onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  );
}
