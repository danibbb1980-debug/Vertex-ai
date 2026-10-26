import { ArrowDown } from "lucide-react";
import { site, whatsappUrl } from "@/lib/site-data";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { HeroVisual } from "./HeroVisual";

const HERO_ID = "inicio";

export function Hero() {
  return (
    <section
      id={HERO_ID}
      aria-labelledby="hero-title"
      className="hero-bg grain relative isolate overflow-hidden lg:min-h-[max(100svh,46rem)]"
    >
      {/* Palavra-fantasma ao fundo: assinatura da marca em escala arquitetônica. */}
      <p
        aria-hidden="true"
        className="ghost-word hero-fade-in pointer-events-none absolute bottom-[-0.08em] left-1/2 z-0 -translate-x-1/2 text-[40vw] whitespace-nowrap lg:left-[63%] lg:text-[22vw]"
        style={{ ["--d" as string]: "200ms" }}
      >
        Tonon
      </p>

      <div className="container-site relative z-10 grid pt-32 pb-6 lg:min-h-[max(100svh,46rem)] lg:grid-cols-12 lg:pt-36 lg:pb-14">
        {/* Texto principal */}
        <div className="relative z-20 flex flex-col justify-center lg:col-span-5 lg:pb-16">
          <p className="label hero-rise text-sage" style={{ ["--d" as string]: "80ms" }}>
            {site.name} · {site.city}, {site.state}
          </p>
          <h1
            id="hero-title"
            className="display h-hero hero-rise mt-7 text-graphite"
            style={{ ["--d" as string]: "160ms" }}
          >
            Reabilitação estética com <em>precisão</em> de laboratório.
          </h1>
          <p className="lead hero-rise mt-7 max-w-[32rem] text-ink" style={{ ["--d" as string]: "260ms" }}>
            Matheus Tonon, especialista em reabilitação estética e CEO do Laboratório Tonon, conduz um trabalho
            de alta performance em reabilitação oral — com atenção a forma, cor e função em cada detalhe.
          </p>
          <div
            className="hero-rise mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7"
            style={{ ["--d" as string]: "360ms" }}
          >
            <Button href={whatsappUrl("schedule")} external icon={<WhatsAppIcon className="h-[1.1rem] w-[1.1rem]" />}>
              Agendar pelo WhatsApp
            </Button>
            <a
              href="#trabalhos"
              className="link-line inline-flex min-h-11 items-center self-start text-[0.8rem] font-semibold tracking-[0.08em] text-graphite uppercase sm:self-center"
            >
              Ver trabalhos
            </a>
          </div>
        </div>

        {/* Objeto 3D: no mobile entra no fluxo abaixo do texto; no desktop ocupa o centro. */}
        <div className="relative -mx-5 mt-4 h-[min(64svh,34rem)] sm:mx-0 lg:absolute lg:inset-y-0 lg:right-[10%] lg:left-[34%] lg:mt-0 lg:h-auto">
          <HeroVisual heroId={HERO_ID} />

          <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
            <div className="annotation absolute top-[17%] right-[2%] flex items-center gap-3">
              <span className="h-px w-16 bg-graphite/40" />
              <span className="text-[0.68rem] font-semibold tracking-[0.2em] text-graphite/80 uppercase">
                Coroa cerâmica
              </span>
            </div>
            <div className="annotation absolute top-[47%] right-[2%] flex items-center gap-3">
              <span className="h-px w-16 bg-graphite/40" />
              <span className="text-[0.68rem] font-semibold tracking-[0.2em] text-graphite/80 uppercase">
                Pilar e implante
                <br />
                em titânio
              </span>
            </div>
          </div>
        </div>

        {/* Informações laterais (desktop) */}
        <aside
          aria-label="Atendimento"
          className="hero-rise relative z-20 hidden flex-col justify-end gap-7 lg:col-span-3 lg:col-start-10 lg:flex lg:pb-16"
          style={{ ["--d" as string]: "480ms" }}
        >
          <dl className="space-y-5 text-sm">
            <div className="border-t border-graphite/15 pt-4">
              <dt className="text-[0.68rem] font-semibold tracking-[0.2em] text-ink uppercase">Atendimento</dt>
              <dd className="mt-1.5 text-graphite">Segunda a sábado, 08h às 18h</dd>
              <dd className="mt-2">
                <OpenStatus />
              </dd>
            </div>
            <div className="border-t border-graphite/15 pt-4">
              <dt className="text-[0.68rem] font-semibold tracking-[0.2em] text-ink uppercase">Endereço</dt>
              <dd className="mt-1.5 text-graphite">
                {site.address.district}
                <br />
                {site.city} — {site.state}
              </dd>
            </div>
            <div className="border-t border-graphite/15 pt-4">
              <dt className="text-[0.68rem] font-semibold tracking-[0.2em] text-ink uppercase">Instagram</dt>
              <dd className="mt-1.5">
                <a
                  href={site.links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-line text-graphite"
                >
                  {site.links.instagramHandle}
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      <a
        href="#laboratorio"
        className="hero-fade-in absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] font-semibold tracking-[0.24em] text-graphite/70 uppercase transition-colors hover:text-graphite lg:flex"
        style={{ ["--d" as string]: "900ms" }}
      >
        Role para explorar
        <ArrowDown className="h-4 w-4 motion-safe:animate-bounce" aria-hidden="true" />
      </a>

      <div aria-hidden="true" className="hero-fade pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28" />
    </section>
  );
}
