import { CONFIG } from './config';
import { WaButton, LinkButton } from './ui';

/**
 * Assinatura "de perto": o nome existe em contorno; uma lente circular atravessa
 * o nome e deixa-o preenchido. Só transform. O estado final é o HTML estático.
 */
export function Hero() {
  const nome = CONFIG.marca;
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap hero__wrap">
        <p className="hero__eyebrow">
          Detalhamento automotivo <span className="hero__dot" aria-hidden="true">·</span>{' '}
          <span className="hero__city">
            {CONFIG.cidade}/{CONFIG.uf}
          </span>
        </p>

        <h1 id="hero-title" className="sr-only">
          {CONFIG.nome}
        </h1>

        <div className="lens" data-lens aria-hidden="true">
          <span className="lens__outline">{nome}</span>
          <span className="lens__trail" data-lens-trail>
            <span className="lens__fill" data-lens-trail-in>
              {nome}
            </span>
          </span>
          <span className="lens__glass" data-lens-glass>
            <span className="lens__fill lens__fill--glass" data-lens-glass-in>
              {nome}
            </span>
          </span>
        </div>

        <p className="hero__tag" aria-hidden="true">
          Estética automotiva
        </p>

        <div className="hero__foot">
          <p className="hero__sub">
            Detalhamento automotivo para carros e motos, com atenção a cada detalhe, em {CONFIG.cidade}.
          </p>
          <div className="hero__ctas">
            <WaButton />
            <LinkButton href="#atendimentos">Ver atendimentos</LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
