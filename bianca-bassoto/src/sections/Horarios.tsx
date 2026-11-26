import { useEffect, useState } from 'react';
import { CONFIG } from '../config';
import { horariosAgrupados, hojeNoFuso } from '../lib';
import { SectionHead } from '../components/SectionHead';

export function Horarios({ num }: { num: string }) {
  const grupos = horariosAgrupados();
  const [hoje, setHoje] = useState<number | null>(null);
  useEffect(() => setHoje(hojeNoFuso().dia), []);
  if (!grupos.length) return null;
  return (
    <section className="sec horarios" id="horarios" aria-labelledby="horarios-h">
      <div className="wrap horarios__grid">
        <SectionHead num={num} label="Horários" id="horarios-h" lines={['Horários de', 'atendimento']} />
        <div className="horarios__body">
          <dl className="hlist">
            {grupos.map((g) => {
              const isHoje = hoje !== null && g.dias.some((d) => d.dia === hoje);
              return (
                <div className={`row hlist__row ${isHoje ? 'is-today' : ''}`} key={g.nome}>
                  <dt>
                    {g.nome}
                    {isHoje && <span className="hlist__today">Hoje</span>}
                  </dt>
                  <dd className={g.abre ? '' : 'is-closed'}>{g.texto}</dd>
                </div>
              );
            })}
          </dl>
          {CONFIG.avisoHorarios && <p className="horarios__note">{CONFIG.avisoHorarios}</p>}
        </div>
      </div>
    </section>
  );
}
