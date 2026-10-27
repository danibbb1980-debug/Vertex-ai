import { ArrowDown, MapPin } from "lucide-react";
import type { CSSProperties } from "react";
import { defaultMessage, site, whatsappUrl } from "@/lib/site";
import { WhatsAppIcon } from "../ui/BrandIcons";
import { ButtonLink } from "../ui/Button";
import { WaveMark } from "../ui/WaveMark";
import { ToothStage } from "./ToothStage";

const delay = (ms: number) => ({ "--rise-delay": `${ms}ms` }) as CSSProperties;

/**
 * Server Component: texto, CTAs e cenário são HTML estático. Só o palco do
 * dente (ToothStage) roda no cliente.
 */
export function HeroSection() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-sun">
      {/* Textura sutil: o amarelo ganha profundidade sem gradiente chamativo. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_78%_38%,#fff3bf_0%,rgba(255,243,191,0)_55%)]"
      />

      <div className="mx-auto grid max-w-[1240px] items-center gap-y-2 px-5 pb-20 pt-8 sm:gap-y-6 sm:px-8 sm:pb-24 sm:pt-14 lg:min-h-[calc(100svh-4.75rem)] lg:grid-cols-12 lg:gap-x-8 lg:pb-32 lg:pt-8">
        {/* Texto */}
        <div className="lg:col-span-6 lg:pb-6">
          <div className="hero-rise eyebrow text-navy" style={delay(0)}>
            <p className="flex items-center gap-3">
              <WaveMark />
              <span>Dentista Volte a Sorrir</span>
            </p>
            <p className="mt-1.5 pl-10 font-semibold tracking-[0.2em] text-navy/80">Alfenas · Minas Gerais</p>
          </div>

          <h1
            id="hero-title"
            className="hero-rise font-display mt-6 text-[clamp(2.6rem,9.6vw,3.6rem)] sm:mt-7 font-[420] leading-[1.02] text-navy-deep sm:text-[clamp(3.4rem,6.4vw,5.1rem)]"
            style={delay(80)}
          >
            Seu sorriso <br />
            merece cuidado <br />
            <em className="whitespace-nowrap font-[380] italic text-coral-ink">de verdade.</em>
          </h1>

          <p
            className="hero-rise mt-5 max-w-[34rem] text-[1.05rem] leading-relaxed sm:mt-6 text-navy/80 sm:text-lg"
            style={delay(160)}
          >
            Tratamento odontológico personalizado para você e sua família, com atenção às suas necessidades e
            cuidado em cada etapa.
          </p>

          <div className="hero-rise mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center" style={delay(240)}>
            <ButtonLink href={whatsappUrl(defaultMessage)} external icon={<WhatsAppIcon className="size-5" />}>
              Agende pelo WhatsApp
            </ButtonLink>
            <ButtonLink
              href="#tratamentos"
              variant="secondary"
              icon={<ArrowDown className="size-4 transition-transform duration-200 group-hover:translate-y-0.5" strokeWidth={2} />}
            >
              Conheça nossos tratamentos
            </ButtonLink>
          </div>

          <p className="hero-rise mt-9 hidden items-center gap-2 text-sm font-semibold text-navy/75 sm:flex" style={delay(320)}>
            <MapPin className="size-4 text-coral-ink" strokeWidth={2.2} aria-hidden />
            {site.city} — {site.state}
          </p>
        </div>

        {/* Dente 3D */}
        <div className="relative mx-auto w-full max-w-[21rem] sm:max-w-[26rem] lg:col-span-6 lg:max-w-none">
          <div className="relative mx-auto w-full max-w-[34rem]">
            <HeroBackdrop />
            <ToothStage />
          </div>
        </div>
      </div>

      {/* Transição para a seção seguinte: curva suave como a do símbolo. */}
      <svg
        aria-hidden
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-[-1px] h-14 w-full text-paper sm:h-20 lg:h-24"
      >
        <path d="M0 120V58C240 8 520 -6 760 30c210 31 430 74 680 18v72H0Z" fill="currentColor" />
      </svg>
    </section>
  );
}

/** Disco claro atrás do dente e o arco derivado do símbolo. */
function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute left-1/2 top-[47%] aspect-square w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_50%_42%,#fffdf3_0%,#fff6cf_58%,rgba(255,240,176,0)_72%)]" />
      {/* Meia-lua afinada nas pontas, como a curva amarela dentro da coroa do logo. */}
      <svg viewBox="0 0 400 400" className="absolute left-1/2 top-[47%] w-[96%] -translate-x-1/2 -translate-y-1/2" fill="none">
        <path d="M33.7 296.0 L29.4 289.0 L25.4 281.7 L21.8 274.2 L18.5 266.5 L15.6 258.7 L13.0 250.8 L10.8 242.8 L8.9 234.6 L7.4 226.4 L6.3 218.1 L5.5 209.7 L5.1 201.4 L5.0 193.0 L5.3 184.6 L6.0 176.2 L7.1 167.8 L8.6 159.5 L10.4 151.3 L12.5 143.2 L15.0 135.1 L17.9 127.2 L21.1 119.4 L24.7 111.7 L28.6 104.2 L32.9 96.9 L37.4 89.8 L42.3 82.9 L47.5 76.2 L52.9 69.7 L58.6 63.5 L64.7 57.5 L70.9 51.9 L77.4 46.5 L84.2 41.4 L91.1 36.6 L98.3 32.1 L105.7 27.9 L113.2 24.1 L120.9 20.6 L128.7 17.4 L136.6 14.6 L144.7 12.2 L152.9 10.1 L161.1 8.4 L169.4 7.0 L177.8 6.0 L186.2 5.4 L194.6 5.1 L202.9 5.3 L211.3 5.7 L219.6 6.6 L227.9 7.8 L236.1 9.4 L244.2 11.4 L252.3 13.7 L260.2 16.3 L267.9 19.3 L275.5 22.7 L282.9 26.4 L290.1 30.5 L290.1 30.5 L282.6 27.1 L274.9 24.0 L267.2 21.2 L259.4 18.8 L251.4 16.6 L243.4 14.8 L235.4 13.3 L227.3 12.2 L219.2 11.4 L211.0 10.9 L202.9 10.8 L194.7 11.0 L186.6 11.6 L178.5 12.5 L170.5 13.7 L162.5 15.3 L154.7 17.2 L146.9 19.5 L139.2 22.0 L131.6 24.9 L124.2 28.1 L116.9 31.6 L109.7 35.4 L102.8 39.5 L96.0 43.8 L89.4 48.5 L83.0 53.4 L76.8 58.6 L70.9 64.1 L65.1 69.8 L59.6 75.7 L54.4 81.8 L49.4 88.2 L44.7 94.7 L40.3 101.5 L36.2 108.4 L32.3 115.5 L28.8 122.8 L25.5 130.2 L22.6 137.8 L20.0 145.4 L17.7 153.2 L15.7 161.1 L14.1 169.0 L12.8 177.0 L11.9 185.1 L11.2 193.2 L10.9 201.3 L11.0 209.5 L11.4 217.6 L12.1 225.7 L13.2 233.8 L14.7 241.9 L16.4 249.9 L18.5 257.8 L20.9 265.6 L23.7 273.4 L26.8 281.0 L30.1 288.6 L33.7 296.0Z" fill="#f4c62d" />
      </svg>
    </div>
  );
}
