import { useEffect, useRef } from 'react'
import { CONFIG, mensagemAtendimento } from '../config'
import { BotaoWhats, Enfase } from './ui'
import { ItemAcordeao } from './Acordeao'

/** Numeração que "acende" (cinza -> terracota) quando entra na viewport. */
function useAcender() {
  const ref = useRef<HTMLOListElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.setAttribute('data-aceso', '')),
      { rootMargin: '0px 0px -30% 0px' },
    )
    el.querySelectorAll('[data-num]').forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])
  return ref
}

export function Atendimentos() {
  const ref = useAcender()
  const lista = CONFIG.atendimentos
  if (!lista.length) return null
  return (
    <section id="atendimentos" aria-labelledby="titulo-atendimentos" className="border-t border-fio bg-areia">
      <div className="mx-auto grid max-w-[1320px] grid-cols-12 gap-x-6 gap-y-12 px-5 py-24 sm:px-8 lg:py-36">
        <div className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-36">
            <p className="rotulo text-terracota-escuro">Atendimentos</p>
            <h2 id="titulo-atendimentos" className="mt-6 text-[clamp(2.4rem,5vw,3.9rem)] tracking-[-0.03em]">
              <Enfase texto="Cada atendimento começa por uma *conversa*." />
            </h2>
            <p className="mt-6 max-w-[34ch] text-grafite-2">
              Toque em um atendimento para ler mais. A indicação de cada um depende de avaliação individual.
            </p>
          </div>
        </div>
        <ol ref={ref} className="col-span-12 border-t border-grafite lg:col-span-8">
          {lista.map((a, i) => (
            <li key={a.nome}>
              <ItemAcordeao
                classeBotao="min-h-[6.5rem] py-6 lg:min-h-[8.5rem]"
                cabecalho={
                  <span className="flex items-baseline gap-5 sm:gap-9">
                    <span
                      data-num
                      className="num font-display text-[1.05rem] text-grafite-2 transition-colors duration-700 data-[aceso]:text-terracota-escuro sm:text-[1.25rem]"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display text-[clamp(2rem,5.2vw,4.4rem)] leading-[1] tracking-[-0.03em] transition-colors group-hover:text-terracota-escuro">
                      {a.nome}
                    </span>
                  </span>
                }
                classeConteudo="grid gap-6 pb-10 pl-[2.6rem] sm:grid-cols-[1fr_auto] sm:items-end sm:pl-[3.9rem]"
              >
                <div className="max-w-[46ch] space-y-3">
                  <p className="text-[1.0625rem]">{a.descricao}</p>
                  <p className="text-[0.95rem] text-grafite-2">A indicação depende de avaliação individual.</p>
                </div>
                <BotaoWhats mensagem={mensagemAtendimento(a)} rotuloAcessivel={`Agendar ${a.nome}`}>
                  Agendar {a.nome.toLowerCase()}
                </BotaoWhats>
              </ItemAcordeao>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
