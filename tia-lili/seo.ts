// Gera as tags de <head> (SEO, Open Graph, JSON-LD) a partir de src/config.ts.
import { CONFIG } from "./src/config.ts";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function tagsSeo() {
  const url = CONFIG.siteUrl.replace(/\/$/, "") + "/";
  if (/localhost|127\.0\.0\.1/.test(url)) throw new Error("CONFIG.siteUrl não pode ser localhost");

  const titulo = CONFIG.mostrarEspecialidades
    ? `${CONFIG.nome} (${CONFIG.apelido}) | Odontopediatra em Poços de Caldas - MG`
    : `${CONFIG.nome} (${CONFIG.apelido}) | Dentista para Crianças em Poços de Caldas - MG`;
  const descricao =
    "Odontologia para bebês, crianças e adolescentes em Poços de Caldas - MG, com a Dra. Liliane Ormeneze (Tia Lili). Atendimento com agendamento pelo WhatsApp.";
  const ogImagem = `${url}og.jpg`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: `${CONFIG.nome} (${CONFIG.apelido})`,
    url,
    image: ogImagem,
    telephone: CONFIG.telefoneSchema,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${CONFIG.endereco.rua} - ${CONFIG.endereco.bairro}`,
      addressLocality: CONFIG.endereco.cidade,
      addressRegion: CONFIG.endereco.uf,
      postalCode: CONFIG.endereco.cep,
      addressCountry: "BR",
    },
    openingHoursSpecification: CONFIG.horariosSchema.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.dias,
      opens: h.abre,
      closes: h.fecha,
    })),
    paymentAccepted: CONFIG.pagamentos.join(", "),
    hasMap: CONFIG.maps.link,
    sameAs: [CONFIG.instagram.url],
  };

  const linhas = [
    `<title>${esc(titulo)}</title>`,
    `<meta name="description" content="${esc(descricao)}" />`,
    CONFIG.rascunho ? `<meta name="robots" content="noindex, nofollow" />` : "",
    CONFIG.rascunho ? `<meta name="googlebot" content="noindex, nofollow" />` : "",
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:site_name" content="${esc(`${CONFIG.nome} (${CONFIG.apelido})`)}" />`,
    `<meta property="og:title" content="${esc(titulo)}" />`,
    `<meta property="og:description" content="${esc(descricao)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${ogImagem}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Logo Tia Lili e sala de atendimento do consultório" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`,
  ];
  return linhas.filter(Boolean).join("\n    ");
}
