import { Fragment, type CSSProperties } from "react";

/**
 * Adaptado do componente "Text Reveal" (21st.dev, @kuratlielia).
 * Mudanças: sem blur (só transform e opacity), suporte a uma palavra em ênfase com *asteriscos*,
 * estilos em index.css (.tr-clip / .tr-palavra) e versão estática com prefers-reduced-motion.
 * A animação roda em CSS: começa no primeiro paint e nunca deixa o texto escondido se o JS atrasar.
 */
type Props = {
  texto: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  id?: string;
  atraso?: number;
};

const PASSO_MAX = 0.07;
const STAGGER_TOTAL = 0.6;

export function TextReveal({ texto, as: Tag = "h2", className, id, atraso = 0 }: Props) {
  const palavras = texto.split(" ").filter(Boolean);
  const passo = Math.min(PASSO_MAX, STAGGER_TOTAL / Math.max(palavras.length, 1));
  let dentroEnfase = false;
  const limpo = texto.replace(/\*/g, "");

  return (
    <Tag id={id} className={className} aria-label={limpo}>
      {palavras.map((bruta, i) => {
        const abre = bruta.startsWith("*");
        const fecha = bruta.replace(/[.,!?]+$/, "").endsWith("*");
        if (abre) dentroEnfase = true;
        const enfase = dentroEnfase;
        if (fecha) dentroEnfase = false;
        const palavra = bruta.replace(/\*/g, "");
        return (
          <Fragment key={`${palavra}-${i}`}>
            <span className="tr-clip" aria-hidden="true">
              <span
                className={`tr-palavra${enfase ? " enfase" : ""}`}
                style={{ "--tr-atraso": `${atraso + i * passo}s` } as CSSProperties}
              >
                {palavra}
              </span>
            </span>
            {i < palavras.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </Tag>
  );
}

/** Título com uma palavra em ênfase (*palavra*), sem animação de entrada. */
export function TituloEnfase({ texto }: { texto: string }) {
  const partes = texto.split(/(\*[^*]+\*)/g);
  return (
    <>
      {partes.map((p, i) =>
        p.startsWith("*") ? (
          <em key={i} className="enfase">
            {p.slice(1, -1)}
          </em>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}
