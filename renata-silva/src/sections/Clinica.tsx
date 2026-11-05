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
  const comRegistro = Boolean(p.registro && p.titulo);
  const mostrarProfissional = Boolean(p.foto || comRegistro);

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

        {mostrarProfissional && (
          <div className="mt-24 grid items-center gap-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-20">
            {p.foto && (
              <FadeIn className="relative mx-auto w-full max-w-[24rem] md:mx-0">
                <div aria-hidden="true" className="absolute -inset-3 rounded-t-[999px] rounded-b-[2rem] border border-rose-700/25" />
                <div className="relative overflow-hidden rounded-t-[999px] rounded-b-3xl bg-navy-900 shadow-[0_40px_80px_-50px_rgba(30,39,46,0.6)]">
                  <Picture foto={p.foto} sizes="(min-width: 768px) 384px, 90vw" className="block aspect-[3/4] w-full object-cover" />
                </div>
              </FadeIn>
            )}
            <FadeIn delay={0.1}>
              <p className="eyebrow text-rose-700">{comRegistro ? "A profissional" : "À frente da clínica"}</p>
              <h3 className="title mt-4 text-[2.8rem] text-ink md:text-[3.6rem]">
                Renata <em>Silva</em>
              </h3>
              {comRegistro && (
                <p className="mt-3 font-label text-sm tracking-[0.14em] text-ink">
                  {p.titulo} · {p.registro}
                </p>
              )}
              <div className="filete my-7 w-28" aria-hidden="true" />
              {comRegistro && p.formacao && <p className="mb-4 text-ink-soft">{p.formacao}</p>}
              <p className="max-w-[30rem] text-[1.05rem] text-ink-soft">
                {p.bio || "Cada atendimento começa por uma conversa, com tempo para ouvir e explicar cada etapa antes de qualquer indicação."}
              </p>
            </FadeIn>
          </div>
        )}

        {fotos.length > 0 && (
          <div className={`mt-24 ${fotos.length === 2 ? "grid gap-8 md:grid-cols-[1fr_2fr] md:gap-14" : ""}`}>
            <div className={fotos.length === 2 ? "md:pt-16" : "mb-8 flex items-end justify-between gap-6"}>
              <h3 className="title text-[2rem] text-ink md:text-[2.4rem]">
                O <em>espaço</em>
              </h3>
              {fotos.length === 2 ? (
                <>
                  <div className="filete my-6 w-24" aria-hidden="true" />
                  <p className="max-w-[18rem] text-ink-soft">Ambientes preparados para receber você com calma e hora marcada.</p>
                </>
              ) : (
                <div className="filete hidden flex-1 md:block" aria-hidden="true" />
              )}
            </div>
            <ul className={`grid grid-cols-2 gap-4 md:gap-8 ${fotos.length === 2 ? "" : fotos.length >= 3 ? "sm:grid-cols-3" : "max-w-sm grid-cols-1"}`}>
              {fotos.map((f, i) => (
                <FadeIn
                  as="li"
                  key={f.arquivo}
                  delay={i * 0.1}
                  className={`${fotos.length >= 3 && i === 0 ? "col-span-2 sm:col-span-1" : ""} ${i === 1 ? "translate-y-6 sm:translate-y-10" : ""}`}
                >
                  <figure>
                    <div className="overflow-hidden rounded-t-[999px] rounded-b-2xl bg-blush">
                      <Picture
                        foto={f}
                        sizes="(min-width: 768px) 384px, 50vw"
                        className={`block w-full object-cover ${fotos.length >= 3 && i === 0 ? "aspect-[4/3] sm:aspect-[3/4]" : "aspect-[3/4]"}`}
                      />
                    </div>
                    <figcaption className="eyebrow mt-4 text-ink-soft">{f.legenda}</figcaption>
                  </figure>
                </FadeIn>
              ))}
            </ul>
          </div>
        )}

      </div>
    </section>
  );
}
