import { CONFIG, croTexto, whatsappLink } from "../config";

/**
 * Título revelado palavra a palavra por máscara vertical.
 * Adaptado do "Vertical Cut Reveal" (21st.dev), em CSS puro para pintar antes do JavaScript.
 */
function CutReveal({ words, delay = 0.1 }: { words: { t: string; em?: boolean }[]; delay?: number }) {
  return (
    <>
      <span className="sr-only">{words.map((w) => w.t).join(" ")}</span>
      <span aria-hidden className="flex flex-wrap">
        {words.map((w, i) => (
          <span key={i} className="cut-word inline-flex overflow-hidden pb-[0.12em] -mb-[0.12em]">
            <span className={`inline-block ${w.em ? "font-[300] italic text-rose" : ""}`} style={{ animationDelay: `${delay + i * 0.07}s` }}>
              {w.t}
            </span>
            {i < words.length - 1 && <span>&nbsp;</span>}
          </span>
        ))}
      </span>
    </>
  );
}

export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-titulo"
      className={`bg-noite relative overflow-hidden text-perola-claro ${CONFIG.rascunho ? "pt-[7rem]" : "pt-[5rem]"} pb-14 lg:flex lg:min-h-[min(100svh,48rem)] lg:items-center lg:pb-14 lg:pt-[7.5rem]`}
    >
      {/* Luz ambiente fria, como a do consultório na foto */}
      <div aria-hidden className="pointer-events-none absolute -right-[10rem] -top-[14rem] h-[46rem] w-[46rem] rounded-full bg-[radial-gradient(closest-side,rgba(64,86,128,0.55),rgba(17,26,43,0))]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-[18rem] -left-[14rem] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgba(230,201,190,0.12),rgba(17,26,43,0))]" />

      <div className="container-site relative grid items-center gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-20">
        <figure className="relative mx-auto w-full max-w-[24rem] lg:order-last lg:max-w-[25.5rem]">
          {/* Moldura fina fixa + feixe de luz que a percorre uma vez */}
          <div aria-hidden className="absolute -inset-[9px] rounded-t-[999px] rounded-b-[1.9rem] border border-champagne-claro/25" />
          <div aria-hidden className="moldura-feixe absolute -inset-[9px] rounded-t-[999px] rounded-b-[1.9rem]" />
          <div className="relative h-[12.5rem] overflow-hidden rounded-t-[999px] rounded-b-[1.5rem] bg-noite-2 sm:h-[19rem] lg:aspect-[5/7] lg:h-auto">
            <img
              src={CONFIG.fotos.retrato}
              srcSet={CONFIG.fotos.retratoSrcSet}
              sizes="(min-width: 1024px) 408px, min(384px, calc(100vw - 40px))"
              alt={`${CONFIG.nome}, de blazer azul-marinho, sorrindo`}
              width={1015}
              height={1726}
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover object-[50%_42%]"
            />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-noite/80 to-transparent" />
            {/* CONFIRMAR COM A DOUTORA: número do CRO */}
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-5 pb-4 lg:px-6 lg:pb-5">
              <span className="font-display text-[1.05rem] italic text-perola-claro lg:text-xl">{CONFIG.nome}</span>
              <span className="text-[0.72rem] text-perola-claro/70">{croTexto}</span>
            </figcaption>
          </div>
        </figure>

        <div>
          <p className="hero-fade eyebrow flex items-center gap-3 !tracking-[0.18em] text-champagne-claro/85 sm:!tracking-[0.24em]">
            <span aria-hidden className="h-px w-8 shrink-0 bg-champagne-claro/50" />
            Estética dental em Poços de Caldas
          </p>

          <h1 id="hero-titulo" className="mt-5 text-[2.6rem] leading-[1.03] text-perola-claro sm:text-6xl lg:mt-7 lg:text-[5.4rem]">
            <CutReveal
              words={[
                { t: "Um" },
                { t: "sorriso" },
                { t: "em" },
                { t: "harmonia", em: true },
                { t: "com" },
                { t: "você." },
              ]}
            />
          </h1>

          <p className="hero-fade mt-5 max-w-[34rem] text-[1.05rem] text-perola-claro/75 sm:text-xl lg:mt-7" style={{ animationDelay: "0.45s" }}>
            Estética natural, planejada para combinar com o seu rosto.
          </p>

          <div className="hero-fade mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7 lg:mt-10" style={{ animationDelay: "0.55s" }}>
            <a
              href="#agendar"
              className="inline-flex min-h-[3.25rem] items-center justify-center rounded-full bg-champagne-claro px-8 text-[0.98rem] font-medium text-noite transition-[background-color,transform] duration-300 hover:-translate-y-px hover:bg-perola-claro"
            >
              Agendar minha avaliação
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="link-sublinhado self-center pb-0.5 text-[0.92rem] text-perola-claro/80 hover:text-perola-claro sm:self-auto"
            >
              Ou fale direto no WhatsApp
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
