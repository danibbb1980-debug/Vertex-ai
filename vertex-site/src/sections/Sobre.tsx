import { CONFIG } from "../config";
import { Em } from "../components/SectionHead";

export function Sobre() {
  return (
    <section aria-labelledby="sobre-title" className="on-light relative z-10 bg-ivory-2 py-24 text-cocoa sm:py-32">
      <div className="container-v grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-4">
          <p data-reveal className="flex items-center gap-4">
            <span className="num">08</span>
            <span className="h-px w-10 bg-[#7a5a17]/50" aria-hidden="true" />
            <span className="eyebrow">Sobre a Vertex</span>
          </p>
          {CONFIG.fotoResponsavel ? (
            <figure data-reveal className="mt-8 max-w-xs">
              <img
                src={CONFIG.fotoResponsavel}
                alt={CONFIG.nomeResponsavel ? `${CONFIG.nomeResponsavel}, responsável pela Vertex Web Studios` : "Responsável pela Vertex Web Studios"}
                width={480}
                height={600}
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full rounded-2xl object-cover"
              />
              {CONFIG.nomeResponsavel && <figcaption className="mt-3 text-[0.9rem] text-cocoa-2">{CONFIG.nomeResponsavel}</figcaption>}
            </figure>
          ) : null}
        </div>
        <div className="lg:col-span-8">
          <h2 id="sobre-title" data-reveal className="text-[clamp(1.9rem,4.6vw,3rem)] leading-[1.12]">
            Um estúdio de <Em>Poços de Caldas,</Em> feito para as empresas da cidade e da região.
          </h2>
          <div data-reveal style={{ ["--d" as string]: "120ms" }} className="mt-8 grid gap-6 text-[1.08rem] leading-relaxed text-cocoa-2 sm:grid-cols-2">
            <p>
              A Vertex nasceu para ajudar negócios locais a ter uma presença digital à altura do trabalho que fazem.
              O atendimento é próximo, direto pelo WhatsApp, com quem cria o seu site.
            </p>
            <p>
              Estamos começando, e é justamente por isso que mostramos o trabalho antes de cobrar. Este site é o nosso
              cartão de visitas: o mesmo cuidado vai para o seu.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
