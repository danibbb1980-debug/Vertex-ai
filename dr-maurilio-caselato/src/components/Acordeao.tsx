import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";

type Item = { titulo: ReactNode; conteudo: ReactNode; prefixo?: ReactNode };

/** Acordeão acessível (botão com aria-expanded + região rotulada). Vários podem ficar abertos. */
export function Acordeao({
  itens,
  nivel = 3,
  className = "",
  abertoInicial = -1,
}: {
  itens: Item[];
  nivel?: 2 | 3 | 4;
  className?: string;
  abertoInicial?: number;
}) {
  const base = useId();
  const [abertos, setAbertos] = useState<Set<number>>(() => new Set(abertoInicial >= 0 ? [abertoInicial] : []));
  const reduz = useReducedMotion();
  const H = `h${nivel}` as "h2" | "h3" | "h4";

  const alternar = (i: number) =>
    setAbertos((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  return (
    <LazyMotion features={domAnimation} strict>
    <div className={`acordeao ${className}`}>
      {itens.map((it, i) => {
        const aberto = abertos.has(i);
        const idBtn = `${base}-b${i}`;
        const idPainel = `${base}-p${i}`;
        return (
          <div className={`acordeao-item ${aberto ? "is-aberto" : ""}`} key={i}>
            <H className="acordeao-cab">
              <button
                type="button"
                id={idBtn}
                aria-expanded={aberto}
                aria-controls={idPainel}
                onClick={() => alternar(i)}
                className="acordeao-btn"
              >
                {it.prefixo && <span className="acordeao-prefixo" aria-hidden="true">{it.prefixo}</span>}
                <span className="acordeao-titulo">{it.titulo}</span>
                <span className="acordeao-icone" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" strokeWidth="1" />
                    <path className="v" d="M12 1v22" stroke="currentColor" strokeWidth="1" />
                    <path d="M1 12h22" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </span>
              </button>
            </H>
            <AnimatePresence initial={false}>
              {aberto && (
                <m.div
                  id={idPainel}
                  role="region"
                  aria-labelledby={idBtn}
                  className="acordeao-painel"
                  initial={reduz ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduz ? { opacity: 0, height: 0, transition: { duration: 0 } } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <div className="acordeao-conteudo">{it.conteudo}</div>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
    </LazyMotion>
  );
}
