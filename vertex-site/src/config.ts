/**
 * CONFIG — tudo que precisa ser editado antes de publicar está aqui.
 * Campos marcados com [A PREENCHER] ainda dependem de dados do estúdio.
 */
export const CONFIG = {
  nome: "Vertex Web Studios",
  cidade: "Poços de Caldas",
  uf: "MG",
  areaAtuacao: "Poços de Caldas e região",

  cnpj: "69.778.493/0001-91",
  /** [A PREENCHER] Deixe vazio para ocultar. */
  razaoSocial: "",

  /** WhatsApp no formato 55DDNÚMERO, só dígitos. */
  whatsapp: "5535984487206",
  /** [A PREENCHER] URL completa do perfil. Vazio = botões do Instagram ficam ocultos. */
  instagram: "",
  /** [A PREENCHER] Opcional. Vazio = oculto. */
  email: "",

  /** URL pública do site, sem barra no final. Usada em canonical, og:url, sitemap e JSON-LD. */
  siteUrl: "https://vertex-web-studios.vercel.app",

  /** [A PREENCHER] Caminho de uma foto do responsável em /public (ex.: "/responsavel.webp"). Vazio = oculta. */
  fotoResponsavel: "",
  /** [A PREENCHER] Nome do responsável, mostrado junto da foto. */
  nomeResponsavel: "",

  /** Mostra a seção de planos e preços. */
  mostrarPrecos: true,
  /** Mostra a seção "Exemplos de estilos" (capturas em public/exemplos, rotuladas como ilustrativas). */
  mostrarExemplos: true,

  /** [CONFIRMAR] Texto sobre prazo do rascunho. Não prometa prazo exato. */
  prazoRascunho: "normalmente em poucos dias",

  planos: [
    {
      id: "essencial",
      nome: "Essencial",
      preco: 97,
      paraQuem: "Para cardápio digital ou página única.",
      destaque: false,
    },
    {
      id: "completo",
      nome: "Completo",
      preco: 197,
      paraQuem:
        "Para sites com várias seções: clínicas, estúdios, escritórios e negócios com mais conteúdo.",
      destaque: true,
    },
  ],

  inclusoEmTodos: [
    "Rascunho gratuito antes de decidir",
    "Sem taxa de criação e sem fidelidade",
    "Cobrança só após a aprovação",
    "7 dias de garantia",
    "Hospedagem e manutenção",
    "Suporte pelo WhatsApp",
    "Pequenos ajustes de texto e foto",
  ],

  naoIncluso: [
    "Anúncios e gestão de redes sociais",
    "Loja virtual",
    "Produção de fotos e vídeos",
  ],
} as const;

export type Plano = (typeof CONFIG.planos)[number];

const MSG_GERAL =
  "Olá! Vi o site da Vertex Web Studios e gostaria de ver um rascunho do site da minha empresa.";

/** Link do WhatsApp. O clique só inicia a conversa — nada é contratado. */
export function waLink(contexto?: { plano?: string; segmento?: string }): string {
  let msg = MSG_GERAL;
  if (contexto?.plano) {
    msg = `Olá! Vi o site da Vertex Web Studios e tenho interesse no plano ${contexto.plano}. Gostaria de ver um rascunho do site da minha empresa.`;
  } else if (contexto?.segmento) {
    msg = `Olá! Vi o site da Vertex Web Studios. Tenho um negócio do segmento ${contexto.segmento} e gostaria de ver um rascunho do site da minha empresa.`;
  }
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
}

export function telefoneFormatado(): string {
  const d = CONFIG.whatsapp.replace(/^55/, "");
  return `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
}
