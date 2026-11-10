import type { CSSProperties, ReactNode } from "react";

/**
 * Título revelado palavra por palavra (adaptação do componente "Vertical Cut Reveal"
 * do 21st.dev para CSS puro: cada palavra sobe de uma máscara, com atraso escalonado).
 * Use *palavra* para a ênfase em itálico.
 */
export function RevelaTexto({ texto, className = "", inicio = 0 }: { texto: string; className?: string; inicio?: number }) {
  const palavras = texto.split(" ");
  const nodes: ReactNode[] = [];
  palavras.forEach((p, i) => {
    const enfase = /^\*.*\*[.,!?]?$/.test(p);
    const limpa = p.replace(/\*/g, "");
    const conteudo = enfase ? (
      <em>
        {limpa.replace(/[.,!?]$/, "")}
      </em>
    ) : (
      limpa
    );
    const pont = enfase && /[.,!?]$/.test(limpa) ? limpa.slice(-1) : "";
    nodes.push(
      <span key={i} className="corte-palavra" aria-hidden="true">
        <span style={{ "--i": i + inicio } as CSSProperties}>
          {conteudo}
          {pont}
        </span>
      </span>,
      i < palavras.length - 1 ? " " : null,
    );
  });
  return (
    <span className={className}>
      <span className="sr-only">{texto.replace(/\*/g, "")}</span>
      {nodes}
    </span>
  );
}
