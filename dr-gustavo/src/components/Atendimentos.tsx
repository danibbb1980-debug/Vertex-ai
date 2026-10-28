import { CONFIG } from '../config'
import { waAtendimento } from '../lib/links'
import { Confirmar } from './Confirmar'
import { IconArrow, IconWhatsApp } from './Icons'
import { SectionHead } from './SectionHead'
import { StackingCardItem, StackingCards } from './StackingCards'

function Titulo({ titulo, destaque }: { titulo: string; destaque?: string }) {
  if (!destaque || !titulo.includes(destaque)) return <>{titulo}</>
  const [a, b] = titulo.split(destaque)
  return (
    <>
      {a}
      <em>{destaque}</em>
      {b}
    </>
  )
}

export function Atendimentos() {
  const lista = CONFIG.atendimentos.filter((a) => a.mostrar)
  const total = String(lista.length).padStart(2, '0')
  return (
    <section id="atendimentos" aria-labelledby="atendimentos-titulo" className="py-24 md:py-36">
      <div className="shell grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--banner-h)+var(--header-h)+2rem)]">
            <SectionHead
              id="atendimentos-titulo"
              eyebrow="Atendimentos"
              title="O que é feito no *consultório*."
              intro={
                <>
                  <p>
                    Uma visão geral de cada atendimento, para você chegar à consulta já sabendo o que perguntar.
                  </p>
                  <p className="mt-4 text-[0.95rem] text-mute">
                    Conteúdo informativo. A indicação de cada tratamento depende de avaliação individual.
                  </p>
                </>
              }
            />
          </div>
        </div>

        <StackingCards totalCards={lista.length} className="min-w-0 lg:col-span-8 lg:col-start-5">
          {lista.map((a, i) => (
            <StackingCardItem key={a.id} index={i} className="pb-6 last:pb-0">
              <article
                id={`atendimento-${a.id}`}
                aria-labelledby={`at-${a.id}`}
                className="card relative overflow-hidden p-7 shadow-[0_-12px_30px_-24px_rgba(28,27,25,0.35)] md:p-12"
              >
                <div className="relative">
                  <p className="num text-mute">
                    {String(i + 1).padStart(2, '0')} / {total}
                  </p>
                  <h3 id={`at-${a.id}`} className="mt-6 max-w-[22ch] text-[clamp(1.8rem,1.3rem+2vw,2.75rem)] [&_em]:font-[330] [&_em]:text-accent">
                    {a.confirmar ? (
                      <Confirmar>
                        <Titulo titulo={a.titulo} destaque={a.destaque} />
                      </Confirmar>
                    ) : (
                      <Titulo titulo={a.titulo} destaque={a.destaque} />
                    )}
                  </h3>
                  <p className="mt-5 max-w-[46ch] text-[1.02rem] leading-relaxed text-ink-2">{a.resumo}</p>
                  <ul className="mt-6 space-y-2 text-[0.95rem] text-ink-2">
                    {a.pontos.map((p) => (
                      <li key={p} className="flex gap-3">
                        <span aria-hidden="true" className="mt-[0.8em] h-px w-4 shrink-0 bg-accent" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-mute">Depende de avaliação individual.</p>
                    <a href={waAtendimento(a.mensagem)} target="_blank" rel="noopener" className="btn btn-ink !min-h-12 w-full sm:w-auto">
                      <IconWhatsApp size={18} />
                      Conversar sobre este atendimento
                      <span className="sr-only"> ({a.titulo})</span>
                      <IconArrow size={16} />
                    </a>
                  </div>
                </div>
              </article>
            </StackingCardItem>
          ))}
        </StackingCards>
      </div>
    </section>
  )
}
