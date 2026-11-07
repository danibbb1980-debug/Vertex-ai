import type { ReactNode } from "react";
import { CONFIG } from "../config";
import { curto } from "../lib/horarios";
import { linkWhatsapp, temWhatsapp } from "../lib/whatsapp";
import { IconeAcessivel, IconeInstagram, IconeMapa, IconeRelogio, IconeWhatsapp } from "./Icones";
import { Cabecalho, Revelar } from "./Revelar";
import { ComEnfase } from "./TextReveal";

export function Estrutura() {
  const cartoes = [
    CONFIG.horarios.length > 0 && {
      icone: <IconeRelogio className="size-6" />,
      titulo: "Horário amplo",
      corpo: (
        <ul className="space-y-1">
          {CONFIG.horarios.map((h) => (
            <li key={h.rotulo}>
              {h.rotulo}: <strong className="font-semibold text-grafite">{curto(h.abre)} às {curto(h.fecha)}</strong>
            </li>
          ))}
        </ul>
      ),
      classe: "md:col-span-2 lg:col-span-1 lg:row-span-2 bg-ameixa text-porcelana",
      escuro: true,
      destaque: (() => {
        const s = CONFIG.horarios.find((h) => h.dias.includes(1));
        return s ? `${curto(s.abre)} às ${curto(s.fecha)}` : "";
      })(),
    },
    CONFIG.acessibilidade && {
      icone: <IconeAcessivel className="size-6" />,
      titulo: "Acessibilidade",
      corpo: <p>{CONFIG.acessibilidade}.</p>,
      classe: "bg-nevoa",
    },
    CONFIG.endereco.referencia && {
      icone: <IconeMapa className="size-6" />,
      titulo: "Como encontrar",
      corpo: (
        <p>
          {CONFIG.endereco.rua}, {CONFIG.endereco.bairro}. {CONFIG.endereco.referencia}
        </p>
      ),
      classe: "bg-[#f7ece6]",
    },
    (temWhatsapp || CONFIG.instagram.url) && {
      icone: <IconeWhatsapp className="size-6" />,
      titulo: "Contato",
      corpo: (
        <ul className="space-y-1">
          {temWhatsapp ? (
            <li>
              WhatsApp:{" "}
              <a className="inline-flex min-h-12 items-center font-semibold text-ameixa underline underline-offset-4" href={linkWhatsapp()} target="_blank" rel="noopener noreferrer">
                {CONFIG.whatsappExibicao}
              </a>
            </li>
          ) : null}
          {CONFIG.instagram.url ? (
            <li className="flex flex-wrap items-center gap-1.5">
              <IconeInstagram className="size-4" /> Instagram:{" "}
              <a className="inline-flex min-h-12 items-center font-semibold text-ameixa underline underline-offset-4" href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">
                {CONFIG.instagram.usuario}
              </a>
            </li>
          ) : null}
        </ul>
      ),
      classe: "md:col-span-2 bg-[#eef1ec]",
    },
  ].filter(Boolean) as { icone: ReactNode; titulo: string; corpo: ReactNode; classe: string; escuro?: boolean; destaque?: string }[];

  return (
    <section aria-labelledby="titulo-estrutura" className="relative bg-porcelana-2 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Cabecalho id="titulo-estrutura" rotulo="Estrutura" titulo={<ComEnfase text="Informações para a sua *visita*." />} />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cartoes.map((c, i) => (
            <Revelar key={c.titulo} delay={i * 0.06} className={`flex flex-col rounded-xl3 p-7 sm:p-8 ${c.classe} ${c.escuro ? "escuro" : ""}`}>
              <span className={`grid size-12 place-items-center rounded-full ${c.escuro ? "bg-white/10 text-pessego" : "bg-porcelana text-ameixa"}`}>
                {c.icone}
              </span>
              <h3 className={`mt-6 font-serif text-2xl ${c.escuro ? "text-porcelana" : "text-grafite"}`}>{c.titulo}</h3>
              <div className={`mt-3 ${c.escuro ? "text-[#e7deec] [&_strong]:text-porcelana" : "text-tinta-suave"}`}>{c.corpo}</div>
              {c.destaque ? (
                <p className="mt-auto pt-10 font-serif text-[3.2rem] leading-none tracking-[-0.02em] text-pessego">
                  {c.destaque}
                  <span className="mt-3 block font-sans text-sm tracking-normal text-[#e7deec]">de segunda a sexta</span>
                </p>
              ) : null}
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}
