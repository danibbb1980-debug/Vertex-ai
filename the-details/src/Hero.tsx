import { CONFIG, enderecoLinha } from './config';
import { WaButton } from './ui';
import { horaCurta } from './lib';

/**
 * Hero em palco: o carro surge em silhueta sob a luz, o nome aparece em contorno
 * atrás dele, o carro "acende" e então entram o título, o botão e o painel lateral.
 * Tudo em CSS (opacity e transform); sem JavaScript o estado final já está no HTML.
 */
export function Hero() {
  const util = CONFIG.horarios.find((h) => h.idx === 1);
  const sab = CONFIG.horarios.find((h) => h.idx === 6);
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="stage" aria-hidden="true">
        <div className="stage__floor" />
        <svg className="stage__word" viewBox="0 0 1200 240" preserveAspectRatio="xMidYMax meet">
          <defs>
            <linearGradient id="word-metal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="0.6" stopColor="#b9bcc1" stopOpacity="0.75" />
              <stop offset="1" stopColor="#8b8f96" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <text x="600" y="212" textAnchor="middle" className="stage__word-t" stroke="url(#word-metal)">
            The Details
          </text>
        </svg>
        <div className="stage__shadow" />
        <img
          className="stage__car stage__car--dark"
          src="/media/hero-carro-escuro-640.webp"
          srcSet="/media/hero-carro-escuro-640.webp 640w, /media/hero-carro-escuro-1100.webp 1100w"
          sizes="(min-width: 900px) 34vw, 80vw"
          width={1142}
          height={984}
          alt=""
          fetchPriority="high"
        />
        <img
          className="stage__car stage__car--lit"
          src="/media/hero-carro-640.webp"
          srcSet="/media/hero-carro-640.webp 640w, /media/hero-carro-1100.webp 1100w"
          sizes="(min-width: 900px) 34vw, 80vw"
          width={1142}
          height={984}
          alt=""
          fetchPriority="high"
        />
        <svg className="stage__leader" viewBox="0 0 200 120" preserveAspectRatio="none">
          <polyline
            points="0,120 110,0 200,0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="wrap hero__grid">
        <div className="hero__left ui-in" style={{ ['--i' as string]: 1 }}>
          <h1 id="hero-title" className="hero__title">
            <span className="sr-only">{CONFIG.nome}: </span>
            Detalhamento automotivo em {CONFIG.cidade}
          </h1>
          <p className="hero__sub">Carros e motos, com atenção a cada detalhe.</p>
          <WaButton />
        </div>

        <aside className="hero__right" aria-label="Resumo">
          <div className="hcard ui-in" style={{ ['--i' as string]: 2 }}>
            <p className="hcard__t">Atendimentos</p>
            <p className="hcard__d">Detalhamento de carros e de motos, combinado pelo WhatsApp conforme o veículo.</p>
            <a className="hcard__btn" href="#atendimentos">
              Ver atendimentos
            </a>
          </div>
          <ul className="hlist">
            <li className="hlist__item hlist__item--on ui-in" style={{ ['--i' as string]: 3 }}>
              <span className="hlist__icon" aria-hidden="true" />
              <div>
                <p className="hlist__t">Endereço</p>
                <p className="hlist__d">{enderecoLinha()}</p>
              </div>
            </li>
            <li className="hlist__item ui-in" style={{ ['--i' as string]: 4 }}>
              <span className="hlist__icon" aria-hidden="true" />
              <p className="hlist__d">
                Seg. a sex., {horaCurta(util?.abre)} às {horaCurta(util?.fecha)} · Sáb., {horaCurta(sab?.abre)} às{' '}
                {horaCurta(sab?.fecha)}
              </p>
            </li>
            <li className="hlist__item ui-in" style={{ ['--i' as string]: 5 }}>
              <span className="hlist__icon" aria-hidden="true" />
              <p className="hlist__d">WhatsApp {CONFIG.whatsappExibicao}</p>
            </li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
