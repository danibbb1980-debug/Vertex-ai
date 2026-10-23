import { CONFIG, telefoneFormatado, waLink } from "../config";
import { Logo } from "../components/VMark";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-gold/15 bg-ink-0 pt-16 pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:pb-12">
      <div className="container-v">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-6 max-w-sm text-[0.95rem] text-dim">
              Sites profissionais para empresas de {CONFIG.areaAtuacao}.
            </p>
          </div>
          <div className="text-[0.95rem] md:col-span-4">
            <h2 className="font-display text-[0.72rem] font-medium tracking-[0.28em] text-gold uppercase">Contato</h2>
            <ul className="mt-5 space-y-2 text-mist">
              <li>
                <a href={waLink()} target="_blank" rel="noopener" className="link-u hover:text-pearl">
                  WhatsApp {telefoneFormatado()}
                </a>
              </li>
              {CONFIG.instagram && (
                <li>
                  <a href={CONFIG.instagram} target="_blank" rel="noopener" className="link-u hover:text-pearl">
                    Instagram
                  </a>
                </li>
              )}
              {CONFIG.email && (
                <li>
                  <a href={`mailto:${CONFIG.email}`} className="link-u hover:text-pearl">
                    {CONFIG.email}
                  </a>
                </li>
              )}
              <li>
                {CONFIG.cidade} - {CONFIG.uf}
              </li>
            </ul>
          </div>
          <div className="text-[0.95rem] md:col-span-3">
            <h2 className="font-display text-[0.72rem] font-medium tracking-[0.28em] text-gold uppercase">Empresa</h2>
            <ul className="mt-5 space-y-2 text-mist">
              {CONFIG.razaoSocial && <li>{CONFIG.razaoSocial}</li>}
              <li>CNPJ {CONFIG.cnpj}</li>
              <li>
                <a href="/privacidade.html" className="link-u hover:text-pearl">
                  Privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="hairline mt-14" />
        <div className="mt-6 flex flex-col gap-2 text-[0.85rem] text-dim sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {CONFIG.nome}. Domínio por conta do cliente.</p>
          <p>Feito em Poços de Caldas.</p>
        </div>
      </div>
    </footer>
  );
}
