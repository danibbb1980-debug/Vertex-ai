import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { CONFIG } from "./src/config";

const DIAS_SCHEMA = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function seo(): Plugin {
  const local = `${CONFIG.cidade} - ${CONFIG.uf}`;
  const areas = CONFIG.areas.map((a) => a.nome);
  const title = `${CONFIG.nome} | Advocacia em ${local}`;
  const description =
    `Escritório de advocacia em ${CONFIG.cidade} (${CONFIG.uf})` +
    (areas.length ? `, com atuação em ${areas.join(", ")}` : "") +
    ". Atendimento por agendamento pelo WhatsApp.";
  const url = CONFIG.siteUrl.replace(/\/$/, "") + "/";
  const ogImage = CONFIG.fotos.find((f) => f.id === "fachada") ?? CONFIG.fotos[0];

  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: CONFIG.nome,
    url,
    telephone: "+" + CONFIG.whatsapp,
    address: {
      "@type": "PostalAddress",
      ...(CONFIG.endereco ? { streetAddress: CONFIG.endereco } : {}),
      addressLocality: CONFIG.cidade,
      addressRegion: CONFIG.uf,
      ...(CONFIG.cep ? { postalCode: CONFIG.cep } : {}),
      addressCountry: "BR",
    },
    geo: { "@type": "GeoCoordinates", latitude: CONFIG.coordenadas.lat, longitude: CONFIG.coordenadas.lng },
    hasMap: CONFIG.mapsUrl,
    sameAs: [CONFIG.instagram],
  };
  if (ogImage) ld.image = `${url}fotos/${ogImage.id}-1200.webp`;
  if (areas.length) ld.knowsAbout = areas;
  if (CONFIG.horarios.length) {
    ld.openingHoursSpecification = CONFIG.horarios.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: DIAS_SCHEMA[h.dia],
      opens: h.abre,
      closes: h.fecha,
    }));
  }

  const robots = CONFIG.rascunho
    ? `<meta name="robots" content="noindex, nofollow" />\n    <meta name="googlebot" content="noindex, nofollow" />`
    : "";
  const og = [
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:site_name" content="${CONFIG.nome}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    ogImage ? `<meta property="og:image" content="${url}fotos/${ogImage.id}-1200.webp" />` : "",
    ogImage ? `<meta property="og:image:alt" content="${ogImage.alt}" />` : "",
    `<meta name="twitter:card" content="${ogImage ? "summary_large_image" : "summary"}" />`,
  ]
    .filter(Boolean)
    .join("\n    ");

  return {
    name: "seo-config",
    transformIndexHtml(html) {
      return html
        .replace("%TITLE%", title)
        .replace("%DESCRIPTION%", description)
        .replace("%CANONICAL%", url)
        .replace("%ROBOTS%", robots)
        .replace("%OG%", og)
        .replace("%JSONLD%", JSON.stringify(ld));
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seo()],
  build: { target: "es2020", cssCodeSplit: false },
});
