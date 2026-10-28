import { CONFIG } from "../config";
import { Blob, Sparkle } from "../components/Decor";
import { IconInstagram } from "../components/Icons";
import { Confirmar, Foto, Titulo } from "../components/ui";

export function Profissional() {
  return (
    <section id="profissional" aria-labelledby="titulo-profissional" className="relative overflow-hidden py-20 md:py-28">
      <div className="container-site grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="reveal relative mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none">
          <Blob variant="a" className="absolute -top-8 -left-10 h-[110%] w-[115%] text-peach-50" />
          <div
            className="relative overflow-hidden shadow-[0_30px_60px_-38px_rgba(29,42,71,0.6)]"
            style={{ borderRadius: "9rem 2.5rem 2.5rem 2.5rem" }}
          >
            <Foto
              {...CONFIG.fotos.perfil}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 24rem, 90vw"
              className="aspect-[3/4] h-auto w-full object-cover"
            />
          </div>
          <Sparkle filled className="cintilar absolute -right-2 bottom-10 h-7 w-7 text-butter" />
        </div>

        <div className="lg:col-span-7">
          <div className="reveal">
            <p className="eyebrow">A profissional</p>
            <Titulo
              id="titulo-profissional"
              texto="Dra. Jessika *Domingues*"
              className="mt-4 text-[2.4rem] leading-[1.05] font-normal sm:text-5xl md:text-6xl"
            />
            <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-lg">
              <span className="font-bold text-ink">{CONFIG.profissao}</span>
              <span aria-hidden className="h-1 w-1 rounded-full bg-sage-500" />
              <span>
                {CONFIG.cro}
                <Confirmar />
              </span>
            </p>
          </div>

          <div className="reveal mt-8 space-y-4 text-lg" style={{ ["--d" as string]: "100ms" }}>
            <p>
              A Dra. Jessika Domingues atende bebês, crianças e adolescentes em Alfenas - MG, com atenção para acolher a
              criança e explicar cada etapa para a família.
            </p>
          </div>

          <div className="reveal mt-8" style={{ ["--d" as string]: "180ms" }}>
            <h3 className="font-sans text-sm font-extrabold tracking-[0.14em] text-ink uppercase">
              {CONFIG.mostrarEspecialidades ? "Especialidades" : "Áreas de atuação"}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {(CONFIG.mostrarEspecialidades ? CONFIG.especialidades : CONFIG.areasDeAtuacao).map((a, i) => (
                <li
                  key={`${a}-${i}`}
                  className="rounded-full border border-line bg-paper px-4 py-2 text-[0.95rem] font-semibold text-ink-2"
                >
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <a
            href={CONFIG.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="reveal btn btn-ghost mt-9"
            style={{ ["--d" as string]: "240ms" }}
          >
            <IconInstagram size={20} />
            {CONFIG.instagramUsuario}
            <span className="sr-only"> (Instagram, abre em nova aba)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
