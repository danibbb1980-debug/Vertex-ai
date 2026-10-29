import { CONFIG } from '../config'
import { temTexto } from '../lib/util'
import { Reveal } from './Base'

/** Só aparece quando houver profissionais cadastrados no config. */
export function Profissionais() {
  const lista = CONFIG.profissionais.filter((p) => temTexto(p.nome))
  if (lista.length === 0) return null
  return (
    <div className="wrap mt-20">
      <h3 className="font-serif text-[clamp(1.7rem,3vw,2.4rem)] text-ink">
        A <em className="text-sage-deep">equipe</em>
      </h3>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((p, i) => (
          <Reveal as="li" key={p.nome} delay={i * 0.06} className="overflow-hidden rounded-[22px] border border-line bg-paper">
            {temTexto(p.foto) && (
              <img src={p.foto} alt={`Foto de ${p.nome}`} loading="lazy" className="aspect-[4/5] w-full object-cover" />
            )}
            <div className="p-6">
              <p className="font-serif text-2xl text-ink">{p.nome}</p>
              {temTexto(p.formacao) && <p className="mt-1 text-muted">{p.formacao}</p>}
              {temTexto(p.cro) && <p className="eyebrow mt-3 !text-[0.7rem] text-sage-deep">{p.cro}</p>}
            </div>
          </Reveal>
        ))}
      </ul>
    </div>
  )
}
