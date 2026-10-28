import { CONFIG } from '../config'
import { Confirmar } from './Confirmar'

/** Retrato do doutor em moldura em arco. Sem foto: bloco reservado elegante. */
export function Portrait() {
  const foto = CONFIG.fotos.doutor
  return (
    <figure className="relative mx-auto w-full max-w-[22rem] lg:max-w-[24rem]">
      {/* arco fino deslocado, ecoa a curva da arcada */}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 280"
        className="pointer-events-none absolute -right-4 -top-4 h-full w-full text-accent/50 md:-right-6 md:-top-6"
        fill="none"
        preserveAspectRatio="none"
      >
        <path d="M1 279V100a99 99 0 0 1 198 0v179" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="relative aspect-[5/7] overflow-hidden rounded-t-[999px] rounded-b-[1.25rem] bg-sand">
        {foto ? (
          <picture>
            <source srcSet={foto.avif} type="image/avif" />
            <img
              src={foto.webp}
              width={foto.largura}
              height={foto.altura}
              alt={foto.alt}
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 size-full object-cover object-[50%_12%]"
            />
          </picture>
        ) : (
          <div className="absolute inset-0 grid place-items-center p-8 text-center text-sm text-mute">
            Foto do Dr. Gustavo (substituir)
          </div>
        )}
      </div>
      <figcaption className="absolute -bottom-6 -left-2 flex size-28 flex-col items-center justify-center rounded-full border border-line bg-paper text-center shadow-[0_1px_0_rgba(0,0,0,0.02)] md:-left-8 md:size-32">
        <span className="num text-[0.62rem] text-mute">Registro</span>
        <span className="mt-1 font-display text-[1.05rem] leading-tight text-ink">
          <Confirmar tag={false}>{CONFIG.profissional.cro}</Confirmar>
        </span>
        <span className="mt-1 text-[0.68rem] text-mute">Cirurgião-Dentista</span>
      </figcaption>
    </figure>
  )
}
