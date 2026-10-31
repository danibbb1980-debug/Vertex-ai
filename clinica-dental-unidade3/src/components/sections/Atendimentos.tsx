import { CONFIG } from "../../config";
import { useUnidade } from "../../lib/unidade";
import { linkWhatsApp } from "../../lib/whatsapp";
import { CartaoLuz } from "../ui/CartaoLuz";
import { ILUSTRACOES, IconeSetaDiagonal, IconeWhatsApp } from "../ui/Icones";
import { Revelar } from "../ui/Revelar";
import { TituloSecao } from "../ui/TituloSecao";

export function Atendimentos() {
  const { unidade } = useUnidade();
  const lista = CONFIG.atendimentos;
  if (!lista.length) return null;

  return (
    <section id="atendimentos" aria-labelledby="titulo-atendimentos" className="relative py-24 sm:py-32">
      <div className="container-site">
        <Revelar className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <TituloSecao
            id="titulo-atendimentos"
            rotulo="Atendimentos"
            titulo="O que você encontra na *Unidade 3*."
            texto="Conheça cada área de forma simples. A indicação de qualquer tratamento depende de avaliação individual."
          />
        </Revelar>

        <ul className={`mt-14 grid gap-5 sm:grid-cols-2 ${lista.length >= 4 ? "xl:grid-cols-4" : "xl:grid-cols-3"}`}>
          {lista.map((a, i) => {
            const Ilus = ILUSTRACOES[a.id];
            return (
              <li key={a.id} className="h-full">
                <Revelar atraso={i * 0.08} className="h-full">
                  <CartaoLuz className="flex h-full flex-col rounded-[1.75rem] border border-line bg-white p-7 transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1.5 hover:border-teal-400/60 hover:shadow-[0_30px_60px_-34px_rgb(2_24_38/0.55)]">
                    <div className="relative flex items-start justify-between">
                      <span className="grid size-16 place-items-center rounded-2xl bg-navy-900 text-teal-300 transition-transform duration-500 group-hover:-rotate-3">
                        {Ilus ? <Ilus tamanho={40} /> : null}
                      </span>
                      <span className="font-serif text-sm italic text-gold-700">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <h3 className="relative mt-7 text-[1.65rem] leading-tight text-navy-900">{a.nome}</h3>
                    <p className="relative mt-1 font-medium text-teal-700">{a.resumo}</p>
                    <p className="relative mt-4 text-[0.97rem] text-ink-soft">{a.descricao}</p>
                    <p className="relative mt-4 border-l-2 border-gold-400 pl-3 text-sm italic text-ink-soft">
                      A indicação depende de avaliação individual.
                    </p>
                    <a
                      href={linkWhatsApp(unidade.whatsapp, CONFIG.mensagens.porAtendimento(a.nome))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative mt-auto inline-flex min-h-12 items-center gap-2 pt-7 text-[0.95rem] font-semibold text-teal-700 hover:text-navy-900"
                    >
                      <IconeWhatsApp tamanho={18} />
                      <span className="underline decoration-gold-400/70 decoration-1 underline-offset-[6px]">
                        Perguntar sobre {a.nome.toLowerCase()}
                      </span>
                      <IconeSetaDiagonal tamanho={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
                    </a>
                  </CartaoLuz>
                </Revelar>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
