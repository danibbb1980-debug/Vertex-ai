import { CONFIG } from "../config";
import { AccessIcon, CalendarIcon, CardIcon, CheckIcon, HandIcon, LayersIcon } from "./Icons";
import { Reveal } from "./Reveal";

export function Estrutura() {
  const e = CONFIG.estrutura;
  return (
    <section id="estrutura" aria-labelledby="estrutura-titulo" className="py-20 sm:py-28">
      <div className="wrap">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Estrutura</p>
          <h2 id="estrutura-titulo" className="h2 mt-4">
            Pensado para <em className="enfase">receber</em> bem.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-6">
          <Reveal className="card relative overflow-hidden p-7 md:col-span-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand-ink">
              <LayersIcon />
            </span>
            <h3 className="mt-5 font-display text-2xl font-semibold text-night">{e.andares} andares</h3>
            <p className="mt-2 max-w-sm leading-relaxed text-graphite-soft">O centro funciona em três andares, cada um com o seu contato de WhatsApp. Na dúvida, fale com a recepção e ela orienta você.</p>
            <div className="mt-8 grid max-w-[15rem] gap-2" aria-hidden>
              {["2º andar", "1º andar", "Térreo"].map((a, i) => (
                <div key={a} className="flex h-12 items-center justify-between rounded-xl px-4 font-display text-sm font-semibold text-white" style={{ background: ["#1574B2", "#1982C4", "#0F5F93"][i], marginLeft: `${i * 0.75}rem` }}>
                  {a}
                  <span className="h-2.5 w-2.5 rounded-[3px] bg-white/70" />
                </div>
              ))}
            </div>
          </Reveal>

          <div className="grid gap-4 md:col-span-3">
            <Reveal delay={0.05} className="card p-7">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand-ink">
                  <AccessIcon />
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-night">Acessibilidade</h3>
                  <ul className="mt-3 grid gap-2 text-graphite-soft">
                    {e.acessibilidade.map((x) => (
                      <li key={x} className="flex gap-2">
                        <CheckIcon className="mt-0.5 shrink-0 text-brand-ink" /> {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              <Reveal delay={0.1} className="card p-7">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand-ink">
                  <CalendarIcon />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-night">Hora marcada</h3>
                <p className="mt-2 leading-relaxed text-graphite-soft">É recomendado agendar antes de vir.</p>
              </Reveal>
              <Reveal delay={0.15} className="card p-7">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand-ink">
                  <CardIcon />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-night">Pagamento</h3>
                <ul className="mt-3 grid gap-1.5 text-[0.95rem] text-graphite-soft">
                  {e.pagamentos.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>

        {CONFIG.mostrarAcolhimento && (
          <Reveal className="mt-4">
            <div className="flex flex-col gap-4 rounded-mod border border-sand-ink/15 bg-sand p-6 sm:flex-row sm:items-center sm:p-7">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-sand-ink">
                <HandIcon />
              </span>
              <p className="leading-relaxed text-sand-ink">
                <strong className="font-display font-semibold">Acolhimento.</strong> O Med Center acolhe a comunidade LGBTQ+ e é um espaço seguro para pessoas
                transgênero.
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

