import { useId, useState } from 'react'
import { CONFIG } from '../config'
import { Rotulo } from '../components/Comum'
import { IconeMais } from '../components/Icones'
import { enderecoLinha1, horariosResumidos, temWhatsApp } from '../lib/dados'

function perguntas(): { p: string; r: string }[] {
  const e = CONFIG.endereco
  const horarios = horariosResumidos()
    .map((h) => `${h.rotulo.toLowerCase()}, ${h.texto.toLowerCase()}`)
    .join('; ')
  const nomes = CONFIG.atendimentos.map((a) => a.titulo.toLowerCase())
  const listaNomes = nomes.length > 1 ? `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}` : nomes[0]
  const lista: ({ p: string; r: string } | false)[] = [
    {
      p: 'Preciso agendar?',
      r: 'Sim. O atendimento é com hora marcada. Você pode solicitar um horário pelo WhatsApp ou pelo formulário deste site.',
    },
    nomes.length > 0 && {
      p: 'Quais atendimentos há?',
      r: `Há atendimentos de ${listaNomes}. Em todos eles, a indicação depende de avaliação médica individual.`,
    },
    horarios.length > 0 && {
      p: 'Quais são os horários?',
      r: `${horarios.charAt(0).toUpperCase() + horarios.slice(1)}. ${CONFIG.avisoFeriados}`,
    },
    Boolean(e.rua) && {
      p: 'Onde fica?',
      r: `${enderecoLinha1()}, bairro ${e.bairro}, em ${e.cidade} - ${e.uf}.${e.referencia ? ` ${e.referencia}.` : ''}`,
    },
    temWhatsApp && {
      p: 'Como solicitar um horário?',
      r: 'Preencha o formulário de solicitação ou envie uma mensagem pelo WhatsApp. A equipe responde informando os horários disponíveis.',
    },
    temWhatsApp && {
      p: 'O horário escolhido no formulário já fica reservado?',
      r: 'Não. O dia e o horário escolhidos são uma preferência. O agendamento só vale depois que a equipe responder com a disponibilidade.',
    },
    {
      p: 'O que levar na consulta?',
      r: 'Um documento com foto e, se tiver, exames, receitas e relatórios de consultas anteriores. Também vale anotar alergias e medicamentos em uso.',
    },
    {
      p: 'Como sei qual atendimento é indicado para mim?',
      r: 'A indicação é feita pela médica depois da avaliação na consulta. Por isso, este site não traz recomendações individuais.',
    },
    temWhatsApp && {
      p: 'Posso tirar dúvidas antes pelo WhatsApp?',
      r: 'Sim, para dúvidas sobre agendamento, horários e endereço. Questões de saúde são tratadas na consulta, com a avaliação médica.',
    },
    {
      p: 'Posso enviar fotos da pele antes da consulta?',
      r: 'Pedimos que não. Fotos e informações de saúde são tratadas na consulta, com calma e com a avaliação adequada.',
    },
  ]
  return lista.filter(Boolean) as { p: string; r: string }[]
}

/**
 * Acordeão adaptado do "FAQ smooth" (21st.dev, @hari7261): mantém a transição por
 * grid-template-rows (sem medir altura em JS) e ganha cores da marca, aria-expanded/aria-controls
 * e região rotulada para leitores de tela.
 */
export function Duvidas() {
  const itens = perguntas()
  const [aberto, setAberto] = useState<number | null>(0)
  const base = useId()
  return (
    <section id="duvidas" className="secao bg-rose-200/60" aria-labelledby="titulo-duvidas">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4" data-revelar>
          <div className="lg:sticky lg:top-36">
            <Rotulo className="mb-6">Dúvidas frequentes</Rotulo>
            <h2 id="titulo-duvidas" className="titulo-secao">
              Perguntas <em>comuns</em>, respostas diretas.
            </h2>
          </div>
        </div>
        <div className="space-y-3 lg:col-span-8" data-revelar>
          {itens.map((item, i) => {
            const estaAberto = aberto === i
            const idBotao = `${base}-b${i}`
            const idPainel = `${base}-p${i}`
            return (
              <div key={item.p} className={`rounded-2xl border bg-pedra-50 transition-[border-color,box-shadow] duration-300 ${estaAberto ? 'border-lilas shadow-leve' : 'border-filete'}`}>
                <h3 className="!font-sans !text-base !tracking-normal">
                  <button
                    id={idBotao}
                    type="button"
                    aria-expanded={estaAberto}
                    aria-controls={idPainel}
                    onClick={() => setAberto(estaAberto ? null : i)}
                    className="flex min-h-16 w-full items-center justify-between gap-5 rounded-2xl px-5 py-4 text-left sm:px-7"
                  >
                    <span className="font-serif text-[1.2rem] leading-snug text-vinho sm:text-[1.35rem]">{item.p}</span>
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-[background-color,transform] duration-500 ease-[var(--ease-suave)] ${estaAberto ? 'rotate-45 bg-vinho text-pedra' : 'bg-rose/70 text-vinho'}`}>
                      <IconeMais width={18} height={18} />
                    </span>
                  </button>
                </h3>
                <div
                  id={idPainel}
                  role="region"
                  aria-labelledby={idBotao}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-suave)] motion-reduce:transition-none ${estaAberto ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                  inert={!estaAberto}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-6 text-tinta-suave sm:px-7">{item.r}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
