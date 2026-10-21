/**
 * TODOS os dados do site ficam aqui.
 * Fontes: bio do Instagram, ficha do Google Maps e materiais de divulgação da própria doutora.
 * Itens marcados com "CONFIRMAR COM A DOUTORA" ainda precisam de validação.
 */

export type Unidade = {
  id: string;
  cidade: string;
  /** Nome da clínica/unidade. null = ainda não confirmado. */
  clinica: string | null;
  endereco: string | null;
  cep?: string;
  horarios: { dias: string; horas: string }[] | null;
  horariosConfirmados: boolean;
  telefone?: { rotulo: string; numero: string; tel: string };
  mapsUrl?: string;
  /** Endereço usado no mapa embutido (só quando houver endereço confirmado). */
  mapaEmbed?: string;
  observacao?: string;
};

export const CONFIG = {
  /** Faixa "Rascunho para avaliação". Mude para false quando a doutora aprovar. */
  rascunho: true,

  /** URL pública final (sem barra no fim). CONFIRMAR COM A DOUTORA: domínio definitivo. */
  siteUrl: "https://dra-beatryz-furlaneto.netlify.app",

  nome: "Dra. Beatryz Furlaneto",
  nomeCurto: "Beatryz Furlaneto",
  profissao: "Cirurgiã-dentista",
  cro: "CRO-SP 161388",
  /** Redação da bio do Instagram. */
  foco: "Clínica geral e odontopediatria",

  /**
   * Só ative depois de confirmar o registro de especialista em Odontopediatria no CRO.
   * CONFIRMAR COM A DOUTORA (registro de especialidade no CRO).
   */
  especialistaConfirmado: false,
  textoEspecialista: "Especialista em Odontopediatria",

  /** WhatsApp no formato internacional, só números. Mesmo telefone da ficha do Google. */
  whatsapp: "5519991872808",
  whatsappExibicao: "(19) 99187-2808",
  mensagemWhatsapp:
    "Olá, Dra. Beatryz! Vi seu site e gostaria de agendar uma avaliação para meu filho(a).",

  instagram: "https://www.instagram.com/beatryzfurlaneto_dentista",
  instagramUsuario: "@beatryzfurlaneto_dentista",
  googleMaps: "https://maps.app.goo.gl/vfU1UfNqisDrqQsf9",

  /** Fotos da doutora (sem pacientes). Troque os arquivos em public/fotos/. */
  fotos: {
    hero: {
      base: "/fotos/dra-jaleco-branco",
      alt: "Dra. Beatryz Furlaneto sorrindo, de jaleco branco, no consultório",
      largura: 1100,
      altura: 1425,
    },
    sobre: {
      base: "/fotos/dra-jaleco-estampado",
      alt: "Dra. Beatryz Furlaneto com jaleco e touca estampados para o atendimento infantil",
      largura: 1100,
      altura: 1373,
    },
    og: "/og-image.jpg",
  },

  unidades: [
    {
      id: "sao-joao",
      cidade: "São João da Boa Vista - SP",
      clinica: null,
      endereco: "R. Cel. José Procópio, 634 - Vila Conrado",
      cep: "13870-735",
      // Horários da ficha do Google. CONFIRMAR COM A DOUTORA.
      horarios: [
        { dias: "Segunda a sexta", horas: "8h às 20h" },
        { dias: "Sábado", horas: "8h às 12h" },
        { dias: "Domingo", horas: "Fechado" },
      ],
      horariosConfirmados: false,
      telefone: { rotulo: "WhatsApp", numero: "(19) 99187-2808", tel: "+5519991872808" },
      mapsUrl: "https://maps.app.goo.gl/vfU1UfNqisDrqQsf9",
      mapaEmbed: "R. Cel. José Procópio, 634 - Vila Conrado, São João da Boa Vista - SP, 13870-735",
    },
    {
      id: "artur-nogueira",
      cidade: "Artur Nogueira - SP",
      clinica: "Clínica La Posi",
      endereco: "Rua Laura Miranda, 199 - Vila Queiroz",
      // CONFIRMAR COM A DOUTORA: dias e horários de atendimento nesta unidade.
      horarios: null,
      horariosConfirmados: false,
      telefone: { rotulo: "Telefone da clínica", numero: "(19) 3877-4572", tel: "+551938774572" },
    },
    {
      id: "casa-branca",
      cidade: "Casa Branca - SP",
      // CONFIRMAR COM A DOUTORA: nome da clínica (Athena Odontologia Avançada?) e endereço.
      clinica: null,
      endereco: null,
      horarios: null,
      horariosConfirmados: false,
    },
  ] as Unidade[],

  /** Linha obrigatória do rodapé enquanto não houver confirmação. */
  responsavelTecnico: "Responsável técnico e registro de especialidade: a confirmar com a doutora",
} as const;

/** Texto de credencial que respeita a confirmação de especialidade. */
export const credencial = CONFIG.especialistaConfirmado ? CONFIG.textoEspecialista : CONFIG.foco;
