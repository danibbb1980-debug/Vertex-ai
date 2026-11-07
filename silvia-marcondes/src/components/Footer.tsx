import { CONFIG } from "../config";
import { curto } from "../lib/horarios";
import { linkWhatsapp, temWhatsapp } from "../lib/whatsapp";
import { Logo } from "./Logo";

export function Footer() {
  const e = CONFIG.endereco;
  return (
    <footer className="escuro border-t border-white/10 bg-grafite-2 pb-28 pt-16 text-[#e7deec] lg:pb-12">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr] lg:px-10">
        <div>
          <Logo escuro />
          <p className="mt-5 max-w-xs text-[0.95rem]">
            {CONFIG.profissional.nome}, {CONFIG.profissional.descritor.toLowerCase()}. Depilação, limpeza de pele e
            dermaplaning em {e.cidade} - {e.uf}.
          </p>
        </div>
        <div>
          <h2 className="rotulo">Endereço</h2>
          <address className="mt-4 not-italic text-[0.95rem] leading-relaxed">
            {e.rua}, {e.bairro}
            <br />
            {e.cidade} - {e.uf}, CEP {e.cep}
          </address>
          <ul className="mt-4 space-y-1 text-[0.95rem]">
            {CONFIG.horarios.map((h) => (
              <li key={h.rotulo}>
                {h.rotulo}: {curto(h.abre)} às {curto(h.fecha)}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="rotulo">Contato</h2>
          <ul className="mt-2 text-[0.95rem]">
            {temWhatsapp ? (
              <li>
                <a className="inline-flex min-h-12 items-center underline-offset-4 hover:text-porcelana hover:underline" href={linkWhatsapp()} target="_blank" rel="noopener noreferrer">
                  WhatsApp {CONFIG.whatsappExibicao}
                </a>
              </li>
            ) : null}
            {CONFIG.instagram.url ? (
              <li>
                <a className="inline-flex min-h-12 items-center underline-offset-4 hover:text-porcelana hover:underline" href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">
                  Instagram {CONFIG.instagram.usuario}
                </a>
              </li>
            ) : null}
            <li>
              <a className="inline-flex min-h-12 items-center underline-offset-4 hover:text-porcelana hover:underline" href="/privacidade.html">
                Privacidade
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 px-4 pt-6 text-[0.85rem] text-[#c9bed0] sm:px-6 lg:px-10">
        <p>Conteúdo informativo. A indicação de cada atendimento depende de avaliação individual.</p>
        <p className="mt-1">© {new Date().getFullYear()} {CONFIG.marca.nomeCompleto}</p>
      </div>
    </footer>
  );
}
