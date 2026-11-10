import { useId, useState } from "react";
import { Titulo } from "../components/Titulo";
import { Revela } from "../components/Revela";
import { IconeMais } from "../components/Icones";
import { perguntas } from "../lib/faq";
import { BotaoAgendar } from "../components/Botoes";

/** Acordeão acessível: botão com aria-expanded/aria-controls e região rotulada. */
export function Duvidas() {
  const itens = perguntas();
  const [aberto, setAberto] = useState<number | null>(0);
  const base = useId();
  return (
    <section id="duvidas" aria-labelledby="titulo-duvidas" className="py-24 lg:py-32">
      <div className="container-phd grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-36">
            <Titulo id="titulo-duvidas" rotulo="Dúvidas frequentes" apoio={<p>Não encontrou o que procurava? Fale com a equipe da clínica.</p>}>
              Perguntas <em>comuns</em>
            </Titulo>
            <Revela atraso={120} className="mt-8">
              <BotaoAgendar rotulo="Falar com a clínica" variante="contorno" mensagem="Olá! Vi o site da Clínica PHD e tenho uma dúvida." />
            </Revela>
          </div>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <ul className="border-t border-grafite/70">
            {itens.map((it, i) => {
              const id = `${base}-${i}`;
              const exp = aberto === i;
              return (
                <li key={it.p} className="border-b border-bronze/40">
                  <h3 className="font-sans text-[1.08rem] font-semibold tracking-normal sm:text-[1.15rem]">
                    <button
                      type="button"
                      id={`${id}-b`}
                      aria-expanded={exp}
                      aria-controls={`${id}-r`}
                      onClick={() => setAberto(exp ? null : i)}
                      className="flex min-h-16 w-full items-center justify-between gap-6 py-4 text-left transition-colors hover:text-bronze-texto"
                    >
                      <span>{it.p}</span>
                      <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-[2px_99px_99px_2px] border border-bronze-escuro">
                        <IconeMais className="faq-icone size-4" />
                      </span>
                    </button>
                  </h3>
                  <div id={`${id}-r`} role="region" aria-labelledby={`${id}-b`} hidden={!exp}>
                    <p className="faq-resposta max-w-xl pb-7 pr-12 text-cinza-texto">{it.r}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
