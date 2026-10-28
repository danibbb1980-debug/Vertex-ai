import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { CONFIG, descricaoPagina, enderecoCompleto, tituloPagina } from "./config";

export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Tags do <head> geradas a partir do CONFIG. */
export function head(ogImagem: string | null) {
  const url = `${CONFIG.siteUrl}/`;
  const robots = CONFIG.rascunho ? "noindex, nofollow" : "index, follow";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: CONFIG.nome,
    url,
    telephone: "+" + CONFIG.whatsapp,
    sameAs: [CONFIG.instagram],
    hasMap: CONFIG.googleMaps,
    ...(ogImagem ? { image: `${CONFIG.siteUrl}${ogImagem}` } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: CONFIG.endereco.rua,
      addressLocality: CONFIG.endereco.cidade,
      addressRegion: CONFIG.endereco.uf,
      postalCode: CONFIG.endereco.cep,
      addressCountry: "BR",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: CONFIG.horarioSchema.dias,
        opens: CONFIG.horarioSchema.abre,
        closes: CONFIG.horarioSchema.fecha,
      },
    ],
    areaServed: { "@type": "City", name: "Alfenas" },
  };

  return [
    `<title>${esc(tituloPagina)}</title>`,
    `<meta name="description" content="${esc(descricaoPagina)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<meta name="googlebot" content="${robots}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:site_name" content="${esc(CONFIG.nome)}" />`,
    `<meta property="og:title" content="${esc(tituloPagina)}" />`,
    `<meta property="og:description" content="${esc(descricaoPagina)}" />`,
    `<meta property="og:url" content="${url}" />`,
    ...(ogImagem
      ? [
          `<meta property="og:image" content="${CONFIG.siteUrl}${ogImagem}" />`,
          `<meta property="og:image:width" content="1200" />`,
          `<meta property="og:image:height" content="630" />`,
          `<meta property="og:image:alt" content="${esc(`${CONFIG.nome}, ${enderecoCompleto}`)}" />`,
          `<meta name="twitter:card" content="summary_large_image" />`,
        ]
      : [`<meta name="twitter:card" content="summary" />`]),
    `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`,
  ].join("\n    ");
}
