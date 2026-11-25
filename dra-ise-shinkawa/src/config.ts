/**
 * Todos os dados do site. Campo vazio ou ausente = o bloco não é renderizado.
 * Fonte: Google Maps, Instagram e material de divulgação da profissional.
 */
export type Atendimento = { id: string; nome: string; descricao: string; ativo: boolean };
export type Foto = { src: string; srcSmall?: string; w: number; h: number; alt: string; legenda?: string };
export type Caso = { antes: string; depois: string; w: number; h: number; alt: string };

export const CONFIG = {
  rascunho: true,
  intro: false,
  siteUrl: 'https://dra-ise-shinkawa-rascunho.vercel.app',

  nome: 'Dra. Ise Shinkawa',
  descritor: 'Especialista em Cirurgia e Traumatologia Bucomaxilofacial',
  registros: 'CROSP 97439 | CROMG 33342',
  cidade: 'Limeira',
  uf: 'SP',

  // logo recriado em vetor a partir de imagem de baixa resolução; substituir pelo vetor original quando houver
  logo: { claro: '/logo.svg', escuro: '/logo-marinho.svg', monograma: '/monograma.svg' },

  endereco: {
    rua: 'Av. Antonio Ometto, nº 606 B',
    bairro: 'Vila Claudia',
    cidade: 'Limeira',
    uf: 'SP',
    cep: '13480-470',
    maps: 'https://maps.app.goo.gl/4AKanYbRhSgPwgHo7',
    rota: 'https://www.google.com/maps/dir/?api=1&destination=Av.%20Antonio%20Ometto%2C%20606%20B%2C%20Vila%20Claudia%2C%20Limeira%20-%20SP%2C%2013480-470',
    embed: 'https://www.google.com/maps?q=Av.%20Antonio%20Ometto%2C%20606%20B%2C%20Vila%20Claudia%2C%20Limeira%20-%20SP%2C%2013480-470&output=embed',
  },

  usarWhatsapp: true,
  whatsapp: '5519997128622',
  whatsappExibicao: '(19) 99712-8622',
  telefone: '',
  email: '',

  instagram: { usuario: '@draiseshinkawa', url: 'https://www.instagram.com/draiseshinkawa/' },

  fuso: 'America/Sao_Paulo',
  // dia da semana: 0 = domingo … 6 = sábado; null = fechado
  horarios: {
    0: null,
    1: { abre: '08:00', fecha: '17:00' },
    2: { abre: '08:00', fecha: '17:00' },
    3: { abre: '08:00', fecha: '17:00' },
    4: { abre: '08:00', fecha: '17:00' },
    5: { abre: '08:00', fecha: '17:00' },
    6: null,
  } as Record<number, { abre: string; fecha: string } | null>,
  avisoHorario: 'Horários podem variar em feriados.',

  atendimentos: [
    { id: 'avaliacao', nome: 'Avaliação', ativo: true,
      descricao: 'Primeira conversa e avaliação individual com a Dra. Ise. É por ela que todo atendimento começa.' },
    { id: 'ctbmf', nome: 'Cirurgia e Traumatologia Bucomaxilofacial', ativo: true,
      descricao: 'Especialidade odontológica que cuida da face, da boca e dos maxilares. A indicação de cada caso depende de avaliação individual.' },
    { id: 'estetica', nome: 'Estética facial', ativo: true,
      descricao: 'Atendimento voltado à face, sempre a partir de uma avaliação individual com a Dra. Ise.' },
    // Desligados até a Dra. Ise confirmar como podem ser anunciados:
    { id: 'rino', nome: 'Rinomodelação', ativo: false, descricao: '' },
    { id: 'rejuv', nome: 'Rejuvenescimento facial', ativo: false, descricao: '' },
    { id: 'laser', nome: 'Laser', ativo: false, descricao: '' },
  ] as Atendimento[],

  fotos: {
    retrato: { src: '/img/retrato-2.webp', srcSmall: '/img/retrato-2-720.webp', w: 1155, h: 1733,
      alt: 'Retrato da Dra. Ise Shinkawa, sentada, com blusa de estampa geométrica e calça vinho, sobre fundo marrom.' } as Foto | null,
    retrato2: { src: '/img/retrato-1.webp', srcSmall: '/img/retrato-1-720.webp', w: 1122, h: 1683,
      alt: 'Dra. Ise Shinkawa de perfil, com os braços cruzados, em retrato de estúdio.' } as Foto | null,
    consultorio: [
      { src: '/img/consultorio-recepcao.webp', srcSmall: '/img/consultorio-recepcao-720.webp', w: 1170, h: 1528,
        alt: 'Mesa de consulta em mármore com poltronas claras, estante iluminada e luminária em espiral.', legenda: 'Mesa de consulta' },
      { src: '/img/consultorio-mesa.webp', srcSmall: '/img/consultorio-mesa-720.webp', w: 1170, h: 1528,
        alt: 'Sala de consulta com mesa oval, espelho de mesa, painel de madeira em arco e quadro na parede.', legenda: 'Sala de consulta' },
      { src: '/img/consultorio-sala.webp', srcSmall: '/img/consultorio-sala-720.webp', w: 1170, h: 1528,
        alt: 'Sala de atendimento com cadeira clínica, foco de luz, espelho de chão e bancada com pia.', legenda: 'Sala de atendimento' },
      { src: '/img/consultorio-bancada.webp', srcSmall: '/img/consultorio-bancada-720.webp', w: 1170, h: 1528,
        alt: 'Bancada clínica em L com armários de madeira, carrinho de apoio e desfibrilador.', legenda: 'Bancada e equipamentos de apoio' },
    ] as Foto[],
  },

  // Imagens publicadas pela própria Dra. Ise. Exigem autorização dela e consentimento de cada paciente antes da publicação definitiva.
  casos: [1, 2, 3, 4, 5, 6].map((n) => ({
    antes: `/img/caso-${n}-antes.webp`,
    depois: `/img/caso-${n}-depois.webp`,
    w: 583, h: 1458,
    alt: `Caso ${n}, perfil do rosto`,
  })) as Caso[],

  secoes: {
    sobre: true,
    atendimentos: true,
    casos: true,
    avaliacao: true,
    consultorio: true,
    horarios: true,
    comoFunciona: true,
    duvidas: true,
    localizacao: true,
    agendar: true,
    ctaFinal: true,
  },
};

export const atendimentosAtivos = () => CONFIG.atendimentos.filter((a) => a.ativo && a.descricao);

export const waLink = (texto: string) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;

export const MSG_GERAL = 'Olá! Vi o site da Dra. Ise Shinkawa e gostaria de agendar uma avaliação.';
export const msgAtendimento = (nome: string) =>
  nome === 'Avaliação' ? MSG_GERAL : `Olá! Vi o site da Dra. Ise Shinkawa e gostaria de agendar uma avaliação de ${nome}.`;
