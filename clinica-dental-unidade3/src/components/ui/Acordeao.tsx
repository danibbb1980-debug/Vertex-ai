/*
  Adaptado de "Accordion" (21st.dev, @ddoemonn).
  Mantido: navegação por setas/Home/End, aria-expanded/controls, inert no painel
  fechado, altura medida com ResizeObserver e reduced motion.
  Mudanças: identidade da clínica (serif, filete dourado, cantos), alvos de 56px,
  sem rolagem interna no painel, ícone de "+" que gira.
*/
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { m, useReducedMotion } from "motion/react";

const useEfeitoLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;

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

export function Acordeao({ itens, nivel = 3 }: { itens: ItemAcordeao[]; nivel?: number }) {
  const base = useId();
  const [aberto, setAberto] = useState<string | null>(itens[0]?.id ?? null);
  const botoes = useRef(new Map<string, HTMLButtonElement>());
  const reduzido = Boolean(useReducedMotion());

  const mover = useCallback(
    (id: string, delta: number, borda?: "inicio" | "fim") => {
      const ordem = itens.map((i) => i.id);
      const at = ordem.indexOf(id);
      const prox = borda === "inicio" ? 0 : borda === "fim" ? ordem.length - 1 : (at + delta + ordem.length) % ordem.length;
      botoes.current.get(ordem[prox])?.focus();
    },
    [itens],
  );

  return (
    <div className="divide-y divide-line border-y border-line">
      {itens.map((item) => (
        <Linha
          key={item.id}
          item={item}
          aberto={aberto === item.id}
          reduzido={reduzido}
          nivel={nivel}
          idCabecalho={`${base}-h-${item.id}`}
          idPainel={`${base}-p-${item.id}`}
          refBotao={(n) => (n ? botoes.current.set(item.id, n) : botoes.current.delete(item.id))}
          alternar={() => setAberto((a) => (a === item.id ? null : item.id))}
          teclas={(e) => {
            const mapa: Record<string, () => void> = {
              ArrowDown: () => mover(item.id, 1),
              ArrowUp: () => mover(item.id, -1),
              Home: () => mover(item.id, 0, "inicio"),
              End: () => mover(item.id, 0, "fim"),
            };
            if (mapa[e.key]) {
              e.preventDefault();
              mapa[e.key]();
            }
          }}
        />
      ))}
    </div>
  );
}

function Linha(props: {
  item: ItemAcordeao;
  aberto: boolean;
  reduzido: boolean;
  nivel: number;
  idCabecalho: string;
  idPainel: string;
  refBotao: (n: HTMLButtonElement | null) => void;
  alternar: () => void;
  teclas: (e: React.KeyboardEvent) => void;
}) {
  const { item, aberto, reduzido } = props;
  const { ref, altura, pronto } = useAlturaAuto();

  useEffect(() => {
    const el = ref.current as (HTMLDivElement & { inert?: boolean }) | null;
    if (el) el.inert = !aberto;
  }, [ref, aberto]);

  return (
    <div>
      <div role="heading" aria-level={props.nivel}>
        <button
          ref={props.refBotao}
          id={props.idCabecalho}
          type="button"
          aria-expanded={aberto}
          aria-controls={props.idPainel}
          onClick={props.alternar}
          onKeyDown={props.teclas}
          className="group flex min-h-14 w-full cursor-pointer items-center gap-4 py-5 text-left"
        >
          <span className="flex-1 font-serif text-lg leading-snug text-navy-900 sm:text-xl">{item.titulo}</span>
          <span
            aria-hidden="true"
            className={`relative grid size-9 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
              aberto ? "border-teal-600 bg-teal-600 text-white" : "border-line text-teal-700 group-hover:border-teal-600"
            }`}
          >
            <m.svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              initial={false}
              animate={{ rotate: aberto ? 45 : 0 }}
              transition={reduzido ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 34 }}
            >
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </m.svg>
          </span>
        </button>
      </div>
      <m.div
        initial={false}
        animate={pronto ? { height: aberto ? altura : 0 } : {}}
        transition={reduzido ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 40, mass: 0.7 }}
        style={{ overflow: "hidden", height: pronto ? undefined : aberto ? "auto" : 0 }}
      >
        <div
          ref={ref}
          id={props.idPainel}
          role="region"
          aria-labelledby={props.idCabecalho}
          className="pb-6 pr-12 text-ink-soft"
        >
          <m.div
            initial={false}
            animate={{ opacity: aberto ? 1 : 0 }}
            transition={reduzido ? { duration: 0 } : { duration: aberto ? 0.25 : 0.12 }}
          >
            {item.conteudo}
          </m.div>
        </div>
      </m.div>
    </div>
  );
}
