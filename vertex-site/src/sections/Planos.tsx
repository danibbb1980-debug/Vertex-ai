import { CONFIG, waLink } from "../config";
import { Em, SectionHead } from "../components/SectionHead";
import { IconCheck, IconMinus, IconWhatsApp } from "../components/Icons";
import { Spot } from "../components/Spot";

const escopo: Record<string, string> = {
  essencial: "Uma página ou cardápio digital",
  completo: "Site com várias seções",
};

export function Planos() {
  return (
    <section id="planos" aria-labelledby="planos-title" className="relative z-10 bg-ink-0 py-24 sm:py-32">
      <div className="container-v">
        <SectionHead
          id="planos-title"
          num="06"
          label="Planos"
          align="center"
          title={
            <>
              Um valor mensal. <Em>Nada</Em> escondido.
            </>
          }
          intro="Sem taxa de criação. Cobrança só após a aprovação. 7 dias de garantia. Domínio por conta do cliente."
        />

        <div className="mx-auto mt-16 grid max-w-5xl gap-5 md:grid-cols-2">
          {CONFIG.planos.map((p, i) => (
            <Spot
              key={p.id}
              data-reveal
              style={{ ["--d" as string]: `${i * 120}ms` }}
              className={`flex flex-col rounded-3xl p-8 sm:p-10 ${p.destaque ? "bg-gradient-to-b from-ink-3 to-ink-2" : "bg-ink-2/70"}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-[0.8rem] font-medium tracking-[0.3em] text-gold-hi uppercase">{p.nome}</h3>
                <span className="rounded-full border border-pearl/12 px-3 py-1 text-[0.75rem] text-mist">{escopo[p.id]}</span>
              </div>
              <p className="mt-8 flex items-baseline gap-2">
                <span className="font-display text-xl text-mist">R$</span>
                <span className="font-display text-[4.5rem] leading-none font-light tracking-[-0.04em] text-pearl">{p.preco}</span>
                <span className="text-mist">/mês</span>
              </p>
              <p className="mt-4 min-h-[3.2em] text-mist">{p.paraQuem}</p>

              <div className="hairline my-8" />

              <ul className="flex-1 space-y-3.5">
                {CONFIG.inclusoEmTodos.map((it) => (
                  <li key={it} className="flex gap-3 text-pearl/90">
                    <IconCheck className="mt-1 size-4 shrink-0 text-gold-hi" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>

              <a
                href={waLink({ plano: p.nome })}
                target="_blank"
                rel="noopener"
                className={`btn mt-10 w-full ${p.destaque ? "btn-gold" : "btn-ghost"}`}
              >
                <IconWhatsApp />
                Quero o plano {p.nome}
              </a>
            </Spot>
          ))}
        </div>

        <div data-reveal className="mx-auto mt-10 grid max-w-5xl gap-6 rounded-2xl border border-pearl/8 p-6 text-[0.93rem] sm:p-8 md:grid-cols-[auto_1fr] md:gap-10">
          <p className="font-display text-[0.75rem] tracking-[0.25em] text-dim uppercase">Não incluso</p>
          <div>
            <ul className="flex flex-wrap gap-x-8 gap-y-2 text-mist">
              {CONFIG.naoIncluso.map((n) => (
                <li key={n} className="flex items-center gap-2">
                  <IconMinus className="size-3.5 text-dim" />
                  {n}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-dim">
              Páginas novas e reformulações grandes são orçadas à parte. O domínio é pago por você e fica registrado no seu nome.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
