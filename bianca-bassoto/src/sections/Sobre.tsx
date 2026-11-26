import { CONFIG, formacaoAtiva, temCrn } from '../config';
import { SectionHead } from '../components/SectionHead';
import { Foto } from '../components/Foto';

export function Sobre({ num }: { num: string }) {
  const f = formacaoAtiva();
  if (!f.length && !temCrn() && !CONFIG.foto) return null;
  return (
    <section className="sec sobre" id="sobre" aria-labelledby="sobre-h">
      <div className="wrap sobre__grid">
        <div className="sobre__aside">
          <SectionHead num={num} label="Sobre" id="sobre-h" lines={['Formação']} className="sobre__head" />
          <Foto
            base={CONFIG.foto}
            alt={CONFIG.fotoAlt || `${CONFIG.nome}, ${CONFIG.descritor.toLowerCase()}`}
            className="sobre__foto"
            sizes="(min-width: 64rem) 30vw, 90vw"
          />
        </div>
        <div className="sobre__body">
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
