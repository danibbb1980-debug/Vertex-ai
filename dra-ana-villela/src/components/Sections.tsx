import { m, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { CONFIG, croTexto, whatsappLink } from "../config";
import { IconArrowUpRight } from "./Icons";
import { Reveal, SectionHeading } from "./Reveal";

/* ---------------- Filosofia ---------------- */
export function Filosofia() {
  return (
    <section aria-labelledby="filosofia-titulo" className="relative py-24 sm:py-32">
      <div className="container-site">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="eyebrow text-rose-ink">Filosofia</p>
          <h2 id="filosofia-titulo" className="sr-only">Filosofia de trabalho</h2>
          <p className="mt-8 font-display text-[1.85rem] font-[300] leading-[1.3] text-tinta sm:text-[2.6rem] lg:text-[3.1rem]">
            Estética dental é uma questão de <em className="text-rose-ink">harmonia</em>, proporção e escuta.
            O sorriso certo não é o mais branco nem o mais chamativo: é aquele que combina com o seu rosto,
            com a sua expressão e com quem você é.
          </p>
          <div aria-hidden className="filete mx-auto mt-12 w-40" />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Tratamentos ---------------- */
const tratamentos = [
  {
    nome: "Lentes em resina e porcelana",
    titulo: (
      <>
        Lentes em resina <em>e porcelana</em>
      </>
    ),
    texto:
      "Lâminas finas aplicadas sobre a face visível dos dentes para ajustar forma, cor e proporção. A resina é trabalhada diretamente no consultório; a porcelana é confeccionada em laboratório. Qual material faz sentido, e se as lentes são indicadas, é algo definido na avaliação.",
    pontos: ["Forma e proporção", "Cor", "Planejamento do sorriso"],
  },
  {
    nome: "Clareamento dental",
    titulo: (
      <>
        Clareamento <em>dental</em>
      </>
    ),
    texto:
      "Procedimento para deixar a cor dos dentes mais clara, sempre com acompanhamento profissional. Antes de indicar, são avaliadas a saúde dos dentes e da gengiva, a sensibilidade e a expectativa de tonalidade de cada pessoa.",
    pontos: ["Avaliação prévia", "Acompanhamento", "Tonalidade natural"],
  },
  {
    nome: "Alinhadores transparentes",
    titulo: (
      <>
        Alinhadores <em>transparentes</em>
      </>
    ),
    // CONFIRMAR COM A DOUTORA: se é prestadora credenciada Invisalign e como citar a marca.
    texto:
      "Placas transparentes e removíveis, feitas sob medida, que movimentam os dentes de forma gradual ao longo do tratamento. Uma alternativa discreta de ortodontia, cuja indicação depende da análise de cada caso.",
    pontos: ["Sob medida", "Removíveis", "Discretos"],
  },
  {
    nome: "Avaliação estética personalizada",
    titulo: (
      <>
        Avaliação estética <em>personalizada</em>
      </>
    ),
    texto:
      "O ponto de partida de qualquer tratamento. Uma conversa sobre o que incomoda você, a análise do sorriso em relação ao rosto e a explicação clara das possibilidades, para que a decisão seja sua e bem informada.",
    pontos: ["Escuta", "Análise facial e do sorriso", "Explicação das opções"],
  },
];

const tons = ["bg-[#fffdf9]", "bg-[#f7efe9]", "bg-[#f1ece4]", "bg-tinta text-porcelana on-dark"];

export function Tratamentos() {
  return (
    <section id="tratamentos" aria-labelledby="tratamentos-titulo" className="relative bg-porcelana-2/60 py-24 sm:py-32">
      <div className="container-site grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-36 lg:self-start">
          <SectionHeading
            id="tratamentos-titulo"
            eyebrow="Tratamentos"
            title={
              <>
                Cada sorriso pede um <em className="text-rose-ink">caminho</em> próprio.
              </>
            }
            intro="Os tratamentos abaixo são apresentados de forma educativa. A indicação de cada um depende sempre de avaliação individual."
          />
        </div>

        <ol className="relative flex flex-col gap-6 lg:gap-10">
          {tratamentos.map((t, i) => {
            const dark = i === tratamentos.length - 1;
            return (
              <li
                key={t.nome}
                className="lg:sticky"
                style={{ top: `calc(${CONFIG.rascunho ? 8.5 : 6.5}rem + ${i * 1.4}rem)` }}
              >
                <article
                  className={`relative overflow-hidden rounded-[1.75rem] border p-7 shadow-[0_30px_60px_-45px_rgba(27,37,54,0.45)] sm:p-10 ${tons[i]} ${
                    dark ? "border-tinta" : "border-tinta/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-6">
                    <span className={`eyebrow ${dark ? "text-rose" : "text-rose-ink"}`}>0{i + 1} / 0{tratamentos.length}</span>
                    <span aria-hidden className={`h-10 w-10 rounded-full border ${dark ? "border-rose/40" : "border-champagne"}`} />
                  </div>
                  <h3 className={`mt-6 text-3xl sm:text-[2.6rem] ${dark ? "text-porcelana" : "text-tinta"}`}>{t.titulo}</h3>
                  <p className={`mt-5 max-w-xl ${dark ? "text-porcelana/80" : "text-grafite"}`}>{t.texto}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {t.pontos.map((p) => (
                      <li
                        key={p}
                        className={`rounded-full border px-3.5 py-1 text-[0.8rem] ${
                          dark ? "border-porcelana/20 text-porcelana/80" : "border-tinta/12 text-grafite"
                        }`}
                      >
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className={`mt-8 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between ${dark ? "border-porcelana/15" : "border-tinta/10"}`}>
                    <p className={`text-[0.82rem] italic ${dark ? "text-porcelana/65" : "text-grafite"}`}>Depende de avaliação individual.</p>
                    <a
                      href={whatsappLink(
                        i === tratamentos.length - 1
                          ? "Olá, Dra. Ana! Vi seu site e gostaria de agendar uma avaliação estética personalizada."
                          : `Olá, Dra. Ana! Vi seu site e gostaria de conversar sobre ${t.nome.toLowerCase()}.`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group inline-flex min-h-11 items-center gap-2 text-[0.92rem] font-medium ${dark ? "text-rose" : "text-tinta"}`}
                    >
                      <span className="link-sublinhado">Conversar sobre este tratamento</span>
                      <span className="sr-only">: {t.nome}, pelo WhatsApp</span>
                      <IconArrowUpRight width={18} height={18} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- Como funciona ---------------- */
const etapas = [
  {
    titulo: "Conversa pelo WhatsApp",
    texto: "Você envia uma mensagem, conta brevemente o que deseja e combinamos o melhor horário para a sua avaliação.",
  },
  {
    titulo: "Avaliação estética e escuta",
    texto: "No consultório, a doutora ouve as suas expectativas e analisa o sorriso em relação ao rosto, aos dentes e à gengiva.",
  },
  {
    titulo: "Planejamento explicado com clareza",
    texto: "As possibilidades são apresentadas de forma transparente, com o que cada uma envolve, para você decidir com tranquilidade.",
  },
  {
    titulo: "Acompanhamento",
    texto: "Depois do tratamento, o cuidado continua com retornos e orientações para manter a saúde e a estética do sorriso.",
  },
];

export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <section id="como-funciona" aria-labelledby="como-titulo" className="py-24 sm:py-32">
      <div className="container-site grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHeading
          id="como-titulo"
          eyebrow="Como funciona"
          title={
            <>
              Do primeiro contato ao <em className="text-rose-ink">acompanhamento</em>.
            </>
          }
          intro="Um processo simples e sem pressa, em que cada etapa é explicada antes de acontecer."
        />

        <ol ref={ref} className="relative">
          <span aria-hidden className="absolute left-[1.15rem] top-2 bottom-2 w-px bg-tinta/10 sm:left-[1.4rem]" />
          <m.span
            aria-hidden
            style={{ scaleY: reduce ? 1 : scaleY }}
            className="absolute left-[1.15rem] top-2 bottom-2 w-px origin-top bg-rose-ink sm:left-[1.4rem]"
          />
          {etapas.map((e, i) => (
            <Reveal as="li" key={e.titulo} delay={i * 0.05} className="relative pb-12 pl-16 last:pb-0 sm:pl-24">
              <span className="absolute left-0 top-0 flex h-[2.3rem] w-[2.3rem] items-center justify-center rounded-full border border-rose-ink/40 bg-porcelana font-display text-[0.95rem] italic text-rose-ink sm:h-[2.8rem] sm:w-[2.8rem] sm:text-lg">
                {i + 1}
              </span>
              <h3 className="pt-1 text-2xl text-tinta sm:text-[1.9rem]">{e.titulo}</h3>
              <p className="mt-3 max-w-lg text-grafite">{e.texto}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- Sobre ---------------- */
export function Sobre() {
  return (
    <section id="sobre" aria-labelledby="sobre-titulo" className="relative overflow-hidden bg-porcelana-2/60 py-24 sm:py-32">
      <div className="container-site grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <Reveal className="relative order-last mx-auto w-full max-w-[22rem] lg:order-first lg:max-w-[24rem]">
          <div aria-hidden className="absolute -left-6 -top-6 h-40 w-40 rounded-full border border-champagne/70" />
          <figure className="relative">
            <div className="aspect-[953/1716] overflow-hidden rounded-[1.75rem] bg-porcelana-2">
              <img
                src={CONFIG.fotos.consultorio}
                srcSet={CONFIG.fotos.consultorioSrcSet}
                sizes="(min-width: 1024px) 384px, min(352px, calc(100vw - 40px))"
                alt={`${CONFIG.nome} no consultório, de jaleco azul-marinho, calçando luvas`}
                width={953}
                height={1716}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top"
              />
            </div>
            <figcaption className="mt-4 flex items-center gap-3 text-[0.8rem] text-grafite">
              <span aria-hidden className="h-px w-6 bg-champagne" />
              Consultório em Poços de Caldas
            </figcaption>
          </figure>
        </Reveal>

        <div>
          <SectionHeading
            id="sobre-titulo"
            eyebrow="Sobre a doutora"
            title={
              <>
                Dra. Ana <em className="text-rose-ink">Villela</em>
              </>
            }
          />
          <Reveal delay={0.1}>
            <div className="mt-8 space-y-5 text-lg text-grafite">
              {/* Texto baseado apenas na bio do Instagram e na ficha do Google. CONFIRMAR COM A DOUTORA */}
              <p>
                Ana Villela é cirurgiã-dentista em Poços de Caldas e dedica o seu trabalho à estética dental: lentes em
                resina e porcelana, clareamento e alinhadores transparentes.
              </p>
              <p>
                O atendimento começa sempre por uma avaliação estética personalizada, em que cada sorriso é pensado a
                partir do rosto, da expressão e das expectativas de quem chega ao consultório.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <dl className="mt-10 grid grid-cols-1 border-y border-tinta/10 sm:grid-cols-3">
              {[
                ["Registro", croTexto],
                ["Especialidade", CONFIG.especialidade ?? "A confirmar"],
                ["Atendimento", "Centro, Poços de Caldas"],
              ].map(([k, v], i) => (
                <div key={k} className={`py-5 sm:px-5 ${i > 0 ? "border-t border-tinta/10 sm:border-t-0 sm:border-l" : "sm:pl-0"}`}>
                  <dt className="eyebrow !text-[0.62rem] text-grafite">{k}</dt>
                  <dd className="mt-1.5 font-display text-xl text-tinta">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Consultório ---------------- */
function Foto({
  src,
  alt,
  legenda,
  w,
  h,
  className = "",
}: {
  src: string;
  alt: string;
  legenda: string;
  w: number;
  h: number;
  className?: string;
}) {
  return (
    <figure className={`group flex flex-col ${className}`}>
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-[1.5rem] bg-porcelana-2">
        <img
          src={src}
          alt={alt}
          width={w}
          height={h}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
        />
      </div>
      <figcaption className="mt-3 flex items-center gap-3 text-[0.8rem] text-grafite">
        <span aria-hidden className="h-px w-6 bg-champagne" />
        {legenda}
      </figcaption>
    </figure>
  );
}

export function Consultorio() {
  return (
    <section aria-labelledby="consultorio-titulo" className="py-24 sm:py-32">
      <div className="container-site">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="consultorio-titulo"
            eyebrow="O consultório"
            title={
              <>
                Um espaço <em className="text-rose-ink">tranquilo</em> no Centro.
              </>
            }
          />
          <Reveal delay={0.1} className="max-w-sm lg:pb-3">
            <p className="text-grafite">
              Atendimento na Rua Rio Grande do Sul, em Poços de Caldas, num ambiente calmo para conversar sobre o seu sorriso
              sem pressa.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 lg:h-[38rem] lg:grid-cols-12 lg:grid-rows-2">
          <Foto
            src={CONFIG.fotos.fachada}
            alt="Fachada do consultório: sobrado de tijolinhos com floreiras nas janelas, grade e jardim na calçada"
            legenda="Fachada"
            w={379}
            h={508}
            className="col-span-2 aspect-[4/5] sm:aspect-[4/3] lg:col-span-5 lg:row-span-2 lg:aspect-auto"
          />
          <Foto
            src={CONFIG.fotos.sala}
            alt="Sala de atendimento clara, com cadeira odontológica, bancada de vidro e iluminação embutida"
            legenda="Sala de atendimento"
            w={404}
            h={508}
            className="aspect-[3/4] lg:col-span-4 lg:row-span-2 lg:aspect-auto"
          />
          <Foto
            src={CONFIG.fotos.entrada}
            alt="Entrada com porta de vidro, sala de espera e jardim lateral com plantas"
            legenda="Entrada e recepção"
            w={457}
            h={318}
            className="aspect-[3/4] lg:col-span-3 lg:aspect-auto"
          />
          <div className="col-span-2 flex flex-col justify-between rounded-[1.5rem] border border-tinta/10 p-7 lg:col-span-3">
            <p className="font-display text-2xl leading-snug text-tinta">
              Venha <em className="text-rose-ink">conhecer</em> pessoalmente.
            </p>
            <a
              href="#contato"
              className="group mt-6 inline-flex items-center gap-2 text-[0.92rem] font-medium text-tinta"
            >
              <span className="link-sublinhado">Endereço e horários</span>
              <IconArrowUpRight width={18} height={18} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Compromissos ---------------- */
// Compromissos de atendimento: VALIDAR COM A DOUTORA antes da versão final.
const compromissos = [
  { t: "Naturalidade", d: "Tratamentos planejados para que o sorriso pareça seu, com forma, cor e proporção em equilíbrio com o rosto." },
  { t: "Planejamento individual", d: "Nenhum caso é tratado como padrão. Cada plano parte da avaliação de quem você é." },
  { t: "Clareza", d: "Cada etapa é explicada antes de acontecer, com espaço para todas as suas perguntas." },
  { t: "Acompanhamento", d: "O cuidado continua depois do tratamento, com retornos e orientações." },
];

export function Compromissos() {
  return (
    <section aria-labelledby="compromissos-titulo" className="py-24 sm:py-32">
      <div className="container-site">
        <SectionHeading
          id="compromissos-titulo"
          center
          eyebrow="Compromissos de atendimento"
          title={
            <>
              O que orienta <em className="text-rose-ink">cada</em> atendimento.
            </>
          }
        />
        <ul className="mt-16 grid gap-px overflow-hidden rounded-[1.75rem] border border-tinta/10 bg-tinta/10 sm:grid-cols-2 lg:grid-cols-4">
          {compromissos.map((c, i) => (
            <Reveal as="li" key={c.t} delay={i * 0.06} className="group bg-porcelana p-8 transition-colors duration-500 hover:bg-[#fffdf9] sm:p-9">
              <span className="font-display text-sm italic text-rose-ink">0{i + 1}</span>
              <span aria-hidden className="mt-6 block h-px w-10 bg-champagne transition-[width] duration-500 group-hover:w-16" />
              <h3 className="mt-6 text-2xl text-tinta">{c.t}</h3>
              <p className="mt-3 text-[0.98rem] text-grafite">{c.d}</p>
            </Reveal>
          ))}
        </ul>
        {CONFIG.rascunho && (
          <p className="mt-6 text-center text-[0.8rem] italic text-grafite">Compromissos sugeridos, a validar com a doutora.</p>
        )}
      </div>
    </section>
  );
}
