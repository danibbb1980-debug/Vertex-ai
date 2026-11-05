import { CONFIG, MSG, waLink } from "../config";
import { Branch, Relief } from "./Ornaments";
import { MaskedLines, ScrollWords } from "./TextReveal";
import { Btn, IconWhats } from "./ui";

export function Hero() {
  // Entrada do hero em CSS: aparece já no HTML pré-renderizado, sem esperar o JS.
  const fade = (d: number) => ({ className: "hero-in", style: { animationDelay: `${d}s` } });

  return (
    <section
      id="inicio"
      data-tone="dark"
      tabIndex={-1}
      aria-labelledby="hero-titulo"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-[128px] pb-12 md:pt-[136px] md:pb-14"
    >
      {/* relevo + ramo */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 text-[var(--line-strong)] opacity-70" aria-hidden>
        <Relief className="ml-auto block h-[46svh] w-full max-w-[1100px] translate-x-[18%] md:h-[72svh] md:translate-x-[8%]" />
      </div>
      <Branch className="pointer-events-none absolute top-[118px] right-[6%] -z-10 hidden w-[180px] text-[var(--accent)] opacity-60 md:block lg:w-[220px]" />

      <div className="wrap flex flex-1 flex-col">
        <p {...fade(0)}>
          <span className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>Advocacia previdenciária</span>
          <span aria-hidden className="text-[var(--accent)]">·</span>
          <span>
            {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}
          </span>
          </span>
        </p>

        <MaskedLines
          lines={["Seus benefícios,", "explicados com", "*clareza*."]}
          className="display mt-7 text-[clamp(3rem,0.6rem+7vw,8.4rem)] md:mt-8"
          delay={0.12}
          css
        />
        <span id="hero-titulo" className="sr-only">
          Seus benefícios, explicados com clareza.
        </span>

        <div aria-hidden className="hero-rule mt-9 h-px w-full origin-left bg-[var(--line-strong)] md:mt-10" />

        <div className="mt-8 grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7 lg:col-span-6">
            <div {...fade(0.7)}>
            <p className="lead max-w-[34ch] !text-[var(--fg)]/85">
              Orientação jurídica em direito previdenciário, com escuta, clareza e acompanhamento do início ao fim.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Btn href={waLink(MSG.geral)} external icon={<IconWhats className="h-5 w-5" />}>
                Falar pelo WhatsApp
              </Btn>
              <Btn href="#areas" variant="ghost">
                Conhecer as áreas
              </Btn>
            </div>
            </div>
          </div>

          <dl
            className="hero-in grid grid-cols-2 gap-x-6 gap-y-5 self-end text-[0.9375rem] md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9"
            style={{ animationDelay: "0.85s" }}
          >
            <div>
              <dt className="eyebrow !text-[0.6875rem]">Atendimento</dt>
              <dd className="mt-1.5">
                Presencial em {CONFIG.endereco.cidade}
                {CONFIG.atendeOnline && <span className="muted block">e consultoria à distância</span>}
              </dd>
            </div>
            <div>
              <dt className="eyebrow !text-[0.6875rem]">Horário</dt>
              <dd className="mt-1.5">
                Seg. a sex.
                <span className="muted block">{CONFIG.horario.periodos.join(" · ")}</span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

export function Manifesto() {
  return (
    <section data-tone="dark" aria-label="Manifesto" className="relative">
      <ScrollWords
        className="h2 max-w-[22ch] !text-[clamp(2rem,1.1rem+3.9vw,4.9rem)] !leading-[1.08]"
        text="Por trás de cada pedido há uma história de trabalho, saúde e família, e ela merece ser ouvida com atenção, explicada com clareza e acompanhada com responsabilidade."
      />
    </section>
  );
}
