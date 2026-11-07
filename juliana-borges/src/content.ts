import { CONFIG } from './config'
import { faixaHorario, horariosOrdenados, enderecoCompleto } from './lib/utils'

const resumoHorarios = () => {
  const h = horariosOrdenados()
  const seg = h.find((x) => x.dia === 1)!
  const sab = h.find((x) => x.dia === 6)!
  return `Segunda a sexta, ${faixaHorario(seg).toLowerCase()}; sábado, ${faixaHorario(sab).toLowerCase()}; domingo, fechado.`
}

export const antesDeAgendar = [
  {
    titulo: 'Agendamento pelo WhatsApp',
    texto: 'Você envia uma mensagem com o atendimento e o dia que prefere. O horário é combinado na conversa.',
  },
  {
    titulo: 'Conte o que for importante',
    texto:
      'Se tiver alergia, alguma condição de pele, estiver gestante ou usar medicação, avise antes, para que a Juliana possa avaliar.',
  },
  {
    titulo: 'Conversa e avaliação',
    texto: 'Cada atendimento começa com uma conversa e uma avaliação individual.',
  },
  {
    titulo: 'Chegue com calma',
    texto: 'Procure chegar com alguns minutos de antecedência.',
  },
  {
    titulo: 'Ficou alguma dúvida?',
    texto: 'Converse pelo WhatsApp antes do atendimento. As perguntas são bem-vindas.',
  },
]

export const etapas = [
  {
    titulo: 'Contato e agendamento',
    texto: 'Você chama no WhatsApp ou usa o formulário do site. O dia e o horário são combinados na conversa.',
  },
  {
    titulo: 'Conversa e avaliação',
    texto: 'No dia, a Juliana conversa com você e faz a avaliação, para entender o que você procura.',
  },
  {
    titulo: 'Atendimento',
    texto: 'O atendimento é individual, com hora marcada, e cada etapa é explicada.',
  },
  {
    titulo: 'Orientações',
    texto: 'Ao final, você recebe as orientações para depois do atendimento.',
  },
]

export const perguntas = () => [
  {
    p: 'Preciso agendar?',
    r: 'Sim. Os atendimentos são individuais e com hora marcada. Você pode pedir um horário pelo WhatsApp ou pelo formulário do site.',
  },
  {
    p: 'Quais atendimentos há?',
    r: `${CONFIG.atendimentos.map((a) => a.nome).join(', ').replace(/, ([^,]*)$/, ' e $1')}. ${CONFIG.avisoIndicacao}`,
  },
  {
    p: 'Quais são os horários?',
    r: `${resumoHorarios()} ${CONFIG.avisoHorarios}`,
  },
  {
    p: 'Atende aos sábados?',
    r: `Sim, aos sábados, ${faixaHorario(horariosOrdenados().find((x) => x.dia === 6)!).toLowerCase()}, com hora marcada.`,
  },
  {
    p: 'Onde fica?',
    r: `${enderecoCompleto()}. O link “Como chegar”, na seção de contato, abre a rota no Google Maps.`,
  },
  {
    p: 'Como solicitar um horário?',
    r: 'Mande uma mensagem pelo WhatsApp ou preencha o formulário “Solicitar agendamento”. O formulário só abre o WhatsApp com a sua mensagem pronta; o horário é combinado com a Juliana na conversa.',
  },
  {
    p: 'Posso tirar dúvidas antes pelo WhatsApp?',
    r: 'Pode, sim. Pergunte com calma antes de marcar.',
  },
  {
    p: 'Como é o primeiro atendimento?',
    r: 'Começa com uma conversa e uma avaliação individual. A partir dela, a Juliana explica o que pode ser feito.',
  },
  {
    p: 'O que devo avisar antes?',
    r: 'Se tiver alergia, alguma condição de pele, estiver gestante ou usar medicação, avise antes do atendimento, para que a profissional possa avaliar.',
  },
  {
    p: 'O pedido pelo site já marca o horário?',
    r: 'Não. O pedido chega como uma solicitação pelo WhatsApp. O horário só fica combinado depois da resposta da Juliana.',
  },
]
