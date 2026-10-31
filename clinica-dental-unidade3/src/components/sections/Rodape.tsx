import { CONFIG } from "../../config";
import { useUnidade } from "../../lib/unidade";
import { linkWhatsApp } from "../../lib/whatsapp";
import { IconeInstagram, IconePino, IconeWhatsApp } from "../ui/Icones";

export function Rodape() {
  const { unidade } = useUnidade();
  const rt = unidade.responsavelTecnico;
  return (
    <footer className="escuro bg-navy-950 pb-28 pt-16 text-white/75 md:pb-12">
      <div className="container-site">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div className="flex items-start gap-4">
            <img src={unidade.logo} alt={unidade.logoAlt} width={80} height={80} loading="lazy" className="size-20 rounded-2xl ring-1 ring-gold-400/40" />
            <div>
              <p className="font-serif text-xl text-white">{CONFIG.marca}</p>
              <p className="rotulo mt-1 text-[0.65rem] text-teal-300">{unidade.nome}</p>
              {rt.nome && rt.cro && (
                <p className="mt-4 text-sm">
                  Responsável técnico: {rt.nome} · {rt.cro}
                </p>
              )}
            </div>
          </div>
          <address className="not-italic">
            <p className="rotulo text-[0.65rem] text-gold-300">Endereço</p>
            <p className="mt-3 flex gap-2">
              <IconePino tamanho={18} className="mt-0.5 shrink-0 text-teal-300" />
              <span>
                {unidade.endereco.linha}
                <br />
                CEP {unidade.endereco.cep}
              </span>
            </p>
          </address>
          <div>
            <p className="rotulo text-[0.65rem] text-gold-300">Contato</p>
            <ul className="mt-2">
              <li>
                <a href={linkWhatsApp(unidade.whatsapp, CONFIG.mensagens.geral)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 hover:text-white">
                  <IconeWhatsApp tamanho={18} className="text-teal-300" /> {unidade.telefoneExibicao}
                  <span className="sr-only"> no WhatsApp (abre em nova aba)</span>
                </a>
              </li>
              <li>
                <a href={unidade.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 hover:text-white">
                  <IconeInstagram tamanho={18} className="text-teal-300" /> {unidade.instagram.usuario}
                  <span className="sr-only"> no Instagram (abre em nova aba)</span>
                </a>
              </li>
              <li>
                <a href="/privacidade.html" className="inline-flex min-h-12 items-center hover:text-white">
                  Privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="filete mt-12" aria-hidden="true" />
        <div className="mt-6 flex flex-col gap-2 text-sm text-white/60 sm:flex-row sm:justify-between">
          <p>Conteúdo informativo; a indicação de cada tratamento depende de avaliação individual.</p>
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} {CONFIG.marca}
          </p>
        </div>
      </div>
    </footer>
  );
}
