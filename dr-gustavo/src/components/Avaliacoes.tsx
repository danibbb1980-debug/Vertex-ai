import { CONFIG } from '../config'
import { IconArrow } from './Icons'

/** Só nota e link para o Maps. Sem texto de depoimentos. Desligado por padrão. */
export function Avaliacoes() {
  if (!CONFIG.mostrarNotaGoogle || !CONFIG.notaGoogle.nota) return null
  return (
    <section aria-labelledby="aval-titulo" className="py-16">
      <div className="shell flex flex-col items-start gap-6 border-y border-line py-10 md:flex-row md:items-center md:justify-between">
        <h2 id="aval-titulo" className="text-[1.75rem]">
          Nota {CONFIG.notaGoogle.nota} no Google <span className="text-mute">({CONFIG.notaGoogle.total} avaliações)</span>
        </h2>
        <a href={CONFIG.mapsUrl} target="_blank" rel="noopener" className="btn btn-ghost">
          Ver avaliações no Google
          <IconArrow size={16} />
        </a>
      </div>
    </section>
  )
}
