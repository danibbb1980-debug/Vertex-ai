import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { CONFIG } from "./src/config";
import { openingHoursSpec } from "./src/lib/horarios";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** Metas de SEO, Open Graph, noindex do rascunho e JSON-LD gerados a partir do CONFIG. */
function seo(): Plugin {
  const url = CONFIG.siteUrl.replace(/\/$/, "");
  const titulo = `${CONFIG.marca.nome} | Estética e Furo de Orelha Infantil em ${CONFIG.cidade} - ${CONFIG.uf}`;
  const desc = `Estética e furo de orelha infantil com hora marcada em ${CONFIG.cidade} - ${CONFIG.uf}. Atendimento individual, explicações claras e agendamento pelo WhatsApp.`;
  const og = "/img/og-elane-vasconcelos.jpg";
  const e = CONFIG.endereco;
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: CONFIG.marca.nome,
    description: desc,
    url: `${url}/`,
    telephone: `+${CONFIG.whatsapp}`,
    image: `${url}${og}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: e.rua,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: "BR",
    },
    hasMap: CONFIG.mapsUrl,
    sameAs: [CONFIG.instagram.url].filter(Boolean),
    openingHoursSpecification: openingHoursSpec(),
    amenityFeature: CONFIG.acessibilidade
      ? [{ "@type": "LocationFeatureSpecification", name: CONFIG.acessibilidade, value: true }]
      : undefined,
  };
  const robots = CONFIG.rascunho ? "noindex, nofollow" : "index, follow";
  const tags = [
    `<title>${esc(titulo)}</title>`,
    `<meta name="description" content="${esc(desc)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<meta name="googlebot" content="${robots}" />`,
    `<link rel="canonical" href="${url}/" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:site_name" content="${esc(CONFIG.marca.nome)}" />`,
    `<meta property="og:title" content="${esc(titulo)}" />`,
    `<meta property="og:description" content="${esc(desc)}" />`,
    `<meta property="og:url" content="${url}/" />`,
    `<meta property="og:image" content="${url}${og}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Elane Vasconcelos no consultório, de jaleco branco" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>`,
  ].join("\n    ");
  return { name: "seo-config", transformIndexHtml: (html) => html.replace("<!--seo-->", tags) };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seo()],
  build: { cssCodeSplit: false },
});
