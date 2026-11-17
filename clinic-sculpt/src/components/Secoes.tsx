import { Fragment, useEffect, useId, useRef, useState } from "react";
import { CONFIG, enderecoLinha } from "../config";
import { msgTratamento, waUrl } from "../lib/whatsapp";
import { useVisivel } from "../lib/hooks";
import SculptLine from "./SculptLine";
import Foto from "./Foto";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

/* ---------------------------------------------------------------- */
/* Botões                                                            */
/* ---------------------------------------------------------------- */

export function BotaoAgendar({ mensagem, children = "Agendar avaliação", className = "" }: { mensagem?: string; children?: React.ReactNode; className?: string }) {
  if (!CONFIG.usarWhatsapp) return null;
  return (
    <a href={waUrl(mensagem)} {...ext} className={`btn btn-primario ${className}`}>
      {children} <span className="seta" aria-hidden="true" />
    </a>
  );
}

export function BotaoInstagram({ className = "" }: { className?: string }) {
  if (!CONFIG.instagram.url) return null;
  return (
    <a href={CONFIG.instagram.url} {...ext} className={`btn btn-secundario ${className}`}>
      Ver no Instagram
    </a>
  );
}

function Rotulo({ children, escuro = false }: { children: React.ReactNode; escuro?: boolean }) {
  return (
    <p className={`rotulo flex items-center gap-4 ${escuro ? "text-champanhe" : "text-champanhe-escuro"}`}>
      <span aria-hidden="true" className="h-px w-10 bg-current" />
      {children}
    </p>
  );
}

const resumoHorarios = () => {
  const h = CONFIG.horarios;
  const semana = h.filter((x) => x.diaSemana >= 1 && x.diaSemana <= 5 && x.abre);
  const sab = h.find((x) => x.diaSemana === 6 && x.abre);
  const fmt = (s: string) => s.replace(":00", "h").replace(":", "h");
  const partes: string[] = [];
  if (semana.length === 5 && semana.every((x) => x.abre === semana[0].abre && x.fecha === semana[0].fecha))
    partes.push(`Seg a sex, ${fmt(semana[0].abre)} às ${fmt(semana[0].fecha)}`);
  if (sab) partes.push(`Sáb, ${fmt(sab.abre)} às ${fmt(sab.fecha)}`);
  return partes;
};

/* ---------------------------------------------------------------- */
/* Hero                                                              */
/* ---------------------------------------------------------------- */

export function Hero() {
  const palavras: { t: string; em?: boolean }[] = [
    { t: "Cada" },
    { t: "pessoa" },
    { t: "pede" },
    { t: "um" },
    { t: "plano" },
    { t: "próprio.", em: true },
  ];
  return (
    <section id="inicio" aria-labelledby="titulo-hero" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* a linha do perfil, entalhada no gesso */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[4vw] top-[calc(var(--draft-h)+60px)] -z-10 h-[40svh] opacity-60 sm:-right-[10vw] sm:h-[60svh] lg:right-[3vw] lg:top-[calc(var(--draft-h)+84px)] lg:h-[calc(100svh-var(--draft-h)-96px)] lg:opacity-100"
      >
        <SculptLine tom="claro" gatilho="montagem" espessura={1.5} k={0.8} className="h-full w-auto" preserveAspectRatio="xMaxYMin meet" />
      </div>

      <div className="mx-auto flex w-full max-w-[1320px] flex-1 flex-col justify-end px-4 pb-10 pt-[calc(var(--draft-h)+120px)] sm:px-8 lg:justify-center lg:pb-16">
        <div className="max-w-[860px]">
          <p className="rotulo text-champanhe-escuro">
            Estética personalizada <span aria-hidden="true">·</span> Varginha - MG
          </p>
          <h1 id="titulo-hero" className="display revela mt-6 text-[clamp(3.1rem,9.4vw,7.6rem)] text-tinta">
            {palavras.map((p, i) => (
              <Fragment key={i}>
                {i > 0 && " "}
                <span>
                  <span style={{ animationDelay: `${0.15 + i * 0.09}s` }}>{p.em ? <em>{p.t}</em> : p.t}</span>
                </span>
              </Fragment>
            ))}
          </h1>
          <p className="mt-7 max-w-[30rem] text-[18px] leading-relaxed text-ardosia">
            Avaliação individual e atendimento com horário marcado, na {CONFIG.endereco.bairro}, em {CONFIG.endereco.cidade}.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <BotaoAgendar />
            {CONFIG.secoes.tratamentos && CONFIG.tratamentos.length > 0 && (
              <a href="#tratamentos" className="btn btn-secundario">
                Conhecer os tratamentos
              </a>
            )}
          </div>
        </div>

        <dl className="mt-14 grid max-w-[860px] grid-cols-1 gap-y-3 border-t border-tinta/15 pt-5 text-[14px] text-ardosia sm:grid-cols-3 sm:gap-x-8">
          <div>
            <dt className="rotulo !text-[11px] text-champanhe-escuro">Endereço</dt>
            <dd className="mt-1">{CONFIG.endereco.rua}, {CONFIG.endereco.numero}</dd>
          </div>
          {resumoHorarios().length > 0 && (
            <div className="sm:col-span-2">
              <dt className="rotulo !text-[11px] text-champanhe-escuro">Horários</dt>
              <dd className="num mt-1">{resumoHorarios().join(" · ")}</dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* O atendimento (bloco escuro)                                      */
/* ---------------------------------------------------------------- */

export function Atendimento() {
  const linhas = [
    { n: "I", t: "Avaliação individual", d: "Antes de qualquer indicação, uma conversa sobre você, seu histórico e o que você procura." },
    { n: "II", t: "Plano explicado com clareza", d: "Etapas, cuidados e alternativas apresentados antes de começar." },
    { n: "III", t: "Acompanhamento", d: "Retornos combinados para acompanhar cada etapa do plano." },
  ];
  const recuo = ["lg:ml-0", "lg:ml-[9%]", "lg:ml-[18%]"];
  return (
    <section aria-labelledby="titulo-atendimento" className="escuro grao relative overflow-hidden bg-tinta text-gesso">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-[3%] h-[26%] opacity-70 sm:-right-10 sm:h-[34%] lg:right-[5%] lg:top-[3%] lg:h-[34%] lg:opacity-100">
        <SculptLine tom="escuro" espessura={1.2} k={0.9} className="h-full w-auto" />
      </div>
      <div className="relative mx-auto max-w-[1320px] px-4 py-24 sm:px-8 lg:py-36">
        <Rotulo escuro>O atendimento</Rotulo>
        <h2 id="titulo-atendimento" className="display mt-6 max-w-[16ch] text-[clamp(2.3rem,5.6vw,4.4rem)]">
          Primeiro, a <em>conversa</em>.
        </h2>
        <ol className="mt-16 border-t border-gesso/15 lg:mt-24">
          {linhas.map((l, i) => (
            <li key={l.n} className="border-b border-gesso/15">
              <div className={`grid gap-3 py-8 sm:grid-cols-[4rem_1fr] lg:grid-cols-[5rem_minmax(0,1fr)_20rem] lg:items-baseline lg:gap-10 lg:py-10 ${recuo[i]}`}>
                <span className="display text-[22px] italic text-champanhe">{l.n}</span>
                <h3 className="display text-[clamp(1.9rem,4.2vw,3.4rem)]">{l.t}</h3>
                <p className="text-[16px] leading-relaxed text-nevoa sm:col-start-2 lg:col-start-auto">{l.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Tratamentos: índice editorial (adaptado de "Editorial service list", 21st.dev) */
/* ---------------------------------------------------------------- */

function LinhaTratamento({ i, nome, descricao, aberto, onToggle, baseId }: { i: number; nome: string; descricao: string; aberto: boolean; onToggle: () => void; baseId: string }) {
  const [ref, visivel] = useVisivel<HTMLLIElement>();
  const bid = `${baseId}-b${i}`;
  const pid = `${baseId}-p${i}`;
  return (
    <li ref={ref} className="border-b border-tinta/15">
      <h3>
        <button
          id={bid}
          type="button"
          aria-expanded={aberto}
          aria-controls={pid}
          onClick={onToggle}
          className="group grid w-full cursor-pointer grid-cols-[3.2rem_1fr_auto] items-baseline gap-x-3 py-7 text-left sm:grid-cols-[6rem_1fr_auto] lg:py-9"
        >
          <span className={`display num acende text-[clamp(1.6rem,3.4vw,2.6rem)] ${visivel ? "aceso" : ""}`}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className={`display text-[clamp(1.85rem,4.6vw,3.6rem)] text-tinta transition-transform duration-300 group-hover:translate-x-2`}>
            {nome}
          </span>
          <span aria-hidden="true" className="relative ml-2 block h-4 w-4 self-center">
            <span className="absolute left-0 top-1/2 h-px w-4 bg-tinta" />
            <span className={`absolute left-1/2 top-0 h-4 w-px bg-tinta transition-transform duration-300 ${aberto ? "scale-y-0" : ""}`} />
          </span>
        </button>
      </h3>
      <div id={pid} role="region" aria-labelledby={bid} className={`painel ${aberto ? "aberto" : ""}`} inert={!aberto}>
        <div>
          <div className="pb-10 sm:pl-[6.75rem]">
            <p className="max-w-[36rem] text-[17px] leading-relaxed text-texto">{descricao}</p>
            <p className="mt-4 max-w-[36rem] border-l border-champanhe-escuro/50 pl-4 text-[15px] leading-relaxed text-ardosia">
              A indicação depende de avaliação individual por profissional habilitado.
            </p>
            <BotaoAgendar mensagem={msgTratamento(nome)} className="mt-7">
              Agendar avaliação
            </BotaoAgendar>
          </div>
        </div>
      </div>
    </li>
  );
}

export function Tratamentos() {
  const [aberto, setAberto] = useState(0);
  const baseId = useId();
  if (CONFIG.tratamentos.length === 0) return null;
  return (
    <section id="tratamentos" aria-labelledby="titulo-tratamentos" className="relative">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-4 py-24 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:py-36">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--draft-h)+120px)]">
            <Rotulo>Tratamentos</Rotulo>
            <h2 id="titulo-tratamentos" className="display mt-6 text-[clamp(2.3rem,4.6vw,3.8rem)] text-tinta">
              Indicados depois da <em>avaliação</em>.
            </h2>
            <p className="mt-6 max-w-[22rem] text-[16px] leading-relaxed text-ardosia">
              Toxina botulínica, cuidados com a pele e estética corporal. Toque em cada item para ler mais.
            </p>
          </div>
        </div>
        <ol className="border-t border-tinta/15 lg:col-span-8">
          {CONFIG.tratamentos.map((t, i) => (
            <LinhaTratamento
              key={t.id}
              i={i}
              nome={t.nome}
              descricao={t.descricao}
              aberto={aberto === i}
              onToggle={() => setAberto(aberto === i ? -1 : i)}
              baseId={baseId}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* O espaço (fotos)                                                  */
/* ---------------------------------------------------------------- */

export function Espaco() {
  const f = CONFIG.fotosEspaco;
  if (f.length === 0) return null;
  const [a, b, c] = f;
  return (
    <section id="espaco" aria-labelledby="titulo-espaco" className="bg-gesso-2">
      <div className="mx-auto max-w-[1320px] px-4 py-24 sm:px-8 lg:py-36">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <Rotulo>O espaço</Rotulo>
            <h2 id="titulo-espaco" className="display mt-6 text-[clamp(2.3rem,4.6vw,3.8rem)] text-tinta">
              Na {CONFIG.endereco.bairro}, com horário <em>marcado</em>.
            </h2>
          </div>
          <p className="max-w-[26rem] text-[16px] leading-relaxed text-ardosia lg:col-span-4 lg:col-start-9">
            Recepção, sala de conversa e sala de atendimento no mesmo endereço: {CONFIG.endereco.rua}, {CONFIG.endereco.numero}.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 lg:mt-20 lg:grid-cols-12 lg:gap-6">
          {a && (
            <figure className="col-span-2 lg:col-span-6 lg:row-span-2">
              <Foto foto={a} sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[4/5] lg:aspect-[4/5]" />
              {a.legenda && <figcaption className="rotulo mt-3 !text-[11px] text-ardosia">{a.legenda}</figcaption>}
            </figure>
          )}
          {b && (
            <figure className="lg:col-span-5 lg:col-start-8">
              <Foto foto={b} sizes="(min-width: 1024px) 40vw, 50vw" className="aspect-[3/4] lg:aspect-[5/4]" imgClassName="object-[50%_60%]" />
              {b.legenda && <figcaption className="rotulo mt-3 !text-[11px] text-ardosia">{b.legenda}</figcaption>}
            </figure>
          )}
          {c && (
            <figure className="lg:col-span-4 lg:col-start-8 lg:mt-6">
              <Foto foto={c} sizes="(min-width: 1024px) 33vw, 50vw" className="aspect-[3/4] lg:aspect-[4/5]" imgClassName="object-[50%_65%]" />
              {c.legenda && <figcaption className="rotulo mt-3 !text-[11px] text-ardosia">{c.legenda}</figcaption>}
            </figure>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Profissional                                                       */
/* ---------------------------------------------------------------- */

export function Profissional() {
  const p = CONFIG.profissionais[0];
  if (!p) return null;
  const [f1, f2] = p.fotos;
  const linhaCargo = [p.profissao, p.registro].filter(Boolean).join(" · ");
  const partes = p.nome.split(" ");
  const ultimo = partes.length > 2 ? partes.pop() : undefined;
  return (
    <section id="profissional" aria-labelledby="titulo-profissional" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-[1320px] gap-14 px-4 py-24 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-8 lg:py-36">
        {f1 ? (
          <div className="relative lg:col-span-6">
            <Foto foto={f1} sizes="(min-width: 1024px) 40vw, 85vw" className="aspect-[4/5] w-[82%] sm:w-[70%] lg:w-[78%]" imgClassName="object-[50%_25%]" />
            {f2 && (
              <Foto
                foto={f2}
                sizes="(min-width: 1024px) 20vw, 40vw"
                className="absolute -bottom-10 right-0 aspect-[4/5] w-[42%] border-[6px] border-gesso sm:w-[36%] lg:w-[40%]"
                imgClassName="object-[30%_40%]"
              />
            )}
          </div>
        ) : null}

        <div className={`relative ${f1 ? "lg:col-span-5 lg:col-start-8" : "lg:col-span-10"} mt-6 lg:mt-0`}>
          <div aria-hidden="true" className="pointer-events-none absolute -left-4 -top-24 h-[150%] opacity-80 sm:-left-10">
            <SculptLine tom="claro" viewBox="0 0 294 300" espessura={1.4} k={1} className="h-full w-auto" />
          </div>
          <div className="relative pl-[16%] sm:pl-[22%] lg:pl-[26%]">
            <Rotulo>Profissional</Rotulo>
            <h2 id="titulo-profissional" className="display mt-6 text-[clamp(2.6rem,5.4vw,4.6rem)] text-tinta">
              {partes.join(" ")}
              {ultimo && (
                <>
                  <br />
                  <em>{ultimo}</em>
                </>
              )}
            </h2>
            {linhaCargo && <p className="mt-5 text-[15px] tracking-[0.04em] text-ardosia">{linhaCargo}</p>}
            {CONFIG.instagram.url && (
              <p className="mt-8 text-[15px] text-ardosia">
                No Instagram:{" "}
                <a href={CONFIG.instagram.url} {...ext} className="link-sub text-tinta">
                  {CONFIG.instagram.usuario}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Como funciona: linha do tempo (adaptada de "Scroll animated timeline", 21st.dev) */
/* ---------------------------------------------------------------- */

export function ComoFunciona() {
  const etapas = [
    { t: "Contato e agendamento", d: "Você fala com a clínica pelo WhatsApp e escolhe dia e horário. A equipe confirma a disponibilidade." },
    { t: "Avaliação individual", d: "Conversa presencial sobre seu histórico, sua rotina e o que você procura." },
    { t: "Plano explicado com clareza", d: "Quando há indicação, você recebe a proposta etapa por etapa, com cuidados e alternativas." },
    { t: "Acompanhamento", d: "Retornos combinados conforme o plano, com espaço para tirar dúvidas." },
  ];
  const ref = useRef<HTMLOListElement>(null);
  const [prog, setProg] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProg(1);
      return;
    }
    let ativo = false;
    let pend = false;
    const calc = () => {
      pend = false;
      const r = el.getBoundingClientRect();
      const p = (window.innerHeight * 0.6 - r.top) / r.height;
      setProg(Math.max(0, Math.min(1, p)));
    };
    const onScroll = () => {
      if (ativo && !pend) {
        pend = true;
        requestAnimationFrame(calc);
      }
    };
    const io = new IntersectionObserver((es) => {
      ativo = es.some((e) => e.isIntersecting);
      if (ativo) calc();
    });
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section id="como-funciona" aria-labelledby="titulo-como" className="border-t border-tinta/10">
      <div className="mx-auto max-w-[1320px] px-4 py-24 sm:px-8 lg:py-36">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Rotulo>Como funciona</Rotulo>
            <h2 id="titulo-como" className="display mt-6 text-[clamp(2.3rem,4.6vw,3.8rem)] text-tinta">
              Do primeiro contato ao <em>acompanhamento</em>.
            </h2>
          </div>
        </div>

        <ol ref={ref} className="relative mt-16 lg:ml-[16.66%] lg:mt-24">
          <span aria-hidden="true" className="absolute bottom-2 left-[1.15rem] top-2 w-px bg-tinta/15 sm:left-[2.05rem]" />
          <span
            aria-hidden="true"
            className="absolute left-[1.15rem] top-2 w-px origin-top bg-champanhe-escuro sm:left-[2.05rem]"
            style={{ height: "calc(100% - 1rem)", transform: `scaleY(${prog})` }}
          />
          {etapas.map((e, i) => {
            const ativo = prog >= i / etapas.length + 0.02 || prog === 1;
            return (
              <li key={e.t} className="relative grid grid-cols-[2.3rem_1fr] gap-x-6 pb-14 last:pb-0 sm:grid-cols-[4.1rem_1fr] sm:gap-x-10 lg:grid-cols-[4.1rem_minmax(0,22rem)_minmax(0,24rem)] lg:pb-20">
                <span className="relative z-10 flex justify-center bg-gesso py-1">
                  <span className={`display num text-[clamp(1.9rem,3.6vw,2.9rem)] leading-none transition-colors duration-700 ${ativo ? "text-champanhe-escuro" : "text-apagado"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>
                <h3 className="display self-center text-[clamp(1.6rem,2.8vw,2.3rem)] text-tinta">{e.t}</h3>
                <p className="col-start-2 mt-3 text-[16px] leading-relaxed text-ardosia lg:col-start-3 lg:mt-0 lg:self-center">{e.d}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Dúvidas frequentes                                                 */
/* ---------------------------------------------------------------- */

export const FAQ = (): { p: string; r: string }[] => {
  const e = CONFIG.endereco;
  const trat = CONFIG.tratamentos.map((t) => t.nome.toLowerCase());
  const listaTrat = trat.length > 1 ? `${trat.slice(0, -1).join(", ")} e ${trat[trat.length - 1]}` : trat[0] ?? "";
  const sab = CONFIG.horarios.find((h) => h.diaSemana === 6);
  const dom = CONFIG.horarios.find((h) => h.diaSemana === 0);
  const fmt = (s: string) => s.replace(":00", "h");
  const itens: { p: string; r: string }[] = [
    {
      p: "Como agendar uma avaliação?",
      r: `Pelo WhatsApp ${CONFIG.whatsappExibicao}, pelos botões "Agendar avaliação" ou pelo formulário desta página, que monta a mensagem para você. A equipe confirma a disponibilidade.`,
    },
    {
      p: "Como é a primeira avaliação?",
      r: "Uma conversa individual sobre o que você procura, seu histórico e suas expectativas. A partir dela, são explicadas as opções indicadas para o seu caso, ou se nenhum procedimento é indicado no momento.",
    },
    {
      p: "O que levar?",
      r: "Um documento com foto. Se fizer uso de medicamentos ou tiver exames recentes, leve a lista ou os papéis. Anotar suas dúvidas antes ajuda a conversa.",
    },
  ];
  if (listaTrat)
    itens.push({ p: "Quais tratamentos a clínica oferece?", r: `${listaTrat.charAt(0).toUpperCase()}${listaTrat.slice(1)}. A indicação de cada um é feita na avaliação.` });
  itens.push(
    {
      p: "Todo tratamento serve para todas as pessoas?",
      r: "Não. Cada indicação depende de avaliação individual por profissional habilitado, considerando seu histórico de saúde e seus objetivos.",
    },
    { p: "Quais são os horários?", r: `${resumoHorarios().join("; ")}. ${CONFIG.avisoHorarios}` },
  );
  if (sab?.abre) itens.push({ p: "Atendem aos sábados?", r: `Sim, das ${fmt(sab.abre)} às ${fmt(sab.fecha)}, com horário marcado.` });
  if (dom && !dom.abre) itens.push({ p: "E aos domingos?", r: "Não. Aos domingos a clínica fica fechada." });
  itens.push(
    { p: "Onde fica a clínica?", r: `${e.rua}, ${e.numero}, ${e.bairro}, ${e.cidade} - ${e.uf}, CEP ${e.cep}.` },
    {
      p: "Posso agendar pelo site?",
      r: "Pelo formulário você escolhe o atendimento, a data e o horário que prefere, e o site abre o WhatsApp da clínica com a mensagem pronta. O horário só fica marcado depois da confirmação da equipe.",
    },
  );
  return itens;
};

export function Duvidas() {
  const [aberta, setAberta] = useState(-1);
  const baseId = useId();
  const itens = FAQ();
  return (
    <section id="duvidas" aria-labelledby="titulo-duvidas" className="bg-gesso-2">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-4 py-24 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:py-36">
        <div className="lg:col-span-4">
          <Rotulo>Dúvidas frequentes</Rotulo>
          <h2 id="titulo-duvidas" className="display mt-6 text-[clamp(2.3rem,4.6vw,3.8rem)] text-tinta">
            Antes de <em>agendar</em>.
          </h2>
        </div>
        <ul className="border-t border-tinta/15 lg:col-span-7 lg:col-start-6">
          {itens.map((it, i) => {
            const ab = aberta === i;
            return (
              <li key={it.p} className="border-b border-tinta/15">
                <h3>
                  <button
                    id={`${baseId}-q${i}`}
                    type="button"
                    aria-expanded={ab}
                    aria-controls={`${baseId}-r${i}`}
                    onClick={() => setAberta(ab ? -1 : i)}
                    className="flex min-h-16 w-full cursor-pointer items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className="text-[18px] leading-snug text-tinta sm:text-[19px]">{it.p}</span>
                    <span aria-hidden="true" className="relative block h-3.5 w-3.5 shrink-0">
                      <span className="absolute left-0 top-1/2 h-px w-3.5 bg-tinta" />
                      <span className={`absolute left-1/2 top-0 h-3.5 w-px bg-tinta transition-transform duration-300 ${ab ? "scale-y-0" : ""}`} />
                    </span>
                  </button>
                </h3>
                <div id={`${baseId}-r${i}`} role="region" aria-labelledby={`${baseId}-q${i}`} className={`painel ${ab ? "aberto" : ""}`} inert={!ab}>
                  <div>
                    <p className="max-w-[40rem] pb-7 pr-8 text-[16px] leading-relaxed text-ardosia">{it.r}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Localização e contato                                              */
/* ---------------------------------------------------------------- */

export function Contato() {
  const e = CONFIG.endereco;
  const [hoje, setHoje] = useState<number | null>(null);
  const [ref, visivel] = useVisivel<HTMLDivElement>("300px 0px");
  useEffect(() => setHoje(new Date().getDay()), []);
  const ordem = [...CONFIG.horarios];
  return (
    <section id="contato" aria-labelledby="titulo-contato">
      <div className="mx-auto max-w-[1320px] px-4 py-24 sm:px-8 lg:py-36">
        <Rotulo>Localização e contato</Rotulo>
        <h2 id="titulo-contato" className="display mt-6 text-[clamp(2.3rem,4.6vw,3.8rem)] text-tinta">
          Venha nos <em>visitar</em>.
        </h2>

        <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <address className="not-italic">
              <p className="display text-[clamp(1.7rem,2.6vw,2.2rem)] text-tinta">
                {e.rua}, {e.numero}
              </p>
              <p className="mt-2 text-[17px] text-ardosia">
                {e.bairro} · {e.cidade} - {e.uf}
                <br />
                <span className="num">CEP {e.cep}</span>
              </p>
              {CONFIG.usarWhatsapp && (
                <p className="mt-6 text-[17px]">
                  <span className="rotulo mr-3 !text-[11px] text-champanhe-escuro">WhatsApp</span>
                  <a href={waUrl()} {...ext} className="link-sub num text-tinta">
                    {CONFIG.whatsappExibicao}
                  </a>
                </p>
              )}
            </address>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {CONFIG.rotaUrl && (
                <a href={CONFIG.rotaUrl} {...ext} className="btn btn-secundario">
                  Como chegar
                </a>
              )}
              <BotaoAgendar>Agendar pelo WhatsApp</BotaoAgendar>
              <BotaoInstagram />
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <h3 className="rotulo text-champanhe-escuro">Horários</h3>
            <table className="mt-5 w-full border-t border-tinta/15 text-[16px]">
              <caption className="sr-only">Horários de atendimento por dia da semana</caption>
              <tbody>
                {ordem.map((h) => (
                  <tr key={h.dia} className={`border-b border-tinta/15 ${hoje === h.diaSemana ? "text-tinta" : "text-ardosia"}`}>
                    <th scope="row" className="py-3.5 text-left font-normal">
                      {h.dia}
                      {hoje === h.diaSemana && <span className="rotulo ml-3 !text-[10px] text-champanhe-escuro">Hoje</span>}
                    </th>
                    <td className="num py-3.5 text-right">{h.abre ? `${h.abre} às ${h.fecha}` : "Fechado"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {CONFIG.avisoHorarios && <p className="mt-4 text-[14px] text-ardosia">{CONFIG.avisoHorarios}</p>}
          </div>
        </div>

        {CONFIG.mapaEmbedUrl && (
          <div ref={ref} className="mt-16 aspect-[4/5] w-full overflow-hidden border border-tinta/15 bg-gesso-2 sm:aspect-[16/9] lg:mt-24 lg:aspect-[21/8]">
            {visivel && (
              <iframe
                title={`Mapa: ${enderecoLinha()}`}
                src={CONFIG.mapaEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full grayscale-[.65] contrast-[.95]"
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* CTA final (bloco escuro)                                           */
/* ---------------------------------------------------------------- */

export function CtaFinal() {
  return (
    <section aria-labelledby="titulo-cta" className="escuro grao relative overflow-hidden bg-tinta text-gesso">
      <div aria-hidden="true" className="pointer-events-none absolute -top-4 right-[-30vw] h-[58%] opacity-60 sm:-bottom-6 sm:left-[58%] sm:right-auto sm:top-auto sm:h-[118%] sm:-translate-x-[8%] sm:opacity-100">
        <SculptLine tom="escuro" espessura={1.2} k={0.9} className="h-full w-auto" />
      </div>
      <div className="relative mx-auto max-w-[1320px] px-4 py-28 sm:px-8 lg:py-40">
        <h2 id="titulo-cta" className="display max-w-[12ch] text-[clamp(2.7rem,7vw,5.8rem)]">
          Sua avaliação é o primeiro <em>passo</em>.
        </h2>
        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <BotaoAgendar />
          <BotaoInstagram />
        </div>
      </div>
    </section>
  );
}
