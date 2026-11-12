import { Fragment, useId, useRef, useState } from "react";
import { m, useReducedMotion, useScroll, useSpring } from "motion/react";
import { CONFIG, enderecoLinha, temWhatsapp, type Horario } from "../config";
import { BotaoContato, Cabecalho, IconeSeta } from "./ui";

const wrap = "mx-auto max-w-[84rem] px-5 sm:px-8 lg:px-12";
const NOMES_DIA = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

/* ───────── I. O escritório ───────── */
export function Escritorio({ n }: { n: string }) {
  const fatos = [
    "Sociedade de dois advogados",
    "Atendimento direto pelos sócios",
    CONFIG.mostrarTempoAtuacao && CONFIG.tempoAtuacao ? CONFIG.tempoAtuacao : "",
    `Atuação em ${listaCidades()} (MG)`,
  ].filter(Boolean);

  return (
    <section id="escritorio" aria-labelledby="t-escritorio" className="py-24 lg:py-36">
      <div className={wrap}>
        <Cabecalho numero={n} rotulo="O escritório" id="t-escritorio">
          Dois advogados, <span className="enfase">uma</span> sociedade.
        </Cabecalho>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-[1fr_auto_1fr] lg:gap-16">
          <div className="max-w-[38rem] space-y-5 text-[1.125rem]">
            <p>
              O {CONFIG.nome} reúne dois advogados com atuação em Direito do Trabalho e Direito Previdenciário,
              com sede em Varginha e unidade em Coqueiral.
            </p>
            <p className="text-pedra">
              Quem procura o escritório é atendido pelos próprios sócios. A conversa começa por entender a situação e
              explicar, com clareza, quais são as possibilidades.
            </p>
          </div>
          <span aria-hidden="true" className="barra hidden lg:block" />
          <ul className="border-t border-tinta">
            {fatos.map((f, i) => (
              <li key={f} className="flex items-baseline gap-5 border-b border-fio py-5">
                <span className="num w-6 shrink-0 text-xs text-pedra">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-[1.45rem] leading-snug sm:text-[1.65rem]">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function listaCidades() {
  const c = CONFIG.cidadesAtuacao;
  return c.length > 1 ? `${c.slice(0, -1).join(", ")} e ${c[c.length - 1]}` : c[0];
}

/* ───────── II. Os advogados ───────── */
export function Advogados({ n }: { n: string }) {
  const foto = CONFIG.fotos.socios;
  return (
    <section id="advogados" aria-labelledby="t-advogados" className="bg-osso-2 py-24 lg:py-32">
      <div className={wrap}>
        <Cabecalho numero={n} rotulo="Os advogados" id="t-advogados">
          Quem <span className="enfase">atende</span> você.
        </Cabecalho>

        {foto ? (
          <div className="mt-12 grid items-end gap-x-16 lg:mt-4 lg:grid-cols-[1.45fr_auto_1fr]">
            <figure className="relative order-2 mt-14 lg:order-1 lg:mt-20">
              {/* Quadro de filete fino com base grossa, como o quadro do N no monograma. */}
              <div className="relative border border-b-0 border-tinta/70 pl-6 pt-10 sm:pl-12 sm:pt-16">
                <picture>
                  {foto.srcPequena && <source media="(max-width: 640px)" srcSet={foto.srcPequena} />}
                  <img
                    src={foto.src}
                    width={foto.largura}
                    height={foto.altura}
                    alt={foto.alt}
                    loading="lazy"
                    decoding="async"
                    className="ml-auto block h-auto w-full"
                  />
                </picture>
                <span aria-hidden="true" className="absolute left-4 top-4 rotulo text-pedra sm:left-6 sm:top-6">
                  Os sócios
                </span>
              </div>
              <span aria-hidden="true" className="block h-[5px] w-full bg-tinta" />
            </figure>
            <span aria-hidden="true" className="barra order-1 hidden self-stretch lg:order-2 lg:block lg:mt-20" />
            <Socios className="order-1 mt-12 self-end lg:order-3 lg:mb-0" />
          </div>
        ) : (
          <div className="mt-14 grid gap-10 pb-24 sm:grid-cols-[1fr_auto_1fr] sm:gap-12 lg:pb-32">
            {CONFIG.socios.map((s, i) => (
              <Fragment key={s.nome}>
                {i === 1 && <span aria-hidden="true" className="barra hidden sm:block" />}
                <div className="border-t border-tinta pt-6">
                  <p className="font-display text-[1.9rem] leading-tight">{s.nome}</p>
                  <p className="rotulo num mt-3 text-pedra">{s.oab}</p>
                </div>
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Socios({ className = "" }: { className?: string }) {
  return (
    <ul className={`border-t border-tinta ${className}`}>
      {CONFIG.socios.map((s) => (
        <li key={s.nome} className="border-b border-fio py-7">
          <p className="font-display text-[1.75rem] leading-tight sm:text-[2.1rem]">{s.nome}</p>
          <p className="rotulo num mt-3 text-pedra">{s.oab}</p>
        </li>
      ))}
      {CONFIG.registroSociedade && <li className="pt-5 text-sm text-pedra">{CONFIG.registroSociedade}</li>}
    </ul>
  );
}

/* ───────── III. Áreas de atuação: título fixo + lista editorial numerada ───────── */
export function Areas({ n }: { n: string }) {
  return (
    <section id="areas" aria-labelledby="t-areas" className="py-24 lg:py-36">
      <div className={`${wrap} grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20`}>
        <div className="lg:sticky lg:top-36 lg:self-start">
          <Cabecalho numero={n} rotulo="Áreas de atuação" id="t-areas">
            Trabalho e <span className="enfase">Previdência</span>.
          </Cabecalho>
          <p className="mt-8 max-w-[30rem] text-pedra">
            Explicações gerais, para você se orientar. Cada caso depende de análise individual.
          </p>
        </div>

        <ol className="border-t border-tinta">
          {CONFIG.areas.map((a, i) => (
            <li key={a.id} id={`area-${a.id}`} className="border-b border-fio py-12 first:pt-10 lg:py-16">
              <div className="flex items-baseline gap-5">
                <span className="num font-display text-[1.25rem] text-verde">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="titulo text-[2.15rem] sm:text-[2.75rem]">{a.titulo}</h3>
              </div>
              <div className="mt-6 space-y-4 sm:pl-12">
                <p className="text-[1.2rem] leading-snug">{a.resumo}</p>
                {a.paragrafos.map((p) => (
                  <p key={p} className="text-pedra">
                    {p}
                  </p>
                ))}
                <p className="rotulo pt-6 text-pedra">Situações em que costuma atuar</p>
                <ul className="columns-1 gap-10 sm:columns-2">
                  {a.temas.map((t) => (
                    <li key={t} className="flex break-inside-avoid gap-3 border-t border-fio py-3 text-[0.98rem]">
                      <span aria-hidden="true" className="mt-[0.55em] h-px w-3 shrink-0 bg-verde" />
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="pt-4 text-sm text-pedra">Cada caso depende de análise individual.</p>
                <div className="flex flex-col gap-3 pt-2 xs:flex-row xs:flex-wrap">
                  <BotaoContato
                    variante="linha"
                    rotuloTelefone={`Ligar sobre ${a.titulo}`}
                    mensagem={CONFIG.mensagens.area(a.titulo)}
                  />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────── IV. Quando procurar: texto grande intercalado com fios e legendas ───────── */
const QUANDO = [
  { area: "Trabalho", texto: "Quando o contrato termina e ficam dúvidas sobre o que foi pago." },
  { area: "Trabalho", texto: "Quando a jornada, as horas extras ou o registro não correspondem ao que foi combinado." },
  { area: "Trabalho e Previdência", texto: "Quando uma doença ou um acidente afasta você do trabalho." },
  { area: "Previdência", texto: "Quando um benefício do INSS é negado, cessado ou fica parado na análise." },
  { area: "Previdência", texto: "Quando se aproxima o momento de pensar na aposentadoria." },
  { area: "Previdência", texto: "Quando a família perde quem a sustentava e precisa entender a pensão." },
];

export function QuandoProcurar({ n }: { n: string }) {
  return (
    <section id="quando-procurar" aria-labelledby="t-quando" className="bg-osso-2 py-24 lg:py-36">
      <div className={wrap}>
        <Cabecalho numero={n} rotulo="Quando procurar um advogado" id="t-quando" className="max-w-[52rem]">
          Algumas situações <span className="enfase">pedem</span> orientação.
        </Cabecalho>
        <ul className="mt-14 border-t border-tinta lg:mt-20">
          {QUANDO.map((q, i) => (
            <li
              key={q.texto}
              className="grid gap-2 border-b border-fio py-7 sm:grid-cols-[9rem_1fr] sm:gap-8 lg:grid-cols-[14rem_1fr] lg:py-9"
            >
              <span className="rotulo num pt-2 text-pedra">
                {String(i + 1).padStart(2, "0")} · {q.area}
              </span>
              <p
                className={`font-display text-[1.6rem] leading-[1.15] sm:text-[2rem] lg:text-[2.5rem] ${
                  i % 2 ? "lg:pl-[8%]" : ""
                }`}
              >
                {q.texto}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-[44rem] border-l-[3px] border-tinta pl-5 text-pedra">
          Este site é informativo e não substitui a orientação jurídica individual.
        </p>
      </div>
    </section>
  );
}

/* ───────── V. Como funciona: linha do tempo com progresso ───────── */
const ETAPAS = [
  { t: "Contato e agendamento", d: "Você entra em contato com o escritório e combina um dia e horário para conversar." },
  { t: "Análise do caso", d: "Os advogados ouvem a sua situação e examinam os documentos que você já tiver." },
  {
    t: "Orientação sobre as possibilidades",
    d: "Você recebe uma explicação clara dos caminhos possíveis, do que cada um envolve e dos seus riscos.",
  },
  { t: "Acompanhamento", d: "Se decidir seguir, o escritório acompanha cada etapa e mantém você informado." },
];

export function ComoFunciona({ n }: { n: string }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduzir = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const prog = useSpring(scrollYProgress, { stiffness: 90, damping: 30, restDelta: 0.001 });

  return (
    <section id="como-funciona" aria-labelledby="t-como" className="py-24 lg:py-36">
      <div className={`${wrap} grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20`}>
        <div>
          <Cabecalho numero={n} rotulo="Como funciona" id="t-como">
            Do primeiro contato ao <span className="enfase">acompanhamento</span>.
          </Cabecalho>
          <p className="mt-8 max-w-[28rem] text-pedra">
            Quatro etapas, sem pressa. O tempo de cada caso varia e é explicado na conversa.
          </p>
        </div>

        <ol ref={ref} className="relative">
          <span aria-hidden="true" className="absolute bottom-6 left-[1.6rem] top-6 w-px bg-fio sm:left-[2.4rem]" />
          <m.span
            aria-hidden="true"
            className="absolute bottom-6 left-[calc(1.6rem-2px)] top-6 w-[5px] origin-top bg-tinta sm:left-[calc(2.4rem-2px)]"
            style={{ scaleY: reduzir ? 1 : prog }}
          />
          {ETAPAS.map((e, i) => (
            <li key={e.t} className="relative grid grid-cols-[3.2rem_1fr] gap-6 pb-14 last:pb-0 sm:grid-cols-[4.8rem_1fr] sm:gap-10">
              <span className="num relative z-10 flex h-[3.2rem] items-center justify-center bg-osso font-display text-[2.6rem] leading-none sm:h-[4.8rem] sm:text-[4rem]">
                {i + 1}
              </span>
              <div className="pt-1 sm:pt-3">
                <h3 className="text-[1.6rem] leading-tight sm:text-[2rem]">{e.t}</h3>
                <p className="mt-3 max-w-[34rem] text-pedra">{e.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────── VI. Dúvidas: acordeão numerado (adaptado do Ghost Accordion, 21st.dev) ───────── */
function faq() {
  const s = CONFIG.unidades[0];
  const hor = resumoHorario(s.horarios);
  const outras = CONFIG.unidades.slice(1);
  const canal = temWhatsapp() ? `pelo WhatsApp ou pelo telefone ${CONFIG.telefone}` : `pelo telefone ${CONFIG.telefone}`;
  return [
    {
      q: "Como agendar um atendimento?",
      a: `Entre em contato ${canal}${hor ? `, ${hor.toLowerCase()}` : ""}. A equipe combina com você o dia e o horário da conversa.`,
    },
    {
      q: "Como é o primeiro atendimento?",
      a: "É uma conversa para entender a sua situação. Os advogados ouvem, olham os documentos que você já tiver e explicam, de forma geral, quais caminhos existem. Cada caso depende de análise individual.",
    },
    {
      q: "Que documentos costumam ser úteis?",
      a: "De forma geral: documento de identidade e CPF, comprovante de endereço e o que tiver relação com o assunto. Em questões de trabalho, por exemplo, carteira de trabalho, contracheques e documentos do desligamento. Em questões do INSS, cartas e decisões recebidas, extrato do CNIS e laudos ou exames. Ao agendar, a equipe orienta sobre o que levar no seu caso.",
    },
    {
      q: "Quais áreas o escritório atende?",
      a: `O escritório atua em ${CONFIG.areas.map((a) => a.titulo).join(" e ")}.`,
    },
    {
      q: "Quem faz o atendimento?",
      a: `Os próprios sócios: ${CONFIG.socios.map((s) => `${s.nome} (${s.oab})`).join(" e ")}.`,
    },
    {
      q: "O escritório atende em outras cidades?",
      a: `O escritório atua em ${listaCidades()}, em Minas Gerais, com endereço em ${CONFIG.unidades
        .map((u) => u.cidade)
        .join(" e ")}. Se você mora em outra cidade, entre em contato para conversar sobre o seu caso.`,
    },
    {
      q: "Quais são os horários?",
      a: `${hor ? `Na sede em ${s.cidade}: ${hor.toLowerCase()}. ${CONFIG.avisoFeriados}` : ""}${
        outras.length ? ` Para a unidade de ${outras.map((u) => u.cidade).join(" e ")}, consulte o escritório pelo telefone.` : ""
      }`.trim(),
    },
    {
      q: "Onde fica o escritório?",
      a: CONFIG.unidades.map((u) => `${u.nome}: ${enderecoLinha(u)}.`).join(" "),
    },
    {
      q: "Preciso já ter um processo para procurar o escritório?",
      a: "Não. Você pode procurar o escritório para tirar dúvidas e entender a sua situação antes de qualquer decisão.",
    },
    {
      q: "Como são combinados os honorários?",
      a: "Os honorários são conversados com clareza no atendimento, de acordo com o tipo de caso, e formalizados por escrito, conforme as regras da OAB.",
    },
  ];
}

export function resumoHorario(h?: Horario[]) {
  if (!h?.length) return "";
  const abertos = h.filter((x) => x.abre && x.fecha).sort((a, b) => a.dia - b.dia);
  if (!abertos.length) return "";
  const mesmo = abertos.every((x) => x.abre === abertos[0].abre && x.fecha === abertos[0].fecha);
  const fmt = (t: string) => t.replace(":", "h");
  if (mesmo && abertos.length === 5 && abertos[0].dia === 1)
    return `De segunda a sexta, das ${fmt(abertos[0].abre!)} às ${fmt(abertos[0].fecha!)}`;
  return abertos.map((x) => `${NOMES_DIA[x.dia]}, ${fmt(x.abre!)} às ${fmt(x.fecha!)}`).join("; ");
}

export function Duvidas({ n }: { n: string }) {
  const itens = faq();
  const [aberto, setAberto] = useState<number | null>(0);
  const base = useId();

  return (
    <section id="duvidas" aria-labelledby="t-duvidas" className="bg-osso-2 py-24 lg:py-36">
      <div className={`${wrap} grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20`}>
        <div className="lg:sticky lg:top-36 lg:self-start">
          <Cabecalho numero={n} rotulo="Dúvidas frequentes" id="t-duvidas">
            Perguntas <span className="enfase">comuns</span>, respostas diretas.
          </Cabecalho>
          <p className="mt-8 max-w-[28rem] text-pedra">
            Respostas gerais. Para entender a sua situação, converse com o escritório.
          </p>
        </div>

        <div className="border-t border-tinta">
          {itens.map((it, i) => {
            const open = aberto === i;
            const idB = `${base}-b${i}`;
            const idP = `${base}-p${i}`;
            return (
              <div key={it.q} className="border-b border-fio">
                <h3 className="font-sans text-[1.08rem] font-medium">
                  <button
                    id={idB}
                    type="button"
                    aria-expanded={open}
                    aria-controls={idP}
                    onClick={() => setAberto(open ? null : i)}
                    className="group flex min-h-16 w-full items-center gap-5 py-5 text-left"
                  >
                    <span className="num w-6 shrink-0 text-xs text-pedra">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1">{it.q}</span>
                    <span aria-hidden="true" className="relative h-4 w-4 shrink-0">
                      <span className="absolute left-0 top-1/2 h-px w-4 bg-tinta" />
                      <span
                        className={`absolute left-1/2 top-0 h-4 w-px bg-tinta transition-transform duration-300 ${
                          open ? "scale-y-0" : "scale-y-100"
                        }`}
                      />
                    </span>
                  </button>
                </h3>
                <div
                  id={idP}
                  role="region"
                  aria-labelledby={idB}
                  className={`grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden" inert={!open}>
                    <p className="max-w-[40rem] pb-7 pl-11 text-pedra">{it.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────── VII. Localização e contato ───────── */
export function Contato({ n }: { n: string }) {
  const [sedeU, ...outras] = CONFIG.unidades;
  return (
    <section id="contato" aria-labelledby="t-contato" className="py-24 lg:py-36">
      <div className={wrap}>
        <Cabecalho numero={n} rotulo="Localização e contato" id="t-contato">
          Venha nos <span className="enfase">visitar</span>.
        </Cabecalho>

        <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-[1.25fr_auto_1fr] lg:gap-16">
          <Unidade u={sedeU} sede />
          {outras.length > 0 && <span aria-hidden="true" className="barra hidden lg:block" />}
          {outras.map((u) => (
            <Unidade key={u.nome} u={u} />
          ))}
        </div>

        <div className="mt-16 grid gap-8 border-t border-tinta pt-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="rotulo text-pedra">Telefone do escritório</p>
            <a href={CONFIG.telefoneHref} className="num mt-3 inline-block font-display text-[2.4rem] leading-none no-underline text-tinta sm:text-[3.25rem]">
              {CONFIG.telefone}
            </a>
            <p className="mt-4 text-pedra">
              Instagram:{" "}
              <a className="link text-tinta" href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">
                {CONFIG.instagram.usuario}
              </a>
            </p>
          </div>
          <div className="flex flex-col gap-3 xs:flex-row xs:flex-wrap">
            <BotaoContato rotuloTelefone="Ligar" />
            <a className="btn btn-linha" href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">
              Ver no Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Unidade({ u, sede }: { u: (typeof CONFIG.unidades)[number]; sede?: boolean }) {
  const [mapa, setMapa] = useState(false);
  const hor = u.horarios?.length ? u.horarios : null;
  return (
    <article aria-labelledby={`u-${u.nome}`}>
      <p className="rotulo text-pedra">{sede ? "Sede" : "Unidade"}</p>
      <h3 id={`u-${u.nome}`} className="titulo mt-3 text-[2.4rem] sm:text-[3rem]">
        {u.nome}
      </h3>
      <address className="mt-5 not-italic text-[1.1rem] leading-relaxed">
        {u.logradouro}
        {u.complemento ? `, ${u.complemento}` : ""}
        <br />
        {u.bairro}, {u.cidade} - {u.uf}
        <br />
        <span className="num text-pedra">CEP {u.cep}</span>
      </address>

      {hor && (
        <div className="mt-8">
          <p className="rotulo text-pedra">Horário de atendimento</p>
          <dl className="mt-3 border-t border-fio">
            {[1, 2, 3, 4, 5, 6, 0].map((d) => {
              const h = hor.find((x) => x.dia === d);
              if (!h) return null;
              return (
                <div key={d} className="flex justify-between gap-6 border-b border-fio py-2.5 text-[0.98rem]">
                  <dt>{NOMES_DIA[d]}</dt>
                  <dd className="num text-pedra">{h.abre && h.fecha ? `${h.abre} às ${h.fecha}` : "Fechado"}</dd>
                </div>
              );
            })}
          </dl>
          <p className="mt-3 text-sm text-pedra">{CONFIG.avisoFeriados}</p>
        </div>
      )}

      {u.mapaEmbed && (
        <div className="mt-8">
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-fio bg-osso-2 sm:aspect-[16/10]">
            {mapa ? (
              <iframe
                title={`Mapa: ${CONFIG.nomeCurto}, ${u.nome}`}
                src={u.mapaEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0 grayscale-[0.6]"
              />
            ) : (
              <button
                type="button"
                onClick={() => setMapa(true)}
                className="group absolute inset-0 flex flex-col items-start justify-end gap-2 p-6 text-left"
              >
                <MapaDesenho />
                <span className="rotulo relative text-pedra">Mapa do Google</span>
                <span className="relative inline-flex items-center gap-2 font-display text-[1.4rem] underline decoration-fio decoration-1 underline-offset-4 group-hover:decoration-tinta">
                  Carregar o mapa aqui
                  <IconeSeta />
                </span>
              </button>
            )}
          </div>
          {u.mapsUrl && (
            <a className="btn btn-linha mt-4" href={u.mapsUrl} target="_blank" rel="noopener noreferrer">
              Ver no Google Maps
              <IconeSeta />
            </a>
          )}
        </div>
      )}

      {!sede && (
        <p className="mt-10 border-t border-fio pt-6 text-pedra">
          Atuação em {listaCidades()} (MG).
        </p>
      )}
    </article>
  );
}

/** Desenho abstrato de quadras, em fios, para o espaço do mapa antes de carregar. */
function MapaDesenho() {
  return (
    <svg aria-hidden="true" className="absolute inset-0 h-full w-full text-fio" preserveAspectRatio="none" viewBox="0 0 400 250">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M0 60 L400 40 M0 140 L400 128 M0 210 L400 205 M70 0 L95 250 M190 0 L200 250 M300 0 L285 250" />
        <path d="M0 95 L190 85 M200 170 L400 162" strokeDasharray="3 4" />
      </g>
      <rect x="192" y="122" width="5" height="22" fill="#141413" />
    </svg>
  );
}

/* ───────── CTA final, em tinta ───────── */
export function CtaFinal() {
  return (
    <section aria-labelledby="t-cta" className="escuro relative overflow-hidden bg-tinta py-24 text-osso lg:py-36">
      <div className={`${wrap} grid gap-12 lg:grid-cols-[1fr_auto_1fr] lg:gap-16`}>
        <h2 id="t-cta" className="titulo text-[2.75rem] sm:text-[3.75rem] lg:text-right lg:text-[4.75rem]">
          O primeiro passo é uma <span className="enfase">conversa</span>.
        </h2>
        <span aria-hidden="true" className="hidden w-[5px] bg-osso lg:block" />
        <div className="self-end">
          <p className="max-w-[30rem] text-[1.15rem] text-pedra-claro">
            Ligue para o escritório e combine um horário. Você explica a situação, e nós explicamos as possibilidades.
          </p>
          <div className="mt-8 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
            <BotaoContato />
            {temWhatsapp() && CONFIG.secoes.agendar && (
              <a className="btn btn-linha" href="#agendar">
                Solicitar agendamento
              </a>
            )}
            <a className="btn btn-linha" href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">
              Ver no Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
