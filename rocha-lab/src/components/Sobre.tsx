import { CONFIG } from '../config'
import { CabecalhoSecao, Foto, FotoMontada, Pendente } from './ui'

const galeria: { nome: string; tamanho: [number, number]; alt: string; legenda: string }[] = [
  {
    nome: 'protese-total-articulador',
    tamanho: [1080, 1080],
    alt: 'Prótese total superior e inferior montadas sobre modelos de gesso.',
    legenda: 'Prótese total sobre modelos',
  },
  {
    nome: 'infraestrutura-metalica',
    tamanho: [1080, 1080],
    alt: 'Infraestruturas metálicas de coroas sobre suporte refratário na bancada.',
    legenda: 'Infraestruturas metálicas',
  },
  {
    nome: 'coroas-queima',
    tamanho: [195, 163],
    alt: 'Coroas cerâmicas apoiadas em pinos sobre a bandeja de queima.',
    legenda: 'Coroas na bandeja de queima',
  },
  {
    nome: 'laboratorio-bancada',
    tamanho: [202, 360],
    alt: 'Bancada do laboratório com equipamentos e prateleiras.',
    legenda: 'Bancada do laboratório',
  },
]

export function Sobre() {
  return (
    <section id="sobre" aria-labelledby="titulo-sobre" className="py-24 sm:py-28 lg:py-36">
      <div className="container-site grid gap-16 lg:grid-cols-12 lg:gap-12">
        {/* fotos */}
        <div className="relative lg:col-span-6">
          <figure className="registro w-[86%]">
            <div className="aspect-[4/5] overflow-hidden bg-papel">
              <Foto
                nome="matheus-bancada"
                tamanho={[1080, 1080]}
                alt="Matheus Rocha trabalhando em uma peça na bancada do laboratório."
                sizes="(min-width: 1024px) 42vw, 86vw"
                className="h-full w-full object-cover object-[40%_50%]"
              />
            </div>
            <figcaption className="mt-3 text-[0.75rem] text-cinza">
              <span className="rotulo mr-2 text-petroleo-600">Na bancada</span>
              {CONFIG.responsavel}, responsável pelo laboratório
            </figcaption>
          </figure>
          <figure className="absolute top-[42%] right-0 w-[42%] max-w-[230px] border-[6px] border-perola bg-perola shadow-[0_24px_50px_-28px_rgb(15_51_53/0.55)]">
            <div className="aspect-square overflow-hidden">
              <Foto
                nome="acabamento-pincel"
                tamanho={[1080, 1080]}
                alt="Mãos aplicando caracterização com pincel em uma peça, na bancada."
                sizes="230px"
                className="h-full w-full scale-[1.2] object-cover object-[45%_55%]"
              />
            </div>
          </figure>
        </div>

        {/* texto */}
        <div className="lg:col-span-6 lg:pt-6 lg:pl-6">
          <CabecalhoSecao
            id="titulo-sobre"
            numero="04"
            rotulo="Sobre o laboratório"
            titulo={
              <>
                Por trás de cada peça, <em className="font-normal text-petroleo-700">uma bancada</em> e um nome.
              </>
            }
          />
          <div className="mt-7 space-y-5 text-[1.0625rem] leading-relaxed text-cinza">
            <p>
              O {CONFIG.nome} fica em {CONFIG.cidade} e tem à frente {CONFIG.responsavel}, responsável pelo laboratório,
              com mais de {CONFIG.anosExperiencia} anos de dedicação à prótese dentária.
            </p>
            <p>
              O dia a dia é de bancada: modelos, cera, cerâmica e resina, trabalhados com atenção à forma, aos contatos e ao
              acabamento. Para o dentista, a proposta é simples: entender bem o caso, executar com cuidado e manter a conversa
              aberta durante o processo.
            </p>
          </div>

          <dl className="mt-10 border-t border-linha text-[0.9375rem]">
            {[
              ['Responsável', CONFIG.responsavel],
              ['Formação', CONFIG.formacaoResponsavel],
              ['CRO-SP do laboratório', CONFIG.croLaboratorio],
              ['CRO-SP do responsável', CONFIG.croResponsavel],
            ].map(([rotulo, valor]) => (
              <div key={rotulo} className="grid grid-cols-[minmax(0,11rem)_1fr] items-baseline gap-4 border-b border-linha py-3.5">
                <dt className="rotulo text-petroleo-600">{rotulo}</dt>
                {/* CONFIRMAR COM O LABORATÓRIO: formação e registros no CRO-SP */}
                <dd className="text-tinta">{valor ?? <Pendente />}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Da bancada */}
      <div className="container-site mt-24 lg:mt-32">
        <div className="flex items-baseline justify-between gap-6 border-b border-linha pb-4">
          <h3 className="text-[1.5rem] font-light text-petroleo-900">
            Da <em className="text-petroleo-700">bancada</em>
          </h3>
          <a
            href={CONFIG.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.875rem] font-semibold text-petroleo-700 underline decoration-petroleo-700/25 underline-offset-[6px] hover:decoration-petroleo-700"
          >
            Mais no Instagram<span className="sr-only"> (abre em nova aba)</span>
          </a>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {galeria.map((g) => (
            <li key={g.nome}>
              <figure>
                <div className="group aspect-square overflow-hidden bg-marfim">
                  {g.tamanho[0] >= 700 ? (
                    <Foto
                      nome={g.nome}
                      tamanho={g.tamanho}
                      alt={g.alt}
                      sizes="(min-width: 1024px) 22vw, 45vw"
                      className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-atelie)] group-hover:scale-[1.04]"
                    />
                  ) : (
                    <FotoMontada nome={g.nome} tamanho={g.tamanho} alt={g.alt} className="p-4 sm:p-6" />
                  )}
                </div>
                <figcaption className="mt-3 text-[0.8125rem] text-cinza">{g.legenda}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
