/*
  Inspirado em "Infinite Text Marquee" (21st.dev). Implementação em CSS puro:
  transform contínuo, pausa fora da viewport e no hover, estático com reduced motion.
  Não é carrossel: é uma faixa de texto decorativa, sem conteúdo exclusivo.
*/
import { useInView } from "../../lib/useInView";
import { cn } from "../../lib/cn";

export function Marquee({ itens }: { itens: string[] }) {
  const [ref, visivel] = useInView<HTMLDivElement>("0px");
  const sequencia = (oculto: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={oculto || undefined}>
      {itens.map((t, i) => (
        <li key={i} className="flex items-center whitespace-nowrap">
          <span className="px-6 font-serif text-xl italic text-navy-900/80 sm:px-8 sm:text-2xl">{t}</span>
          <span className="size-1.5 rotate-45 bg-gold-400" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden border-y border-line bg-sand-200 py-5 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]",
        !visivel && "pausado",
      )}
    >
      <p className="sr-only">{itens.join(", ")}</p>
      <div className="marquee-trilho flex w-max hover:[animation-play-state:paused]" aria-hidden="true">
        {sequencia(false)}
        {sequencia(true)}
      </div>
    </div>
  );
}
