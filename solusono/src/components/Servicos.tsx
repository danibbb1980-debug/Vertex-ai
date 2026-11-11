import { CONFIG, linkWhatsapp } from "../config";
import { IconeSeta, IconeWhatsapp } from "./Icones";

function TituloComEnfase({ texto, enfase }: { texto: string; enfase?: string }) {
  if (!enfase || !texto.includes(enfase)) return <>{texto}</>;
  const [a, b] = texto.split(enfase);
  return (
    <>
      {a}
      <em>{enfase}</em>
      {b}
    </>
  );
}

/** Lista editorial numerada (adaptada do "Editorial service list" do 21st.dev). */
export function Servicos() {
  const grupos = CONFIG.servicos.filter((g) => g.itens.length);
  if (!grupos.length) return null;
  return (
    <section id="servicos" aria-labelledby="servicos-titulo" className="bg-mist py-24 md:py-36">
      <div className="container-site">
        <div className="grid gap-y-6 md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-7">
            <p className="rotulo">Serviços</p>
            <h2 id="servicos-titulo" className="titulo mt-5 text-[clamp(2.4rem,5.4vw,4.4rem)]">
              Da avaliação ao <em>{"dia\u00a0a\u00a0dia"}</em> com o tratamento.
            </h2>
          </div>
          <p className="self-end text-muted md:col-span-4 md:col-start-9">
            No consultório, em casa ou online. Cada atendimento depende de avaliação individual.
          </p>
        </div>

        <ol className="mt-16 border-b border-line md:mt-24">
          {grupos.map((g, i) => (
            <li key={g.id} className="group/linha border-t border-line">
              <article className="grid gap-y-6 py-10 transition-[padding] duration-500 ease-[var(--ease-calma)] md:grid-cols-12 md:gap-x-8 md:py-14 md:hover:pl-4">
                <div className="flex items-baseline gap-5 md:col-span-5 md:block">
                  <span className="num block text-[2.2rem] leading-none text-brand md:text-[4.5rem]" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="md:mt-6">
                    <h3 className="titulo text-[2rem] md:text-[2.75rem]">
                      <TituloComEnfase texto={g.titulo} enfase={g.enfase} />
                    </h3>
                    <p className="mt-3 max-w-[36ch] text-muted">{g.resumo}</p>
                  </div>
                </div>

                <div className="md:col-span-7">
                  <dl className="divide-y divide-line">
                    {g.itens.map((s) => (
                      <div key={s.nome} className="py-5 first:pt-0">
                        <dt className="text-[1.05rem] font-semibold text-ink">{s.nome}</dt>
                        <dd className="mt-1.5 max-w-[58ch] text-muted">{s.texto}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                    <p className="text-sm text-muted">Depende de avaliação individual.</p>
                    <a
                      href={linkWhatsapp(CONFIG.mensagens.servico(g.assuntoWhatsapp))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex min-h-12 items-center gap-2.5 rounded-full px-1 font-semibold text-brand"
                    >
                      <IconeWhatsapp className="h-5 w-5" />
                      <span className="link-sublinhado">Perguntar sobre {g.titulo.toLowerCase()}</span>
                      <IconeSeta className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
                    </a>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
