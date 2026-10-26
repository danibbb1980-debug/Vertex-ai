/**
 * Todos os dados do site ficam aqui.
 * Fonte: Instagram e ficha do Google Maps da própria doutora.
 * Tudo marcado com "CONFIRMAR COM A DOUTORA" precisa ser validado antes de publicar a versão final.
 */

export const CONFIG = {
  /** Faixa de rascunho no topo. Mude para false quando o site for aprovado. */
  rascunho: true,

  /** URL pública do site, sem barra no final. Usada no canonical, og:url e og:image. */
  siteUrl: "https://dra-ana-villela-enxuto.vercel.app", // CONFIRMAR: trocar pelo domínio definitivo

  nome: "Dra. Ana Villela",
  nomeCurto: "Ana Villela",
  descritor: "Estética Dental",
  profissao: "Cirurgiã-dentista", // CONFIRMAR COM A DOUTORA

  /** CRO obrigatório na versão final. Enquanto for null, o site mostra "CRO a confirmar". */
  cro: null as string | null, // CONFIRMAR COM A DOUTORA (ex.: "CRO-MG 00000")

  /** Especialidade só pode aparecer se estiver registrada no CRO. */
  especialidade: null as string | null, // CONFIRMAR COM A DOUTORA

  /** Bio do Instagram (referência de posicionamento, não é exibida literalmente). */
  bioInstagram:
    "Transformo sorrisos através da Estética Dental. Lentes em resina e porcelana. Clareamento. Avaliação estética personalizada.",

  /** Endereço da ficha do Google. CONFIRMAR COM A DOUTORA */
  endereco: {
    rua: "R. Rio Grande do Sul, 1402",
    bairro: "Centro",
    cidade: "Poços de Caldas",
    uf: "MG",
    cep: "37701-001",
  },

  /** Horários da ficha do Google. CONFIRMAR COM A DOUTORA */
  horarios: {
    semana: { manha: ["08h30", "11h30"], tarde: ["13h00", "19h00"] },
    fimDeSemana: "Fechado",
  },

  /** Telefone da ficha do Google (o mesmo do WhatsApp). */
  telefone: "(35) 99133-0872",
  whatsapp: "5535991330872",
  mensagemWhatsapp: "Olá, Dra. Ana! Vi seu site e gostaria de agendar uma avaliação estética.",

  instagram: "https://www.instagram.com/anavillela.estetica",
  instagramUser: "@anavillela.estetica",
  maps: "https://maps.app.goo.gl/XDMkusEB5Ji6zNZu9",

  /** Alinhadores: o perfil destaca "Invisalign". CONFIRMAR se é prestadora credenciada antes de citar a marca. */
  podeCitarInvisalign: false,

  /** Vínculo com clínica parceira: não citar nome nem marca sem autorização. CONFIRMAR COM A DOUTORA */
  clinicaParceira: null as string | null,

  fotos: {
    // Fotos da doutora em 3 larguras (o navegador escolhe a ideal para cada tela).
    retrato: "/fotos/dra-ana-villela-retrato-760.webp",
    retratoSrcSet:
      "/fotos/dra-ana-villela-retrato-480.webp 480w, /fotos/dra-ana-villela-retrato-760.webp 760w, /fotos/dra-ana-villela-retrato-1015.webp 1015w",
    // Foto do consultório: original, sem edição (pedido da cliente).
    consultorio: "/fotos/dra-ana-villela-consultorio-760.webp",
    consultorioSrcSet:
      "/fotos/dra-ana-villela-consultorio-480.webp 480w, /fotos/dra-ana-villela-consultorio-760.webp 760w, /fotos/dra-ana-villela-consultorio-953.webp 953w",
    og: "/og-image.jpg",
  },
} as const;

export const enderecoCompleto = `${CONFIG.endereco.rua} - ${CONFIG.endereco.bairro}, ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}, ${CONFIG.endereco.cep}`;

export function whatsappLink(mensagem: string = CONFIG.mensagemWhatsapp) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

export const croTexto = CONFIG.cro ?? "CRO a confirmar";

export const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(
  enderecoCompleto,
)}&z=17&output=embed`;
