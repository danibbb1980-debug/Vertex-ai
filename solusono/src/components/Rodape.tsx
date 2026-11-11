import { CONFIG, linkWhatsapp } from "../config";
import { IconeWhatsapp } from "./Icones";

export function Rodape() {
  const e = CONFIG.endereco;
  return (
    <footer className="escuro bg-ink-deep pb-28 text-white/75 md:pb-12">
      <div className="container-site border-t border-white/15 pt-14">
        <div className="grid gap-y-10 md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-4">
            <img src="/marca/logo-branca.webp" alt="SoluSono" width={260} height={120} loading="lazy" className="h-14 w-auto" />
            <p className="mt-4 text-sm">{CONFIG.slogan}</p>
          </div>
          <div className="text-[0.95rem] md:col-span-4">
            <p className="rotulo">Endereço</p>
            <p className="mt-3">
              {e.rua}, {e.bairro}
              <br />
              {e.cidade} - {e.uf}, CEP {e.cep}
            </p>
          </div>
          <div className="text-[0.95rem] md:col-span-4">
            <p className="rotulo">Contato</p>
            <ul className="mt-2">
              <li>
                <a href={linkWhatsapp(CONFIG.mensagens.geral)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 hover:text-white">
                  <IconeWhatsapp className="h-4 w-4" /> {CONFIG.whatsappExibicao}
                  <span className="sr-only"> no WhatsApp (abre em nova aba)</span>
                </a>
              </li>
              {CONFIG.email && (
                <li>
                  <a href={`mailto:${CONFIG.email}`} className="inline-flex min-h-12 items-center hover:text-white">
                    {CONFIG.email}
                  </a>
                </li>
              )}
              {CONFIG.instagram.url && (
                <li>
                  <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center hover:text-white">
                    Instagram {CONFIG.instagram.usuario}
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-8 text-sm md:flex-row md:items-start md:justify-between">
          <p className="max-w-[60ch]">
            Conteúdo informativo, sem finalidade de diagnóstico. A indicação de cada atendimento depende de avaliação
            profissional.
          </p>
          <a href="/privacidade.html" className="link-sublinhado inline-flex min-h-12 items-center text-white md:min-h-0">
            Privacidade
          </a>
        </div>
      </div>
    </footer>
  );
}

/** Botão flutuante discreto (desktop) e barra fixa no celular. */
export function WhatsappFixo() {
  const href = linkWhatsapp(CONFIG.mensagens.geral);
  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-30 hidden h-14 items-center gap-3 rounded-full border border-line bg-white pl-4 pr-5 text-[0.95rem] font-semibold text-ink shadow-[0_8px_30px_-12px_rgba(21,50,90,.35)] transition-colors hover:bg-tint md:inline-flex"
      >
        <IconeWhatsapp className="h-5 w-5 text-brand" />
        WhatsApp
        <span className="sr-only"> (abre em nova aba)</span>
      </a>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm md:hidden">
        <a href={href} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-brand font-semibold text-white">
          <IconeWhatsapp className="h-5 w-5" />
          Agendar pelo WhatsApp
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      </div>
    </>
  );
}
