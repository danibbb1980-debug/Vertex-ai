"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { buildDentalGeometries, type DentalGeometries, type Quality } from "@/lib/three/build-geometries";
import { DentalScene, type SceneInputs } from "./DentalScene";

type Props = {
  /** Elemento do hero: define o progresso de rolagem e quando pausar. */
  heroId: string;
  reducedMotion: boolean;
  onReady: () => void;
};

function detectQuality(): Quality {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < 768;
  const cores = navigator.hardwareConcurrency ?? 4;
  return coarse || small || cores <= 4 ? "low" : "high";
}

/** No modo leve, desenha um quadro a cada dois (≈ 30 fps): metade do custo de GPU e bateria. */
function HalfRateDriver({ running }: { running: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let id = requestAnimationFrame(function tick() {
      if (frame++ % 2 === 0) invalidate();
      id = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(id);
  }, [running, invalidate]);
  return null;
}

/**
 * Canvas WebGL do hero. Carregado sob demanda (next/dynamic, ssr: false)
 * depois do carregamento da página. Gera a geometria em etapas, compila os
 * shaders de forma assíncrona, pausa o loop quando o hero sai da tela ou a
 * aba fica oculta e reduz a resolução se o aparelho não sustentar o FPS.
 */
export default function HeroCanvas({ heroId, reducedMotion, onReady }: Props) {
  const inputs = useRef<SceneInputs>({ scroll: 0, pointerX: 0, pointerY: 0 });
  const [active, setActive] = useState(true);
  const [quality] = useState<Quality>(detectQuality);
  const [geometries, setGeometries] = useState<DentalGeometries | null>(null);
  const [dpr, setDpr] = useState(() => Math.min(window.devicePixelRatio || 1, quality === "high" ? 1.75 : 1.4));

  useEffect(() => {
    let cancelled = false;
    let built: DentalGeometries | null = null;
    buildDentalGeometries(quality).then((g) => {
      built = g;
      if (cancelled) Object.values(g).forEach((geo) => geo.dispose());
      else setGeometries(g);
    });
    return () => {
      cancelled = true;
      if (built) Object.values(built).forEach((geo) => geo.dispose());
    };
  }, [quality]);

  useEffect(() => {
    const hero = document.getElementById(heroId);
    if (!hero) return;

    let visible = true;
    let pageVisible = !document.hidden;
    const sync = () => setActive(visible && pageVisible);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(hero);

    const onVisibility = () => {
      pageVisible = !document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onScroll = () => {
      const rect = hero.getBoundingClientRect();
      const range = Math.max(1, rect.height * 0.9);
      inputs.current.scroll = Math.min(1, Math.max(0, -rect.top / range));
      hero.style.setProperty("--hero-progress", inputs.current.scroll.toFixed(3));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const fine = window.matchMedia("(pointer: fine)").matches;
    const onPointer = (e: PointerEvent) => {
      inputs.current.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      inputs.current.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (fine && !reducedMotion) window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [heroId, reducedMotion]);

  if (!geometries) return null;

  const animate = active && !reducedMotion;
  const frameloop = reducedMotion || quality === "low" ? "demand" : active ? "always" : "never";

  return (
    <Canvas
      frameloop={frameloop}
      dpr={dpr}
      camera={{ fov: 26, position: [0, 2.3, 8.1], near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl, camera }) => {
        // Câmera levemente acima do objeto: mostra a face oclusal da coroa.
        camera.lookAt(0, 0.08, 0);
        gl.toneMapping = THREE.NeutralToneMapping;
        gl.toneMappingExposure = 1;
        gl.setClearColor(0x000000, 0);
      }}
      aria-hidden="true"
      tabIndex={-1}
      style={{ pointerEvents: "none" }}
    >
      <PerformanceMonitor
        bounds={() => (quality === "low" ? [22, 40] : [45, 60])}
        onDecline={() => setDpr((d) => Math.max(1, d - 0.25))}
        flipflops={3}
      />
      {quality === "low" && <HalfRateDriver running={animate} />}
      <DentalScene
        inputs={inputs}
        geometries={geometries}
        quality={quality}
        reducedMotion={reducedMotion}
        onReady={onReady}
      />
    </Canvas>
  );
}
