import { waLink } from "../config";
import { Em, SectionHead } from "../components/SectionHead";
import { IconArrow } from "../components/Icons";
import { Spot } from "../components/Spot";

const segmentos = [
  {
    t: "Clínicas e consultórios",
    d: "Passa confiança antes da primeira consulta e deixa claro como agendar pelo WhatsApp.",
    msg: "clínicas e consultórios",
    cta: "da minha clínica",
  },
  {
    t: "Estúdios e academias",
    d: "Mostra modalidades, horários e estrutura, e leva quem se interessou direto para a conversa.",
    msg: "estúdios e academias",
    cta: "do meu estúdio",
  },
  {
    t: "Restaurantes e cardápios",
    d: "Cardápio fácil de ler no celular, horários, endereço e pedido pelo WhatsApp em um toque.",
    msg: "restaurantes e cardápios",
    cta: "do meu restaurante",
  },
  {
    t: "Profissionais liberais",
    d: "Apresenta sua trajetória e seus serviços com sobriedade, para quem chega por indicação confirmar a boa escolha.",
    msg: "profissionais liberais",
    cta: "do meu escritório",
  },
];

const faixa = [
  "Clínicas", "Odontologia", "Estética", "Psicologia", "Fisioterapia", "Pilates", "Academias",
  "Restaurantes", "Cafeterias", "Advocacia", "Contabilidade", "Arquitetura", "Salões", "Estúdios",
];

export function Faixa() {
  const items = [...faixa, ...faixa];
  return (
    <div className="relative z-10 border-y border-gold/10 bg-ink-0 py-6" aria-label="Segmentos atendidos">
      <ul className="sr-only">
        {faixa.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <div className="marquee overflow-hidden" aria-hidden="true">
        <div className="marquee-track flex w-max items-center">
          {items.map((f, i) => (
            <span key={i} className="flex items-center font-display text-[0.8rem] tracking-[0.3em] text-dim uppercase">
              <span className="px-7">{f}</span>
              <svg className="size-2 text-gold/70" viewBox="0 0 10 10" aria-hidden="true">
                <path d="M0 0h3l2 4V10zM10 0H7L5 4v6z" fill="currentColor" />
              </svg>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Segmentos() {
  return (
    <section id="segmentos" aria-labelledby="seg-title" className="relative z-10 bg-ink-0 py-24 sm:py-32">
      <div className="container-v">
        <SectionHead
          id="seg-title"
          num="03"
          label="Para quem"
          title={
            <>
              Sites para os negócios <Em>daqui.</Em>
            </>
          }
          intro="Cada segmento tem um jeito de convencer. O site é desenhado a partir do que o seu cliente procura antes de chamar."
        />

        <ul className="mt-16 grid gap-4 sm:grid-cols-2">
          {segmentos.map((s, i) => (
            <li key={s.t} data-reveal style={{ ["--d" as string]: `${(i % 2) * 100}ms` }}>
              <Spot className="group flex h-full flex-col rounded-2xl bg-ink-2/70 p-7 sm:p-9">
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 text-[1.6rem] text-pearl">{s.t}</h3>
                <p className="mt-3 max-w-md flex-1 text-mist">{s.d}</p>
                <a
                  href={waLink({ segmento: s.msg })}
                  target="_blank"
                  rel="noopener"
                  className="mt-8 inline-flex min-h-11 items-center gap-2 self-start font-display text-[0.95rem] text-champ"
                >
                  <span className="link-u">Ver o rascunho {s.cta}</span>
                  <IconArrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </Spot>
            </li>
          ))}
        </ul>

        <p data-reveal className="mt-10 max-w-3xl border-l border-gold/40 pl-5 text-[0.95rem] text-dim">
          Profissões regulamentadas têm regras de publicidade próprias, como as do CFO para a odontologia e as da OAB
          para a advocacia. Os textos e as imagens do seu site seguem essas regras.
        </p>
      </div>
    </section>
  );
}
