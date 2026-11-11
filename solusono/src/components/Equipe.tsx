import { CONFIG } from "../config";

/** Só aparece com mostrarEquipe = true E profissionais com nome + registro preenchidos. */
export function Equipe() {
  const pessoas = CONFIG.equipe.filter((p) => p.nome.trim() && p.registro.trim() && p.profissao.trim());
  if (!CONFIG.mostrarEquipe || !pessoas.length) return null;
  return (
    <section id="equipe" aria-labelledby="equipe-titulo" className="border-t border-line bg-white py-24 md:py-32">
      <div className="container-site grid gap-y-12 md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-4">
          <p className="rotulo">Equipe</p>
          <h2 id="equipe-titulo" className="titulo mt-5 text-[clamp(2.2rem,4.6vw,3.8rem)]">
            Quem <em>acompanha</em> você.
          </h2>
        </div>
        <ul className="divide-y divide-line border-y border-line md:col-span-7 md:col-start-6">
          {pessoas.map((p) => (
            <li key={p.registro} className="flex items-center gap-6 py-6">
              {p.foto && (
                <img src={p.foto} alt={`Foto de ${p.nome}`} width={96} height={96} loading="lazy" className="h-20 w-20 rounded-full object-cover" />
              )}
              <div>
                <p className="titulo text-[1.8rem]">{p.nome}</p>
                <p className="mt-1 text-muted">
                  {p.profissao} <span aria-hidden="true">·</span> {p.registro}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
