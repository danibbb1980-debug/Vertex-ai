import { useEffect, useState } from "react";
import { Logos } from "./Header";
import { CONFIG, enderecoCompleto, linkWhatsApp, modoAtual, profissionaisAtivas } from "../config";

export function Rodape() {
  const ambas = modoAtual() === "ambas";
  const [ano, setAno] = useState(2026);
  useEffect(() => setAno(new Date().getFullYear()), []);
  return (
    <footer className="border-t border-linha bg-marfim pb-28 pt-14">
      <div className="container-site grid gap-10 md:grid-cols-[1.2fr_2fr]">
        <div>
          <Logos altura={56} />
          <p className="mt-5 text-sm text-tinta-2">{enderecoCompleto}</p>
          <p className="mt-6 max-w-xs text-sm text-tinta-2">
            Conteúdo informativo; a indicação de cada atendimento depende de avaliação individual.
          </p>
        </div>
        <div className={`grid gap-8 ${ambas ? "sm:grid-cols-2" : ""}`}>
          {profissionaisAtivas().map((p) => (
            <div key={p.id}>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-ouro-texto">
                {p.id === "aline" ? "Odonto Baixinhos" : "Consultório Odontológico"}
              </p>
              <p className="mt-2 font-bold">{p.nome}</p>
              <p className="text-sm text-tinta-2">
                {p.titulo}
                {p.cro ? ` · ${p.cro}` : ""}
              </p>
              <p className="mt-1 text-sm text-tinta-2">Responsável técnica</p>
              <ul className="mt-3 space-y-1 text-sm">
                <li>
                  <a className="inline-flex min-h-11 items-center underline-offset-4 hover:underline" href={linkWhatsApp(p.whatsapp, p.mensagemWhatsApp)} target="_blank" rel="noopener">
                    WhatsApp {p.whatsappExibicao}
                  </a>
                </li>
                <li>
                  <a className="inline-flex min-h-11 items-center underline-offset-4 hover:underline" href={p.instagram} target="_blank" rel="noopener">
                    Instagram {p.instagramUser}
                  </a>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="container-site mt-12 flex flex-col gap-3 border-t border-linha pt-6 text-xs text-tinta-2 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {ano} · {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}
          {CONFIG.rascunho ? " · Rascunho para avaliação" : ""}
        </p>
        <a href="/privacidade.html" className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">
          Privacidade
        </a>
      </div>
    </footer>
  );
}
