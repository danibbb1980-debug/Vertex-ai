import { CONFIG } from '../config'
import { ArcoNumero } from './Icones'

/** Fundo caramelo: continuação exata da porta que cresceu no hero. */
export function Clinica() {
  return (
    <section id="clinica" aria-labelledby="titulo-clinica" className="relative bg-caramelo text-cafe">
      <div className="mx-auto grid max-w-[1320px] gap-14 px-5 pb-24 pt-20 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:pb-36 lg:pt-32">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <h2 id="titulo-clinica" className="rotulo !font-sans !tracking-[0.22em] text-cafe-sobre-caramelo">
              A clínica
            </h2>
            {CONFIG.frase && (
              <figure className="mt-6">
                <blockquote className="font-display text-[clamp(2.2rem,5.6vw,3.9rem)] leading-[1.02] tracking-[-0.02em]">
                  <p>“{CONFIG.frase}”</p>
                </blockquote>
                <figcaption className="mt-6 text-[0.95rem] text-cafe-sobre-caramelo">
                  {CONFIG.nome} · protocolos personalizados
                </figcaption>
              </figure>
            )}
          </div>
        </div>
        <ol className="lg:col-span-6 lg:col-start-7 lg:pt-[4.6rem]">
          {CONFIG.pilares.map((p, i) => (
            <li key={p.nome} className="grid grid-cols-[auto_1fr] gap-x-5 border-t border-cafe/25 py-8 last:border-b sm:gap-x-7 sm:py-10">
              <ArcoNumero n={i + 1} className="mt-2 !border-cafe/50 [&>span:last-child]:!text-cafe" />
              <div>
                <h3 className="text-[clamp(2.6rem,8vw,5rem)] leading-[0.9]">{p.nome}</h3>
                <p className="mt-4 max-w-[26rem] text-[1.02rem] leading-relaxed text-cafe-sobre-caramelo">{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
