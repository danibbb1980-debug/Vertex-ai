import type { CSSProperties } from "react";
import { CONFIG, areasAtivas } from "../config";
import { BotaoAgendar, LinkTelefone } from "../components/Botoes";
import { Monograma } from "../components/Monograma";
import { RevelaTexto } from "../components/RevelaTexto";
import { IconeSeta } from "../components/Icones";
import { secaoAtiva } from "../lib/secoes";
import { temWhatsapp } from "../lib/contato";

const listaAreas = (nomes: string[]) =>
  nomes.length <= 1 ? nomes.join("") : `${nomes.slice(0, -1).join(", ")} e ${nomes[nomes.length - 1]}`;

export function Hero() {
  const nomes = areasAtivas.map((a) => a.nome.toLowerCase());
  const subtitulo = nomes.length
    ? `${listaAreas(nomes).replace(/^./, (c) => c.toUpperCase())}, em um só endereço, em ${CONFIG.cidade}.`
    : `Consultas com hora marcada, em ${CONFIG.cidade}.`;

  return (
    <section id="inicio" aria-labelledby="titulo-hero" className={`fundo-linhas relative ${CONFIG.rascunho ? "pt-[8.5rem] lg:pt-[10rem]" : "pt-28 lg:pt-36"} pb-16 lg:pb-24`}>
      <div className="container-phd grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="rotulo entra" data-sig-inicio="">
            Clínica médica · {CONFIG.cidade} - {CONFIG.uf}
          </p>
          <h1 id="titulo-hero" className="mt-6 text-[2.6rem] leading-[1.04] sm:text-[3.4rem] lg:text-[4.1rem] xl:text-[4.5rem]">
            <RevelaTexto texto="Cuidado médico com hora marcada e *atenção* a cada pessoa." />
          </h1>
          <p className="entra mt-7 max-w-xl text-lg text-cinza-texto sm:text-xl" style={{ "--d": "520ms" } as CSSProperties}>
            {subtitulo}
          </p>
          <div className="entra mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6" style={{ "--d": "650ms" } as CSSProperties}>
            <BotaoAgendar />
            {secaoAtiva("areas") ? (
              <a href="#areas" className="botao botao-contorno">
                Ver áreas de atendimento
                <IconeSeta />
              </a>
            ) : null}
          </div>
          {temWhatsapp ? (
            <p className="entra mt-5 flex flex-wrap items-center gap-x-2 text-[0.95rem] text-cinza-texto" style={{ "--d": "750ms" } as CSSProperties}>
              Prefere ligar? <LinkTelefone className="text-grafite link-sublinhado" />
            </p>
          ) : null}
        </div>

        <div className="entra lg:col-span-5" style={{ "--d": "300ms" } as CSSProperties}>
          <div className="canto-d escuro relative mx-auto aspect-[4/5] w-full max-w-[26rem] overflow-hidden bg-chumbo p-8 sm:p-10 lg:ml-auto lg:mr-0">
            <Monograma className="relative mx-auto mt-4 w-[78%]" cor="#C49A6C" espessura={7} titulo={`Monograma ${CONFIG.nome}`} />
            {areasAtivas.length ? (
              <ul className="absolute inset-x-8 bottom-8 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-bronze/35 pt-5 text-[0.78rem] font-medium uppercase tracking-[0.18em] text-bronze-claro sm:inset-x-10 sm:bottom-10">
                {areasAtivas.map((a) => (
                  <li key={a.slug}>{a.nome}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
