/**
 * TODOS os dados do site ficam aqui.
 *
 * Fontes: ficha do Google Maps e Instagram da clínica.
 * Tudo marcado com PENDENTE vira um aviso visível "[A CONFIRMAR]" no site.
 * Procure por "CONFIRMAR COM A CLÍNICA" para ver o que falta validar.
 */

/** Valor ainda não confirmado pela clínica. Aparece no site como "[A CONFIRMAR]". */
export const PENDENTE = '[A CONFIRMAR]' as const
export type Talvez<T> = T | typeof PENDENTE
export const pendente = (v: unknown): v is typeof PENDENTE => v === PENDENTE

export const CONFIG = {
  /** Modo rascunho: mostra a faixa de aviso e marca a página como noindex.
   *  Ao desligar, ajuste também public/robots.txt, public/_headers e vercel.json (ver README). */
  rascunho: true,

  /** URL pública final (sem barra no fim). Usada em canonical e og:url. Nunca localhost. */
  siteUrl: 'https://pronto-socorro-dentario-rascunho.vercel.app',

  // CONFIRMAR COM A CLÍNICA: nome oficial da clínica e do responsável.
  nome: 'Pronto Socorro Dentário',
  nomeCompleto: 'Pronto Socorro Dentário | Alfenas',
  nomeOficialConfirmado: false,

  cidade: 'Alfenas',
  uf: 'MG',

  // CONFIRMAR COM A CLÍNICA: endereço vindo da ficha do Google.
  endereco: {
    rua: 'R. João Paulino Damasceno, 268',
    bairro: 'Centro',
    cidade: 'Alfenas',
    uf: 'MG',
    cep: '37130-000',
    referencia: 'Próximo ao Pronto Socorro da Santa Casa',
    confirmado: false,
  },

  mapsUrl: 'https://maps.app.goo.gl/CccY3QmAm5bJboRJ6',
  /** Mapa embutido: desligado até o endereço ser confirmado
   *  (o mapa do Google também grava cookies, e o rascunho não usa cookies). */
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

  // CONFIRMAR COM A CLÍNICA: a ficha mostrou "Atendimento 24 horas" na terça-feira; os outros dias não foram vistos.
  horario24h: true,
  horarioObservacao: 'Confirme a disponibilidade pelo WhatsApp.',
  feriados: PENDENTE as Talvez<string>,

  // CONFIRMAR COM A CLÍNICA: frases da ficha do Google.
  frasesFicha: ['Urgência Odontológica 24h', 'Atendimento para todas as idades'],

  // CONFIRMAR COM A CLÍNICA: responsável técnico e CRO (obrigatório na versão final).
  responsavelTecnico: {
    nome: PENDENTE as Talvez<string>,
    cro: PENDENTE as Talvez<string>,
  },

  // CONFIRMAR COM A CLÍNICA: equipe. Só nome, "Cirurgião(ã)-dentista" e CRO confirmados.
  equipe: [
    { nome: PENDENTE as Talvez<string>, funcao: 'Cirurgião(ã)-dentista', cro: PENDENTE as Talvez<string> },
    { nome: PENDENTE as Talvez<string>, funcao: 'Cirurgião(ã)-dentista', cro: PENDENTE as Talvez<string> },
  ],

  // CONFIRMAR COM A CLÍNICA: estrutura.
  estrutura: {
    convenios: PENDENTE as Talvez<string>,
    pagamento: PENDENTE as Talvez<string>,
    estacionamento: PENDENTE as Talvez<string>,
    acessibilidade: PENDENTE as Talvez<string>,
  },

  /** Fotos reais da clínica em public/fotos/ (WebP). Vazio = blocos reservados. */
  fotos: {
    hero: '' as string,
    galeria: [] as { src: string; alt: string }[],
  },

  /** Nota do Google: só ligar com nota real e autorização. Nunca exibir texto de avaliações. */
  mostrarNotaGoogle: false,
  notaGoogle: { nota: PENDENTE as Talvez<string>, total: PENDENTE as Talvez<string> },

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

/** Atendimentos listados na ficha do Google. CONFIRMAR COM A CLÍNICA. */
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
