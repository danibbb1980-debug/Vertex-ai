import { CONFIG } from '../config'
import { resumoHorarios, faixa } from '../horarios'
import { Enfase } from './ui'
import { ItemAcordeao } from './Acordeao'

function listaAtendimentos() {
  const n = CONFIG.atendimentos.map((a) => a.nome.toLowerCase())
  if (n.length < 2) return n.join('')
  return `${n.slice(0, -1).join(', ')} e ${n[n.length - 1]}`
}

export function perguntas() {
  const e = CONFIG.endereco
  const sab = CONFIG.horarios.find((h) => h.diaSemana === 6)
  const dom = CONFIG.horarios.find((h) => h.diaSemana === 0)
  const q: { p: string; r: string }[] = [
    {
      p: 'Como agendar um horário?',
      r: `Pelo WhatsApp ${CONFIG.whatsappExibicao}, pelos botões deste site ou pelo formulário de solicitação. A equipe confirma a disponibilidade pela conversa.`,
    },
  ]
  if (CONFIG.atendimentos.length)
    q.push({
      p: 'Quais atendimentos são oferecidos?',
      r: `${listaAtendimentos().replace(/^./, (c) => c.toUpperCase())}. Para saber o que é indicado para você, a conversa e a avaliação individual vêm antes.`,
    })
  q.push({ p: 'Quais são os horários de atendimento?', r: `${resumoHorarios()} ${CONFIG.avisoHorarios}` })
  if (sab) q.push({ p: 'Atendem aos sábados?', r: sab.abre ? `Sim, das ${faixa(sab)}.` : 'Não. Aos sábados não há atendimento.' })
  if (dom) q.push({ p: 'Atendem aos domingos?', r: dom.abre ? `Sim, das ${faixa(dom)}.` : 'Não. Aos domingos não há atendimento.' })
  q.push(
    { p: 'Onde fica?', r: `${e.logradouro}, ${e.bairro}, ${e.cidade} - ${e.uf}, CEP ${e.cep}.` },
    {
      p: 'Posso agendar pelo site?',
      r: 'Pelo site, você envia uma solicitação com o atendimento, o dia e o horário que prefere. Ela chega pelo WhatsApp, e o horário só fica reservado depois da confirmação da equipe.',
    },
    {
      p: 'Preciso informar dados de saúde para agendar?',
      r: 'Não. Para pedir um horário, bastam o seu nome e o atendimento desejado. Qualquer conversa sobre a sua saúde acontece com calma, de forma reservada.',
    },
    {
      p: 'Todo atendimento serve para todas as pessoas?',
      r: 'Não necessariamente. A indicação de cada atendimento depende de avaliação individual.',
    },
    {
      p: 'Este site guarda os meus dados?',
      r: 'Não. O formulário apenas monta uma mensagem e abre o WhatsApp. Nada do que você digita fica salvo aqui.',
    },
  )
  return q
}

export function Duvidas() {
  const q = perguntas()
  return (
    <section id="duvidas" aria-labelledby="titulo-duvidas" className="border-t border-fio bg-areia">
      <div className="mx-auto grid max-w-[1320px] grid-cols-12 gap-x-6 gap-y-12 px-5 py-24 sm:px-8 lg:py-36">
        <div className="col-span-12 lg:col-span-7">
          <p className="rotulo text-terracota-escuro">Dúvidas</p>
          <h2 id="titulo-duvidas" className="mt-6 text-[clamp(2.4rem,5vw,3.9rem)] tracking-[-0.03em]">
            <Enfase texto="Perguntas *frequentes*." />
          </h2>
        </div>
        <div className="col-span-12 border-t border-grafite lg:col-span-9 lg:col-start-4">
          {q.map((x, i) => (
            <ItemAcordeao
              key={x.p}
              classeBotao="min-h-[4.5rem] py-5"
              cabecalho={
                <span className="grid grid-cols-[2.5rem_1fr] items-baseline sm:grid-cols-[3.5rem_1fr]">
                  <span className="num rotulo text-grafite-2">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[1.125rem] font-semibold leading-snug sm:text-[1.2rem]">{x.p}</span>
                </span>
              }
              classeConteudo="pb-7 pl-[2.5rem] sm:pl-[3.5rem]"
            >
              <p className="max-w-[58ch] text-grafite-2">{x.r}</p>
            </ItemAcordeao>
          ))}
        </div>
      </div>
    </section>
  )
}
