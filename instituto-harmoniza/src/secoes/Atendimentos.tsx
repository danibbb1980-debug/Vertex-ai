import { numeroDaSecao } from "../lib/secoes";
import { CONFIG, type Atendimento } from "../config";
import { linkWhatsApp } from "../lib/whatsapp";
import { CabecalhoSecao } from "../components/CabecalhoSecao";
import { CartaoPilha, PilhaCartoes } from "../components/PilhaCartoes";
import { Confirmar } from "../components/Confirmar";
import { IconeWhatsApp } from "../components/Icones";

const tons = [
  { fundo: "bg-branco", texto: "text-tinta", sub: "text-suave", linha: "border-linha", escuro: false, halo: "#fbf8f3" },
  { fundo: "bg-areia", texto: "text-tinta", sub: "text-suave", linha: "border-tinta/10", escuro: false, halo: "#ece3d5" },
  { fundo: "bg-[#e9dfcd]", texto: "text-tinta", sub: "text-suave", linha: "border-tinta/12", escuro: false, halo: "#e9dfcd" },
  { fundo: "bg-noite", texto: "text-marfim", sub: "text-marfim/75", linha: "border-marfim/15", escuro: true, halo: "transparent" },
];

function Titulo({ a }: { a: Atendimento }) {
  const [antes, depois] = a.titulo.split(a.destaque);
  return (
    <>
      {antes}
      <em>{a.destaque}</em>
      {depois}
    </>
  );
}

function Arco({ indice }: { indice: number }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className="pointer-events-none absolute -right-10 -bottom-16 size-64 opacity-60 md:size-80" style={{ transform: `rotate(${indice * 38}deg)` }}>
      <g fill="none" stroke="currentColor" strokeWidth="0.6">
        <circle cx="100" cy="100" r="60" />
        <circle cx="100" cy="100" r="80" strokeDasharray="1 5" />
        <path d="M10 140 C 60 60, 140 60, 190 140" />
      </g>
    </svg>
  );
}

export function Atendimentos() {
  const lista = CONFIG.atendimentos.filter((a) => a.ativo);
  return (
    <section id="atendimentos" aria-labelledby="titulo-atendimentos" className="relative z-10 pt-12 pb-24 md:pt-20 md:pb-36">
      <div className="contem">
        <CabecalhoSecao
          numero={numeroDaSecao("atendimentos")}
          rotulo="Atendimentos"
          id="titulo-atendimentos"
          titulo={
            <>
              Cada atendimento, com a mesma <em>atenção</em>.
            </>
          }
        >
          Informações gerais para você conhecer cada área. A indicação de qualquer tratamento depende sempre de avaliação
          individual.
        </CabecalhoSecao>

        <PilhaCartoes className="mt-14 md:mt-20">
          {lista.map((a, i) => {
            const t = tons[i % tons.length];
            return (
              <CartaoPilha key={a.id} indice={i} ultimo={i === lista.length - 1}>
                <article
                  id={`atendimento-${a.id}`}
                  data-ancora
                  aria-labelledby={`titulo-${a.id}`}
                  style={{ ["--halo" as string]: t.halo }}
                  className={`${t.fundo} ${t.texto} ${t.escuro ? "sobre-escuro" : ""} relative overflow-hidden rounded-[28px] border ${t.linha} p-7 md:min-h-[400px] md:p-12`}
                >
                  <span className={t.escuro ? "text-champanhe/40" : "text-ouro/50"}>
                    <Arco indice={i} />
                  </span>
                  <div className="relative grid h-full gap-8 md:min-h-[304px] md:grid-cols-12 md:gap-10">
                    <div className="flex flex-col md:col-span-6">
                      <div className={`flex flex-wrap items-center gap-3 ${t.escuro ? "text-champanhe" : "text-bronze"}`}>
                        <span className="rotulo tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                        <span aria-hidden="true" className="h-px w-8 bg-current opacity-50" />
                        <span className="rotulo">Atendimento</span>
                        <Confirmar mostrar={!a.confirmado} escuro={t.escuro} />
                      </div>
                      <h3 id={`titulo-${a.id}`} className="titulo-display mt-6 text-[clamp(2.3rem,5.4vw,4rem)]">
                        <Titulo a={a} />
                      </h3>
                      {/* numeral decorativo via CSS (conteúdo de pseudo-elemento, fora da árvore de acessibilidade) */}
                      <span
                        aria-hidden="true"
                        data-numeral={String(i + 1).padStart(2, "0")}
                        className={`mt-auto hidden pt-10 font-display text-[7.5rem] leading-[0.75] font-normal italic before:content-[attr(data-numeral)] md:block ${
                          t.escuro ? "text-champanhe/25" : "text-ouro/35"
                        }`}
                      />
                    </div>
                    <div className="flex flex-col justify-between gap-8 md:col-span-6 md:pt-2">
                      <p className={`texto-corrido max-w-[48ch] text-[1.05rem] leading-relaxed ${t.sub}`}>{a.descricao}</p>
                      <div className={`flex flex-col gap-5 border-t pt-6 ${t.linha} sm:flex-row sm:items-center sm:justify-between`}>
                        <p className={`text-[0.82rem] ${t.sub}`}>
                          <span className="font-display text-[1.05rem] italic">Depende de avaliação individual.</span>
                        </p>
                        <a
                          href={linkWhatsApp(a.mensagemWhatsApp)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`group inline-flex min-h-11 items-center gap-2.5 text-[0.92rem] font-medium ${t.escuro ? "text-marfim" : "text-tinta"}`}
                        >
                          <IconeWhatsApp tamanho={17} className={t.escuro ? "text-champanhe" : "text-bronze"} />
                          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_1px] bg-bottom-left bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:0%_1px]">
                            Conversar sobre este atendimento
                          </span>
                          <span className="sr-only"> ({a.titulo}, abre o WhatsApp)</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              </CartaoPilha>
            );
          })}
        </PilhaCartoes>
      </div>
    </section>
  );
}
