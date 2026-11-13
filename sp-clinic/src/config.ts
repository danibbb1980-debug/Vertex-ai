/**
 * SP Clinic · todos os dados do site ficam aqui.
 *
 * Regra do projeto: campo vazio ('' ou []) = o bloco correspondente NÃO aparece.
 * Nada de placeholder na tela. Veja o README para cada campo.
 */

export type Tratamento = {
  /** Nome exibido no índice e no formulário. */
  nome: string
  /** Uma descrição geral e conservadora (sem técnica, marca, prazo ou resultado). */
  descricao: string
}

export type Profissional = {
  nome: string // nome completo, sem "Dr." ou "Dra."
  /** Ex.: "Fundadora". Vazio = não aparece. */
  cargo?: string
  /** Só a profissão informada pela clínica. Vazio = não aparece. */
  profissao?: string
  /** Sigla do conselho, ex.: "CRF-MG". Só aparece junto com o número do registro. */
  conselho?: string
  /** Número do registro. Vazio = a linha de registro não aparece. Exibido como "CRF-MG nº 00000". */
  registro?: string
  /** Título de especialista só com o registro de especialidade (RQE ou equivalente). */
  especialidade?: { titulo: string; registro: string }
  /** Foto (substituir por foto enviada e autorizada; basta trocar o arquivo). */
  foto?: string
}

export type Horario = {
  /** 0 = domingo … 6 = sábado (padrão do JavaScript). */
  diaSemana: number
  dia: string
  /** null = fechado. Formato "HH:MM". */
  abre: string | null
  fecha: string | null
}

export type Foto = { src: string; alt: string; legenda?: string }

const enderecoTexto = 'R. Cel. Brito Filho, 515 - Fátima, Pouso Alegre - MG, 37554-246'

export const CONFIG = {
  /** true = faixa de rascunho + noindex. Mude para false só na publicação definitiva. */
  rascunho: true,
  /** URL pública absoluta, sem barra no fim. Usada em canonical, og:url e JSON-LD. */
  siteUrl: 'https://sp-clinic-rascunho.vercel.app',

  nome: 'SP Clinic',
  assinatura: 'Estética Avançada',
  /** Caminho do arquivo original do logo (SVG/PNG em alta). Vazio = usa o redesenho vetorial. */
  logo: '',

  frase: 'Onde ciência, tecnologia e naturalidade se encontram.',

  // ---------------------------------------------------------------- contato
  usarWhatsapp: true,
  whatsapp: '5535997100735',
  whatsappExibicao: '(35) 99710-0735',
  telefone: { exibicao: '(35) 99710-0735', tel: '+5535997100735' },
  email: '',
  instagram: {
    usuario: '@spclinicesteticaavancada',
    url: 'https://www.instagram.com/spclinicesteticaavancada/',
  },
  mensagens: {
    geral: 'Olá! Vi o site da SP Clinic e gostaria de agendar uma avaliação.',
    tratamento: (nome: string) =>
      `Olá! Vi o site da SP Clinic e gostaria de agendar uma avaliação sobre ${nome}.`,
    formulario: 'Olá! Vim pelo site da SP Clinic e gostaria de solicitar um agendamento.',
  },

  // ---------------------------------------------------------------- endereço
  endereco: {
    rua: 'Rua Coronel Brito Filho, 515',
    bairro: 'Fátima',
    cidade: 'Pouso Alegre',
    uf: 'MG',
    cep: '37554-246',
  },
  rotaUrl:
    'https://www.google.com/maps/dir/?api=1&destination=R.%20Cel.%20Brito%20Filho%2C%20515%20-%20F%C3%A1tima%2C%20Pouso%20Alegre%20-%20MG%2C%2037554-246',
  mapaEmbed: `https://www.google.com/maps?q=${encodeURIComponent(enderecoTexto)}&output=embed`,

  // ---------------------------------------------------------------- horários
  // ATENÇÃO: Google Maps informa 08h00–20h00; o perfil do WhatsApp Business informa 09h00–16h00.
  // Confirmar o horário real com a clínica antes de publicar. O formulário usa estes valores.
  horarios: [
    { diaSemana: 1, dia: 'Segunda-feira', abre: '08:00', fecha: '20:00' },
    { diaSemana: 2, dia: 'Terça-feira', abre: '08:00', fecha: '20:00' },
    { diaSemana: 3, dia: 'Quarta-feira', abre: '08:00', fecha: '20:00' },
    { diaSemana: 4, dia: 'Quinta-feira', abre: '08:00', fecha: '20:00' },
    { diaSemana: 5, dia: 'Sexta-feira', abre: '08:00', fecha: '20:00' },
    { diaSemana: 6, dia: 'Sábado', abre: null, fecha: null },
    { diaSemana: 0, dia: 'Domingo', abre: null, fecha: null },
  ] as Horario[],
  avisoHorario: 'Horários podem variar em feriados.',

  // ---------------------------------------------------------------- conteúdo
  pilares: [
    {
      nome: 'Ciência',
      texto: 'Cada indicação parte de critérios técnicos e de uma avaliação individual.',
    },
    {
      nome: 'Tecnologia',
      texto: 'Recursos atuais a serviço do plano definido para cada pessoa.',
    },
    {
      nome: 'Naturalidade',
      texto: 'Respeito às características de cada rosto e de cada corpo.',
    },
  ],

  /** Para ampliar: acrescente itens. O índice e o formulário crescem sozinhos. */
  tratamentos: [
    {
      nome: 'Preenchimentos',
      descricao:
        'Cuidados voltados a contornos e volumes da face, planejados a partir das características de cada pessoa.',
    },
    {
      nome: 'Tecnologias',
      descricao:
        'Protocolos com equipamentos de estética para a pele, escolhidos de acordo com o que foi observado na avaliação.',
    },
    {
      nome: 'Tricologia',
      descricao:
        'Atenção ao couro cabeludo e aos fios, com uma abordagem que começa pela escuta e pela análise individual.',
    },
    {
      nome: 'Perfiloplastia',
      descricao:
        'Planejamento do perfil facial, observando a relação entre nariz, lábios, queixo e linha da mandíbula.',
    },
    {
      nome: 'Full face',
      descricao:
        'Uma leitura da face como um todo, e não de áreas isoladas, para organizar um plano de cuidado coerente.',
    },
    {
      nome: 'Harmonização corporal',
      descricao:
        'Cuidados com os contornos do corpo, planejados a partir das características e do histórico de cada pessoa.',
    },
  ] as Tratamento[],
  /** Linha final do índice. Vazio = não aparece. */
  tratamentosComplemento: 'Tratamentos faciais e corporais',

  etapas: [
    {
      titulo: 'Contato e agendamento',
      texto: 'Você fala com a clínica pelo WhatsApp ou pelo formulário deste site e combina o dia da visita.',
    },
    {
      titulo: 'Avaliação individual',
      texto: 'Uma conversa sobre o que você procura, seu histórico e suas expectativas, com análise presencial.',
    },
    {
      titulo: 'Plano explicado com clareza',
      texto: 'As opções indicadas, os cuidados envolvidos e as etapas são apresentados antes de qualquer procedimento.',
    },
    {
      titulo: 'Acompanhamento',
      texto: 'Retornos e orientações seguem o plano combinado com você.',
    },
  ],

  /**
   * Fotos do espaço, exibidas dentro das molduras em arco (seção "O espaço").
   * Origem: publicações do próprio perfil da clínica, enviadas como referência.
   * Substituir pelos arquivos originais em alta resolução quando possível.
   */
  fotos: [
    {
      src: '/fotos/recepcao-sala-de-espera.webp',
      alt: 'Sala de espera da SP Clinic com sofá caramelo, mesa de centro oval, lustre em anéis e janelas amplas',
      legenda: 'Sala de espera',
    },
    {
      src: '/fotos/sala-de-atendimento.webp',
      alt: 'Sala de atendimento com maca branca, espelho de moldura antiga e janelas de vidro do chão ao teto',
      legenda: 'Sala de atendimento',
    },
    {
      src: '/fotos/recepcao-balcao.webp',
      alt: 'Recepção com balcão de pedra clara, parede rosada e vista da cidade pelas janelas',
      legenda: 'Recepção',
    },
    {
      src: '/fotos/copa.webp',
      alt: 'Copa com bancada, banquetas em couro caramelo e pendentes de luz em globo',
      legenda: 'Copa',
    },
  ] as Foto[],

  /**
   * Seção "Equipe" (aparece se houver ao menos um nome).
   * Fotos de perfil do Instagram usadas apenas para o rascunho: trocar por fotos autorizadas.
   */
  profissionais: [
    {
      nome: 'Polliana Damasceno',
      cargo: 'Fundadora',
      profissao: 'Farmacêutica esteta e docente', // conforme o perfil do Instagram
      conselho: 'CRF-MG',
      registro: '', // número do CRF-MG ainda não informado
      foto: '/equipe/polliana.webp',
    },
    {
      nome: 'Stefani Paiva Cavecchia',
      // o perfil informa "Empreendedor(a)" e cita a clínica, sem dizer "fundadora"; confirmar o cargo
      profissao: 'Empreendedora',
      foto: '/equipe/stefani.webp',
    },
  ] as Profissional[],
  /** Preencha nome e registro para exibir no rodapé. */
  responsavelTecnico: { nome: '', registro: '' },

  faq: [] as { pergunta: string; resposta: string }[], // montado abaixo

  /** Liga/desliga seções. Uma seção ligada só aparece se tiver conteúdo. */
  secoes: {
    clinica: true,
    espaco: true,
    tratamentos: true,
    comoFunciona: true,
    equipe: true,
    duvidas: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },
}

// ---------------------------------------------------------------- derivados

/** Linha de registro ("CRF-MG nº 00000") ou '' quando o número não foi informado. */
export const linhaRegistro = (p: Profissional) =>
  p.registro?.trim() ? `${p.conselho ? `${p.conselho} nº ` : ''}${p.registro.trim()}` : ''

export const equipe = () => CONFIG.profissionais.filter((p) => p.nome?.trim())

const diasAbertos = CONFIG.horarios.filter((h) => h.abre && h.fecha)
const diasFechados = CONFIG.horarios.filter((h) => !h.abre)

export const hm = (s: string) => s.replace(':', 'h')

/** Texto corrido dos horários, gerado do config (usado no FAQ). */
export function horarioResumo(): string {
  if (!diasAbertos.length) return ''
  const mesmos = diasAbertos.every((d) => d.abre === diasAbertos[0].abre && d.fecha === diasAbertos[0].fecha)
  const abertos = mesmos
    ? `${diasAbertos[0].dia.toLowerCase()} a ${diasAbertos[diasAbertos.length - 1].dia.toLowerCase()}, das ${hm(
        diasAbertos[0].abre!,
      )} às ${hm(diasAbertos[0].fecha!)}`
    : diasAbertos.map((d) => `${d.dia.toLowerCase()}, ${hm(d.abre!)} às ${hm(d.fecha!)}`).join('; ')
  const fechados = diasFechados.length
    ? ` ${diasFechados.map((d) => d.dia.toLowerCase()).join(' e ').replace(/^./, (c) => c.toUpperCase())}: fechado.`
    : ''
  return `De ${abertos}.${fechados} ${CONFIG.avisoHorario}`.trim()
}

export const enderecoLinha = `${CONFIG.endereco.rua}, ${CONFIG.endereco.bairro}, ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}, CEP ${CONFIG.endereco.cep}`

const listaTratamentos = [
  ...CONFIG.tratamentos.map((t) => t.nome),
  ...(CONFIG.tratamentosComplemento ? [CONFIG.tratamentosComplemento.toLowerCase()] : []),
]
const listaTexto =
  listaTratamentos.length > 1
    ? `${listaTratamentos.slice(0, -1).join(', ')} e ${listaTratamentos[listaTratamentos.length - 1]}`
    : listaTratamentos.join('')

CONFIG.faq = [
  {
    pergunta: 'Como agendar uma avaliação?',
    resposta: `Pelo WhatsApp ${CONFIG.whatsappExibicao}, pelo formulário "Solicitar agendamento" deste site ou por ligação para o mesmo número. A equipe responde com os horários disponíveis.`,
  },
  {
    pergunta: 'Como é a primeira avaliação?',
    resposta:
      'É uma conversa presencial sobre o que você procura, seu histórico e suas expectativas, seguida de uma análise individual. Qualquer indicação vem depois dessa etapa, explicada com calma.',
  },
  {
    pergunta: 'O que levar no dia?',
    resposta:
      'Se tiver, vale levar exames recentes, a lista de medicamentos em uso e informações sobre procedimentos estéticos anteriores. Na dúvida, pergunte à equipe pelo WhatsApp ao agendar.',
  },
  {
    pergunta: 'Quais tratamentos a clínica oferece?',
    resposta: `${listaTexto}. A lista completa e a indicação para o seu caso são apresentadas na avaliação.`,
  },
  {
    pergunta: 'Todo tratamento serve para todas as pessoas?',
    resposta:
      'Não. Cada pessoa tem características, histórico e objetivos próprios. Por isso a indicação de qualquer procedimento depende de avaliação individual, e alguns podem não ser indicados para você.',
  },
  {
    pergunta: 'Posso tirar dúvidas antes de agendar?',
    resposta:
      'Sim, pelo WhatsApp. A equipe passa orientações gerais. Questões sobre o seu caso ficam para a avaliação presencial.',
  },
  {
    pergunta: 'Quais são os horários de atendimento?',
    resposta: horarioResumo(),
  },
  {
    pergunta: 'Onde fica a clínica?',
    resposta: `${enderecoLinha}. O botão "Como chegar", na seção de contato, abre a rota no Google Maps.`,
  },
  {
    pergunta: 'Preciso informar dados de saúde pelo site?',
    resposta:
      'Não. O formulário pede só o seu nome e as preferências de atendimento, data e horário. O site não guarda o que você digita; a conversa continua pelo WhatsApp.',
  },
].filter((f) => f.resposta)

export const waLink = (texto: string = CONFIG.mensagens.geral) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`

export const temWhatsapp = CONFIG.usarWhatsapp && !!CONFIG.whatsapp
