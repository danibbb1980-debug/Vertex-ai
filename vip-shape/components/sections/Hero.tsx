import type { CSSProperties } from "react";
import { ArrowDown, Dumbbell, HeartHandshake, Star } from "lucide-react";
import { photos, site, whatsappUrl } from "@/lib/site-data";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-ink lg:min-h-[52rem]"
    >
      {/* Fotografia: fundo de tela cheia no mobile, coluna à direita no desktop. */}
      <div className="absolute inset-0 -z-10 overflow-hidden lg:inset-y-0 lg:right-0 lg:left-auto lg:w-[54%]">
        <div className="hero-photo absolute inset-0">
          <Photo
            photo={photos.cardio}
            priority
            sizes="(min-width: 1024px) 54vw, 100vw"
            className="h-full w-full"
            imgClassName="object-[50%_35%]"
          />
        </div>
        {/* Gradientes que fundem a foto com o fundo e garantem leitura do texto. */}
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/80 to-ink/25 lg:bg-linear-to-r lg:from-ink lg:via-ink/35 lg:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-ink to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-ink/80 to-transparent" />
      </div>

      {/* Luz laranja e contorno hexagonal — conduzem o olhar até o CTA. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-40 -z-10 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(closest-side,rgb(255_90_31/0.22),transparent)]"
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 120 130"
        className="pointer-events-none absolute top-[14%] right-[-12%] -z-10 hidden w-[34rem] opacity-60 lg:block xl:right-[-6%]"
      >
        <path d="M110 36 60 7 10 36v58l50 29 50-29" fill="none" stroke="var(--color-orange)" strokeWidth=".6" />
        <path d="M100 40 60 17 20 40v50l40 23 40-23" fill="none" stroke="var(--color-orange)" strokeWidth=".35" />
      </svg>

      <div className="container-site flex flex-1 flex-col justify-end pt-28 pb-10 sm:pb-14 lg:justify-center lg:pt-32 lg:pb-24">
        <div className="max-w-[46rem]">
          <p className="eyebrow hero-rise" style={delay(80)}>
            VIP Shape Academia • {site.city}
          </p>

          <h1
            id="hero-title"
            className="display hero-rise mt-5 text-[3rem] leading-[0.92] min-[400px]:text-[3.4rem] sm:text-7xl lg:text-[5rem] xl:text-[5.6rem]"
            style={delay(160)}
          >
            Seu <span className="text-orange">próximo nível</span> começa aqui.
          </h1>

          <p className="hero-rise mt-6 max-w-md text-base text-white/80 sm:text-lg" style={delay(260)}>
            Mais energia, mais movimento e uma estrutura preparada para acompanhar a sua evolução.
            Encontre seu ritmo e venha treinar com a gente.
          </p>

          <div className="hero-rise mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4" style={delay(340)}>
            <Button href={whatsappUrl("start")} external icon={<WhatsAppIcon className="h-5 w-5" />}>
              Quero começar
            </Button>
            <Button href="#estrutura" variant="outline">
              Conheça nossa estrutura
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
            </Button>
          </div>

          {/* Indicadores de confiança */}
          <ul
            className="hero-rise mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/12 pt-6 text-sm sm:flex sm:flex-wrap sm:gap-x-8"
            style={delay(440)}
            aria-label="Destaques da VIP Shape"
          >
            <li className="flex items-center gap-2.5">
              <Star className="h-4 w-4 fill-orange text-orange" aria-hidden="true" />
              <span>
                <strong className="font-display text-base text-white">{site.rating.value}</strong>{" "}
                <span className="text-mist">no Google</span>
              </span>
            </li>
            <li className="flex items-center gap-2.5 text-mist">
              <span className="font-display text-base font-bold text-white">{site.rating.count}</span> avaliações
            </li>
            <li className="flex items-center gap-2.5 text-mist">
              <Dumbbell className="h-4 w-4 shrink-0 text-orange" aria-hidden="true" />
              Equipamentos modernos
            </li>
            <li className="flex items-center gap-2.5 text-mist">
              <HeartHandshake className="h-4 w-4 shrink-0 text-orange" aria-hidden="true" />
              Atendimento acolhedor
            </li>
          </ul>
        </div>
      </div>

      {/* Legenda da foto, só no desktop. */}
      <p className="absolute right-8 bottom-8 hidden items-center gap-3 text-[0.7rem] font-medium tracking-[0.2em] text-white/70 uppercase lg:flex">
        <span className="h-px w-10 bg-orange" />
        Área de cardio
      </p>
    </section>
  );
}
