/*
  Adaptado de "Vertical Cut Reveal" (21st.dev, @cnippet-dev): cada palavra sobe
  de dentro de uma máscara, em sequência.
  Mudanças: animação em CSS puro (funciona já no HTML pré-renderizado, sem esperar
  o JavaScript), só transform, palavras com *asterisco* viram a ênfase em itálico
  da marca, e o texto fica no DOM uma única vez. Com reduced motion, aparece pronto.
*/
import { Fragment } from "react";
import { cn } from "../../lib/cn";

type Props = {
  children: string;
  className?: string;
  atraso?: number;
  intervalo?: number;
  as?: "h1" | "h2" | "p";
  id?: string;
};

export function TextoRevelado({ children, className, atraso = 0.1, intervalo = 0.07, as = "h1", id }: Props) {
  const palavras = children.split(" ").map((p) => {
    const enfase = /^\*.*\*[.,!?]?$/.test(p);
    return {
      texto: enfase ? p.replace(/^\*(.*)\*.*$/, "$1") : p,
      enfase,
      pontuacao: enfase ? p.replace(/^\*.*\*/, "") : "",
    };
  });
  const Tag = as;

  return (
    <Tag id={id} className={className}>
      {palavras.map((p, i) => (
        <Fragment key={i}>
          <span className="-mb-[0.12em] inline-flex overflow-hidden pb-[0.12em] align-top">
            <span
              className={cn("revelar-palavra inline-block", p.enfase && "enfase text-teal-300")}
              style={{ animationDelay: `${atraso + i * intervalo}s` }}
            >
              {p.texto}
              {p.pontuacao && <span className="not-italic text-white">{p.pontuacao}</span>}
            </span>
          </span>
          {i < palavras.length - 1 && " "}
        </Fragment>
      ))}
    </Tag>
  );
}
