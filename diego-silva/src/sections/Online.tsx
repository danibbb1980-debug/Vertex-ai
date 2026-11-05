import { CONFIG } from "../config";
import { SectionHead } from "../components/SectionHead";
import { Reveal } from "../components/Reveal";

const PASSOS = [
  { t: "Mensagem pelo WhatsApp", d: "Você conta, em poucas palavras, do que precisa. Não é preciso enviar documentos neste momento." },
  { t: "Conversa inicial", d: "Em horário combinado, por um formato acertado com você, para entender a situação com calma." },
  { t: "Documentos, quando necessário", d: "O envio é combinado durante o atendimento, pelo canal adequado e só do que for preciso." },
];

export function Online({ num }: { num: string }) {
  return (
    <section aria-labelledby="online-titulo" className="bg-paper-2 py-28 md:py-40">
      <div className="wrap">
        <SectionHead num={num} label="Atendimento on-line" />
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <h2 id="online-titulo" className="text-[clamp(2.4rem,5.2vw,4.4rem)]">
                De qualquer lugar, com a mesma <em>atenção</em>.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-md text-ink-soft">
                O atendimento on-line vale para todo o Brasil. Em {CONFIG.endereco.cidade}, também é possível conversar presencialmente no escritório.
              </p>
            </Reveal>
          </div>
          <ol className="md:col-span-6 md:col-start-7">
            {PASSOS.map((p, i) => (
              <Reveal as="li" key={p.t} delay={i * 0.08} className="grid grid-cols-[3rem_1fr] gap-2 border-t border-ink/15 py-8 first:border-t-0 first:pt-0 md:py-10">
                <span className="font-serif text-xl italic text-wine" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-[1.75rem] md:text-[2rem]">{p.t}</h3>
                  <p className="mt-3 text-ink-soft">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
