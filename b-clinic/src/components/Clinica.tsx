import { motion } from 'motion/react'
import { CONFIG, filled } from '../config'
import { useReduzirMovimento } from '../lib/hooks'

const pilares = [
  {
    palavra: 'Avaliação',
    texto: 'Uma conversa sobre o que você procura e uma análise individual do rosto e da pele.',
  },
  {
    palavra: 'Planejamento',
    texto: 'As indicações são organizadas em um plano, com cada etapa explicada antes de começar.',
  },
  {
    palavra: 'Acompanhamento',
    texto: 'O plano é acompanhado ao longo das etapas combinadas com você.',
  },
]

/** Bloco preto quente. Composição: três linhas tipográficas em escada, encaixadas por filetes. */
export function Clinica() {
  const reduzir = useReduzirMovimento()
  // com a íris ativa, a frase já aparece no fechamento do círculo
  const mostrarFrase = reduzir && filled(CONFIG.frase)

  return (
    <section
      id="clinica"
      aria-labelledby="clinica-titulo"
      className="sobre-preto grao relative -mt-px bg-preto pb-24 pt-20 text-osso md:pb-36 md:pt-28"
    >
      <div className="container-b">
        <div className="grid items-start gap-10 md:grid-cols-12">
          <p className="rotulo flex items-center gap-4 text-champanhe md:col-span-3 md:pt-4">
            <span aria-hidden="true" className="h-px w-10 bg-champanhe" />A clínica
          </p>
          <div className="md:col-span-8 md:col-start-5">
            {mostrarFrase && (
              <blockquote className="mb-10">
                <p className="enfase text-[clamp(2rem,5vw,3.75rem)] leading-[1.08] text-osso">
                  “{CONFIG.frase}”
                </p>
              </blockquote>
            )}
            <h2 id="clinica-titulo" className="titulo text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.15] text-osso">
              Na B Clinic, cada atendimento começa por uma avaliação individual. O plano vem{' '}
              <span className="enfase text-champanhe">depois</span>, explicado com clareza.
            </h2>
          </div>
        </div>

        <ol className="mt-20 md:mt-32">
          {pilares.map((p, i) => (
            <li key={p.palavra} className="relative border-t border-osso/15 last:border-b">
              <motion.span
                aria-hidden="true"
                className="absolute left-0 top-[-1px] h-px w-full origin-left bg-champanhe"
                initial={reduzir ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.9 }}
                transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
              />
              <div
                className="grid items-end gap-4 py-8 md:grid-cols-12 md:gap-8 md:py-12"
                style={{ ['--recuo' as string]: `${i * 9}%` }}
              >
                <div className="flex items-baseline gap-5 md:col-span-9 md:pl-[var(--recuo)]">
                  <span className="num rotulo text-champanhe">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="titulo text-[clamp(2.2rem,6.6vw,6rem)] leading-[0.95]">{p.palavra}</h3>
                </div>
                <p className="max-w-sm text-pedra-claro md:col-span-3 md:pb-3">{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
