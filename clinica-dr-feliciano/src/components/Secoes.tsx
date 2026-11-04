import { m, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useId, useRef, useState, type MouseEvent } from "react";
import { CONFIG, atendimentosVisiveis, comoChegar, enderecoCompleto, waLink } from "../config";
import { LOGO } from "../brand/logo-paths";
import { Icone, IconeAtendimento, Logo, Revelar, TituloSecao } from "./ui";

const hora = (h: string) => h.replace(":00", "h").replace(/^0/, "");
/** "A, B e C" com só a primeira letra maiúscula */
const listaFrase = (itens: string[]) =>
  itens
    .map((t, i) => (i === 0 ? t : t.charAt(0).toLowerCase() + t.slice(1)))
    .join(", ")
    .replace(/, ([^,]*)$/, " e $1");

/* ============================================================ A CLÍNICA */
export function Clinica() {
  const temSabado = CONFIG.horarios.some((h) => h.dias.includes(6));
  const pilares = [
    {
      n: "01",
      titulo: "Planejamento caso a caso",
      texto: "Cada tratamento parte de uma avaliação individual. O plano é desenhado para a sua situação, não para um pacote pronto.",
    },
    CONFIG.estrutura.horaMarcada && {
      n: "02",
      titulo: "Hora marcada",
      texto: "Atendimento com horário combinado, para você organizar a rotina e ser recebido com tempo para conversar.",
    },
    temSabado && {
      n: "03",
      titulo: "Atendimento aos sábados",
      texto: `Além de segunda a sexta, a clínica atende aos sábados pela manhã, das ${hora(CONFIG.horarios[1].abre)} às ${hora(CONFIG.horarios[1].fecha)}.`,
    },
  ].filter(Boolean) as { n: string; titulo: string; texto: string }[];

  return (
    <section id="clinica" aria-labelledby="t-clinica" className="py-24 md:py-32">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <TituloSecao id="t-clinica" rotulo="A clínica" indice={0}>
            Clínica de casa, <em>padrão</em> de centro.
          </TituloSecao>
          <Revelar className="space-y-5 text-lg text-tinta-suave lg:pt-12">
            <p>
              A {CONFIG.nome} reúne em um só endereço, no centro de {CONFIG.endereco.cidade}, atendimentos que vão do
              tratamento de canal à prótese. Tudo começa por uma avaliação, com tempo para ouvir e examinar com atenção.
            </p>
            <p>
              Antes de qualquer procedimento, você entende o que foi observado, quais são as alternativas e por que cada
              etapa é indicada. Com calma e em linguagem simples.
            </p>
          </Revelar>
        </div>

        <ol className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-petroleo-900/10 md:mt-20 md:grid-cols-3">
          {pilares.map((p, k) => (
            <Revelar como="li" key={p.n} atraso={k * 0.1} className="bg-papel p-8 sm:p-10">
              <span className="font-serif text-sm text-mel-texto italic">{String(k + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 text-2xl sm:text-[1.7rem]">{p.titulo}</h3>
              <p className="mt-3 text-tinta-suave">{p.texto}</p>
            </Revelar>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ========================================================= ATENDIMENTOS
   Grade com spotlight suave que segue o cursor (adaptado do "Feature Grid
   Spotlight Cards" do 21st.dev): filetes finos, ícone de traço e CTA. */
function CartaoAtendimento({ a, i }: { a: ReturnType<typeof atendimentosVisiveis>[number]; i: number }) {
  const aoMover = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  return (
    <Revelar como="li" atraso={(i % 3) * 0.08} className="h-full">
      <article
        onMouseMove={aoMover}
        className="group relative flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-petroleo-900/10 bg-papel p-7 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-mel/50 hover:shadow-[0_24px_50px_-34px_rgba(15,58,64,0.55)] sm:p-8"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "radial-gradient(320px circle at var(--x,50%) var(--y,0%), rgba(224,164,88,0.13), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative flex items-start justify-between">
          <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-linho text-petroleo-900 transition-colors duration-300 group-hover:bg-areia">
            <IconeAtendimento tipo={a.icone} className="size-9" />
          </span>
          <span className="font-serif text-sm text-tinta-suave/70 italic">{String(i + 1).padStart(2, "0")}</span>
        </div>
        <h3 className="relative mt-7 text-[1.6rem] leading-tight">{a.nome}</h3>
        <p className="relative mt-3 text-[1rem] text-tinta-suave">{a.resumo}</p>
        {a.aviso && <p className="relative mt-3 text-[0.95rem] font-medium text-petroleo-800">{a.aviso}</p>}
        <p className="relative mt-4 flex items-center gap-2 text-[0.88rem] text-salvia-escura">
          <Icone nome="check" className="size-4 shrink-0" />A indicação depende de avaliação individual.
        </p>
        <a
          href={waLink(CONFIG.mensagens.atendimento(a.nome))}
          target="_blank"
          rel="noopener noreferrer"
          className="relative mt-auto inline-flex min-h-12 items-center gap-2 pt-6 font-medium text-petroleo-900"
          aria-label={`Pedir informações sobre ${a.nome} pelo WhatsApp`}
        >
          <span className="border-b border-mel/60 pb-0.5 transition-colors group-hover:border-mel">Pedir informações</span>
          <Icone nome="seta" className="size-4 text-mel transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </article>
    </Revelar>
  );
}

/* Fecha a grade sem buracos: ocupa as colunas que sobrarem na última linha */
function CartaoAvaliacao({ total }: { total: number }) {
  const sm = total % 2 === 0 ? "sm:col-span-2" : "sm:col-span-1";
  const lg = ["lg:col-span-3", "lg:col-span-2", "lg:col-span-1"][total % 3];
  return (
    <Revelar como="li" className={`h-full ${sm} ${lg}`}>
      <div className="relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-[1.6rem] bg-petroleo-900 p-7 text-linho sm:p-8">
        <svg viewBox="0 0 48 48" className="pointer-events-none absolute -right-16 -bottom-16 size-64 text-mel-claro/25" fill="none" aria-hidden="true">
          <path d={LOGO.anel} stroke="currentColor" strokeWidth=".6" strokeLinecap="round" />
        </svg>
        <div className="relative">
          <p className="rotulo text-mel-claro">Primeira avaliação</p>
          <h3 className="mt-4 text-[1.75rem] leading-tight !text-linho">
            Não sabe por onde <em className="text-mel-claro">começar</em>?
          </h3>
          <p className="mt-3 text-petroleo-100">
            Tudo bem. A avaliação existe para isso: entender o que você precisa e explicar as alternativas.
          </p>
        </div>
        <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-mel relative self-start">
          <Icone nome="whatsapp" className="size-5" />
          Agendar avaliação
        </a>
      </div>
    </Revelar>
  );
}

export function Atendimentos() {
  const lista = atendimentosVisiveis();
  if (!lista.length) return null;
  return (
    <section id="atendimentos" aria-labelledby="t-atendimentos" className="bg-linho py-24 md:py-32">
      <div className="container-site">
        <TituloSecao
          id="t-atendimentos"
          rotulo="Atendimentos"
          indice={1}
          apoio={<p>Do cuidado de rotina à reabilitação, em um só lugar. Os textos abaixo são informativos: o que é indicado para você só se define na avaliação.</p>}
        >
          O que você encontra <em>aqui</em>.
        </TituloSecao>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((a, i) => (
            <CartaoAtendimento key={a.id} a={a} i={i} />
          ))}
          <CartaoAvaliacao total={lista.length} />
        </ul>
      </div>
    </section>
  );
}

/* ====================================================== QUANDO PROCURAR */
const SINAIS = [
  { titulo: "Dor ou sensibilidade", texto: "Incômodo ao mastigar, com frio ou calor merece uma avaliação para entender a causa." },
  { titulo: "Dente do siso", texto: "Nem todo siso precisa ser removido. A avaliação, com exames quando necessário, ajuda a decidir." },
  { titulo: "Perda de um dente", texto: "Existem diferentes formas de reposição. Conhecer as alternativas ajuda a decidir com calma." },
  { titulo: "Alinhamento dos dentes", texto: "Dentes desalinhados ou mudanças na mordida podem ser avaliados em qualquer idade." },
  { titulo: "Check-up periódico", texto: "Consultas regulares permitem acompanhar a saúde da boca mesmo quando não há queixa." },
];

export function QuandoProcurar() {
  return (
    <section aria-labelledby="t-quando" className="py-24 md:py-32">
      <div className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-40 lg:self-start">
          <TituloSecao
            id="t-quando"
            rotulo="Quando procurar"
            indice={2}
            apoio={<p>Algumas situações comuns em que vale marcar uma avaliação. A lista é informativa e não substitui a consulta.</p>}
          >
            Sinais para <em>conversar</em> com o dentista.
          </TituloSecao>
        </div>
        <ul className="border-t border-petroleo-900/12">
          {SINAIS.map((s, i) => (
            <Revelar como="li" key={s.titulo} atraso={i * 0.05} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-petroleo-900/12 py-7 sm:grid-cols-[3.5rem_1fr]">
              <span className="pt-1 font-serif text-mel-texto italic">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-2xl">{s.titulo}</h3>
                <p className="mt-2 text-tinta-suave">{s.texto}</p>
              </div>
            </Revelar>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ======================================================== COMO FUNCIONA
   Linha do tempo com progresso ao rolar (inspirada no "Animated Progress
   Stepper" do 21st.dev): a linha cresce com scaleY e cada etapa acende. */
const ETAPAS = [
  { icone: "conversa", titulo: "Contato e agendamento", texto: "Você fala com a clínica pelo WhatsApp e combina o dia e o horário da consulta." },
  { icone: "lista", titulo: "Avaliação e escuta", texto: "Na consulta, o dentista ouve o que você sente e examina com atenção." },
  { icone: "check", titulo: "Plano explicado com clareza", texto: "Você recebe as alternativas indicadas, as etapas e o porquê de cada uma." },
  { icone: "acompanha", titulo: "Acompanhamento", texto: "As consultas seguintes são marcadas com antecedência, e o cuidado continua depois." },
] as const;

export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null);
  const reduzir = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progresso = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <section id="como-funciona" aria-labelledby="t-como" className="bg-petroleo-900 py-24 text-linho md:py-32">
      <div className="container-site">
        <TituloSecao id="t-como" rotulo="Como funciona" tom="escuro" indice={3}>
          Quatro passos, com <em>calma</em>.
        </TituloSecao>
        <ol ref={ref} className="relative mx-auto max-w-3xl">
          <div className="absolute top-2 bottom-2 left-[1.4rem] w-px bg-linho/15" aria-hidden="true" />
          <m.div
            className="absolute top-2 bottom-2 left-[1.4rem] w-px origin-top bg-mel-claro"
            style={{ scaleY: reduzir ? 1 : progresso }}
            aria-hidden="true"
          />
          {ETAPAS.map((e, i) => (
            <Etapa key={e.titulo} e={e} i={i} total={ETAPAS.length} progresso={scrollYProgress} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Etapa({
  e,
  i,
  total,
  progresso,
}: {
  e: (typeof ETAPAS)[number];
  i: number;
  total: number;
  progresso: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const reduzir = useReducedMotion();
  const limiar = i / total;
  const aceso = useTransform(progresso, [limiar, limiar + 0.08], [0.35, 1]);
  return (
    <li className="relative grid grid-cols-[2.8rem_1fr] gap-6 pb-14 last:pb-0 sm:gap-8">
      <m.span
        className="relative z-10 inline-flex size-11 items-center justify-center rounded-full border border-mel-claro/60 bg-petroleo-900 text-mel-claro"
        style={{ opacity: reduzir ? 1 : aceso }}
      >
        <Icone nome={e.icone} className="size-5" />
      </m.span>
      <Revelar>
        <p className="rotulo text-mel-claro">Etapa {i + 1}</p>
        <h3 className="mt-2 text-[1.75rem] !text-linho sm:text-3xl">{e.titulo}</h3>
        <p className="mt-3 max-w-xl text-petroleo-100">{e.texto}</p>
      </Revelar>
    </li>
  );
}

/* ============================================================ ESTRUTURA */
export function Estrutura() {
  const s = CONFIG.estrutura;
  const itens = [
    s.banheiroAcessivel && { icone: "acessivel", titulo: "Banheiro acessível", texto: "Banheiro com acessibilidade para cadeirantes." },
    s.horaMarcada && { icone: "relogio", titulo: "Hora marcada", texto: "É recomendado marcar horário antes de vir à clínica." },
    s.pagamentos.length > 0 && { icone: "cartao", titulo: "Formas de pagamento", texto: listaFrase(s.pagamentos) + "." },
  ].filter(Boolean) as { icone: "acessivel" | "relogio" | "cartao"; titulo: string; texto: string }[];
  if (!itens.length) return null;
  return (
    <section aria-labelledby="t-estrutura" className="py-24 md:py-32">
      <div className="container-site">
        <TituloSecao id="t-estrutura" rotulo="Estrutura" indice={4}>
          Detalhes que facilitam a sua <em>visita</em>.
        </TituloSecao>
        <ul className="grid gap-5 md:grid-cols-3">
          {itens.map((it, i) => (
            <Revelar como="li" key={it.titulo} atraso={i * 0.08} className="flex gap-5 rounded-[1.6rem] bg-linho p-7 sm:p-8">
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-papel text-petroleo-900 ring-1 ring-petroleo-900/10">
                <Icone nome={it.icone} className="size-6" />
              </span>
              <div>
                <h3 className="text-[1.45rem]">{it.titulo}</h3>
                <p className="mt-2 text-tinta-suave">{it.texto}</p>
              </div>
            </Revelar>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ============================================================== DÚVIDAS
   Acordeão acessível com numeração e sinal +/× (adaptado do "Ghost Accordion"
   do 21st.dev). Altura animada via grid-rows, sem medir o DOM. */
function faq() {
  const nomes = atendimentosVisiveis().map((a) => a.nome.toLowerCase());
  const listaAt = nomes.length ? nomes.slice(0, -1).join(", ") + " e " + nomes[nomes.length - 1] : "";
  const sab = CONFIG.horarios.find((h) => h.dias.includes(6));
  const semana = CONFIG.horarios[0];
  return [
    {
      p: "Preciso agendar antes de ir?",
      r: "Sim, é recomendado marcar horário. Assim a equipe reserva o tempo da sua consulta. O agendamento pode ser pedido pelo WhatsApp ou pelo formulário deste site.",
    },
    {
      p: "Como é a primeira avaliação?",
      r: "É uma conversa seguida de exame clínico. O dentista ouve o motivo da sua visita, examina a boca e, se necessário, solicita exames complementares. Depois, explica o que foi observado e quais caminhos podem ser considerados.",
    },
    listaAt && {
      p: "Quais atendimentos a clínica oferece?",
      r: `A clínica realiza ${listaAt}. A indicação de cada tratamento depende de avaliação individual.`,
    },
    sab && {
      p: "Vocês atendem aos sábados?",
      r: `Sim. Aos sábados, o atendimento é das ${hora(sab.abre)} às ${hora(sab.fecha)}. De segunda a sexta, das ${hora(semana.abre)} às ${hora(semana.fecha)}. ${CONFIG.avisoHorarios}`,
    },
    {
      p: "Onde fica a clínica?",
      r: `Na ${enderecoCompleto()}. Na seção de contato você encontra o mapa e o link com a rota.`,
    },
    CONFIG.estrutura.pagamentos.length > 0 && {
      p: "Quais formas de pagamento são aceitas?",
      r: `${listaFrase(CONFIG.estrutura.pagamentos)}. Outras dúvidas sobre pagamento podem ser esclarecidas diretamente com a clínica.`,
    },
    {
      p: "O que levar na primeira consulta?",
      r: "De modo geral, um documento com foto e, se você tiver, exames ou radiografias recentes e a lista de medicamentos que usa. A clínica pode orientar algo específico ao confirmar o horário.",
    },
    {
      p: "Posso pedir informações sobre um tratamento antes da consulta?",
      r: "Pode. Pelo WhatsApp a equipe tira dúvidas gerais. A indicação do tratamento, porém, só é feita depois da avaliação presencial.",
    },
    CONFIG.estrutura.banheiroAcessivel && {
      p: "A clínica tem acessibilidade?",
      r: "A clínica conta com banheiro com acessibilidade para cadeirantes. Se você tiver alguma necessidade específica, avise ao agendar para que a equipe possa se organizar.",
    },
  ].filter(Boolean) as { p: string; r: string }[];
}

function ItemFaq({ p, r, i }: { p: string; r: string; i: number }) {
  const [aberto, setAberto] = useState(false);
  const id = useId();
  return (
    <li className="border-b border-petroleo-900/12">
      <h3 className="!font-sans !text-base !tracking-normal">
        <button
          type="button"
          aria-expanded={aberto}
          aria-controls={`${id}-r`}
          id={`${id}-p`}
          onClick={() => setAberto((v) => !v)}
          className="group flex w-full items-start gap-4 py-6 text-left sm:gap-6"
        >
          <span className="w-7 shrink-0 pt-1 font-serif text-sm text-mel-texto italic">{String(i + 1).padStart(2, "0")}</span>
          <span className="flex-1 font-serif text-xl leading-snug text-petroleo-900 sm:text-[1.45rem]">{p}</span>
          <span
            className={`mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-petroleo-900/15 text-petroleo-900 transition-[transform,background-color] duration-300 group-hover:bg-petroleo-900/5 ${
              aberto ? "rotate-45" : ""
            }`}
            aria-hidden="true"
          >
            <Icone nome="mais" className="size-4" />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-r`}
        role="region"
        aria-labelledby={`${id}-p`}
        className={`grid transition-[grid-template-rows,visibility] duration-400 ease-(--ease-suave) ${aberto ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <p className="pr-12 pb-7 pl-11 text-tinta-suave sm:pl-[3.25rem]">{r}</p>
        </div>
      </div>
    </li>
  );
}

export function Duvidas() {
  const itens = faq();
  return (
    <section id="duvidas" aria-labelledby="t-duvidas" className="bg-linho py-24 md:py-32">
      <div className="container-site grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-40 lg:self-start">
          <TituloSecao
            id="t-duvidas"
            rotulo="Dúvidas frequentes"
            indice={5}
            apoio={
              <p>
                Não encontrou sua pergunta?{" "}
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="font-medium text-petroleo-900 underline decoration-mel underline-offset-4">
                  Fale com a clínica pelo WhatsApp
                </a>
                .
              </p>
            }
          >
            Perguntas <em>comuns</em>.
          </TituloSecao>
        </div>
        <ul className="border-t border-petroleo-900/12">
          {itens.map((it, i) => (
            <ItemFaq key={it.p} {...it} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}

/* =============================================================== CONTATO */
function Mapa() {
  const [carregar, setCarregar] = useState(false);
  const q = encodeURIComponent(enderecoCompleto());
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.6rem] bg-areia ring-1 ring-petroleo-900/10 lg:aspect-auto lg:h-full lg:min-h-[460px]">
      {carregar ? (
        <iframe
          title={`Mapa: ${CONFIG.nome}, ${enderecoCompleto()}`}
          src={`https://www.google.com/maps?q=${q}&output=embed`}
          className="absolute inset-0 size-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <>
          {/* Ilustração de traço do quarteirão; o mapa do Google só carrega a pedido */}
          <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden="true">
            <rect width="400" height="300" fill="#EAE1D2" />
            <g stroke="#FAF7F1" strokeLinecap="round" fill="none">
              <path d="M-10 190 L410 120" strokeWidth="18" />
              <path d="M120 -10 L180 310" strokeWidth="12" />
              <path d="M300 -10 L260 310" strokeWidth="10" />
              <path d="M-10 60 L410 30" strokeWidth="8" />
              <path d="M-10 270 L410 250" strokeWidth="8" />
            </g>
            <g stroke="#0F3A40" strokeOpacity=".12" fill="none">
              <path d="M-10 190 L410 120" strokeWidth="1" strokeDasharray="4 6" />
            </g>
            <circle cx="214" cy="154" r="38" fill="none" stroke="#C98A3B" strokeOpacity=".5" />
            <circle cx="214" cy="154" r="16" fill="#0F3A40" />
            <circle cx="214" cy="154" r="5" fill="#E0A458" />
          </svg>
          <div className="absolute inset-x-4 bottom-4 flex flex-col gap-3 rounded-2xl bg-papel/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.95rem] text-tinta-suave">
              <span className="block font-medium text-petroleo-900">{CONFIG.endereco.rua}</span>
              {CONFIG.endereco.bairro}, {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}
            </p>
            <button type="button" onClick={() => setCarregar(true)} className="btn btn-primario shrink-0 !px-5">
              <Icone nome="pin" className="size-4" />
              Ver no mapa
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function Contato() {
  return (
    <section id="contato" aria-labelledby="t-contato" className="py-24 md:py-32">
      <div className="container-site grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <TituloSecao id="t-contato" rotulo="Localização e contato" indice={6}>
            Venha nos <em>visitar</em>.
          </TituloSecao>
          <dl className="space-y-8">
            <div className="flex gap-4">
              <dt className="sr-only">Endereço</dt>
              <Icone nome="pin" className="mt-1 size-5 shrink-0 text-mel" />
              <dd className="text-lg">
                {CONFIG.endereco.rua}
                <br />
                {CONFIG.endereco.bairro}, {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}
                <br />
                <span className="text-tinta-suave">CEP {CONFIG.endereco.cep}</span>
              </dd>
            </div>
            <div className="flex gap-4">
              <dt className="sr-only">Horários</dt>
              <Icone nome="relogio" className="mt-1 size-5 shrink-0 text-mel" />
              <dd className="w-full max-w-sm">
                <table className="w-full text-left text-lg">
                  <caption className="sr-only">Horário de atendimento</caption>
                  <tbody>
                    {CONFIG.horarios.map((h) => (
                      <tr key={h.rotulo} className="border-b border-petroleo-900/10">
                        <th scope="row" className="py-2 pr-4 font-normal">{h.rotulo}</th>
                        <td className="py-2 text-right font-medium text-petroleo-900">
                          {hora(h.abre)} às {hora(h.fecha)}
                        </td>
                      </tr>
                    ))}
                    {CONFIG.diasFechadosRotulo && (
                      <tr>
                        <th scope="row" className="py-2 pr-4 font-normal">{CONFIG.diasFechadosRotulo.split(":")[0]}</th>
                        <td className="py-2 text-right text-tinta-suave">Fechado</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <p className="mt-3 text-[0.95rem] text-tinta-suave">{CONFIG.avisoHorarios}</p>
              </dd>
            </div>
          </dl>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primario">
              <Icone nome="whatsapp" className="size-5" />
              WhatsApp {CONFIG.telefoneExibicao}
            </a>
            <a href={comoChegar()} target="_blank" rel="noopener noreferrer" className="btn btn-contorno">
              <Icone nome="rota" className="size-5" />
              Como chegar
            </a>
            <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-contorno">
              <Icone nome="instagram" className="size-5" />
              {CONFIG.instagram.usuario}
            </a>
          </div>
          <a href={CONFIG.maps} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-12 items-center gap-2 text-[0.95rem] text-tinta-suave underline decoration-mel/60 underline-offset-4 hover:text-petroleo-900">
            Abrir a ficha da clínica no Google Maps
            <Icone nome="externo" className="size-4" />
          </a>
        </div>
        <Revelar className="lg:pt-6">
          <Mapa />
        </Revelar>
      </div>
    </section>
  );
}

/* ============================================================= CTA FINAL
   O arco do símbolo fecha o círculo conforme a seção entra na tela. */
export function CtaFinal() {
  const ref = useRef<HTMLElement>(null);
  const reduzir = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  // o anel do símbolo começa aberto (como no logo) e se fecha ao chegar ao centro
  const fechar = useTransform(scrollYProgress, [0.25, 0.95], [0.86, 1]);
  return (
    <section ref={ref} aria-labelledby="t-cta" className="relative overflow-hidden bg-petroleo-900 py-28 text-linho md:py-36">
      <svg viewBox="0 0 100 100" className="pointer-events-none absolute top-1/2 left-1/2 size-[900px] -translate-x-1/2 -translate-y-1/2 text-linho/[0.05]" fill="none" aria-hidden="true">
        <circle cx="50" cy="50" r="49" stroke="currentColor" strokeWidth=".15" />
        <circle cx="50" cy="50" r="34" stroke="currentColor" strokeWidth=".15" />
      </svg>
      <div className="container-site relative text-center">
        <svg viewBox="0 0 48 48" className="mx-auto mb-10 size-24 sm:size-28" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="24" cy="24" r="21" stroke="#F4EEE4" strokeOpacity=".1" strokeWidth="1.6" />
          <m.circle
            cx="24"
            cy="24"
            r="21"
            stroke="#E0A458"
            strokeWidth="1.6"
            transform="rotate(15 24 24)"
            style={{ pathLength: reduzir ? 1 : fechar }}
          />
          <path d={LOGO.f} stroke="#F4EEE4" strokeWidth="2.4" />
        </svg>
        <h2 id="t-cta" className="mx-auto max-w-3xl text-[2.4rem] !text-linho sm:text-6xl">
          Sua avaliação é o <em className="text-mel-claro">primeiro passo</em>.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-petroleo-100">
          Fale com a clínica, escolha um horário e venha conversar sobre o que você precisa.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-mel">
            <Icone nome="whatsapp" className="size-5" />
            Agendar pelo WhatsApp
          </a>
          {CONFIG.secoes.agendar && (
            <a href="#agendar" className="btn btn-contorno-claro">
              <Icone nome="calendario" className="size-5" />
              Solicitar agendamento
            </a>
          )}
          <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-contorno-claro">
            <Icone nome="instagram" className="size-5" />
            Ver no Instagram
          </a>
        </div>
      </div>
    </section>
  );
}

/* ================================================================ RODAPÉ */
export function Rodape() {
  return (
    <footer className="bg-petroleo-950 pt-16 pb-28 text-petroleo-100 md:pb-12">
      <div className="container-site">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Logo tom="escuro" className="h-12 w-auto" />
            <p className="mt-5 max-w-sm text-[0.95rem]">
              Conteúdo informativo; a indicação de cada tratamento depende de avaliação individual.
            </p>
            {CONFIG.responsavelTecnico && CONFIG.cro && (
              <p className="mt-4 text-[0.95rem] text-linho">
                Responsável técnico: {CONFIG.responsavelTecnico} · {CONFIG.cro}
              </p>
            )}
          </div>
          <div>
            <p className="rotulo mb-4 text-mel-claro">Endereço</p>
            <address className="text-[0.95rem] not-italic">
              {CONFIG.endereco.rua}
              <br />
              {CONFIG.endereco.bairro}, {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}
              <br />
              CEP {CONFIG.endereco.cep}
            </address>
          </div>
          <div>
            <p className="rotulo mb-4 text-mel-claro">Contato</p>
            <ul className="space-y-1 text-[0.95rem]">
              <li>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 hover:text-linho">
                  <Icone nome="whatsapp" className="size-4" /> {CONFIG.telefoneExibicao}
                </a>
              </li>
              <li>
                <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 hover:text-linho">
                  <Icone nome="instagram" className="size-4" /> {CONFIG.instagram.usuario}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-linho/10 pt-6 text-[0.85rem] text-petroleo-100/80 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {CONFIG.nome}</p>
          <a href="/privacidade.html" className="inline-flex min-h-11 items-center underline decoration-linho/30 underline-offset-4 hover:text-linho">
            Privacidade
          </a>
        </div>
      </div>
    </footer>
  );
}
