import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { FranquiaForm } from "@/components/ui/forms";
import { Arrow, Eyebrow, Reveal, RevealTitle } from "@/components/ui/primitives";
import { StickyCta } from "@/components/ui/StickyCta";
import {
  franchiseDisclaimer,
  franchiseFaq,
  franchiseNumbers,
  franchiseReasons,
  marketNumbers,
  networkNumbers,
  storePhotos,
} from "@/lib/franchise";

export const metadata: Metadata = {
  title: "Seja um franqueado",
  description:
    "Franquia de depilação Não+Pelo: investimento a partir de R$ 149 mil, operação enxuta e suporte completo. Preencha o cadastro e receba a apresentação de negócios.",
  alternates: { canonical: "/franquias" },
  openGraph: { url: "/franquias", title: "Seja um franqueado Não+Pelo" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: franchiseFaq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function FranquiasPage() {
  return (
    <>
      <Header over="dark" />
      <main id="conteudo">
        {/* Hero escuro: promessa de faturamento da página original, com remissão ao aviso legal. */}
        <section aria-labelledby="franquia-titulo" className="grain relative overflow-hidden bg-ink text-bone">
          <div className="absolute inset-0">
            <Image
              src="/img/franquia/loja-5.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="hero-image object-cover object-center opacity-45 saturate-[0.7]"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgb(18_17_15/0.95)_0%,rgb(18_17_15/0.75)_45%,rgb(18_17_15/0.35)_100%)]" />
          </div>
          <div className="container-x relative grid gap-16 pb-20 pt-36 md:pt-44 lg:min-h-[100svh] lg:grid-cols-12 lg:items-end lg:gap-8 lg:pb-24">
            <div className="lg:col-span-7">
              <p className="hero-fade eyebrow flex items-center gap-3 text-mist" style={{ "--d": "150ms" } as CSSProperties}>
                <span className="plus-mark text-gold" aria-hidden="true" />
                Seja um franqueado
              </p>
              <h1 id="franquia-titulo" className="mt-8 text-[clamp(2.8rem,6.2vw,6.5rem)] leading-[0.95] tracking-[-0.03em]">
                <span className="hero-line line-mask">
                  <span style={{ "--i": 0 } as CSSProperties}>Fature até</span>
                </span>
                <span className="hero-line line-mask">
                  <span style={{ "--i": 1 } as CSSProperties}>
                    <em className="text-gold">R$ 1,5 milhão</em> por ano
                  </span>
                </span>
                <span className="hero-line line-mask">
                  <span style={{ "--i": 2 } as CSSProperties}>com a sua franquia</span>
                </span>
                <span className="hero-line line-mask">
                  <span style={{ "--i": 3 } as CSSProperties}>
                    de depilação.<a href="#aviso-legal" className="align-super text-[0.35em] text-mist no-underline" aria-label="Ver aviso legal">*</a>
                  </span>
                </span>
              </h1>
              <p className="hero-fade mt-8 max-w-md text-[1.0625rem] leading-relaxed text-mist" style={{ "--d": "900ms" } as CSSProperties}>
                Rápido retorno com 50% a menos de investimento. Preencha o cadastro e receba a apresentação de negócios.
              </p>
            </div>

            <div
              id="apresentacao"
              className="hero-fade scroll-mt-28 border border-bone/15 bg-ink/70 p-7 backdrop-blur-md md:p-10 lg:col-span-5 lg:col-start-8"
              style={{ "--d": "700ms" } as CSSProperties}
            >
              <p className="eyebrow text-gold">Receber apresentação</p>
              <p className="mb-6 mt-3 font-display text-3xl leading-tight">Preencha o cadastro.</p>
              <FranquiaForm />
            </div>
          </div>
        </section>

        {/* Números do modelo de negócio. */}
        <section aria-labelledby="numeros-titulo" className="bg-bone py-24 md:py-32">
          <div className="container-x">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <Reveal>
                  <Eyebrow index="01" className="text-stone">
                    O modelo
                  </Eyebrow>
                </Reveal>
                <RevealTitle
                  className="mt-10 text-headline tracking-[-0.025em]"
                  lines={[<span key="a" id="numeros-titulo">Rápido retorno,</span>, <em key="b">investimento enxuto.</em>]}
                />
              </div>
            </div>
            <dl className="mt-16 grid grid-cols-2 border-t border-ink/15 md:mt-24 lg:grid-cols-4">
              {franchiseNumbers.map((n, i) => (
                <Reveal key={n.label} delay={i * 90} className={`border-b border-ink/15 py-10 pr-4 lg:border-b-0 ${i % 2 ? "pl-4" : ""} lg:px-8 lg:first:pl-0 ${i ? "lg:border-l" : ""}`}>
                  <dt className="eyebrow text-stone">{n.label}</dt>
                  <dd className="mt-5 whitespace-nowrap font-display text-[clamp(1.9rem,3.6vw,3.75rem)] leading-none tracking-[-0.03em]">{n.value}</dd>
                </Reveal>
              ))}
            </dl>
            <p className="mt-6 text-xs text-stone">
              Valores de referência. <a href="#aviso-legal" className="underline underline-offset-2">Leia o aviso legal</a>.
            </p>
          </div>
        </section>

        {/* História e propósito, com a união Rennova. */}
        <section aria-labelledby="historia-titulo" className="bg-paper py-24 md:py-36">
          <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6">
              <Reveal>
                <Eyebrow index="02" className="text-stone">
                  A marca
                </Eyebrow>
              </Reveal>
              <RevealTitle
                className="mt-10 text-headline tracking-[-0.025em]"
                lines={[<span key="a" id="historia-titulo">A marca que</span>, <>revolucionou a</>, <em key="c">depilação no mundo.</em>]}
              />
              <div className="mt-12 grid max-w-xl gap-6 text-[1.0625rem] leading-relaxed text-stone">
                <Reveal>
                  <p className="text-ink/80">
                    Com 18 anos de expertise no segmento, somos líderes globais, com presença em 16 países e reconhecimento internacional por nossa
                    tecnologia exclusiva e cuidado com o cliente.
                  </p>
                </Reveal>
                <Reveal delay={80}>
                  <p>Em 2007, nascia em Madri a nossa primeira unidade, com um conceito ousado: democratizar a depilação de alta tecnologia.</p>
                </Reveal>
                <Reveal delay={160}>
                  <p>
                    Nosso propósito é entregar um modelo de negócio enxuto, simples, com baixo investimento e alta lucratividade. Operação fácil de
                    gerenciar, para quem busca seu primeiro negócio próprio ou para quem quer diversificar sem necessitar de presença integral ao
                    negócio.
                  </p>
                </Reveal>
              </div>
            </div>
            <div className="lg:col-span-5 lg:col-start-8 lg:pt-24">
              <Reveal kind="image" className="relative aspect-[4/5] overflow-hidden">
                <Image src="/img/franquia/loja-1.jpg" alt="Fachada de vidro de uma unidade Não+Pelo" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
              </Reveal>
              <p className="eyebrow mt-4 text-stone">Unidade da rede Não+Pelo</p>
            </div>
          </div>
        </section>

        {/* Rennova */}
        <section aria-labelledby="rennova-titulo" className="grain relative overflow-hidden bg-ink py-24 text-bone md:py-36">
          <div className="container-x">
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <Reveal>
                  <Eyebrow index="03" className="text-mist">
                    Não+Pelo e Rennova
                  </Eyebrow>
                </Reveal>
                <RevealTitle
                  className="mt-10 text-headline tracking-[-0.025em]"
                  lines={[<span key="a" id="rennova-titulo">Duas gigantes</span>, <>da estética,</>, <em key="c" className="text-gold">agora unidas.</em>]}
                />
              </div>
              <Reveal delay={150} className="lg:col-span-4 lg:col-start-9 lg:self-end">
                <p className="text-[1.0625rem] leading-relaxed text-mist">
                  A união entre a tecnologia e a força da Não+Pelo e a expertise em produtos para harmonização facial, focada em rejuvenescimento e
                  estética, da Rennova fortalece ainda mais nosso modelo de negócio, ampliando o portfólio, o valor da marca e as oportunidades de
                  faturamento para os franqueados.
                </p>
              </Reveal>
            </div>

            <div className="mt-16 grid gap-6 md:mt-24 md:grid-cols-12 md:gap-8">
              <Reveal kind="image" className="relative aspect-[16/9] overflow-hidden md:col-span-8 md:aspect-auto md:min-h-[26rem]">
                <Image src="/img/franquia/rennova-sede.jpg" alt="Sede do Grupo Rennova" fill sizes="(min-width: 768px) 64vw, 100vw" className="object-cover saturate-[0.8]" />
              </Reveal>
              <Reveal kind="image" delay={150} className="relative aspect-square overflow-hidden md:col-span-4">
                <Image src="/img/franquia/rennova-equipe.jpg" alt="Equipe do Grupo Rennova reunida em frente à sede" fill sizes="(min-width: 768px) 32vw, 100vw" className="object-cover saturate-[0.8]" />
              </Reveal>
            </div>

            <dl className="mt-20 grid grid-cols-2 border-t border-bone/15 md:grid-cols-4">
              {networkNumbers.map((n, i) => (
                <Reveal key={n.label} delay={i * 90} className={`border-b border-bone/15 py-10 pr-4 md:border-b-0 ${i % 2 ? "pl-4" : ""} md:px-8 md:first:pl-0 ${i ? "md:border-l" : ""}`}>
                  <dt className="eyebrow text-mist">{n.label}</dt>
                  <dd className="mt-5 font-display text-[clamp(2.6rem,5vw,4.75rem)] leading-none tracking-[-0.03em]">{n.value}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>

        {/* Galeria de unidades reais da rede. */}
        <section aria-labelledby="galeria-titulo" className="overflow-hidden bg-bone py-24 md:py-36">
          <div className="container-x">
            <Reveal>
              <Eyebrow index="04" className="text-stone">
                A rede
              </Eyebrow>
            </Reveal>
            <RevealTitle
              className="mt-10 text-headline tracking-[-0.025em]"
              lines={[<span key="a" id="galeria-titulo">Lojas que você</span>, <em key="b">reconhece de longe.</em>]}
            />
          </div>
          <ul className="no-scrollbar mt-16 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 md:mt-24 md:gap-6 md:px-10 xl:px-16" aria-label="Fotos de unidades Não+Pelo">
            {storePhotos.map((p, i) => (
              <li key={p.src} className={`shrink-0 snap-start ${p.w > p.h ? "w-[86vw] md:w-[46vw]" : "w-[64vw] md:w-[26vw]"} ${i % 2 ? "md:mt-20" : ""}`}>
                <div className="relative overflow-hidden bg-sand" style={{ aspectRatio: `${p.w} / ${p.h}` }}>
                  <Image src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 46vw, 86vw" className="object-cover saturate-[0.85]" />
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Motivos + tecnologia THEROS */}
        <section aria-labelledby="motivos-titulo" className="bg-paper py-24 md:py-36">
          <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                <Reveal>
                  <Eyebrow index="05" className="text-stone">
                    Por que Não+Pelo
                  </Eyebrow>
                </Reveal>
                <RevealTitle
                  className="mt-10 text-headline tracking-[-0.025em]"
                  lines={[<span key="a" id="motivos-titulo">Motivos para ser</span>, <em key="b">um franqueado.</em>]}
                />
                <Reveal delay={120}>
                  <a href="#apresentacao" className="btn btn-solid-dark mt-12">
                    <span>Entre para esse time</span>
                    <Arrow />
                  </a>
                </Reveal>
              </div>
            </div>
            <ol className="border-t border-ink/15 lg:col-span-6 lg:col-start-7">
              {franchiseReasons.map((r, i) => (
                <Reveal as="li" key={r} className="group flex gap-6 border-b border-ink/15 py-8 md:gap-10 md:py-10">
                  <span className="eyebrow pt-2 text-gold-deep">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-[clamp(1.5rem,2.4vw,2.1rem)] leading-snug transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-1">
                    {r}
                  </span>
                </Reveal>
              ))}
            </ol>
          </div>

          <div className="container-x mt-24 md:mt-36">
            <div className="grid gap-12 border-t border-ink/15 pt-16 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-5">
                <Reveal>
                  <p className="eyebrow text-stone">Inovação tecnológica</p>
                </Reveal>
                <RevealTitle
                  className="mt-8 text-title tracking-[-0.02em]"
                  lines={[<>Tecnologia de depilação</>, <em key="b">com inteligência artificial.</em>]}
                />
              </div>
              <Reveal delay={120} className="lg:col-span-6 lg:col-start-7">
                <p className="text-[1.0625rem] leading-relaxed text-stone">
                  A tecnologia <span className="text-ink">THEROS</span> combina o que há de mais inovador no mundo da estética, unindo tecnologias
                  como o BBL (depilação) e RFL (rejuvenescimento), com o auxílio da inteligência artificial.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Mercado */}
        <section aria-labelledby="mercado-titulo" className="bg-sand py-24 md:py-32">
          <div className="container-x">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <Reveal>
                  <Eyebrow index="06" className="text-stone">
                    O mercado
                  </Eyebrow>
                </Reveal>
                <RevealTitle
                  className="mt-10 text-headline tracking-[-0.025em]"
                  lines={[<span key="a" id="mercado-titulo">Um mercado</span>, <em key="b">em ascensão.</em>]}
                />
              </div>
              <Reveal delay={120} className="lg:col-span-4 lg:col-start-9">
                <p className="text-[1.0625rem] leading-relaxed text-stone">
                  Grande oportunidade para empreendedores: o momento para entrar no mercado de depilação a laser é excepcionalmente promissor.
                </p>
              </Reveal>
            </div>
            <dl className="mt-16 grid border-t border-ink/15 md:mt-20 md:grid-cols-3">
              {marketNumbers.map((n, i) => (
                <Reveal key={n.label} delay={i * 90} className={`border-b border-ink/15 py-10 md:border-b-0 md:px-8 md:first:pl-0 ${i ? "md:border-l" : ""}`}>
                  <dd className="font-display text-[clamp(3rem,6vw,5.5rem)] leading-none tracking-[-0.03em]">{n.value}</dd>
                  <dt className="eyebrow mt-5 text-stone">{n.label}</dt>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>

        {/* Liderança */}
        <section aria-labelledby="lideranca-titulo" className="bg-bone py-24 md:py-36">
          <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
            <div className="lg:col-span-4">
              <Reveal>
                <Eyebrow index="07" className="text-stone">
                  Liderança
                </Eyebrow>
              </Reveal>
              <Reveal delay={100}>
                <p className="mt-8 font-display text-3xl italic leading-tight">Visão estratégica e força no mercado da beleza.</p>
              </Reveal>
            </div>
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start lg:col-span-7 lg:col-start-6">
              <Reveal kind="image" className="relative h-40 w-40 shrink-0 overflow-hidden bg-sand">
                <Image src="/img/lideranca/leonardo-rezende.jpg" alt="Leonardo Rezende" fill sizes="160px" className="object-cover grayscale" />
              </Reveal>
              <Reveal delay={120}>
                <h2 id="lideranca-titulo" className="font-display text-[clamp(2.2rem,4vw,3.5rem)] leading-none">
                  Leonardo Rezende
                </h2>
                <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-stone">
                  Fundador do Grupo Rennova, referência em estética avançada, e sócio da Nutriex, uma das maiores indústrias de cosméticos do Brasil.
                  Com forte atuação em branding, expansão e performance, Leonardo impulsiona a rede com visão estratégica e foco em resultados.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* FAQ + aviso legal */}
        <section aria-labelledby="faq-titulo" className="bg-paper py-24 md:py-36">
          <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <Reveal>
                <Eyebrow index="08" className="text-stone">
                  Perguntas frequentes
                </Eyebrow>
              </Reveal>
              <RevealTitle className="mt-10 text-title tracking-[-0.02em]" lines={[<span key="a" id="faq-titulo">O que os futuros</span>, <em key="b">franqueados perguntam.</em>]} />
              <div className="mt-10 space-y-2 text-[0.9375rem] text-stone">
                <p>Prefere falar com a equipe de expansão?</p>
                <a href="mailto:franquias@naomaispelo.com.br" className="link-line block text-ink">
                  franquias@naomaispelo.com.br
                </a>
                <a href="mailto:expansao.sp@naomaispelo.com.br" className="link-line block text-ink">
                  expansao.sp@naomaispelo.com.br
                </a>
              </div>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <div className="border-t border-ink/15">
                {franchiseFaq.map((f) => (
                  <details key={f.q} className="group border-b border-ink/15">
                    <summary className="flex cursor-pointer items-start justify-between gap-6 py-7 font-display text-[clamp(1.35rem,2vw,1.75rem)] leading-snug">
                      {f.q}
                      <span aria-hidden="true" className="plus-mark mt-3 shrink-0 text-[0.9rem] transition-transform duration-500 group-open:rotate-45" />
                    </summary>
                    <p className="max-w-2xl pb-8 text-[1.0625rem] leading-relaxed text-stone">{f.a}</p>
                  </details>
                ))}
              </div>

              <div id="aviso-legal" className="mt-16 scroll-mt-28 border-l border-ink/25 pl-6">
                <p className="eyebrow text-ink">Aviso legal — Não+Pelo</p>
                <div className="mt-4 space-y-3 text-[0.8125rem] leading-relaxed text-stone">
                  {franchiseDisclaimer.map((p) => (
                    <p key={p.slice(0, 24)}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <StickyCta href="#apresentacao" label="Receber apresentação" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
