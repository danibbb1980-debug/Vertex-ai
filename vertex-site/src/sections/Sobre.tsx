import { CONFIG } from "../config";
import { Label } from "../components/SectionHead";

export function Sobre() {
  return (
    <section aria-labelledby="sobre-title" className="on-light relative z-10 bg-ivory-2 py-24 text-cocoa sm:py-32">
      <div className="container-v grid gap-12 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-4">
          <Label>Sobre a Vertex</Label>
          {CONFIG.fotoResponsavel ? (
            <figure className="mt-8 max-w-xs">
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
          <h2 id="sobre-title" className="text-[clamp(1.9rem,4.6vw,3rem)] leading-[1.12]">
            Um estúdio de Poços de Caldas, feito para as empresas da cidade e da região.
          </h2>
          <div className="mt-8 grid gap-6 text-[1.08rem] leading-relaxed text-cocoa-2 sm:grid-cols-2">
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
