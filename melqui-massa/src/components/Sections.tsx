import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { CONFIG } from "../config";
import { crmTexto, enderecoLinha, especialidadesVisiveis, formatHora, waLink, waSobre } from "../lib";
import { Brain } from "./Brain";
import { Conversa, Instagram, Marcador, Mais, Seta } from "./Icons";
import { Enfase, Rotulo, WRAP } from "./ui";

/* ------------------------------------------------------------------ */
/* O MÉDICO                                                            */
/* ------------------------------------------------------------------ */

const FORMA = [
  {
    t: "Escuta",
    d: "A consulta começa ouvindo. Há tempo para contar a sua história do seu jeito, sem roteiro e sem julgamento.",
  },
  {
    t: "Avaliação individual",
    d: "Cada pessoa é avaliada a partir da própria história, da rotina e do momento em que está. Não há fórmula pronta.",
  },
  {
    t: "Conversa com clareza",
    d: "O que foi percebido na avaliação e os caminhos possíveis são explicados em linguagem simples, com espaço para perguntas.",
  },
  {
    t: "Acompanhamento",
    d: "O cuidado continua nas consultas seguintes, com ajustes conversados a cada etapa.",
  },
];

export function Medico() {
  const crm = crmTexto();
  const esp = especialidadesVisiveis();
  return (
    <section id="medico" aria-labelledby="medico-titulo" className="py-24 md:py-32">
      <div className={WRAP}>
        <Rotulo>O médico</Rotulo>
        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h2 id="medico-titulo" className="text-[clamp(2.4rem,6vw,4.4rem)] leading-[0.98]">
              {CONFIG.nome}
            </h2>
            <p className="mt-4 font-display text-[1.05rem] text-stone">
              {CONFIG.titulo}
              {crm && <span> · {crm}</span>}
            </p>
            {esp.length > 0 && (
              <ul className="mt-2 font-display text-[1.05rem] text-stone">
                {esp.map((e) => (
                  <li key={e.rqe}>
                    {e.nome} · RQE {e.rqe}
                  </li>
                ))}
              </ul>
            )}

            {CONFIG.foto ? (
              <img
                src={CONFIG.foto.src}
                alt={CONFIG.foto.alt}
                loading="lazy"
                className="chamfer mt-10 aspect-[4/5] w-full max-w-sm object-cover [--chamfer:22px]"
              />
            ) : (
              <div aria-hidden="true" className="relative mt-12 hidden max-w-sm lg:block">
                <Brain className="w-40 text-emerald/90" />
                <div className="mt-6 h-px w-full bg-rule" />
              </div>
            )}
          </div>

          <div className="lg:col-span-7">
            <p className="text-[clamp(1.45rem,2.6vw,2.05rem)] leading-[1.3] tracking-[-0.005em] text-ink">
              Consulta médica em saúde mental para adultos e adolescentes, incluindo a dependência química, no consultório
              em {CONFIG.cidade} e também online.
            </p>
            <p className="mt-6 max-w-[38rem] text-graphite">
              Um consultório de um único médico: quem recebe o seu pedido de consulta é quem vai atender você, com hora
              marcada e sem pressa. A forma de atender se apoia em quatro gestos simples.
            </p>

            <dl className="mt-12 border-t border-ink/80">
              {FORMA.map((f) => (
                <div key={f.t} className="grid gap-2 border-b border-rule py-6 md:grid-cols-[13rem_1fr] md:gap-8">
                  <dt className="flex items-start gap-3 font-display text-[1.15rem] font-medium tracking-[-0.01em]">
                    <span aria-hidden="true" className="mt-[0.55em] block h-[7px] w-[7px] shrink-0 rotate-45 bg-emerald" />
                    {f.t}
                  </dt>
                  <dd className="text-graphite">{f.d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* ATENDIMENTOS — lista editorial numerada                             */
/* ------------------------------------------------------------------ */

export function Atendimentos() {
  const itens = CONFIG.atendimentos;
  if (!itens.length) return null;
  return (
    <section id="atendimentos" aria-labelledby="atend-titulo" className="border-y border-rule bg-paper-2/70 py-24 md:py-32">
      <div className={WRAP}>
        <Rotulo>Atendimentos</Rotulo>
        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <h2 id="atend-titulo" className="text-[clamp(2.3rem,5.4vw,4.2rem)] leading-[1] lg:col-span-8">
            <Enfase text="Cada pessoa chega por um *caminho*." />
          </h2>
          <p className="max-w-[26rem] self-end text-graphite lg:col-span-4">
            Adultos, adolescentes e famílias, no consultório em {CONFIG.cidade} ou online.
          </p>
        </div>

        <ol className="mt-16 border-t border-ink/80">
          {itens.map((a, i) => (
            <li key={a.id} className="group grid grid-cols-[3.2rem_1fr] gap-x-4 border-b border-rule py-9 md:grid-cols-[6rem_1fr] lg:grid-cols-[8rem_minmax(0,22rem)_1fr] lg:gap-x-10 lg:py-12">
              <span
                aria-hidden="true"
                className="font-display text-[2rem] leading-none tracking-[-0.04em] text-emerald md:text-[3rem] lg:text-[4rem]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="self-center text-[1.65rem] leading-[1.1] md:text-[2.1rem] lg:self-start">{a.titulo}</h3>
              <div className="col-start-2 mt-4 lg:col-start-3 lg:mt-0">
                <p className="max-w-[36rem] text-[1.08rem] text-ink">{a.texto}</p>
                {a.detalhe && <p className="mt-3 max-w-[36rem] text-graphite">{a.detalhe}</p>}
                <p className="mt-3 text-[0.95rem] italic text-stone">A indicação depende de avaliação médica individual.</p>
                <a
                  href={waSobre(a.assunto)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-12 items-center gap-2 font-display text-[1rem] font-medium text-emerald-deep underline decoration-1 underline-offset-[0.3em] transition-colors hover:text-ink"
                >
                  <Conversa size={19} />
                  Perguntar pelo WhatsApp
                  <span className="sr-only"> sobre {a.titulo.toLowerCase()} (abre em nova aba)</span>
                </a>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* PARA QUEM É — texto grande intercalado com fios                     */
/* ------------------------------------------------------------------ */

const PARA_QUEM = [
  { k: "Para você", t: "Para quem sente que precisa de apoio e orientação médica, e quer ser ouvido com calma." },
  { k: "Para a família", t: "Para pais e responsáveis que buscam uma avaliação para um adolescente." },
  { k: "Para quem apoia", t: "Para familiares de quem enfrenta a dependência química e não sabem por onde começar." },
];

export function ParaQuem() {
  return (
    <section id="para-quem" aria-labelledby="para-titulo" className="py-24 md:py-32">
      <div className={WRAP}>
        <Rotulo>Para quem é</Rotulo>
        <h2 id="para-titulo" className="sr-only">
          Para quem é o atendimento
        </h2>
        <div className="mt-12">
          {PARA_QUEM.map((p, i) => (
            <div
              key={p.k}
              className={`grid gap-3 border-t border-rule py-8 md:grid-cols-12 md:gap-8 md:py-10 ${i === 1 ? "md:pl-[8%]" : ""} ${
                i === 2 ? "md:pl-[16%]" : ""
              }`}
            >
              <p className="label pt-2 text-stone md:col-span-3">{p.k}</p>
              <p className="text-[clamp(1.6rem,3.6vw,2.7rem)] leading-[1.18] tracking-[-0.01em] text-ink md:col-span-9">
                {p.t}
              </p>
            </div>
          ))}
        </div>

        <aside
          aria-label="Avisos importantes"
          className="mt-10 grid gap-6 border-t border-ink/80 pt-8 md:grid-cols-2 md:gap-10"
        >
          <p className="text-graphite">
            Este site é informativo e não substitui a consulta. Não inicie nem suspenda medicamentos por conta própria.
          </p>
          <p className="border-l-2 border-emerald pl-5 font-display text-[1.05rem] leading-snug text-ink">
            Em situação de crise ou risco de vida, ligue{" "}
            <a className="link font-medium" href="tel:188">
              188 (CVV)
            </a>{" "}
            ou{" "}
            <a className="link font-medium" href="tel:192">
              192 (SAMU)
            </a>
            .
          </p>
        </aside>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* COMO FUNCIONA — linha do tempo vertical com progresso               */
/* ------------------------------------------------------------------ */

const ETAPAS = [
  {
    t: "Contato e agendamento",
    d: "Você chama no WhatsApp ou envia uma solicitação pelo formulário desta página. A equipe confirma o dia, o horário e a modalidade, presencial ou online.",
  },
  {
    t: "Consulta",
    d: "Uma conversa com tempo para ouvir a sua história, entender o momento e responder às suas dúvidas.",
  },
  {
    t: "Plano explicado com clareza",
    d: "Se houver indicação de tratamento, ele é explicado em linguagem simples: o que se propõe, por quê e como cada etapa funciona. As decisões são conversadas com você.",
  },
  {
    t: "Acompanhamento",
    d: "Consultas de retorno para acompanhar como você está e ajustar o plano quando for necessário.",
  },
];

export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 40, damping: 20, mass: 0.6 });

  return (
    <section
      id="como-funciona"
      aria-labelledby="como-titulo"
      className="border-y border-rule bg-paper-2/70 py-24 md:py-32"
    >
      <div className={WRAP}>
        <Rotulo>Como funciona</Rotulo>
        <div className="mt-10 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+var(--draft-h,0px)+3rem)]">
              <h2 id="como-titulo" className="text-[clamp(2.3rem,5vw,3.8rem)] leading-[1]">
                <Enfase text="Quatro etapas, no seu *tempo*." />
              </h2>
              <p className="mt-6 max-w-[22rem] text-graphite">
                Do primeiro contato ao acompanhamento, sempre com hora marcada.
              </p>
            </div>
          </div>

          <ol ref={ref} className="relative lg:col-span-8">
            <span aria-hidden="true" className="absolute bottom-6 left-[1.45rem] top-6 w-px bg-rule md:left-[2.2rem]" />
            <motion.span
              aria-hidden="true"
              className="absolute bottom-6 left-[1.45rem] top-6 w-px origin-top bg-emerald md:left-[2.2rem]"
              style={reduce ? undefined : { scaleY }}
            />
            {ETAPAS.map((e, i) => (
              <li key={e.t} className="relative grid grid-cols-[3rem_1fr] gap-x-5 pb-14 last:pb-0 md:grid-cols-[4.4rem_1fr] md:gap-x-8">
                <span
                  aria-hidden="true"
                  className="chamfer ol z-[1] flex h-12 w-12 items-center justify-center font-display text-[1.35rem] text-ink [--chamfer:8px] [--ol-fill:var(--color-paper-2)] md:h-[4.4rem] md:w-[4.4rem] md:text-[2rem]"
                >
                  {i + 1}
                </span>
                <div className="pt-2 md:pt-4">
                  <h3 className="text-[1.5rem] leading-[1.15] md:text-[1.9rem]">
                    <span className="sr-only">Etapa {i + 1}: </span>
                    {e.t}
                  </h3>
                  <p className="mt-3 max-w-[34rem] text-graphite">{e.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* DÚVIDAS — acordeão acessível                                         */
/* ------------------------------------------------------------------ */

function horariosFrase() {
  const grupos = new Map<string, string[]>();
  CONFIG.horarios.forEach((h) => {
    const k = `das ${formatHora(h.abre).replace("h00", "h")} às ${formatHora(h.fecha).replace("h00", "h")}`;
    grupos.set(k, [...(grupos.get(k) ?? []), h.nome.toLowerCase()]);
  });
  const lista = (a: string[]) => (a.length > 1 ? `${a.slice(0, -1).join(", ")} e ${a[a.length - 1]}` : a[0]);
  const partes = [...grupos.entries()].map(([k, dias]) => `${lista(dias)}, ${k}`);
  const fechado = CONFIG.diasFechados.length ? ` ${lista(CONFIG.diasFechados)}: fechado.` : "";
  return `${partes.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(". ")}.${fechado} ${CONFIG.avisoHorarios}`;
}

function faq() {
  const e = CONFIG.endereco;
  const itens: { q: string; a: string }[] = [
    {
      q: "Como agendar uma consulta?",
      a: `Pelo WhatsApp ${CONFIG.whatsappExibicao} ou pelo formulário desta página, que monta a mensagem para você. A equipe responde e confirma o dia, o horário e a modalidade.`,
    },
    {
      q: "Como é a primeira consulta?",
      a: "É uma conversa para conhecer você: sua história, sua rotina e o que motivou a procura. Ao final, o médico explica o que entendeu e quais caminhos são possíveis. Não é preciso chegar com tudo organizado.",
    },
    {
      q: "Há atendimento online?",
      a: "Sim, existe atendimento online. A modalidade de cada consulta é combinada pelo WhatsApp.",
    },
    {
      q: "Adolescentes são atendidos sozinhos?",
      a: "O atendimento de adolescentes conta com a participação do responsável. Em geral, há momentos de conversa em conjunto e momentos em que o adolescente é ouvido individualmente. Como isso acontece em cada caso é combinado na consulta.",
    },
    {
      q: "O responsável precisa participar?",
      a: "Sim. O agendamento é feito pelo responsável, que participa do atendimento e é mantido informado do que for necessário para o cuidado do adolescente.",
    },
    {
      q: "Como funciona o acompanhamento em dependência química?",
      a: "Em termos gerais, começa por uma avaliação cuidadosa e sem julgamento, e segue com consultas de acompanhamento. O plano é individual e pode envolver a família, quando a pessoa concordar e houver indicação. Familiares também podem procurar orientação.",
    },
    {
      q: "O que levar na consulta?",
      a: "Um documento com foto e, se houver, exames, receitas e relatórios anteriores. Se você usa algum medicamento, uma lista com os nomes e as doses ajuda na conversa.",
    },
    { q: "Quais são os horários?", a: horariosFrase() },
    {
      q: "Onde fica o consultório?",
      a: `${e.predio}, ${e.logradouro}, ${e.complemento}, ${e.bairro}, ${e.cidade} - ${e.uf}, CEP ${e.cep}.`,
    },
    {
      q: "O consultório atende urgências?",
      a: "Não. O atendimento é com hora marcada. Em situação de crise ou risco de vida, ligue 188 (CVV) ou 192 (SAMU).",
    },
  ];
  return itens;
}

function FaqItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false);
  const id = `faq-${i}`;
  return (
    <li className="border-b border-rule">
      <h3 className="font-display text-[1.15rem] font-medium leading-snug tracking-[-0.01em] md:text-[1.3rem]">
        <button
          type="button"
          id={`${id}-b`}
          aria-expanded={open}
          aria-controls={`${id}-p`}
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-emerald-deep"
        >
          <span>{q}</span>
          <Mais className={`shrink-0 text-emerald transition-transform duration-500 ${open ? "rotate-45" : ""}`} />
        </button>
      </h3>
      <div
        id={`${id}-p`}
        role="region"
        aria-labelledby={`${id}-b`}
        hidden={!open}
        className="pb-7 pr-10"
      >
        <p className="max-w-[40rem] text-graphite">{a}</p>
      </div>
    </li>
  );
}

export function Duvidas() {
  const itens = faq();
  return (
    <section id="duvidas" aria-labelledby="duvidas-titulo" className="py-24 md:py-32">
      <div className={WRAP}>
        <Rotulo>Dúvidas frequentes</Rotulo>
        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <h2 id="duvidas-titulo" className="text-[clamp(2.3rem,5vw,3.8rem)] leading-[1]">
              <Enfase text="Antes da primeira *conversa*." />
            </h2>
            <p className="mt-6 max-w-[22rem] text-graphite">
              Respostas gerais. O que depender do seu caso é conversado na consulta ou pelo{" "}
              <a className="link" href={waLink()} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
              .
            </p>
          </div>
          <ul className="border-t border-ink/80 lg:col-span-8">
            {itens.map((f, i) => (
              <FaqItem key={f.q} {...f} i={i} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* LOCALIZAÇÃO E CONTATO                                               */
/* ------------------------------------------------------------------ */

export function Contato() {
  const [mapa, setMapa] = useState(false);
  const e = CONFIG.endereco;
  const fotos = CONFIG.fotosConsultorio;
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="border-t border-rule bg-paper-2/70 py-24 md:py-32">
      <div className={WRAP}>
        <Rotulo>Localização e contato</Rotulo>
        <div className="mt-10 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h2 id="contato-titulo" className="text-[clamp(2.3rem,5vw,3.8rem)] leading-[1]">
              <Enfase text={`Em ${CONFIG.cidade}, na *Vila Cruz*.`} />
            </h2>

            <address className="mt-10 not-italic">
              <p className="font-display text-[1.25rem] font-medium leading-snug">
                {e.predio}, {e.complemento}
              </p>
              <p className="mt-1 text-graphite">
                {e.logradouro}, {e.bairro}
                <br />
                {e.cidade} - {e.uf}, CEP {e.cep}
              </p>
            </address>

            <div className="mt-10">
              <h3 className="label text-stone">Horários</h3>
              <table className="mt-4 w-full max-w-sm border-t border-ink/80 font-display text-[1rem] [font-variant-numeric:tabular-nums]">
                <caption className="sr-only">Horários de atendimento</caption>
                <tbody>
                  {CONFIG.horarios.map((h) => (
                    <tr key={h.dia} className="border-b border-rule">
                      <th scope="row" className="py-3 text-left font-normal text-graphite">
                        {h.nome}
                      </th>
                      <td className="py-3 text-right text-ink">
                        {formatHora(h.abre)} às {formatHora(h.fecha)}
                      </td>
                    </tr>
                  ))}
                  {CONFIG.diasFechados.map((d) => (
                    <tr key={d} className="border-b border-rule">
                      <th scope="row" className="py-3 text-left font-normal text-graphite">
                        {d}
                      </th>
                      <td className="py-3 text-right text-stone">Fechado</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-[0.95rem] italic text-stone">{CONFIG.avisoHorarios}</p>
            </div>

            <ul className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <li>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primary chamfer w-full sm:w-auto">
                  <Conversa /> WhatsApp {CONFIG.whatsappExibicao}
                </a>
              </li>
              <li>
                <a href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost ol chamfer w-full sm:w-auto">
                  <Marcador /> Ver no Google Maps
                </a>
              </li>
              <li>
                <a
                  href={CONFIG.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost ol chamfer w-full sm:w-auto"
                >
                  <Instagram /> Instagram
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="chamfer ol relative aspect-[4/3] w-full [--chamfer:22px] [--ol:var(--color-rule)] md:aspect-[16/10]">
              {mapa ? (
                <iframe
                  title={`Mapa: ${enderecoLinha()}`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(CONFIG.mapsBusca)}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10">
                  <MapaTraco />
                  <div className="relative">
                    <p className="max-w-[24rem] font-display text-[1.1rem] leading-snug text-ink">
                      {e.predio}, {e.complemento}. {e.logradouro}, {e.bairro}.
                    </p>
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <button type="button" onClick={() => setMapa(true)} className="btn btn-ghost ol chamfer">
                        Mostrar o mapa aqui
                      </button>
                      <p className="text-[0.9rem] leading-snug text-stone">
                        O mapa é carregado do Google só se você pedir.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {fotos.length > 0 && (
              <figure className="mt-10">
                <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {fotos.map((f) => (
                    <li key={f.src}>
                      <img
                        src={f.src}
                        alt={f.alt}
                        width={203}
                        height={152}
                        loading="lazy"
                        decoding="async"
                        className="chamfer aspect-[4/3] w-full object-cover [--chamfer:10px]"
                      />
                    </li>
                  ))}
                </ul>
                <figcaption className="mt-3 text-[0.95rem] italic text-stone">O consultório, no Edifício Unique.</figcaption>
              </figure>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Desenho de mapa abstrato: ruas como fios a 45°, ponto do consultório chanfrado. */
function MapaTraco() {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 220" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      <g fill="none" stroke="var(--color-rule)" strokeWidth="1">
        <path d="M-10 60 H140 L220 140 H420" />
        <path d="M-10 170 H90 L150 110 H260 L330 40 H420" />
        <path d="M60 -10 V40 L120 100 V240" />
        <path d="M300 -10 V70 L250 120 V240" />
        <path d="M-10 120 H40 L80 160 H180" />
      </g>
      <g transform="translate(220 140)">
        <path d="M-9 -16 H9 L14 -11 V3 L0 18 L-14 3 V-11 Z" fill="var(--color-emerald-deep)" />
        <path d="M0 -8 L5 -3 L0 2 L-5 -3 Z" fill="var(--color-paper)" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* CTA FINAL                                                           */
/* ------------------------------------------------------------------ */

export function CtaFinal() {
  return (
    <section aria-labelledby="cta-titulo" className="relative overflow-hidden bg-night py-24 text-paper md:py-36">
      <Brain className="pointer-events-none absolute -right-[12%] top-1/2 w-[min(90vw,46rem)] -translate-y-1/2 text-emerald opacity-[0.55] md:-right-[4%]" />
      <div className={WRAP}>
        <Rotulo tone="light">Agendar</Rotulo>
        <h2 id="cta-titulo" className="relative mt-8 max-w-[14ch] text-[clamp(2.8rem,8vw,6rem)] leading-[0.98] tracking-[-0.035em]">
          <Enfase text="O primeiro passo é uma *conversa*." className="text-leaf" />
        </h2>
        <div className="relative mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-light chamfer">
            <Conversa /> Agendar pelo WhatsApp
          </a>
          {CONFIG.secoes.agendar && (
            <a href="#agendar" className="btn btn-line ol chamfer">
              Solicitar pelo formulário
            </a>
          )}
          <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-line ol chamfer">
            <Instagram /> Ver no Instagram
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* RODAPÉ                                                              */
/* ------------------------------------------------------------------ */

export function Rodape() {
  const e = CONFIG.endereco;
  const crm = crmTexto();
  return (
    <footer className="bg-night pb-[calc(var(--bar-h)+2.5rem)] text-paper/85">
      <div className={`${WRAP} border-t border-paper/15 pt-14`}>
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="flex items-center gap-3">
              <Brain className="h-9 w-auto text-paper" />
              <span className="font-display text-[1.15rem] font-medium">
                <span className="text-paper/75">Dr. </span>
                <span className="text-leaf">Melqui Massa</span>
              </span>
            </p>
            <p className="mt-4 font-display text-[0.95rem] text-paper/75">
              {CONFIG.titulo}
              {crm && ` · ${crm}`}
            </p>
          </div>
          <address className="not-italic md:col-span-4">
            <p className="label text-paper/60">Endereço</p>
            <p className="mt-3 leading-relaxed">
              {e.predio}, {e.complemento}
              <br />
              {e.logradouro}, {e.bairro}
              <br />
              {e.cidade} - {e.uf}, CEP {e.cep}
            </p>
          </address>
          <div className="md:col-span-3">
            <p className="label text-paper/60">Contato</p>
            <ul className="mt-3 space-y-1">
              <li>
                <a className="inline-flex min-h-11 items-center underline decoration-paper/30 underline-offset-4 hover:text-leaf" href={waLink()} target="_blank" rel="noopener noreferrer">
                  WhatsApp {CONFIG.whatsappExibicao}
                </a>
              </li>
              <li>
                <a className="inline-flex min-h-11 items-center underline decoration-paper/30 underline-offset-4 hover:text-leaf" href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a className="inline-flex min-h-11 items-center underline decoration-paper/30 underline-offset-4 hover:text-leaf" href="/privacidade.html">
                  Privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 grid gap-4 border-t border-paper/15 pt-8 text-[0.95rem] leading-relaxed text-paper/75 md:grid-cols-2 md:gap-10">
          <p>
            Em crise ou risco de vida, ligue{" "}
            <a href="tel:188" className="text-paper underline underline-offset-4">
              188 (CVV)
            </a>{" "}
            ou{" "}
            <a href="tel:192" className="text-paper underline underline-offset-4">
              192 (SAMU)
            </a>
            .
          </p>
          <p>
            Conteúdo informativo, sem finalidade de diagnóstico. A indicação de cada tratamento depende de avaliação médica
            individual.
          </p>
        </div>
        <p className="mt-8 font-display text-[0.85rem] text-paper/60">
          © {new Date().getFullYear()} {CONFIG.nome}
        </p>
      </div>
    </footer>
  );
}

export { Seta };
