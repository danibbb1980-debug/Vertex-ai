import type { PointerEvent } from 'react'
import { CONFIG, linkWhatsApp, type Atendimento } from '../config'
import { CabecalhoSecao, ComConfirmar, IconeSeta, IconeWhatsApp, SeloConfirmar } from '../components/base'

/** Luz suave que acompanha o ponteiro (movida por transform, sem repintar o cartão). */
function moverLuz(e: PointerEvent<HTMLElement>) {
  if (e.pointerType !== 'mouse') return
  const alvo = e.currentTarget
  const luz = alvo.querySelector<HTMLElement>('.cartao-luz')
  if (!luz) return
  const r = alvo.getBoundingClientRect()
  luz.style.transform = `translate3d(${e.clientX - r.left}px, ${e.clientY - r.top}px, 0)`
}

function Cartao({ a, i }: { a: Atendimento; i: number }) {
  const resto = a.titulo.slice(a.destaque.length)
  return (
    <article
      id={`atendimento-${a.id}`}
      onPointerMove={moverLuz}
      className="cartao revela group relative isolate flex flex-col overflow-hidden rounded-2xl border border-linho bg-white/60 p-7 transition-[border-color] duration-500 hover:border-ouro/50 sm:p-9"
      style={{ ['--d' as string]: `${(i % 2) * 0.1}s` }}
    >
      <span aria-hidden="true" className="cartao-luz -z-10" />
      <div className="flex items-start justify-between gap-6">
        <span className="rotulo text-ouro">{String(i + 1).padStart(2, '0')}</span>
        <span aria-hidden="true" className="h-px flex-1 translate-y-2 bg-linho" />
      </div>
      <h3 className="mt-8 text-[2rem] leading-[1.08] text-tinta sm:text-[2.35rem]">
        <em>{a.destaque}</em>
        {resto}
      </h3>
      <p className="mt-3 font-medium text-tinta">{a.resumo}</p>
      <p className="mt-4 leading-relaxed text-tinta-suave">{a.texto}</p>
      <p className="mt-5 text-sm italic text-tinta-suave">A indicação depende de avaliação individual.</p>
      <div className="mt-auto pt-8">
        <a
          href={linkWhatsApp(a.mensagemWhatsApp)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center gap-3 border-b border-tinta/25 pb-1 text-[0.9375rem] font-semibold text-tinta transition-colors hover:border-tinta"
        >
          <IconeWhatsApp tamanho={18} className="text-ouro" />
          Conversar sobre este atendimento
          <span className="sr-only">: {a.titulo}</span>
          <IconeSeta tamanho={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>
    </article>
  )
}

export function Atendimentos() {
  return (
    <section id="atendimentos" aria-labelledby="titulo-atendimentos" className="bg-sand py-24 sm:py-32">
      <div className="container-vc">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <CabecalhoSecao
            id="titulo-atendimentos"
            rotulo="Atendimentos"
            titulo={
              <>
                Cada caso, um <em>plano</em> próprio.
              </>
            }
            intro="Implantes, próteses e reabilitação oral, sempre a partir de um diagnóstico cuidadoso. Conheça cada atendimento de forma geral; o que é indicado para você, só a avaliação mostra."
            selo={<SeloConfirmar>Lista de atendimentos a confirmar</SeloConfirmar>}
          />
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:gap-6">
          {CONFIG.atendimentos.map((a, i) => (
            <Cartao key={a.id} a={a} i={i} />
          ))}
        </div>
        {CONFIG.rascunho && (
          <p className="mt-6 text-sm text-tinta-suave">
            {/* CONFIRMAR COM A CLÍNICA */}
            <ComConfirmar texto={CONFIG.atendimentosExtras} />
          </p>
        )}
      </div>
    </section>
  )
}

const PARA_QUEM = [
  {
    titulo: 'Quem perdeu um ou mais dentes',
    texto: 'Há caminhos diferentes para repor dentes perdidos. A avaliação mostra quais fazem sentido para o seu caso.',
    atendimento: 'implantes',
  },
  {
    titulo: 'Quem usa prótese e quer mais estabilidade ao mastigar',
    texto: 'Para algumas pessoas, próteses apoiadas sobre implantes são uma alternativa a considerar. Conversamos sobre isso com calma.',
    atendimento: 'protocolo',
  },
  {
    titulo: 'Quem precisa de um plano de reabilitação',
    texto: 'Quando vários pontos pedem cuidado, um plano em etapas ajuda a entender o que fazer, em que ordem e por quê.',
    atendimento: 'reabilitacao',
  },
]

export function ParaQuem() {
  return (
    <section aria-labelledby="titulo-para-quem" className="bg-ivory py-24 sm:py-32">
      <div className="container-vc">
        <CabecalhoSecao
          id="titulo-para-quem"
          rotulo="Para quem"
          titulo={
            <>
              Talvez você se <em>reconheça</em> aqui.
            </>
          }
        />
        <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-linho bg-linho lg:grid-cols-3">
          {PARA_QUEM.map((b, i) => {
            const at = CONFIG.atendimentos.find((a) => a.id === b.atendimento)
            return (
              <li key={b.titulo} className="revela flex flex-col bg-ivory p-7 sm:p-9" style={{ ['--d' as string]: `${i * 0.1}s` }}>
                <span aria-hidden="true" className="font-display text-5xl italic leading-none text-ouro">
                  {['i', 'ii', 'iii'][i]}
                </span>
                <h3 className="mt-6 text-[1.7rem] leading-tight text-tinta">{b.titulo}</h3>
                <p className="mt-4 leading-relaxed text-tinta-suave">{b.texto}</p>
                {at && (
                  <a
                    href={`#atendimento-${at.id}`}
                    className="link-sublinhado mt-auto inline-flex min-h-12 items-center gap-2 pt-6 text-sm font-semibold text-azul"
                  >
                    Ver: {at.titulo}
                    <IconeSeta tamanho={15} />
                  </a>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
