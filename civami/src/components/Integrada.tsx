import { useRef, type ReactNode } from 'react'
import { trecho, useProgressoRolagem } from '../lib/rolagem'
import { Revelar, TituloSecao } from './ui/Primitivos'

/*
 * Momento de assinatura: duas formas orgânicas (Odontologia e Medicina) que se
 * aproximam ao rolar e se encaixam em um coração. Compartilham a mesma costura
 * em "S", por isso o encaixe é exato. Não é o logo: é uma forma sólida e simples.
 */
const LOBO_ESQ = 'M100 46C90 22 66 8 42 12 16 17 2 42 6 70c4 32 38 62 94 100-12-40 12-90 0-124Z'
const LOBO_DIR = 'M100 46C110 22 134 8 158 12c26 5 40 30 36 58-4 32-38 62-94 100-12-40 12-90 0-124Z'
const COSTURA = 'M100 46c12 34-12 84 0 124'

function Lobo({ lado }: { lado: 'esq' | 'dir' }) {
  const id = `grad-${lado}`
  return (
    <svg viewBox="0 0 200 180" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
      <defs>
        {lado === 'esq' ? (
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2b6676" />
            <stop offset="1" stopColor="#154352" />
          </linearGradient>
        ) : (
          <linearGradient id={id} x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7fb2a3" />
            <stop offset="1" stopColor="#2a736a" />
          </linearGradient>
        )}
      </defs>
      <path d={lado === 'esq' ? LOBO_ESQ : LOBO_DIR} fill={`url(#${id})`} stroke="#f7f3ec" strokeWidth="1.6" />
      <path
        d={lado === 'esq' ? LOBO_ESQ : LOBO_DIR}
        fill="none"
        stroke="#f7f3ec"
        strokeOpacity="0.28"
        strokeWidth="0.8"
        transform={lado === 'esq' ? 'translate(16 16) scale(0.84)' : 'translate(16 16) scale(0.84)'}
      />
    </svg>
  )
}

function Coluna({ numero, titulo, children, alinhamento }: { numero: string; titulo: string; children: ReactNode; alinhamento: 'esq' | 'dir' }) {
  return (
    <div className={alinhamento === 'dir' ? 'lg:text-right' : ''}>
      <p className="text-xs font-bold tracking-[0.22em] text-areia-escura">{numero}</p>
      <h3 className="mt-3 text-[1.9rem] sm:text-4xl">{titulo}</h3>
      <div className={`filete mt-4 w-24 ${alinhamento === 'dir' ? 'lg:ml-auto lg:rotate-180' : ''}`} />
      <p className="mt-4 max-w-xs text-[1rem] text-suave lg:max-w-[17rem] lg:text-[1.05rem] lg:inline-block">{children}</p>
    </div>
  )
}

function Palco() {
  return (
    <div className="relative mx-auto w-[min(70vw,24rem)] lg:w-[min(32vw,27rem)]">
      <div className="relative aspect-[200/180]">
        <div className="lobo lobo-esq absolute inset-0">
          <Lobo lado="esq" />
        </div>
        <div className="lobo lobo-dir absolute inset-0">
          <Lobo lado="dir" />
        </div>
        <svg viewBox="0 0 200 180" className="costura absolute inset-0 h-full w-full" aria-hidden>
          <path d={COSTURA} fill="none" stroke="#f7f3ec" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
        <div
          aria-hidden
          className="rotulos pointer-events-none absolute inset-x-0 -bottom-10 flex justify-between text-[0.7rem] font-bold uppercase tracking-[0.22em] text-suave"
        >
          <span>Odontologia</span>
          <span>Medicina</span>
        </div>
      </div>
      <p className="legenda mt-8 text-center font-display text-[1.6rem] italic text-tinta sm:text-3xl">
        <span className="mb-1 block font-sans text-[0.68rem] font-bold not-italic uppercase tracking-[0.24em] text-azul">
          Odontologia + Medicina
        </span>
        <span>um só cuidado</span>
      </p>
    </div>
  )
}

const suave = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export function Integrada() {
  const cenaRef = useRef<HTMLDivElement>(null)

  useProgressoRolagem(cenaRef, (p) => {
    const el = cenaRef.current
    if (!el) return
    const j = suave(trecho(p, 0.06, 0.6))
    el.style.setProperty('--j', j.toFixed(4))
    el.style.setProperty('--r', (1 - trecho(p, 0.28, 0.5)).toFixed(3))
    el.style.setProperty('--l', trecho(p, 0.6, 0.78).toFixed(3))
    const c = p < 0.7 ? trecho(p, 0.56, 0.7) : 1 - 0.65 * trecho(p, 0.7, 0.9)
    el.style.setProperty('--c', c.toFixed(3))
  })

  return (
    <section id="clinica" aria-labelledby="titulo-clinica" className="relative bg-papel pt-24 lg:pt-36">
      <div className="container-site">
        <TituloSecao
          id="titulo-clinica"
          eyebrow="A clínica"
          apoio="A CIVAMI nasceu do encontro entre a odontologia e a medicina. As duas áreas dividem o mesmo endereço e a mesma forma de receber: com tempo para ouvir e cuidado em explicar."
        >
          Dois cuidados, <em className="destaque">um só</em> cuidado.
        </TituloSecao>
      </div>

      {/* Cena com rolagem: alta no desktop e no celular, estática com movimento reduzido */}
      <div ref={cenaRef} className="cena h-[230vh] lg:h-[260vh]">
        <div className="cena-fixa sticky top-0 flex h-[100svh] items-center overflow-hidden">
          <div className="container-site grid w-full items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-14">
            <div className="order-2 grid grid-cols-2 gap-6 lg:contents">
              <div className="lg:order-1">
                <Coluna numero="01" titulo="Odontologia" alinhamento="esq">
                  Cuidado com a saúde bucal, da primeira avaliação às orientações para o dia a dia.
                </Coluna>
              </div>
              <div className="text-right lg:order-3">
                <Coluna numero="02" titulo="Medicina" alinhamento="dir">
                  Consultas e acompanhamento da saúde, com escuta atenta e explicações claras.
                </Coluna>
              </div>
            </div>
            <div className="order-1 pb-6 lg:order-2 lg:pb-0">
              <Palco />
            </div>
          </div>
        </div>
      </div>

      <div className="container-site pb-24 lg:pb-36">
        <div className="grid gap-10 border-t border-tinta/10 pt-12 md:grid-cols-2 lg:gap-20">
          <Revelar>
            <p className="font-display text-2xl leading-snug text-tinta sm:text-[1.9rem]">
              Saúde bucal e saúde geral fazem parte da mesma pessoa. Por isso, aqui as duas são acolhidas sob o
              mesmo teto.
            </p>
          </Revelar>
          <Revelar atraso={0.1} className="space-y-5 text-suave">
            <p>
              Na CIVAMI, odontologia e medicina atendem no mesmo endereço. Quando faz sentido para o seu caso,
              as duas áreas podem conversar entre si sobre o seu cuidado.
            </p>
            <p>
              Toda indicação parte de uma avaliação individual, feita com calma, em um ambiente pensado para
              que você se sinta à vontade para perguntar.
            </p>
          </Revelar>
        </div>
      </div>
    </section>
  )
}
