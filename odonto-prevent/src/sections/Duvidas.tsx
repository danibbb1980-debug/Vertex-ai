import { CONFIG } from '../config'
import { enderecoCompleto } from '../lib/whatsapp'
import { textoHorario } from '../lib/horarios'
import { Acordeao, type ItemAcordeao } from '../components/Acordeao'
import { CabecalhoSecao } from '../components/CabecalhoSecao'
import { Revelar } from '../components/Revelar'

export function itensDuvidas(): ItemAcordeao[] {
  const horarios = CONFIG.horarios.map((h) => `${h.rotulo.toLowerCase()}, das ${textoHorario(h)}`).join(', e ')
  const acess = [CONFIG.estrutura.entradaAcessivel && 'a entrada', CONFIG.estrutura.banheiroAcessivel && 'o banheiro'].filter(Boolean)
  const itens: (ItemAcordeao | false)[] = [
    CONFIG.estrutura.agendamento && {
      pergunta: 'Preciso agendar horário?',
      resposta: `Sim. O atendimento funciona com agendamento. Você pode pedir um horário pelo WhatsApp, pelo telefone ${CONFIG.telefone} ou pelo formulário desta página, e a equipe confirma a disponibilidade.`,
    },
    {
      pergunta: 'Como é a avaliação?',
      resposta:
        'É uma consulta para conhecer você: conversa sobre seu histórico e o que você sente, exame da boca e explicação do que foi observado. A partir dela, o dentista orienta os próximos passos.',
    },
    {
      pergunta: 'Por que ir ao dentista mesmo sem dor?',
      resposta:
        'Porque a ausência de dor não significa ausência de alterações. Consultas regulares ajudam a observar mudanças com antecedência e a ajustar a rotina de cuidado.',
    },
    {
      pergunta: 'O que é prevenção em saúde bucal?',
      resposta:
        'É o conjunto de hábitos e acompanhamentos que ajudam a manter a saúde da boca ao longo do tempo: higiene diária, alimentação, atenção aos sinais e consultas periódicas conforme orientação profissional.',
    },
    {
      pergunta: 'Com que frequência devo voltar?',
      resposta: 'Não existe um intervalo igual para todas as pessoas. O dentista define a frequência dos retornos a partir da sua avaliação.',
    },
    CONFIG.horarios.length > 0 && {
      pergunta: 'Quais são os horários de atendimento?',
      resposta: `${horarios.charAt(0).toUpperCase()}${horarios.slice(1)}. ${CONFIG.avisoHorarios}`,
    },
    {
      pergunta: 'Onde fica a clínica?',
      resposta: (
        <>
          {enderecoCompleto()}.{' '}
          <a href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-menta-texto underline underline-offset-4">
            Abrir no Google Maps
          </a>
          .
        </>
      ),
    },
    acess.length > 0 && {
      pergunta: 'A clínica tem acessibilidade?',
      resposta: `Sim. ${acess.join(' e ').replace(/^./, (c) => c.toUpperCase())} ${acess.length > 1 ? 'são acessíveis' : 'é acessível'} para cadeirantes.`,
    },
    CONFIG.pagamentos.length > 0 && {
      pergunta: 'Quais formas de pagamento são aceitas?',
      resposta: `${CONFIG.pagamentos.join(', ').replace(/, ([^,]*)$/, ' e $1')}.`,
    },
    {
      pergunta: 'O que levar na primeira consulta?',
      resposta:
        'Documento com foto, a lista dos medicamentos que você usa e, se tiver, exames ou radiografias anteriores. Vale anotar suas dúvidas para conversar com calma.',
    },
  ]
  return itens.filter(Boolean) as ItemAcordeao[]
}

export function Duvidas() {
  return (
    <section id="duvidas" aria-labelledby="titulo-duvidas" className="sobre-claro bg-white py-24 lg:py-36">
      <div className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.4fr] lg:gap-20">
        <div className="lg:sticky lg:top-40 lg:self-start">
          <CabecalhoSecao id="titulo-duvidas" rotulo="Dúvidas frequentes" titulo="Perguntas que *valem* a pena.">
            <p>Respostas gerais e diretas. Para o seu caso, a conversa continua na avaliação.</p>
          </CabecalhoSecao>
        </div>
        <Revelar>
          <Acordeao itens={itensDuvidas()} />
        </Revelar>
      </div>
    </section>
  )
}
