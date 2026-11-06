/**
 * Adaptado de "Accordion" (21st.dev, @ddoemonn): mantém a lógica acessível
 * (aria-expanded/controls, região rotulada, setas/Home/End, `inert` no painel
 * fechado, altura medida com ResizeObserver) e troca todo o visual pela
 * identidade do site. Ícone: argola que vira "+"/"−" em traço fino.
 */
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";

const useEfeitoLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;
import { m, useReducedMotion } from "motion/react";

export type ItemAcordeao = { id: string; titulo: string; conteudo: ReactNode };

function useAlturaAuto() {
  const ref = useRef<HTMLDivElement>(null);
  const [altura, setAltura] = useState(0);
  const [pronto, setPronto] = useState(false);
  useEfeitoLayout(() => {
    const el = ref.current;
    if (!el) return;
    const ler = () => setAltura(el.getBoundingClientRect().height);
    ler();
    setPronto(true);
    const ro = new ResizeObserver(ler);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, altura, pronto };
}

export function Acordeao({ itens, nivel = 3, escuro = false }: { itens: ItemAcordeao[]; nivel?: number; escuro?: boolean }) {
  const base = useId();
  const [aberto, setAberto] = useState<string | null>(null);
  const botoes = useRef(new Map<string, HTMLButtonElement>());
  const mover = useCallback((id: string, delta: number | "inicio" | "fim") => {
    const ordem = itens.map((i) => i.id);
    const at = ordem.indexOf(id);
    const prox = delta === "inicio" ? 0 : delta === "fim" ? ordem.length - 1 : (at + delta + ordem.length) % ordem.length;
    botoes.current.get(ordem[prox])?.focus();
  }, [itens]);

  return (
    <div className={`border-t ${escuro ? "border-marfim/15" : "border-cacau/12"}`}>
      {itens.map((item) => (
        <Linha
          key={item.id}
          item={item}
          aberto={aberto === item.id}
          nivel={nivel}
          escuro={escuro}
          idCab={`${base}-c-${item.id}`}
          idPainel={`${base}-p-${item.id}`}
          refBotao={(n) => { if (n) botoes.current.set(item.id, n); else botoes.current.delete(item.id); }}
          alternar={() => setAberto((a) => (a === item.id ? null : item.id))}
          teclado={(e) => {
            const mapa: Record<string, number | "inicio" | "fim"> = { ArrowDown: 1, ArrowUp: -1, Home: "inicio", End: "fim" };
            if (e.key in mapa) { e.preventDefault(); mover(item.id, mapa[e.key]); }
          }}
        />
      ))}
    </div>
  );
}

function Linha({ item, aberto, nivel, escuro, idCab, idPainel, refBotao, alternar, teclado }: {
  item: ItemAcordeao; aberto: boolean; nivel: number; escuro: boolean; idCab: string; idPainel: string;
  refBotao: (n: HTMLButtonElement | null) => void; alternar: () => void; teclado: (e: React.KeyboardEvent) => void;
}) {
  const reduzido = useReducedMotion();
  const { ref, altura, pronto } = useAlturaAuto();
  useEffect(() => {
    const el = ref.current as (HTMLDivElement & { inert?: boolean }) | null;
    if (el) el.inert = !aberto;
  }, [ref, aberto]);

  return (
    <div className={`border-b ${escuro ? "border-marfim/15" : "border-cacau/12"}`}>
      <div role="heading" aria-level={nivel}>
        <button
          ref={refBotao}
          id={idCab}
          type="button"
          aria-expanded={aberto}
          aria-controls={idPainel}
          onClick={alternar}
          onKeyDown={teclado}
          className="group flex min-h-16 w-full items-center gap-5 py-5 text-left"
        >
          <span className={`flex-1 font-serif text-[1.35rem] leading-snug sm:text-[1.55rem] ${escuro ? "text-marfim" : "text-cacau"} transition-colors group-hover:text-mauve`}>
            {item.titulo}
          </span>
          <span aria-hidden="true" className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ouro/70">
            <span className="absolute h-px w-3.5 bg-mauve" />
            <m.span
              className="absolute h-3.5 w-px bg-mauve"
              initial={false}
              animate={{ scaleY: aberto ? 0 : 1 }}
              transition={reduzido ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
          </span>
        </button>
      </div>
      <m.div
        initial={false}
        animate={pronto ? { height: aberto ? altura : 0 } : {}}
        transition={reduzido ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 40, mass: 0.7 }}
        style={{ overflow: "hidden", height: pronto ? undefined : aberto ? "auto" : 0 }}
      >
        <div ref={ref} id={idPainel} role="region" aria-labelledby={idCab}>
          <m.div
            initial={false}
            animate={{ opacity: aberto ? 1 : 0 }}
            transition={reduzido ? { duration: 0 } : { duration: aberto ? 0.25 : 0.15 }}
            className={`max-w-2xl pb-6 pr-12 text-[1.02rem] leading-relaxed ${escuro ? "text-marfim/85" : "text-texto"}`}
          >
            {item.conteudo}
          </m.div>
        </div>
      </m.div>
    </div>
  );
}
