/**
 * Selo discreto "a confirmar" para dados que a clínica ainda não validou.
 * Some sozinho quando o dado é marcado como confirmado em src/config.ts.
 */
export function Confirmar({ mostrar = true, escuro = false, valor }: { mostrar?: boolean; escuro?: boolean; valor?: string }) {
  // se o próprio texto já é um placeholder "[... A CONFIRMAR]", o selo seria repetido
  if (!mostrar || valor?.includes("CONFIRMAR")) return null;
  return (
    <span
      className={`ml-2 inline-flex whitespace-nowrap translate-y-[-1px] items-center gap-1 rounded-full border border-dashed px-2 py-[1px] align-middle font-sans text-[0.66rem] font-semibold tracking-[0.08em] uppercase not-italic ${
        escuro ? "border-champanhe/60 text-champanhe" : "border-vinho/45 text-vinho"
      }`}
      title="Informação a confirmar com a clínica"
    >
      a confirmar
    </span>
  );
}
