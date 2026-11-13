import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { CONFIG } from "./src/config";

/** Gera metas, canonical e JSON-LD a partir de src/config.ts. */
function seoDoConfig(): Plugin {
  const url = CONFIG.siteUrl.replace(/\/$/, "") + "/";
  const dias = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: CONFIG.nome,
    url,
    telephone: CONFIG.telefoneE164,
    areaServed: `${CONFIG.cidade} - ${CONFIG.uf}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${CONFIG.endereco.rua}, ${CONFIG.endereco.complemento}`,
      addressLocality: CONFIG.endereco.cidade,
      addressRegion: CONFIG.endereco.uf,
      postalCode: CONFIG.endereco.cep,
      addressCountry: "BR",
    },
    openingHoursSpecification: CONFIG.horarios
      .filter((h) => h.abre && h.fecha)
      .map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: dias[h.dia], opens: h.abre, closes: h.fecha })),
    employee: CONFIG.advogadas.map((a) => ({ "@type": "Person", name: a.nome.replace(/^Dra\.\s*/, ""), jobTitle: "Advogada" })),
  };
  return {
    name: "seo-do-config",
    transformIndexHtml(html) {
      const robots = CONFIG.rascunho
        ? `<meta name="robots" content="noindex, nofollow" />\n    <meta name="googlebot" content="noindex, nofollow" />`
        : "";
      return html
        .replace("<!--ROBOTS-->", robots)
        .replaceAll("%SITE_URL%", url)
        .replace("<!--JSONLD-->", `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`);
    },
  };
}

export default defineConfig({
  plugins: [react(), seoDoConfig()],
  build: { target: "es2020", cssCodeSplit: false },
});
