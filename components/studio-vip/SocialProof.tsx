import { studio } from "@/lib/studio-vip";
import { Stars } from "./ui";

const words = [
  "Treino personalizado",
  "Treinamento funcional",
  "Acompanhamento próximo",
  "Horários flexíveis",
  "Ambiente acolhedor",
  "Orientação nutricional",
];

/**
 * Faixa entre o hero e o conteúdo: a reputação no Google à esquerda e os
 * diferenciais rolando em loop. A lista é duplicada só para o loop ser
 * contínuo; a cópia é escondida de leitores de tela.
 */
export function SocialProof() {
  return (
    <section
      aria-label="Reputação e diferenciais"
      className="relative z-10 bg-vip-green text-vip-graphite"
    >
      <div className="flex flex-col items-stretch sm:flex-row">
        <a
          href={studio.links.maps}
          target="_blank"
          rel="noopener noreferrer"
          data-track="google"
          data-track-label="faixa"
          className="flex shrink-0 items-center justify-center gap-3 bg-vip-graphite px-6 py-4 text-white sm:justify-start"
        >
          <Stars className="size-4" />
          <span className="text-sm font-semibold whitespace-nowrap">
            <strong className="font-bold">{studio.rating.value}</strong> no Google ·{" "}
            {studio.rating.count} avaliações
          </span>
        </a>

        <div className="relative flex-1 overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
          <div className="vip-marquee">
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
                {words.map((word) => (
                  <li
                    key={word}
                    className="flex items-center gap-6 pr-6 font-vip-display text-xl font-extrabold whitespace-nowrap uppercase italic"
                  >
                    {word}
                    <span className="size-2 rotate-45 bg-vip-graphite" aria-hidden="true" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
