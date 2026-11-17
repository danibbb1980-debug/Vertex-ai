import { useEffect, useState } from "react";
import { CONFIG } from "../config";
import { waUrl } from "../lib/whatsapp";
import Logotipo from "./Logotipo";

export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null;
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-50 flex h-[var(--draft-h)] items-center justify-center bg-tinta px-4 text-center text-[11.5px] leading-tight tracking-[0.06em] text-champanhe"
    >
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  );
}

/** Botão flutuante (desktop) e barra fixa (celular). */
export function AgendarFixo() {
  const [visivel, setVisivel] = useState(false);
  useEffect(() => {
    const f = () => setVisivel(window.scrollY > window.innerHeight * 0.7);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  if (!CONFIG.usarWhatsapp) return null;
  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-tinta/15 bg-gesso/95 px-4 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-[2px] transition-transform duration-300 lg:hidden ${visivel ? "translate-y-0" : "translate-y-full"}`}
        aria-hidden={!visivel}
        inert={!visivel}
      >
        <a href={waUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-primario w-full">
          Agendar avaliação <span className="seta" aria-hidden="true" />
        </a>
      </div>
      <a
        href={waUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-hidden={!visivel}
        tabIndex={visivel ? 0 : -1}
        className={`fixed bottom-6 right-6 z-30 hidden min-h-12 items-center gap-3 border border-tinta bg-gesso px-5 text-[12px] uppercase tracking-[0.18em] text-tinta transition-[opacity,transform,background-color,color] duration-300 hover:bg-tinta hover:text-gesso lg:inline-flex ${visivel ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
      >
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-champanhe-escuro" />
        WhatsApp
      </a>
    </>
  );
}

export default function Rodape() {
  const e = CONFIG.endereco;
  const rt = CONFIG.responsavelTecnico;
  return (
    <footer className="escuro border-t border-gesso/10 bg-tinta pb-28 text-nevoa lg:pb-0">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-4 py-20 sm:px-8 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Logotipo tom="escuro" variante="bloco" />
          <p className="mt-8 text-[15px] text-gesso">{CONFIG.nomeAlternativo}</p>
        </div>
        <div className="text-[15px] leading-relaxed lg:col-span-3 lg:col-start-6">
          <h2 className="rotulo !text-[11px] text-champanhe">Endereço</h2>
          <address className="mt-4 not-italic">
            {e.rua}, {e.numero}
            <br />
            {e.bairro}, {e.cidade} - {e.uf}
            <br />
            <span className="num">CEP {e.cep}</span>
          </address>
        </div>
        <div className="text-[15px] leading-relaxed lg:col-span-3">
          <h2 className="rotulo !text-[11px] text-champanhe">Contato</h2>
          <ul className="mt-2">
            {CONFIG.usarWhatsapp && (
              <li>
                <a href={waUrl()} target="_blank" rel="noopener noreferrer" className="link-sub num inline-flex min-h-11 items-center text-gesso">
                  WhatsApp {CONFIG.whatsappExibicao}
                </a>
              </li>
            )}
            {CONFIG.email && (
              <li>
                <a href={`mailto:${CONFIG.email}`} className="link-sub inline-flex min-h-11 items-center break-all text-gesso">
                  {CONFIG.email}
                </a>
              </li>
            )}
            {CONFIG.instagram.url && (
              <li>
                <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="link-sub inline-flex min-h-11 items-center text-gesso">
                  Instagram {CONFIG.instagram.usuario}
                </a>
              </li>
            )}
            <li>
              <a href="/privacidade.html" className="link-sub inline-flex min-h-11 items-center text-gesso">
                Privacidade
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-[1320px] border-t border-gesso/10 px-4 py-8 text-[13px] leading-relaxed sm:px-8">
        <p className="max-w-[52rem]">
          Conteúdo informativo, sem finalidade de diagnóstico. A indicação de cada tratamento depende de avaliação individual por profissional habilitado.
        </p>
        {rt.nome && rt.registro && (
          <p className="mt-3">
            Responsável técnico: {rt.nome} · {rt.registro}
          </p>
        )}
        <p className="mt-3">
          {CONFIG.nome} · {CONFIG.descritor}
        </p>
      </div>
    </footer>
  );
}
