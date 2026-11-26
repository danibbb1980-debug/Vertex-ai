// Todos os dados do site ficam aqui. Campo vazio ou ausente = o bloco não aparece.

export type Servico = { id: string; nome: string; descricao: string; ativo: boolean };
export type Dia = { dia: string; curto: string; idx: number; abre?: string; fecha?: string };
export type Foto = { arquivo: string; alt: string };
export type Grupo = { titulo: string; nota?: string; fotos: Foto[] };
export type Video = { arquivo: string; poster: string; legenda: string; alt: string };

export const CONFIG = {
  rascunho: true,
  intro: false,
  siteUrl: 'https://the-details-rascunho.vercel.app',

  nome: 'The Details | Estética Automotiva',
  marca: 'The Details',
  cidade: 'Poços de Caldas',
  uf: 'MG',

  endereco: {
    rua: 'Rua Dom Bosco, 445',
    bairro: 'Dom Bosco',
    cidade: 'Poços de Caldas',
    uf: 'MG',
    cep: '37704-105',
  },
  rotaUrl:
    'https://www.google.com/maps/dir/?api=1&destination=Rua%20Dom%20Bosco%2C%20445%2C%20Dom%20Bosco%2C%20Po%C3%A7os%20de%20Caldas%20-%20MG%2C%2037704-105',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=The%20Details%20Est%C3%A9tica%20Automotiva%20Rua%20Dom%20Bosco%20445%20Po%C3%A7os%20de%20Caldas',
  mapaEmbed:
    'https://www.google.com/maps?q=Rua%20Dom%20Bosco%2C%20445%2C%20Dom%20Bosco%2C%20Po%C3%A7os%20de%20Caldas%20-%20MG%2C%2037704-105&output=embed',

  usarWhatsapp: true,
  whatsapp: '5535984220508',
  whatsappExibicao: '(35) 98422-0508',
  telefone: '',
  email: '',
  proprietario: '',

  instagram: { usuario: '@_thedetails_', url: 'https://www.instagram.com/_thedetails_/' },

  fuso: 'America/Sao_Paulo',
  horarios: [
    { dia: 'Segunda-feira', curto: 'Seg', idx: 1, abre: '08:00', fecha: '18:00' },
    { dia: 'Terça-feira', curto: 'Ter', idx: 2, abre: '08:00', fecha: '18:00' },
    { dia: 'Quarta-feira', curto: 'Qua', idx: 3, abre: '08:00', fecha: '18:00' },
    { dia: 'Quinta-feira', curto: 'Qui', idx: 4, abre: '08:00', fecha: '18:00' },
    { dia: 'Sexta-feira', curto: 'Sex', idx: 5, abre: '08:00', fecha: '18:00' },
    { dia: 'Sábado', curto: 'Sáb', idx: 6, abre: '08:00', fecha: '12:00' },
    { dia: 'Domingo', curto: 'Dom', idx: 0 },
  ] as Dia[],
  avisoHorarios: 'Os horários podem variar em feriados.',

  servicos: [
    {
      id: 'carros',
      nome: 'Detalhamento de carros',
      descricao:
        'Cuidado detalhado do veículo, por dentro e por fora, combinado conforme a necessidade de cada carro. Você conta como ele está e o que gostaria, e o atendimento é definido pelo WhatsApp.',
      ativo: true,
    },
    {
      id: 'motos',
      nome: 'Detalhamento de motos',
      descricao:
        'O mesmo cuidado, para motos. Cada moto tem peças, acabamentos e cantos próprios, e o atendimento é combinado a partir do que ela precisa.',
      ativo: true,
    },
    { id: 'lavagem', nome: 'Lavagem', descricao: '', ativo: false },
    { id: 'higienizacao', nome: 'Higienização', descricao: '', ativo: false },
    { id: 'polimento', nome: 'Polimento', descricao: '', ativo: false },
    { id: 'vitrificacao', nome: 'Vitrificação', descricao: '', ativo: false },
  ] as Servico[],

  // Fotos e vídeos enviados pela The Details (public/media). Lista vazia = seção "Trabalhos" não aparece.
  videos: [
    {
      arquivo: '/media/espuma.mp4',
      poster: '/media/espuma-poster.webp',
      legenda: 'Antes e depois, no mesmo enquadramento.',
      alt: 'Hatch prata coberto de espuma no box da The Details, alternando com o carro já finalizado.',
    },
    {
      arquivo: '/media/sedan.mp4',
      poster: '/media/sedan-poster.webp',
      legenda: 'Pintura, interior e cofre do motor.',
      alt: 'Sedã grafite no box da The Details: reflexos no capô, painel interno e cofre do motor.',
    },
  ] as Video[],
  antesDepois: {
    titulo: 'Cofre do motor',
    antes: { arquivo: 'motor-antes', alt: 'Cofre do motor antes do atendimento, com poeira e sujeira acumulada.' },
    depois: { arquivo: 'motor-depois', alt: 'O mesmo cofre do motor depois do atendimento, limpo.' },
  } as { titulo: string; antes: Foto; depois: Foto } | null,
  trabalhos: [
    {
      titulo: 'SUV branco',
      fotos: [
        { arquivo: 'suv-branco-frente', alt: 'SUV branco de frente no box da The Details, com o letreiro da marca ao fundo.' },
        { arquivo: 'suv-branco-farol', alt: 'Detalhe do farol e da grade de um SUV branco.' },
        { arquivo: 'suv-branco-lateral', alt: 'Lateral traseira de um SUV branco sobre o piso amarelo e preto.' },
        { arquivo: 'suv-branco-traseira', alt: 'Lanterna traseira e para-choque de um SUV branco.' },
      ],
    },
    {
      titulo: 'SUV preto',
      fotos: [
        { arquivo: 'suv-preto-frente', alt: 'SUV preto de frente, com reflexos das luminárias no capô.' },
        { arquivo: 'suv-preto-capo', alt: 'Capô e farol de um SUV preto, com ilustração do carro no canto.' },
      ],
    },
    {
      titulo: 'Compacto cinza',
      fotos: [
        { arquivo: 'compacto-frente', alt: 'Compacto cinza de frente, com ilustração do carro no canto.' },
        { arquivo: 'compacto-grade', alt: 'Detalhe da faixa preta e do emblema de um compacto cinza.' },
        { arquivo: 'compacto-lanterna', alt: 'Lanterna traseira de um compacto cinza, com reflexos na lataria.' },
      ],
    },
    {
      titulo: 'SUV grafite',
      fotos: [
        { arquivo: 'suv-grafite-frente', alt: 'SUV grafite de frente no box da The Details.' },
        { arquivo: 'suv-grafite-grade', alt: 'Grade dianteira de um SUV grafite, vista de perto.' },
        { arquivo: 'suv-grafite-interior', alt: 'Interior de um SUV grafite: volante, painel e console.' },
        { arquivo: 'suv-grafite-noite', alt: 'SUV grafite com as luzes do box apagadas, com ilustração do carro no canto.' },
      ],
    },
  ] as Grupo[],

  secoes: {
    atendimentos: true,
    trabalhos: true,
    dePerto: true,
    silencio: true,
    comoFunciona: true,
    horarios: true,
    duvidas: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },
};

export const servicosAtivos = () => CONFIG.servicos.filter((s) => s.ativo);
export const enderecoLinha = () => {
  const e = CONFIG.endereco;
  return `${e.rua}, ${e.bairro}, ${e.cidade} - ${e.uf}, CEP ${e.cep}`;
};
