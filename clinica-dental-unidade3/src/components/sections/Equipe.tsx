import { useUnidade } from "../../lib/unidade";
import { Revelar } from "../ui/Revelar";
import { TituloSecao } from "../ui/TituloSecao";

/** Só aparece se houver profissionais cadastrados no config. */
export function Equipe() {
  const { unidade } = useUnidade();
  const lista = unidade.profissionais.filter((p) => p.nome);
  if (!lista.length) return null;
  return (
    <section id="equipe" aria-labelledby="titulo-equipe" className="py-24 sm:py-32">
      <div className="container-site">
        <Revelar>
          <TituloSecao id="titulo-equipe" rotulo="Equipe" titulo="Quem cuida de *você*." />
        </Revelar>
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((p, i) => (
            <li key={p.nome}>
              <Revelar atraso={i * 0.08} className="overflow-hidden rounded-[1.75rem] border border-line bg-white">
                {p.foto && (
                  <img src={p.foto} alt={`${p.nome}, ${p.funcao}`} loading="lazy" width={600} height={700} className="aspect-[6/7] w-full object-cover" />
                )}
                <div className="p-7">
                  <h3 className="text-2xl text-navy-900">{p.nome}</h3>
                  <p className="mt-1 text-teal-700">{p.funcao}</p>
                  {p.cro && <p className="mt-1 text-sm text-ink-soft">{p.cro}</p>}
                  {p.formacao && <p className="mt-3 text-sm text-ink-soft">{p.formacao}</p>}
                </div>
              </Revelar>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
