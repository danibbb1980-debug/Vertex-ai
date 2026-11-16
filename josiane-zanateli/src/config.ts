/**
 * Todos os dados do site ficam aqui.
 * Regra: campo vazio ("", null, undefined ou lista vazia) = o bloco correspondente NÃO aparece.
 */

export type Foto = {
  /** Nome-base do arquivo gerado em /public/fotos (sem largura e extensão). Ex.: "josiane-zanateli" */
  arquivo: string
  alt: string
  /** Proporção original (largura / altura), usada para reservar espaço e evitar salto de layout. */
  largura: number
  altura: number
}

export type Atendimento = {
  nome: string
  /** Uma descrição geral e conservadora. Sem técnicas, aparelhos, marcas, prazos ou efeitos. */
  descricao: string
  /** Como o atendimento aparece na mensagem do WhatsApp ("...agendar um horário para {mensagem}."). */
  mensagem: string
}

export type Horario = {
  dia: string
  /** 0 = domingo ... 6 = sábado */
  diaSemana: number
  /** "HH:MM" ou null quando fechado */
  abre: string | null
  fecha: string | null
}

export const CONFIG = {
  /** Faixa "Rascunho para avaliação" + noindex. Ao desligar, revise também public/robots.txt, public/_headers e vercel.json. */
  rascunho: true,

  /** URL pública absoluta (canonical, og:url). Nunca localhost. */
  siteUrl: 'https://josiane-zanateli-rascunho.vercel.app',

  nome: 'Josiane Zanateli',
  descritor: 'Estética Avançada',
  cidade: 'Varginha',
  uf: 'MG',

  /** Logo real (caminho em /public). Vazio = usa a assinatura tipográfica provisória. */
  logo: '',

  /** Anos de atuação (informação do Instagram; confirmar). 0 ou null = não aparece. */
  anosAtuacao: 20 as number | null,

  profissional: {
    nome: 'Josiane Zanateli',
    /** Profissão, cargo e registro: não informados. Vazio = não aparece. */
    profissao: '',
    registro: '',
    foto: {
      arquivo: 'josiane-zanateli',
      alt: 'Retrato de Josiane Zanateli, de cabelos longos e loiros, sorrindo, com blusa preta.',
      largura: 1154,
      altura: 1542,
    } as Foto | null,
  },

  /** Responsável técnico (se houver). Vazio = não aparece. */
  responsavelTecnico: '',

  endereco: {
    logradouro: 'Travessa Monsenhor Leônidas, 145',
    bairro: 'Centro',
    cidade: 'Varginha',
    uf: 'MG',
    cep: '37002-123',
    rota: 'https://www.google.com/maps/dir/?api=1&destination=Tv.%20Monsenhor%20Le%C3%B4nidas%2C%20145%2C%20Centro%2C%20Varginha%20-%20MG',
    mapaEmbed:
      'https://www.google.com/maps?q=Tv.%20Monsenhor%20Le%C3%B4nidas%2C%20145%2C%20Centro%2C%20Varginha%20-%20MG%2C%2037002-123&output=embed',
  },

  /** Somente dígitos, com 55 + DDD. */
  whatsapp: '5535988326664',
  whatsappExibicao: '(35) 98832-6664',
  usarWhatsapp: true,

  /** E-mail do perfil do Instagram. Grafia "Josianne" a confirmar. Vazio = não aparece. */
  email: 'josiannezanateli@hotmail.com',

  instagram: {
    usuario: '@josizanateli_estetica',
    url: 'https://www.instagram.com/josizanateli_estetica/',
  },

  horarios: [
    { dia: 'Segunda-feira', diaSemana: 1, abre: '08:00', fecha: '19:00' },
    { dia: 'Terça-feira', diaSemana: 2, abre: '08:00', fecha: '19:00' },
    { dia: 'Quarta-feira', diaSemana: 3, abre: '08:00', fecha: '19:00' },
    { dia: 'Quinta-feira', diaSemana: 4, abre: '08:00', fecha: '19:00' },
    { dia: 'Sexta-feira', diaSemana: 5, abre: '08:00', fecha: '19:00' },
    { dia: 'Sábado', diaSemana: 6, abre: '08:00', fecha: '14:00' },
    { dia: 'Domingo', diaSemana: 0, abre: null, fecha: null },
  ] as Horario[],
  avisoHorarios: 'Os horários podem variar em feriados.',

  /** Basta acrescentar itens: a lista, o formulário e as dúvidas se ajustam sozinhos. */
  atendimentos: [
    {
      nome: 'Sobrancelhas',
      descricao:
        'Cuidado com o desenho e o acabamento das sobrancelhas, pensado a partir do seu rosto e do que você procura.',
      mensagem: 'sobrancelhas',
    },
    {
      nome: 'Estética facial',
      descricao:
        'Atendimentos voltados à pele do rosto. Antes de qualquer etapa, conversamos sobre a sua pele e a sua rotina.',
      mensagem: 'estética facial',
    },
    {
      nome: 'Estética corporal',
      descricao:
        'Atendimentos voltados ao corpo, definidos em conversa e de acordo com o que faz sentido para você.',
      mensagem: 'estética corporal',
    },
    {
      nome: 'Nail designer',
      descricao: 'Cuidado com as unhas das mãos, do preparo ao acabamento, no tempo de cada atendimento.',
      mensagem: 'nail designer (unhas)',
    },
  ] as Atendimento[],

  /** Liga/desliga seções. Uma seção ligada só aparece se tiver conteúdo. */
  secoes: {
    espaco: true,
    profissional: true,
    atendimentos: true,
    comoFunciona: true,
    duvidas: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },
}

export const MENSAGEM_GERAL = `Olá! Vi o site da ${CONFIG.nome} Estética e gostaria de agendar um horário.`

export function linkWhatsApp(mensagem: string = MENSAGEM_GERAL) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`
}

export function mensagemAtendimento(a: Atendimento) {
  return `Olá! Vi o site da ${CONFIG.nome} Estética e gostaria de agendar um horário para ${a.mensagem}.`
}

export function temTexto(v: unknown): boolean {
  return typeof v === 'string' ? v.trim().length > 0 : v != null && v !== 0 && v !== false
}
