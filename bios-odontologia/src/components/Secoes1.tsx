import { useId, useState } from "react";
import { CONFIG, atendimentosVisiveis, msgAtendimento, temResponsavel, waLink } from "../config";
import { Regua } from "./Regua";
import { WordmarkLente } from "./WordmarkLente";

const CONTEINER = "mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8";

/* ============================== HERO ============================== */
export function Hero() {
  return (
    <section id="topo" aria-labelledby="titulo-hero" className="relative pt-[7.5rem] sm:pt-28">
      <div className={CONTEINER}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 pb-3 sm:pb-4">
          <p className="rotulo m-0 text-bronze-texto">
            Instituto de Odontologia e Estética<span aria-hidden="true" className="hidden sm:inline"> · </span>
            <span className="sr-only sm:hidden"> · </span>
            <span className="block sm:inline">Varginha - MG</span>
          </p>
          <p className="rotulo m-0 hidden text-cinza md:block">
            {CONFIG.endereco.rua}, {CONFIG.endereco.numero}
          </p>
        </div>

        <WordmarkLente />

        <Regua className="mt-3 sm:mt-4" />

        <div className="grid gap-x-10 gap-y-6 pb-16 pt-7 sm:pb-24 md:grid-cols-12 md:pt-8">
          <h1 id="titulo-hero" className="t-display m-0 md:col-span-7 lg:col-span-7">
            Odontologia e estética, planejadas em <em>detalhe</em>.
          </h1>
          <div className="flex flex-col gap-6 md:col-span-5 md:pt-2 lg:col-span-4 lg:col-start-9">
            <p className="m-0 max-w-[34ch] text-lg leading-relaxed text-cinza">
              Avaliação individual e horário marcado, na {CONFIG.endereco.bairro}, em {CONFIG.endereco.cidade}.
            </p>
            <div className="flex flex-col gap-3 xs:flex-row xs:flex-wrap">
              {CONFIG.usarWhatsapp && (
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="botao botao-cheio">
                  Agendar avaliação
                </a>
              )}
              {CONFIG.secoes.instituto && (
                <a href="#instituto" className="botao botao-linha">
                  Conhecer o instituto
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================== O INSTITUTO ============================== */
export function Instituto() {
  const frentes = atendimentosVisiveis();
  const rt = temResponsavel();
  return (
    <section id="instituto" aria-labelledby="titulo-instituto" className="escuro grao bg-grafite text-pedra">
      <div className={`${CONTEINER} relative z-[1] py-20 sm:py-28`}>
        <Regua className="mb-10 sm:mb-14" cor="#A8894F" />
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="titulo-instituto" className="t-h2 m-0">
              O <em>instituto</em>
            </h2>
            <p className="mt-6 max-w-[36ch] text-cinza-claro">
              Um endereço em {CONFIG.endereco.cidade} com atendimento em {frentes.length === 4 ? "quatro" : frentes.length} frentes. Cada
              caso começa por uma avaliação individual.
            </p>
            {rt && (
              <p className="mt-8 border-t border-white/15 pt-4 text-[0.9375rem] text-cinza-claro">
                Responsável técnico: {CONFIG.responsavelTecnico.nome} · {CONFIG.responsavelTecnico.cro}
                {CONFIG.registroCRO && (
                  <>
                    <br />
                    Inscrição da entidade no CRO: {CONFIG.registroCRO}
                  </>
                )}
              </p>
            )}
          </div>

          <ul className="m-0 list-none p-0 lg:col-span-8">
            {frentes.map((f) => (
              <li
                key={f.id}
                className="grid gap-2 border-t border-bronze/50 py-6 last:border-b sm:grid-cols-[1fr_minmax(0,17rem)] sm:items-baseline sm:gap-8 sm:py-8"
              >
                <h3 className="m-0 font-display text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.04] tracking-[-0.025em]">
                  {f.nome}
                </h3>
                <p className="m-0 text-[0.9375rem] leading-relaxed text-cinza-claro">{f.linha}</p>
              </li>
            ))}
          </ul>
        </div>

        {CONFIG.equipe.length > 0 && (
          <div className="mt-16 grid gap-6 lg:grid-cols-12">
            <h3 className="rotulo m-0 text-bronze-claro lg:col-span-4">Equipe</h3>
            <ul className="m-0 list-none p-0 lg:col-span-8">
              {CONFIG.equipe.map((p) => (
                <li
                  key={p.nome + p.cro}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-white/15 py-4"
                >
                  <span className="font-display text-2xl">{p.nome}</span>
                  <span className="num text-[0.9375rem] text-cinza-claro">
                    {p.cro}
                    {p.especialidade ? ` · ${p.especialidade}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {CONFIG.fotos.length > 0 && (
          <div className="mt-16 grid gap-x-6 gap-y-10 sm:mt-24 lg:grid-cols-12">
            {CONFIG.fotos.map((f, i) => {
              const principal = i === 0;
              return (
                <figure
                  key={f.src}
                  className={`m-0 ${
                    principal ? "lg:col-span-8" : "lg:col-span-4 lg:self-end"
                  }`}
                >
                  <picture>
                    {f.webp && <source srcSet={f.webp} type="image/webp" />}
                    <img
                      src={f.src}
                      alt={f.alt}
                      width={f.largura}
                      height={f.altura}
                      loading="lazy"
                      decoding="async"
                      className={`foto block w-full object-cover ${principal ? "aspect-[4/3]" : "aspect-[4/3] lg:aspect-[4/5]"}`}
                      style={{ objectPosition: f.foco }}
                    />
                  </picture>
                  {f.legenda && (
                    <figcaption className="mt-3 flex items-baseline gap-3 text-[0.875rem] text-cinza-claro">
                      <span aria-hidden="true" className="h-px w-6 shrink-0 translate-y-[-0.25em] bg-bronze" />
                      {f.legenda}
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================== ATENDIMENTOS ============================== */
function Sinal({ aberto }: { aberto: boolean }) {
  return (
    <span aria-hidden="true" className="relative block size-5 shrink-0">
      <span className="absolute left-0 top-1/2 h-px w-5 -translate-y-1/2 bg-current" />
      <span
        className={`absolute left-1/2 top-0 h-5 w-px -translate-x-1/2 bg-current transition-transform duration-300 ${
          aberto ? "scale-y-0" : ""
        }`}
      />
    </span>
  );
}

export function Atendimentos() {
  const itens = atendimentosVisiveis();
  const [aberto, setAberto] = useState<string | null>(itens[0]?.id ?? null);
  const base = useId().replace(/[^a-zA-Z0-9]/g, "");
  if (!itens.length) return null;
  return (
    <section id="atendimentos" aria-labelledby="titulo-atendimentos" className="py-20 sm:py-28">
      <div className={`${CONTEINER} grid gap-12 lg:grid-cols-12`}>
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <p className="rotulo m-0 text-bronze-texto">Atendimentos</p>
            <h2 id="titulo-atendimentos" className="t-h2 mb-0 mt-5">
              Cada frente, um <em>planejamento</em>.
            </h2>
            <p className="mt-6 max-w-[38ch] text-cinza">
              Abra cada atendimento para ler como ele começa. A indicação de qualquer procedimento depende de avaliação
              individual por profissional habilitado.
            </p>
          </div>
        </div>

        <ol className="m-0 list-none p-0 lg:col-span-8">
          {itens.map((a, i) => {
            const estaAberto = aberto === a.id;
            const idBotao = `${base}-b-${a.id}`;
            const idPainel = `${base}-p-${a.id}`;
            const travar = !estaAberto ? ({ inert: "" } as Record<string, string>) : {};
            return (
              <li key={a.id} className="border-t border-grafite last:border-b">
                <h3 className="m-0">
                  <button
                    id={idBotao}
                    type="button"
                    aria-expanded={estaAberto}
                    aria-controls={idPainel}
                    onClick={() => setAberto(estaAberto ? null : a.id)}
                    className="group grid min-h-20 w-full cursor-pointer grid-cols-[3rem_1fr_auto] items-baseline gap-3 py-6 text-left sm:grid-cols-[5rem_1fr_auto] sm:py-8"
                  >
                    <span className="num font-display text-xl text-bronze-texto sm:text-2xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[clamp(1.625rem,3.6vw,3rem)] leading-[1.05] tracking-[-0.025em] transition-transform duration-500 ease-out group-hover:translate-x-2 motion-reduce:transition-none">
                      {a.nome}
                    </span>
                    <span className="self-center">
                      <Sinal aberto={estaAberto} />
                    </span>
                  </button>
                </h3>
                <div id={idPainel} role="region" aria-labelledby={idBotao} className="painel" data-aberto={estaAberto} {...travar}>
                  <div>
                    <div className="grid gap-6 pb-10 sm:grid-cols-[5rem_1fr] sm:gap-3">
                      <span aria-hidden="true" />
                      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end md:gap-10">
                        <div>
                          <p className="m-0 max-w-[58ch] text-[1.0625rem] leading-relaxed">{a.descricao}</p>
                          <p className="mb-0 mt-4 max-w-[58ch] text-[0.9375rem] text-cinza">
                            A indicação depende de avaliação individual por profissional habilitado.
                          </p>
                        </div>
                        {CONFIG.usarWhatsapp && (
                          <a
                            href={waLink(msgAtendimento(a.nome))}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="botao botao-linha self-start"
                            aria-label={`Agendar avaliação sobre ${a.nome.toLowerCase()} pelo WhatsApp`}
                          >
                            Agendar avaliação
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export { CONTEINER };
