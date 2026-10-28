import { CONFIG, modoAtual } from "../config";
import { moverLuz } from "../lib/useRevela";
import { CartaoProfissional } from "./CartaoProfissional";
import { Foto } from "./Foto";
import { IconeBebe, IconeCrianca, IconeGestante, IconeMaos } from "./Icones";
import { BordaAmeias } from "./Ornamentos";
import { Cabecalho } from "./Texto";

const VISUAL: Record<string, { fundo: string; luz: string; icone: React.ReactNode; cor: string }> = {
  bebes: { fundo: "bg-ceu", luz: "rgba(255,255,255,.8)", icone: <IconeBebe />, cor: "text-ceu-ink" },
  criancas: { fundo: "bg-rosa", luz: "rgba(255,255,255,.8)", icone: <IconeCrianca />, cor: "text-rosa-ink" },
  pne: { fundo: "bg-menta", luz: "rgba(255,255,255,.8)", icone: <IconeMaos />, cor: "text-menta-ink" },
  gestantes: { fundo: "bg-pessego", luz: "rgba(255,255,255,.8)", icone: <IconeGestante />, cor: "text-caramelo" },
};

export function SecaoAline() {
  const pro = CONFIG.profissionais.aline;
  const solo = modoAtual() === "aline";
  return (
    <section id="odonto-baixinhos" className="tema-baixinhos relative isolate overflow-hidden" aria-labelledby="titulo-aline">
      <BordaAmeias className="text-ceu" />
      <div className="bg-gradient-to-b from-ceu via-marfim to-marfim pb-20 pt-16 md:pb-28 md:pt-24">
        <div className="container-site">
          <div className="grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
            <div>
              {(
                <img
                  src={pro.logo.src}
                  alt={pro.logo.alt}
                  width={pro.logo.largura}
                  height={pro.logo.altura}
                  loading="lazy"
                  decoding="async"
                  className="revela mb-8 h-auto w-40 md:w-48"
                />
              )}
              <div>
                <Cabecalho
                  id="titulo-aline"
                  eyebrow={solo ? "Sobre o atendimento" : "Odonto Baixinhos · Dra. Aline Maciel"}
                  titulo="Cada criança, no seu *tempo*."
                  texto={
                    <>
                      <p>
                        No Odonto Baixinhos, a consulta acontece no ritmo da criança. Antes de cada etapa, a Dra. Aline explica o
                        que vai fazer, para a criança e para os pais, numa linguagem que cada um entende.
                      </p>
                      <p className="mt-4">
                        O atendimento vai dos primeiros dias de vida até a infância, incluindo crianças atípicas e com
                        necessidades especiais, e também gestantes.
                        {/* CONFIRMAR COM A CLÍNICA: faixa etária exata (o texto da doutora cita até 12 anos) */}
                      </p>
                    </>
                  }
                />
              </div>
              <ul className="revela mt-7 flex flex-wrap gap-2" aria-label="Público atendido">
                {["Bebês", "Crianças", "Pessoas com deficiência", "Gestantes"].map((t, i) => (
                  <li
                    key={t}
                    className={`rounded-full px-4 py-2 text-sm font-bold ${["bg-ceu", "bg-rosa", "bg-menta", "bg-pessego"][i]}`}
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="revela relative mx-auto w-full max-w-[24rem]">
              <div className="relative rounded-t-[999px] bg-rosa p-3 pb-0 shadow-[0_30px_60px_-30px_rgba(27,36,64,.35)]">
                <div className="overflow-hidden rounded-t-[999px]">
                  <Foto
                    base={pro.foto.base}
                    larguras={pro.foto.larguras}
                    alt={pro.foto.alt}
                    sizes="(min-width: 768px) 384px, 90vw"
                    largura={900}
                    altura={1125}
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
              </div>
              <CartaoProfissional pro={pro} className="relative -mt-12 mx-3 md:-mx-6" />
            </div>
          </div>

          <div className="mt-20 md:mt-28">
            <div className="revela flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <h3 className="text-3xl md:text-[2.5rem]">
                Atendimento por <em>fase</em>
              </h3>
              <p className="max-w-md text-tinta-2">
                Cada fase tem cuidados próprios. A indicação de cada atendimento depende de avaliação individual.
              </p>
            </div>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {pro.atendimentos.map((a, i) => {
                const v = VISUAL[a.id];
                return (
                  <li
                    key={a.id}
                    onPointerMove={moverLuz}
                    className={`cartao-luz revela flex flex-col rounded-[var(--radius-cartao)] p-6 ${v.fundo}`}
                    style={{ "--atraso": `${i * 90}ms`, "--luz": v.luz } as React.CSSProperties}
                  >
                    <span className={`inline-flex h-12 w-12 items-center justify-center rounded-full bg-marfim/80 ${v.cor}`}>{v.icone}</span>
                    <h4 className="mt-6 font-display text-[1.45rem] leading-tight [font-variation-settings:'SOFT'_100]">{a.titulo}</h4>
                    <p className="mt-3 flex-1 text-[0.97rem] leading-relaxed text-tinta-2">{a.descricao}</p>
                    <p className="mt-5 border-t border-tinta/10 pt-4 text-xs font-bold uppercase tracking-[0.12em] text-tinta-2">
                      Depende de avaliação individual
                    </p>
                  </li>
                );
              })}
            </ul>

            {CONFIG.sedacaoAline.mostrar ? (
              <div className="revela mt-6 rounded-[var(--radius-cartao)] border border-linha bg-marfim p-6 md:p-8">
                <h4 className="font-display text-xl">Sedação consciente</h4>
                <p className="mt-2 max-w-2xl text-tinta-2">{CONFIG.sedacaoAline.texto}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
