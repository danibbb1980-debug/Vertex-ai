import { frentesAtivas } from '../config';
import { SectionHead } from '../components/SectionHead';

export function ComoFunciona({ num }: { num: string }) {
  const fr = frentesAtivas();
  if (!fr.length) return null;
  return (
    <section className="sec como" id="como-funciona" aria-labelledby="como-h">
      <div className="wrap como__grid">
        <SectionHead
          num={num}
          label="Como funciona"
          id="como-h"
          lines={['Como funciona o', 'acompanhamento', 'nutricional']}
          className="como__head"
        />
        <div className="tl" data-timeline>
          <span className="tl__track" aria-hidden="true">
            <span className="tl__progress" />
          </span>
          <ol className="tl__list">
          {fr.map((f, i) => (
            <li className="tl__step" key={f.id} data-step>
              <span className="tl__dot" aria-hidden="true">
                <span className="mk-bar__fill" style={{ background: `var(--${f.cor})` }} />
              </span>
              <span className="tl__n" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="tl__h">{f.rotulo}</h3>
              <p className="tl__p">{f.texto}</p>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
