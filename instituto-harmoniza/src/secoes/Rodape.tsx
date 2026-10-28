import { CONFIG } from "../config";
import { linkWhatsApp } from "../lib/whatsapp";
import { Logo } from "../components/Logo";
import { Confirmar } from "../components/Confirmar";
import { LINKS_NAV } from "../components/Header";

export function Rodape() {
  const links = LINKS_NAV.filter((l) => CONFIG.secoes[l.secao]);
  const rt = CONFIG.responsavelTecnico;
  return (
    <footer className="relative z-10 bg-areia text-[0.92rem] text-suave">
      <div className="contem grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-4">
          <Logo largura={170} />
          <p className="mt-5 max-w-[30ch]">{CONFIG.descritor}.</p>
        </div>

        <nav aria-label="Rodapé" className="md:col-span-2">
          <h2 className="rotulo text-bronze">Navegação</h2>
          <ul className="mt-4 space-y-1.5">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="inline-block py-1 hover:text-tinta">
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <h2 className="rotulo text-bronze">Contato</h2>
          <ul className="mt-4 space-y-1.5">
            <li>
              <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:text-tinta">
                WhatsApp {CONFIG.telefoneExibicao}
              </a>
            </li>
            <li>
              <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:text-tinta">
                Instagram {CONFIG.instagramUsuario}
              </a>
            </li>
            <li>
              <a href={CONFIG.googleMaps} target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:text-tinta">
                Como chegar (Google Maps)
              </a>
            </li>
            <li className="pt-1">
              {CONFIG.endereco.confirmado ? (
                <>
                  {CONFIG.enderecoPartes.rua} - {CONFIG.enderecoPartes.bairro}
                  <br />
                  {CONFIG.enderecoPartes.cidade} - {CONFIG.enderecoPartes.uf}, {CONFIG.enderecoPartes.cep}
                </>
              ) : (
                <>
                  {CONFIG.endereco.valor}
                  <Confirmar valor={CONFIG.endereco.valor} />
                </>
              )}
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="rotulo text-bronze">Responsável técnico</h2>
          <p className="mt-4">
            {rt.nome.valor}
            <Confirmar mostrar={!rt.nome.confirmado} valor={rt.nome.valor} />
          </p>
          <p className="mt-1 tabular-nums">
            {rt.cro.valor}
            <Confirmar mostrar={!rt.cro.confirmado} valor={rt.cro.valor} />
          </p>
          <p className="mt-5">
            <a href="/privacidade.html" className="underline decoration-ouro underline-offset-4 hover:text-tinta">
              Política de privacidade
            </a>
          </p>
        </div>
      </div>

      <div className="border-t border-tinta/10">
        <div className="contem flex flex-col gap-3 py-7 text-[0.82rem] text-cinza md:flex-row md:items-center md:justify-between md:pr-28">
          <p>Conteúdo informativo; a indicação de cada atendimento depende de avaliação individual.</p>
          <p>
            © {new Date().getFullYear()} {CONFIG.nome}
          </p>
        </div>
      </div>
    </footer>
  );
}
