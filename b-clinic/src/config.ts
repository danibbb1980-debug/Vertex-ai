/**
 * B Clinic — configuração central do site.
 * Tudo que aparece no site sai daqui. Campo vazio ("") ou ausente = não renderiza.
 * Veja o README.md para instruções de edição.
 */

export type Dia = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = domingo

export interface Horario {
  dia: Dia
  rotulo: string
  /** "08:00" — vazio quando fechado */
  abre: string
  fecha: string
}

export interface Tratamento {
  nome: string
  descricao: string
}

export interface Capitulo {
  numeral: string
  titulo: string
  itens: Tratamento[]
}

export interface Profissional {
  nome: string
  cargo: string
  /** ex.: "Biomédica" — vazio não aparece */
  profissao: string
  /** ex.: "CRBM nº 0000" — vazio não aparece */
  registro: string
  /** caminho em /public, ex.: "/fotos/julia.jpg" — vazio não aparece */
  foto: string
  fotoAlt: string
}

export const CONFIG = {
  /** Faixa de rascunho + noindex. Mude para false só na publicação definitiva. */
  rascunho: true,
  siteUrl: 'https://b-clinic-rascunho.vercel.app',

  nome: 'B Clinic',
  cidade: 'Pouso Alegre',
  uf: 'MG',

  /** Logo original (SVG/PNG em /public). Vazio = usa o monograma redesenhado. */
  logo: '',

  endereco: {
    logradouro: 'Rua Ciomara Amaral de Paula, 217',
    bairro: 'Santa Elisa',
    cidade: 'Pouso Alegre',
    uf: 'MG',
    cep: '37550-000',
    rota:
      'https://www.google.com/maps/dir/?api=1&destination=R.%20Ciomara%20Amaral%20de%20Paula%2C%20217%20-%20Santa%20Elisa%2C%20Pouso%20Alegre%20-%20MG%2C%2037550-000',
    mapaEmbed:
      'https://www.google.com/maps?q=R.%20Ciomara%20Amaral%20de%20Paula%2C%20217%20-%20Santa%20Elisa%2C%20Pouso%20Alegre%20-%20MG%2C%2037550-000&output=embed',
  },

  telefone: '(35) 99900-3915',
  telefoneLink: 'tel:+5535999003915',
  whatsapp: '5535999003915',
  /** false = agendamento pelo direct do Instagram e a seção "Solicitar agendamento" some. */
  usarWhatsapp: true,
  email: '',

  instagram: {
    usuario: 'bclinicpousoalegre',
    url: 'https://www.instagram.com/bclinicpousoalegre/',
    direct: 'https://ig.me/m/bclinicpousoalegre',
  },

  horarios: [
    { dia: 1, rotulo: 'Segunda', abre: '08:00', fecha: '19:00' },
    { dia: 2, rotulo: 'Terça', abre: '08:00', fecha: '19:00' },
    { dia: 3, rotulo: 'Quarta', abre: '08:00', fecha: '19:00' },
    { dia: 4, rotulo: 'Quinta', abre: '08:00', fecha: '19:00' },
    { dia: 5, rotulo: 'Sexta', abre: '08:00', fecha: '19:00' },
    { dia: 6, rotulo: 'Sábado', abre: '08:00', fecha: '19:00' },
    { dia: 0, rotulo: 'Domingo', abre: '', fecha: '' },
  ] as Horario[],
  avisoHorarios: 'Horários podem variar em feriados.',

  /** Frase da clínica — apague o texto para remover. */
  frase: 'Aqui lapidamos a sua beleza.',

  tratamentos: [
    {
      numeral: 'I',
      titulo: 'Harmonização',
      itens: [
        {
          nome: 'Harmonização orofacial',
          descricao:
            'Conjunto de procedimentos estéticos planejados para o equilíbrio entre as regiões da face, sempre a partir das características de cada pessoa.',
        },
        {
          nome: 'Full face',
          descricao:
            'Planejamento que considera o rosto como um todo, em vez de áreas isoladas, para que cada etapa converse com as demais.',
        },
        {
          nome: 'Rinomodelação',
          descricao:
            'Procedimento estético não cirúrgico voltado ao contorno do nariz, com indicação definida após análise individual.',
        },
        {
          nome: 'Preenchimento labial',
          descricao:
            'Procedimento estético para os lábios, planejado a partir do contorno, do volume e das proporções de cada rosto.',
        },
      ],
    },
    {
      numeral: 'II',
      titulo: 'Injetáveis',
      itens: [
        {
          nome: 'Toxina botulínica',
          descricao:
            'Aplicação injetável utilizada na estética para suavizar linhas de expressão, conforme indicação na avaliação.',
        },
        {
          nome: 'Bioestimulador de colágeno',
          descricao:
            'Injetável que estimula a produção natural de colágeno pela pele, com plano definido individualmente.',
        },
      ],
    },
    {
      numeral: 'III',
      titulo: 'Tecnologias',
      itens: [
        {
          nome: 'Laser de CO2',
          descricao:
            'Tecnologia a laser aplicada a cuidados com a pele, indicada conforme o tipo de pele e o objetivo de cada pessoa.',
        },
        {
          nome: 'Tecnologias estéticas',
          descricao:
            'Recursos tecnológicos que podem complementar o plano de cuidados, sempre com indicação definida na avaliação.',
        },
      ],
    },
  ] as Capitulo[],

  profissionais: [
    {
      nome: 'Júlia Beraldo',
      cargo: 'Fundadora',
      profissao: '',
      registro: '',
      foto: '',
      fotoAlt: '',
    },
  ] as Profissional[],

  /** Responsável técnico — preencha os dois campos para exibir no rodapé. */
  responsavelTecnico: { nome: '', registro: '' },

  secoes: {
    clinica: true,
    tratamentos: true,
    equipe: true,
    comoFunciona: true,
    duvidas: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },

  mensagens: {
    geral: 'Olá! Vi o site da B Clinic e gostaria de agendar uma avaliação.',
    tratamento: (t: string) =>
      `Olá! Vi o site da B Clinic e gostaria de agendar uma avaliação sobre ${t}.`,
  },
}

export const filled = (v: unknown): boolean =>
  typeof v === 'string' ? v.trim().length > 0 : v != null
