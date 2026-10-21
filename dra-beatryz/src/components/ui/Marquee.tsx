/**
 * Faixa de texto em movimento lento, no padrão do Marquee da Magic UI (referência 21st.dev),
 * reescrita só com CSS. Pausa no hover; parada com prefers-reduced-motion.
 */
import { Fragment } from "react";
import { Estrela } from "../icons";

export function Marquee({ itens }: { itens: string[] }) {
  const grupo = (oculto: boolean) => (
    <ul
      aria-hidden={oculto || undefined}
      className="flex shrink-0 animate-marquee items-center gap-10 pr-10 [--gap:0px]"
    >
      {itens.map((t) => (
        <Fragment key={t}>
          <li className="whitespace-nowrap font-serif text-[1.35rem] italic text-rosa-profundo/90 md:text-2xl">{t}</li>
          <li aria-hidden className="text-rosa/70">
            <Estrela className="h-3.5 w-3.5" />
          </li>
        </Fragment>
      ))}
    </ul>
  );
  return (
    <div className="marquee-pausa relative flex overflow-hidden py-5 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      {grupo(false)}
      {grupo(true)}
    </div>
  );
}
