/**
 * Todos os dados do site ficam aqui.
 * Itens com "CONFIRMAR COM O CLIENTE" ainda não foram validados.
 * Fontes: ficha do Google Maps e perfil do Instagram.
 */

export const CONFIG = {
  /** true = faixa de rascunho visível. Ao publicar, ver README. */
  rascunho: true,

  /** URL absoluta onde o site ficará publicado. */
  siteUrl: 'https://tonon-rascunho.vercel.app',

  marca: 'Laboratório Tonon',
  responsavel: 'Matheus Tonon',
  funcao: 'CEO do Laboratório Tonon',
  // CONFIRMAR COM O CLIENTE: CRO de cirurgião-dentista ou registro de TPD
  registro: 'Registro [A CONFIRMAR]',
  // CONFIRMAR COM O CLIENTE: responsável técnico (obrigatório no rodapé)
  responsavelTecnico: '[A CONFIRMAR] CRO-SP',

  cidade: 'São João da Boa Vista',
  uf: 'SP',
  endereco: {
    rua: 'R. Henrique Cabral de Vasconcelos, 2104',
    bairro: 'Jardim São Nicolau',
    cep: '13876-100',
  },

  horarios: [
    { dias: 'Segunda a sábado', horas: '08h–18h' },
    { dias: 'Domingo', horas: 'Fechado' },
  ],
  horarioCurto: 'Seg a sáb · 8h–18h',

  whatsapp: '5519981357500',
  telefoneExibicao: '(19) 98135-7500',
  mensagemPadrao: 'Olá, Matheus! Vi o site do Laboratório Tonon e gostaria de agendar uma avaliação.',

  instagram: 'https://www.instagram.com/matheus.tonon',
  instagramArroba: '@matheus.tonon',
  maps: 'https://maps.app.goo.gl/DzCmDyUCrzpVoUCz7',

  // Fotos enviadas pelo cliente (public/fotos/). Pedir versões em alta resolução.
  fotos: {
    retrato: '/fotos/matheus.webp',
    laboratorio: '/fotos/laboratorio.webp',
    galeria: [
      { src: '/fotos/bancada.webp', alt: 'Bancadas de trabalho do laboratório', w: 224, h: 298 },
      { src: '/fotos/peca.webp', alt: 'Peça sendo conferida sobre o modelo', w: 202, h: 360 },
      { src: '/fotos/organizacao.webp', alt: 'Área de organização dos casos', w: 202, h: 360 },
    ],
  },

  /**
   * Casos (antes e depois). Pelo CFO (Res. 196/2019), só com autorização
   * assinada do paciente (TCLE) e publicação pelo cirurgião-dentista
   * responsável, com nome e CRO. CONFIRMAR COM O CLIENTE antes de publicar.
   * false = seção some do site.
   */
  mostrarCasos: true,
  casos: [
    { src: '/fotos/caso-1.webp', w: 900, h: 1149, alt: 'Sorriso antes (acima) e depois (abaixo) da reabilitação', rotulo: 'Antes · Depois', orientacao: 'vertical' },
    { src: '/fotos/caso-3.webp', w: 900, h: 1126, alt: 'Sorriso antes (à esquerda) e depois (à direita) da reabilitação', rotulo: 'Antes · Depois', orientacao: 'vertical' },
    { src: '/fotos/caso-2.webp', w: 1200, h: 628, alt: 'Sorriso antes (à esquerda) e depois (à direita) da reabilitação', rotulo: 'Antes · Depois', orientacao: 'horizontal' },
  ],

  // Áreas do perfil ("reabilitação oral" e "reabilitação estética").
  // Serviços específicos: CONFIRMAR COM O CLIENTE antes de incluir.
  areas: [
    {
      nome: 'Reabilitação oral',
      linha: 'Cuidado com a mastigação e o conforto no dia a dia.',
    },
    {
      nome: 'Reabilitação estética',
      linha: 'Forma, proporção e tom pensados para o seu rosto.',
    },
  ],

  passos: [
    { titulo: 'Conversa', linha: 'Você conta o que incomoda pelo WhatsApp.' },
    { titulo: 'Avaliação', linha: 'Encontro presencial, com hora marcada.' },
    { titulo: 'Plano', linha: 'As opções explicadas com calma, sem pressa.' },
  ],

  // Atributos da ficha do Google
  espaco: [
    'Atendimento com hora marcada',
    'Entrada e banheiro acessíveis',
    'Estacionamento gratuito no local',
    'Crédito, débito e aproximação',
    'Espaço acolhedor para todas as pessoas',
  ],
}

export function waLink(mensagem: string = CONFIG.mensagemPadrao): string {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`
}

export function waArea(area: string): string {
  return waLink(
    `Olá, Matheus! Vi o site do Laboratório Tonon e gostaria de agendar uma avaliação de ${area.toLowerCase()}.`,
  )
}
