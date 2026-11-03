import type { ReactNode } from 'react'
import { CONFIG } from '../config'
import { linkWhatsapp } from '../lib/whatsapp'
import { CabecalhoSecao } from '../components/CabecalhoSecao'
import { CartaoLuz } from '../components/CartaoLuz'
import { Revelar } from '../components/Revelar'
import { IconeCalendario, IconeEscova, IconeFolha, IconeLupa, IconePasta, IconeSetaDiagonal } from '../components/Icones'

const BLOCOS: { icone: ReactNode; titulo: string; texto: string }[] = [
  {
    icone: <IconeCalendario tamanho={26} />,
    titulo: 'Por que ir ao dentista periodicamente',
    texto:
      'Muitas alterações na boca começam de forma silenciosa, sem sinais evidentes. Consultas regulares permitem observar mudanças ao longo do tempo e conversar sobre cuidados antes que algo incomode. A frequência é definida pelo dentista, caso a caso.',
  },
  {
    icone: <IconeEscova tamanho={26} />,
    titulo: 'Higiene diária',
    texto:
      'Escovação cuidadosa, fio dental e atenção à língua fazem parte da rotina. A técnica, o tipo de escova e os produtos mais adequados variam de pessoa para pessoa e podem ser revistos na consulta.',
  },
  {
    icone: <IconeLupa tamanho={26} />,
    titulo: 'O que observar nos dentes e na gengiva',
    texto:
      'Sangramento ao escovar, sensibilidade, manchas, mau hálito persistente, feridas que demoram a cicatrizar ou mudanças na mordida são sinais para comentar com o dentista. Observar não é diagnosticar: é o começo de uma boa conversa.',
  },
  {
    icone: <IconeFolha tamanho={26} />,
    titulo: 'Alimentação e saúde bucal',
    texto:
      'A frequência com que consumimos açúcar e bebidas ácidas pesa tanto quanto a quantidade. Beber água ao longo do dia e manter refeições em horários regulares ajudam a rotina de cuidado.',
  },
  {
    icone: <IconePasta tamanho={26} />,
    titulo: 'O que levar na primeira consulta',
    texto:
      'Um documento com foto, a lista dos medicamentos que você usa e, se tiver, exames ou radiografias anteriores. Anote também suas dúvidas: a consulta é o momento de perguntar.',
  },
]

function Nota() {
  return (
    <p className="mt-6 flex items-center gap-2 border-t border-linha pt-4 text-[0.82rem] text-tinta-suave">
      <span aria-hidden="true" className="inline-block size-1.5 rounded-full bg-areia-texto" />A orientação depende de avaliação individual.
    </p>
  )
}

export function Prevencao() {
  const atendimentos = CONFIG.atendimentos.filter((a) => a.nome)
  return (
    <section id="prevencao" aria-labelledby="titulo-prevencao" className="sobre-claro relative bg-perola py-24 lg:py-36">
      <div aria-hidden="true" className="grade-calendario-clara pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_40%)]" />
      <div className="container-site relative">
        <CabecalhoSecao id="titulo-prevencao" rotulo="Prevenção" titulo="Prevenção é *rotina*, não exceção.">
          <p>
            Informação faz parte do cuidado. Reunimos orientações gerais para o dia a dia. Elas não substituem a consulta: cada
            boca tem sua história.
          </p>
        </CabecalhoSecao>

        <ul className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {BLOCOS.map((b, i) => (
            <Revelar
              key={b.titulo}
              como="li"
              atraso={(i % 3) * 0.08}
              className={i < 2 ? 'lg:col-span-3' : 'lg:col-span-2'}
            >
              <CartaoLuz como="div" className="flex h-full flex-col p-7 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full border border-menta-texto/25 text-menta-texto">{b.icone}</span>
                  <span className="font-display text-5xl font-light leading-none text-perola transition-colors duration-500 group-hover:text-menta-suave" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-7 text-[1.45rem] text-tinta">{b.titulo}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-tinta-suave">{b.texto}</p>
                <Nota />
              </CartaoLuz>
            </Revelar>
          ))}
          <Revelar como="li" atraso={0.16} className="md:col-span-2 lg:col-span-6">
            <div className="flex flex-col items-start justify-between gap-6 rounded-[1.75rem] bg-grafite-900 p-7 text-white sm:flex-row sm:items-center sm:p-9">
              <p className="max-w-xl font-display text-2xl font-light leading-snug">
                Quer saber qual rotina faz sentido <span className="enfase">para você?</span>
              </p>
              <a
                href={linkWhatsapp()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-menta px-6 font-display font-medium text-grafite-950 transition-colors hover:bg-menta-claro"
              >
                Agendar uma avaliação
                <IconeSetaDiagonal tamanho={18} />
              </a>
            </div>
          </Revelar>
        </ul>

        {atendimentos.length > 0 && (
          <div className="mt-24">
            <h3 className="text-3xl text-tinta sm:text-4xl">
              <span className="enfase">Atendimentos</span>
            </h3>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {atendimentos.map((a, i) => (
                <Revelar key={a.nome} como="li" atraso={(i % 3) * 0.06}>
                  <CartaoLuz como="div" className="flex h-full flex-col p-7">
                    <h4 className="font-display text-xl font-medium text-tinta">{a.nome}</h4>
                    {a.descricao && <p className="mt-3 flex-1 leading-relaxed text-tinta-suave">{a.descricao}</p>}
                    <a
                      href={linkWhatsapp(`Olá! Vi o site da Odonto Prevent e gostaria de saber mais sobre ${a.nome}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex min-h-12 items-center gap-2 font-display font-medium text-menta-texto underline-offset-4 hover:underline"
                    >
                      Conversar pelo WhatsApp <IconeSetaDiagonal tamanho={16} />
                    </a>
                  </CartaoLuz>
                </Revelar>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
