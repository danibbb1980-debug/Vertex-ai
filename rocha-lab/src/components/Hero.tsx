import { whatsappLink } from '../lib/links'
import { Botao, Foto, IconSeta, IconWhatsApp } from './ui'

/** Título com revelação palavra a palavra em CSS (efeito único de entrada da tela; não depende de JS). */
const titulo: { t: string; italico?: boolean }[] = [
  { t: 'Próteses' },
  { t: 'com' },
  { t: 'precisão', italico: true },
  { t: 'e' },
  { t: 'acabamento' },
  { t: 'de' },
  { t: 'ateliê.' },
]

export function Hero() {

  return (
    <section
      id="topo"
      aria-labelledby="titulo-hero"
      className="relative overflow-hidden pt-[calc(var(--faixa)+6.5rem)] pb-16 sm:pb-20 lg:pt-[calc(var(--faixa)+8rem)] lg:pb-28"
    >
      {/* arco fino, eco do círculo da logo */}
      <svg
        className="pointer-events-none absolute -top-40 -right-56 hidden h-[820px] w-[820px] text-petroleo-700/10 lg:block"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="49.5" fill="none" stroke="currentColor" strokeWidth=".15" />
        <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth=".1" strokeDasharray=".4 1.2" />
      </svg>

      <div className="container-site grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="rotulo flex flex-wrap items-center gap-x-3 gap-y-1 text-petroleo-600">
            <span>Laboratório de prótese dentária</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-pessego" />
            <span>São João da Boa Vista</span>
          </p>

          <h1
            id="titulo-hero"
            className="mt-6 text-[2.75rem] leading-[1.02] font-light text-petroleo-900 sm:text-[4rem] lg:text-[5.25rem] xl:text-[5.75rem]"
          >
            {titulo.map((p, i) => (
              <span key={i}>
                <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <span
                    className={`revelar inline-block ${p.italico ? 'font-normal text-petroleo-700 italic' : ''}`}
                    style={{ animationDelay: `${60 + i * 45}ms` }}
                  >
                    {p.t}
                  </span>
                </span>
                {i < titulo.length - 1 && ' '}
              </span>
            ))}
          </h1>

          <div className="surgir">
            <p className="mt-7 max-w-[34rem] text-[1.125rem] leading-relaxed text-cinza sm:text-[1.1875rem]">
              O parceiro técnico do cirurgião-dentista, com atenção a cada caso e comunicação clara.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Botao href={whatsappLink()} externoLink icone={<IconWhatsApp size={18} />}>
                Falar com o laboratório
              </Botao>
              <Botao
                href="#trabalhos"
                variante="secundario"
                icone={<IconSeta size={17} className="order-last transition-transform duration-300 group-hover:translate-x-0.5" />}
              >
                Ver os trabalhos
              </Botao>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[460px] lg:col-span-5 lg:max-w-none">
          <figure className="registro relative ml-auto w-[88%] lg:w-[86%]">
            <div className="aspect-[4/5] overflow-hidden bg-papel">
              <Foto
                nome="enceramento-diagnostico"
                alt="Enceramento diagnóstico em cera cinza nos dentes anteriores, sobre modelo de gesso."
                tamanho={[1080, 1080]}
                sizes="(min-width: 1024px) 40vw, 80vw"
                prioridade
                className="h-full w-full scale-[1.12] object-cover object-[50%_40%]"
              />
            </div>
            <figcaption className="mt-3 flex items-baseline justify-between gap-4 text-[0.75rem] text-cinza">
              <span>
                <span className="rotulo mr-2 text-petroleo-600">Fig. 01</span>Enceramento diagnóstico sobre modelo
              </span>
            </figcaption>
          </figure>

          <figure className="surgir absolute bottom-10 left-0 w-[40%] max-w-[190px] border-[6px] border-marfim bg-marfim shadow-[0_24px_50px_-28px_rgb(15_51_53/0.55)]">
            <div className="aspect-square overflow-hidden">
              <Foto
                nome="metaloceramica-ponte"
                alt="Prótese fixa metalocerâmica sobre modelo de gesso."
                tamanho={[1080, 1080]}
                sizes="190px"
                className="h-full w-full scale-[1.35] object-cover object-[45%_45%]"
              />
            </div>
            <figcaption className="rotulo bg-marfim px-1 pt-2 pb-0.5 text-[0.6875rem] tracking-[0.14em] text-cinza">
              Fig. 02 · Metalocerâmica
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
