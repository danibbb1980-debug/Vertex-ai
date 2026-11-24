import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { CONFIG, atendimentosAtivos } from "./src/config";

const DIAS_SCHEMA = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function jsonLd() {
  const e = CONFIG.endereco;
  const horarios = CONFIG.horarios.dias
    .map((f, i) => (f ? { "@type": "OpeningHoursSpecification", dayOfWeek: DIAS_SCHEMA[i], opens: f.abre, closes: f.fecha } : null))
    .filter(Boolean);
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: `${CONFIG.nome} | ${CONFIG.descritor}`,
    url: CONFIG.siteUrl + "/",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${e.rua}, ${e.numero} - ${e.bairro}`,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: "BR",
    },
    openingHoursSpecification: horarios,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Atendimentos",
      itemListElement: atendimentosAtivos().map((a) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: a.nome } })),
    },
  };
  if (CONFIG.usarWhatsapp && CONFIG.whatsapp) data.telephone = "+" + CONFIG.whatsapp;
  if (CONFIG.instagram.url) data.sameAs = [CONFIG.instagram.url];
  return JSON.stringify(data);
}

function htmlConfig(): Plugin {
  return {
    name: "html-config",
    transformIndexHtml(html) {
      const robots = CONFIG.rascunho
        ? `<meta name="robots" content="noindex, nofollow" />\n    <meta name="googlebot" content="noindex, nofollow" />`
        : "";
      return html
        .replace("<!--ROBOTS-->", robots)
        .replaceAll("%SITE_URL%", CONFIG.siteUrl)
        .replace("<!--JSONLD-->", `<script type="application/ld+json">${jsonLd()}</script>`);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), htmlConfig()],
  build: { target: "es2020", cssMinify: true },
});
