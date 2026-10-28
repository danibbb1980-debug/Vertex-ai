/**
 * Efeitos ligados à rolagem, com a lib `motion` (API vanilla).
 * Este arquivo é carregado sob demanda, depois que a página já está pronta,
 * e nunca é carregado com "reduzir movimento" ativo.
 */
import { animate, scroll } from "motion";

type Cancelar = () => void;

/** Parallax leve das formas e estrelas do hero. */
export function parallaxHero(hero: HTMLElement): Cancelar {
  const cancelar: Cancelar[] = [];
  hero.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
    const d = Number(el.dataset.parallax || 0);
    const anim = animate(el, { y: [0, d] }, { ease: "linear" });
    cancelar.push(scroll(anim, { target: hero, offset: ["start start", "end start"] }));
  });
  return () => cancelar.forEach((c) => c());
}

/** Linha do tempo: a barra cresce e as etapas acendem conforme a rolagem. */
export function linhaDoTempo(lista: HTMLElement, barra: HTMLElement): Cancelar {
  const etapas = Array.from(lista.querySelectorAll<HTMLElement>("[data-etapa]"));
  etapas.forEach((e) => e.removeAttribute("data-feita"));
  const anim = animate(barra, { scaleY: [0, 1] }, { ease: "linear" });
  const offset: ["start 0.7", "end 0.55"] = ["start 0.7", "end 0.55"];
  const c1 = scroll(anim, { target: lista, offset });
  const c2 = scroll(
    (p: number) => {
      const n = Math.min(etapas.length, Math.floor(p * etapas.length + 0.35));
      etapas.forEach((e, i) => e.toggleAttribute("data-feita", i < n));
    },
    { target: lista, offset },
  );
  return () => {
    c1();
    c2();
    etapas.forEach((e) => e.setAttribute("data-feita", ""));
  };
}

/** Linha de crescimento: o traço é desenhado conforme a página rola. */
export function linhaCrescimento(
  alvo: HTMLElement,
  aoProgredir: (p: number) => void,
): Cancelar {
  let atual = 0;
  let destino = 0;
  let raf = 0;
  const caminhos = () => Array.from(alvo.querySelectorAll<SVGPathElement>("[data-cresce]"));
  const aplicar = (p: number) => {
    for (const c of caminhos()) {
      c.style.strokeDasharray = "1 1";
      c.style.strokeDashoffset = String(1 - p);
    }
    aoProgredir(p);
  };
  // suavização simples (sem mola), para o traço não "pular" com a rolagem
  const passo = () => {
    atual += (destino - atual) * 0.12;
    if (Math.abs(destino - atual) < 0.0005) atual = destino;
    aplicar(atual);
    raf = atual === destino ? 0 : requestAnimationFrame(passo);
  };
  const cancelarScroll = scroll(
    (p: number) => {
      destino = p;
      if (!raf) raf = requestAnimationFrame(passo);
    },
    { target: alvo, offset: ["start 0.7", "end 0.95"] },
  );
  return () => {
    cancelarScroll();
    cancelAnimationFrame(raf);
    for (const c of caminhos()) {
      c.style.strokeDasharray = "";
      c.style.strokeDashoffset = "";
    }
    aoProgredir(1);
  };
}
