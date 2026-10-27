/**
 * TODOS os dados do site ficam aqui.
 *
 * Fontes: ficha do Google Maps (incluindo a aba "Sobre"), fotos da ficha e Instagram da clínica.
 * Informação que a clínica não divulgou fica de fora do site (sem marcador de pendência).
 */


export const CONFIG = {
  /** Modo rascunho: mostra a faixa de aviso e marca a página como noindex.
   *  Ao desligar, ajuste também public/robots.txt, public/_headers e vercel.json (ver README). */
  rascunho: true,

  /** URL pública final (sem barra no fim). Usada em canonical e og:url. Nunca localhost. */
  siteUrl: 'https://pronto-socorro-dentario-rascunho.vercel.app',

  // Nome usado no Google Maps e no Instagram. Na fachada a placa diz "Referência Saúde Odonto".
  nome: 'Pronto Socorro Dentário',
  nomeCompleto: 'Pronto Socorro Dentário | Alfenas',

  cidade: 'Alfenas',
  uf: 'MG',

  // Endereço da ficha do Google; o número 268 aparece na fachada.
  endereco: {
    rua: 'R. João Paulino Damasceno, 268',
    bairro: 'Centro',
    cidade: 'Alfenas',
    uf: 'MG',
    cep: '37130-000',
    referencia: 'Próximo ao Pronto Socorro da Santa Casa',
    /** O que a pessoa vê ao chegar (foto da fachada). */
    fachada: 'Na fachada, procure a placa "Referência Saúde Odonto" e o número 268.',
  },

  mapsUrl: 'https://maps.app.goo.gl/CccY3QmAm5bJboRJ6',
  /** Mapa embutido do Google: desligado porque grava cookies e o site não usa cookies. */
  mostrarMapa: false,

  instagram: {
    url: 'https://www.instagram.com/prontosocorro.dentario/',
    usuario: '@prontosocorro.dentario',
  },

  /** Só dígitos, com DDI e DDD. */
  whatsapp: '5535997415858',
  /** Telefone para ligação: o mesmo número, salvo indicação. */
  telefone: '+5535997415858',
  telefoneExibicao: '(35) 99741-5858',

  // A ficha do Google mostrou "Atendimento 24 horas"; por isso a observação de confirmar pelo WhatsApp.
  horario24h: true,
  horarioObservacao: 'Confirme a disponibilidade pelo WhatsApp.',
  /** Ficha do Google: "Necessário fazer agendamento". */
  agendamento: true,

  frasesFicha: ['Urgência Odontológica 24h', 'Atendimento para todas as idades'],

  // Fonte: legenda da foto no Instagram ("R. T.: Dr. Antônio Alves de Faria Filho - CROMG 3068").
  responsavelTecnico: {
    nome: 'Dr. Antônio Alves de Faria Filho',
    cro: '3068',
  },

  /** Equipe: só profissionais com nome e CRO conhecidos. */
  equipe: [
    { nome: 'Dr. Antônio Alves de Faria Filho', funcao: 'Cirurgião-dentista · Responsável técnico', cro: '3068', foto: '/fotos/dr-antonio-rosto.webp' },
  ],

  /** Estrutura (ficha do Google, aba "Sobre"). Item vazio ('') não aparece no site. */
  estrutura: {
    acessibilidade: 'Entrada, banheiro e estacionamento com acessibilidade para pessoas em cadeira de rodas.',
    estacionamento: 'Estacionamento gratuito na rua.',
    // "Planos de pagamento" ficou de fora: o CFO não permite anunciar parcelamento.
    pagamento: 'Cartão de crédito, cartão de débito e pagamento por aproximação (NFC).',
    comodidades: 'Banheiro e sala de amamentação.',
    convenios: '',
  },

  /** Fotos reais da clínica em public/fotos/ (WebP). Nunca fotos de pacientes. */
  fotos: {
    hero: '/fotos/dr-antonio.webp',
    heroAlt: 'Dr. Antônio Alves de Faria Filho, de jaleco branco, sentado ao lado da cadeira odontológica no consultório',
    recepcao: { src: '/fotos/recepcao.webp', alt: 'Recepção da clínica, com balcão de atendimento, cadeiras de espera e a porta de entrada ao fundo', w: 1100, h: 596 },
    fachada: { src: '/fotos/fachada.webp', alt: 'Fachada da clínica no número 268, com a placa Referência Saúde Odonto e a entrada com rampa e corrimão azul', w: 1100, h: 731 },
  },

  /** Nota do Google: só ligar com nota real e autorização. Nunca exibir texto de avaliações. */
  mostrarNotaGoogle: false,
  notaGoogle: { nota: '', total: '' },

  mensagens: {
    urgencia: 'Olá! Vi o site do Pronto Socorro Dentário e preciso de atendimento de urgência.',
    avaliacao: 'Olá! Vi o site e gostaria de agendar uma avaliação.',
  },

  /** Liga/desliga cada seção. */
  secoes: {
    marquee: true,
    quandoProcurar: true,
    primeirosCuidados: true,
    atendimentos: true,
    comoFunciona: true,
    clinica: true,
    estrutura: true,
    avaliacoesGoogle: false,
    faq: true,
    contato: true,
    ctaFinal: true,
  },
}

/** Atendimentos listados na ficha do Google (aba Sobre, "Opções no menu"). */
export const ATENDIMENTOS = [
  {
    id: 'emergencia',
    titulo: 'Serviços de emergência',
    texto:
      'Para dor forte, dente quebrado, trauma ou outras situações que não podem esperar. O primeiro passo é entender o seu caso e orientar o que fazer.',
    mensagem: 'Olá! Vi o site do Pronto Socorro Dentário e preciso de atendimento de urgência.',
  },
  {
    id: 'pediatrico',
    titulo: 'Atendimento pediátrico',
    texto:
      'Cuidado odontológico para crianças, com conversa clara com a família e atenção ao momento de cada criança.',
    mensagem: 'Olá! Vi o site e gostaria de saber sobre o atendimento pediátrico.',
  },
  {
    id: 'estetica',
    titulo: 'Odontologia estética',
    texto:
      'Avaliação para quem quer cuidar da aparência do sorriso. As possibilidades são discutidas depois do exame, com explicação de cada etapa.',
    mensagem: 'Olá! Vi o site e gostaria de agendar uma avaliação de odontologia estética.',
  },
  {
    id: 'sedacao',
    titulo: 'Sedação odontológica',
    texto:
      'Recurso indicado conforme avaliação e protocolos de segurança, para alguns pacientes e procedimentos. A indicação é feita pelo profissional.',
    mensagem: 'Olá! Vi o site e gostaria de saber sobre a sedação odontológica.',
  },
] as const

export function waLink(mensagem: string = CONFIG.mensagens.urgencia) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`
}
export const telLink = `tel:${CONFIG.telefone}`
export const enderecoLinha = `${CONFIG.endereco.rua} - ${CONFIG.endereco.bairro}, ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}, ${CONFIG.endereco.cep}`
