import { Reveal } from '../components/motion'
import { SectionHead } from '../components/SectionHead'

const ITENS = [
  {
    titulo: 'Check-up periódico',
    texto:
      'Consultas regulares ajudam a acompanhar a saúde da boca e a perceber alterações logo no início. A frequência adequada para você é definida na avaliação.',
  },
  {
    titulo: 'Perda de um dente',
    texto:
      'Quando um dente é perdido, vale conhecer as opções de reposição. Cada caso tem um caminho próprio, definido a partir do exame clínico e de exames complementares.',
  },
  {
    titulo: 'Incômodo com a aparência dos dentes',
    texto:
      'Se algo na cor, na forma ou no alinhamento dos dentes incomoda você, uma conversa ajuda a entender o que é possível no seu caso e quais são os limites.',
  },
]

const ROMANOS = ['i', 'ii', 'iii', 'iv', 'v']

export function QuandoProcurar() {
  return (
    <section aria-labelledby="quando-titulo" className="py-24 md:py-36">
      <div className="container-n grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div className="lg:sticky lg:top-40 lg:self-start">
          <SectionHead eyebrow="Quando procurar" id="quando-titulo" title="Quando vale *marcar* uma consulta.">
            <p>Algumas situações comuns em que uma avaliação ajuda a entender o momento da sua saúde bucal.</p>
          </SectionHead>
        </div>
        <ol className="border-t border-line">
          {ITENS.map((it, i) => (
            <Reveal as="li" key={it.titulo} delay={i * 0.08} className="group grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-9 md:grid-cols-[4.5rem_1fr] md:py-11">
              <span className="font-serif text-[2rem] italic leading-none text-copper-ink" aria-hidden>
                {ROMANOS[i]}.
              </span>
              <div>
                <h3 className="font-serif text-[1.75rem] leading-tight text-espresso md:text-[2.1rem]">{it.titulo}</h3>
                <p className="mt-3 max-w-xl text-ink">{it.texto}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
