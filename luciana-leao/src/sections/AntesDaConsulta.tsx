import type { ReactNode } from 'react'
import { Rotulo } from '../components/Comum'
import { IconeAlerta, IconeCalendario, IconeConversa, IconeDocumento, IconeRelogio } from '../components/Icones'
import { temWhatsApp } from '../lib/dados'

const ITENS: { icone: ReactNode; titulo: string; texto: string; soComWhats?: boolean }[] = [
  { icone: <IconeCalendario />, titulo: 'Agendamento', texto: 'O atendimento é com hora marcada. O horário vale depois que a equipe responder com a disponibilidade.' },
  { icone: <IconeDocumento />, titulo: 'O que levar', texto: 'Documento com foto e, se tiver, exames, receitas e relatórios de consultas anteriores.' },
  { icone: <IconeAlerta />, titulo: 'Alergias e medicamentos', texto: 'Conte na consulta se você tem alergias e quais medicamentos usa, inclusive os de uso contínuo.' },
  { icone: <IconeRelogio />, titulo: 'Chegada', texto: 'Procure chegar com alguns minutos de antecedência.' },
  { icone: <IconeConversa />, titulo: 'Dúvidas', texto: 'Se tiver dúvidas sobre o agendamento, converse com a equipe pelo WhatsApp.', soComWhats: true },
]

export function AntesDaConsulta() {
  const itens = ITENS.filter((i) => !i.soComWhats || temWhatsApp)
  return (
    <section id="antes-da-consulta" className="secao" aria-labelledby="titulo-antes">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4" data-revelar>
          <div className="lg:sticky lg:top-36">
            <Rotulo className="mb-6">Antes da consulta</Rotulo>
            <h2 id="titulo-antes" className="titulo-secao">
              Para o dia da <em>consulta</em>.
            </h2>
            <p className="mt-6 text-lg text-tinta-suave">Algumas orientações gerais para o dia do atendimento.</p>
          </div>
        </div>
        <div className="lg:col-span-8">
          <ol className="divide-y divide-filete border-y border-filete">
            {itens.map((item, i) => (
              <li key={item.titulo} className="grid grid-cols-[auto_1fr] gap-5 py-7 sm:grid-cols-[3.5rem_auto_1fr] sm:items-start sm:gap-7" data-revelar style={{ '--atraso': `${i * 0.05}s` } as React.CSSProperties}>
                <span className="hidden font-serif text-lg italic text-lilas-texto sm:block">0{i + 1}</span>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose/70 text-vinho">{item.icone}</span>
                <div>
                  <h3 className="font-serif text-2xl">{item.titulo}</h3>
                  <p className="mt-2 text-tinta-suave">{item.texto}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 font-serif text-xl italic text-vinho" data-revelar>
            As orientações são dadas na consulta.
          </p>
        </div>
      </div>
    </section>
  )
}
