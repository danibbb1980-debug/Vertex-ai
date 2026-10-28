import { useEffect, useState } from "react";

type Efeitos = typeof import("./efeitos");

export function prefereMenosMovimento() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

let promessa: Promise<Efeitos> | null = null;

/** Carrega os efeitos de rolagem depois que a página está pronta. Retorna null com "reduzir movimento". */
export function carregarEfeitos(): Promise<Efeitos | null> {
  if (prefereMenosMovimento()) return Promise.resolve(null);
  if (!promessa) {
    promessa = new Promise<void>((ok) => {
      const pronto = () =>
        "requestIdleCallback" in window
          ? (window as Window & typeof globalThis).requestIdleCallback(() => ok(), { timeout: 1500 })
          : setTimeout(ok, 300);
      if (document.readyState === "complete") pronto();
      else window.addEventListener("load", pronto, { once: true });
    }).then(() => import("./efeitos"));
  }
  return promessa;
}

/** Acompanha a preferência "reduzir movimento". No servidor, assume false. */
export function useMenosMovimento() {
  const [reduzir, setReduzir] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduzir(mq.matches);
    const mudar = () => setReduzir(mq.matches);
    mq.addEventListener("change", mudar);
    return () => mq.removeEventListener("change", mudar);
  }, []);
  return reduzir;
}
