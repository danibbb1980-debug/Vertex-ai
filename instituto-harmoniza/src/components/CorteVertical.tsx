/**
 * Título com revelação em "corte vertical", palavra por palavra.
 *
 * Adaptado do componente "Vertical Cut Reveal" (21st.dev, cnippet-dev): mantém
 * a ideia de máscara por palavra, texto acessível em sr-only e escalonamento
 * configurável, mas troca a mola do motion por uma animação CSS. Assim o título
 * já vem pronto no HTML pré-renderizado, anima desde o primeiro quadro (bom para
 * LCP), funciona sem JavaScript e fica estático com prefers-reduced-motion.
 *
 * Marque a palavra em itálico com asteriscos: "Cuidado que respeita a *harmonia*".
 */
type Props = {
  texto: string;
  como?: "h1" | "h2";
  className?: string;
  escalonarDe?: "inicio" | "centro" | "fim";
  /** atraso inicial extra, em passos de 75 ms */
  deslocamento?: number;
};

export function CorteVertical({ texto, como: Tag = "h1", className = "", escalonarDe = "inicio", deslocamento = 0 }: Props) {
  const palavras = texto.split(" ").map((p) => {
    const italico = p.startsWith("*");
    const limpa = p.replace(/\*/g, "");
    // pontuação colada ao itálico fica fora do <em>
    const m = /^(.*?)([.,;:!?]*)$/.exec(limpa)!;
    return { palavra: m[1], pontuacao: m[2], italico };
  });
  const total = palavras.length;
  const ordem = (i: number) =>
    escalonarDe === "fim" ? total - 1 - i : escalonarDe === "centro" ? Math.abs(Math.floor(total / 2) - i) : i;

  return (
    <Tag className={className}>
      <span className="sr-only">{texto.replace(/\*/g, "")}</span>
      <span aria-hidden="true">
        {palavras.map((p, i) => (
          <span key={i}>
            <span className="corte-palavra">
              <span style={{ ["--i" as string]: ordem(i) + deslocamento }}>
                {p.italico ? <em>{p.palavra}</em> : p.palavra}
                {p.pontuacao}
              </span>
            </span>
            {i < total - 1 ? " " : null}
          </span>
        ))}
      </span>
    </Tag>
  );
}
