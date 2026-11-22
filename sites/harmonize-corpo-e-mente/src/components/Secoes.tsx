import { useEffect, useId, useRef, useState } from "react";
import {
  CONFIG,
  atendimentosAtivos,
  enderecoLinha,
  linkComoChegar,
  linkMapaEmbed,
  linkWhatsapp,
  linkWhatsappAtendimento,
  responsavelPreenchido,
  type Foto,
} from "../config";
import { useVisto } from "../hooks";
import { Afinacao, Fio } from "./Afinacao";

/** React 18 ainda não tipa "inert"; o atributo vazio é passado direto ao DOM. */
const inerte = (sim: boolean) => (sim ? ({ inert: "" } as object) : {});

function Numero({ n, className = "" }: { n: number; className?: string }) {
  const ref = useVisto<HTMLSpanElement>();
  return (
    <span ref={ref} className={`acende num ${className}`} aria-hidden="true">
      {String(n).padStart(2, "0")}
    </span>
  );
}

function Rotulo({ n, children, claro = false }: { n: number; children: React.ReactNode; claro?: boolean }) {
  return (
    <p className={`rotulo flex items-baseline gap-3 ${claro ? "text-areia/80" : "text-apoio"}`}>
      <Numero n={n} />
      <span>{children}</span>
    </p>
  );
}

function Imagem({ f, sizes, className = "", carregar = "lazy" }: { f: Foto; sizes: string; className?: string; carregar?: "lazy" | "eager" }) {
  const srcset = f.larguras.map((w) => `${f.src}-${w}.webp ${w}w`).join(", ");
  const maior = f.larguras[f.larguras.length - 1];
  return (
    <img
      src={`${f.src}-${maior}.webp`}
      srcSet={srcset}
      sizes={sizes}
      width={f.largura}
      height={f.altura}
      alt={f.alt}
      loading={carregar}
      decoding="async"
      className={className}
    />
  );
}

/* ---------------- Atendimentos: índice editorial ---------------- */
export function Atendimentos({ n }: { n: number }) {
  const itens = atendimentosAtivos();
  const [aberto, setAberto] = useState<number>(0);
  const id = useId();
  if (!itens.length) return null;

  return (
    <section id="atendimentos" aria-labelledby="titulo-atendimentos" className="grao bg-tinta text-areia">
      <div className="wrap grid gap-12 py-20 sm:py-28 lg:grid-cols-12 lg:gap-16 lg:py-36">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-40">
            <Rotulo n={n} claro>
              Atendimentos
            </Rotulo>
            <h2 id="titulo-atendimentos" className="mt-6 text-[clamp(2.4rem,4.6vw,4rem)]">
              O que você pode <em className="text-[#E39A7C]">pedir</em> aqui.
            </h2>
            <p className="mt-6 max-w-sm text-areia/75">
              Cada atendimento começa por uma conversa. A indicação depende de avaliação individual.
            </p>
          </div>
        </div>

        <ol className="border-b border-areia/20 lg:col-span-8">
          {itens.map((a, i) => {
            const ab = aberto === i;
            return (
              <li key={a.id} className="border-t border-areia/20">
                <h3 className="font-sans text-base font-normal tracking-normal">
                  <button
                    type="button"
                    id={`${id}-b-${i}`}
                    aria-expanded={ab}
                    aria-controls={`${id}-p-${i}`}
                    onClick={() => setAberto(ab ? -1 : i)}
                    className="group grid w-full grid-cols-[2.75rem_1fr_auto] items-baseline gap-x-3 py-7 text-left sm:grid-cols-[4.5rem_1fr_auto] sm:py-9"
                  >
                    <Numero n={i + 1} className="font-serif text-[1.35rem] sm:text-[1.9rem]" />
                    <span>
                      <span
                        className={`block font-serif text-[clamp(1.7rem,3.6vw,3rem)] leading-[1.02] tracking-[-0.02em] transition-transform duration-500 ${
                          ab ? "translate-x-1.5" : "group-hover:translate-x-1.5"
                        }`}
                      >
                        {a.nome}
                      </span>
                      <span className="rotulo mt-3 block text-areia/65">{a.linha}</span>
                    </span>
                    <span className="mais self-center text-areia" aria-hidden="true" />
                  </button>
                </h3>
                <div
                  id={`${id}-p-${i}`}
                  role="region"
                  aria-labelledby={`${id}-b-${i}`}
                  className="painel"
                  data-aberto={ab}
                  {...inerte(!ab)}
                >
                  <div>
                    <div className="grid gap-6 pb-10 pl-[3.5rem] sm:pl-[5.25rem] md:grid-cols-[1fr_auto] md:items-end">
                      <div className="max-w-[34rem]">
                        <p className="text-[1.0625rem] leading-relaxed text-areia/85">{a.descricao}</p>
                        <p className="mt-4 text-[0.92rem] text-areia/60">A indicação depende de avaliação individual.</p>
                      </div>
                      {CONFIG.usarWhatsapp && (
                        <a
                          className="btn btn-areia justify-self-start"
                          href={linkWhatsappAtendimento(a.nome)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Agendar pelo WhatsApp
                          <span className="sr-only"> ({a.nome})</span>
                        </a>
                      )}
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

/* ---------------- O espaço ---------------- */
export function Espaco({ n }: { n: number }) {
  const fotos = CONFIG.fotos;
  const r = CONFIG.responsavel;
  const temResp = responsavelPreenchido();
  const [f0, f1, f2, f3, f4] = fotos;

  return (
    <section id="espaco" aria-labelledby="titulo-espaco" className="py-20 sm:py-28 lg:py-36">
      <div className="wrap">
        <Rotulo n={n}>O espaço</Rotulo>

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <h2 id="titulo-espaco" className="text-[clamp(2.8rem,7.2vw,6.6rem)] leading-[0.92] lg:col-span-8">
            Harmonize <em>Corpo</em>
            <br className="hidden sm:block" /> e Mente
          </h2>
          <dl className="self-end border-t border-tinta lg:col-span-4">
            <div className="grid grid-cols-[7rem_1fr] gap-4 border-b border-tinta/20 py-4">
              <dt className="rotulo pt-1 text-apoio">Cidade</dt>
              <dd>
                {CONFIG.cidade} - {CONFIG.uf}
              </dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] gap-4 border-b border-tinta/20 py-4">
              <dt className="rotulo pt-1 text-apoio">Agenda</dt>
              <dd>Atendimento somente com hora marcada</dd>
            </div>
            {temResp && (
              <div className="grid grid-cols-[7rem_1fr] gap-4 border-b border-tinta/20 py-4">
                <dt className="rotulo pt-1 text-apoio">Responsável</dt>
                <dd>
                  {r.titulo} {r.nome}
                  <span className="block text-[0.92rem] text-apoio">{r.registro}</span>
                </dd>
              </div>
            )}
          </dl>
        </div>

        {(CONFIG.retrato || f0) && (
          <div className="mt-16 grid gap-6 sm:mt-20 md:grid-cols-12 md:gap-8">
            {f0 && (
              <figure className="md:col-span-8">
                <div className="foto aspect-[4/3] overflow-hidden">
                  <Imagem f={f0} sizes="(min-width: 768px) 62vw, 100vw" />
                </div>
                {f0.legenda && <figcaption className="mt-3 text-[0.9rem] text-apoio">{f0.legenda}</figcaption>}
              </figure>
            )}
            {CONFIG.retrato && (
              <figure className="relative md:col-span-4 md:self-end">
                <div className="relative mx-auto w-[78%] max-w-[22rem] md:w-full">
                  <div className="foto aspect-square overflow-hidden rounded-full">
                    <Imagem f={CONFIG.retrato} sizes="(min-width: 768px) 30vw, 78vw" />
                  </div>
                </div>
                <div className="mt-6">
                  <Afinacao modo="estatico" amplitude={0.55} altura="40px" />
                </div>
                {temResp && (
                  <figcaption className="mt-3 text-[0.9rem] text-apoio">
                    {r.titulo} {r.nome}
                  </figcaption>
                )}
              </figure>
            )}
          </div>
        )}

        {(f1 || f2 || f3 || f4) && (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 md:mt-8 md:grid-cols-12 md:gap-8">
            {f1 && (
              <figure className="col-span-1 md:col-span-3 md:row-span-2">
                <div className="foto aspect-[600/872] overflow-hidden">
                  <Imagem f={f1} sizes="(min-width: 768px) 23vw, 48vw" />
                </div>
                {f1.legenda && <figcaption className="mt-3 text-[0.9rem] text-apoio">{f1.legenda}</figcaption>}
              </figure>
            )}
            {f4 && (
              <figure className="col-span-1 md:col-span-4 md:col-start-4 md:row-span-2">
                <div className="foto aspect-[600/872] overflow-hidden md:aspect-[1170/1542]">
                  <Imagem f={f4} sizes="(min-width: 768px) 31vw, 48vw" />
                </div>
                {f4.legenda && <figcaption className="mt-3 text-[0.9rem] text-apoio">{f4.legenda}</figcaption>}
              </figure>
            )}
            {f2 && (
              <figure className="col-span-2 md:col-span-5">
                <div className="foto aspect-[4/3] overflow-hidden">
                  <Imagem f={f2} sizes="(min-width: 768px) 38vw, 100vw" />
                </div>
                {f2.legenda && <figcaption className="mt-3 text-[0.9rem] text-apoio">{f2.legenda}</figcaption>}
              </figure>
            )}
            {f3 && (
              <figure className="col-span-2 md:col-span-5">
                <div className="foto aspect-[4/3] overflow-hidden">
                  <Imagem f={f3} sizes="(min-width: 768px) 38vw, 100vw" />
                </div>
                {f3.legenda && <figcaption className="mt-3 text-[0.9rem] text-apoio">{f3.legenda}</figcaption>}
              </figure>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------- Como funciona: linha do tempo ---------------- */
const ETAPAS = [
  {
    t: "Contato e agendamento",
    d: "Você chama pelo WhatsApp ou envia o formulário deste site. O Harmonize confirma a disponibilidade e combina o horário.",
  },
  {
    t: "Atendimento individual",
    d: "No dia marcado, o atendimento acontece em sala reservada, só com você.",
  },
  {
    t: "Orientação explicada",
    d: "O que for indicado é explicado com clareza, para você decidir com calma.",
  },
  {
    t: "Acompanhamento",
    d: "Quando fizer sentido, os próximos encontros são combinados, sempre com hora marcada.",
  },
];

export function ComoFunciona({ n }: { n: number }) {
  const lista = useRef<HTMLOListElement>(null);
  const barra = useRef<HTMLDivElement>(null);
  const [ativos, setAtivos] = useState(0);

  useEffect(() => {
    const el = lista.current;
    const b = barra.current;
    if (!el || !b) return;
    const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduz) {
      b.style.transform = "scaleY(1)";
      setAtivos(ETAPAS.length);
      return;
    }
    let raf = 0;
    let visivel = false;
    const calc = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(Math.max((window.innerHeight * 0.6 - r.top) / r.height, 0), 1);
      b.style.transform = `scaleY(${p.toFixed(3)})`;
      setAtivos(Math.min(ETAPAS.length, Math.floor(p * ETAPAS.length + 0.35)));
    };
    const on = () => {
      if (visivel && !raf) raf = requestAnimationFrame(calc);
    };
    const io = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
      if (visivel) on();
    });
    io.observe(el);
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="como-funciona" aria-labelledby="titulo-como" className="bg-areia-2 py-20 sm:py-28 lg:py-36">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Rotulo n={n}>Como funciona</Rotulo>
          <h2 id="titulo-como" className="mt-6 text-[clamp(2.4rem,4.6vw,4rem)]">
            Quatro passos, um de cada <em>vez</em>.
          </h2>
          <p className="mt-6 max-w-md text-apoio">
            O atendimento é individual e com hora marcada. Não há fila nem encaixe.
          </p>
        </div>
        <ol ref={lista} className="relative lg:col-span-7">
          <div aria-hidden="true" className="absolute bottom-2 left-[1.15rem] top-2 w-px bg-tinta/20 sm:left-[1.6rem]" />
          <div
            ref={barra}
            aria-hidden="true"
            className="absolute bottom-2 left-[1.15rem] top-2 w-px origin-top bg-terracota sm:left-[1.6rem]"
            style={{ transform: "scaleY(0)" }}
          />
          {ETAPAS.map((e, i) => (
            <li key={e.t} className="relative grid grid-cols-[2.3rem_1fr] gap-5 pb-12 last:pb-0 sm:grid-cols-[3.2rem_1fr] sm:gap-8">
              <span
                aria-hidden="true"
                className={`relative z-10 bg-areia-2 py-1 text-center font-serif text-[1.6rem] leading-none transition-colors duration-700 sm:text-[2.2rem] ${
                  i < ativos ? "text-terracota-esc" : "text-[#7D766B]"
                }`}
              >
                <span className="num">{i + 1}</span>
              </span>
              <div className="pt-1">
                <h3 className="text-[clamp(1.5rem,2.6vw,2.1rem)]">
                  <span className="sr-only">Etapa {i + 1}: </span>
                  {e.t}
                </h3>
                <p className="mt-3 max-w-md text-apoio">{e.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- Dúvidas ---------------- */
export function Duvidas({ n }: { n: number }) {
  const nomes = atendimentosAtivos().map((a) => a.nome.toLowerCase());
  const listaAtend =
    nomes.length > 1 ? `${nomes.slice(0, -1).join(", ")} e ${nomes[nomes.length - 1]}` : nomes[0] ?? "";
  const temPericia = atendimentosAtivos().some((a) => a.id === "pericias");
  const e = CONFIG.endereco;

  const itens: { p: string; r: React.ReactNode }[] = [
    {
      p: "Como agendar?",
      r: CONFIG.usarWhatsapp ? (
        <>
          Pelo WhatsApp {CONFIG.whatsappExibicao}, ou pelo formulário desta página, que monta a mensagem para você. O
          Harmonize responde e confirma a disponibilidade.
        </>
      ) : (
        <>Pelo Instagram {CONFIG.instagram.usuario}.</>
      ),
    },
    {
      p: "O atendimento é só com hora marcada?",
      r: "Sim. Todos os atendimentos são individuais e acontecem somente com horário combinado antes.",
    },
    listaAtend && {
      p: "Quais atendimentos são oferecidos?",
      r: `Hoje o Harmonize oferece ${listaAtend}.`,
    },
    {
      p: "Todo atendimento serve para todas as pessoas?",
      r: "Não necessariamente. A indicação de cada atendimento depende de avaliação individual, feita com calma no primeiro contato.",
    },
    {
      p: "A estética facial e corporal começa por uma avaliação?",
      r: "Sim. Antes de qualquer sessão há uma conversa para entender o que você procura e o que é adequado para você.",
    },
    {
      p: "Como funciona a psicanálise clínica?",
      r: "São sessões individuais, com hora marcada, em sala reservada. A frequência é combinada diretamente no início.",
    },
    temPericia && {
      p: "Como solicitar uma perícia grafotécnica?",
      r: "Entre em contato descrevendo o tipo de documento ou situação, sem enviar arquivos nem informações sigilosas pelo formulário. Os próximos passos são combinados diretamente. As perícias atendem particulares e empresas, fora do âmbito judicial.",
    },
    {
      p: "Abre aos domingos?",
      r: "Não. O atendimento acontece de segunda a sábado, com hora marcada. Domingo: fechado.",
    },
    {
      p: "Onde fica?",
      r: `${e.rua}, ${e.bairro}, ${e.cidade} - ${e.uf}, CEP ${e.cep}.`,
    },
    CONFIG.usarWhatsapp && {
      p: "Posso agendar pelo site?",
      r: "Pelo formulário você envia uma solicitação, que abre no seu WhatsApp. O horário só fica marcado depois da confirmação do Harmonize.",
    },
  ].filter(Boolean) as { p: string; r: React.ReactNode }[];

  const [aberto, setAberto] = useState<number>(-1);
  const id = useId();

  return (
    <section id="duvidas" aria-labelledby="titulo-duvidas" className="py-20 sm:py-28 lg:py-36">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <Rotulo n={n}>Dúvidas frequentes</Rotulo>
          <h2 id="titulo-duvidas" className="mt-6 text-[clamp(2.4rem,4.6vw,4rem)]">
            Antes de <em>marcar</em>.
          </h2>
        </div>
        <div className="border-b border-tinta/25 lg:col-span-8">
          {itens.map((it, i) => {
            const ab = aberto === i;
            return (
              <div key={it.p} className="border-t border-tinta/25">
                <h3 className="font-sans text-base font-normal tracking-normal">
                  <button
                    type="button"
                    id={`${id}-q-${i}`}
                    aria-expanded={ab}
                    aria-controls={`${id}-r-${i}`}
                    onClick={() => setAberto(ab ? -1 : i)}
                    className="flex min-h-[64px] w-full items-center justify-between gap-6 py-5 text-left font-serif text-[clamp(1.25rem,2.1vw,1.6rem)] leading-tight tracking-[-0.01em] hover:text-terracota-esc"
                  >
                    {it.p}
                    <span className="mais text-terracota-esc" aria-hidden="true" />
                  </button>
                </h3>
                <div id={`${id}-r-${i}`} role="region" aria-labelledby={`${id}-q-${i}`} className="painel" data-aberto={ab} {...inerte(!ab)}>
                  <div>
                    <p className="max-w-2xl pb-7 text-apoio">{it.r}</p>
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

/* ---------------- Localização e contato ---------------- */
function Mapa() {
  const ref = useRef<HTMLDivElement>(null);
  const [mostrar, setMostrar] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMostrar(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="foto relative aspect-[4/3] w-full overflow-hidden border border-tinta/20 lg:aspect-auto lg:h-full lg:min-h-[26rem]">
      {mostrar && (
        <iframe
          title={`Mapa: ${enderecoLinha()}`}
          src={linkMapaEmbed()}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full grayscale-[35%]"
        />
      )}
    </div>
  );
}

export function Local({ n }: { n: number }) {
  const e = CONFIG.endereco;
  return (
    <section id="contato" aria-labelledby="titulo-local" className="pb-20 sm:pb-28 lg:pb-36">
      <div className="wrap">
        <Fio className="mb-20 sm:mb-28" />
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Rotulo n={n}>Localização e contato</Rotulo>
            <h2 id="titulo-local" className="mt-6 text-[clamp(2.4rem,4.6vw,4rem)]">
              Venha nos <em>visitar</em>.
            </h2>
            <address className="mt-10 not-italic">
              <span className="block font-serif text-[clamp(1.6rem,2.6vw,2.2rem)] leading-tight tracking-[-0.015em]">
                {e.rua}
              </span>
              <span className="mt-2 block text-apoio">
                {e.bairro}, {e.cidade} - {e.uf}
                <br />
                CEP {e.cep}
              </span>
            </address>
            <div className="mt-8 border-t border-tinta/25 pt-6">
              <p>{CONFIG.funcionamento}</p>
              <p className="text-apoio">{CONFIG.fechado}.</p>
              {CONFIG.usarWhatsapp && (
                <p className="mt-4">
                  WhatsApp{" "}
                  <a className="link" href={linkWhatsapp()} target="_blank" rel="noopener noreferrer">
                    {CONFIG.whatsappExibicao}
                  </a>
                </p>
              )}
              {CONFIG.telefone && <p>Telefone {CONFIG.telefone}</p>}
              {CONFIG.email && (
                <p>
                  <a className="link" href={`mailto:${CONFIG.email}`}>
                    {CONFIG.email}
                  </a>
                </p>
              )}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {CONFIG.usarWhatsapp && (
                <a className="btn btn-tinta" href={linkWhatsapp()} target="_blank" rel="noopener noreferrer">
                  Agendar pelo WhatsApp
                </a>
              )}
              <a className="btn btn-linha" href={linkComoChegar()} target="_blank" rel="noopener noreferrer">
                Como chegar
              </a>
              {CONFIG.instagram.url && (
                <a className="btn btn-linha" href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">
                  Ver no Instagram
                </a>
              )}
            </div>
          </div>
          <div className="lg:col-span-7">
            <Mapa />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA final ---------------- */
export function CtaFinal() {
  return (
    <section aria-labelledby="titulo-cta" className="grao overflow-hidden bg-tinta py-20 text-areia sm:py-28">
      <div className="wrap">
        <h2 id="titulo-cta" className="max-w-[14ch] text-[clamp(2.6rem,6.4vw,5.6rem)] leading-[0.95]">
          O primeiro passo é uma <em className="text-[#E39A7C]">conversa</em>.
        </h2>
      </div>
      <div className="my-12 sm:my-16">
        <Afinacao modo="estatico" amplitude={0.4} tom="areia" altura="72px" />
      </div>
      <div className="wrap flex flex-wrap gap-3">
        {CONFIG.usarWhatsapp && (
          <a className="btn btn-areia" href={linkWhatsapp()} target="_blank" rel="noopener noreferrer">
            Agendar pelo WhatsApp
          </a>
        )}
        {CONFIG.usarWhatsapp && CONFIG.secoes.agendar && (
          <a className="btn btn-linha-claro" href="#agendar">
            Solicitar agendamento
          </a>
        )}
        {CONFIG.instagram.url && (
          <a className="btn btn-linha-claro" href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">
            Ver no Instagram
          </a>
        )}
      </div>
    </section>
  );
}

/* ---------------- Rodapé ---------------- */
export function Rodape() {
  const r = CONFIG.responsavel;
  return (
    <footer className="bg-tinta pb-28 text-areia/85 sm:pb-12">
      <div className="wrap">
        <Fio tom="areia" />
        <div className="grid gap-10 pt-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <img src="/img/logo-areia-sm.webp" alt="Harmonize Corpo e Mente" width={300} height={93} loading="lazy" className="h-14 w-auto" />
            <p className="mt-6">
              {CONFIG.nome} <span aria-hidden="true">·</span> {CONFIG.cidade}/{CONFIG.uf}
            </p>
            {responsavelPreenchido() && (
              <p className="mt-2 text-areia/70">
                {r.titulo} {r.nome} · {r.registro}
              </p>
            )}
          </div>
          <div className="md:col-span-4">
            <p>{enderecoLinha()}</p>
            <p className="mt-2 text-areia/70">{CONFIG.funcionamento}</p>
          </div>
          <ul className="space-y-2 md:col-span-3">
            {CONFIG.usarWhatsapp && (
              <li>
                <a className="link inline-block py-1" href={linkWhatsapp()} target="_blank" rel="noopener noreferrer">
                  WhatsApp {CONFIG.whatsappExibicao}
                </a>
              </li>
            )}
            {CONFIG.instagram.url && (
              <li>
                <a className="link inline-block py-1" href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">
                  Instagram {CONFIG.instagram.usuario}
                </a>
              </li>
            )}
            <li>
              <a className="link inline-block py-1" href="/privacidade.html">
                Privacidade
              </a>
            </li>
          </ul>
        </div>
        <p className="mt-14 max-w-3xl border-t border-areia/15 pt-6 text-[0.875rem] leading-relaxed text-areia/65">
          Conteúdo informativo, sem finalidade de diagnóstico ou promessa de resultado. A indicação de cada atendimento
          depende de avaliação individual.
        </p>
      </div>
    </footer>
  );
}

/* ---------------- Botão flutuante e barra no celular ---------------- */
export function AtalhoAgendar() {
  const [mostrar, setMostrar] = useState(false);
  useEffect(() => {
    const on = () => {
      const fim = window.innerHeight + window.scrollY > document.body.scrollHeight - 160;
      const form = document.getElementById("agendar")?.getBoundingClientRect();
      const noForm = form ? form.top < window.innerHeight * 0.6 && form.bottom > window.innerHeight * 0.3 : false;
      setMostrar(window.scrollY > window.innerHeight * 0.8 && !fim && !noForm);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  if (!CONFIG.usarWhatsapp) return null;
  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-tinta/15 bg-areia/95 px-4 py-3 transition-transform duration-500 sm:hidden ${
          mostrar ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!mostrar}
      >
        <a
          className="btn btn-tinta w-full"
          href={linkWhatsapp()}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={mostrar ? 0 : -1}
        >
          Agendar pelo WhatsApp
        </a>
      </div>
      <a
        href={linkWhatsapp()}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={mostrar ? 0 : -1}
        aria-hidden={!mostrar}
        className={`btn btn-tinta fixed bottom-6 right-6 z-40 hidden ring-1 ring-areia/40 transition-[opacity,transform] duration-500 sm:inline-flex ${
          mostrar ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        Agendar pelo WhatsApp
      </a>
    </>
  );
}
