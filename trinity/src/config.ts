// Todos os dados do site ficam aqui. Campo vazio ou ausente = o bloco não aparece.

export type Dia = { dia: string; abre?: string; fecha?: string } // índice = getDay() (0 = domingo)

export type Foto = {
  src: string
  alt: string
  legenda?: string
  largura: number
  altura: number
  /** comparativo: com antes e depois preenchidos, vira uma comparação arrastável */
  antes?: string
  depois?: string
}

export type Atendimento = { nome: string; descricao: string }
export type Curso = { nome: string; descricao: string }
export type Profissional = { nome: string; profissao: string; registro: string; foto?: string }

export const CONFIG = {
  rascunho: true,
  siteUrl: 'https://trinity-rascunho.vercel.app',

  nome: 'Trinity',
  descritor: 'Estética Avançada', // só aparece junto ao nome (logotipo, title)
  descricaoCurta: 'Atendimentos e cursos em estética',
  cidade: 'Varginha',
  uf: 'MG',

  // Para trocar pelo arquivo original do logotipo, aponte para /logo.svg (em public/). Vazio = logotipo recriado.
  logo: '',

  endereco: {
    rua: 'Rua Capitão Pedro Braga, nº 90',
    bairro: 'Parque Catanduvas',
    cidade: 'Varginha',
    uf: 'MG',
    cep: '37006-300',
    ruaSchema: 'Rua Capitão Pedro Braga, 90',
  },
  rota: 'https://www.google.com/maps/dir/?api=1&destination=R.%20Cap.%20Pedro%20Braga%2C%2090%2C%20Parque%20Catanduvas%2C%20Varginha%20-%20MG',
  mapaEmbed:
    'https://www.google.com/maps?q=R.%20Cap.%20Pedro%20Braga%2C%2090%2C%20Parque%20Catanduvas%2C%20Varginha%20-%20MG%2C%2037006-300&output=embed',

  usarWhatsapp: true,
  whatsapp: '5535998184961',
  whatsappExibicao: '(35) 99818-4961',
  telefoneFixo: '',
  email: '',
  instagram: 'https://www.instagram.com/trinity.estetica/',
  instagramUsuario: '@trinity.estetica',

  horarios: [
    { dia: 'Domingo' },
    { dia: 'Segunda-feira', abre: '09:00', fecha: '18:00' },
    { dia: 'Terça-feira', abre: '09:00', fecha: '18:00' },
    { dia: 'Quarta-feira', abre: '09:00', fecha: '18:00' },
    { dia: 'Quinta-feira', abre: '09:00', fecha: '18:00' },
    { dia: 'Sexta-feira', abre: '09:00', fecha: '18:00' },
    { dia: 'Sábado' },
  ] as Dia[],
  avisoHorarios: 'Horários podem variar em feriados.',

  atendimentos: [
    {
      nome: 'Estética facial',
      descricao:
        'Cuidados voltados ao rosto, definidos depois de uma conversa sobre o que você procura e de uma avaliação individual.',
    },
    {
      nome: 'Estética corporal',
      descricao:
        'Cuidados voltados ao corpo, planejados a partir de uma avaliação individual e explicados antes de qualquer sessão.',
    },
  ] as Atendimento[],

  cursos: [
    {
      nome: 'Cursos de estética facial e corporal',
      descricao: 'Informações sobre turmas, conteúdo e datas pelo WhatsApp.',
    },
  ] as Curso[],

  profissionais: [] as Profissional[],
  responsavelTecnico: { nome: '', registro: '' },

  // Fotos publicadas pela própria Trinity (Google Maps / Instagram). Lista vazia = seção some.
  fotosEspaco: [
    { src: '/img/recepcao.webp', alt: 'Recepção da Trinity, com o emblema dourado na parede, mesa de atendimento e poltrona', legenda: 'Recepção, Parque Catanduvas', largura: 1000, altura: 1313 },
    { src: '/img/equipe.webp', alt: 'Três integrantes da equipe da Trinity em retrato de estúdio', legenda: 'Equipe da Trinity', largura: 1170, altura: 929 },
    { src: '/img/atendimento.webp', alt: 'Profissional de máscara e luvas durante um atendimento facial', legenda: 'Atendimento facial', largura: 1000, altura: 1313 },
  ] as Foto[],

  fotosRegistros: [
    { src: '/img/perfil-olhos-depois.webp', antes: '/img/perfil-olhos-antes.webp', depois: '/img/perfil-olhos-depois.webp', alt: 'registro facial de perfil, região lateral dos olhos', legenda: 'Lateral dos olhos', largura: 1170, altura: 445 },
    { src: '/img/perfil-rosto-depois.webp', antes: '/img/perfil-rosto-antes.webp', depois: '/img/perfil-rosto-depois.webp', alt: 'registro facial de perfil masculino', legenda: 'Perfil do rosto', largura: 579, altura: 1026 },
    { src: '/img/olhos-depois.webp', antes: '/img/olhos-antes.webp', depois: '/img/olhos-depois.webp', alt: 'registro facial de frente, região abaixo dos olhos', legenda: 'Região dos olhos', largura: 838, altura: 580 },
    { src: '/img/labios.webp', alt: 'Registro de atendimento na região dos lábios, vista lateral', legenda: 'Lábios', largura: 1000, altura: 876 },
  ] as Foto[],

  secoes: {
    caminhos: true,
    atendimentos: true,
    registros: true,
    cursos: true,
    espaco: true,
    profissionais: true,
    comoFunciona: true,
    duvidas: true,
    local: true,
    agendar: true,
    ctaFinal: true,
  },

  mensagens: {
    geral: 'Olá! Vi o site da Trinity e gostaria de agendar uma avaliação.',
    atendimento: (nome: string) => `Olá! Vi o site da Trinity e gostaria de agendar uma avaliação sobre ${nome.toLowerCase()}.`,
    cursos: 'Olá! Vi o site da Trinity e gostaria de informações sobre os cursos.',
  },
}

export const wa = (texto: string) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`
export const tem = (v: unknown) => (Array.isArray(v) ? v.length > 0 : typeof v === 'string' ? v.trim().length > 0 : !!v)
