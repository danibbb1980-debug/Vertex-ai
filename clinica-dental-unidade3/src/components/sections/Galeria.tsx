import { useUnidade } from "../../lib/unidade";
import { Revelar } from "../ui/Revelar";
import { TituloSecao } from "../ui/TituloSecao";

/** Só aparece se houver fotos aprovadas no config. */
export function Galeria() {
  const { unidade } = useUnidade();
  if (!unidade.fotos.length) return null;
  return (
    <section id="espaco" aria-labelledby="titulo-espaco" className="py-24 sm:py-32">
      <div className="container-site">
        <Revelar>
          <TituloSecao id="titulo-espaco" rotulo="O espaço" titulo="Conheça a *unidade*." />
        </Revelar>
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {unidade.fotos.map((f, i) => (
            <li key={f.src} className={i === 0 ? "sm:col-span-2 sm:row-span-2" : ""}>
              <img src={f.src} alt={f.alt} width={f.largura} height={f.altura} loading="lazy" decoding="async" className="h-full w-full rounded-[1.5rem] object-cover" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
