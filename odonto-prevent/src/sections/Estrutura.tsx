import { CONFIG } from '../config'
import { CabecalhoSecao } from '../components/CabecalhoSecao'
import { CartaoLuz } from '../components/CartaoLuz'
import { Revelar } from '../components/Revelar'
import { IconeAcessivel, IconeAproximacao, IconeCalendario, IconeCartao } from '../components/Icones'

export function Estrutura() {
  const e = CONFIG.estrutura
  const acess = [e.entradaAcessivel && 'Entrada acessível para cadeirantes', e.banheiroAcessivel && 'Banheiro acessível para cadeirantes'].filter(Boolean) as string[]
  const iconePg = (p: string) => (/aproxima/i.test(p) ? <IconeAproximacao tamanho={20} /> : <IconeCartao tamanho={20} />)

  const cartoes = [
    acess.length > 0 && (
      <CartaoLuz escuro como="div" className="h-full p-7 sm:p-8">
        <IconeAcessivel tamanho={30} className="text-menta" />
        <h3 className="mt-8 text-2xl text-white">Acessibilidade</h3>
        <ul className="mt-4 space-y-2 text-grafite-200">
          {acess.map((a) => (
            <li key={a} className="flex gap-3">
              <span aria-hidden="true" className="mt-[0.6rem] inline-block size-1.5 shrink-0 rounded-full bg-menta" />
              {a}
            </li>
          ))}
        </ul>
      </CartaoLuz>
    ),
    e.agendamento && (
      <CartaoLuz escuro como="div" className="h-full p-7 sm:p-8">
        <IconeCalendario tamanho={30} className="text-menta" />
        <h3 className="mt-8 text-2xl text-white">Hora marcada</h3>
        <p className="mt-4 leading-relaxed text-grafite-200">
          O atendimento é feito com agendamento. Combine seu horário pelo WhatsApp, pelo telefone {CONFIG.telefone} ou pelo
          formulário.
        </p>
      </CartaoLuz>
    ),
    CONFIG.pagamentos.length > 0 && (
      <CartaoLuz escuro como="div" className="h-full p-7 sm:p-8">
        <IconeCartao tamanho={30} className="text-menta" />
        <h3 className="mt-8 text-2xl text-white">Formas de pagamento</h3>
        <ul className="mt-5 flex flex-wrap gap-2">
          {CONFIG.pagamentos.map((p) => (
            <li key={p} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/12 px-4 text-sm text-grafite-200">
              <span className="text-menta">{iconePg(p)}</span>
              {p}
            </li>
          ))}
        </ul>
      </CartaoLuz>
    ),
  ].filter(Boolean)

  if (cartoes.length === 0) return null

  return (
    <section id="estrutura" aria-labelledby="titulo-estrutura" className="relative overflow-hidden bg-grafite-900 py-24 text-white lg:py-36">
      <div aria-hidden="true" className="absolute -left-48 bottom-0 size-[36rem] rounded-full border border-white/5" />
      <div aria-hidden="true" className="absolute -left-32 bottom-16 size-[24rem] rounded-full border border-menta/10" />
      <div className="container-site relative">
        <CabecalhoSecao id="titulo-estrutura" rotulo="Estrutura" titulo="Pensada para *receber* você." claro={false}>
          <p>
            No {CONFIG.endereco.bairro} de {CONFIG.cidade}, com acessibilidade e atendimento organizado por horário.
          </p>
        </CabecalhoSecao>
        <ul className="mt-16 grid gap-4 md:grid-cols-3">
          {cartoes.map((c, i) => (
            <Revelar key={i} como="li" atraso={i * 0.08}>
              {c}
            </Revelar>
          ))}
        </ul>
      </div>
    </section>
  )
}
