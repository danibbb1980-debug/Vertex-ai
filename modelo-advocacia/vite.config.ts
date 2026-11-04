import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { CONFIG } from "./src/config.ts";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** Preenche título, descrição, URLs absolutas, tema e JSON-LD a partir de src/config.ts. */
function configHtml(): Plugin {
  const e = CONFIG.escritorio;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: e.nome,
    description: CONFIG.seo.descricao,
    url: `${CONFIG.siteUrl}/`,
    telephone: e.telefone,
    email: e.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: e.endereco,
      addressLocality: "Cidade Exemplo",
      addressRegion: "UF",
      postalCode: e.cep,
      addressCountry: "BR",
    },
    areaServed: e.cidade,
    knowsAbout: CONFIG.areas.map((a) => a.titulo),
    openingHours: "Mo-Fr 09:00-18:00",
  };
  // No modo modelo, o seletor de tema e ?tema= funcionam para demonstração.
  const temaScript = CONFIG.modelo
    ? `<script>try{var t=new URLSearchParams(location.search).get("tema")||localStorage.getItem("tema");if(/^(papel-e-tinta|verde-profundo|grafite-e-cobre)$/.test(t))document.documentElement.dataset.theme=t}catch(e){}</script>`
    : "";
  return {
    name: "config-html",
    transformIndexHtml(html) {
      return html
        .replaceAll("%TITULO%", esc(CONFIG.seo.titulo))
        .replaceAll("%DESCRICAO%", esc(CONFIG.seo.descricao))
        .replaceAll("%NOME%", esc(e.nome))
        .replaceAll("%URL%", CONFIG.siteUrl)
        .replaceAll("%TEMA%", CONFIG.tema)
        .replace("<!--TEMA-SCRIPT-->", temaScript)
        .replace("<!--JSON-LD-->", `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), configHtml()],
  build: { target: "es2020", cssMinify: true },
});
