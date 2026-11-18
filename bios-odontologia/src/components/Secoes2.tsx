import { useEffect, useId, useRef, useState } from "react";
import { m, LazyMotion, domAnimation, useScroll, useSpring, useMotionValueEvent } from "motion/react";
import { CONFIG, atendimentosVisiveis, enderecoLinha, waLink } from "../config";
import { useMenosMovimento } from "../hooks";
import { AroLente, Regua } from "./Regua";
import { CONTEINER } from "./Secoes1";

/* ============================== COMO FUNCIONA ============================== */
const ETAPAS = [
  {
    titulo: "Contato e agendamento",
    texto: "Você fala com a equipe pelo WhatsApp ou pelo telefone e combina o dia e o horário da avaliação.",
  },
  {
    titulo: "Avaliação individual",
    texto:
      "Na primeira consulta, o profissional ouve o que você procura, examina e, quando necessário, pede exames complementares.",
  },
  {
    titulo: "Planejamento explicado",
    texto: "Você recebe a explicação das opções, das etapas e dos cuidados de cada uma, e decide com essas informações.",
  },
  {
    titulo: "Acompanhamento",
    texto: "As consultas de retorno são marcadas conforme o planejamento combinado, durante e depois do tratamento.",
  },
];

export function ComoFunciona() {
  const alvo = useRef<HTMLOListElement>(null);
  const reduz = useMenosMovimento();
  const { scrollYProgress } = useScroll({ target: alvo, offset: ["start 75%", "end 55%"] });
  const progresso = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const [ativa, setAtiva] = useState(reduz ? ETAPAS.length : 0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduz) return;
    setAtiva(Math.min(ETAPAS.length, Math.floor(v * ETAPAS.length + 0.35)));
  });
  useEffect(() => {
    if (reduz) setAtiva(ETAPAS.length);
  }, [reduz]);

  return (
    <section id="como-funciona" aria-labelledby="titulo-como" className="bg-pedra-2 py-20 sm:py-28">
      <div className={`${CONTEINER} grid gap-12 lg:grid-cols-12`}>
        <div className="lg:col-span-5">
          <p className="rotulo m-0 text-bronze-texto">Como funciona</p>
          <h2 id="titulo-como" className="t-h2 mb-0 mt-5">
            Quatro etapas, nesta <em>ordem</em>.
          </h2>
          <p className="mt-6 max-w-[38ch] text-cinza">
            O caminho é o mesmo para qualquer atendimento: primeiro a conversa e o exame, depois o planejamento.
          </p>
        </div>

        <LazyMotion features={domAnimation}>
          <ol ref={alvo} className="relative m-0 list-none p-0 lg:col-span-7">
            {/* trilho e progresso */}
            <span aria-hidden="true" className="absolute bottom-6 left-[1.6rem] top-6 w-px bg-pedra-3 sm:left-[2.3rem]" />
            <m.span
              aria-hidden="true"
              className="absolute bottom-6 left-[1.6rem] top-6 w-px origin-top bg-bronze-texto sm:left-[2.3rem]"
              style={{ scaleY: reduz ? 1 : progresso }}
            />
            {ETAPAS.map((e, i) => {
              const acesa = i < ativa;
              return (
                <li key={e.titulo} className="relative grid grid-cols-[3.25rem_1fr] gap-5 pb-12 last:pb-0 sm:grid-cols-[4.6rem_1fr] sm:gap-8">
                  <span
                    aria-hidden="true"
                    className={`num relative z-[1] flex size-[3.25rem] items-center justify-center bg-pedra-2 font-display text-[2.5rem] leading-none transition-colors duration-500 sm:size-[4.6rem] sm:text-[3.75rem] ${
                      acesa ? "text-bronze-texto" : "text-[#a29b8f]"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="pt-1 sm:pt-3">
                    <h3 className="m-0 font-display text-[1.75rem] leading-tight tracking-[-0.02em] sm:text-[2rem]">
                      <span className="sr-only">Etapa {i + 1}: </span>
                      {e.titulo}
                    </h3>
                    <p className="mb-0 mt-3 max-w-[48ch] text-cinza">{e.texto}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </LazyMotion>
      </div>
    </section>
  );
}

/* ============================== DÚVIDAS ============================== */
function perguntas() {
  const at = atendimentosVisiveis().map((a) => a.nome.toLowerCase());
  const lista = at.length > 1 ? `${at.slice(0, -1).join(", ")} e ${at[at.length - 1]}` : at[0];
  const meios = CONFIG.usarWhatsapp
    ? `pelo WhatsApp ${CONFIG.whatsappExibicao}, pelo telefone ${CONFIG.telefone} ou pelo formulário desta página`
    : `pelo telefone ${CONFIG.telefone}`;
  const q: { p: string; r: string }[] = [
    {
      p: "Como agendar uma avaliação?",
      r: `Você pode agendar ${meios}. A equipe confirma o dia e o horário com você.`,
    },
    ...(CONFIG.usarWhatsapp && CONFIG.secoes.agendar
      ? [
          {
            p: "Posso agendar pelo site?",
            r: "Pelo formulário \"Solicitar agendamento\" você informa seu nome, o atendimento e a sua preferência de dia e horário. O site monta a mensagem e abre o WhatsApp da clínica. A equipe confirma a disponibilidade na conversa.",
          },
        ]
      : []),
    {
      p: "Como é a primeira avaliação?",
      r: "É uma consulta de conversa e exame. O profissional ouve o que você procura, examina e explica o que observou. Quando necessário, pede exames complementares antes de propor um planejamento.",
    },
    {
      p: "O que levar na consulta?",
      r: "Um documento com foto e, se tiver, exames odontológicos recentes e a lista dos medicamentos que você usa.",
    },
    {
      p: "Quais atendimentos o instituto oferece?",
      r: `O instituto atende em ${lista}.`,
    },
    {
      p: "Todo procedimento serve para todas as pessoas?",
      r: "Não. Cada caso tem características próprias, e a indicação de qualquer procedimento depende de avaliação individual por profissional habilitado.",
    },
    ...(CONFIG.atendimentos.some((a) => a.id === "endodontia")
      ? [
          {
            p: "O que é endodontia com microscopia?",
            r: "É o tratamento de canal feito com o apoio de um microscópio, que amplia a visão do profissional durante o procedimento. A indicação é definida na avaliação.",
          },
        ]
      : []),
    {
      p: "Posso agendar pelo WhatsApp ou por telefone?",
      r: CONFIG.usarWhatsapp
        ? `Sim, pelos dois: WhatsApp ${CONFIG.whatsappExibicao} e telefone ${CONFIG.telefone}.`
        : `Sim, pelo telefone ${CONFIG.telefone}.`,
    },
    {
      p: "Qual é o horário de atendimento?",
      r: CONFIG.horarios.length
        ? "Os horários de cada dia estão na seção de contato. O atendimento é feito com horário marcado."
        : "O atendimento é feito mediante agendamento. Combine o dia e o horário pelo WhatsApp ou pelo telefone.",
    },
    {
      p: "Onde fica o instituto?",
      r: `${enderecoLinha()}, CEP ${CONFIG.endereco.cep}. Na seção de contato há o mapa e o botão "Como chegar".`,
    },
  ];
  return q;
}

export function Duvidas() {
  const q = perguntas();
  const [aberta, setAberta] = useState<number | null>(0);
  const base = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <section id="duvidas" aria-labelledby="titulo-duvidas" className="py-20 sm:py-28">
      <div className={`${CONTEINER} grid gap-12 lg:grid-cols-12`}>
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <p className="rotulo m-0 text-bronze-texto">Dúvidas frequentes</p>
            <h2 id="titulo-duvidas" className="t-h2 mb-0 mt-5">
              Antes da <em>consulta</em>.
            </h2>
            {CONFIG.usarWhatsapp && (
              <p className="mt-6 max-w-[34ch] text-cinza">
                Sua pergunta não está aqui?{" "}
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="link text-grafite">
                  Pergunte pelo WhatsApp
                </a>
                .
              </p>
            )}
          </div>
        </div>
        <div className="lg:col-span-8">
          {q.map((item, i) => {
            const estaAberta = aberta === i;
            const travar = !estaAberta ? ({ inert: "" } as Record<string, string>) : {};
            return (
              <div key={item.p} className="border-t border-pedra-3 last:border-b">
                <h3 className="m-0 font-sans text-[1.125rem] font-semibold leading-snug tracking-normal sm:text-[1.25rem]">
                  <button
                    id={`${base}-q${i}`}
                    type="button"
                    aria-expanded={estaAberta}
                    aria-controls={`${base}-r${i}`}
                    onClick={() => setAberta(estaAberta ? null : i)}
                    className="flex min-h-16 w-full cursor-pointer items-center justify-between gap-6 py-5 text-left"
                  >
                    <span>{item.p}</span>
                    <span
                      aria-hidden="true"
                      className={`relative block size-4 shrink-0 transition-transform duration-300 motion-reduce:transition-none ${
                        estaAberta ? "rotate-45" : ""
                      }`}
                    >
                      <span className="absolute left-0 top-1/2 h-px w-4 bg-current" />
                      <span className="absolute left-1/2 top-0 h-4 w-px bg-current" />
                    </span>
                  </button>
                </h3>
                <div
                  id={`${base}-r${i}`}
                  role="region"
                  aria-labelledby={`${base}-q${i}`}
                  className="painel"
                  data-aberto={estaAberta}
                  {...travar}
                >
                  <div>
                    <p className="m-0 max-w-[62ch] pb-7 pr-10 text-cinza">{item.r}</p>
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

/* ============================== CONTATO ============================== */
const NOMES_DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

function Mapa() {
  const caixa = useRef<HTMLDivElement>(null);
  const [carregar, setCarregar] = useState(false);
  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return setCarregar(true);
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setCarregar(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={caixa} className="relative aspect-[4/5] w-full overflow-hidden border border-grafite bg-pedra-2 sm:aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[32rem]">
      {/* enquanto o mapa não carrega: a retícula da marca */}
      <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
        <AroLente className="size-40 text-bronze" />
      </div>
      {carregar && (
        <iframe
          title={`Mapa: ${enderecoLinha()}`}
          src={CONFIG.mapaEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 size-full border-0 [filter:grayscale(1)_contrast(0.95)_sepia(0.12)]"
        />
      )}
    </div>
  );
}

export function Contato() {
  const e = CONFIG.endereco;
  return (
    <section id="contato" aria-labelledby="titulo-contato" className="pb-20 sm:pb-28">
      <div className={CONTEINER}>
        <Regua className="mb-16 sm:mb-20" />
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="rotulo m-0 text-bronze-texto">Localização e contato</p>
            <h2 id="titulo-contato" className="t-h2 mb-0 mt-5">
              Venha nos <em>visitar</em>.
            </h2>

            <address className="mt-10 not-italic">
              <span className="block font-display text-[clamp(1.625rem,3vw,2.375rem)] leading-[1.15] tracking-[-0.02em]">
                {e.rua}, {e.numero}
                <br />
                {e.bairro}, {e.cidade} - {e.uf}
              </span>
              <span className="num mt-2 block text-cinza">CEP {e.cep}</span>
            </address>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href={CONFIG.rotaUrl} target="_blank" rel="noopener noreferrer" className="botao botao-cheio">
                Como chegar
              </a>
              <a href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer" className="botao botao-linha">
                Ver no Google Maps
              </a>
            </div>

            <dl className="mt-12 grid gap-0">
              <div className="grid grid-cols-[7.5rem_1fr] gap-4 border-t border-pedra-3 py-4 sm:grid-cols-[9rem_1fr]">
                <dt className="rotulo pt-1 text-cinza">Atendimento</dt>
                <dd className="m-0">
                  {CONFIG.horarios.length ? (
                    <ul className="m-0 list-none p-0">
                      {CONFIG.horarios.map((h) => (
                        <li key={h.dia} className="num">
                          {NOMES_DIAS[h.dia]}: {h.abre} às {h.fecha}
                          {h.pausas?.length ? ` (pausa ${h.pausas.map((p) => `${p.inicio}–${p.fim}`).join(", ")})` : ""}
                        </li>
                      ))}
                      <li className="text-cinza">Com horário marcado.</li>
                    </ul>
                  ) : (
                    "Atendimento mediante agendamento"
                  )}
                </dd>
              </div>
              {CONFIG.usarWhatsapp && (
                <div className="grid grid-cols-[7.5rem_1fr] gap-4 border-t border-pedra-3 py-4 sm:grid-cols-[9rem_1fr]">
                  <dt className="rotulo pt-1 text-cinza">WhatsApp</dt>
                  <dd className="num m-0">{CONFIG.whatsappExibicao}</dd>
                </div>
              )}
              <div className="grid grid-cols-[7.5rem_1fr] gap-4 border-t border-pedra-3 py-4 sm:grid-cols-[9rem_1fr]">
                <dt className="rotulo pt-1 text-cinza">Telefone</dt>
                <dd className="num m-0">
                  {CONFIG.telefone}
                  {CONFIG.telefone2 && (
                    <>
                      <br />
                      <a href={CONFIG.telefone2Link} className="link">
                        {CONFIG.telefone2}
                      </a>
                    </>
                  )}
                </dd>
              </div>
              {CONFIG.email && (
                <div className="grid grid-cols-[7.5rem_1fr] gap-4 border-t border-pedra-3 py-4 sm:grid-cols-[9rem_1fr]">
                  <dt className="rotulo pt-1 text-cinza">E-mail</dt>
                  <dd className="m-0">{CONFIG.email}</dd>
                </div>
              )}
              <div className="grid grid-cols-[7.5rem_1fr] gap-4 border-y border-pedra-3 py-4 sm:grid-cols-[9rem_1fr]">
                <dt className="rotulo pt-1 text-cinza">Instagram</dt>
                <dd className="m-0">{CONFIG.instagram.usuario}</dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {CONFIG.usarWhatsapp && (
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="botao botao-cheio">
                  Agendar pelo WhatsApp
                </a>
              )}
              <a href={CONFIG.telefoneLink} className="botao botao-linha">
                Ligar
              </a>
              <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="botao botao-linha">
                Ver no Instagram
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <Mapa />
          </div>
        </div>
      </div>
    </section>
  );
}
