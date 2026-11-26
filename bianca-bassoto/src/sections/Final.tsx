import { CONFIG, enderecoLinha, telLink, temCrn, waLink } from '../config';
import { Markers } from '../components/Markers';
import { Logo } from '../components/Logo';

export function CtaFinal() {
  return (
    <section className="sec sec--ink cta" aria-labelledby="cta-h">
      <div className="wrap cta__grid">
        <Markers variant="lit" className="cta__marks" />
        <h2 className="cta__title" id="cta-h">
          O primeiro passo é a consulta.
        </h2>
        <div className="cta__btns">
          {CONFIG.usarWhatsapp && (
            <a className="btn btn--paper" href={waLink()} target="_blank" rel="noopener noreferrer">
              Agendar consulta
            </a>
          )}
          <a className="btn btn--line-inv" href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">
            Ver no Instagram
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <Logo className="footer__logo" title={`${CONFIG.nome}, ${CONFIG.descritor}`} />
          <ul className="footer__info">
            <li>
              {CONFIG.nome} · {CONFIG.descritor} · {CONFIG.cidade}/{CONFIG.uf}
              {temCrn() && <> · {CONFIG.crn}</>}
            </li>
            <li>{enderecoLinha()}</li>
            <li className="footer__links">
              <a href={telLink()}>
                <span className="tlink">{CONFIG.telefoneExibicao}</span>
              </a>
              {CONFIG.usarWhatsapp && (
                <a href={waLink()} target="_blank" rel="noopener noreferrer">
                  <span className="tlink">WhatsApp</span>
                </a>
              )}
              <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">
                <span className="tlink">Instagram</span>
              </a>
              <a href="/privacidade.html">
                <span className="tlink">Privacidade</span>
              </a>
            </li>
          </ul>
        </div>
        <p className="footer__legal">
          Conteúdo informativo, sem finalidade de diagnóstico ou promessa de resultado. A indicação de cada
          atendimento depende de avaliação individual.
        </p>
      </div>
      <p className="footer__sig" aria-hidden="true">
        {CONFIG.nome}
      </p>
    </footer>
  );
}

export function MobileBar() {
  if (!CONFIG.usarWhatsapp) return null;
  return (
    <div className="mbar">
      <a className="btn btn--ink" href={waLink()} target="_blank" rel="noopener noreferrer">
        Agendar consulta
      </a>
      <a className="btn btn--line" href={telLink()}>
        Ligar
      </a>
    </div>
  );
}

export function FloatCta() {
  if (!CONFIG.usarWhatsapp) return null;
  return (
    <a className="float-cta" href={waLink()} target="_blank" rel="noopener noreferrer" data-float>
      <Markers variant="lit" />
      Agendar consulta
    </a>
  );
}

export function DraftBar() {
  if (!CONFIG.rascunho) return null;
  return (
    <div className="draft" role="note">
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  );
}
