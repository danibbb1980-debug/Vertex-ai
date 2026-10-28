import { CONFIG } from './config'
import { turnosTexto } from './lib/links'

const h = CONFIG.horarios
const dias = (filtro: (t: string) => boolean) =>
  h.filter((d) => filtro(turnosTexto(d.turnos))).map((d) => d.dia.replace('-feira', '').toLowerCase())
const lista = (xs: string[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} e ${xs.at(-1)}` : xs[0] ?? '')
const grupos = [...new Set(h.filter((d) => d.turnos.length).map((d) => turnosTexto(d.turnos)))]
const horariosTexto = grupos
  .map((g) => `${lista(dias((t) => t === g))}: ${g}`)
  .concat(`${lista(dias((t) => t === 'Fechado'))}: fechado`)
  .join('; ')
const e = CONFIG.endereco

/**
 * Textos do site. Dados (contato, horários, atendimentos) ficam em config.ts.
 * Regras: sem promessa de resultado, sem superlativo, sem preço, sem prazo clínico.
 */

export const NAV = [
  { href: '#consultorio', label: 'O consultório' },
  { href: '#atendimentos', label: 'Atendimentos' },
  { href: '#dr-gustavo', label: 'Dr. Gustavo' },
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#duvidas', label: 'Dúvidas' },
  { href: '#contato', label: 'Contato' },
]

export const PILARES = [
  {
    n: '01',
    titulo: 'Hora marcada',
    texto:
      'Cada consulta tem um horário reservado. O atendimento é por agendamento, não por ordem de chegada, e o tempo da consulta é dedicado a você.',
    icone: 'calendar',
  },
  {
    n: '02',
    titulo: 'Planejamento explicado',
    texto:
      'Antes de começar, as opções são apresentadas com clareza: o que será feito, em quais etapas e quais cuidados cada alternativa envolve.',
    icone: 'plan',
  },
  {
    n: '03',
    titulo: 'Acessibilidade',
    texto: 'Entrada, banheiro e estacionamento com acessibilidade para cadeirantes.',
    icone: 'access',
    confirmar: true,
  },
] as const

export const AREAS = [
  'Implantes dentários',
  'Prótese sobre implante',
  'Ortodontia',
  'Endodontia',
  'Clareamento dental',
  'Lentes de contato dentais',
  'Clínica geral',
]

export const PARA_QUEM = [
  {
    titulo: 'Perdeu um ou mais dentes',
    texto: 'e quer entender as opções de reabilitação, como implantes e próteses sobre implante.',
    alvo: 'implantes',
    rotulo: 'Implantes dentários',
  },
  {
    titulo: 'Quer alinhar os dentes',
    texto: 'e saber qual tipo de aparelho, fixo ou removível, faz sentido para o seu caso.',
    alvo: 'ortodontia',
    rotulo: 'Ortodontia',
  },
  {
    titulo: 'Sente dor ou sensibilidade',
    texto: 'em um dente e precisa avaliar se há indicação de tratamento de canal.',
    alvo: 'endodontia',
    rotulo: 'Endodontia',
  },
  {
    titulo: 'Quer cuidar da estética do sorriso',
    texto: 'e conhecer, com informação clara, o que são clareamento e lentes de contato dentais.',
    alvo: 'clareamento',
    rotulo: 'Clareamento e lentes',
  },
]

export const ETAPAS = [
  {
    n: '01',
    titulo: 'Contato e horário marcado',
    texto:
      'Você chama no WhatsApp ou liga para o consultório e combina o dia e o horário da avaliação.',
  },
  {
    n: '02',
    titulo: 'Avaliação e escuta',
    texto:
      'Na consulta, o Dr. Gustavo ouve o que está incomodando, examina com calma e, se necessário, solicita exames complementares.',
  },
  {
    n: '03',
    titulo: 'Planejamento explicado com clareza',
    texto:
      'As alternativas de tratamento são apresentadas em linguagem simples: etapas, cuidados e o que cada opção envolve, para você decidir bem informado.',
  },
  {
    n: '04',
    titulo: 'Acompanhamento',
    texto:
      'Durante e depois do tratamento, as consultas de retorno ajudam a acompanhar a evolução e a manter os cuidados em dia.',
  },
]

export const FAQ: { p: string; r: string }[] = [
  {
    p: 'Como agendar uma avaliação?',
    r: `Pelo WhatsApp ${CONFIG.whatsappExibicao} ou pelo telefone ${CONFIG.telefoneExibicao}. O consultório verifica os horários disponíveis e combina com você o dia da consulta. O agendamento só fica confirmado depois do retorno do consultório.`,
  },
  {
    p: 'Por que o atendimento é com hora marcada?',
    r: 'Para que cada consulta tenha o seu próprio tempo. Com horário reservado, há espaço para ouvir a sua queixa, examinar sem pressa e explicar o que foi observado antes de qualquer decisão.',
  },
  {
    p: 'Como funciona a avaliação para implante, de forma geral?',
    r: 'Em geral, a avaliação começa com conversa e exame clínico. Costumam ser pedidos exames de imagem para observar o osso e as estruturas da região. Com essas informações, o dentista explica se há indicação e quais seriam as etapas. Cada caso é avaliado individualmente.',
  },
  {
    p: 'Como funciona o tratamento ortodôntico, de forma geral?',
    r: 'Depois da avaliação e da documentação necessária, é definido o tipo de aparelho, fixo ou removível, mais adequado ao caso. O tratamento segue com consultas periódicas de manutenção. A duração varia de pessoa para pessoa e é discutida na avaliação.',
  },
  {
    p: 'O que é o tratamento de canal?',
    r: 'É o tratamento da parte interna do dente, a polpa, quando ela está inflamada ou infectada. O objetivo é limpar e selar o interior do dente para mantê-lo na boca. Depois, o dente costuma precisar de uma restauração ou coroa, conforme a avaliação.',
  },
  {
    p: 'O que são lentes de contato dentais, de forma geral?',
    r: 'São lâminas finas fixadas na face da frente dos dentes para ajustar forma, cor e proporção. Nem todo caso tem indicação: é preciso avaliar a saúde dos dentes e da gengiva, a mordida e as expectativas, e entender os cuidados de manutenção.',
  },
  {
    p: 'O consultório tem acessibilidade?',
    r: 'Segundo as informações do consultório no Google, a entrada, o banheiro e o estacionamento têm acessibilidade para cadeirantes. Se precisar de alguma condição específica, avise no agendamento.',
  },
  {
    p: 'Quais formas de pagamento são aceitas?',
    r: `${lista(CONFIG.pagamentos.map((x, i) => (i ? x.charAt(0).toLowerCase() + x.slice(1) : x)))}. Valores e condições são informados diretamente pelo consultório, após a avaliação.`,
  },
  {
    p: 'Onde fica o consultório e quais são os horários?',
    r: `${e.rua}, ${e.bairro}, ${e.cidade} - ${e.uf}. Horários: ${horariosTexto}. Os horários podem variar em feriados.`,
  },
]
