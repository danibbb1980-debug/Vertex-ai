import { CONFIG } from '../config'

/** Só aparece quando CONFIG.profissionais tiver nome completo, profissão e registro. */
export function Equipe() {
  const lista = CONFIG.profissionais.filter((p) => p.nome && p.profissao && p.registro)
  if (!lista.length) return null
  return (
    <section id="equipe" aria-labelledby="titulo-equipe" className="bg-marfim">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:py-32">
        <div className="lg:col-span-4">
          <p className="rotulo text-caramelo-queimado">Equipe</p>
          <h2 id="titulo-equipe" className="mt-5 text-[clamp(2.4rem,6vw,4rem)]">
            Quem <em className="not-italic text-caramelo-queimado">atende</em>.
          </h2>
        </div>
        <ul className="border-b border-fio lg:col-span-8">
          {lista.map((p) => (
            <li key={p.nome} className="grid gap-6 border-t border-fio py-8 sm:grid-cols-[auto_1fr] sm:items-center">
              {p.foto && (
                <img
                  src={p.foto}
                  alt={`Retrato de ${p.nome}`}
                  width={160}
                  height={210}
                  loading="lazy"
                  className="moldura-arco h-[210px] w-[160px] object-cover"
                />
              )}
              <div>
                <h3 className="text-[clamp(1.9rem,4.4vw,3rem)]">{p.nome}</h3>
                <p className="mt-2 text-cafe-suave">
                  {p.profissao} · <span className="num">{p.registro}</span>
                </p>
                {p.especialidade?.titulo && p.especialidade.registro && (
                  <p className="mt-1 text-cafe-suave">
                    {p.especialidade.titulo} · <span className="num">{p.especialidade.registro}</span>
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
