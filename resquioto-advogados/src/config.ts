/**
 * Todos os dados do site ficam aqui.
 * Regra: campo vazio ("" ou []) = o bloco correspondente não aparece no site.
 */

export type Advogado = { nome: string; oab: string; uf: string };
export type Area = { nome: string; descricao: string };
/** dia: 0 = domingo ... 6 = sábado. Sem entrada para o dia = fechado. */
export type Horario = { dia: number; abre: string; fecha: string; pausa?: [string, string] };
export type Foto = { id: string; alt: string; legenda: string; largura: number; altura: number };

export const CONFIG = {
  rascunho: true,

  // URL pública do rascunho (usada em canonical, og:url, og:image e JSON-LD).
  siteUrl: "https://resquioto-advogados-rascunho.vercel.app",

  nome: "Resquioto Advogados",

  // Cidade confirmada pelo endereço informado (Google Maps).
  cidade: "Serra Negra",
  uf: "SP",
  endereco: "R. Antônio Novaes, 230, sala 05, pavimento superior",
  bairro: "Jardim Estância Suíça",
  cep: "13930-224",

  coordenadas: { lat: -22.6086668, lng: -46.7069128 },
  mapsUrl: "https://maps.app.goo.gl/aGpwnBbA5jA6aKSs8",

  usarWhatsapp: true,
  whatsapp: "5519997674192",
  whatsappExibicao: "(19) 99767-4192",

  instagram: "https://www.instagram.com/resquiotoadvogados/",
  instagramUsuario: "@resquiotoadvogados",

  // Provimento 205/2021: o advogado só aparece com nome + OAB + UF.
  advogados: [] as Advogado[],

  areas: [] as Area[],

  // Quarta-feira não constava na lista enviada; assumida igual aos demais dias úteis. CONFIRMAR.
  horarios: [
    { dia: 1, abre: "09:00", fecha: "18:00" },
    { dia: 2, abre: "09:00", fecha: "18:00" },
    { dia: 3, abre: "09:00", fecha: "18:00" },
    { dia: 4, abre: "09:00", fecha: "18:00" },
    { dia: 5, abre: "09:00", fecha: "18:00" },
  ] as Horario[],
  avisoHorarios: "Em feriados, os horários podem ser diferentes.",

  // Fotos em public/fotos/{id}-1200.webp e {id}-720.webp
  fotos: [
    { id: "fachada", alt: "Fachada do escritório, com recepção envidraçada voltada para a rua", legenda: "Fachada", largura: 1120, altura: 822 },
    { id: "recepcao", alt: "Recepção com pé-direito duplo, cadeiras de espera, balcão e o mezanino ao alto", legenda: "Recepção", largura: 1152, altura: 892 },
    { id: "sala-atendimento", alt: "Sala de atendimento com mesa em L, cadeiras para visitantes e planta ao fundo", legenda: "Sala de atendimento", largura: 952, altura: 804 },
    { id: "sala-reunioes", alt: "Pavimento superior com mesa de reuniões, televisor e sofá ao fundo", legenda: "Sala de reuniões", largura: 996, altura: 762 },
    { id: "mezanino", alt: "Vista do pavimento superior: escada com guarda-corpo de vidro, sofá, poltrona e mesa de reuniões", legenda: "Pavimento superior", largura: 1147, altura: 758 },
  ] as Foto[],

  logo: "", // caminho de um logo vetorial oficial; vazio = usa o logotipo recriado em SVG

  secoes: {
    escritorio: true,
    espaco: true,
    advogados: true,
    atuacao: true,
    quandoProcurar: true,
    comoFunciona: true,
    duvidas: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },
};

export const LOCAL = `${CONFIG.cidade} - ${CONFIG.uf}`;
