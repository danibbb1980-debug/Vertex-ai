import { useId, useState } from 'react';
import { CONFIG, atendimentosAtivos, waLink } from '../config';
import { SectionHead } from '../components/SectionHead';

export function Atendimentos({ num }: { num: string }) {
  const itens = atendimentosAtivos();
  const [aberto, setAberto] = useState<string | null>(null);
  const base = useId();
  if (!itens.length) return null;
  return (
    <section className="sec sec--ink atend" id="atendimentos" aria-labelledby="atend-h">
      <div className="wrap atend__grid">
        <div className="atend__side">
          <SectionHead
            num={num}
            label="Atendimentos"
            id="atend-h"
            lines={['Atendimentos', `em ${CONFIG.cidade}`]}
          />
          <p className="atend__note">
            Cada atendimento começa por uma consulta. A indicação depende de avaliação individual.
          </p>
        </div>
        <ol className="idx">
          {itens.map((a, i) => {
            const open = aberto === a.id;
            const pid = `${base}-p-${a.id}`;
            const bid = `${base}-b-${a.id}`;
            return (
              <li className={`idx__row row ${open ? 'is-open' : ''}`} key={a.id}>
                <h3 className="idx__h">
                  <button
                    id={bid}
                    type="button"
                    className="idx__btn"
                    aria-expanded={open}
                    aria-controls={pid}
                    onClick={() => setAberto(open ? null : a.id)}
                  >
                    <span className="idx__num" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="idx__name">{a.nome}</span>
                    <span className="plus" aria-hidden="true" />
                  </button>
                </h3>
                <div className="idx__panel acc-panel" id={pid} role="region" aria-labelledby={bid} data-open={open}>
                  <div className="idx__body">
                    <p>{a.descricao}</p>
                    <p className="idx__small">A indicação depende de avaliação individual.</p>
                    {CONFIG.usarWhatsapp && (
                      <a
                        className="btn btn--paper"
                        href={waLink(CONFIG.mensagens.porAtendimento(a.mensagem))}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Agendar consulta de {a.nome.toLowerCase()}
                      </a>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
