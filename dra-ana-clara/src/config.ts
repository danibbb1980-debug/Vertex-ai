/**
 * Todos os dados do site. Campo vazio ou ausente = o bloco não aparece.
 * Edite aqui; nenhum outro arquivo precisa mudar para trocar conteúdo.
 */
import retrato from './assets/fotos/retrato.webp'
import retratoSm from './assets/fotos/retrato-sm.webp'
import retratoMd from './assets/fotos/retrato-md.webp'
import retratoPreto from './assets/fotos/retrato-preto.webp'
import retratoPretoSm from './assets/fotos/retrato-preto-sm.webp'
import fachada from './assets/fotos/fachada.webp'
import fachadaSm from './assets/fotos/fachada-sm.webp'
import draFachada from './assets/fotos/dra-fachada.webp'
import draFachadaSm from './assets/fotos/dra-fachada-sm.webp'
import painel from './assets/fotos/painel-logo.webp'
import painelSm from './assets/fotos/painel-logo-sm.webp'
import mesa from './assets/fotos/consultorio-mesa.webp'
import mesaSm from './assets/fotos/consultorio-mesa-sm.webp'
import procedimentos from './assets/fotos/sala-procedimentos.webp'
import procedimentosSm from './assets/fotos/sala-procedimentos-sm.webp'
import espera from './assets/fotos/sala-espera.webp'
import esperaSm from './assets/fotos/sala-espera-sm.webp'
import recepcaoEspera from './assets/fotos/recepcao-espera.webp'
import recepcaoEsperaSm from './assets/fotos/recepcao-espera-sm.webp'
import recepcao from './assets/fotos/recepcao.webp'
import recepcaoSm from './assets/fotos/recepcao-sm.webp'
import c1a from './assets/fotos/caso1-antes.webp'
import c1d from './assets/fotos/caso1-depois.webp'
import c2a from './assets/fotos/caso2-antes.webp'
import c2d from './assets/fotos/caso2-depois.webp'
import c3a from './assets/fotos/caso3-antes.webp'
import c3d from './assets/fotos/caso3-depois.webp'
import c4a from './assets/fotos/caso4-antes.webp'
import c4d from './assets/fotos/caso4-depois.webp'
import c5a from './assets/fotos/caso5-antes.webp'
import c5d from './assets/fotos/caso5-depois.webp'

export type Foto = { src: string; srcSm?: string; srcMd?: string; w: number; h: number; alt: string; legenda?: string }
export type Caso = { id: string; rotulo: string; antes: Foto; depois: Foto; ativo: boolean }
export type Atendimento = { nome: string; descricao: string; ativo: boolean }
export type Dia = { dia: string; abre: string | null; fecha: string | null }

export const CONFIG = {
  rascunho: true,
  intro: false,
  siteUrl: 'https://dra-ana-clara-grimberg-rascunho.vercel.app',

  nome: 'Dra. Ana Clara Grimberg',
  nomeSemTitulo: 'Ana Clara Grimberg',
  descritor: 'Harmonização facial',
  registro: 'CRO-SP 136705',
  cidade: 'Limeira',
  uf: 'SP',

  /** Logo recriado em vetor. Troque pelos arquivos originais quando houver. */
  logo: {
    horizontal: '/logo/logo-horizontal-vinho.svg',
    horizontalMarfim: '/logo/logo-horizontal-marfim.svg',
    vertical: '/logo/logo-vertical-vinho.svg',
    verticalMarfim: '/logo/logo-vertical-marfim.svg',
  },

  endereco: {
    rua: 'R. Joaquim Rodrigues de Oliveira,\u00a013',
    bairro: 'Vila Claudia',
    cidade: 'Limeira',
    uf: 'SP',
    cep: '13480-480',
    maps: 'https://maps.app.goo.gl/S6HotFcpB7RvWP2f9',
    rota:
      'https://www.google.com/maps/dir/?api=1&destination=R.%20Joaquim%20Rodrigues%20de%20Oliveira%2C%2013%2C%20Vila%20Claudia%2C%20Limeira%20-%20SP%2C%2013480-480',
    embed:
      'https://www.google.com/maps?q=R.%20Joaquim%20Rodrigues%20de%20Oliveira%2C%2013%2C%20Vila%20Claudia%2C%20Limeira%20-%20SP%2C%2013480-480&output=embed',
  },

  usarWhatsapp: true,
  whatsapp: '5519994728181',
  whatsappExibicao: '(19) 99472-8181',
  email: '',
  telefoneFixo: '',

  instagram: { usuario: '@draanagrim', url: 'https://www.instagram.com/draanagrim/' },

  fusoHorario: 'America/Sao_Paulo',
  /** Índice = Date.getDay() (0 = domingo). */
  horarios: [
    { dia: 'Domingo', abre: null, fecha: null },
    { dia: 'Segunda-feira', abre: '07:00', fecha: '17:00' },
    { dia: 'Terça-feira', abre: '07:00', fecha: '17:00' },
    { dia: 'Quarta-feira', abre: '07:00', fecha: '17:00' },
    { dia: 'Quinta-feira', abre: '07:00', fecha: '17:00' },
    { dia: 'Sexta-feira', abre: '07:00', fecha: '17:00' },
    { dia: 'Sábado', abre: '08:00', fecha: '11:00' },
  ] as Dia[],

  atendimentos: [
    {
      nome: 'Avaliação',
      descricao:
        'Primeira conversa e avaliação individual com a Dra. Ana Clara. É nela que se entende o que você procura e quais caminhos fazem sentido para o seu caso.',
      ativo: true,
    },
    {
      nome: 'Harmonização facial',
      descricao:
        'Atendimento voltado à face, planejado a partir da avaliação individual. A indicação de cada caso depende dessa avaliação.',
      ativo: true,
    },
    // Desligados até a Dra. Ana Clara confirmar se e como podem ser anunciados:
    { nome: 'Método GRIM', descricao: '', ativo: false },
    { nome: 'Toxina botulínica', descricao: '', ativo: false },
    { nome: 'Preenchimentos', descricao: '', ativo: false },
    { nome: 'Bioestimuladores', descricao: '', ativo: false },
    { nome: 'Fios', descricao: '', ativo: false },
  ] as Atendimento[],

  fotos: {
    retrato: { src: retrato, srcSm: retratoSm, srcMd: retratoMd, w: 1009, h: 1748, alt: 'Retrato da Dra. Ana Clara Grimberg em estúdio, de colete risca de giz bege' },
    retratoSecundario: { src: retratoPreto, srcSm: retratoPretoSm, w: 1009, h: 1748, alt: 'Dra. Ana Clara Grimberg de terno preto, em estúdio de fundo branco' },
    consultorio: [
      { src: draFachada, srcSm: draFachadaSm, w: 1009, h: 1748, alt: 'Dra. Ana Clara na porta do consultório, sob o monograma AG da fachada', legenda: 'Entrada' },
      { src: fachada, srcSm: fachadaSm, w: 1166, h: 1454, alt: 'Fachada do consultório com palmeiras e jardim', legenda: 'Fachada' },
      { src: mesa, srcSm: mesaSm, w: 1166, h: 1454, alt: 'Mesa de atendimento em mármore, com o painel iluminado do logo ao fundo', legenda: 'Mesa de atendimento' },
      { src: procedimentos, srcSm: procedimentosSm, w: 1166, h: 1454, alt: 'Sala de atendimento com cadeira, bancada e mesa de mármore', legenda: 'Sala de atendimento' },
      { src: painel, srcSm: painelSm, w: 1166, h: 1454, alt: 'Painel com o logo da Dra. Ana Clara Grimberg e aparador', legenda: 'Painel' },
      { src: espera, srcSm: esperaSm, w: 1166, h: 1454, alt: 'Sala de espera com sofá em L e quadro de pôr do sol', legenda: 'Sala de espera' },
      { src: recepcaoEspera, srcSm: recepcaoEsperaSm, w: 976, h: 1454, alt: 'Balcão de recepção em madeira e sala de espera ao fundo', legenda: 'Recepção' },
      { src: recepcao, srcSm: recepcaoSm, w: 1166, h: 684, alt: 'Detalhe do balcão de recepção e do piso claro', legenda: 'Recepção, detalhe' },
    ] as Foto[],
  },

  /** Imagens publicadas no perfil da Dra. Ana Clara. Exigem autorização por escrito de cada pessoa. */
  casos: [
    { id: 'perfil', rotulo: 'Perfil', antes: { src: c1a, w: 581, h: 1164, alt: 'Caso 1, antes: perfil três quartos' }, depois: { src: c1d, w: 581, h: 1164, alt: 'Caso 1, depois: perfil três quartos' }, ativo: true },
    { id: 'contorno', rotulo: 'Contorno', antes: { src: c2a, w: 581, h: 1164, alt: 'Caso 2, antes: perfil com o queixo elevado' }, depois: { src: c2d, w: 581, h: 1164, alt: 'Caso 2, depois: perfil com o queixo elevado' }, ativo: true },
    { id: 'labios', rotulo: 'Lábios', antes: { src: c3a, w: 581, h: 1164, alt: 'Caso 3, antes: lábios em close' }, depois: { src: c3d, w: 581, h: 1164, alt: 'Caso 3, depois: lábios em close' }, ativo: true },
    { id: 'nariz', rotulo: 'Nariz', antes: { src: c4a, w: 1166, h: 579, alt: 'Caso 4, antes: nariz de perfil' }, depois: { src: c4d, w: 1166, h: 579, alt: 'Caso 4, depois: nariz de perfil' }, ativo: true },
    { id: 'frontal', rotulo: 'Frontal', antes: { src: c5a, w: 581, h: 1139, alt: 'Caso 5, antes: rosto masculino de frente' }, depois: { src: c5d, w: 581, h: 1139, alt: 'Caso 5, depois: rosto masculino de frente' }, ativo: true },
  ] as Caso[],

  secoes: {
    atendimentos: true,
    avaliacao: true,
    casos: true,
    profissional: true,
    consultorio: true,
    comoFunciona: true,
    horarios: true,
    duvidas: true,
    localizacao: true,
    agendar: true,
    ctaFinal: true,
  },
}

export const atendimentosAtivos = () => CONFIG.atendimentos.filter((a) => a.ativo && a.descricao)
export const casosAtivos = () => CONFIG.casos.filter((c) => c.ativo)

export const MSG_GERAL = `Olá! Vi o site da ${CONFIG.nome} e gostaria de agendar uma avaliação.`
export const msgAtendimento = (nome: string) =>
  nome === 'Avaliação' ? MSG_GERAL : `Olá! Vi o site da ${CONFIG.nome} e gostaria de agendar uma avaliação de ${nome.toLowerCase()}.`
export const wa = (msg = MSG_GERAL) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`
