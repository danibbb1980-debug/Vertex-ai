import { CONFIG, enderecoCompleto, linkWhatsApp } from "../config";
import { Logo } from "./Foto";
import { ComPlaceholder } from "./Botoes";

export function Rodape() {
  const ano = 2026;
  return (
    <footer className="relative z-[1] border-t border-areia bg-creme-2 pb-28 pt-16 md:pb-14">
      <div className="container-site grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo largura={120} className="h-auto w-[104px]" />
          <p className="mt-5 font-display text-xl font-medium">
            {CONFIG.nome} <span className="italic text-menta-escuro">({CONFIG.apelido})</span>
          </p>
          <p className="mt-1 text-[0.98rem] text-taupe-texto">
            {CONFIG.profissao} · <ComPlaceholder texto={CONFIG.cro} />
          </p>
          <p className="mt-1 text-[0.98rem] text-taupe-texto">
            Responsável técnica: {CONFIG.nome},{" "}
            <span className="whitespace-nowrap">
              <ComPlaceholder texto={CONFIG.cro} />
            </span>
          </p>
        </div>
        <div className="md:col-span-4">
          <h2 className="font-sans text-sm font-bold uppercase tracking-[0.12em] text-taupe-texto">Contato</h2>
          <ul className="mt-4 space-y-2 text-[0.98rem]">
            <li>
              <a className="underline decoration-areia underline-offset-4 hover:decoration-menta-escuro" href={linkWhatsApp()} target="_blank" rel="noopener noreferrer">
                WhatsApp {CONFIG.whatsappExibicao}
              </a>
            </li>
            <li>
              <a className="underline decoration-areia underline-offset-4 hover:decoration-menta-escuro" href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">
                Instagram {CONFIG.instagram.usuario}
              </a>
            </li>
            <li>
              <a className="underline decoration-areia underline-offset-4 hover:decoration-menta-escuro" href={CONFIG.maps.link} target="_blank" rel="noopener noreferrer">
                {enderecoCompleto}
              </a>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <h2 className="font-sans text-sm font-bold uppercase tracking-[0.12em] text-taupe-texto">Informações</h2>
          <ul className="mt-4 space-y-2 text-[0.98rem]">
            <li>
              <a className="underline decoration-areia underline-offset-4 hover:decoration-menta-escuro" href="/privacidade.html">
                Política de privacidade
              </a>
            </li>
            <li>
              <a className="underline decoration-areia underline-offset-4 hover:decoration-menta-escuro" href="#inicio">
                Voltar ao início
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-site mt-12 border-t border-areia pt-6 text-sm text-taupe-texto">
        <p>Conteúdo informativo; a indicação de cada atendimento depende de avaliação individual.</p>
        <p className="mt-1">
          © {ano} {CONFIG.nome} · {CONFIG.apelido}
          {CONFIG.rascunho ? " · Rascunho para avaliação" : ""}
        </p>
      </div>
    </footer>
  );
}
