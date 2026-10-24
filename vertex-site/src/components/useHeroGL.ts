import { useEffect, useState, type ComponentType, type RefObject } from "react";
import { heroPlan, whenIdle } from "../lib/webgl";
import type { HeroGLProps } from "./HeroGL";

/**
 * Carrega a cena WebGL do hero sob demanda (depois do load, em tempo ocioso),
 * conforme `heroPlan()` em lib/webgl.ts.
 *
 * - Sem GPU (ou se as duas versões falharem): vídeo gravado da própria cena.
 * - Se a versão completa falhar (ex.: vidro com refração numa GPU específica),
 *   tenta a versão leve antes de partir para o vídeo.
 * - Movimento reduzido: a cena aparece parada.
 * - A renderização pausa quando o hero sai da tela ou a aba fica oculta.
 * - `?debug3d` mostra na tela o caminho escolhido e o motivo.
 */
export function useHeroGL(heroRef: RefObject<HTMLElement | null>) {
  const [Comp, setComp] = useState<ComponentType<HeroGLProps> | null>(null);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [lite, setLite] = useState(false);
  const [still, setStill] = useState(false);
  const [debug, setDebug] = useState<string | null>(null);
  /** Vídeo gravado da cena, para aparelhos sem GPU. "still" = só a imagem parada. */
  const [video, setVideo] = useState<null | "play" | "still">(null);

  useEffect(() => {
    const plan = heroPlan();
    const wantDebug = new URLSearchParams(location.search).has("debug3d");
    const note = (msg: string) => {
      if (wantDebug) setDebug(msg);
      console.info(`[Vertex 3D] ${msg}`);
    };
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!plan.mode && plan.video) {
      note(`vídeo da cena${reduced ? " (imagem parada: movimento reduzido)" : ""} — ${plan.reason}`);
      whenIdle(() => setVideo(reduced ? "still" : "play"));
      return;
    }
    note(plan.mode ? `cena ${plan.mode === "full" ? "completa" : "leve"} — ${plan.reason}` : `mockup em CSS — ${plan.reason}`);
    if (!plan.mode) return;
    setLite(plan.mode === "lite");
    setStill(plan.still);
    let cancelled = false;
    whenIdle(() => {
      import("./HeroGL")
        .then((m) => !cancelled && setComp(() => m.default))
        .catch((e) => note(`falha ao carregar a cena: ${String(e)}`));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!Comp || !el) return;
    let onScreen = true;
    let hidden = document.hidden;
    const update = () => setVisible(onScreen && !hidden);
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      update();
    });
    io.observe(el);
    const onVis = () => {
      hidden = document.hidden;
      update();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [Comp, heroRef]);

  const fail = () => {
    setReady(false);
    if (!lite) {
      // Versão completa falhou: tenta a leve
      console.info("[Vertex 3D] a versão completa falhou; tentando a versão leve");
      setDebug((d) => (d ? `${d} · completa falhou → leve` : d));
      setLite(true);
      return;
    }
    console.info("[Vertex 3D] a cena falhou; usando o vídeo da cena");
    setDebug((d) => (d ? `${d} · leve falhou → vídeo` : d));
    setComp(null);
    setVideo(matchMedia("(prefers-reduced-motion: reduce)").matches ? "still" : "play");
  };

  return { Comp, visible, ready, lite, still, debug, video, setReady, fail };
}
