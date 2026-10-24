import { projetos, type Projeto } from "../projetos";
import { Label } from "../components/SectionHead";
import { IconArrow } from "../components/Icons";

const byId = (id: string) => projetos.find((p) => p.id === id)!;
const total = String(projetos.length).padStart(2, "0");
const indexOf = (p: Projeto) => String(projetos.indexOf(p) + 1).padStart(2, "0");

function Desktop({ p, sizes, priority = false }: { p: Projeto; sizes: string; priority?: boolean }) {
  return (
    <div className="frame-browser">
      <div className="bar" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <img
        src={`/exemplos/${p.desktop}-640.webp`}
        srcSet={`/exemplos/${p.desktop}-640.webp 640w, /exemplos/${p.desktop}-960.webp 960w, /exemplos/${p.desktop}-1200.webp 1200w`}
        sizes={sizes}
        width={1200}
        height={750}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        alt={p.alt}
        className="block aspect-[16/10] h-auto w-full"
      />
    </div>
  );
}

/** Ficha do projeto: índice, segmento, nome, objetivo e a decisão de design. */
function Ficha({ p, className = "", large = false }: { p: Projeto; className?: string; large?: boolean }) {
  return (
    <div className={className}>
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="num">
          {indexOf(p)} / {total}
        </span>
        <span className="meta">{p.segmento}</span>
        {p.status && <span className="meta !text-gold-hi">{p.status}</span>}
      </p>
      <h3 className={`mt-4 font-serif text-pearl ${large ? "text-[clamp(2.2rem,4vw,3rem)]" : "text-[2rem]"} leading-[1.05]`}>{p.nome}</h3>
      {p.cidade && <p className="mt-1 text-[0.95rem] text-dim">{p.cidade}</p>}
      <dl className="mt-6 space-y-4 text-[0.98rem]">
        <div>
          <dt className="meta">Objetivo</dt>
          <dd className="mt-1 text-mist">{p.objetivo}</dd>
        </div>
        <div>
          <dt className="meta">Decisão de design</dt>
          <dd className="mt-1 text-mist">{p.decisao}</dd>
        </div>
      </dl>
      {p.link && (
        <a href={p.link} target="_blank" rel="noopener" className="group mt-6 inline-flex min-h-11 items-center gap-2 font-display text-[0.95rem] whitespace-nowrap text-champ">
          <span className="link-line">Ver a demonstração</span>
          <IconArrow className="size-4 -rotate-45 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          <span className="sr-only">(abre em nova aba)</span>
        </a>
      )}
    </div>
  );
}

export function Projetos() {
  const vip = byId("vip-shape");
  const star = byId("star-sorrindo");
  const bea = byId("dra-beatryz");
  const rocha = byId("rocha");
  const natalino = byId("natalino-polato");

  return (
    <section id="projetos" aria-labelledby="projetos-title" className="relative z-10 bg-ink-0 py-24 sm:py-32">
      <div className="container-v">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Label>Projetos</Label>
            <h2 id="projetos-title" className="mt-7 text-[clamp(2.5rem,6.5vw,4.6rem)] text-pearl">
              Trabalho feito no estúdio.
            </h2>
          </div>
          <p className="max-w-md text-mist lg:col-span-4 lg:col-start-9 lg:pb-2">
            Sites e rascunhos feitos pela Vertex. Em cada um, o objetivo e uma decisão de design que guiou
            o resultado.
          </p>
        </div>

        {/* 01 — destaque largo */}
        <article className="mt-16 grid gap-8 border-t border-pearl/10 pt-10 sm:mt-20 lg:grid-cols-12 lg:gap-10">
          <div data-reveal className="lg:col-span-8">
            <Desktop p={vip} sizes="(min-width: 1024px) 760px, 92vw" />
          </div>
          <Ficha p={vip} large className="lg:col-span-4 lg:pt-2" />
        </article>

        {/* 02 e 03 — par de saúde bucal, proporções diferentes */}
        <div className="mt-16 grid gap-16 border-t sm:mt-24 border-pearl/10 pt-10 lg:grid-cols-12 lg:gap-10">
          <article className="lg:col-span-7">
            <div data-reveal>
              <Desktop p={star} sizes="(min-width: 1024px) 660px, 92vw" />
            </div>
            <Ficha p={star} className="mt-8 max-w-lg" />
          </article>
          <article className="lg:col-span-5 lg:mt-28">
            <div data-reveal style={{ ["--d" as string]: "120ms" }}>
              <Desktop p={bea} sizes="(min-width: 1024px) 470px, 92vw" />
            </div>
            <Ficha p={bea} className="mt-8" />
          </article>
        </div>

        {/* 04 — texto à esquerda, imagem ampla à direita */}
        <article className="mt-16 grid gap-8 border-t sm:mt-24 border-pearl/10 pt-10 lg:grid-cols-12 lg:gap-10">
          <Ficha p={rocha} className="order-2 lg:order-1 lg:col-span-4 lg:pt-2" />
          <div data-reveal className="order-1 lg:order-2 lg:col-span-8">
            <Desktop p={rocha} sizes="(min-width: 1024px) 760px, 92vw" />
          </div>
        </article>

        {/* 05 — imagem média, ficha ao lado */}
        <article className="mt-16 grid gap-8 border-t sm:mt-24 border-pearl/10 pt-10 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div data-reveal className="lg:col-span-6 lg:col-start-2">
            <Desktop p={natalino} sizes="(min-width: 1024px) 560px, 92vw" />
          </div>
          <Ficha p={natalino} className="lg:col-span-4 lg:col-start-8" />
        </article>
      </div>
    </section>
  );
}
