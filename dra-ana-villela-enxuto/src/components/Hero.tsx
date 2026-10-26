import { CONFIG, croTexto, whatsappLink } from "../config";
import { Button } from "./Button";
import { IconWhatsapp } from "./Icons";

/**
 * Título com revelação palavra a palavra por máscara vertical.
 * Adaptado do "Vertical Cut Reveal" (21st.dev), reescrito em CSS puro para pintar antes do JavaScript.
 */
function CutReveal({ words, delay = 0.1 }: { words: { t: string; em?: boolean }[]; delay?: number }) {
  return (
    <>
      <span className="sr-only">{words.map((w) => w.t).join(" ")}</span>
      <span aria-hidden className="flex flex-wrap">
        {words.map((w, i) => (
          <span key={i} className="cut-word inline-flex overflow-hidden pb-[0.1em] -mb-[0.1em]">
            <span className={`inline-block ${w.em ? "font-[300] italic text-rose-ink" : ""}`} style={{ animationDelay: `${delay + i * 0.07}s` }}>
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
      className={`relative overflow-hidden ${CONFIG.rascunho ? "pt-[7rem]" : "pt-[5rem]"} pb-14 lg:flex lg:min-h-[min(100svh,46rem)] lg:items-center lg:pb-12 lg:pt-[7.5rem]`}
    >
      <div aria-hidden className="pointer-events-none absolute -right-[16rem] -top-[12rem] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(closest-side,rgba(233,211,203,0.6),rgba(250,247,242,0))]" />

      <div className="container-site relative grid items-center gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <figure className="hero-fade relative mx-auto w-full max-w-[24rem] lg:order-last lg:max-w-[25rem]" style={{ animationDelay: "0.2s" }}>
          <div aria-hidden className="absolute -inset-2.5 hidden translate-x-4 translate-y-4 rounded-t-[999px] rounded-b-[1.75rem] border border-champagne/70 lg:block" />
          <div className="relative h-[13.5rem] overflow-hidden rounded-t-[999px] rounded-b-[1.5rem] bg-porcelana-2 sm:h-[18rem] lg:aspect-[5/7] lg:h-auto">
            <img
              src={CONFIG.fotos.retrato}
              srcSet={CONFIG.fotos.retratoSrcSet}
              sizes="(min-width: 1024px) 400px, min(384px, calc(100vw - 40px))"
              alt={`${CONFIG.nome}, de blazer azul-marinho, sorrindo`}
              width={1015}
              height={1726}
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover object-[50%_42%]"
            />
          </div>
        </figure>

        <div>
          <p className="hero-fade eyebrow flex items-center gap-3 !tracking-[0.16em] text-rose-ink sm:!tracking-[0.22em]">
            <span aria-hidden className="h-px w-8 shrink-0 bg-rose-ink/50" />
            Estética dental em Poços de Caldas
          </p>

          <h1 id="hero-titulo" className="mt-4 text-[2.55rem] leading-[1.04] text-tinta sm:text-6xl lg:mt-6 lg:text-[5.2rem]">
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

          <p className="hero-fade mt-4 max-w-[36rem] text-[1.05rem] text-grafite sm:text-xl lg:mt-6" style={{ animationDelay: "0.45s" }}>
            Estética natural, planejada para combinar com o seu rosto.
          </p>

          <div className="hero-fade mt-6 flex flex-col gap-4 sm:flex-row sm:items-center lg:mt-9" style={{ animationDelay: "0.55s" }}>
            <Button href={whatsappLink()} external>
              <IconWhatsapp width={18} height={18} />
              Agendar minha avaliação
            </Button>
            {/* CONFIRMAR COM A DOUTORA: número do CRO */}
            <p className="text-center text-[0.82rem] text-grafite sm:text-left">
              {CONFIG.nome} · {croTexto}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
