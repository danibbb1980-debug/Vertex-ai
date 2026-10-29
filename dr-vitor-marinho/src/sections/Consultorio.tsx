import { CONFIG, exibirEspecialista } from '../config'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'

const PILARES = [
  {
    n: '01',
    t: 'Atendimento com hora marcada',
    d: 'A agenda é organizada para que cada paciente seja recebido no horário combinado, com tempo para conversar.',
  },
  {
    n: '02',
    t: 'Planejamento explicado',
    d: 'Você entende o que foi observado na avaliação, quais caminhos existem e o que cada um envolve, antes de decidir.',
  },
  {
    n: '03',
    t: 'Formação acadêmica em Dentística',
    d: 'Mestrado em Dentística pela FOB/USP e doutorado em Dentística pela USP.',
  },
]

export function Consultorio() {
  const cro = CONFIG.cro.trim()
  const foto = CONFIG.fotos.doutor.trim()
  return (
    <section aria-labelledby="titulo-consultorio" id="consultorio" className="relative py-24 lg:py-36">
      <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <SectionHeading id="titulo-consultorio" label="O consultório" title="Tempo e atenção para *cada* paciente.">
            <p>
              No consultório do {CONFIG.nome}, cada consulta é marcada com antecedência. Assim, o tempo da avaliação é
              dedicado a quem está na cadeira: ouvir o que incomoda, examinar com cuidado e explicar as possibilidades
              antes de qualquer decisão.
            </p>
            <p className="mt-4">
              O foco está na Dentística e na odontologia estética, em especial nas restaurações diretas, e também nas
              próteses fixas, sobre implante, removíveis e totais.
            </p>
          </SectionHeading>

          <ol className="mt-14 grid gap-px overflow-hidden border border-ink/10 bg-ink/10 sm:grid-cols-3">
            {PILARES.map((p, i) => (
              <Reveal as="li" key={p.n} delay={i * 0.08} className="bg-ivory p-6 lg:p-7">
                <span className="font-display text-sm italic text-teal-deep">{p.n}</span>
                <h3 className="mt-6 text-[1.35rem] leading-snug text-ink">{p.t}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">{p.d}</p>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal className="lg:col-span-5 lg:pl-6" delay={0.1}>
          <figure className="on-dark relative overflow-hidden bg-night p-8 text-paper sm:p-10 lg:mt-24">
            {foto ? (
              <img src={foto} alt={`${CONFIG.nome}`} className="mb-8 aspect-[4/5] w-full object-cover" loading="lazy" />
            ) : (
              <div aria-hidden="true" className="mb-10 grid w-40 grid-cols-4 gap-1">
                {['bg-sage', 'bg-mint', '', '', 'bg-mint', 'bg-teal', 'bg-teal', 'bg-sage', '', 'bg-teal', 'bg-teal', 'bg-mint', '', '', 'bg-sage', ''].map((c, i) => (
                  <span key={i} className={`block aspect-square ${c}`} />
                ))}
              </div>
            )}
            <figcaption>
              <p className="eyebrow text-teal">{CONFIG.profissao}</p>
              <p className="mt-4 font-display text-[2rem] leading-tight">{CONFIG.nome}</p>
              {cro && <p className="mt-2 text-sm text-paper/75">{cro}</p>}
              {exibirEspecialista() && <p className="mt-1 text-sm text-paper/75">Especialista em {CONFIG.especialidade}</p>}
              <div className="my-7 h-px bg-paper/15" />
              <dl className="space-y-4 text-[0.95rem]">
                <div>
                  <dt className="text-paper/60">Área de atuação</dt>
                  <dd className="mt-0.5">Dentística, com ênfase em odontologia estética</dd>
                </div>
                <div>
                  <dt className="text-paper/60">Também atende</dt>
                  <dd className="mt-0.5">Prótese fixa, próteses sobre implante, removíveis e totais</dd>
                </div>
                {CONFIG.formacao.length > 0 && (
                  <div>
                    <dt className="text-paper/60">Formação</dt>
                    <dd className="mt-1">
                      <ul className="space-y-1">
                        {CONFIG.formacao.map((f) => (
                          <li key={f.ano} className="flex gap-3">
                            <span className="w-10 shrink-0 tabular-nums text-teal">{f.ano}</span>
                            <span>
                              {f.titulo} · {f.sigla}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
              </dl>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
