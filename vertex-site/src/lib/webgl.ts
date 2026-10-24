import { Component, type ReactNode } from "react";

const cache: Record<"strict" | "relaxed", boolean | null> = { strict: null, relaxed: null };

/**
 * Decide se o aparelho deve receber cenas WebGL. Qualquer dúvida → fallback.
 * `?no3d` força o fallback e `?force3d` força o 3D (para testes).
 * O resultado fica guardado: a checagem cria um contexto WebGL temporário.
 *
 * - padrão (estrito): também exige mais de 4 núcleos e mais de 4 GB.
 * - `relaxed`: dispensa o corte por núcleos e memória (os navegadores arredondam
 *   esses valores e muitos celulares bons ficam de fora). Usado pela versão leve
 *   do hero, que é barata. GPU real, sem economia de dados e sem movimento
 *   reduzido continuam obrigatórios.
 */
export function shouldUse3D(opts: { relaxed?: boolean } = {}): boolean {
  const mode = opts.relaxed ? "relaxed" : "strict";
  if (cache[mode] === null) cache[mode] = check(mode === "relaxed");
  return cache[mode]!;
}

function check(relaxed: boolean): boolean {
  const q = new URLSearchParams(location.search);
  if (q.has("no3d")) return false;
  if (q.has("force3d")) return true;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return false;
  if (!relaxed) {
    if ((nav.hardwareConcurrency ?? 8) <= 4) return false;
    if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4) return false;
  }
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

/** Executa `cb` depois do load, em tempo ocioso. */
export function whenIdle(cb: () => void, timeout = 2000): void {
  const run = () => {
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    if (ric) ric(cb, { timeout });
    else setTimeout(cb, 600);
  };
  if (document.readyState === "complete") run();
  else addEventListener("load", run, { once: true });
}

/** Se a cena WebGL quebrar, some com ela e avisa (o fallback continua na tela). */
export class GLBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
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
