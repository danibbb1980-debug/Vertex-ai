/**
 * Todos os dados do site ficam aqui.
 * Itens com "CONFIRMAR COM A CLÍNICA" vieram da ficha do Google, do Instagram
 * ou de material antigo e precisam ser validados antes de o site ir ao ar.
 * Na tela, eles aparecem com a marcação "a confirmar" enquanto `rascunho` = true.
 */

export type SecaoId =
  | 'consultorio'
  | 'areas'
  | 'atendimentos'
  | 'paraQuem'
  | 'comoFunciona'
  | 'profissional'
  | 'estrutura'
  | 'avaliacoes'
  | 'faq'
  | 'contato'
  | 'ctaFinal'

export type Atendimento = {
  id: string
  titulo: string
  /** palavra do título que vai em itálico */
  destaque?: string
  resumo: string
  pontos: string[]
  /** trecho usado na mensagem do WhatsApp */
  mensagem: string
  mostrar: boolean
  confirmar?: boolean
}

export const CONFIG = {
  /* ------------------------------------------------------------------ */
  /* Modo rascunho                                                       */
  /* ------------------------------------------------------------------ */
  /** true: mostra a faixa de rascunho e as marcações "a confirmar". */
  rascunho: true,
  textoRascunho: 'Rascunho para avaliação. Informações sujeitas a confirmação.',

  /** URL absoluta usada em canonical, og:url e og:image. Nunca localhost. */
  siteUrl: 'https://dr-gustavo-borges-rascunho.vercel.app',

  /* ------------------------------------------------------------------ */
  /* Seções (true = aparece, false = some)                               */
  /* ------------------------------------------------------------------ */
  secoes: {
    consultorio: true,
    areas: true,
    atendimentos: true,
    paraQuem: true,
    comoFunciona: true,
    profissional: true,
    estrutura: true,
    avaliacoes: false, // liga junto com mostrarNotaGoogle
    faq: true,
    contato: true,
    ctaFinal: true,
  } satisfies Record<SecaoId, boolean>,

  /** Só exibir especialidades com registro comprovado no CRO. */
  mostrarEspecialidades: false,
  especialidades: ['[ESPECIALIDADE REGISTRADA NO CRO, A CONFIRMAR]'],

  /** Nota do Google: só com avaliações reais. Sem texto de depoimentos. */
  mostrarNotaGoogle: false,
  notaGoogle: { nota: '', total: '' }, // CONFIRMAR COM A CLÍNICA

  /* ------------------------------------------------------------------ */
  /* Identificação                                                       */
  /* ------------------------------------------------------------------ */
  profissional: {
    nome: 'Dr. Gustavo Borges Andrade',
    nomeCurto: 'Dr. Gustavo',
    assinatura: 'Gustavo Borges Andrade',
    titulo: 'Cirurgião-Dentista',
    cro: 'CRO-MG 22797', // CONFIRMAR COM A CLÍNICA
    iniciais: 'GB',
  },
  /** Nome derivado do Instagram. CONFIRMAR COM A CLÍNICA o nome oficial.
   *  Uma peça antiga usa "Clínica Odontológica RT Dr. Gustavo Borges Andrade". */
  consultorio: 'Clínica Dr. Gustavo Odontologia',
  /** Registro do estabelecimento visto em peça antiga. CONFIRMAR COM A CLÍNICA. */
  registroEstabelecimento: 'EPAO-M-4825',

  /* ------------------------------------------------------------------ */
  /* Contato                                                             */
  /* ------------------------------------------------------------------ */
  whatsapp: '5535991997211',
  whatsappExibicao: '(35) 99199-7211',
  telefone: '553532917033',
  telefoneExibicao: '(35) 3291-7033',
  email: 'clinicadrgustavoodontologia@gmail.com',
  instagram: {
    url: 'https://www.instagram.com/clinicadrgustavoodontologia/',
    usuario: '@clinicadrgustavoodontologia',
  },
  mensagemWhatsApp: 'Olá! Vi o site do Dr. Gustavo e gostaria de agendar uma avaliação.',

  /* ------------------------------------------------------------------ */
  /* Endereço (ficha do Google, CONFIRMAR COM A CLÍNICA)                 */
  /* ------------------------------------------------------------------ */
  endereco: {
    rua: 'Av. Governador Valadares, 1210',
    bairro: 'Jardim São Carlos',
    cidade: 'Alfenas',
    uf: 'MG',
    cep: '37137-160',
  },
  mapsUrl: 'https://maps.app.goo.gl/3r3tFfS4EmrDU8H49',
  mapsEmbedUrl:
    'https://www.google.com/maps?q=Av.+Governador+Valadares,+1210+-+Jardim+S%C3%A3o+Carlos,+Alfenas+-+MG,+37137-160&output=embed',

  /* ------------------------------------------------------------------ */
  /* Horários (ficha do Google, CONFIRMAR COM A CLÍNICA, inclusive a     */
  /* segunda-feira, que apareceu com o rótulo de feriado)                */
  /* ------------------------------------------------------------------ */
  horarios: [
    { dia: 'Segunda-feira', schema: 'Monday', turnos: [['08:00', '12:00'], ['14:00', '19:00']] },
    { dia: 'Terça-feira', schema: 'Tuesday', turnos: [['08:00', '12:00'], ['14:00', '19:00']] },
    { dia: 'Quarta-feira', schema: 'Wednesday', turnos: [['08:00', '12:00'], ['14:00', '19:00']] },
    { dia: 'Quinta-feira', schema: 'Thursday', turnos: [['08:00', '12:00'], ['14:00', '17:00']] },
    { dia: 'Sexta-feira', schema: 'Friday', turnos: [['08:00', '12:00'], ['14:00', '19:00']] },
    { dia: 'Sábado', schema: 'Saturday', turnos: [] },
    { dia: 'Domingo', schema: 'Sunday', turnos: [] },
  ] as { dia: string; schema: string; turnos: [string, string][] }[],
  observacaoHorario: 'Atendimento com hora marcada. Horários podem variar em feriados.',

  /* ------------------------------------------------------------------ */
  /* Estrutura (ficha do Google, CONFIRMAR COM A CLÍNICA)                */
  /* ------------------------------------------------------------------ */
  acessibilidade: [
    'Entrada acessível para cadeirantes',
    'Banheiro acessível para cadeirantes',
    'Estacionamento acessível para cadeirantes',
  ],
  pagamentos: ['Cartão de crédito', 'Cartão de débito', 'Pagamento por aproximação (NFC)'],

  /* ------------------------------------------------------------------ */
  /* Fotos                                                               */
  /* Foto do doutor recortada de uma peça antiga (baixa resolução).      */
  /* Substituir por foto original em alta. Fotos do consultório: vazias. */
  /* ------------------------------------------------------------------ */
  fotos: {
    doutor: {
      avif: '/fotos/dr-gustavo.avif',
      webp: '/fotos/dr-gustavo.webp',
      largura: 292,
      altura: 640,
      alt: 'Dr. Gustavo Borges Andrade, de jaleco branco, sorrindo, em retrato no consultório',
    } as { avif: string; webp: string; largura: number; altura: number; alt: string } | null,
    consultorio: null as { src: string; alt: string } | null,
  },
  ogImage: '/og.jpg' as string | null,

  /* ------------------------------------------------------------------ */
  /* Atendimentos (categorias do Google, CONFIRMAR COM A CLÍNICA)        */
  /* ------------------------------------------------------------------ */
  atendimentos: [
    {
      id: 'implantes',
      titulo: 'Implantes dentários',
      destaque: 'Implantes',
      resumo:
        'O implante substitui a raiz de um dente perdido e serve de base para uma nova coroa. Antes de indicar, é preciso avaliar a gengiva, o osso e a saúde geral.',
      pontos: ['Avaliação clínica e exames de imagem', 'Planejamento explicado etapa por etapa'],
      mensagem: 'implantes dentários',
      mostrar: true,
    },
    {
      id: 'protese-sobre-implante',
      titulo: 'Prótese sobre implante',
      destaque: 'Prótese',
      resumo:
        'Quando faltam vários ou todos os dentes de uma arcada, uma prótese fixa pode ser apoiada sobre implantes, no modelo conhecido como protocolo.',
      pontos: ['Considera mordida, exames e rotina de higiene', 'Orientação sobre cuidados e retornos'],
      mensagem: 'prótese sobre implante (protocolo)',
      mostrar: true,
    },
    {
      id: 'ortodontia',
      titulo: 'Ortodontia',
      destaque: 'Ortodontia',
      resumo:
        'Aparelhos fixos e removíveis ajudam a corrigir a posição dos dentes e o encaixe entre as arcadas. O tipo de aparelho é definido na avaliação, caso a caso.',
      pontos: ['Aparelhos fixos e removíveis', 'Consultas de manutenção com hora marcada'],
      mensagem: 'ortodontia (aparelhos)',
      mostrar: true,
    },
    {
      id: 'endodontia',
      titulo: 'Endodontia',
      destaque: 'Endodontia',
      resumo:
        'O tratamento de canal cuida da parte interna do dente quando a polpa está inflamada ou infectada, com o objetivo de manter o dente natural na boca.',
      pontos: ['Indicado após exame clínico e radiográfico', 'Orientação sobre a restauração depois do canal'],
      mensagem: 'tratamento de canal (endodontia)',
      mostrar: true,
    },
    {
      id: 'clareamento',
      titulo: 'Clareamento dental',
      destaque: 'Clareamento',
      resumo:
        'O clareamento atua na cor dos dentes com produtos próprios, sob orientação profissional. Antes, verifica-se a saúde dos dentes e da gengiva e se há indicação.',
      pontos: ['Avaliação prévia obrigatória', 'Orientações de uso e cuidados'],
      mensagem: 'clareamento dental',
      mostrar: true,
    },
    {
      id: 'lentes',
      titulo: 'Lentes de contato dentais',
      destaque: 'Lentes',
      resumo:
        'Lâminas finas fixadas na face da frente dos dentes para ajustes de forma, cor e proporção. A indicação depende dos dentes, da gengiva e da mordida.',
      pontos: ['Planejamento da forma antes de começar', 'Cuidados de manutenção explicados'],
      mensagem: 'lentes de contato dentais',
      mostrar: true,
    },
    {
      id: 'estetica-orofacial',
      titulo: 'Procedimentos estéticos orofaciais',
      destaque: 'estéticos',
      resumo:
        'Procedimentos voltados à estética e à função da região da boca e da face, dentro dos limites da atuação odontológica. Disponibilidade e indicação são definidas em consulta.',
      pontos: ['Informação esclarecida em consulta', 'Indicação conforme avaliação individual'],
      mensagem: 'procedimentos estéticos orofaciais',
      mostrar: true,
      confirmar: true, // CONFIRMAR COM A CLÍNICA se é oferecido e em que termos
    },
  ] as Atendimento[],
}

export type Config = typeof CONFIG
