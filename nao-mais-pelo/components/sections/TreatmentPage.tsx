import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { FirstSession } from "@/components/sections/HomeSections";
import { BodyMap } from "@/components/ui/BodyMap";
import { Arrow, Eyebrow, Reveal, RevealTitle } from "@/components/ui/primitives";
import { StickyCta } from "@/components/ui/StickyCta";
import { differentials, type Gender } from "@/lib/site";

const content = {
  feminino: {
    kicker: "Depilação para",
    title: ["todas as", "mulheres."],
    hero: {
      src: "/img/tecnologia/sessao-pernas.jpg",
      alt: "Profissional da Não+Pelo realizando sessão de depilação nas pernas de uma cliente",
      position: "object-[45%_50%]",
    },
    second: {
      src: "/img/editorial/tons-de-pele.jpg",
      alt: "Quatro mulheres de diferentes tons de pele sorrindo juntas",
      position: "object-[50%_40%]",
    },
    other: { href: "/depilacao-masculina", label: "Depilação masculina" },
  },
  masculino: {
    kicker: "Depilação para",
    title: ["todos os", "homens."],
    hero: {
      src: "/img/editorial/masculino-sol.jpg",
      alt: "Homem sem camisa sob um guarda-sol de palha na praia",
      position: "object-[60%_30%]",
    },
    second: {
      src: "/img/editorial/retratos-masculinos.jpg",
      alt: "Retratos aproximados de homens com diferentes tons de pele",
      position: "object-[50%_40%]",
    },
    other: { href: "/depilacao-feminina", label: "Depilação feminina" },
  },
} as const;

/** Modelo das páginas de depilação feminina e masculina (mesma estrutura do site original). */
export function TreatmentPage({ gender }: { gender: Gender }) {
  const c = content[gender];
  return (
    <>
      <Header over="none" />
      <main id="conteudo">
        {/* Hero editorial dividido: título em serifa e fotografia em altura total. */}
        <section aria-labelledby="pagina-titulo" className="bg-bone pt-24 md:pt-28 lg:pt-0">
          <div className="grid lg:min-h-[100svh] lg:grid-cols-12">
            <div className="container-x flex flex-col justify-end pb-12 pt-10 lg:col-span-6 lg:max-w-none lg:pb-20 lg:pl-16 lg:pt-40 xl:pl-24">
              <p className="hero-fade eyebrow flex items-center gap-3 text-stone" style={{ "--d": "150ms" } as CSSProperties}>
                <span className="plus-mark text-gold-deep" aria-hidden="true" />
                Depilação {gender === "feminino" ? "feminina" : "masculina"}
              </p>
              <h1 id="pagina-titulo" className="mt-8 text-[clamp(3.2rem,7.4vw,7.75rem)] leading-[0.92] tracking-[-0.03em]">
                <span className="hero-line line-mask">
                  <span style={{ "--i": 0 } as CSSProperties}>{c.kicker}</span>
                </span>
                <span className="hero-line line-mask">
                  <span style={{ "--i": 1 } as CSSProperties}>{c.title[0]}</span>
                </span>
                <span className="hero-line line-mask">
                  <span style={{ "--i": 2 } as CSSProperties}>
                    <em>{c.title[1]}</em>
                  </span>
                </span>
              </h1>
              <div className="hero-fade mt-10 grid gap-6 lg:max-w-xl" style={{ "--d": "800ms" } as CSSProperties}>
                <p className="text-[1.0625rem] leading-relaxed text-ink/80">
                  Uma técnica inovadora e exclusiva que une as melhores tecnologias de depilação: o <strong className="font-medium">Sun&amp;Safe</strong>.
                  Ideal para todos os tipos de pele, inclusive as bronzeadas, com a tecnologia SubZero e filtros especiais e exclusivos de safira
                  em sua ponteira.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <a href="#agendar" className="btn btn-solid-dark">
                    <span>Agendar minha sessão</span>
                    <Arrow />
                  </a>
                  <a href="#areas" className="btn btn-outline-dark">
                    <span>Ver as áreas</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="relative h-[62svh] overflow-hidden lg:col-span-6 lg:h-auto">
              <Image src={c.hero.src} alt={c.hero.alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className={`hero-image object-cover ${c.hero.position} saturate-[0.85]`} />
            </div>
          </div>
        </section>

        {/* Áreas atendidas, com o mapa travado no público da página. */}
        <section id="areas" aria-labelledby="areas-title" className="grain relative bg-ink py-24 text-bone md:py-36">
          <div className="container-x">
            <div className="mb-16 grid gap-8 md:mb-24 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <Reveal>
                  <Eyebrow index="01" className="text-mist">
                    Áreas atendidas
                  </Eyebrow>
                </Reveal>
                <RevealTitle
                  className="mt-10 text-headline tracking-[-0.025em]"
                  lines={[<span key="a" id="areas-title">Escolha a área</span>, <em key="b" className="text-gold">e conheça o tratamento.</em>]}
                />
              </div>
            </div>
            <BodyMap initialGender={gender} lockGender tone="dark" />
          </div>
        </section>

        {/* Diferenciais com fotografia lateral. */}
        <section aria-labelledby="dif-title" className="bg-paper py-24 md:py-36">
          <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <Reveal>
                <Eyebrow index="02" className="text-stone">
                  Diferenciais
                </Eyebrow>
              </Reveal>
              <RevealTitle
                className="mt-10 text-title tracking-[-0.02em] md:text-[clamp(2.4rem,4vw,4rem)]"
                lines={[<span key="a" id="dif-title">Depilação para os mais</span>, <>variados tipos</>, <em key="c">de peles e pelos.</em>]}
              />
              <Reveal kind="image" delay={120} className="relative mt-12 aspect-[4/5] overflow-hidden">
                <Image src={c.second.src} alt={c.second.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className={`object-cover ${c.second.position}`} />
              </Reveal>
            </div>
            <dl className="grid self-start content-start gap-px bg-ink/12 sm:grid-cols-2 lg:col-span-6 lg:col-start-7 lg:mt-48">
              {differentials.map((d, i) => (
                <Reveal key={d.title} delay={i * 90} className="bg-paper p-0 py-10 sm:p-8 sm:first:pl-0 lg:p-10">
                  <dt>
                    <span className="eyebrow text-gold-deep">0{i + 1}</span>
                    <span className="mt-4 block font-display text-[1.9rem] leading-tight">{d.title}</span>
                  </dt>
                  <dd className="mt-4 text-[0.9375rem] leading-relaxed text-stone">{d.text}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>

        <FirstSession index="03" />

        <section className="bg-bone">
          <Link href={c.other.href} className="group container-x flex items-center justify-between gap-6 border-t border-ink/12 py-14 md:py-20">
            <span>
              <span className="eyebrow block text-stone">Veja também</span>
              <span className="mt-3 block font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-none transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-2 group-hover:italic">
                {c.other.label}
              </span>
            </span>
            <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-ink/25 transition-colors duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-bone">
              <Arrow />
            </span>
          </Link>
        </section>
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
