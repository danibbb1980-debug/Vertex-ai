import { motion } from 'motion/react'
import { CONFIG, filled } from '../config'

/** Composição tipográfica: nome grande atravessando um círculo fino (moldura da futura foto). */
export function Equipe() {
  const pessoas = CONFIG.profissionais.filter((p) => filled(p.nome))
  if (!pessoas.length) return null

  return (
    <section id="equipe" aria-labelledby="equipe-titulo" className="overflow-hidden bg-osso-2 py-24 md:py-36">
      <div className="container-b">
        <p className="rotulo flex items-center gap-4 text-champanhe-escuro">
          <span aria-hidden="true" className="h-px w-10 bg-champanhe-escuro" />
          <span id="equipe-titulo">Equipe</span>
        </p>

        <ul className="mt-14 space-y-24 md:mt-20">
          {pessoas.map((p, i) => {
            const credencial = [p.profissao, p.registro].filter(filled).join(' · ')
            const temFoto = filled(p.foto)
            return (
              <li key={p.nome} className="relative grid items-center md:grid-cols-12">
                <div
                  className={`relative mx-auto aspect-square w-[78vw] max-w-[30rem] md:col-span-6 md:w-full ${
                    i % 2 ? 'md:col-start-1' : 'md:col-start-7'
                  }`}
                >
                  {temFoto ? (
                    <img
                      src={p.foto}
                      alt={p.fotoAlt || p.nome}
                      loading="lazy"
                      decoding="async"
                      width={480}
                      height={480}
                      className="absolute inset-[4%] h-[92%] w-[92%] rounded-full object-cover grayscale-[15%]"
                    />
                  ) : null}
                  <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden="true">
                    <motion.circle
                      cx="100"
                      cy="100"
                      r="99"
                      fill="none"
                      stroke="var(--color-champanhe)"
                      strokeWidth="1"
                      vectorEffect="non-scaling-stroke"
                      transform="rotate(-90 100 100)"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
                    />
                    {!temFoto && (
                      <line x1="100" y1="0" x2="100" y2="200" stroke="var(--color-filete)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                    )}
                  </svg>
                </div>

                <div
                  className={`relative mt-[-9vw] md:absolute md:inset-x-0 md:top-1/2 md:mt-0 md:-translate-y-1/2 ${
                    i % 2 ? 'md:text-right' : ''
                  }`}
                >
                  <p className="rotulo mb-4 text-pedra">{p.cargo}</p>
                  <h3 className="titulo text-[clamp(3.25rem,11vw,9.5rem)] leading-[0.92]">
                    {p.nome.split(' ').map((parte, k) => (
                      <span key={k} className={`block ${k === 1 ? 'pl-[12vw] md:pl-[16%]' : ''}`}>
                        {parte}
                      </span>
                    ))}
                  </h3>
                  {credencial && <p className="mt-6 text-lg text-pedra">{credencial}</p>}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
