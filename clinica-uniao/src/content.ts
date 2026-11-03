/**
 * Textos editoriais do site. Dados da clínica (endereço, horários, atendimentos)
 * ficam em config.ts; aqui só o texto que os explica.
 * Regras: sem promessa de resultado, sem superlativos, sem preço, sem prazo clínico.
 */
import { CONFIG } from './config'
import { linhasHorario } from './lib/horarios'
import { enderecoCompleto } from './lib/links'

export const HERO = {
  eyebrow: 'Odontologia · Pouso Alegre - MG',
  tituloAntes: 'Várias áreas, um só',
  enfase: 'plano',
  tituloDepois: 'de cuidado.',
  subtitulo: 'Avaliação individual, explicações claras e atendimento com hora marcada.',
}

export const CLINICA = {
  rotulo: 'A clínica',
  tituloAntes: 'O nome diz o',
  enfase: 'jeito',
  tituloDepois: 'de cuidar.',
  paragrafos: [
    'Na Clínica União, as áreas da odontologia conversam entre si. Estética, implantes, canal, aparelhos, cuidado infantil e harmonização facial entram em um mesmo plano, pensado para cada pessoa.',
    'Tudo começa por uma avaliação com hora marcada, em que ouvimos o que você procura, examinamos com calma e explicamos as possibilidades antes de qualquer decisão.',
  ],
  pilares: [
    CONFIG.atendimentos.length > 1 && {
      titulo: 'Várias áreas',
      texto: `${CONFIG.atendimentos.length} frentes de atendimento reunidas no mesmo endereço, no centro de Pouso Alegre.`,
      icone: 'areas' as const,
    },
    {
      titulo: 'Hora marcada',
      texto: 'Atendimento com agendamento, para que a consulta aconteça sem pressa.',
      icone: 'relogio' as const,
    },
    {
      titulo: 'Todas as idades',
      texto: 'Da odontopediatria aos cuidados de adultos e idosos, cada fase com sua atenção.',
      icone: 'idades' as const,
    },
  ].filter(Boolean) as { titulo: string; texto: string; icone: 'areas' | 'relogio' | 'idades' }[],
}

export const QUANDO_PROCURAR = {
  rotulo: 'Quando procurar',
  tituloAntes: 'Bons motivos para uma',
  enfase: 'visita',
  tituloDepois: '',
  intro:
    'Não é preciso esperar um incômodo para marcar uma consulta. Algumas situações comuns em que vale conversar com o dentista:',
  itens: [
    {
      titulo: 'Check-up periódico',
      texto: 'Consultas regulares ajudam a acompanhar a saúde da boca. O intervalo ideal é definido pelo dentista para cada pessoa.',
    },
    {
      titulo: 'Dor ou sensibilidade',
      texto: 'Dor, sensibilidade ao frio ou ao doce e sangramento na gengiva são sinais para procurar uma avaliação.',
    },
    {
      titulo: 'Perda de um dente',
      texto: 'Há diferentes formas de repor um dente. A avaliação mostra quais fazem sentido no seu caso.',
    },
    {
      titulo: 'Alinhamento dos dentes',
      texto: 'Dentes tortos, espaçados ou uma mordida que não encaixa podem ser avaliados em qualquer idade.',
    },
    {
      titulo: 'Primeira visita da criança',
      texto: 'A primeira consulta é um momento de orientação para a família e de familiarização da criança com o consultório.',
    },
  ],
}

export const ETAPAS = {
  rotulo: 'Como funciona',
  tituloAntes: 'Do primeiro contato ao',
  enfase: 'acompanhamento',
  tituloDepois: '.',
  itens: [
    {
      titulo: 'Contato e agendamento',
      texto: 'Você fala com a clínica pelo WhatsApp ou telefone e escolhe um horário para a avaliação.',
    },
    {
      titulo: 'Avaliação e escuta',
      texto: 'Na consulta, o dentista ouve o que você procura, examina a boca e, se necessário, pede exames complementares.',
    },
    {
      titulo: 'Plano explicado com clareza',
      texto: 'Você recebe as opções de tratamento, as etapas envolvidas e espaço para tirar dúvidas antes de decidir.',
    },
    {
      titulo: 'Acompanhamento',
      texto: 'Cada etapa é agendada e acompanhada, com retornos conforme o plano combinado.',
    },
  ],
}

const horariosTexto = linhasHorario()
  .map((l) => `${l.rotulo}: ${l.fechado ? 'fechado' : l.valor.toLowerCase()}`)
  .join('; ')

export const FAQ = {
  rotulo: 'Dúvidas frequentes',
  tituloAntes: 'Perguntas que ouvimos',
  enfase: 'bastante',
  tituloDepois: '',
  itens: [
    {
      p: 'Preciso agendar antes de ir?',
      r: 'Sim, recomendamos marcar hora. Assim a clínica reserva o tempo da sua consulta e você é atendido com tranquilidade. O agendamento pode ser solicitado pelo WhatsApp ou pelo telefone.',
    },
    {
      p: 'Como é a primeira avaliação?',
      r: 'É uma conversa seguida de exame clínico. O dentista entende o que você procura, observa dentes, gengiva e mordida e, quando necessário, solicita exames de imagem. Ao final, explica as possibilidades de tratamento.',
    },
    CONFIG.atendimentos.length > 0 && {
      p: 'Quais atendimentos a clínica oferece?',
      r: `${CONFIG.atendimentos.map((a) => a.nome).join(', ')}. A indicação de cada tratamento depende de avaliação individual.`,
    },
    {
      p: 'A clínica atende crianças?',
      r: 'Sim. A clínica oferece atendimento em odontopediatria, voltado a crianças e adolescentes, com orientações para a família.',
    },
    {
      p: 'Quais são os horários de atendimento? Abre aos sábados?',
      r: `${horariosTexto}. ${CONFIG.avisoHorario}`,
    },
    {
      p: 'Onde a clínica fica?',
      r: `No centro de Pouso Alegre: ${enderecoCompleto}. Na seção de contato há um botão para abrir a rota no mapa.`,
    },
    CONFIG.pagamentos.length > 0 && {
      p: 'Quais formas de pagamento são aceitas?',
      r: `${CONFIG.pagamentos.join(', ')}.`,
    },
    {
      p: 'O que levar na primeira consulta?',
      r: 'De forma geral, um documento com foto e, se tiver, exames odontológicos recentes e a lista de medicamentos de uso contínuo. Se tiver alguma dúvida, a equipe orienta pelo WhatsApp.',
    },
    {
      p: 'Já sei o tratamento que quero. Posso marcar direto?',
      r: 'Você pode contar o que procura ao agendar. Ainda assim, todo tratamento começa por uma avaliação, porque a indicação depende de cada caso.',
    },
  ].filter(Boolean) as { p: string; r: string }[],
}

export const CTA_FINAL = {
  tituloAntes: 'Sua avaliação é o',
  enfase: 'primeiro passo',
  tituloDepois: '.',
  texto: 'Conte o que você procura e escolha um horário. A equipe confirma a disponibilidade pelo WhatsApp.',
}

export const AVISO_LEGAL =
  'Conteúdo informativo; a indicação de cada tratamento depende de avaliação individual.'
