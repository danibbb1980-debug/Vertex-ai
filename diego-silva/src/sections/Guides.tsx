import { CONTEUDOS } from "../config";
import { SectionHead } from "../components/SectionHead";
import { Reveal } from "../components/Reveal";

export function Guides({ num }: { num: string }) {
  return (
    <section aria-labelledby="conteudo-titulo" className="py-28 md:py-40">
      <div className="wrap">
        <SectionHead num={num} label="Conteúdo útil" />
        <Reveal>
          <h2 id="conteudo-titulo" className="max-w-3xl text-[clamp(2.4rem,5.2vw,4.4rem)]">
            Para chegar à conversa mais <em>tranquilo</em>.
          </h2>
        </Reveal>
        <ul className="mt-14 grid gap-12 md:mt-20 md:grid-cols-3 md:gap-10">
          {CONTEUDOS.map((c, i) => (
            <Reveal as="li" key={c.titulo} delay={i * 0.08}>
              <article className="h-full border-t border-gold pt-7">
                <p className="eyebrow text-ink-soft">Guia {String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-5 text-[1.75rem] leading-[1.08] md:text-[1.9rem]">{c.titulo}</h3>
                <p className="mt-5 text-ink-soft">{c.texto}</p>
              </article>
            </Reveal>
          ))}
        </ul>
        <p className="mt-14 text-sm text-ink-soft">Conteúdo informativo, não substitui a análise do seu caso.</p>
      </div>
    </section>
  );
}
