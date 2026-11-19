import { useEffect, useRef, useState, type ReactNode } from "react";
import { CONFIG, LOCAL } from "../config";
import { advogadosValidos, comoChegar, cx, horariosAgrupados, temHorarios, waArea, waLink } from "../lib/util";
import { MarcaSecao } from "./Prumo";
import { TituloRevelado } from "./Revela";

const foto = (id: string) => CONFIG.fotos.find((f) => f.id === id);

function Foto({ id, className, sizes, prioridade = false }: { id: string; className?: string; sizes: string; prioridade?: boolean }) {
  const f = foto(id);
  if (!f) return null;
  return (
    <img
      src={`/fotos/${f.id}-1200.webp`}
      srcSet={`/fotos/${f.id}-720.webp 720w, /fotos/${f.id}-1200.webp ${f.largura}w`}
      sizes={sizes}
      width={f.largura}
      height={f.altura}
      alt={f.alt}
      loading={prioridade ? "eager" : "lazy"}
      fetchPriority={prioridade ? "high" : "auto"}
      decoding="async"
      className={cx("foto", className)}
    />
  );
}

/** Numeral visível no fluxo do texto apenas no celular (no desktop ele fica pendurado no fio). */
function NumeralCelular({ n, escuro }: { n: string; escuro?: boolean }) {
  return (
    <span aria-hidden="true" className={cx("romano mb-4 block md:hidden", escuro ? "text-ouro-claro" : "text-ouro-texto")}>
      {n}
    </span>
  );
}

function IconeWhats() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M4.5 19.5 5.6 16A8 8 0 1 1 8.4 18.6Z" strokeLinejoin="round" />
      <path d="M9.2 8.6c.3 2.6 2.4 5 5.4 5.9l1-1.2-1.6-.9-.7.7c-1-.4-2-1.4-2.4-2.4l.7-.7-.9-1.6Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BotaoWhats({ texto = "Agendar pelo WhatsApp", href = waLink(), variante = "cheio" }: { texto?: string; href?: string; variante?: "cheio" | "linha" }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cx("btn", variante === "cheio" ? "btn-cheio" : "btn-linha")}>
      <IconeWhats />
      {texto}
      <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
    </a>
  );
}

export function BotaoInstagram({ variante = "linha" }: { variante?: "cheio" | "linha" }) {
  return (
    <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className={cx("btn", variante === "cheio" ? "btn-cheio" : "btn-linha")}>
      Ver no Instagram
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  );
}

/* ------------------------------------------------------------------ HERO */
export function Hero() {
  const temFoto = !!foto("recepcao");
  return (
    <section id="inicio" className={cx("relative", CONFIG.rascunho ? "pt-[136px]" : "pt-[104px]")}>
      <div className="trilho grid gap-12 pb-20 md:pb-28 lg:grid-cols-12 lg:gap-8 lg:pb-32">
        <div className="lg:col-span-7 lg:pt-14 xl:pt-20">
          <p className="rotulo mb-8 text-ouro-texto">
            Advocacia <span aria-hidden="true">·</span> {LOCAL}
          </p>
          <TituloRevelado
            texto="Orientação jurídica, explicada com *clareza*."
            className="display max-w-[11ch] text-[clamp(46px,8.6vw,118px)] text-preto"
          />
          <p className="mt-8 max-w-[46ch] text-[18px] leading-[1.6] text-apoio md:text-[19px]">
            Atendimento pelo escritório Resquioto Advogados, em {CONFIG.cidade}, com explicação clara sobre as
            possibilidades de cada situação.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {CONFIG.secoes.agendar ? (
              <a href="#agendar" className="btn btn-cheio">
                Agendar atendimento
              </a>
            ) : (
              <BotaoWhats texto="Agendar atendimento" />
            )}
            <a href="#escritorio" className="btn btn-linha">
              Conhecer o escritório
            </a>
          </div>
        </div>
        {temFoto && (
          <figure className="lg:col-span-5 lg:col-start-8">
            <div className="aspect-[4/5] overflow-hidden bg-nevoa-2 lg:aspect-[3/4]">
              <Foto id="recepcao" prioridade sizes="(min-width:1024px) 38vw, 90vw" className="object-[38%_50%]" />
            </div>
            <figcaption className="mt-4 flex items-baseline justify-between gap-4 border-t border-fio pt-3 text-[14px] text-apoio">
              <span>Recepção do escritório</span>
              <span>{CONFIG.bairro || CONFIG.cidade}</span>
            </figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- O ESCRITÓRIO */
export function Escritorio({ n }: { n: string }) {
  return (
    <section id="escritorio" aria-labelledby="t-escritorio" className="relative border-t border-fio py-24 md:py-36">
      <MarcaSecao numeral={n} />
      <div className="trilho">
        <NumeralCelular n={n} />
        <h2 id="t-escritorio" className="display text-[clamp(56px,13.5vw,212px)] leading-[0.88] text-preto">
          Resquioto{" "}
          <span className="block pl-[0.9em] italic text-preto/90 md:pl-[1.6em]">Advogados</span>
        </h2>
        <div className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-12">
          <p className="display text-[clamp(26px,3vw,38px)] leading-[1.2] lg:col-span-6 lg:col-start-2">
            Escritório de advocacia em {CONFIG.cidade}. Atendimento por agendamento, com explicação clara sobre cada caso.
          </p>
          {CONFIG.endereco && (
            <address className="not-italic text-[16px] leading-[1.7] text-apoio lg:col-span-4 lg:col-start-9 lg:pt-2">
              <span className="rotulo mb-3 block text-ouro-texto">Endereço</span>
              {CONFIG.endereco}
              <br />
              {CONFIG.bairro && (
                <>
                  {CONFIG.bairro}
                  <br />
                </>
              )}
              {CONFIG.cidade} - {CONFIG.uf}
              {CONFIG.cep && <>, {CONFIG.cep}</>}
            </address>
          )}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- O ESPAÇO */
export function Espaco({ n }: { n: string }) {
  const ids = ["fachada", "sala-atendimento", "sala-reunioes", "mezanino"].filter((i) => foto(i));
  if (!ids.length) return null;
  const Fig = ({ id, className, aspecto, sizes }: { id: string; className?: string; aspecto: string; sizes: string }) => (
    <figure className={className}>
      <div className={cx("overflow-hidden bg-nevoa-2", aspecto)}>
        <Foto id={id} sizes={sizes} />
      </div>
      <figcaption className="mt-3 flex items-center gap-3 text-[14px] text-apoio">
        <span aria-hidden="true" className="block h-px w-6 bg-ouro" />
        {foto(id)?.legenda}
      </figcaption>
    </figure>
  );
  return (
    <section id="espaco" aria-labelledby="t-espaco" className="relative pb-24 md:pb-36">
      <MarcaSecao numeral={n} />
      <div className="trilho">
        <NumeralCelular n={n} />
        <div className="grid gap-x-8 gap-y-14 md:grid-cols-12">
          <div className="md:col-span-4 md:col-start-1 md:row-start-1 md:self-end md:pb-10">
            <h2 id="t-espaco" className="display text-[clamp(36px,4.4vw,60px)]">
              O <em>espaço</em>
            </h2>
            <p className="mt-5 max-w-[34ch] text-apoio">
              Recepção no térreo, sala de atendimento e sala de reuniões no pavimento superior.
            </p>
          </div>
          {ids.includes("fachada") && (
            <Fig id="fachada" className="md:col-span-8 md:col-start-5 md:row-start-1" aspecto="aspect-[4/3]" sizes="(min-width:768px) 62vw, 90vw" />
          )}
          {ids.includes("sala-atendimento") && (
            <Fig id="sala-atendimento" className="md:col-span-5 md:col-start-1" aspecto="aspect-[5/4]" sizes="(min-width:768px) 38vw, 90vw" />
          )}
          {ids.includes("sala-reunioes") && (
            <Fig id="sala-reunioes" className="md:col-span-6 md:col-start-7 md:mt-32" aspecto="aspect-[4/3]" sizes="(min-width:768px) 46vw, 90vw" />
          )}
          {ids.includes("mezanino") && (
            <Fig id="mezanino" className="md:col-span-9 md:col-start-2 md:mt-6" aspecto="aspect-[16/9]" sizes="(min-width:768px) 70vw, 90vw" />
          )}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- ADVOGADOS */
export function Advogados({ n }: { n: string }) {
  const lista = advogadosValidos();
  if (!lista.length) return null;
  return (
    <section id="advogados" aria-labelledby="t-advogados" className="relative border-t border-fio py-24 md:py-32">
      <MarcaSecao numeral={n} />
      <div className="trilho grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <NumeralCelular n={n} />
          <h2 id="t-advogados" className="display text-[clamp(36px,4.4vw,60px)]">
            Os <em>advogados</em>
          </h2>
        </div>
        <ul className="md:col-span-7 md:col-start-6">
          {lista.map((a) => (
            <li key={a.oab} className="flex flex-col gap-1 border-b border-fio py-6 sm:flex-row sm:items-baseline sm:justify-between">
              <span className="display text-[28px]">{a.nome}</span>
              <span className="text-apoio">
                OAB/{a.uf} nº {a.oab}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- ATUAÇÃO */
export function Atuacao({ n }: { n: string }) {
  const [aberto, setAberto] = useState<number | null>(null);
  if (!CONFIG.areas.length) return null;
  return (
    <section id="atuacao" aria-labelledby="t-atuacao" className="relative border-t border-fio py-24 md:py-36">
      <MarcaSecao numeral={n} />
      <div className="trilho grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-40">
            <NumeralCelular n={n} />
            <h2 id="t-atuacao" className="display text-[clamp(40px,5vw,72px)]">
              <em>Atuação</em>
            </h2>
            <p className="mt-5 max-w-[30ch] text-apoio">Cada caso depende de análise individual.</p>
          </div>
        </div>
        <ol className="md:col-span-8">
          {CONFIG.areas.map((a, i) => {
            const id = `area-${i}`;
            const ativo = aberto === i;
            return (
              <li key={a.nome} className="border-b border-fio">
                <h3>
                  <button
                    type="button"
                    aria-expanded={ativo}
                    aria-controls={id}
                    onClick={() => setAberto(ativo ? null : i)}
                    className="flex min-h-[72px] w-full items-baseline gap-6 py-6 text-left"
                  >
                    <span className="romano w-10 shrink-0 text-ouro-texto">{String(i + 1).padStart(2, "0")}</span>
                    <span className="display flex-1 text-[clamp(28px,3.6vw,48px)]">{a.nome}</span>
                    <span aria-hidden="true" className={cx("text-[26px] transition-transform duration-300", ativo && "rotate-45")}>
                      +
                    </span>
                  </button>
                </h3>
                <div id={id} hidden={!ativo} className="pb-8 pl-16">
                  <p className="max-w-[56ch] text-apoio">{a.descricao}</p>
                  <p className="mt-3 max-w-[56ch] text-[15px] text-apoio">Cada caso depende de análise individual.</p>
                  <div className="mt-6">
                    <BotaoWhats texto="Conversar sobre este tema" href={waArea(a.nome)} variante="linha" />
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

/* --------------------------------------------- QUANDO PROCURAR (preto) */
const SITUACOES = [
  "Ao receber uma notificação, uma citação ou uma intimação.",
  "Antes de assinar um contrato ou um acordo.",
  "Quando surgir dúvida sobre direitos e deveres numa situação concreta.",
  "Antes de uma decisão com efeitos jurídicos duradouros, como a compra ou a venda de um imóvel.",
];

export function QuandoProcurar({ n }: { n: string }) {
  return (
    <section aria-labelledby="t-quando" className="escuro grao relative bg-preto py-24 text-nevoa md:py-36">
      <MarcaSecao numeral={n} escuro />
      <div className="trilho grid gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <NumeralCelular n={n} escuro />
          <h2 id="t-quando" className="display text-[clamp(40px,5.4vw,80px)]">
            Quando vale <em className="text-ouro-claro">conversar</em> com um advogado
          </h2>
        </div>
        <div className="md:col-span-6 md:col-start-7 md:pt-3">
          <ul>
            {SITUACOES.map((s) => (
              <li key={s} className="flex gap-5 border-t border-white/15 py-7 first:border-t-0 first:pt-0">
                <span aria-hidden="true" className="mt-[0.9em] block h-px w-5 shrink-0 bg-ouro" />
                <span className="display text-[clamp(22px,2.2vw,30px)] leading-[1.3]">{s}</span>
              </li>
            ))}
          </ul>
          <p className="mt-10 border-t border-ouro/50 pt-6 text-[15px] text-apoio-escuro">
            Este site é informativo e não substitui a orientação jurídica individual.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- COMO FUNCIONA */
const ETAPAS = [
  {
    titulo: "Contato e agendamento",
    texto: "Você chama o escritório pelo WhatsApp ou envia a solicitação por este site. O dia e o horário são combinados conforme a agenda.",
  },
  {
    titulo: "Análise do caso",
    texto: "No atendimento, o advogado ouve o relato, examina os documentos que você levar e identifica as questões jurídicas envolvidas.",
  },
  {
    titulo: "Orientação sobre as possibilidades",
    texto: "Você recebe uma explicação clara dos caminhos possíveis, com suas etapas e seus riscos. A decisão sobre como seguir é sua.",
  },
  {
    titulo: "Acompanhamento",
    texto: "Se decidir seguir com o escritório, as condições são combinadas por escrito e você é informado sobre o andamento.",
  },
];

/** Linha do tempo com progresso ao rolar — adaptada do "Scroll animated timeline" (21st.dev, ibrandify). */
export function ComoFunciona({ n }: { n: string }) {
  const lista = useRef<HTMLOListElement>(null);
  const [ativo, setAtivo] = useState(-1);

  useEffect(() => {
    const el = lista.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--prog", "1");
      setAtivo(ETAPAS.length - 1);
      return;
    }
    let visivel = false;
    let pendente = false;
    const calc = () => {
      pendente = false;
      const r = el.getBoundingClientRect();
      const meio = window.innerHeight * 0.55;
      const p = Math.max(0, Math.min(1, (meio - r.top) / r.height));
      el.style.setProperty("--prog", p.toFixed(3));
      const itens = el.querySelectorAll<HTMLLIElement>(":scope > li");
      let a = -1;
      itens.forEach((li, i) => {
        if (li.getBoundingClientRect().top < meio) a = i;
      });
      setAtivo(a);
    };
    const aoRolar = () => {
      if (!visivel || pendente) return;
      pendente = true;
      requestAnimationFrame(calc);
    };
    const io = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
      if (visivel) calc();
    });
    io.observe(el);
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", aoRolar);
    };
  }, []);

  return (
    <section id="como-funciona" aria-labelledby="t-como" className="relative py-24 md:py-36">
      <MarcaSecao numeral={n} />
      <div className="trilho grid gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-40">
            <NumeralCelular n={n} />
            <h2 id="t-como" className="display text-[clamp(40px,5vw,72px)]">
              Como <em>funciona</em>
            </h2>
            <p className="mt-6 max-w-[34ch] text-apoio">
              Quatro etapas, do primeiro contato ao acompanhamento. O tempo de cada uma varia conforme o caso.
            </p>
          </div>
        </div>
        <ol ref={lista} className="relative md:col-span-6 md:col-start-7" style={{ ["--prog" as string]: "0" }}>
          <span aria-hidden="true" className="absolute bottom-6 left-[19px] top-6 w-px bg-fio" />
          <span
            aria-hidden="true"
            className="absolute bottom-6 left-[19px] top-6 w-px origin-top bg-ouro"
            style={{ transform: "scaleY(var(--prog))" }}
          />
          {ETAPAS.map((e, i) => (
            <li key={e.titulo} className="relative grid grid-cols-[40px_1fr] gap-6 pb-14 last:pb-0">
              <span
                className={cx(
                  "display relative z-10 flex h-10 w-10 items-center justify-center border bg-nevoa text-[22px] transition-colors duration-500",
                  i <= ativo ? "border-ouro text-ouro-texto" : "border-fio text-apoio",
                )}
              >
                {i + 1}
              </span>
              <div className="pt-1">
                <h3 className="display text-[clamp(26px,2.6vw,34px)] leading-[1.15]">{e.titulo}</h3>
                <p className="mt-3 max-w-[44ch] text-apoio">{e.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- DÚVIDAS */
function perguntas() {
  const h = temHorarios() ? horariosAgrupados() : [];
  const lista: { p: string; r: ReactNode }[] = [
    {
      p: "Como agendar um atendimento?",
      r: (
        <>
          Pelo WhatsApp {CONFIG.whatsappExibicao} ou pelo formulário de solicitação nesta página. O escritório responde
          confirmando a disponibilidade de dia e horário.
        </>
      ),
    },
    {
      p: "Qual é o horário de atendimento?",
      r: h.length ? (
        <>
          {h
            .filter((x) => x.horas !== "Fechado")
            .map((x) => `${x.dias}, das ${x.horas}`)
            .join("; ")}
          , mediante agendamento. {CONFIG.avisoHorarios}
        </>
      ) : (
        <>Atendimento mediante agendamento. Consulte a disponibilidade pelo WhatsApp.</>
      ),
    },
    {
      p: "Onde fica o escritório?",
      r: CONFIG.endereco ? (
        <>
          {CONFIG.endereco}, {CONFIG.bairro}, {CONFIG.cidade} - {CONFIG.uf}. O mapa e o botão “Como chegar” estão na
          seção de contato.
        </>
      ) : (
        <>Em {CONFIG.cidade} - {CONFIG.uf}. O mapa e o botão “Como chegar” estão na seção de contato.</>
      ),
    },
    {
      p: "Posso solicitar o agendamento pelo site?",
      r: (
        <>
          Sim. O formulário monta uma mensagem e abre o WhatsApp do escritório; basta enviá-la. O atendimento só fica
          marcado depois da confirmação do escritório. O site não guarda os dados digitados.
        </>
      ),
    },
    {
      p: "Como é o primeiro atendimento?",
      r: (
        <>
          É uma conversa para entender a situação. O advogado ouve o relato, olha os documentos disponíveis e explica as
          possibilidades. A duração varia conforme o assunto.
        </>
      ),
    },
    {
      p: "Que documentos costumam ser úteis?",
      r: (
        <>
          De forma geral: documento de identificação e os papéis ligados à situação, como contratos, notificações,
          comprovantes e mensagens. Se puder, organize-os por data. Não envie documentos pelo formulário do site.
        </>
      ),
    },
    {
      p: "Preciso contar o caso em detalhes antes do atendimento?",
      r: <>Não. Para agendar, basta seu nome e sua preferência de dia e horário. Os detalhes ficam para a conversa.</>,
    },
  ];
  if (CONFIG.areas.length)
    lista.push({
      p: "Quais áreas o escritório atende?",
      r: <>{CONFIG.areas.map((a) => a.nome).join(", ")}. Cada caso depende de análise individual.</>,
    });
  lista.push(
    {
      p: "O conteúdo deste site substitui uma consulta?",
      r: <>Não. As informações aqui são gerais e não substituem a orientação jurídica sobre o seu caso.</>,
    },
    {
      p: "Os dados que eu digito no site ficam guardados?",
      r: (
        <>
          Não. O site não tem banco de dados, cookies ou ferramentas de rastreamento. O texto vai apenas para a mensagem
          que você mesmo envia pelo WhatsApp. Veja a{" "}
          <a className="link-sub" href="/privacidade.html">
            página de privacidade
          </a>
          .
        </>
      ),
    },
  );
  return lista;
}

export function Duvidas({ n }: { n: string }) {
  const [aberto, setAberto] = useState<number | null>(0);
  const lista = perguntas();
  return (
    <section id="duvidas" aria-labelledby="t-duvidas" className="relative border-t border-fio py-24 md:py-36">
      <MarcaSecao numeral={n} />
      <div className="trilho grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-40">
            <NumeralCelular n={n} />
            <h2 id="t-duvidas" className="display text-[clamp(40px,5vw,72px)]">
              <em>Dúvidas</em> frequentes
            </h2>
          </div>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          {lista.map((q, i) => {
            const ativo = aberto === i;
            return (
              <div key={q.p} className="border-b border-fio first:border-t">
                <h3>
                  <button
                    type="button"
                    id={`q-${i}`}
                    aria-expanded={ativo}
                    aria-controls={`r-${i}`}
                    onClick={() => setAberto(ativo ? null : i)}
                    className="group flex min-h-[64px] w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className="display text-[clamp(21px,2vw,26px)] leading-[1.25]">{q.p}</span>
                    <span aria-hidden="true" className="relative block h-4 w-4 shrink-0">
                      <span className="absolute left-0 top-1/2 block h-px w-4 bg-preto" />
                      <span
                        className={cx(
                          "absolute left-1/2 top-0 block h-4 w-px bg-preto transition-transform duration-300",
                          ativo && "scale-y-0",
                        )}
                      />
                    </span>
                  </button>
                </h3>
                <div
                  id={`r-${i}`}
                  role="region"
                  aria-labelledby={`q-${i}`}
                  className={cx("grid transition-[grid-template-rows] duration-500 ease-out", ativo ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
                >
                  <div className="overflow-hidden" inert={!ativo}>
                    <p className="max-w-[60ch] pb-7 pr-8 text-apoio">{q.r}</p>
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

/* ------------------------------------------------------ LOCALIZAÇÃO E CONTATO */
function MapaLazy() {
  const ref = useRef<HTMLDivElement>(null);
  const [carregar, setCarregar] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setCarregar(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const { lat, lng } = CONFIG.coordenadas;
  return (
    <div ref={ref} className="relative aspect-[4/3] w-full overflow-hidden bg-nevoa-2 lg:aspect-auto lg:h-full lg:min-h-[460px]">
      {carregar && (
        <iframe
          title={`Mapa: localização do escritório ${CONFIG.nome} em ${CONFIG.cidade}`}
          src={`https://www.google.com/maps?q=${lat},${lng}&z=17&hl=pt-BR&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0 grayscale-[0.85] contrast-[1.05]"
        />
      )}
    </div>
  );
}

export function Contato({ n }: { n: string }) {
  const h = temHorarios() ? horariosAgrupados() : [];
  return (
    <section id="contato" aria-labelledby="t-contato" className="relative border-t border-fio py-24 md:py-36">
      <MarcaSecao numeral={n} />
      <div className="trilho grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <NumeralCelular n={n} />
          <h2 id="t-contato" className="display text-[clamp(40px,5vw,72px)]">
            Venha nos <em>visitar</em>
          </h2>
          {CONFIG.endereco && (
            <address className="mt-8 not-italic text-[18px] leading-[1.6]">
              {CONFIG.endereco}
              <br />
              {CONFIG.bairro && <>{CONFIG.bairro}, </>}
              {CONFIG.cidade} - {CONFIG.uf}
              {CONFIG.cep && <>, {CONFIG.cep}</>}
            </address>
          )}
          <div className="mt-8 border-t border-fio pt-6">
            <p className="rotulo mb-4 text-ouro-texto">Atendimento mediante agendamento</p>
            {h.length > 0 && (
              <>
                <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2 text-[16px]">
                  {h.map((x) => (
                    <div key={x.dias} className="contents">
                      <dt className="text-apoio">{x.dias}</dt>
                      <dd>{x.horas}</dd>
                    </div>
                  ))}
                </dl>
                {CONFIG.avisoHorarios && <p className="mt-3 text-[14px] text-apoio">{CONFIG.avisoHorarios}</p>}
              </>
            )}
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 min-[1400px]:grid-cols-2">
            <a href={comoChegar()} target="_blank" rel="noopener noreferrer" className="btn btn-cheio">
              Como chegar<span className="sr-only"> (abre o Google Maps em nova aba)</span>
            </a>
            <a href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-linha">
              Ver no Google Maps<span className="sr-only"> (abre em nova aba)</span>
            </a>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 min-[1400px]:grid-cols-2">
            {CONFIG.usarWhatsapp && <BotaoWhats variante="linha" />}
            <BotaoInstagram />
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <MapaLazy />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ CTA FINAL */
export function CtaFinal() {
  return (
    <section aria-labelledby="t-cta" className="escuro grao relative overflow-hidden bg-preto py-28 text-nevoa md:py-44">
      <div className="trilho grid items-end gap-14 md:grid-cols-12">
        <div className="md:col-span-8">
          <h2 id="t-cta" className="display text-[clamp(48px,8vw,120px)]">
            O primeiro passo é uma <em className="text-ouro-claro">conversa</em>.
          </h2>
          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <BotaoWhats />
            <BotaoInstagram />
          </div>
        </div>
        <div aria-hidden="true" className="hidden justify-center md:col-span-3 md:col-start-10 md:flex">
          <svg width="60" height="300" viewBox="0 0 60 300">
            <rect x="12" y="0" width="36" height="1" fill="#B39257" />
            <rect x="29.5" y="0" width="1" height="236" fill="#B39257" />
            <path d="M30 236 V246 M14 246 H46 L30 296 Z" fill="#B39257" stroke="#B39257" strokeWidth="1" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- RODAPÉ */
export function Rodape({ logo }: { logo: ReactNode }) {
  const advs = advogadosValidos();
  return (
    <footer className="escuro relative border-t border-ouro/40 bg-preto pb-28 pt-16 text-apoio-escuro md:pb-16">
      <div className="trilho grid gap-10 md:grid-cols-2 lg:grid-cols-12">
        <div className="md:col-span-2 lg:col-span-4">
          {logo}
          <p className="mt-6 text-nevoa">{CONFIG.nome}</p>
          <p>
            {CONFIG.cidade} - {CONFIG.uf}
          </p>
        </div>
        <div className="text-[15px] leading-[1.9] lg:col-span-4">
          {CONFIG.endereco && (
            <p>
              {CONFIG.endereco}
              <br />
              {CONFIG.bairro}, {CONFIG.cidade} - {CONFIG.uf}, {CONFIG.cep}
            </p>
          )}
          <p className="mt-3">
            WhatsApp:{" "}
            <a className="link-sub text-nevoa" href={waLink()} target="_blank" rel="noopener noreferrer">
              {CONFIG.whatsappExibicao}
            </a>
          </p>
          <p>
            Instagram:{" "}
            <a className="link-sub text-nevoa" href={CONFIG.instagram} target="_blank" rel="noopener noreferrer">
              {CONFIG.instagramUsuario}
            </a>
          </p>
          {advs.length > 0 && (
            <ul className="mt-3">
              {advs.map((a) => (
                <li key={a.oab}>
                  {a.nome}, OAB/{a.uf} nº {a.oab}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="text-[14px] leading-[1.7] lg:col-span-4">
          <p>
            Conteúdo meramente informativo, sem finalidade de captação de clientela, em conformidade com o Provimento
            205/2021 do Conselho Federal da OAB.
          </p>
          <p className="mt-4">
            <a className="link-sub inline-block py-2 text-nevoa" href="/privacidade.html">
              Privacidade
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ----------------------------------------- WHATSAPP FLUTUANTE / BARRA CELULAR */
export function WhatsFixo() {
  if (!CONFIG.usarWhatsapp) return null;
  return (
    <>
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Agendar pelo WhatsApp (abre em nova aba)"
        className="fixed bottom-6 right-0 z-30 hidden h-12 w-12 xl:right-2 items-center justify-center border border-ouro bg-preto text-ouro-claro transition-colors hover:bg-ouro hover:text-preto md:flex"
      >
        <IconeWhats />
      </a>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ouro/40 bg-preto px-4 pb-[max(10px,env(safe-area-inset-bottom))] pt-2.5 md:hidden">
        <a
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[48px] items-center justify-center gap-3 text-[15px] font-medium text-nevoa"
        >
          <span className="text-ouro-claro">
            <IconeWhats />
          </span>
          Agendar pelo WhatsApp<span className="sr-only"> (abre em nova aba)</span>
        </a>
      </div>
    </>
  );
}
