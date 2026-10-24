import { Component, useEffect, useState, type ComponentType, type ReactNode } from "react";

export type SceneProps = { active: boolean; onReady: () => void; onFail: () => void };

/** Decide se o aparelho deve receber o 3D. Qualquer dúvida → fallback em SVG. */
function shouldUse3D(): boolean {
  const q = new URLSearchParams(location.search);
  if (q.has("no3d")) return false;
  if (q.has("force3d")) return true;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return false;
  if ((nav.hardwareConcurrency ?? 8) <= 4) return false;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4) return false;
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    if (!gl) return false;
    const g = gl as WebGLRenderingContext;
    // Sem aceleração de GPU (renderização por software) → fallback
    const dbg = g.getExtension("WEBGL_debug_renderer_info");
    const renderer = dbg ? String(g.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : "";
    g.getExtension("WEBGL_lose_context")?.loseContext();
    if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) return false;
  } catch {
    return false;
  }
  return true;
}

class Boundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Camada fixa com um único canvas. Fica atrás do conteúdo: as seções com fundo
 * sólido cobrem o V, que só aparece no hero e no CTA final (fundos transparentes).
 * O chunk do three.js só é baixado depois do load, em tempo ocioso.
 */
export function Stage3D() {
  const [Scene, setScene] = useState<ComponentType<SceneProps> | null>(null);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!shouldUse3D()) return;
    let cancelled = false;
    const load = () =>
      import("./Scene3D")
        .then((m) => !cancelled && setScene(() => m.default))
        .catch(() => {});
    // O V só aparece no CTA final: baixa o three.js quando a pessoa se aproxima dele
    const cta = document.querySelector("[data-stage]");
    if (!cta) return;
    const near = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        near.disconnect();
        const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
          .requestIdleCallback;
        if (ric) ric(load, { timeout: 1200 });
        else setTimeout(load, 300);
      },
      { rootMargin: "150% 0px" },
    );
    near.observe(cta);
    return () => {
      cancelled = true;
      near.disconnect();
    };
  }, []);

  // Só renderiza quando o hero ou o CTA final estão na tela e a aba está visível
  useEffect(() => {
    if (!Scene) return;
    const stages = Array.from(document.querySelectorAll("[data-stage]"));
    const onScreen = new Set<Element>();
    let hidden = document.hidden;
    const update = () => setVisible(onScreen.size > 0 && !hidden);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.isIntersecting ? onScreen.add(e.target) : onScreen.delete(e.target);
        update();
      },
      { rootMargin: "10% 0px" },
    );
    stages.forEach((s) => io.observe(s));
    const onVis = () => {
      hidden = document.hidden;
      update();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [Scene]);

  if (!Scene) return null;

  const fail = () => {
    document.documentElement.classList.remove("has-3d");
    setScene(null);
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-1000"
      style={{ opacity: ready && visible ? 1 : 0 }}
    >
      <Boundary onError={fail}>
        <Scene
          active={visible}
          onReady={() => {
            setReady(true);
            document.documentElement.classList.add("has-3d");
          }}
          onFail={fail}
        />
      </Boundary>
    </div>
  );
}
