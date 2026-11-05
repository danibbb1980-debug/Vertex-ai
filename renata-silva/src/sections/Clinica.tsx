import { CONFIG } from "../config";
import { FadeIn, RevealTitle } from "../components/Reveal";
import { Picture } from "../components/Picture";

const PILARES = [
  { n: "01", t: "Avaliação individual", d: "Cada atendimento começa por uma conversa sobre a sua pele, o seu histórico e o que você procura." },
  { n: "02", t: "Explicação clara", d: "Antes de qualquer procedimento, você entende o que pode ser indicado, como funciona e quais cuidados envolve." },
  { n: "03", t: "Hora marcada", d: "Atendimento organizado com antecedência, para que a sua visita aconteça com calma." },
];

export function Clinica() {
  if (!CONFIG.secoes.clinica) return null;
  const p = CONFIG.profissional;
  const fotos = CONFIG.fotosClinica;
  const mostrarProfissional = Boolean(p.registro && p.titulo);

  return (
    <section id="clinica" data-line="right" aria-labelledby="clinica-titulo" className="on-light relative bg-ivory py-24 md:py-36">
      <div className="container-site relative z-[2]">
        <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
          <div>
            <p className="eyebrow mb-6 text-rose-700">A clínica</p>
            <RevealTitle id="clinica-titulo" text="Primeiro a conversa. Depois, o *plano*." className="text-[2.6rem] text-ink md:text-[3.6rem]" />
          </div>
          <FadeIn className="space-y-5 text-[1.05rem] text-ink-soft md:pt-14">
            <p>
              Na {CONFIG.nome}, cada atendimento começa pela avaliação individual. Ouvimos o que você procura, observamos a pele e
              consideramos o seu histórico antes de falar em qualquer procedimento.
            </p>
            <p>
              Depois, explicamos com calma o que pode ser indicado, como cada etapa funciona e quais cuidados ela envolve. Você decide
              com informação, no seu tempo.
            </p>
          </FadeIn>
        </div>

        <ol className="mt-20 grid gap-px overflow-hidden rounded-3xl border border-blush-200 bg-blush-200 md:grid-cols-3">
          {PILARES.map((x, i) => (
            <FadeIn as="li" key={x.n} delay={i * 0.08} className="bg-ivory p-8 md:p-10">
              <span className="font-serif text-2xl italic text-rose-700">{x.n}</span>
              <h3 className="mt-4 font-label text-sm uppercase tracking-[0.2em] text-ink">{x.t}</h3>
              <p className="mt-3 text-ink-soft">{x.d}</p>
            </FadeIn>
          ))}
        </ol>

        {fotos.length > 0 && (
          <div className="mt-24">
            <div className="mb-8 flex items-end justify-between gap-6">
              <h3 className="title text-[2rem] text-ink md:text-[2.4rem]">
                O <em>espaço</em>
              </h3>
              <div className="filete hidden flex-1 md:block" aria-hidden="true" />
            </div>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-8">
              {fotos.map((f, i) => (
                <FadeIn
                  as="li"
                  key={f.arquivo}
                  delay={i * 0.1}
                  className={`${i === 0 ? "col-span-2 sm:col-span-1" : ""} ${i === 1 ? "sm:translate-y-10" : ""}`}
                >
                  <figure>
                    <div className="overflow-hidden rounded-t-[999px] rounded-b-2xl bg-blush">
                      <Picture
                        foto={f}
                        sizes="(min-width: 640px) 33vw, 50vw"
                        className={`block w-full object-cover ${i === 0 ? "aspect-[4/3] sm:aspect-[3/4]" : "aspect-[3/4]"}`}
                      />
                    </div>
                    <figcaption className="eyebrow mt-4 text-ink-soft">{f.legenda}</figcaption>
                  </figure>
                </FadeIn>
              ))}
            </ul>
          </div>
        )}

        {mostrarProfissional && (
          <FadeIn className="mt-24 grid items-center gap-10 rounded-3xl bg-blush p-8 md:grid-cols-[auto_1fr] md:p-12">
            {p.foto && (
              <div className="w-44 overflow-hidden rounded-t-[999px] rounded-b-2xl">
                <Picture foto={p.foto} className="block aspect-[3/4] w-full object-cover" />
              </div>
            )}
            <div>
              <p className="eyebrow text-rose-700">A profissional</p>
              <h3 className="title mt-3 text-[2.2rem] text-ink">{p.nome}</h3>
              <p className="mt-2 font-label text-sm tracking-[0.12em] text-ink">
                {p.titulo} · {p.registro}
              </p>
              {p.formacao && <p className="mt-4 text-ink-soft">{p.formacao}</p>}
              {p.bio && <p className="mt-4 text-ink-soft">{p.bio}</p>}
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
