import { useEffect, useState } from "react";

/** true quando o sistema pede movimento reduzido. */
export function useMovimentoReduzido() {
  const [reduzido, setReduzido] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const atualizar = () => setReduzido(mq.matches);
    atualizar();
    mq.addEventListener("change", atualizar);
    return () => mq.removeEventListener("change", atualizar);
  }, []);
  return reduzido;
}

/**
 * Chama `aoMudar` no máximo uma vez por quadro quando a página rola ou muda de tamanho.
 * Substitui a lib `motion` para manter o JS inicial enxuto.
 */
export function useRolagem(aoMudar: () => void, ativo = true) {
  useEffect(() => {
    if (!ativo) return;
    let quadro = 0;
    const agendar = () => {
      if (quadro) return;
      quadro = requestAnimationFrame(() => {
        quadro = 0;
        aoMudar();
      });
    };
    aoMudar();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };
  }, [aoMudar, ativo]);
}

/** Progresso 0..1 de um elemento entre dois pontos da tela (frações da altura da janela). */
export function progressoNaTela(el: Element, inicio: number, fim: number) {
  const r = el.getBoundingClientRect();
  const h = window.innerHeight;
  // começa quando o topo do elemento cruza `inicio`, termina quando a base cruza `fim`
  const a = r.top - h * inicio;
  const b = r.bottom - h * fim;
  const total = a - b;
  if (total <= 0) return a <= 0 ? 1 : 0;
  return Math.min(1, Math.max(0, a / total));
}
