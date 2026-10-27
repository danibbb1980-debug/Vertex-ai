"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { PointerState } from "./ToothCanvas";

// WebGL só no navegador: a cena nunca entra no HTML do servidor.
const ToothCanvas = dynamic(() => import("./ToothCanvas"), { ssr: false });

type NavigatorWithHints = Navigator & {
  connection?: { saveData?: boolean; effectiveType?: string };
  deviceMemory?: number;
};

/** O aparelho dá conta de uma cena 3D? Na dúvida, fica o pôster. */
function canRender3D() {
  const nav = navigator as NavigatorWithHints;
  if (nav.connection?.saveData) return false;
  if (nav.connection?.effectiveType && /(^|-)2g$/.test(nav.connection.effectiveType)) return false;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 2) return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Media query reativa: acompanha mudanças no meio da visita (ex.: reduced-motion). */
function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

const noSubscribe = () => () => {};
/** /?poster: modo de captura usado por scripts/render-poster.mjs. */
function useCaptureMode() {
  return useSyncExternalStore(
    noSubscribe,
    () => new URLSearchParams(window.location.search).has("poster"),
    () => false,
  );
}

export function ToothStage() {
  const wrapper = useRef<HTMLDivElement>(null);
  const pointer = useRef<PointerState>({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const capture = useCaptureMode();

  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const compact = useMediaQuery("(max-width: 767px)");

  // Decide e carrega a cena depois que a página já pintou o conteúdo.
  useEffect(() => {
    if (!capture && !canRender3D()) return;
    const start = () => setEnabled(true);
    if (capture) {
      const t = window.setTimeout(start, 0);
      return () => window.clearTimeout(t);
    }
    const id =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(start, { timeout: 1500 })
        : window.setTimeout(start, 300);
    return () => {
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, [capture]);

  // Pausa a renderização fora da tela e com a aba em segundo plano.
  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "80px" });
    io.observe(el);
    const onVisibility = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Cursor: só em computadores, e nunca com reduced-motion.
  useEffect(() => {
    if (!finePointer || reducedMotion) {
      pointer.current = { x: 0, y: 0 };
      return;
    }
    const onMove = (e: PointerEvent) => {
      pointer.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    const onLeave = () => (pointer.current = { x: 0, y: 0 });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [finePointer, reducedMotion]);

  return (
    <div
      ref={wrapper}
      data-scene-ready={ready ? "true" : "false"}
      data-capture={capture ? "true" : undefined}
      className="relative aspect-[4/5] w-full"
    >
      {/* Pôster: renderização do mesmo modelo, visível de imediato e sem WebGL. */}
      <div className={`tooth-poster absolute inset-0 ${capture ? "hidden" : ""}`}>
        <div className="poster-float relative h-full w-full">
          <Image
            src="/images/tooth-poster.webp"
            alt=""
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 767px) 90vw, 46vw"
            className="object-contain"
          />
        </div>
      </div>

      {enabled && (
        <div className="absolute inset-0">
          <ToothCanvas
            motion={!reducedMotion}
            active={inView && pageVisible}
            compact={compact}
            pointer={pointer}
            capture={capture}
            onReady={() => {
              setReady(true);
              if (capture) document.title = "poster-ready";
            }}
          />
        </div>
      )}
    </div>
  );
}
