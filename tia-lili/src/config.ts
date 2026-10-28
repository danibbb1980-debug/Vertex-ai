/**
 * TODOS os dados do site ficam aqui.
 * Fontes: ficha do Google Maps e bio do Instagram (@tialiliodontopediatra).
 * Itens marcados com "CONFIRMAR COM A CLÍNICA" aparecem no site como placeholder visível
 * e precisam ser validados pela doutora antes de o site sair do modo rascunho.
 */

export type ChaveSecao =
  | "consultorio"
  | "faixa"
  | "atendimento"
  | "sedacaoHospitalar"
  | "paraOsPais"
  | "primeiraConsulta"
  | "profissional"
  | "estrutura"
  | "avaliacoes"
  | "duvidas"
  | "contato"
  | "ctaFinal";

export const CONFIG = {
  /** Faixa "Rascunho para avaliação" no topo. Para publicar de verdade, veja o README (há também noindex em robots.txt, _headers e vercel.json). */
  rascunho: true,

  /** URL absoluta do site publicado, usada em canonical, og:url e og:image. Nunca use localhost. */
  siteUrl: "https://tia-lili-rascunho-v2.vercel.app",

  nome: "Dra. Liliane Ormeneze",
  apelido: "Tia Lili",
  profissao: "Cirurgiã-Dentista",
  // CONFIRMAR COM A CLÍNICA: número do CRO-MG não informado.
  cro: "CRO-MG [A CONFIRMAR]",
  // CONFIRMAR COM A CLÍNICA: nome do consultório não informado.
  nomeConsultorio: "[NOME DO CONSULTÓRIO, A CONFIRMAR]",

  /** Só ligue depois que a doutora comprovar o registro de especialidade no CRO. */
  mostrarEspecialidades: false,
  // CONFIRMAR COM A CLÍNICA E COMPROVAR
  especialidade: "[ESPECIALIDADE REGISTRADA NO CRO, A CONFIRMAR]",
  /** Descrição usada enquanto a especialidade não é confirmada (sem a palavra "especialista"). */
  descricaoAtendimento: "odontologia para bebês, crianças e adolescentes",

  /** Bio do Instagram: "habilitada em sedação medicamentosa e óxido nitroso". CONFIRMAR COM A CLÍNICA E COMPROVAR. */
  mostrarSedacao: false,
  /** Bio do Instagram: "atendimento hospitalar". CONFIRMAR COM A CLÍNICA E COMPROVAR. */
  mostrarHospitalar: false,
  /** Só ligue se houver nota real do Google confirmada. Sem texto de depoimentos. */
  mostrarNotaGoogle: false,
  notaGoogle: { nota: "", totalAvaliacoes: "" },

  whatsapp: "5535998112645",
  whatsappExibicao: "(35) 99811-2645",
  telefoneSchema: "+55-35-99811-2645",

  instagram: {
    url: "https://www.instagram.com/tialiliodontopediatra/",
    usuario: "@tialiliodontopediatra",
  },

  maps: {
    link: "https://maps.app.goo.gl/vaEqDC7nZ2dKpBgZ6",
    embed:
      "https://www.google.com/maps?q=R.+Para%C3%ADba,+356+-+Centro,+Po%C3%A7os+de+Caldas+-+MG,+37701-022&output=embed",
  },

  // CONFIRMAR COM A CLÍNICA (dados da ficha do Google)
  endereco: {
    rua: "R. Paraíba, 356",
    bairro: "Centro",
    cidade: "Poços de Caldas",
    uf: "MG",
    cep: "37701-022",
  },

  // CONFIRMAR COM A CLÍNICA (ficha do Google; inclusive a segunda-feira, que apareceu como "Dia de Finados")
  horarios: [
    { dias: "Segunda a sexta", periodos: ["08h às 12h", "14h às 18h"] },
    { dias: "Sábado e domingo", periodos: ["Fechado"] },
  ],
  horariosSchema: [
    { dias: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], abre: "08:00", fecha: "12:00" },
    { dias: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], abre: "14:00", fecha: "18:00" },
  ],
  observacaoHorarios: "Horários podem variar em feriados.",

  pagamentos: ["Cartão de crédito", "Cartão de débito", "Pagamento por aproximação"],

  mensagens: {
    geral: "Olá! Vi o site da Tia Lili e gostaria de agendar uma avaliação para meu filho(a).",
    bebe: "Olá! Vi o site da Tia Lili e gostaria de agendar uma avaliação para meu bebê.",
    crianca: "Olá! Vi o site da Tia Lili e gostaria de agendar uma avaliação para minha criança.",
    adolescente: "Olá! Vi o site da Tia Lili e gostaria de agendar uma avaliação para meu filho(a) adolescente.",
  },

  /** Liga/desliga cada seção. Para uma versão curta, desligue faixa, paraOsPais, estrutura e duvidas. */
  secoes: {
    consultorio: true,
    faixa: true,
    atendimento: true,
    sedacaoHospitalar: true, // só aparece se mostrarSedacao ou mostrarHospitalar = true
    paraOsPais: true,
    primeiraConsulta: true,
    profissional: true,
    estrutura: true,
    avaliacoes: true, // só aparece se mostrarNotaGoogle = true
    duvidas: true,
    contato: true,
    ctaFinal: true,
  } satisfies Record<ChaveSecao, boolean>,

  /** Fotos reais (sem pacientes). Arquivos em public/fotos, gerados por `npm run imagens`. */
  fotos: {
    doutora: { arquivo: "doutora", alt: "Dra. Liliane Ormeneze, a Tia Lili, sorrindo de braços cruzados no consultório" },
    recepcao: { arquivo: "recepcao", alt: "Recepção do consultório, com balcão branco e um painel de brinquedos na parede" },
    consultorio: { arquivo: "consultorio", alt: "Sala de atendimento com cadeira odontológica, tela na parede e janela com vista da cidade" },
    fachada: { arquivo: "fachada", alt: "Fachada do prédio na Rua Paraíba, 356, com pergolado e paredes vazadas" },
  },
} as const;

export const enderecoCompleto = `${CONFIG.endereco.rua} - ${CONFIG.endereco.bairro}, ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}, ${CONFIG.endereco.cep}`;

export function linkWhatsApp(mensagem: string = CONFIG.mensagens.geral) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

export function secaoAtiva(chave: ChaveSecao) {
  if (chave === "sedacaoHospitalar") return CONFIG.secoes.sedacaoHospitalar && (CONFIG.mostrarSedacao || CONFIG.mostrarHospitalar);
  if (chave === "avaliacoes") return CONFIG.secoes.avaliacoes && CONFIG.mostrarNotaGoogle && !!CONFIG.notaGoogle.nota;
  return CONFIG.secoes[chave];
}
