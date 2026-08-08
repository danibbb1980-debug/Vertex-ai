import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { LinkButton } from "../ui/Button";
import { BrowserFrame, PhoneFrame, SiteSkeleton } from "../ui/Mockups";
import { hero } from "@/lib/content";
import { brl, site } from "@/lib/site";

/**
 * Hero — Server Component.
 *
 * Antes era client-only por causa do framer-motion, e o HTML chegava com
 * opacity:0 inline no <h1>: nada aparecia até o JS hidratar. Agora toda a
 * entrada é CSS (`anim-fade-up` com delay escalonado), que começa na primeira
 * pintura. O JS do hero passou a ser zero.
 */

/**
 * Define o atraso do stagger como custom property, para o CSS poder escalá-lo
 * por breakpoint (ver --stagger em globals.css). Passar animationDelay direto
 * fixaria o valor e impediria o ritmo mais rápido do mobile.
 */
const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as React.CSSProperties;

export function Hero() {
  const [beforeAccent, afterAccent] = hero.headline.split(hero.headlineAccent);

  return (
    <section
      id="top"
      className="relative overflow-hidden px-5 pt-32 pb-20 sm:px-8 sm:pt-40 md:pb-28"
    >
      {/* Fundo ambiente: grade sutil + brilho da marca */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 grid-noise opacity-70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 size-[46rem] -translate-x-1/2 glow-brand"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 -right-40 -z-10 size-[30rem] glow-brand-deep"
        aria-hidden="true"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        {/* Parallax mais suave na coluna de texto (desktop, via scroll-timeline) */}
        <div className="parallax max-w-2xl" style={{ "--parallax-shift": "40px" } as React.CSSProperties}>
          {/* Reversão de risco antes do H1 */}
          <ul className="anim-fade-up mb-7 flex flex-wrap items-center gap-x-2 gap-y-2">
            {hero.assurances.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-mist"
              >
                <Check className="size-3 text-mint" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>

          <h1
            className="anim-fade-up text-4xl font-semibold sm:text-5xl md:text-6xl md:leading-[1.05]"
            style={delay(0.08)}
          >
            {beforeAccent}
            <span className="text-gradient">{hero.headlineAccent}</span>
            {afterAccent}
          </h1>

          <p
            className="anim-fade-up mt-5 text-lg font-medium text-cloud/85 sm:text-xl"
            style={delay(0.16)}
          >
            {hero.sub}
          </p>

          <p
            className="anim-fade-up mt-4 max-w-xl text-base leading-relaxed text-mist"
            style={delay(0.22)}
          >
            {hero.description}
          </p>

          <div className="anim-fade-up mt-9 flex flex-col gap-3 sm:flex-row" style={delay(0.3)}>
            <LinkButton href="#contato" size="lg" trackAs="hero">
              {hero.ctaPrimary}
              <ArrowRight className="size-4" aria-hidden="true" />
            </LinkButton>
            <LinkButton href="#projetos" variant="secondary" size="lg" trackAs="hero">
              {hero.ctaSecondary}
            </LinkButton>
          </div>

          <p className="anim-fade-up mt-4 text-sm text-mist-dim" style={delay(0.36)}>
            {hero.ctaMicrocopy}
          </p>

          {/* Preço transparente cedo: qualifica o visitante e sinaliza confiança */}
          <div
            className="anim-fade-up mt-10 flex flex-col gap-4 border-t border-line pt-7 sm:flex-row sm:items-center sm:gap-8"
            style={delay(0.42)}
          >
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-3xl font-semibold text-cloud">
                {brl(site.price)}
              </span>
              <span className="text-sm text-mist">/mês</span>
            </div>
            <ul className="flex flex-col gap-1.5">
              {hero.trust.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-mist">
                  <ShieldCheck className="size-3.5 shrink-0 text-brand-bright" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Visual: navegador + celular flutuando */}
        <div
          className="parallax relative mx-auto w-full max-w-lg lg:max-w-none"
          style={{ "--parallax-shift": "90px" } as React.CSSProperties}
        >
          <div className="anim-rise-in relative" style={delay(0.2)}>
            <div className="anim-float">
              <BrowserFrame url={`${site.domain}/sua-empresa`}>
                <SiteSkeleton />
              </BrowserFrame>
            </div>

            <div className="anim-float-soft absolute -bottom-14 left-0 w-28 sm:-left-6 sm:w-32 lg:-left-10 lg:w-36">
              <PhoneFrame>
                <SiteSkeleton compact />
              </PhoneFrame>
            </div>

            {/* Selo que explica o modelo em quatro palavras */}
            <div
              className="anim-pop-in absolute -top-5 right-0 rounded-xl border border-line bg-ink/90 px-4 py-3 shadow-2xl backdrop-blur-xl sm:-right-6"
              style={delay(0.9)}
            >
              <p className="font-display text-lg font-semibold leading-none">
                {brl(site.price)}
                <span className="text-xs font-normal text-mist">/mês</span>
              </p>
              <p className="mt-1 text-[0.68rem] text-mist-dim">tudo incluso</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
