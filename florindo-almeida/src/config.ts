/**
 * Todos os dados do site ficam aqui.
 * Regra: campo vazio ("" ou []) = o bloco correspondente NÃO aparece no site.
 */

export type Area = { nome: string; descricao: string }
export type Horario = {
  /** 0 = domingo ... 6 = sábado */
  dia: number
  abre: string // "08:00"
  fecha: string // "18:00"
  pausa?: { inicio: string; fim: string }
}
export type Foto = { src: string; srcSmall?: string; fallback?: string; alt: string; largura: number; altura: number }

export const CONFIG = {
  /** Faixa "Rascunho para avaliação" + noindex. Desligue só na publicação definitiva. */
  rascunho: true,

  /** URL pública definitiva (sem barra no fim). Usada em canonical, og:url e JSON-LD. */
  siteUrl: 'https://florindo-almeida-rascunho.vercel.app',

  advogado: {
    nome: 'Florindo de Almeida Souza',
    profissao: 'Advogado',
    /** Número da OAB. VAZIO = a seção "O advogado" não aparece. Preencha antes de publicar. */
    oab: '',
    oabUf: 'MG',
  },

  cidade: 'Pouso Alegre',
  uf: 'MG',
  /**
   * Não exibido. Pendente de confirmação: "Padre Paraíso" aparece junto com Pouso Alegre
   * no perfil do Instagram sem que esteja claro o que representa. Só incluir aqui após confirmar.
   */
  cidadesAdicionais: [] as string[],

  /** Somente dígitos, com DDI. Confirmar se é o WhatsApp público do advogado. */
  whatsapp: '5535984396024',
  whatsappExibicao: '(35) 98439-6024',
  usarWhatsapp: true,

  instagram: {
    url: 'https://www.instagram.com/florindoalmeida.adv/',
    usuario: '@florindoalmeida.adv',
  },

  /** Vazio = sem seção Localização, sem mapa. Ex.: "Rua X, 123 - Centro, Pouso Alegre - MG" */
  endereco: '',
  /** Link opcional do Google Maps. Gerado a partir do endereço se vazio. */
  mapsUrl: '',
  /** Vazio = formulário usa campo livre de preferência. */
  horarios: [] as Horario[],
  telefoneFixo: '',
  email: '',

  /** Logo definitivo do cliente (caminho em /public). Vazio = usa o logotipo tipográfico provisório. */
  logo: '',

  /** Fotos reais do cliente. Lista vazia = o site se recompõe sem foto. */
  fotos: [
    {
      src: '/fotos/florindo.webp',
      srcSmall: '/fotos/florindo-sm.webp',
      fallback: '/fotos/florindo.jpg',
      alt: 'Florindo de Almeida Souza, advogado em Pouso Alegre - MG',
      largura: 560,
      altura: 700,
    },
  ] as Foto[],

  areas: [
    { nome: 'Direito Civil', descricao: 'Orientação e acompanhamento em questões do âmbito civil.' },
    {
      nome: 'Direito Criminal',
      descricao: 'Orientação e acompanhamento em questões da esfera penal, com respeito aos direitos de cada pessoa.',
    },
    { nome: 'Direito Trabalhista', descricao: 'Orientação sobre questões das relações de trabalho.' },
  ] as Area[],

  /** Liga/desliga seções. Uma seção ligada só aparece se tiver conteúdo. */
  secoes: {
    hero: true,
    atuacao: true,
    advogado: true,
    quando: true,
    comoFunciona: true,
    duvidas: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },
}

export const nomeCompleto = CONFIG.advogado.nome
export const temOab = CONFIG.advogado.oab.trim() !== ''
export const oabTexto = temOab ? `OAB/${CONFIG.advogado.oabUf} nº ${CONFIG.advogado.oab}` : ''
export const temEndereco = CONFIG.endereco.trim() !== ''
export const temHorarios = CONFIG.horarios.length > 0
export const temWhatsapp = CONFIG.usarWhatsapp && CONFIG.whatsapp.trim() !== ''
export const local = `${CONFIG.cidade} - ${CONFIG.uf}`

export const MSG_GERAL = `Olá! Vi o site do advogado ${nomeCompleto} e gostaria de agendar um atendimento.`
export const msgArea = (area: string) =>
  `Olá! Vi o site do advogado ${nomeCompleto} e gostaria de agendar um atendimento sobre ${area}.`
export const waLink = (mensagem: string = MSG_GERAL) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`
export const mapsLink = () =>
  CONFIG.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONFIG.endereco)}`
