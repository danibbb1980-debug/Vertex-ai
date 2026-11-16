import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { scroll } from "motion";
import { CONFIG, mensagens } from "../config";
import { horariosAgrupados, temItens, waLink } from "../lib/util";
import { useNaVista } from "../lib/hooks";
import { Logo } from "./Logo";
import { Pregas } from "./Pregas";
import { ext } from "./Estrutura";

const n2 = (i: number) => String(i + 1).padStart(2, "0");

function Rotulo({ children, claro = false }: { children: ReactNode; claro?: boolean }) {
  return (
    <p className={`rotulo flex items-center gap-3 ${claro ? "text-ouro" : "text-ouro-texto"}`}>
      <span aria-hidden="true" className="h-px w-8 bg-current" />
      {children}
    </p>
  );
}

/** Numeral que se acende ao entrar na tela. */
function Numeral({ children, className = "", texto = false }: { children: ReactNode; className?: string; texto?: boolean }) {
  const [ref, visivel] = useNaVista<HTMLSpanElement>();
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`num acende ${texto ? "acende-texto" : ""} ${visivel ? "aceso" : ""} ${className}`}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ HERO */
export function Hero() {
  const grupos = horariosAgrupados().filter((g) => g.aberto);
  return (
    <section
      id="inicio"
      aria-labelledby="titulo-hero"
      className="relative overflow-hidden bg-pedra"
      style={{ paddingTop: "calc(var(--faixa) + 72px)" }}
    >
      {/* Campo de pregas: metade direita no desktop, faixa sangrando no celular */}
      <div
        className="pointer-events-none absolute right-[-18%] top-[calc(var(--faixa)+72px)] h-[220px] w-[78%] md:right-0 md:top-0 md:h-full md:w-[50%]"
        aria-hidden="true"
      >
        <Pregas n={58} fase={0.6} freq={0.38} cada={6} />
        <div className="absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-pedra to-transparent md:block" />
      </div>

      <div className="container-site relative grid min-h-[calc(100svh-72px-var(--faixa))] grid-cols-1 md:grid-cols-12">
        {/* Placa do logotipo, sobreposta às pregas */}
        <div className="relative order-1 flex items-end pt-[150px] md:order-2 md:col-span-5 md:col-start-8 md:items-center md:pt-0">
          <div className="bg-pedra py-5 pr-6 md:-ml-16 md:px-10 md:py-9">
            <Logo tom="grafite" className="h-auto w-[230px] md:w-[340px]" />
          </div>
        </div>

        <div className="relative order-2 flex flex-col justify-center pb-16 pt-8 md:order-1 md:col-span-7 md:pb-24 md:pt-16 lg:col-span-6">
          <Rotulo>Centro Estético · {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}</Rotulo>
          <h1
            id="titulo-hero"
            className="mt-6 text-[2.75rem] text-tinta sm:text-6xl lg:text-[5.4rem]"
            style={{ lineHeight: 0.98 }}
          >
            Estética corporal com avaliação <em className="text-ouro-texto">individual</em>.
          </h1>
          <p className="mt-6 max-w-[34ch] text-[1.08rem] text-grafite-suave md:text-lg">
            Atendimento com horário marcado, de segunda a sábado, no bairro {CONFIG.endereco.bairro}.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href={waLink(mensagens.geral)} {...ext} className="btn btn-cheio">
              Agendar avaliação
            </a>
            <a href="#estetica-corporal" className="btn btn-linha text-tinta">
              Conhecer o atendimento
            </a>
          </div>
          <dl className="mt-12 grid max-w-md grid-cols-2 border-t border-grafite/20 pt-5">
            {grupos.map((g) => (
              <div key={g.rotulo}>
                <dt className="rotulo text-grafite-suave">{g.rotulo}</dt>
                <dd className="num mt-1 font-serif text-xl text-tinta">{g.texto}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- O ATENDIMENTO */
const tempos = [
  {
    t: "Avaliação individual",
    d: "Um primeiro encontro para entender o que você procura e o que é indicado no seu caso.",
  },
  { t: "Plano explicado com clareza", d: "Antes de começar, você sabe o que será feito e por quê." },
  { t: "Acompanhamento", d: "O plano é revisto ao longo dos encontros, com conversa aberta." },
];

export function Atendimento() {
  return (
    <section id="atendimento" aria-labelledby="titulo-atendimento" className="grao sobre-tinta relative overflow-hidden bg-tinta text-pedra">
      <div
        className="pointer-events-none absolute right-0 top-0 h-[300px] w-[55%] md:h-[46%] md:w-[42%]"
        style={{ maskImage: "linear-gradient(to bottom, #000 40%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, #000 40%, transparent)" }}
        aria-hidden="true"
      >
        <Pregas n={30} fase={2.1} freq={0.5} cor="rgba(177,156,113,0.22)" corForte="rgba(177,156,113,0.6)" cada={5} />
      </div>
      <div className="container-site relative py-20 md:py-32">
        <div className="max-w-2xl">
          <Rotulo claro>O atendimento</Rotulo>
          <h2 id="titulo-atendimento" className="mt-6 text-4xl md:text-6xl">
            Como cada atendimento é <em className="text-ouro">conduzido</em>.
          </h2>
        </div>
        <ol className="mt-14 border-t border-ouro/40 md:mt-20">
          {tempos.map((x, i) => (
            <li
              key={x.t}
              className="grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-3 border-b border-ouro/25 py-8 md:grid-cols-[6rem_1fr_minmax(0,22rem)] md:gap-x-10 md:py-12"
            >
              <Numeral className="font-serif text-2xl md:text-3xl">{n2(i)}</Numeral>
              <h3
                className="text-[1.9rem] leading-[1.05] md:text-[3.4rem] md:[padding-left:var(--recuo)]"
                style={{ ["--recuo" as string]: `${i * 1.5}rem` }}
              >
                {x.t}
              </h3>
              <p className="col-start-2 max-w-[38ch] text-cinza-tinta md:col-start-3 md:row-start-1">{x.d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 flex md:justify-end">
          <a href={waLink(mensagens.geral)} {...ext} className="btn btn-cheio">
            Agendar avaliação
          </a>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------- ESTÉTICA CORPORAL */
export function EsteticaCorporal() {
  const lista = CONFIG.atendimentos;
  if (!temItens(lista)) return null;
  const varios = lista.length > 1;
  return (
    <section id="estetica-corporal" aria-labelledby="titulo-estetica" className="bg-pedra">
      <div className="container-site grid gap-12 py-20 md:grid-cols-12 md:py-32">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-[calc(var(--faixa)+120px)]">
            <Rotulo>Atendimentos</Rotulo>
            <h2 id="titulo-estetica" className="mt-6 text-5xl text-tinta md:text-7xl">
              {varios ? (
                <>
                  O que é <em className="text-ouro-texto">atendido</em>.
                </>
              ) : (
                <>
                  Estética <em className="text-ouro-texto">corporal</em>.
                </>
              )}
            </h2>
            <p className="mt-8 max-w-[30ch] font-serif text-2xl italic leading-snug text-grafite-suave">
              A indicação de cada atendimento é feita pessoalmente, na avaliação.
            </p>
          </div>
        </div>
        <ol className="md:col-span-6 md:col-start-7">
          {lista.map((a, i) => (
            <li key={a.nome} className="border-t border-grafite/25 pb-14 pt-8 last:pb-0">
              <div className="flex items-baseline justify-between gap-6">
                <h3 className="text-3xl text-tinta md:text-[2.6rem]">
                  {varios ? a.nome : "Como os atendimentos são definidos"}
                </h3>
                <Numeral texto className="font-serif text-xl">
                  {n2(i)}
                </Numeral>
              </div>
              <p className="mt-6 max-w-[46ch] text-lg">{a.descricao}</p>
              <p className="rotulo mt-6 text-ouro-texto">Depende de avaliação individual</p>
              <a href={waLink(mensagens.atendimento(a.nome))} {...ext} className="btn btn-cheio mt-8">
                Agendar avaliação
                <span className="sr-only"> sobre {a.nome.toLowerCase()}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ----------------------------------------------- FOTOS (só se autorizadas) */
export function Fotos() {
  if (!temItens(CONFIG.fotos)) return null;
  return (
    <section aria-label="O espaço" className="bg-pedra">
      <div className="container-site grid grid-cols-2 gap-3 pb-20 md:grid-cols-4 md:gap-5">
        {CONFIG.fotos.slice(0, 4).map((f, i) => (
          <img
            key={f.src}
            src={f.src}
            alt={f.alt}
            loading="lazy"
            decoding="async"
            className={`aspect-[3/5] w-full object-cover grayscale-[35%] ${i % 2 ? "md:mt-16" : ""}`}
          />
        ))}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- FORMAÇÃO */
export function Formacao() {
  if (!temItens(CONFIG.formacao)) return null;
  return (
    <section id="formacao" aria-labelledby="titulo-formacao" className="bg-pedra-funda">
      <div className="container-site py-20 md:py-32">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Rotulo>Formação</Rotulo>
            <h2 id="titulo-formacao" className="mt-6 text-5xl text-tinta md:text-7xl">
              Percurso de <em className="text-ouro-texto">estudo</em>.
            </h2>
          </div>
          {CONFIG.cargo && (
            <p className="rotulo text-grafite-suave">
              {CONFIG.cargo}
              {CONFIG.nomeProfissional && ` · ${CONFIG.nomeProfissional}`}
              {CONFIG.registro && ` · ${CONFIG.registro}`}
            </p>
          )}
        </div>
        <ol className="relative mt-14 md:mt-20 md:pl-[12%]">
          <span aria-hidden="true" className="absolute bottom-6 left-[2.15rem] top-6 w-px bg-ouro/60 md:left-[calc(12%+3.1rem)]" />
          {CONFIG.formacao.map((f, i) => (
            <li key={f} className="relative grid grid-cols-[4.3rem_1fr] items-center gap-6 py-6 md:grid-cols-[6.2rem_1fr] md:gap-12 md:py-9">
              <Numeral texto className="relative bg-pedra-funda text-center font-serif text-6xl leading-none md:text-[5.5rem]">
                {n2(i)}
              </Numeral>
              <p className="border-b border-grafite/20 pb-6 font-serif text-2xl leading-tight text-tinta md:pb-9 md:text-[2.4rem]">
                {f}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- CURSOS */
export function Cursos() {
  if (!temItens(CONFIG.cursos)) return null;
  return (
    <section id="cursos" aria-labelledby="titulo-cursos" className="bg-pedra">
      <div className="container-site grid gap-12 py-20 md:grid-cols-12 md:py-32">
        <div className="md:col-span-4">
          <Rotulo>Cursos</Rotulo>
          <h2 id="titulo-cursos" className="mt-6 text-5xl text-tinta md:text-6xl">
            Para quem quer <em className="text-ouro-texto">aprender</em>.
          </h2>
        </div>
        <ol className="md:col-span-7 md:col-start-6">
          {CONFIG.cursos.map((c, i) => (
            <li key={c.nome} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-grafite/25 py-8">
              <Numeral texto className="font-serif text-xl">
                {n2(i)}
              </Numeral>
              <div>
                <h3 className="text-3xl text-tinta">{c.nome}</h3>
                <p className="mt-3 max-w-[46ch]">{c.descricao}</p>
                <a href={waLink(mensagens.curso(c.nome))} {...ext} className="btn btn-linha mt-6 text-tinta">
                  Quero saber mais
                  <span className="sr-only"> sobre {c.nome}</span>
                </a>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- COMO FUNCIONA */
const etapas = [
  {
    t: "Contato e agendamento",
    d: "Você escolhe dia e horário pelo WhatsApp ou pelo formulário deste site. A equipe confirma a disponibilidade.",
  },
  { t: "Avaliação individual", d: "Conversa e observação, com tempo para as suas perguntas." },
  { t: "Plano explicado com clareza", d: "O que faz sentido para o seu caso é explicado antes de qualquer sessão." },
  { t: "Acompanhamento", d: "As sessões seguem o plano combinado, que pode ser ajustado ao longo do caminho." },
];

export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null);
  const vert = useRef<HTMLSpanElement>(null);
  const horiz = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const alvo = ref.current;
    if (!alvo || !vert.current || !horiz.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      vert.current.style.transform = "scaleY(1)";
      horiz.current.style.transform = "scaleX(1)";
      return;
    }
    const v = vert.current;
    const h = horiz.current;
    // progresso da linha do tempo acompanha a rolagem (só transform)
    return scroll(
      (p: number) => {
        v.style.transform = `scaleY(${p})`;
        h.style.transform = `scaleX(${p})`;
      },
      { target: alvo, offset: ["start 80%", "end 55%"] },
    );
  }, []);
  return (
    <section id="como-funciona" aria-labelledby="titulo-como" className="bg-pedra">
      <div className="container-site py-20 md:py-32">
        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <Rotulo>Como funciona</Rotulo>
            <h2 id="titulo-como" className="mt-6 text-5xl text-tinta md:text-7xl">
              Do primeiro contato ao <em className="text-ouro-texto">acompanhamento</em>.
            </h2>
          </div>
        </div>
        <ol ref={ref} className="relative mt-14 grid gap-0 md:mt-24 lg:grid-cols-4 lg:gap-10">
          {/* trilho e progresso: vertical no celular, horizontal no desktop */}
          <span aria-hidden="true" className="absolute bottom-0 left-[5px] top-0 w-px bg-grafite/20 lg:bottom-auto lg:left-0 lg:right-0 lg:h-px lg:w-auto" />
          <span
            ref={vert}
            aria-hidden="true"
            style={{ transform: "scaleY(0)" }}
            className="absolute bottom-0 left-[5px] top-0 w-px origin-top bg-ouro-texto lg:hidden"
          />
          <span
            ref={horiz}
            aria-hidden="true"
            style={{ transform: "scaleX(0)" }}
            className="absolute left-0 right-0 top-0 hidden h-px origin-left bg-ouro-texto lg:block"
          />
          {etapas.map((e, i) => (
            <li key={e.t} className="relative pb-12 pl-10 last:pb-0 lg:pb-0 lg:pl-0 lg:pt-10">
              <span aria-hidden="true" className="absolute left-0 top-2 h-[11px] w-[11px] border border-ouro-texto bg-pedra lg:-top-[5px]" />
              <Numeral texto className="block font-serif text-5xl leading-none lg:text-6xl">
                {n2(i)}
              </Numeral>
              <h3 className="mt-5 text-[1.7rem] leading-tight text-tinta">{e.t}</h3>
              <p className="mt-3 max-w-[34ch] text-grafite-suave">{e.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- DÚVIDAS */
export function perguntas() {
  const g = horariosAgrupados();
  const sab = g.find((x) => x.dias.includes(6));
  const nomes = CONFIG.atendimentos.map((a) => a.nome);
  const e = CONFIG.endereco;
  return [
    {
      p: "Como agendar?",
      r: `Pelo WhatsApp ${CONFIG.whatsappExibicao}, pelos botões deste site ou pelo formulário de solicitação. Dia e horário são confirmados pela equipe na conversa.`,
    },
    {
      p: "Como é a primeira avaliação?",
      r: "É uma conversa individual para entender o que você procura, seguida de uma observação. Ao final, a indicação é explicada com clareza, e você decide com calma.",
    },
    {
      p: "O que levar?",
      r: "Não é preciso levar nada específico. Se você usa algum medicamento ou tem alguma condição de saúde, comente pessoalmente na avaliação.",
    },
    {
      p: "Quais atendimentos são oferecidos?",
      r: `${nomes.join(", ")}. Os atendimentos são definidos em uma avaliação individual.`,
    },
    {
      p: "Todo atendimento serve para todas as pessoas?",
      r: "Não. A indicação depende de avaliação individual, e alguns casos podem pedir a orientação de outro profissional.",
    },
    {
      p: "Quais são os horários?",
      r: `${g.map((x) => `${x.rotulo}: ${x.aberto ? `das ${x.texto}` : "fechado"}`).join(". ")}. ${CONFIG.avisoHorarios}`,
    },
    sab && sab.aberto && { p: "Atendem aos sábados?", r: `Sim, das ${sab.texto}.` },
    { p: "E aos domingos?", r: "Não. Aos domingos não há atendimento." },
    {
      p: "Onde fica?",
      r: `${e.rua}, bairro ${e.bairro}, ${e.cidade} - ${e.uf}, CEP ${e.cep}.`,
    },
    {
      p: "Posso agendar pelo site?",
      r: "Pelo site você envia uma solicitação, que abre uma conversa no WhatsApp. O horário só fica marcado depois que a equipe confirma a disponibilidade.",
    },
  ].filter(Boolean) as { p: string; r: string }[];
}

export function Duvidas() {
  const [aberta, setAberta] = useState<number | null>(0);
  const base = useId();
  const lista = perguntas();
  return (
    <section id="duvidas" aria-labelledby="titulo-duvidas" className="bg-pedra-funda">
      <div className="container-site grid gap-12 py-20 md:grid-cols-12 md:py-32">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-[calc(var(--faixa)+120px)]">
            <Rotulo>Dúvidas</Rotulo>
            <h2 id="titulo-duvidas" className="mt-6 text-5xl text-tinta md:text-6xl">
              Dúvidas <em className="text-ouro-texto">frequentes</em>.
            </h2>
            <p className="mt-6 max-w-[30ch] text-grafite-suave">
              Outra pergunta?{" "}
              <a href={waLink(mensagens.geral)} {...ext} className="link-fio text-tinta">
                Converse pelo WhatsApp
              </a>
              .
            </p>
          </div>
        </div>
        <div className="md:col-span-8">
          <ul className="border-t border-grafite/30">
            {lista.map((q, i) => {
              const ativo = aberta === i;
              const idB = `${base}-b-${i}`;
              const idP = `${base}-p-${i}`;
              return (
                <li key={q.p} className="border-b border-grafite/30">
                  <h3 className="font-sans text-base" style={{ letterSpacing: 0, lineHeight: 1.4 }}>
                    <button
                      id={idB}
                      type="button"
                      aria-expanded={ativo}
                      aria-controls={idP}
                      onClick={() => setAberta(ativo ? null : i)}
                      className="group grid min-h-[64px] w-full grid-cols-[2.5rem_1fr_1.5rem] items-center gap-3 py-5 text-left"
                    >
                      <span className="num rotulo text-ouro-texto">{n2(i)}</span>
                      <span className="font-serif text-xl text-tinta md:text-2xl">{q.p}</span>
                      <span aria-hidden="true" className="relative h-4 w-4 justify-self-end">
                        <span className="absolute left-0 top-1/2 h-px w-4 bg-grafite" />
                        <span
                          className={`absolute left-1/2 top-0 h-4 w-px bg-grafite transition-transform duration-300 ${
                            ativo ? "scale-y-0" : "scale-y-100"
                          }`}
                        />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={idP}
                    role="region"
                    aria-labelledby={idB}
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${ativo ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <p className={`max-w-[60ch] pb-7 pl-[3.25rem] pr-6 ${ativo ? "" : "invisible"}`}>{q.r}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- CONTATO */
export function Contato() {
  const e = CONFIG.endereco;
  const grupos = horariosAgrupados();
  const [hoje, setHoje] = useState<number | null>(null);
  const [mapa, mapaVisivel] = useNaVista<HTMLDivElement>("0px 0px 300px 0px");
  useEffect(() => setHoje(new Date().getDay()), []);
  return (
    <section id="contato" aria-labelledby="titulo-contato" className="bg-pedra">
      <div className="container-site grid gap-12 py-20 md:py-32 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Rotulo>Localização e contato</Rotulo>
          <h2 id="titulo-contato" className="mt-6 text-5xl text-tinta md:text-7xl">
            Venha nos <em className="text-ouro-texto">visitar</em>.
          </h2>
          <address className="mt-10 not-italic">
            <p className="font-serif text-2xl leading-snug text-tinta md:text-[1.75rem]">
              {e.rua}
              <br />
              {e.bairro}, {e.cidade} - {e.uf}
            </p>
            <p className="num mt-2 text-grafite-suave">CEP {e.cep}</p>
          </address>

          <h3 className="rotulo mt-10 text-ouro-texto" style={{ letterSpacing: "0.24em" }}>
            Horários
          </h3>
          <dl className="mt-4 border-t border-grafite/25">
            {grupos.map((g) => {
              const ehHoje = hoje !== null && g.dias.includes(hoje);
              return (
                <div key={g.rotulo} className="flex items-baseline justify-between gap-4 border-b border-grafite/25 py-3">
                  <dt className="flex items-center gap-3">
                    {g.rotulo}
                    {ehHoje && <span className="rotulo text-ouro-texto">Hoje</span>}
                  </dt>
                  <dd className={`num ${g.aberto ? "text-tinta" : "text-grafite-suave"}`}>{g.texto}</dd>
                </div>
              );
            })}
          </dl>
          <p className="mt-3 text-sm text-grafite-suave">{CONFIG.avisoHorarios}</p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={waLink(mensagens.geral)} {...ext} className="btn btn-cheio">
              Agendar pelo WhatsApp
            </a>
            <a href={CONFIG.rotaUrl} {...ext} className="btn btn-linha text-tinta">
              Como chegar
            </a>
            <a href={CONFIG.instagram} {...ext} className="btn btn-linha text-tinta">
              Ver no Instagram
            </a>
          </div>
          <p className="num mt-6 text-sm text-grafite-suave">
            WhatsApp {CONFIG.whatsappExibicao} · {CONFIG.instagramUsuario}
          </p>
        </div>

        <div ref={mapa} className="relative lg:col-span-6 lg:col-start-7">
          <div className="relative aspect-[4/5] w-full border border-grafite/25 bg-pedra-funda sm:aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[560px]">
            <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden="true">
              <Pregas n={40} fase={3.2} />
            </div>
            {mapaVisivel && (
              <iframe
                title={`Mapa: ${e.rua}, ${e.bairro}, ${e.cidade} - ${e.uf}`}
                src={CONFIG.mapaEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full grayscale-[85%] contrast-[0.95]"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- CTA FINAL */
export function CtaFinal() {
  return (
    <section aria-labelledby="titulo-cta" className="grao sobre-tinta relative overflow-hidden bg-tinta text-pedra">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ maskImage: "linear-gradient(to right, transparent 35%, #000 80%)", WebkitMaskImage: "linear-gradient(to right, transparent 35%, #000 80%)" }}
        aria-hidden="true"
      >
        <Pregas n={64} fase={4.4} freq={0.27} cor="rgba(177,156,113,0.16)" corForte="rgba(177,156,113,0.5)" cada={8} />
      </div>
      <div className="container-site relative py-24 md:py-40">
        <div className="max-w-3xl">
          <h2 id="titulo-cta" className="text-5xl md:text-[5.5rem]">
            Sua avaliação é o primeiro <em className="text-ouro">passo</em>.
          </h2>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href={waLink(mensagens.geral)} {...ext} className="btn btn-cheio">
              Agendar avaliação
            </a>
            <a href={CONFIG.instagram} {...ext} className="btn btn-linha text-pedra">
              Ver no Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ RODAPÉ */
export function Rodape() {
  const e = CONFIG.endereco;
  return (
    <footer className="sobre-tinta border-t border-ouro/30 bg-tinta text-pedra">
      <div className="container-site grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo tom="ouro" className="h-auto w-[220px]" />
        </div>
        <div className="text-sm text-cinza-tinta md:col-span-4">
          <p>
            {e.rua}, {e.bairro}
            <br />
            {e.cidade} - {e.uf} · CEP {e.cep}
          </p>
          <p className="mt-4">
            <a href={waLink(mensagens.geral)} {...ext} className="link-fio text-pedra">
              WhatsApp {CONFIG.whatsappExibicao}
            </a>
          </p>
          <p className="mt-2">
            <a href={CONFIG.instagram} {...ext} className="link-fio text-pedra">
              Instagram {CONFIG.instagramUsuario}
            </a>
          </p>
          {CONFIG.email && (
            <p className="mt-2">
              <a href={`mailto:${CONFIG.email}`} className="link-fio text-pedra">
                {CONFIG.email}
              </a>
            </p>
          )}
        </div>
        <div className="text-sm text-cinza-tinta md:col-span-4">
          <p>
            Conteúdo informativo, sem finalidade de diagnóstico. A indicação de cada atendimento depende de avaliação
            individual.
          </p>
          {CONFIG.responsavelTecnico && <p className="mt-3">Responsável técnico: {CONFIG.responsavelTecnico}</p>}
          <p className="mt-4">
            <a href="/privacidade.html" className="link-fio text-pedra">
              Privacidade
            </a>
          </p>
        </div>
      </div>
      <div className="container-site border-t border-ouro/20 py-6 text-xs text-cinza-tinta">
        © {CONFIG.nome} | {CONFIG.descritor}
      </div>
    </footer>
  );
}
