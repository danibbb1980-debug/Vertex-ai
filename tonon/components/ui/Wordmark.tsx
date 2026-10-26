type Props = { tone?: "light" | "dark"; className?: string };

/**
 * Assinatura tipográfica provisória do Laboratório Tonon: o nome na serifa
 * editorial e "Laboratório" em versalete fino. Não reproduz o logotipo
 * oficial — troque por ele (SVG) quando o arquivo vetorial estiver disponível.
 */
export function Wordmark({ tone = "dark", className = "" }: Props) {
  const color = tone === "light" ? "text-paper" : "text-graphite";
  return (
    <span className={`inline-flex flex-col items-start leading-none ${color} ${className}`}>
      <span className="font-serif text-[1.6rem] tracking-[0.16em] uppercase">Tonon</span>{" "}
      <span className="mt-1 pl-[0.1em] text-[0.55rem] font-semibold tracking-[0.5em] uppercase opacity-70">
        Laboratório
      </span>
    </span>
  );
}
