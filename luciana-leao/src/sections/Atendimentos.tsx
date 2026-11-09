import { CONFIG } from '../config'
import { OrquideaTraco } from '../brand/OrquideaTraco'
import { LinkWhatsApp, Rotulo } from '../components/Comum'
import { SpotlightCard } from '../components/SpotlightCard'
import { msgAtendimento } from '../lib/dados'

export function Atendimentos() {
  const lista = CONFIG.atendimentos
  if (!lista.length) return null
  return (
    <section id="atendimentos" className="secao relative bg-rose-200/60" aria-labelledby="titulo-atendimentos">
      <div className="container-site">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end" data-revelar>
          <div className="lg:col-span-7">
            <Rotulo className="mb-6">Atendimentos</Rotulo>
            <h2 id="titulo-atendimentos" className="titulo-secao">
              Dermatologia, estética e <em>laser</em>.
            </h2>
          </div>
          <p className="text-lg text-tinta-suave lg:col-span-5">
            Três frentes de atendimento, sempre a partir de uma avaliação médica. A indicação de cada uma depende dessa conversa.
          </p>
        </div>

        <ul className="mx-auto mt-14 grid max-w-2xl gap-5 lg:mt-20 lg:max-w-none lg:grid-cols-3 lg:gap-6">
          {lista.map((a, i) => (
            <li key={a.id} data-revelar style={{ '--atraso': `${i * 0.08}s` } as React.CSSProperties}>
              <SpotlightCard className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-filete bg-pedra-50 p-7 shadow-leve transition-[transform,box-shadow] duration-500 ease-[var(--ease-suave)] hover:-translate-y-1 hover:shadow-cartao sm:p-9">
                <div className="flex items-start justify-between">
                  <span className="font-serif text-sm italic text-lilas-texto">0{i + 1}</span>
                  <OrquideaTraco className="w-20 text-lilas transition-transform duration-700 group-hover:rotate-[-6deg] group-hover:scale-110" espessura={2.6} />
                </div>
                <h3 className="mt-8 text-[2.2rem]">{a.titulo}</h3>
                <p className="mt-4 font-medium text-tinta">{a.descricao}</p>
                <p className="mt-3 text-tinta-suave">{a.detalhe}</p>
                <p className="mt-6 border-t border-filete pt-5 text-[0.92rem] italic text-lilas-texto">A indicação depende de avaliação médica individual.</p>
                <div className="mt-auto pt-7">
                  <LinkWhatsApp mensagem={msgAtendimento(a.mensagem)} className="btn btn-secundario w-full" rotuloAcessivel={`Falar sobre ${a.titulo} pelo WhatsApp`}>
                    Falar sobre {a.titulo.toLowerCase()}
                  </LinkWhatsApp>
                </div>
              </SpotlightCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
