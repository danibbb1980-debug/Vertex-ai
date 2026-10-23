import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { CONFIG } from "./src/config";

const url = CONFIG.siteUrl.replace(/\/$/, "");

/** Injeta CONFIG no index.html e gera robots.txt e sitemap.xml no build. */
function seo(): Plugin {
  const tel = `+${CONFIG.whatsapp}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: CONFIG.nome,
    url: `${url}/`,
    image: `${url}/og.png`,
    logo: `${url}/icon-512.png`,
    telephone: tel,
    description:
      "Estúdio de criação de sites profissionais para empresas de Poços de Caldas e região.",
    address: {
      "@type": "PostalAddress",
      addressLocality: CONFIG.cidade,
      addressRegion: CONFIG.uf,
      addressCountry: "BR",
    },
    areaServed: [
      { "@type": "City", name: "Poços de Caldas" },
      { "@type": "AdministrativeArea", name: "Região de Poços de Caldas - MG" },
    ],
    taxID: CONFIG.cnpj,
    ...(CONFIG.instagram ? { sameAs: [CONFIG.instagram] } : {}),
  };
  return {
    name: "vertex-seo",
    transformIndexHtml: {
      order: "pre",
      handler: (html) => html.replaceAll("%SITE_URL%", url).replace("%JSON_LD%", JSON.stringify(jsonLd)),
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n`,
      });
      const today = new Date().toISOString().slice(0, 10);
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${url}/</loc><lastmod>${today}</lastmod><priority>1.0</priority></url>
  <url><loc>${url}/privacidade.html</loc><lastmod>${today}</lastmod><priority>0.3</priority></url>
</urlset>
`,
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seo()],
  build: {
    target: "es2020",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 900,
  },
});
