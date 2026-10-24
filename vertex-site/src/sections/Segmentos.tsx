import { waLink } from "../config";
import { Label } from "../components/SectionHead";
import { IconArrow } from "../components/Icons";

const segmentos = [
  {
    t: "Clínicas e consultórios",
    d: "Passa confiança antes da primeira consulta e deixa claro como agendar pelo WhatsApp.",
    msg: "clínicas e consultórios",
  },
  {
    t: "Estúdios e academias",
    d: "Mostra modalidades, horários e estrutura, e leva quem se interessou direto para a conversa.",
    msg: "estúdios e academias",
  },
  {
    t: "Restaurantes e cardápios",
    d: "Cardápio fácil de ler no celular, horários, endereço e pedido pelo WhatsApp em um toque.",
    msg: "restaurantes e cardápios",
  },
  {
    t: "Profissionais liberais",
    d: "Apresenta sua trajetória e seus serviços com sobriedade, para quem chega por indicação confirmar a boa escolha.",
    msg: "profissionais liberais",
  },
];

export function Segmentos() {
  return (
    <section id="segmentos" aria-labelledby="seg-title" className="relative z-10 bg-ink-0 py-24 sm:py-32">
      <div className="container-v grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Label>Para quem</Label>
          <h2 id="seg-title" className="mt-7 text-[clamp(2.3rem,5vw,3.6rem)] text-pearl">
            Sites para os negócios daqui.
          </h2>
          <p className="mt-6 max-w-sm text-mist">
            Cada segmento tem um jeito de convencer. O site parte do que o seu cliente procura antes de chamar.
          </p>
        </div>

        <ul className="lg:col-span-8">
          {segmentos.map((s) => (
            <li key={s.t} className="group grid gap-3 border-t border-pearl/12 py-7 sm:grid-cols-12 sm:items-baseline sm:gap-6">
              <h3 className="font-serif text-[1.85rem] leading-tight text-pearl sm:col-span-4">{s.t}</h3>
              <p className="text-mist sm:col-span-5">{s.d}</p>
              <a
                href={waLink({ segmento: s.msg })}
                target="_blank"
                rel="noopener"
                aria-label={`Pedir rascunho para ${s.t.toLowerCase()}`}
                className="inline-flex min-h-11 items-center gap-2 font-display text-[0.92rem] whitespace-nowrap text-champ sm:col-span-3 sm:justify-end"
              >
                <span className="link-u">Pedir rascunho</span>
                <IconArrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </li>
          ))}
          <li className="border-t border-pearl/12 pt-6 text-[0.92rem] text-dim">
            Profissões regulamentadas têm regras de publicidade próprias, como as do CFO para a odontologia e as da OAB para a
            advocacia. Os textos e as imagens do seu site seguem essas regras.
          </li>
        </ul>
      </div>
    </section>
  );
}
