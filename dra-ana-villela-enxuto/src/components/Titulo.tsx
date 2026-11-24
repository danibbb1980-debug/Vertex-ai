/** Título revelado linha a linha ao entrar na tela (palavras sobem de uma máscara). */
export function Titulo({
  id,
  partes,
  className = "",
}: {
  id: string;
  partes: { t: string; em?: boolean }[];
  className?: string;
}) {
  const palavras = partes.flatMap((p) => p.t.split(" ").map((t) => ({ t, em: p.em })));
  return (
    <h2 id={id} data-reveal="palavras" className={className}>
      <span className="sr-only">{partes.map((p) => p.t).join(" ")}</span>
      <span aria-hidden>
        {palavras.map((w, i) => (
          <span key={i} className="rw inline-flex overflow-hidden pb-[0.12em] -mb-[0.12em] align-top">
            <span className={w.em ? "font-[300] italic" : ""} style={{ ["--i" as string]: i }}>
              {w.t}
              {i < palavras.length - 1 ? "\u00a0" : ""}
            </span>
          </span>
        ))}
      </span>
    </h2>
  );
}
