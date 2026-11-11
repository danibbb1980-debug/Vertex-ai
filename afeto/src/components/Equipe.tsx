import { profissionaisPublicaveis } from '../lib/dados'

/** Só aparece com CONFIG.mostrarEquipe = true e profissionais autorizados, com registro quando houver conselho. */
export function Equipe() {
  const lista = profissionaisPublicaveis()
  if (!lista.length) return null
  return (
    <section id="equipe" aria-labelledby="titulo-equipe" className="mx-auto max-w-[84rem] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <p className="rotulo mb-5 text-terracota-texto">Equipe</p>
      <h2 id="titulo-equipe" className="mb-12 text-[clamp(2.2rem,4.8vw,3.8rem)] text-tinta">
        Quem atende no espaço
      </h2>
      <ul className="grid border-t border-tinta/70 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((p) => (
          <li key={p.nome} className="flex gap-5 border-b border-fio py-7 sm:pr-8">
            {p.foto && (
              <img
                src={p.foto}
                alt={`Foto de ${p.nome}`}
                width={96}
                height={96}
                loading="lazy"
                className="size-24 shrink-0 rounded-full rounded-br-none object-cover"
              />
            )}
            <div>
              <h3 className="text-[1.7rem] leading-tight text-tinta">{p.nome}</h3>
              <p className="mt-1 text-tinta-suave">
                {p.profissao}
                {p.registro && <span className="block text-[0.9rem] font-semibold text-terracota-texto">{p.registro}</span>}
              </p>
              {p.texto && <p className="mt-3 text-[0.95rem] text-tinta-suave">{p.texto}</p>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
