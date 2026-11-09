/**
 * Todos os dados do site ficam aqui. Edite este arquivo e rode `npm run build`.
 * Tudo o que depende de confirmação é controlado por chaves true/false e só
 * aparece no site quando ligado.
 */

export type Area = {
  titulo: string
  descricao: string
  /** Como o tema entra na mensagem do WhatsApp ("Gostaria de conversar sobre {tema}."). */
  tema: string
  /** Só aparece no site quando true. */
  confirmado: boolean
}

export const CONFIG = {
  /** Faixa "Rascunho para avaliação" no topo. Mude para false após a aprovação. */
  rascunho: false,

  /** URL pública do site (canonical, og:url, og:image). Nunca localhost. */
  siteUrl: 'https://natalinoadvcriminal.com',

  // Pendente: nome completo como consta na OAB.
  nome: 'Natalino Polato',
  profissao: 'Advogado Criminalista',
  oab: 'OAB/SP 220.810',
  oabNumero: '220.810',
  oabSeccional: 'OAB/SP',

  /**
   * Não há título de especialista em Direito Penal comprovado (a pós-graduação
   * informada é em Direito Processual Civil). Manter false.
   */
  mostrarEspecialista: false,

  /** Tempo de atuação informado pelo advogado. */
  mostrarTempoAtuacao: true,
  tempoAtuacao: 'mais de 20 anos de atuação na advocacia',

  /** Formação informada pelo advogado (sem anos). */
  formacao: [
    'Cursos de extensão em Direito Penal e Processo Penal',
    'Pós-graduação em Direito Processual Civil',
    'Formação específica em Tribunal do Júri, Escola Superior de Advocacia (ESA/SP)',
  ],

  fechamentoInstitucional:
    'Uma advocacia pautada pela independência profissional, pelo rigor técnico e pelo compromisso com o direito de defesa, o devido processo legal e as garantias constitucionais.',

  /** Docência informada pelo advogado (só na seção Sobre). */
  mostrarProfessor: true,
  docencia: {
    frase: 'É professor universitário nas disciplinas de Processo Penal e Prática Penal, na Faculdade Unimogi.',
    itemFormacao: 'Docência em Processo Penal e Prática Penal, Faculdade Unimogi',
  },

  // Desligado a pedido: o cargo na OAB fica fora do site.
  mostrarCargoOAB: false,
  cargoOAB: 'Presidente da OAB Mogi Guaçu/SP (gestão 2025/2027)',

  /** WhatsApp principal, só dígitos com DDI. Usado em todos os botões. */
  whatsapp: '5519992477474',
  whatsappExibicao: '(19) 99247-7474',
  mensagemWhatsapp: 'Olá, Dr. Natalino! Vi seu site e gostaria de entrar em contato.',

  // Pendente: confirmar telefone fixo (ficha do Google).
  telefoneFixo: '(19) 3818-3551',
  telefoneFixoLink: '+551938183551',

  // Pendente: confirmar endereço (ficha do Google).
  endereco: {
    rua: 'R. Minas Gerais, 82',
    bairro: 'Jardim Centenário',
    cidade: 'Mogi Guaçu',
    uf: 'SP',
    cep: '13845-233',
  },

  // Pendente: confirmar horários (ficha do Google).
  horarios: [
    { dias: 'Segunda a sexta', horas: '09h00 às 17h30' },
    { dias: 'Sábado e domingo', horas: 'Fechado' },
  ],
  /** Mesmos horários em formato schema.org (JSON-LD). */
  horariosSchema: ['Mo-Fr 09:00-17:30'],

  // Pendente: se quer divulgar o Instagram no site.
  mostrarInstagram: false,
  instagram: 'https://www.instagram.com/natalino.polato',

  /** Áreas de atuação (informadas pelo advogado). Só as com `confirmado: true` aparecem. */
  areas: [
    {
      titulo: 'Inquéritos policiais',
      descricao: 'Acompanhamento de investigações e atuação perante autoridades policiais.',
      tema: 'inquéritos policiais',
      confirmado: true,
    },
    {
      titulo: 'Ações penais',
      descricao: 'Defesa técnica em processos criminais, da resposta à acusação ao julgamento.',
      tema: 'ações penais',
      confirmado: true,
    },
    {
      titulo: 'Tribunal do Júri',
      descricao:
        'Atuação na defesa de acusados de crimes dolosos contra a vida, em todas as fases do procedimento.',
      tema: 'Tribunal do Júri',
      confirmado: true,
    },
    {
      titulo: 'Recursos criminais',
      descricao:
        'Elaboração e acompanhamento de recursos nos Tribunais de Justiça, no Superior Tribunal de Justiça (STJ) e no Supremo Tribunal Federal (STF).',
      tema: 'recursos criminais',
      confirmado: true,
    },
    {
      titulo: 'Sustentações orais',
      descricao: 'Defesa perante órgãos colegiados dos tribunais.',
      tema: 'sustentações orais',
      confirmado: true,
    },
    {
      titulo: 'Habeas corpus',
      descricao: 'Atuação na proteção da liberdade de locomoção diante de constrangimento ilegal.',
      tema: 'habeas corpus',
      confirmado: true,
    },
    {
      titulo: 'Execução penal',
      descricao:
        'Atuação em progressão de regime, livramento condicional, remição de pena, indulto e demais incidentes da execução.',
      tema: 'execução penal',
      confirmado: true,
    },
    {
      titulo: 'Medidas cautelares e prisões',
      descricao:
        'Pedidos de liberdade provisória, relaxamento e revogação de prisões cautelares, entre outras medidas.',
      tema: 'medidas cautelares e prisões',
      confirmado: true,
    },
    {
      titulo: 'Revisão criminal',
      descricao: 'Atuação na revisão de condenações criminais transitadas em julgado.',
      tema: 'revisão criminal',
      confirmado: true,
    },
  ] satisfies Area[],

  /** Logo (extraída da arte enviada; trocar pelo vetor original quando houver). */
  logo: {
    completa: '/img/logo-natalino-polato.webp', // 640×329, fundo transparente
    monograma: '/img/logo-monograma.webp', // 167×128, fundo transparente
  },

  /** Imagem de compartilhamento (1200×630). */
  ogImage: '/img/og-natalino-polato.jpg',

  /**
   * Retrato (recorte 4:5 com fundo transparente). Arquivos em public/img:
   * natalino-polato-{480,800,1200}.{avif,webp}. Com `base: ''` o retrato não aparece.
   */
  foto: {
    base: '/img/natalino-polato',
    larguras: [480, 800, 1200],
    largura: 1200,
    altura: 1500,
    alt: 'Natalino Polato, advogado criminalista',
  },
}

export const enderecoCompleto = `${CONFIG.endereco.rua} - ${CONFIG.endereco.bairro}, ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}, CEP ${CONFIG.endereco.cep}`

export const waLink = (mensagem: string) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`

export const whatsappUrl = waLink(CONFIG.mensagemWhatsapp)

export const whatsappTema = (tema: string) => waLink(`Olá, Dr. Natalino! Gostaria de conversar sobre ${tema}.`)

const mapsQuery = encodeURIComponent(
  `${CONFIG.endereco.rua}, ${CONFIG.endereco.bairro}, ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}, ${CONFIG.endereco.cep}`,
)
export const mapsEmbedUrl = `https://www.google.com/maps?q=${mapsQuery}&output=embed`
export const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`

export const areasVisiveis = CONFIG.areas.filter((a) => a.confirmado)
