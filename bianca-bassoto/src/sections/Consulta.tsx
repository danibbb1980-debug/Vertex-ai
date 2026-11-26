import { Markers } from '../components/Markers';
import { CONFIG } from '../config';

const passos = [
  'Você conta sua rotina e o que procura.',
  `Avaliação individual com a ${CONFIG.nome.split(' ')[0]}.`,
  'Orientação para você decidir os próximos passos.',
];

export function Consulta({ num }: { num: string }) {
  return (
    <section className="sec consulta" id="consulta" aria-labelledby="consulta-h">
      <div className="wrap">
        <p className="shead__meta consulta__meta">
          <span className="shead__num">{num}</span>
          <Markers />
          <span className="shead__label">A consulta</span>
        </p>
        <h2 className="consulta__title" id="consulta-h">
          <span className="mask">
            <span className="mask__in">Primeiro,</span>{' '}
          </span>
          <span className="mask consulta__l2">
            <span className="mask__in" style={{ ['--i' as string]: 1 }}>
              a conversa.
            </span>
          </span>
        </h2>
        <ol className="consulta__steps">
          {passos.map((p, i) => (
            <li className="row consulta__step" key={i}>
              <span className="consulta__n" aria-hidden="true">
                {i + 1}
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
