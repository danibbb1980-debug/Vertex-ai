import type { CSSProperties, ReactNode } from "react";

/**
 * Adaptado do componente "Text Reveal" (21st.dev, cnippet-dev): revelação palavra a palavra.
 * Aqui sem blur (sem filtros), com máscara por palavra e movimento lento e curto,
 * feito em CSS puro (só transform) para não pesar no carregamento.
 * Uma palavra marcada com *asteriscos* vira itálico.
 */
export function TituloRevelado({
  texto,
  as: Tag = "h1",
  className,
  atraso = 350,
}: {
  texto: string;
  as?: "h1" | "h2";
  className?: string;
  atraso?: number;
}) {
  const partes = texto.split(/(\s+)/);
  const limpo = texto.replace(/\*/g, "");
  let k = 0;

  const palavra = (p: string): ReactNode => {
    const enfase = /^\*(.+)\*([.,;:!?]?)$/.exec(p);
    if (enfase)
      return (
        <>
          <em>{enfase[1]}</em>
          {enfase[2]}
        </>
      );
    return p;
  };

  return (
    <Tag className={className} aria-label={limpo}>
      {partes.map((p, i) =>
        /\s+/.test(p) ? (
          " "
        ) : (
          <span key={i} aria-hidden="true" className="revela">
            <span style={{ "--atraso": `${atraso + k++ * 70}ms` } as CSSProperties}>{palavra(p)}</span>
          </span>
        ),
      )}
    </Tag>
  );
}
