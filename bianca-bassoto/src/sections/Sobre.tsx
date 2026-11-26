import { CONFIG, formacaoAtiva, temCrn } from '../config';
import { SectionHead } from '../components/SectionHead';

export function Sobre({ num }: { num: string }) {
  const f = formacaoAtiva();
  if (!f.length && !temCrn() && !CONFIG.foto) return null;
  return (
    <section className="sec sobre" id="sobre" aria-labelledby="sobre-h">
      <div className="wrap sobre__grid">
        <SectionHead num={num} label="Sobre" id="sobre-h" lines={['Formação']} className="sobre__head" />
        <div className="sobre__body">
          {CONFIG.foto && (
            <img
              className="sobre__foto"
              src={CONFIG.foto}
              alt={CONFIG.fotoAlt || `${CONFIG.nome}, ${CONFIG.descritor.toLowerCase()}`}
              width={800}
              height={1000}
              loading="lazy"
              decoding="async"
            />
          )}
          {f.map((x) => (
            <p className="sobre__statement" key={x.texto}>
              {x.texto}
            </p>
          ))}
          <p className="sobre__sign">
            {CONFIG.nome}, {CONFIG.descritor.toLowerCase()} em {CONFIG.cidade}
            {temCrn() && <> · {CONFIG.crn}</>}
          </p>
        </div>
      </div>
    </section>
  );
}
