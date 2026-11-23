import Image from "next/image";
import type { CSSProperties } from "react";
import { Arrow } from "@/components/ui/primitives";

/**
 * Abertura em formato de campanha: a fotografia em luz dourada domina a tela
 * e o título em serifa ocupa o céu claro à esquerda. No celular, a foto vira
 * um retrato vertical e o texto desce para o off-white, sem disputar com o rosto.
 */
export function HomeHero() {
  return (
    <section aria-labelledby="hero-title" className="relative bg-[#ecedf2] lg:h-[100svh] lg:min-h-[720px]">
      <div className="relative h-[68svh] min-h-[440px] overflow-hidden lg:absolute lg:inset-0 lg:h-auto">
        <Image quality={90}
          src="/img/editorial/hero-pele.jpg"
          alt="Mulher de olhos fechados tocando o pescoço, com a pele lisa, em fundo claro"
          fill
          priority
          sizes="100vw"
          className="hero-image object-cover object-[64%_30%] lg:object-[12%_30%]"
        />
        {/* Véu claro para o título no desktop; escurecimento leve na base do mobile. */}
        <div aria-hidden="true" className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgb(236_237_242/0.85)_0%,rgb(236_237_242/0.4)_34%,transparent_55%)] lg:block" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_top,rgb(236_237_242)_0%,transparent_100%)] lg:hidden" />

        <p
          className="hero-fade eyebrow absolute right-5 top-1/2 hidden origin-right -translate-y-1/2 rotate-90 text-ink/45 lg:right-8 lg:block"
          style={{ "--d": "1400ms" } as CSSProperties}
        >
          Não+Pelo — Liberdade para sua pele
        </p>
      </div>

      <div className="container-x relative -mt-16 pb-14 lg:max-w-none lg:absolute lg:inset-x-0 lg:bottom-0 lg:top-0 lg:mt-0 lg:flex lg:flex-col lg:justify-center lg:pb-0">
        <div className="max-w-[46rem] lg:pt-16">
          <p className="hero-fade eyebrow flex items-center gap-3 text-ink/70" style={{ "--d": "200ms" } as CSSProperties}>
            <span className="plus-mark text-green-deep" aria-hidden="true" />
            Depilação · Tecnologia Sun&amp;Safe
          </p>

          <h1 id="hero-title" className="mt-6 text-display tracking-[-0.03em] text-ink">
            <span className="hero-line line-mask">
              <span style={{ "--i": 0 } as CSSProperties}>Liberdade,</span>
            </span>
            <span className="hero-line line-mask">
              <span style={{ "--i": 1 } as CSSProperties}>
                <em>na sua pele.</em>
              </span>
            </span>
          </h1>

          <p className="hero-fade mt-7 max-w-[26rem] text-[1.0625rem] leading-relaxed text-ink/75" style={{ "--d": "900ms" } as CSSProperties}>
            Depilação com a tecnologia exclusiva Sun&amp;Safe, para todos os tipos de pele — inclusive as bronzeadas. Em mais de 100 unidades
            pelo Brasil.
          </p>

          <div className="hero-fade mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4" style={{ "--d": "1050ms" } as CSSProperties}>
            <a href="#agendar" className="btn btn-green">
              <span>Agendar minha sessão</span>
              <Arrow />
            </a>
            <a href="#tecnologia" className="btn btn-outline-dark">
              <span>Conhecer a tecnologia</span>
            </a>
          </div>
        </div>
      </div>

      {/* Faixa inferior com os fatos publicados pela marca. */}
      <div className="container-x relative pb-10 lg:max-w-none lg:absolute lg:inset-x-0 lg:bottom-0 lg:pb-8">
        <div className="hero-rule h-px bg-ink/20 lg:bg-ink/25" />
        <ul className="hero-fade mt-5 grid gap-3 text-[0.8125rem] text-ink/70 sm:grid-cols-3 lg:max-w-[44rem]" style={{ "--d": "1300ms" } as CSSProperties}>
          <li className="flex items-center gap-3">
            <span className="eyebrow text-ink">01</span> Primeira sessão gratuita no cadastro
          </li>
          <li className="flex items-center gap-3">
            <span className="eyebrow text-ink">02</span> Atendemos peles bronzeadas
          </li>
          <li className="flex items-center gap-3">
            <span className="eyebrow text-ink">03</span> +100 unidades no Brasil
          </li>
        </ul>
      </div>
    </section>
  );
}
