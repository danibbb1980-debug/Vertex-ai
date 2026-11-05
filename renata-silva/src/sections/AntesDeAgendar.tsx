import { HeartPulse, Pill, ShieldCheck, Stethoscope } from "lucide-react";
import { CONFIG } from "../config";
import { FadeIn, RevealTitle } from "../components/Reveal";

const ITENS = [
  { icon: Stethoscope, t: "A avaliação define a indicação", d: "Nenhum atendimento é escolhido antes da conversa. É na avaliação que se decide o que faz sentido para você." },
  {
    icon: Pill,
    t: "Conte sobre a sua saúde no atendimento",
    d: "Condições de saúde, medicamentos em uso e alergias são conversados pessoalmente, com privacidade, e não pelo WhatsApp.",
  },
  {
    icon: ShieldCheck,
    t: "Procedimentos têm contraindicações",
    d: "Alguns atendimentos não são indicados em determinadas situações. Por isso a avaliação vem sempre antes.",
  },
  {
    icon: HeartPulse,
    t: "Pergunte o que quiser",
    d: "Dúvidas sobre cuidados, intervalos ou como cada etapa funciona fazem parte da conversa. Sem pressa.",
  },
];

export function AntesDeAgendar() {
  if (!CONFIG.secoes.antesDeAgendar) return null;
  return (
    <section id="antes-de-agendar" data-line="left" aria-labelledby="antes-titulo" className="on-light relative bg-ivory py-24 md:py-32">
      <div className="container-site relative z-[2]">
        <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-end">
          <div>
            <p className="eyebrow mb-6 text-rose-700">Antes de agendar</p>
            <RevealTitle id="antes-titulo" text="Bom saber antes da *avaliação*." className="text-[2.6rem] text-ink md:text-[3.4rem]" />
          </div>
          <p className="text-ink-soft md:pb-3">Informações gerais, de caráter educativo. Cada caso é conversado individualmente.</p>
        </div>
        <ul className="mt-14 grid gap-5 sm:grid-cols-2">
          {ITENS.map((x, i) => {
            const Icon = x.icon;
            return (
              <FadeIn as="li" key={x.t} delay={(i % 2) * 0.08} className="flex gap-5 rounded-3xl border border-blush-200 bg-[#fffdfc] p-7 md:p-8">
                <Icon size={24} strokeWidth={1.3} className="mt-1 shrink-0 text-rose-700" aria-hidden="true" />
                <div>
                  <h3 className="font-label text-[0.95rem] font-medium uppercase tracking-[0.12em] text-ink">{x.t}</h3>
                  <p className="mt-2 text-ink-soft">{x.d}</p>
                </div>
              </FadeIn>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
