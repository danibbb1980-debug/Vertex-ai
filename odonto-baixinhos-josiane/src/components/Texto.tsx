import { Fragment, type ElementType, type ReactNode } from "react";

/** Converte "Duas portas, um *endereço*" em texto com <em> na palavra marcada. */
export function enfase(texto: string): ReactNode {
  return texto.split(/(\*[^*]+\*)/g).map((parte, i) =>
    parte.startsWith("*") ? <em key={i}>{parte.slice(1, -1)}</em> : <Fragment key={i}>{parte}</Fragment>,
  );
}

/** Título que entra palavra por palavra (desfoque → nítido). */
export function TituloRevelado({ texto, como: Tag = "h1", className }: { texto: string; como?: ElementType; className?: string }) {
  // "|" separa linhas fixas: o título quebra igual com a fonte final e com a fonte reserva (sem CLS)
  let i = 0;
  const linhas = texto.split("|");
  return (
    <Tag className={className}>
      {linhas.map((linha, li) => (
        <span key={li} className="block whitespace-nowrap">
          {linha.split(/(\*[^*]+\*)/g).filter(Boolean).map((parte, pi) => {
        const ehEnfase = parte.startsWith("*");
        const limpo = ehEnfase ? parte.slice(1, -1) : parte;
        const palavras = limpo.split(/(\s+)/);
        const conteudo = palavras.map((p, wi) =>
          /^\s+$/.test(p) || p === "" ? (
            p
          ) : (
            <span key={wi} className="palavra" style={{ "--i": i++ } as React.CSSProperties}>
              {p}
            </span>
          ),
        );
        return ehEnfase ? <em key={pi}>{conteudo}</em> : <Fragment key={pi}>{conteudo}</Fragment>;
          })}
          {li < linhas.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}

export function Cabecalho({
  eyebrow,
  titulo,
  texto,
  centro,
  id,
  className = "",
}: {
  id?: string;
  eyebrow: string;
  titulo: string;
  texto?: ReactNode;
  centro?: boolean;
  className?: string;
}) {
  return (
    <div className={`revela ${centro ? "mx-auto text-center" : ""} max-w-2xl ${className}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="mt-4 text-[2.15rem] leading-[1.06] sm:text-5xl md:text-[3.4rem]">{enfase(titulo)}</h2>
      {texto ? <div className="mt-5 text-[1.05rem] leading-relaxed text-tinta-2 md:text-lg">{texto}</div> : null}
    </div>
  );
}
