import { useEffect, useState } from "react";

function consulta(q: string): boolean {
  return typeof window !== "undefined" && window.matchMedia(q).matches;
}

/** true quando o usuário pediu menos movimento. Começa em false (igual ao HTML pré-renderizado). */
export function useMenosMovimento(): boolean {
  const [menos, setMenos] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const atualizar = () => setMenos(mq.matches);
    atualizar();
    mq.addEventListener("change", atualizar);
    return () => mq.removeEventListener("change", atualizar);
  }, []);
  return menos;
}

/** Ponteiro fino (mouse/trackpad) e sem pedido de redução de movimento. */
export function podeEfeitoDePonteiro(): boolean {
  return consulta("(pointer: fine)") && !consulta("(prefers-reduced-motion: reduce)");
}

export function prefereMenosMovimento(): boolean {
  return consulta("(prefers-reduced-motion: reduce)");
}

/**
 * Observador único para tudo que tem [data-revelar]: adiciona .esta-visivel
 * quando o elemento entra na tela e para de observar (anima uma vez só).
 */
export function useRevelarAoRolar(): void {
  useEffect(() => {
    const alvos = document.querySelectorAll<HTMLElement>("[data-revelar]");
    if (!("IntersectionObserver" in window)) {
      alvos.forEach((el) => el.classList.add("esta-visivel"));
      return;
    }
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            e.target.classList.add("esta-visivel");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    alvos.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/** motion carregado sob demanda: os efeitos são decorativos e não entram no JS inicial. */
let motionPromessa: Promise<typeof import("motion")> | null = null;
export function carregarMotion() {
  motionPromessa ??= quandoOcioso().then(() => import("motion"));
  return motionPromessa;
}

/** Resolve quando o navegador fica ocioso depois do carregamento (efeitos não competem com a página). */
export function quandoOcioso(limite = 2500): Promise<void> {
  return new Promise((ok) => {
    const agendar = () => {
      if ("requestIdleCallback" in window) window.requestIdleCallback(() => ok(), { timeout: limite });
      else setTimeout(ok, 300);
    };
    if (document.readyState === "complete") agendar();
    else window.addEventListener("load", agendar, { once: true });
  });
}
