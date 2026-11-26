import { CONFIG, temCrn, waLink, atendimentosAtivos } from '../config';
import { Markers } from '../components/Markers';

function Line({ text }: { text: string }) {
  return (
    <span className="hl">
      <span className="hl__ghost">{text}</span>
      <span className="hl__win">
        <span className="hl__fill">{text}</span>
      </span>
    </span>
  );
}

export function Hero() {
  const [first, ...rest] = CONFIG.nome.split(' ');
  return (
    <section className={`hero ${CONFIG.fotoHero ? 'hero--foto' : ''}`} id="topo" aria-labelledby="hero-h1">
      <div className="wrap hero__grid">
        <p className="eyebrow hero__eyebrow">
          {CONFIG.descritor} · {CONFIG.cidade}/{CONFIG.uf}
          {temCrn() && <> · {CONFIG.crn}</>}
        </p>
        <h1 className="hero__name" id="hero-h1">
          <span className="sr-only">{CONFIG.nome}</span>
          <span className="hero__lines" aria-hidden="true">
            <Line text={first} />
            <Line text={rest.join(' ')} />
          </span>
        </h1>
        <Markers variant="hero" className="hero__markers" />
        <div className="hero__aside">
          <p className="hero__lead">
            Nutrição clínica com acompanhamento individual, a partir de uma consulta, em {CONFIG.cidade}.
          </p>
          <div className="hero__ctas">
            {CONFIG.usarWhatsapp && (
              <a className="btn btn--ink" href={waLink()} target="_blank" rel="noopener noreferrer">
                Agendar consulta
              </a>
            )}
            {CONFIG.secoes.atendimentos && atendimentosAtivos().length > 0 && (
              <a className="btn btn--line" href="#atendimentos">
                Ver atendimentos
              </a>
            )}
          </div>
        </div>
        {CONFIG.fotoHero && (
          <figure className="hero__foto">
            <img
              src={`${CONFIG.fotoHero}-640.webp`}
              srcSet={`${CONFIG.fotoHero}-400.webp 400w, ${CONFIG.fotoHero}-640.webp 640w, ${CONFIG.fotoHero}-900.webp 900w`}
              sizes="(min-width: 64rem) 24vw, 80vw"
              alt={CONFIG.fotoHeroAlt}
              width={829}
              height={1459}
              decoding="async"
              {...{ fetchpriority: 'high' }}
            />
          </figure>
        )}
      </div>
    </section>
  );
}
