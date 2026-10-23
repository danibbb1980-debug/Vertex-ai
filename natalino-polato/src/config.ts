/**
 * Todos os dados do site ficam aqui. Edite este arquivo e rode `npm run build`.
 * Itens marcados "CONFIRMAR COM O ADVOGADO" ainda não foram validados por ele.
 */

export type Area = {
  titulo: string
  descricao: string
  /** Só aparece no site quando true. */
  confirmado: boolean
}

export const CONFIG = {
  /** Faixa "Rascunho para avaliação" no topo. Mude para false após a aprovação. */
  rascunho: true,

  /** URL pública do site (canonical, og:url, og:image). Nunca localhost. */
  siteUrl: 'https://natalino-polato-rascunho.vercel.app',

  // CONFIRMAR COM O ADVOGADO: nome completo como consta na OAB.
  nome: 'Natalino Polato',
  profissao: 'Advogado Criminalista',
  oab: 'OAB/SP 220.810',

  // CONFIRMAR COM O ADVOGADO: titulação "especialista em Direito Penal e Processo Penal".
  mostrarEspecialista: true,
  especialidade: 'Especialista em Direito Penal e Processo Penal',

  // CONFIRMAR COM O ADVOGADO: se deseja citar a docência (sem citar instituição).
  mostrarProfessor: false,

  // CONFIRMAR COM O ADVOGADO: se deseja citar o cargo na OAB (só na seção Sobre).
  mostrarCargoOAB: false,
  cargoOAB: 'Presidente da OAB Mogi Guaçu/SP (gestão 2025/2027)',

  /** WhatsApp principal, só dígitos com DDI. Usado em todos os botões. */
  whatsapp: '5519992477474',
  whatsappExibicao: '(19) 99247-7474',
  mensagemWhatsapp: 'Olá, Dr. Natalino! Vi seu site e gostaria de entrar em contato.',

  // CONFIRMAR COM O ADVOGADO: telefone fixo (ficha do Google).
  telefoneFixo: '(19) 3818-3551',
  telefoneFixoLink: '+551938183551',

  // CONFIRMAR COM O ADVOGADO: endereço (ficha do Google).
  endereco: {
    rua: 'R. Minas Gerais, 82',
    bairro: 'Jardim Centenário',
    cidade: 'Mogi Guaçu',
    uf: 'SP',
    cep: '13845-233',
  },

  // CONFIRMAR COM O ADVOGADO: horários (ficha do Google).
  horarios: [
    { dias: 'Segunda a sexta', horas: '09h00 às 17h30' },
    { dias: 'Sábado e domingo', horas: 'Fechado' },
  ],
  /** Mesmos horários em formato schema.org (JSON-LD). */
  horariosSchema: ['Mo-Fr 09:00-17:30'],

  // CONFIRMAR COM O ADVOGADO: se quer divulgar o Instagram no site.
  mostrarInstagram: false,
  instagram: 'https://www.instagram.com/natalino.polato',

  /** Áreas de atuação. Só as com `confirmado: true` aparecem. */
  areas: [
    {
      titulo: 'Direito Penal',
      descricao:
        'Análise jurídica de fatos que podem configurar infração penal, avaliação da tipicidade, das circunstâncias e das consequências legais, com orientação sobre direitos e deveres de quem é investigado ou acusado.',
      confirmado: true,
    },
    {
      titulo: 'Processo Penal',
      descricao:
        'Acompanhamento técnico das etapas do processo criminal, com atenção às garantias constitucionais, aos prazos, à produção de provas e aos meios de defesa previstos em lei.',
      confirmado: true,
    },
    // CONFIRMAR COM O ADVOGADO: as áreas abaixo só aparecem se confirmado = true.
    {
      titulo: 'Fase de inquérito',
      descricao:
        'Acompanhamento durante a investigação policial, incluindo depoimentos e acesso aos elementos já documentados no procedimento.',
      confirmado: false,
    },
    {
      titulo: 'Ação penal',
      descricao:
        'Atuação na defesa ao longo da ação penal, da resposta à acusação às alegações finais.',
      confirmado: false,
    },
    {
      titulo: 'Tribunal do Júri',
      descricao: 'Atuação em processos de competência do Tribunal do Júri.',
      confirmado: false,
    },
    {
      titulo: 'Recursos',
      descricao: 'Interposição e acompanhamento de recursos nas instâncias superiores.',
      confirmado: false,
    },
  ] satisfies Area[],

  /** Retrato. Deixe vazio ('') para mostrar o bloco "Foto do advogado (substituir)". */
  foto: {
    src: '/img/natalino-polato-150.webp',
    src2x: '/img/natalino-polato-300.webp',
    alt: 'Retrato de Natalino Polato, advogado criminalista, de colete azul-marinho e gravata',
  },
}

export const enderecoCompleto = `${CONFIG.endereco.rua} - ${CONFIG.endereco.bairro}, ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}, CEP ${CONFIG.endereco.cep}`

export const whatsappUrl = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.mensagemWhatsapp)}`

const mapsQuery = encodeURIComponent(
  `${CONFIG.endereco.rua}, ${CONFIG.endereco.bairro}, ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}, ${CONFIG.endereco.cep}`,
)
export const mapsEmbedUrl = `https://www.google.com/maps?q=${mapsQuery}&output=embed`
export const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`

export const areasVisiveis = CONFIG.areas.filter((a) => a.confirmado)
