/**
 * CONFIGURAÇÃO DO SITE — Face Doctor Limeira
 *
 * Todo o conteúdo do site sai daqui. Regra geral: campo vazio ("", [] ou
 * ausente) = o bloco correspondente NÃO aparece no site. Não há placeholders.
 * Veja o README.md para instruções de edição.
 */

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = domingo

export interface Atendimento {
  id: string
  nome: string
  /** Descrição geral e conservadora. Sem técnica, aparelho, marca, prazo ou promessa. */
  descricao: string
  /** false = não aparece em lugar nenhum (site, formulário, SEO, JSON-LD). */
  ativo: boolean
}

export interface Horario {
  dias: DiaSemana[]
  rotulo: string
  /** "HH:MM". Vazio = fechado. */
  abre: string
  fecha: string
}

export const CONFIG = {
  /** Faixa "Rascunho para avaliação" + noindex. Ao publicar de vez, mude para false
   *  E remova o noindex de public/robots.txt, public/_headers e vercel.json. */
  rascunho: true,

  /** Abertura (cortina) na primeira visita da sessão. Padrão: desligada. */
  intro: false,

  /** URL pública definitiva (sem barra no fim). Usada em canonical, og:url e JSON-LD. */
  siteUrl: 'https://face-doctor-limeira-rascunho.vercel.app',

  nome: 'Face Doctor Limeira',
  nomeCurto: 'Face Doctor',
  cidade: 'Limeira',
  descritor: 'Estética facial e corporal',

  /** Logo atual: recorte quadrado do perfil do Instagram (533 px).
   *  Troque por um arquivo em alta resolução em public/ e atualize aqui. */
  logo: { src: '/logo-face-doctor-limeira.png', largura: 533, altura: 533 },

  /** Profissional responsável. Vazio = não aparece. Preencha SÓ depois de confirmar
   *  nome, conselho e número de registro com a cliente. */
  responsavel: { nome: '', registro: '' },

  /** Fotos autorizadas (caminhos em public/). Vazio = nenhuma foto no site. */
  fotos: [] as { src: string; alt: string; largura: number; altura: number }[],

  endereco: {
    rua: 'Rua Bahia',
    numero: '884',
    bairro: 'Vila Cristovam',
    cidade: 'Limeira',
    uf: 'SP',
    cep: '13480-520',
    mapsUrl: 'https://maps.app.goo.gl/fBBXXuyuQM6dgo2x8',
    rotaUrl:
      'https://www.google.com/maps/dir/?api=1&destination=R.%20Bahia%2C%20884%2C%20Vila%20Cristovam%2C%20Limeira%20-%20SP%2C%2013480-520',
    embedUrl:
      'https://www.google.com/maps?q=R.%20Bahia%2C%20884%2C%20Vila%20Cristovam%2C%20Limeira%20-%20SP%2C%2013480-520&output=embed',
  },

  /** WhatsApp no formato internacional, só números. */
  whatsapp: '5519991992594',
  whatsappExibicao: '(19) 99199-2594',
  usarWhatsapp: true,

  /** Sem telefone fixo e sem e-mail informados: ficam vazios e não aparecem. */
  telefone: '',
  email: '',

  instagram: {
    usuario: '@facedoctor.limeira',
    url: 'https://www.instagram.com/facedoctor.limeira/',
  },

  fusoHorario: 'America/Sao_Paulo',
  horarios: [
    { dias: [1, 2, 3, 4, 5], rotulo: 'Segunda a sexta', abre: '09:00', fecha: '19:00' },
    { dias: [6], rotulo: 'Sábado', abre: '08:00', fecha: '12:00' },
    { dias: [0], rotulo: 'Domingo', abre: '', fecha: '' },
  ] as Horario[],
  avisoHorarios: 'Horários podem variar em feriados.',

  atendimentos: [
    {
      id: 'estetica-facial',
      nome: 'Estética facial',
      descricao:
        'Cuidado com a pele do rosto, pensado a partir de uma avaliação personalizada. A conversa vem antes de qualquer indicação.',
      ativo: true,
    },
    {
      id: 'estetica-corporal',
      nome: 'Estética corporal',
      descricao:
        'Atendimento corporal definido a partir de uma avaliação personalizada, de acordo com o que você procura.',
      ativo: true,
    },
    // DESLIGADOS: só ligue depois de confirmar com a cliente quem é o profissional
    // responsável, se o atendimento pode ser anunciado e como descrevê-lo.
    // Mesmo ligado: descrição geral, sem promessa, sem aparelho, sem marca, sem preço.
    { id: 'harmonizacao-facial', nome: 'Harmonização facial', descricao: '', ativo: false },
    { id: 'rejuvenescimento', nome: 'Rejuvenescimento', descricao: '', ativo: false },
    { id: 'radiofrequencia', nome: 'Radiofrequência', descricao: '', ativo: false },
    { id: 'lipocavitacao', nome: 'Lipocavitação', descricao: '', ativo: false },
    { id: 'carboxiterapia', nome: 'Carboxiterapia', descricao: '', ativo: false },
    { id: 'laser', nome: 'Laser', descricao: '', ativo: false },
    { id: 'microagulhamento', nome: 'Microagulhamento', descricao: '', ativo: false },
    { id: 'ultrassom-microfocado', nome: 'Ultrassom microfocado', descricao: '', ativo: false },
    { id: 'gift-card', nome: 'Gift card', descricao: '', ativo: false },
  ] as Atendimento[],

  /** Liga/desliga seções inteiras. */
  secoes: {
    atendimentos: true,
    avaliacao: true,
    horarios: true,
    comoFunciona: true,
    duvidas: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },

  mensagens: {
    geral: 'Olá! Vi o site da Face Doctor Limeira e gostaria de agendar uma avaliação.',
    porAtendimento: (nome: string) =>
      `Olá! Vi o site da Face Doctor Limeira e gostaria de agendar uma avaliação de ${nome.toLowerCase()}.`,
  },
}

export const atendimentosAtivos = () =>
  CONFIG.atendimentos.filter((a) => a.ativo && a.nome.trim() && a.descricao.trim())

export const enderecoLinha = () => {
  const e = CONFIG.endereco
  return `${e.rua}, ${e.numero} · ${e.bairro} · ${e.cidade} - ${e.uf} · CEP ${e.cep}`
}
