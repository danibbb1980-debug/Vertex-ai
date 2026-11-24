import { CONFIG } from '../config'
import { waUrl } from '../lib/whatsapp'
import { LogoCompleto } from './Logo'

export function Rodape() {
  const e = CONFIG.endereco
  return (
    <footer className="rod">
      <ResponsabilidadeTecnica />
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

/** Bloco de responsabilidade técnica. Só aparece com nome preenchido. */
function ResponsabilidadeTecnica() {
  const r = CONFIG.responsavel
  if (!r.nome) return null
  const linhas = [
    { rotulo: r.cargo, valor: r.nome, nome: true },
    r.conselho && r.registro && { rotulo: r.conselho, valor: r.registro },
    r.registroRT && { rotulo: 'Registro de responsabilidade técnica', valor: r.registroRT },
  ].filter(Boolean) as { rotulo: string; valor: string; nome?: boolean }[]
  return (
    <section className="rt" aria-labelledby="rt-t">
      <div className="grade rt-grade">
        <h2 className="rotulo rt-t" id="rt-t">
          Responsabilidade técnica
        </h2>
        <dl className="rt-lista">
          {linhas.map((l) => (
            <div className="rt-linha linha-viva" key={l.rotulo}>
              <dt>{l.rotulo}</dt>
              <dd className={l.nome ? 'rt-nome' : 'rt-num'}>{l.valor}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
