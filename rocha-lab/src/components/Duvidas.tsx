import { useId, useState, type ReactNode } from 'react'
import { whatsappLink } from '../lib/links'
import { CabecalhoSecao, IconMais, LinkSeta, Pendente } from './ui'

const perguntas: { p: string; r: ReactNode }[] = [
  {
    p: 'Como envio um caso?',
    r: (
      <>
        O primeiro passo é uma mensagem pelo WhatsApp. Na conversa, o laboratório orienta como enviar o material (moldagem
        ou modelo, ou arquivos de escaneamento) e a prescrição. A forma de retirada e entrega é combinada caso a caso.{' '}
        {/* CONFIRMAR COM O LABORATÓRIO */}
        <Pendente>Logística de retirada e entrega</Pendente>
      </>
    ),
  },
  {
    p: 'Quais tipos de trabalho o laboratório realiza?',
    r: (
      <>
        Coroas em cerômero, metalocerâmica, coroas em dissilicato de lítio (E.max), enceramento diagnóstico, prótese parcial
        removível, prótese total, protocolo sobre implantes, provisórios impressos sobre implantes e etapas de acabamento
        cerâmico, como estratificação e glaze. Para um caso específico, vale conversar antes.
      </>
    ),
  },
  {
    p: 'Como funcionam os prazos?',
    r: (
      <>
        Os prazos são combinados caso a caso, de acordo com o tipo de trabalho e as etapas envolvidas. Converse com o
        laboratório antes de marcar a prova com o paciente. {/* CONFIRMAR COM O LABORATÓRIO */}
        <Pendente>Prazos de referência</Pendente>
      </>
    ),
  },
  {
    p: 'Trabalham com fluxo digital?',
    r: (
      <>
        Sim, em casos selecionados: recebimento de escaneamento, planejamento digital e impressão. Os formatos aceitos e a
        forma de envio são combinados pelo WhatsApp. {/* CONFIRMAR COM O LABORATÓRIO */}
        <Pendente>Formatos e casos atendidos</Pendente>
      </>
    ),
  },
  {
    p: 'Atendem dentistas de outras cidades?',
    r: (
      <>
        {/* CONFIRMAR COM O LABORATÓRIO */}
        <Pendente>Informação a confirmar com o laboratório</Pendente> Envie uma mensagem com a sua cidade para saber como
        funciona o atendimento.
      </>
    ),
  },
  {
    p: 'O laboratório ajuda no planejamento do caso?',
    r: (
      <>
        O laboratório pode contribuir com informações técnicas e com o enceramento diagnóstico, que ajuda a visualizar o
        planejamento. A indicação clínica e as decisões de tratamento são sempre do cirurgião-dentista responsável pelo caso.
      </>
    ),
  },
]

function Item({ p, r, aberto, onToggle }: { p: string; r: ReactNode; aberto: boolean; onToggle: () => void }) {
  const id = useId()
  return (
    <li className="border-b border-linha">
      <h3 className="font-sans">
        <button
          type="button"
          id={`${id}-b`}
          aria-expanded={aberto}
          aria-controls={`${id}-r`}
          onClick={onToggle}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span
            className={`font-serif text-[1.25rem] leading-snug font-light transition-colors sm:text-[1.4375rem] ${
              aberto ? 'text-petroleo-700' : 'text-petroleo-900 group-hover:text-petroleo-700'
            }`}
          >
            {p}
          </span>
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-[transform,background-color,border-color,color] duration-500 ease-[var(--ease-atelie)] ${
              aberto ? 'rotate-45 border-petroleo-700 bg-petroleo-700 text-perola' : 'border-linha text-petroleo-700'
            }`}
            aria-hidden="true"
          >
            <IconMais size={16} />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-r`}
        role="region"
        aria-labelledby={`${id}-b`}
        className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-atelie)] ${
          aberto ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
        inert={!aberto}
      >
        <div className="overflow-hidden">
          <p className="max-w-2xl pr-12 pb-7 text-[1rem] leading-relaxed text-cinza">{r}</p>
        </div>
      </div>
    </li>
  )
}

export function Duvidas() {
  const [aberto, setAberto] = useState<number | null>(0)
  return (
    <section id="duvidas" aria-labelledby="titulo-duvidas" className="border-t border-linha py-24 sm:py-28 lg:py-36">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <CabecalhoSecao
            id="titulo-duvidas"
            numero="06"
            rotulo="Dúvidas frequentes"
            titulo={
              <>
                Antes de <em className="font-normal text-petroleo-700">enviar</em>.
              </>
            }
            texto="Perguntas comuns de dentistas que ainda não trabalharam com o laboratório."
          />
          <LinkSeta href={whatsappLink()} externoLink className="mt-6 text-petroleo-700">
            Outra dúvida? Pergunte pelo WhatsApp
          </LinkSeta>
        </div>
        <ul className="border-t border-linha lg:col-span-8">
          {perguntas.map((q, i) => (
            <Item key={q.p} p={q.p} r={q.r} aberto={aberto === i} onToggle={() => setAberto(aberto === i ? null : i)} />
          ))}
        </ul>
      </div>
    </section>
  )
}
