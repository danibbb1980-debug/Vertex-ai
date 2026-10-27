import { Children, useEffect, useRef, type ReactNode } from "react";
import { carregarMotion, prefereMenosMovimento } from "../lib/movimento";

/**
 * Pilha de cartões que se acomodam uns sobre os outros ao rolar.
 *
 * Adaptado do "Stacking Cards" (21st.dev, danielpetho / Khoa Phan): mesma
 * mecânica de cartões sticky com escala ligada ao progresso da rolagem, mas
 * usando scroll() + animate() do motion (ScrollTimeline acelerada pelo
 * navegador, sem re-render do React), topo calculado a partir do header,
 * último cartão sem redução e escala mais contida. Com prefers-reduced-motion
 * vira uma lista simples, sem sticky.
 */
export function PilhaCartoes({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const total = Children.count(children);

  useEffect(() => {
    const raiz = ref.current;
    if (!raiz) return;
    if (prefereMenosMovimento()) {
      raiz.dataset.estatico = "true";
      return;
    }
    let paradas: Array<() => void> = [];
    let cancelado = false;
    carregarMotion().then(({ animate, scroll }) => {
      if (cancelado) return;
      const cartoes = Array.from(raiz.querySelectorAll<HTMLElement>("[data-cartao]"));
      paradas = cartoes.map((el, i) => {
      const fim = 1 - (total - 1 - i) * 0.035;
      const inicio = i / total;
      return scroll(animate(el, { scale: [1, 1, fim] }, { ease: "linear", times: [0, inicio, 1] }), {
        target: raiz,
        offset: ["start start", "end end"],
      });
      });
    });
    return () => {
      cancelado = true;
      paradas.forEach((p) => p());
    };
  }, [total]);

  return (
    <div ref={ref} className={`group/pilha relative ${className}`}>
      {children}
    </div>
  );
}

export function CartaoPilha({ indice, ultimo, children }: { indice: number; ultimo: boolean; children: ReactNode }) {
  return (
    <div
      className={`sticky group-data-[estatico=true]/pilha:relative ${ultimo ? "" : "pb-6 md:pb-10"}`}
      style={{ top: `calc(var(--topo) + 20px + ${indice * 14}px)` }}
    >
      <div data-cartao className="origin-top">
        {children}
      </div>
    </div>
  );
}
