import { useEffect, useState, type ComponentType, type RefObject } from "react";
import { shouldUse3D, whenIdle } from "../lib/webgl";
import type { HeroGLProps } from "./HeroGL";

/**
 * Carrega a cena WebGL do hero sob demanda (depois do load, em tempo ocioso).
 *
 * - Aparelho que passa no critério estrito: versão completa no desktop e
 *   versão leve em telas estreitas ou de toque.
 * - Aparelho que só passa no critério relaxado (ex.: celular que informa
 *   4 núcleos ou 4 GB): versão leve.
 * - Nenhum dos dois (sem GPU, movimento reduzido, economia de dados): nada é
 *   baixado e o mockup em CSS 3D continua na tela.
 *
 * A renderização pausa quando o hero sai da tela ou a aba fica oculta.
 */
export function useHeroGL(heroRef: RefObject<HTMLElement | null>) {
  const [Comp, setComp] = useState<ComponentType<HeroGLProps> | null>(null);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [lite, setLite] = useState(false);

  useEffect(() => {
    const strict = shouldUse3D();
    if (!strict && !shouldUse3D({ relaxed: true })) return;
    const narrow = matchMedia("(max-width: 1023px), (pointer: coarse)").matches;
    setLite(!strict || narrow);
    let cancelled = false;
    whenIdle(() => {
      import("./HeroGL")
        .then((m) => !cancelled && setComp(() => m.default))
        .catch(() => {});
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
    setComp(null);
  };

  return { Comp, visible, ready, lite, setReady, fail };
}
