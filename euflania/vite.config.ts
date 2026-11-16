import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { CONFIG } from "./src/config";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function head(): string {
  const url = CONFIG.siteUrl.replace(/\/$/, "");
  const e = CONFIG.endereco;
  const ld = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: `${CONFIG.nome} | ${CONFIG.descritor}`,
    url: `${url}/`,
    telephone: `+${CONFIG.whatsapp}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: e.ruaSchema,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: "BR",
    },
    openingHoursSpecification: CONFIG.horarios
      .filter((h) => h.abre)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][h.dia]}`,
        opens: h.abre,
        closes: h.fecha,
      })),
    sameAs: [CONFIG.instagram],
  };
  const robots = CONFIG.rascunho ? "noindex, nofollow" : "index, follow";
  const og = CONFIG.fotos[0]
    ? `<meta property="og:image" content="${url}${CONFIG.fotos[0].src}" />`
    : "";
  return [
    `<title>${esc(CONFIG.seo.title)}</title>`,
    `<meta name="description" content="${esc(CONFIG.seo.description)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<meta name="googlebot" content="${robots}" />`,
    `<link rel="canonical" href="${url}/" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:site_name" content="${esc(CONFIG.nome)} | ${esc(CONFIG.descritor)}" />`,
    `<meta property="og:title" content="${esc(CONFIG.seo.title)}" />`,
    `<meta property="og:description" content="${esc(CONFIG.seo.description)}" />`,
    `<meta property="og:url" content="${url}/" />`,
    og,
    `<script type="application/ld+json">${JSON.stringify(ld)}</script>`,
  ]
    .filter(Boolean)
    .join("\n    ");
}

const headPlugin = (): Plugin => ({
  name: "euflania-head",
  transformIndexHtml: (html) =>
    html
      .replace("<!--HEAD-->", head())
      .replace('<html lang="pt-BR">', CONFIG.rascunho ? '<html lang="pt-BR" data-rascunho="1">' : '<html lang="pt-BR">'),
});

export default defineConfig({ plugins: [react(), headPlugin()] });
