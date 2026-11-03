import type { ReactNode } from 'react'
import { CONFIG } from '../config'
import { CabecalhoSecao } from '../components/CabecalhoSecao'
import { CartaoLuz } from '../components/CartaoLuz'
import { Revelar } from '../components/Revelar'
import { IconeAcessivel, IconeCalendario, IconeLupa } from '../components/Icones'

export function Clinica() {
  const pilares = [
    CONFIG.estrutura.agendamento && {
      icone: <IconeCalendario tamanho={28} />,
      titulo: 'Hora marcada',
      texto: 'O atendimento funciona com agendamento. Você combina o horário com a clínica e organiza sua rotina.',
    },
    {
      icone: <IconeLupa tamanho={28} />,
      titulo: 'Avaliação individual',
      texto: 'Cada pessoa tem uma história. A orientação parte da sua avaliação, não de um roteiro pronto.',
    },
    (CONFIG.estrutura.entradaAcessivel || CONFIG.estrutura.banheiroAcessivel) && {
      icone: <IconeAcessivel tamanho={28} />,
      titulo: 'Acessibilidade',
      texto: `${[CONFIG.estrutura.entradaAcessivel && 'Entrada', CONFIG.estrutura.banheiroAcessivel && 'banheiro'].filter(Boolean).join(' e ')} acessíveis para cadeirantes, no ${CONFIG.endereco.bairro} de ${CONFIG.cidade}.`,
    },
  ].filter(Boolean) as { icone: ReactNode; titulo: string; texto: string }[]

  return (
    <section id="clinica" aria-labelledby="titulo-clinica" className="sobre-claro relative overflow-hidden bg-gelo py-24 lg:py-36">
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <CabecalhoSecao id="titulo-clinica" rotulo="A clínica" titulo="Uma clínica que *explica* e acompanha." />
          <Revelar atraso={0.1} className="space-y-5 self-end text-lg leading-relaxed text-tinta-suave">
            <p>
              Na {CONFIG.nome}, cada consulta começa por ouvir você. A avaliação é individual, as orientações são explicadas em
              linguagem simples e o acompanhamento segue um ritmo combinado com o dentista.
            </p>
            <p>
              O nome diz a ideia: <strong className="font-medium text-tinta">prevenir</strong>. Cuidar da saúde bucal como um hábito
              construído junto, consulta após consulta, com informação clara para você decidir.
            </p>
          </Revelar>
        </div>

        <ul className="mt-16 grid gap-4 md:grid-cols-3 lg:mt-24">
          {pilares.map((p, i) => (
            <Revelar key={p.titulo} como="li" atraso={i * 0.08}>
              <CartaoLuz como="div" className="h-full p-7 sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="grid size-14 place-items-center rounded-2xl bg-menta-suave text-menta-texto">{p.icone}</span>
                  <span className="rotulo text-[0.68rem] text-grafite-300" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-8 text-2xl text-tinta">{p.titulo}</h3>
                <p className="mt-3 leading-relaxed text-tinta-suave">{p.texto}</p>
              </CartaoLuz>
            </Revelar>
          ))}
        </ul>
      </div>
    </section>
  )
}
