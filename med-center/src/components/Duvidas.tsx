import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CONFIG, profissionaisVisiveis } from "../config";
import { ChevronIcon } from "./Icons";
import { Reveal } from "./Reveal";

export function faqItens() {
  const areas = CONFIG.categorias.map((c) => c.nome.toLowerCase()).join(", ").replace(/, ([^,]*)$/, " e $1");
  const itens = [
    { q: "Preciso agendar?", a: "Sim. É recomendado marcar hora antes de vir. Você pode falar com a recepção pelo WhatsApp, pelo telefone fixo ou enviar uma solicitação pelo formulário deste site." },
    { q: "Quais áreas existem no centro?", a: `O Med Center reúne atendimentos em ${areas}. Veja a lista completa na seção Áreas de atendimento.` },
    {
      q: "Como falo com a recepção do andar?",
      a: `Cada andar tem um WhatsApp: Térreo ${CONFIG.whatsappAndares[0].exibir}, 1º andar ${CONFIG.whatsappAndares[1].exibir} e 2º andar ${CONFIG.whatsappAndares[2].exibir}. Se não souber qual escolher, use o botão "Agendar" e a recepção orienta você.`,
    },
    { q: "Quais são os horários?", a: "De segunda a sexta, das 07h00 às 19h30. Sábado e domingo, fechado. Os horários de cada profissional podem variar e também podem mudar em feriados; consulte a recepção." },
    { q: "Onde fica o centro?", a: `Na ${CONFIG.endereco.rua}, bairro ${CONFIG.endereco.bairro}, em ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}, CEP ${CONFIG.endereco.cep}.` },
    { q: "O centro tem acessibilidade?", a: "Sim. A entrada, o banheiro e o estacionamento são acessíveis para cadeirantes." },
    { q: "Quais formas de pagamento são aceitas?", a: "Cartão de crédito, cartão de débito e pagamento por aproximação (NFC). Valores e outras condições são informados pela recepção." },
    {
      q: "O que levar na primeira consulta?",
      a: "De forma geral, leve um documento com foto e, se tiver, exames recentes e a lista dos medicamentos que usa. A recepção pode informar se o atendimento escolhido pede algo a mais.",
    },
    { q: "Posso escolher o profissional?", a: profissionaisVisiveis().length > 0 ? "Sim. Ao falar com a recepção, informe com quem deseja ser atendido para verificar a agenda." : "Ao falar com a recepção, informe a área desejada e ela verifica a agenda disponível." },
  ];
  if (CONFIG.mostrarAcolhimento) {
    itens.push({ q: "O centro é um espaço acolhedor para pessoas LGBTQ+?", a: "Sim. O Med Center acolhe a comunidade LGBTQ+ e é um espaço seguro para pessoas transgênero." });
  }
  return itens;
}

function Item({ q, a, aberto, onToggle }: { q: string; a: string; aberto: boolean; onToggle: () => void }) {
  const id = useId();
  const reduce = useReducedMotion();
  return (
    <li className="border-b border-night/10">
      <h3>
        <button
          type="button"
          id={`${id}-b`}
          aria-expanded={aberto}
          aria-controls={`${id}-p`}
          onClick={onToggle}
          className="flex min-h-[64px] w-full items-center justify-between gap-6 py-4 text-left font-display text-[1.05rem] font-semibold text-night hover:text-brand-ink sm:text-lg"
        >
          {q}
          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-[transform,background-color] duration-300 ${aberto ? "rotate-180 bg-night text-white" : "bg-mist text-night"}`}>
            <ChevronIcon />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {aberto && (
          <motion.div
            id={`${id}-p`}
            role="region"
            aria-labelledby={`${id}-b`}
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-6 leading-relaxed text-graphite-soft">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function Duvidas() {
  const [aberto, setAberto] = useState<number | null>(0);
  const itens = faqItens();
  return (
    <section id="duvidas" aria-labelledby="duvidas-titulo" className="bg-white py-20 sm:py-28">
      <div className="wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow">Dúvidas frequentes</p>
          <h2 id="duvidas-titulo" className="h2 mt-4">
            Antes de <em className="enfase">agendar</em>.
          </h2>
          <p className="lead mt-5">Respostas rápidas sobre agenda, endereço e estrutura.</p>
        </Reveal>
        <ul className="border-t border-night/10">
          {itens.map((it, i) => (
            <Item key={it.q} q={it.q} a={it.a} aberto={aberto === i} onToggle={() => setAberto(aberto === i ? null : i)} />
          ))}
        </ul>
      </div>
    </section>
  );
}
