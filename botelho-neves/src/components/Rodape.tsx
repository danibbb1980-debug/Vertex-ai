import { CONFIG, enderecoLinha, temWhatsapp, linkWhatsapp } from "../config";
import { Assinatura, Monograma } from "./Marca";
import { IconeTelefone, IconeWhatsapp } from "./ui";

export function Rodape() {
  return (
    <footer className="escuro bg-tinta-2 pb-28 pt-20 text-osso lg:pb-14">
      <div className="mx-auto max-w-[84rem] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 border-b border-osso/15 pb-14 lg:grid-cols-[1.1fr_1fr_1fr]">
          <div>
            <Monograma className="h-14 w-auto" />
            <Assinatura className="mt-8 h-auto w-full max-w-[19rem]" />
          </div>
          <div className="space-y-6 text-[0.98rem]">
            <div>
              <p className="rotulo text-pedra-claro">Sócios</p>
              <ul className="mt-3 space-y-2">
                {CONFIG.socios.map((s) => (
                  <li key={s.nome}>
                    {s.nome} <span className="num text-pedra-claro">· {s.oab}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="rotulo text-pedra-claro">Endereços</p>
              <ul className="mt-3 space-y-2">
                {CONFIG.unidades.map((u) => (
                  <li key={u.nome}>
                    <span className="text-osso">{u.nome}:</span>{" "}
                    <span className="text-pedra-claro">
                      {enderecoLinha(u)}, CEP {u.cep}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-6 text-[0.98rem]">
            <div>
              <p className="rotulo text-pedra-claro">Contato</p>
              <ul className="mt-3 space-y-1">
                <li>
                  <a className="link inline-flex min-h-12 items-center gap-3" href={CONFIG.telefoneHref}>
                    <IconeTelefone /> <span className="num">{CONFIG.telefone}</span>
                  </a>
                </li>
                {temWhatsapp() && (
                  <li>
                    <a className="link inline-flex min-h-12 items-center gap-3" href={linkWhatsapp(CONFIG.mensagens.geral)} target="_blank" rel="noopener noreferrer">
                      <IconeWhatsapp /> WhatsApp
                    </a>
                  </li>
                )}
                <li>
                  <a className="link inline-flex min-h-12 items-center" href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">
                    Instagram {CONFIG.instagram.usuario}
                  </a>
                </li>
              </ul>
            </div>
            <p>
              <a className="link inline-flex min-h-12 items-center" href="/privacidade.html">
                Privacidade
              </a>
            </p>
          </div>
        </div>
        <p className="mt-8 max-w-[52rem] text-sm text-pedra-claro">
          Conteúdo meramente informativo, sem finalidade de captação de clientela, em conformidade com o Provimento
          205/2021 do Conselho Federal da OAB.
        </p>
        <p className="mt-3 text-sm text-pedra-claro">
          © {new Date().getFullYear()} {CONFIG.nome}
        </p>
      </div>
    </footer>
  );
}
