import { CONFIG, waLink } from "../config";
import { Label } from "../components/SectionHead";
import { IconCheck, IconWhatsApp } from "../components/Icons";

const escopo: Record<string, string> = {
  essencial: "Uma página ou cardápio digital",
  completo: "Site com várias seções",
};

export function Planos() {
  return (
    <section id="planos" aria-labelledby="planos-title" className="relative z-10 bg-ink-0 py-24 sm:py-32">
      <div className="container-v">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Label>Planos</Label>
            <h2 id="planos-title" className="mt-7 text-[clamp(2.4rem,6vw,4.2rem)] text-pearl">
              Um valor por mês, e nada escondido.
            </h2>
          </div>
          <p className="max-w-md text-mist lg:col-span-4 lg:col-start-9 lg:pb-2">
            Sem taxa de criação. Cobrança só após a aprovação. 7 dias de garantia. Domínio por conta do cliente.
          </p>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-[4px] border border-pearl/12 bg-pearl/12 md:grid-cols-2">
          {CONFIG.planos.map((p) => (
            <div key={p.id} className={`relative flex flex-col p-8 sm:p-10 ${p.destaque ? "bg-ink-2" : "bg-ink-0"}`}>
              {p.destaque && <span className="absolute inset-x-0 top-0 h-[2px] bg-gold" aria-hidden="true" />}
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-display text-[0.8rem] font-medium tracking-[0.26em] text-gold-hi uppercase">{p.nome}</h3>
                <span className="meta">{escopo[p.id]}</span>
              </div>
              <p className="mt-8 flex items-baseline gap-2">
                <span className="font-display text-lg text-mist">R$</span>
                <span className="font-serif text-[5rem] leading-none text-pearl">{p.preco}</span>
                <span className="text-mist">/mês</span>
              </p>
              <p className="mt-4 text-mist md:min-h-[3.2em]">{p.paraQuem}</p>

              <ul className="mt-8 flex-1 space-y-3 border-t border-pearl/10 pt-7">
                {CONFIG.inclusoEmTodos.map((it) => (
                  <li key={it} className="flex gap-3 text-[0.98rem] text-pearl/90">
                    <IconCheck className="mt-1 size-4 shrink-0 text-gold" />
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
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 text-[0.93rem] md:grid-cols-12">
          <p className="meta md:col-span-3">Não incluso</p>
          <div className="md:col-span-9">
            <p className="text-mist">{CONFIG.naoIncluso.join(" · ")}</p>
            <p className="mt-2 text-dim">
              Páginas novas e reformulações grandes são orçadas à parte. O domínio é pago por você e fica registrado no seu nome.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
