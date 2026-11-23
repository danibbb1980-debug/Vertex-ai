import Image from "next/image";
import Link from "next/link";
import { BodyMap } from "@/components/ui/BodyMap";
import { CadastroForm } from "@/components/ui/forms";
import { Arrow, ButtonLink, Eyebrow, Reveal, RevealTitle } from "@/components/ui/primitives";
import { UnitLocator } from "@/components/ui/UnitLocator";
import { PlayIcon, VideoDialog } from "@/components/ui/VideoDialog";
import { networkNumbers } from "@/lib/franchise";
import { differentials, technologyVideoId, testimonials } from "@/lib/site";
import { TestimonialRail } from "@/components/ui/TestimonialRail";

/* ───────────── N° 01 — Manifesto ───────────── */

export function Manifesto() {
  return (
    <section id="manifesto" aria-labelledby="manifesto-title" className="relative overflow-hidden bg-bone py-24 md:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow index="01" className="text-stone">
              Manifesto
            </Eyebrow>
          </Reveal>
          <RevealTitle
            className="mt-10 text-headline tracking-[-0.025em]"
            lines={[
              <span key="a" id="manifesto-title">Resgatar a autoestima</span>,
              <>e a confiança que</>,
              <em key="c">a depilação convencional</em>,
              <em key="d">tirou de você.</em>,
            ]}
          />
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:mt-20 lg:max-w-2xl">
            <Reveal delay={100}>
              <p className="text-[1.0625rem] leading-relaxed text-ink/80">
                Somos especializados em proporcionar conforto, bem-estar, economia de tempo e dinheiro para quem faz o nosso tratamento.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-[1.0625rem] leading-relaxed text-stone">
                Em 2007, nascia em Madri a primeira unidade, com um conceito ousado: democratizar a depilação de alta tecnologia.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <Reveal kind="image" className="relative aspect-[4/5] overflow-hidden lg:ml-auto lg:mt-24 lg:w-[92%]">
            <Image
              src="/img/editorial/manifesto-mar.jpg"
              alt="Mulher sorrindo com as mãos nos cabelos, à beira-mar"
              fill
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover object-[82%_30%]"
            />
          </Reveal>
          <Reveal delay={300} className="mt-5 flex items-baseline justify-between gap-6 lg:ml-auto lg:w-[92%]">
            <p className="eyebrow shrink-0 text-stone">Madri, 2007</p>
            <p className="font-display text-lg text-ink/80">a marca que revolucionou a depilação no mundo</p>
          </Reveal>
        </div>
      </div>

      {/* Fio de números publicados pela rede. */}
      <div className="container-x mt-24 md:mt-32">
        <ul className="grid grid-cols-2 border-t border-ink/15 md:grid-cols-4">
          {networkNumbers.map((n, i) => (
            <Reveal as="li" key={n.label} delay={i * 90} className={`border-b border-ink/15 py-8 pr-4 md:border-b-0 ${i % 2 ? "pl-4 md:pl-8" : "md:pl-8 md:first:pl-0"} ${i ? "md:border-l" : ""}`}>
              <p className="font-display text-[clamp(2.5rem,5vw,4.25rem)] leading-none tracking-[-0.03em]">{n.value}</p>
              <p className="eyebrow mt-4 text-stone">{n.label}</p>
            </Reveal>
          ))}
        </ul>
        <p className="mt-5 text-xs text-stone">Números da rede Não+Pelo publicados na página de franquias.</p>
      </div>
    </section>
  );
}

/* ───────────── N° 02 — Tecnologia ───────────── */

export function Technology() {
  return (
    <section id="tecnologia" aria-labelledby="tecnologia-title" className="grain relative overflow-hidden bg-ink py-24 text-bone md:py-36">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow index="02" className="text-mist">
                Nossa tecnologia
              </Eyebrow>
            </Reveal>
            <RevealTitle
              className="mt-10 text-display tracking-[-0.035em]"
              lines={[<span key="a" id="tecnologia-title">Sun&amp;Safe</span>]}
            />
            <Reveal delay={150}>
              <p className="mt-6 font-display text-2xl text-green md:text-3xl">Tecnologia exclusiva Não+Pelo.</p>
            </Reveal>
          </div>
          <Reveal delay={200} className="lg:col-span-4 lg:col-start-9">
            <p className="text-[1.0625rem] leading-relaxed text-mist">
              Utilizamos equipamentos modernos que atuam diretamente no folículo do pelo, garantindo mais eficiência, conforto e segurança em
              cada sessão.
            </p>
          </Reveal>
        </div>

        {/* Composição de duas imagens com escalas diferentes. */}
        <div className="relative mt-16 grid gap-6 md:mt-24 lg:grid-cols-12 lg:gap-8">
          <div className="relative self-start lg:col-span-8">
            <Reveal kind="image" className="relative aspect-[16/10] overflow-hidden lg:aspect-[16/9]">
              <div data-parallax="36" className="absolute -inset-y-[6%] inset-x-0">
                <Image
                  src="/img/tecnologia/sessao-axila.jpg"
                  alt="Sessão de depilação na axila com o equipamento da Não+Pelo"
                  fill
                  sizes="(min-width: 1024px) 64vw, 100vw"
                  className="object-cover object-[35%_50%] saturate-[0.78]"
                />
              </div>
            </Reveal>
            <VideoDialog
              videoId={technologyVideoId}
              title="Vídeo — Nossa tecnologia"
              className="group absolute bottom-0 left-0 flex items-center gap-4 bg-ink py-4 pl-0 pr-6 text-left md:pr-8"
            >
              <span className="flex h-14 w-14 items-center justify-center border border-bone/30 transition-colors duration-500 group-hover:border-green group-hover:bg-green group-hover:text-ink">
                <PlayIcon className="ml-0.5 h-3.5 w-3.5" />
              </span>
              <span>
                <span className="eyebrow block text-mist">Vídeo</span>
                <span className="font-display text-xl">Veja a tecnologia em ação</span>
              </span>
            </VideoDialog>
          </div>

          <div className="lg:col-span-4 lg:pt-32">
            <Reveal kind="image" delay={150} className="relative hidden aspect-[4/5] overflow-hidden lg:block">
              <Image
                src="/img/pirassununga/sessao-perna-ponteira.jpg"
                alt="Profissional da Não+Pelo aplicando a ponteira verde na coxa de uma cliente"
                fill
                sizes="(min-width: 1024px) 30vw, 100vw"
                className="object-cover object-[62%_50%]"
              />
            </Reveal>
          </div>
        </div>

        {/* Especificações publicadas: SubZero, safira, todos os tipos de pele. */}
        <dl className="mt-20 grid border-t border-bone/15 md:mt-28 md:grid-cols-3">
          {[
            ["Filtros de safira", "Ponteira com filtros especiais e exclusivos de safira."],
            ["Tecnologia SubZero", "Resfriamento integrado que protege a pele e torna a sessão mais confortável."],
            ["Todos os tipos de pele", "Ideal para todos os tipos de pele, inclusive as bronzeadas."],
          ].map(([t, d], i) => (
            <Reveal key={t} delay={i * 120} className={`group border-b border-bone/15 py-10 md:border-b-0 md:px-8 ${i ? "md:border-l" : "md:pl-0"}`}>
              <dt className="flex items-baseline gap-4">
                <span className="eyebrow text-green">0{i + 1}</span>
                <span className="font-display text-[1.75rem] leading-tight transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-1">
                  {t}
                </span>
              </dt>
              <dd className="mt-4 max-w-xs pl-9 text-[0.9375rem] leading-relaxed text-mist">{d}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ───────────── N° 03 — Tratamentos ───────────── */

export function Treatments() {
  return (
    <section id="tratamentos" aria-labelledby="tratamentos-title" className="bg-paper py-24 md:py-36">
      <div className="container-x">
        <div className="mb-16 grid gap-8 md:mb-24 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <Eyebrow index="03" className="text-stone">
                Áreas de tratamento
              </Eyebrow>
            </Reveal>
            <RevealTitle
              className="mt-10 text-headline tracking-[-0.025em]"
              lines={[<span key="a" id="tratamentos-title">Cada área,</span>, <em key="b">no seu tempo.</em>]}
            />
          </div>
          <Reveal delay={150} className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="text-[1.0625rem] leading-relaxed text-stone">
              Escolha o público e a região para ver o que cada tratamento abrange. Os tratamentos são personalizados respeitando o tom de pele e o
              tipo de pelo de cada pessoa.
            </p>
          </Reveal>
        </div>

        <BodyMap />

        <div className="mt-24 grid gap-px bg-ink/12 md:mt-32 md:grid-cols-2">
          {[
            { href: "/depilacao-feminina", kicker: "Para todas as mulheres", title: "Depilação feminina" },
            { href: "/depilacao-masculina", kicker: "Para todos os homens", title: "Depilação masculina" },
          ].map((item, i) => (
            <Reveal key={item.href} delay={i * 120} className="bg-paper">
              <Link href={item.href} className="group flex items-end justify-between gap-6 py-10 md:px-10 md:py-14 md:first:pl-0">
                <span>
                  <span className="eyebrow block text-stone">{item.kicker}</span>
                  <span className="mt-3 block font-display text-[clamp(2rem,3.6vw,3.25rem)] leading-none transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-2">
                    {item.title}
                  </span>
                </span>
                <span className="mb-2 flex h-12 w-12 shrink-0 items-center justify-center border border-ink/25 transition-colors duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-bone">
                  <Arrow />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── N° 04 — Diferenciais ───────────── */

export function Differentials() {
  return (
    <section aria-labelledby="diferenciais-title" className="relative overflow-hidden bg-sand py-24 md:py-36">
      <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <Eyebrow index="04" className="text-stone">
                Diferenciais
              </Eyebrow>
            </Reveal>
            <RevealTitle
              className="mt-10 text-headline tracking-[-0.025em]"
              lines={[<span key="a" id="diferenciais-title">Para os mais</span>, <>variados tipos</>, <em key="c">de pele e pelo.</em>]}
            />
            <Reveal kind="image" delay={150} className="relative mt-14 aspect-[17/10] overflow-hidden">
              <Image
                src="/img/editorial/tons-de-pele.jpg"
                alt="Quatro mulheres de diferentes tons de pele sorrindo juntas"
                fill
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="object-cover object-[50%_35%]"
              />
            </Reveal>
          </div>
        </div>

        <ol className="lg:col-span-6 lg:col-start-7">
          {differentials.map((d, i) => (
            <Reveal as="li" key={d.title} delay={60} className="group border-t border-ink/15 py-12 first:border-t-0 first:pt-0 md:py-16 lg:first:pt-[11rem]">
              <p className="font-display text-[4.5rem] leading-none tracking-[-0.04em] text-ink/15 transition-colors duration-700 group-hover:text-green-deep md:text-[6.5rem]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-display text-[clamp(1.9rem,3vw,2.75rem)] leading-tight">{d.title}</h3>
              <p className="mt-4 max-w-md text-[1.0625rem] leading-relaxed text-stone">{d.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────── N° 05 — Depoimentos ───────────── */

export function Testimonials() {
  return (
    <section aria-labelledby="depoimentos-title" className="overflow-hidden bg-bone py-24 md:py-36">
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow index="05" className="text-stone">
              Depoimentos em vídeo
            </Eyebrow>
          </Reveal>
          <RevealTitle
            className="mt-10 text-headline tracking-[-0.025em]"
            lines={[<span key="a" id="depoimentos-title">A escolha de quem</span>, <em key="b">busca resultados.</em>]}
          />
        </div>
        <Reveal delay={150} className="lg:col-span-4 lg:col-start-9">
          <p className="text-[1.0625rem] leading-relaxed text-stone">
            Clientes da rede contam, com as próprias palavras, como é a experiência Não+Pelo. Toque em um retrato para assistir.
          </p>
        </Reveal>
      </div>
      <TestimonialRail items={testimonials} />
    </section>
  );
}

/* ───────────── N° 06 — Unidades ───────────── */

export function LocatorSection() {
  return (
    <section id="unidades" aria-labelledby="unidades-title" className="grain relative bg-ink-2 py-24 text-bone md:py-36">
      <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <Eyebrow index="06" className="text-mist">
                Perto de você
              </Eyebrow>
            </Reveal>
            <RevealTitle
              className="mt-10 text-title tracking-[-0.02em] md:text-headline"
              lines={[<span key="a" id="unidades-title">Encontre a</span>, <>unidade mais</>, <em key="c" className="text-green">próxima.</em>]}
            />
            <Reveal delay={150}>
              <p className="mt-8 max-w-sm text-[1.0625rem] leading-relaxed text-mist">
                De norte a sul, somos mais de 100 unidades no Brasil com excelência no atendimento. Você merece o melhor.
              </p>
            </Reveal>
          </div>
        </div>
        <Reveal delay={100} className="lg:col-span-8">
          <UnitLocator compact tone="dark" />
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────── N° 07 — Primeira sessão ───────────── */

export function FirstSession({ index = "07" }: { index?: string }) {
  return (
    <section id="agendar" aria-labelledby="agendar-title" className="bg-bone">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[70svh] overflow-hidden bg-ink lg:min-h-0">
          <FirstSessionArt />
        </div>
        <div className="container-x py-20 md:py-28 lg:max-w-none lg:px-16 xl:px-24">
          <Reveal>
            <Eyebrow index={index} className="text-stone">
              Primeira sessão
            </Eyebrow>
          </Reveal>
          <RevealTitle
            className="mt-10 text-[clamp(2.2rem,3.4vw,3.5rem)] leading-[1.02] tracking-[-0.02em]"
            lines={[
              <span key="a" id="agendar-title" className="whitespace-nowrap">
                Cadastre-se e garanta
              </span>,
              <>sua primeira sessão</>,
              <em key="c">gratuita.</em>,
            ]}
          />
          <Reveal delay={150}>
            <p className="mb-10 mt-6 max-w-md text-stone">
              Escolha a unidade mais próxima. Depois do cadastro, você continua pelo WhatsApp da unidade para combinar o horário.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <CadastroForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Fotografia da campanha ao lado do formulário de cadastro. */
function FirstSessionArt() {
  return (
    <div className="absolute inset-0 text-bone">
      <Image
        src="/img/pirassununga/liberdade-bracos-abertos.jpg"
        alt="Mulher sorrindo de braços abertos ao sol"
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover object-[50%_12%]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,rgb(18_17_15/0.85)_0%,rgb(18_17_15/0.15)_55%,transparent_100%)]" />
      <div className="absolute inset-x-0 bottom-0 p-8 md:p-12">
        <p className="eyebrow mb-4 text-green">Primeira sessão</p>
        <p className="max-w-sm font-display text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.05]">
          A primeira sessão <em>é por nossa conta.</em>
        </p>
      </div>
    </div>
  );
}

/* ───────────── N° 08 — Franquias ───────────── */

export function FranchiseTeaser() {
  return (
    <section aria-labelledby="franquia-teaser-title" className="relative overflow-hidden bg-paper py-24 md:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-8">
        <div className="relative lg:col-span-5">
          <Reveal kind="image" className="relative aspect-[3/4] overflow-hidden">
            <Image
              src="/img/pirassununga/sala-atendimento.jpg"
              alt="Sala de atendimento da unidade Não+Pelo de Pirassununga, com maca e equipamento"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </Reveal>
          <p className="eyebrow mt-4 text-stone">Sala de atendimento — unidade Pirassununga</p>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal>
            <Eyebrow index="08" className="text-stone">
              Seja um franqueado
            </Eyebrow>
          </Reveal>
          <RevealTitle
            className="mt-10 text-headline tracking-[-0.025em]"
            lines={[<span key="a" id="franquia-teaser-title">Um negócio</span>, <>enxuto, com uma</>, <em key="c">marca global.</em>]}
          />
          <Reveal delay={150}>
            <p className="mt-8 max-w-lg text-[1.0625rem] leading-relaxed text-stone">
              Um modelo de negócio simples, com operação fácil de gerenciar — para quem busca o primeiro negócio próprio ou quer diversificar sem
              precisar de presença integral.
            </p>
          </Reveal>
          <Reveal delay={250} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/franquias">Conhecer a franquia</ButtonLink>
            <ButtonLink href="/franquias#apresentacao" variant="outline-dark" arrow={false}>
              Receber apresentação
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
