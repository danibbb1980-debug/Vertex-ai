import { CONFIG, croTexto, whatsappLink } from "../config";
import { MagneticButton } from "./MagneticButton";
import { IconArrow, IconWhatsapp } from "./Icons";

/** Linha do título revelada por máscara (CSS puro, roda já na primeira pintura). */
function Line({ children, i }: { children: React.ReactNode; i: number }) {
  return (
    <span className="hero-line block overflow-hidden pb-[0.12em] -mb-[0.12em]">
      <span className="block" style={{ animationDelay: `${0.15 + i * 0.12}s` }}>
        {children}
      </span>
    </span>
  );
}

const fade = (d: number) => ({ className: "hero-fade", style: { animationDelay: `${d}s` } });

export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-titulo"
      className={`relative overflow-hidden ${CONFIG.rascunho ? "pt-[8.5rem]" : "pt-[6.5rem]"} pb-20 lg:pb-28`}
    >
      {/* Composição abstrata: halos perolados */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-[18rem] -top-[10rem] h-[44rem] w-[44rem] rounded-full bg-[radial-gradient(closest-side,rgba(233,211,203,0.65),rgba(250,247,242,0))]" />
        <div className="absolute -left-[12rem] bottom-[-14rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgba(221,210,193,0.5),rgba(250,247,242,0))]" />
      </div>

      <div className="container-site relative grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
        <div className="pt-6 lg:pt-10">
          <p {...fade(0.05)}>
            <span className="eyebrow flex items-center gap-3 !tracking-[0.16em] text-rose-ink sm:!tracking-[0.22em]">
              <span aria-hidden className="h-px w-8 shrink-0 bg-rose-ink/50" />
              Estética dental em Poços de Caldas
            </span>
          </p>

          <h1 id="hero-titulo" className="mt-7 text-[2.7rem] leading-[1.04] text-tinta sm:text-7xl lg:text-[5.6rem]">
            <Line i={0}>Um sorriso em</Line>
            <Line i={1}>
              <em className="font-[300] text-rose-ink">harmonia</em> com você.
            </Line>
          </h1>

          <p {...fade(0.55)}>
            <span className="mt-8 block max-w-[34rem] text-lg text-grafite sm:text-xl">
              Avaliação estética personalizada, com planejamento e explicações claras em cada etapa.
            </span>
          </p>

          <div {...fade(0.7)}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <MagneticButton href={whatsappLink()} external>
                <IconWhatsapp width={18} height={18} />
                Agendar minha avaliação
              </MagneticButton>
              <MagneticButton href="#tratamentos" variant="outline">
                Conhecer os tratamentos
                <IconArrow width={18} height={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </MagneticButton>
            </div>
          </div>

          <dl {...fade(0.85)} className="hero-fade mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-tinta/10 pt-6 text-sm">
            <div>
              <dt className="eyebrow text-grafite !text-[0.62rem]">Profissional</dt>
              <dd className="mt-1 text-tinta">{CONFIG.nome} · {CONFIG.profissao}</dd>
            </div>
            <div>
              <dt className="eyebrow text-grafite !text-[0.62rem]">Registro</dt>
              {/* CONFIRMAR COM A DOUTORA: número do CRO */}
              <dd className="mt-1 text-tinta">{croTexto}</dd>
            </div>
          </dl>
        </div>

        <figure className="hero-photo relative mx-auto w-full max-w-[22rem] lg:max-w-[25rem]">
          <div aria-hidden className="absolute -inset-3 translate-x-4 translate-y-4 rounded-t-[999px] rounded-b-[1.75rem] border border-champagne/70" />
          <div className="relative aspect-[5/8] overflow-hidden rounded-t-[999px] rounded-b-[1.75rem] bg-porcelana-2">
            <img
              src={CONFIG.fotos.retrato}
              srcSet={CONFIG.fotos.retratoSrcSet}
              sizes="(min-width: 1024px) 400px, min(352px, calc(100vw - 40px))"
              alt={`${CONFIG.nome}, de blazer azul-marinho, sorrindo`}
              width={1015}
              height={1726}
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover object-[50%_42%]"
            />
          </div>
          <figcaption className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-tinta/10 bg-porcelana px-5 py-2.5 text-center shadow-[0_10px_30px_-18px_rgba(27,37,54,0.45)]">
            <span className="font-display text-[1.05rem] italic text-tinta">{CONFIG.nome}</span>
            <span className="mx-2 text-champagne" aria-hidden>·</span>
            <span className="eyebrow !text-[0.6rem] text-grafite">{croTexto}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export function Marquee() {
  const items = [
    "Lentes em resina",
    "Lentes em porcelana",
    "Clareamento dental",
    "Alinhadores transparentes",
    "Avaliação estética personalizada",
  ];
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((t) => (
        <li key={t} className="flex items-center whitespace-nowrap px-7 font-display text-2xl italic text-tinta/70 sm:text-3xl">
          {t}
          <span aria-hidden className="ml-14 inline-block h-1.5 w-1.5 rotate-45 bg-rose-2" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="relative overflow-hidden border-y border-tinta/8 py-6" aria-label="Tratamentos oferecidos" role="region">
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
