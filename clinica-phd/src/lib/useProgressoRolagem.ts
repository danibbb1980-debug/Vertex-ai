import { useEffect, useRef, useState, type RefObject } from "react";

export const prefereMenosMovimento = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Progresso (0 a 1) de um elemento atravessando a tela. Só calcula enquanto o
 * elemento está visível (IntersectionObserver) e no máximo uma vez por quadro.
 * Escreve direto em uma variável CSS para não re-renderizar o React.
 */
export function useProgressoRolagem<T extends HTMLElement>(alvo: RefObject<T | null>, onProgresso: (p: number) => void, pontoLeitura = 0.6) {
  const cb = useRef(onProgresso);
  cb.current = onProgresso;
  const [reduzido, setReduzido] = useState(false);

  useEffect(() => {
    const el = alvo.current;
    if (!el) return;
    if (prefereMenosMovimento()) {
      setReduzido(true);
      cb.current(1);
      return;
    }
    let visivel = false;
    let quadro = 0;
    const calcula = () => {
      quadro = 0;
      const r = el.getBoundingClientRect();
      const linha = window.innerHeight * pontoLeitura;
      const p = Math.min(1, Math.max(0, (linha - r.top) / r.height));
      cb.current(p);
    };
    const aoRolar = () => {
      if (visivel && !quadro) quadro = requestAnimationFrame(calcula);
    };
    const io = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
      if (visivel) aoRolar();
    });
    io.observe(el);
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    calcula();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
      cancelAnimationFrame(quadro);
    };
  }, [alvo, pontoLeitura]);

  return reduzido;
}
