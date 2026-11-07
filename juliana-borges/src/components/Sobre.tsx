import { CONFIG } from '../config'
import { CabecalhoSecao, Foto, Logo, Revelar } from './ui'

export function Sobre() {
  const foto = CONFIG.fotos.espaco.length ? 'espaco-recepcao' : ''
  const formacao = CONFIG.formacao.filter((f) => f.curso && f.instituicao)
  return (
    <section id="sobre" aria-labelledby="titulo-sobre" className="relative py-24 md:py-32">
      <div className="container-site grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <Revelar className="relative order-2 lg:order-1 lg:col-span-5">
          <div className="relative mx-auto max-w-sm lg:max-w-none">
            {foto ? (
              <Foto
                src={foto}
                alt="Mesa de atendimento de Juliana Borges, com certificados de formação na parede"
                sizes="(min-width: 1024px) 34vw, 24rem"
                className="block overflow-hidden rounded-t-full rounded-b-[2rem] shadow-[0_30px_60px_-35px_rgb(78_50_38/0.55)]"
                imgClassName="aspect-[4/5] w-full object-cover"
              />
            ) : (
              <div className="degrade-nude relative aspect-[4/5] rounded-t-full rounded-b-[2rem]">
                <Logo variante="monograma" decorativo className="absolute inset-x-0 top-[22%] mx-auto h-[45%] w-fit text-ouro" />
              </div>
            )}
            {/* palavra manuscrita decorativa: repete o nome, por isso aria-hidden */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-10 -right-2 select-none font-script text-[5.5rem] leading-none text-choco sm:-right-10 sm:text-[7rem]"
            >
              Juliana
            </span>
          </div>
        </Revelar>

        <div className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7">
          <CabecalhoSecao
            id="titulo-sobre"
            rotulo="Sobre"
            titulo={
              <>
                Massoterapeuta e <em>depiladora</em>
              </>
            }
          >
            <p>
              Sou Juliana Borges e atendo em {CONFIG.cidade}, de forma individual e com hora marcada. Cada atendimento começa com uma conversa e uma
              avaliação, para entender o que você procura.
            </p>
            <p className="mt-4">
              Gosto de explicar cada etapa com calma e de responder às suas dúvidas antes de começar, para que você saiba o que vai acontecer.
            </p>
          </CabecalhoSecao>

          {formacao.length > 0 && (
            <Revelar atraso={0.1} className="mt-10 border-t border-choco/15 pt-8">
              <h3 className="rotulo mb-5">Formação</h3>
              <ul className="space-y-4">
                {formacao.map((f) => (
                  <li key={f.curso} className="flex items-baseline gap-4">
                    <span aria-hidden="true" className="mt-2 inline-block size-1.5 shrink-0 rotate-45 bg-ouro" />
                    <span>
                      <span className="font-serif text-[1.25rem] text-choco">{f.curso}</span>
                      <span className="block text-sm uppercase tracking-[0.16em] text-ouro-esc">{f.instituicao}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Revelar>
          )}
        </div>
      </div>
    </section>
  )
}
