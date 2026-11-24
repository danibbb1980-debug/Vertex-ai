import { CONFIG } from '../config'
import { waUrl } from '../lib/whatsapp'
import { LogoCompleto } from './Logo'

export function Rodape() {
  const e = CONFIG.endereco
  return (
    <footer className="rod">
      <div className="grade rod-grade">
        <div className="rod-marca">
          <LogoCompleto className="rod-logo" titulo={CONFIG.nome} />
          <p className="rod-linha">
            {CONFIG.nome} · {CONFIG.descritor} · {CONFIG.cidade}/{e.uf}
          </p>
        </div>
        <address className="rod-dados">
          <span>
            {e.rua}, {e.numero}, {e.bairro}
          </span>
          <span>
            {e.cidade} - {e.uf}, CEP {e.cep}
          </span>
        </address>
        <ul className="rod-links">
          {CONFIG.usarWhatsapp && (
            <li>
              <a className="link" href={waUrl()} target="_blank" rel="noopener noreferrer">
                WhatsApp {CONFIG.whatsappExibicao}
              </a>
            </li>
          )}
          {CONFIG.instagram.url && (
            <li>
              <a className="link" href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">
                Instagram {CONFIG.instagram.usuario}
              </a>
            </li>
          )}
          <li>
            <a className="link" href="/privacidade.html">
              Privacidade
            </a>
          </li>
        </ul>
        {CONFIG.responsavel.nome && CONFIG.responsavel.registro && (
          <p className="rod-resp">
            Responsabilidade técnica: {CONFIG.responsavel.nome} · {CONFIG.responsavel.registro}
          </p>
        )}
        <p className="rod-aviso">
          Conteúdo informativo, sem finalidade de diagnóstico ou promessa de resultado. A indicação de cada
          atendimento depende de avaliação individual.
        </p>
      </div>
      <p className="rod-assinatura" aria-hidden="true">
        <span>{CONFIG.nomeCurto}</span>
      </p>
    </footer>
  )
}
