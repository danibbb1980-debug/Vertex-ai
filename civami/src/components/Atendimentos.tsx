import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { useProgressoRolagem } from '../lib/rolagem'
import { ATENDIMENTOS_EXEMPLO, CONFIG, type Area, type Atendimento } from '../config'
import { waLink } from '../lib/whatsapp'
import { Placeholder, Revelar, TituloSecao } from './ui/Primitivos'
import { IconeFamilia, IconePessoa, IconeSetaDiagonal, IconeUniao, IconeWhatsApp } from './ui/Icones'

const AREAS: { id: Area; rotulo: string; resumo: string }[] = [
  {
    id: 'odontologia',
    rotulo: 'Odontologia',
    resumo: 'Atendimentos voltados à saúde bucal, sempre a partir de uma avaliação.',
  },
  {
    id: 'medicina',
    rotulo: 'Medicina',
    resumo: 'Consultas e acompanhamento da saúde, com explicações claras a cada etapa.',
  },
]

/** Cartão com luz que acompanha o cursor (padrão "Spotlight Card" do 21st.dev, refeito em CSS). */
function CartaoAtendimento({ item, area, indice }: { item: Atendimento; area: string; indice: number }) {
  const luz = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <Revelar as="li" atraso={indice * 0.06} className="h-full">
      <article
        onPointerMove={luz}
        className="cartao-luz group flex h-full flex-col rounded-[var(--radius-suave)] border border-tinta/10 bg-papel p-7 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-verde/40 sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <span className="font-display text-[0.95rem] italic text-areia-escura">
            {String(indice + 1).padStart(2, '0')}
          </span>
          {item.exemplo && <Placeholder />}
        </div>
        <h3 className="mt-6 text-[1.65rem] leading-tight sm:text-[1.8rem]">{item.titulo}</h3>
        <p className="mt-4 flex-1 text-[0.98rem] text-suave">{item.descricao}</p>
        <p className="mt-5 border-t border-tinta/10 pt-4 text-[0.82rem] text-suave">
          A indicação depende de avaliação individual.
        </p>
        <a
          href={waLink(CONFIG.mensagens.atendimento(item.titulo.replace(/[[\]]/g, ''), area))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex min-h-12 items-center gap-2 self-start rounded-full text-[0.92rem] font-semibold text-azul underline-offset-4 hover:underline"
        >
          Conversar sobre este atendimento
          <IconeSetaDiagonal width={16} height={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          <span className="sr-only">: {item.titulo}, pelo WhatsApp</span>
        </a>
      </article>
    </Revelar>
  )
}

export function Atendimentos() {
  const [ativa, setAtiva] = useState<Area>('odontologia')
  const abasRef = useRef<(HTMLButtonElement | null)[]>([])
  const lista = CONFIG.atendimentos.length ? CONFIG.atendimentos : ATENDIMENTOS_EXEMPLO
  const indiceAtivo = AREAS.findIndex((a) => a.id === ativa)

  const teclado = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') return
    e.preventDefault()
    const prox =
      e.key === 'Home' ? 0 : e.key === 'End' ? AREAS.length - 1 : (indiceAtivo + (e.key === 'ArrowRight' ? 1 : -1) + AREAS.length) % AREAS.length
    setAtiva(AREAS[prox].id)
    abasRef.current[prox]?.focus()
  }

  return (
    <section id="atendimentos" aria-labelledby="titulo-atendimentos" className="py-24 lg:py-36">
      <div className="container-site">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <TituloSecao
            id="titulo-atendimentos"
            eyebrow="Atendimentos"
            apoio={
              CONFIG.atendimentos.length
                ? 'Cada atendimento começa por uma avaliação individual, com explicações claras sobre o que faz sentido para você.'
                : 'Os atendimentos abaixo são exemplos de estrutura e serão substituídos pela lista oficial da clínica.'
            }
          >
            Duas áreas, <em className="destaque">uma</em> conversa.
          </TituloSecao>

          {/* Abas com indicador deslizante (padrão "Animated Tabs" do 21st.dev, só transform) */}
          <div
            role="tablist"
            aria-label="Áreas de atendimento"
            className="relative grid w-full shrink-0 grid-cols-2 rounded-full border border-tinta/15 bg-papel p-1.5 sm:w-[24rem]"
            onKeyDown={teclado}
          >
            <span
              aria-hidden
              className="absolute inset-y-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-full bg-tinta transition-transform duration-500 ease-[var(--ease-calmo)]"
              style={{ transform: `translateX(${indiceAtivo * 100}%)` }}
            />
            {AREAS.map((a, i) => (
              <button
                key={a.id}
                ref={(el) => {
                  abasRef.current[i] = el
                }}
                role="tab"
                type="button"
                id={`aba-${a.id}`}
                aria-selected={ativa === a.id}
                aria-controls={`painel-${a.id}`}
                tabIndex={ativa === a.id ? 0 : -1}
                onClick={() => setAtiva(a.id)}
                className={`relative z-10 min-h-12 rounded-full px-5 text-[0.95rem] font-semibold transition-colors duration-300 ${
                  ativa === a.id ? 'text-marfim' : 'text-tinta/75 hover:text-tinta'
                }`}
              >
                {a.rotulo}
              </button>
            ))}
          </div>
        </div>

        {AREAS.map((a) => (
          <div
            key={a.id}
            role="tabpanel"
            id={`painel-${a.id}`}
            aria-labelledby={`aba-${a.id}`}
            hidden={ativa !== a.id}
            className="mt-14"
          >
            <p className="mb-8 flex items-center gap-3 text-suave">
              <span aria-hidden className="h-2 w-2 rounded-full bg-verde" />
              {a.resumo}
            </p>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {lista
                .filter((i) => i.area === a.id)
                .map((item, i) => (
                  <CartaoAtendimento key={item.titulo} item={item} area={a.rotulo} indice={i} />
                ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

export function ParaQuem() {
  const blocos = [
    {
      Icone: IconeFamilia,
      titulo: 'Famílias',
      texto: 'Para quem gosta de concentrar os cuidados da casa em um endereço conhecido e próximo.',
    },
    {
      Icone: IconePessoa,
      titulo: 'Adultos',
      texto: 'Para quem quer retomar consultas de rotina ou entender melhor uma queixa, sem pressa.',
    },
    {
      Icone: IconeUniao,
      titulo: 'Mais de uma área',
      texto: 'Para quem precisa cuidar da saúde bucal e da saúde geral e prefere fazer isso no mesmo lugar.',
    },
  ]
  return (
    <section aria-labelledby="titulo-para-quem" className="bg-nevoa/45 py-24 lg:py-32">
      <div className="container-site grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <TituloSecao id="titulo-para-quem" eyebrow="Para quem">
            Pensada para <em className="destaque">quem</em> você cuida.
          </TituloSecao>
          <Revelar atraso={0.1} className="mt-6 text-sm text-suave">
            Faixa etária atendida: <Placeholder />
          </Revelar>
        </div>
        <ul className="grid gap-px overflow-hidden rounded-[var(--radius-suave)] border border-tinta/10 bg-tinta/10 sm:grid-cols-3 lg:col-span-8">
          {blocos.map(({ Icone, titulo, texto }, i) => (
            <Revelar as="li" key={titulo} atraso={i * 0.08} className="bg-marfim p-8">
              <Icone width={28} height={28} className="text-verde" />
              <h3 className="mt-8 text-2xl">{titulo}</h3>
              <p className="mt-3 text-[0.98rem] text-suave">{texto}</p>
            </Revelar>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Linha do tempo com progresso ao rolar (padrão "Animated Progress Stepper" do 21st.dev, refeito). */
export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null)
  const linhaRef = useRef<HTMLSpanElement>(null)
  useProgressoRolagem(
    ref,
    (p) => {
      if (linhaRef.current) linhaRef.current.style.transform = `scaleY(${p.toFixed(4)})`
    },
    'lista',
  )

  const etapas = [
    {
      titulo: 'Conversa pelo WhatsApp',
      texto: 'Você conta o que procura e a equipe verifica os horários disponíveis. A consulta só fica marcada depois da confirmação da clínica.',
    },
    {
      titulo: 'Avaliação e escuta',
      texto: 'No primeiro encontro, o profissional ouve sua história, suas dúvidas e observa o que for necessário.',
    },
    {
      titulo: 'Orientação e planejamento',
      texto: 'Você recebe uma explicação clara do que foi visto e dos caminhos possíveis, com espaço para perguntar.',
    },
    {
      titulo: 'Acompanhamento',
      texto: 'Quando houver próximos passos, eles são combinados com você, no seu ritmo, com retornos quando indicados.',
    },
  ]

  return (
    <section id="como-funciona" aria-labelledby="titulo-como-funciona" className="py-24 lg:py-36">
      <div className="container-site grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-40">
            <TituloSecao
              id="titulo-como-funciona"
              eyebrow="Como funciona"
              apoio="Do primeiro contato ao acompanhamento, cada etapa é explicada antes de acontecer."
            >
              Um caminho <em className="destaque">simples</em>, do começo ao fim.
            </TituloSecao>
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
        <ol ref={ref} className="relative">
          <span aria-hidden className="absolute bottom-6 left-[1.4rem] top-6 w-px bg-tinta/10" />
          <span
            ref={linhaRef}
            aria-hidden
            className="absolute bottom-6 left-[1.4rem] top-6 w-px origin-top bg-verde transition-transform duration-300 ease-out"
            style={{ transform: 'scaleY(0)' }}
          />
          {etapas.map((e, i) => (
            <Revelar as="li" key={e.titulo} atraso={0.05} className="relative grid grid-cols-[2.8rem_1fr] gap-6 pb-14 last:pb-0">
              <span className="relative z-10 grid h-11 w-11 place-items-center rounded-full border border-tinta/15 bg-marfim font-display text-[1.05rem] italic text-azul">
                {i + 1}
              </span>
              <div className="pt-1.5">
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-areia-escura">Etapa {String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-2 text-[1.75rem] sm:text-3xl">{e.titulo}</h3>
                <p className="mt-3 max-w-md text-suave">{e.texto}</p>
              </div>
            </Revelar>
          ))}
        </ol>
          <div className="mt-12 pl-[4.3rem]">
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-tinta px-6 font-semibold text-marfim transition-colors hover:bg-azul"
            >
              <IconeWhatsApp width={18} height={18} />
              Começar pela conversa
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
