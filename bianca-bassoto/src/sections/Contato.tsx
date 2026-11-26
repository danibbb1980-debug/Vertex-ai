import { CONFIG, telLink, waLink } from '../config';
import { SectionHead } from '../components/SectionHead';

export function Contato({ num }: { num: string }) {
  const e = CONFIG.endereco;
  return (
    <section className="sec contato" id="contato" aria-labelledby="contato-h">
      <div className="wrap contato__grid">
        <SectionHead num={num} label="Localização e contato" id="contato-h" lines={['Venha nos visitar']} />
        <address className="contato__addr">
          <span className="contato__street">
            {e.rua}, {e.complemento.toLowerCase()}
          </span>
          <span className="contato__city">
            {e.bairro}, {e.cidade} - {e.uf}
            <br />
            CEP {e.cep}
          </span>
        </address>
        <ul className="links contato__links">
          <li>
            <a className="tlink" href={e.rota} target="_blank" rel="noopener noreferrer">
              Como chegar
            </a>
          </li>
          <li>
            <a className="tlink" href={e.maps} target="_blank" rel="noopener noreferrer">
              Ver no Google Maps
            </a>
          </li>
          <li>
            <a className="tlink" href={telLink()}>
              Ligar · {CONFIG.telefoneExibicao}
            </a>
          </li>
          <li>
            <a className="tlink" href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">
              Ver no Instagram · {CONFIG.instagram.usuario}
            </a>
          </li>
        </ul>
        {CONFIG.usarWhatsapp && (
          <div className="contato__cta">
            <a className="btn btn--ink" href={waLink()} target="_blank" rel="noopener noreferrer">
              Agendar consulta
            </a>
          </div>
        )}
        <div className="map">
          <p className="map__fallback">
            <span>Mapa do Google Maps.</span>
            <a className="tlink" href={e.maps} target="_blank" rel="noopener noreferrer">
              Abrir o mapa em outra aba
            </a>
          </p>
          <iframe
            title={`Mapa: ${e.rua}, ${e.bairro}, ${e.cidade}`}
            src={e.embed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            width="800"
            height="600"
          />
        </div>
      </div>
    </section>
  );
}
