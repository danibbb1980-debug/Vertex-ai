import { useId, useState } from "react";
import { CONFIG, croTexto, enderecoCompleto, mapsEmbed, whatsappLink } from "../config";
import { IconArrowUpRight, IconClock, IconInstagram, IconPhone, IconPin, IconPlus, IconWhatsapp } from "./Icons";
import { Logo } from "./Header";
import { MagneticButton } from "./MagneticButton";
import { Reveal, SectionHeading } from "./Reveal";

const { manha, tarde } = CONFIG.horarios.semana;

/* ---------------- Dúvidas ---------------- */
const perguntas = [
  {
    q: "Como funciona a avaliação estética?",
    a: "É uma consulta dedicada a entender o que você deseja e a analisar o seu sorriso em relação ao rosto, aos dentes e à gengiva. Ao final, a doutora explica as possibilidades indicadas para o seu caso, com calma e espaço para perguntas.",
  },
  {
    q: "Lentes em resina e porcelana: qual a diferença, de forma geral?",
    a: "As duas ajustam forma, cor e proporção dos dentes. A resina é aplicada e modelada diretamente no consultório; a porcelana é confeccionada em laboratório a partir de um planejamento. Cada material tem características próprias, e a escolha depende da avaliação individual.",
  },
  {
    q: "O clareamento serve para todas as pessoas?",
    a: "Nem sempre. A indicação depende da saúde dos dentes e da gengiva, da sensibilidade e da expectativa de cor. Por isso o clareamento é sempre precedido de avaliação.",
  },
  {
    q: "Os alinhadores transparentes são indicados para qualquer caso?",
    a: "Não necessariamente. Os alinhadores são uma alternativa discreta de ortodontia, mas a indicação depende da análise de cada sorriso e da mordida.",
  },
  {
    q: "Preciso saber qual tratamento quero antes de agendar?",
    a: "Não. Muitas pessoas chegam apenas com uma sensação sobre o próprio sorriso. A avaliação existe justamente para transformar essa sensação em um caminho claro.",
  },
  {
    q: "Como faço para agendar?",
    a: "Pelo WhatsApp (35) 99133-0872. Envie uma mensagem e você recebe o retorno para combinar o melhor horário. O agendamento só fica confirmado após essa conversa.",
  },
  {
    q: "Onde fica o consultório e quais são os horários?",
    a: `${enderecoCompleto}. De segunda a sexta, das ${manha[0]} às ${manha[1]} e das ${tarde[0]} às ${tarde[1]}. Sábado e domingo, fechado.`,
  },
];

function Item({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const id = useId();
  return (
    <li className="border-b border-tinta/10">
      <h3 className="font-sans text-base font-normal leading-normal tracking-normal">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-p`}
          id={`${id}-b`}
          onClick={onToggle}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span className="font-display text-xl text-tinta sm:text-[1.6rem]">{q}</span>
          <span
            aria-hidden
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
              open ? "rotate-45 border-rose-ink bg-rose-ink text-porcelana" : "border-tinta/15 text-tinta group-hover:border-tinta/40"
            }`}
          >
            <IconPlus width={18} height={18} />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-p`}
        role="region"
        aria-labelledby={`${id}-b`}
        className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden" inert={!open}>
          <p className="max-w-2xl pb-7 pr-14 text-grafite">{a}</p>
        </div>
      </div>
    </li>
  );
}

export function Duvidas() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="duvidas" aria-labelledby="duvidas-titulo" className="py-24 sm:py-32">
      <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHeading
          id="duvidas-titulo"
          eyebrow="Dúvidas frequentes"
          title={
            <>
              Perguntas que <em className="text-rose-ink">costumam</em> chegar.
            </>
          }
          intro="Respostas gerais e educativas. Cada caso é diferente, e a orientação definitiva vem da avaliação."
        />
        <Reveal>
          <ul className="border-t border-tinta/10">
            {perguntas.map((p, i) => (
              <Item key={p.q} {...p} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Localização ---------------- */
export function Localizacao() {
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="bg-porcelana-2/60 py-24 sm:py-32">
      <div className="container-site">
        <SectionHeading
          id="contato-titulo"
          eyebrow="Localização e contato"
          title={
            <>
              Venha conhecer o <em className="text-rose-ink">consultório</em>.
            </>
          }
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
          <Reveal className="flex flex-col gap-8">
            {/* Endereço e horários da ficha do Google. CONFIRMAR COM A DOUTORA */}
            <div className="flex gap-4">
              <IconPin className="mt-1 shrink-0 text-rose-ink" />
              <div>
                <h3 className="eyebrow !font-sans text-grafite">Endereço</h3>
                <address className="mt-2 text-lg not-italic text-tinta">
                  {CONFIG.endereco.rua}, {CONFIG.endereco.bairro}
                  <br />
                  {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}, CEP {CONFIG.endereco.cep}
                </address>
              </div>
            </div>

            <div className="flex gap-4">
              <IconClock className="mt-1 shrink-0 text-rose-ink" />
              <div className="w-full">
                <h3 className="eyebrow !font-sans text-grafite">Horários</h3>
                <table className="mt-3 w-full max-w-md text-left text-[0.98rem]">
                  <caption className="sr-only">Horários de atendimento</caption>
                  <tbody className="[&_td]:py-2.5 [&_th]:py-2.5 [&_tr]:border-b [&_tr]:border-tinta/10">
                    <tr>
                      <th scope="row" className="font-medium text-tinta">Seg a sex · manhã</th>
                      <td className="text-right text-tinta">{manha[0]} às {manha[1]}</td>
                    </tr>
                    <tr>
                      <th scope="row" className="font-normal italic text-grafite">Intervalo de almoço</th>
                      <td className="text-right italic text-grafite">{manha[1]} às {tarde[0]}</td>
                    </tr>
                    <tr>
                      <th scope="row" className="font-medium text-tinta">Seg a sex · tarde</th>
                      <td className="text-right text-tinta">{tarde[0]} às {tarde[1]}</td>
                    </tr>
                    <tr>
                      <th scope="row" className="font-medium text-tinta">Sábado e domingo</th>
                      <td className="text-right text-grafite">{CONFIG.horarios.fimDeSemana}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex gap-4">
              <IconPhone className="mt-1 shrink-0 text-rose-ink" />
              <div>
                <h3 className="eyebrow !font-sans text-grafite">Contato</h3>
                <ul className="mt-2 space-y-1.5 text-lg">
                  <li>
                    <a className="link-sublinhado text-tinta" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                      WhatsApp {CONFIG.telefone}
                    </a>
                  </li>
                  <li>
                    <a className="link-sublinhado text-tinta" href={CONFIG.instagram} target="_blank" rel="noopener noreferrer">
                      Instagram {CONFIG.instagramUser}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <MagneticButton href={CONFIG.maps} external>
                Como chegar
                <IconArrowUpRight width={18} height={18} />
              </MagneticButton>
              <MagneticButton href={whatsappLink()} external variant="outline">
                <IconWhatsapp width={18} height={18} />
                Agendar avaliação
              </MagneticButton>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="relative min-h-[22rem] overflow-hidden rounded-[1.75rem] border border-tinta/10 bg-porcelana-2 lg:min-h-full">
            <div aria-hidden className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center text-grafite">
              <IconPin width={28} height={28} className="text-rose-ink" />
              <span className="font-display text-xl text-tinta">{CONFIG.endereco.rua}</span>
              <span className="text-sm">{CONFIG.endereco.bairro}, {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}</span>
            </div>
            <iframe
              title={`Mapa: ${CONFIG.nome}, ${enderecoCompleto}`}
              src={mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full grayscale-[0.35] contrast-[0.95]"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA final ---------------- */
export function CtaFinal() {
  return (
    <section aria-labelledby="cta-titulo" className="on-dark grao relative overflow-hidden bg-tinta py-28 text-porcelana sm:py-36">
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full border border-rose/15" />
      <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-[34rem] w-[34rem] rounded-full border border-rose/10" />
      <div className="container-site relative">
        <Reveal className="max-w-3xl">
          <p className="eyebrow flex items-center gap-3 text-rose">
            <span aria-hidden className="h-px w-8 bg-rose/60" />
            Agende sua avaliação
          </p>
          <h2 id="cta-titulo" className="mt-6 text-[2.6rem] text-porcelana sm:text-6xl lg:text-7xl">
            Seu próximo passo começa com uma <em className="text-rose">avaliação</em>.
          </h2>
          <p className="mt-6 max-w-xl text-lg text-porcelana/75">
            Converse pelo WhatsApp, tire suas dúvidas e combine o melhor horário para conhecer o consultório.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <MagneticButton href={whatsappLink()} external variant="light">
              <IconWhatsapp width={18} height={18} />
              Agendar pelo WhatsApp
            </MagneticButton>
            <MagneticButton href={CONFIG.instagram} external variant="ghostLight">
              <IconInstagram width={18} height={18} />
              Ver no Instagram
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Rodapé ---------------- */
export function Rodape() {
  const ano = new Date().getFullYear();
  return (
    <footer className="on-dark border-t border-porcelana/10 bg-[#141c2a] pb-28 pt-16 text-porcelana/75 lg:pb-12">
      <div className="container-site grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-6 max-w-xs text-[0.95rem]">
            {CONFIG.profissao} · {croTexto}
          </p>
          {/* CONFIRMAR COM A DOUTORA */}
          <p className="mt-2 max-w-xs text-[0.85rem] text-porcelana/60">Responsável técnico e CRO: a confirmar com a doutora.</p>
        </div>
        <nav aria-label="Rodapé">
          <h2 className="eyebrow !font-sans text-rose">Navegação</h2>
          <ul className="mt-5 space-y-2.5 text-[0.95rem]">
            {[
              ["#sobre", "Sobre"],
              ["#tratamentos", "Tratamentos"],
              ["#como-funciona", "Como funciona"],
              ["#duvidas", "Dúvidas"],
              ["#contato", "Contato"],
              ["/privacidade.html", "Privacidade"],
            ].map(([h, l]) => (
              <li key={h}>
                <a href={h} className="link-sublinhado hover:text-porcelana">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="eyebrow !font-sans text-rose">Contato</h2>
          <ul className="mt-5 space-y-2.5 text-[0.95rem]">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="link-sublinhado hover:text-porcelana">
                WhatsApp {CONFIG.telefone}
              </a>
            </li>
            <li>
              <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="link-sublinhado hover:text-porcelana">
                Instagram {CONFIG.instagramUser}
              </a>
            </li>
            <li>
              <a href={CONFIG.maps} target="_blank" rel="noopener noreferrer" className="link-sublinhado hover:text-porcelana">
                {enderecoCompleto}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-site mt-14 flex flex-col gap-2 border-t border-porcelana/10 pt-6 text-[0.8rem] text-porcelana/55 sm:flex-row sm:justify-between">
        <p>© {ano} {CONFIG.nome}. Todos os direitos reservados.</p>
        <p className="lg:pr-20">{CONFIG.endereco.cidade} - {CONFIG.endereco.uf}</p>
      </div>
    </footer>
  );
}

/* ---------------- WhatsApp flutuante + barra móvel ---------------- */
export function WhatsappFixo() {
  return (
    <>
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Agendar avaliação pelo WhatsApp"
        className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-tinta text-porcelana shadow-[0_18px_40px_-18px_rgba(27,37,54,0.7)] ring-1 ring-porcelana/20 transition-transform duration-300 hover:-translate-y-0.5 lg:flex"
      >
        <IconWhatsapp width={24} height={24} />
      </a>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-tinta/10 bg-porcelana/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:hidden">
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-tinta text-[0.95rem] font-medium text-porcelana"
        >
          <IconWhatsapp width={18} height={18} />
          Agendar avaliação pelo WhatsApp
        </a>
      </div>
    </>
  );
}
