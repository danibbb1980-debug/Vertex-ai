import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { CONFIG } from "./src/config.ts";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** Monta title, metas, Open Graph e JSON-LD a partir de src/config.ts. */
function metasDoConfig(): Plugin {
  const cidade = CONFIG.cidade.confirmado && CONFIG.cidade.valor ? ` em ${CONFIG.cidade.valor}` : "";
  const titulo = `${CONFIG.nome} | ${CONFIG.descritor}${cidade}`;
  const descricao = `Odontologia estética, atendimento infantil e harmonização orofacial${cidade}, com avaliação individual e explicações claras. Agende sua avaliação pelo WhatsApp.`;
  const url = `${CONFIG.siteUrl}/`;
  const og = CONFIG.ogImage ? `${CONFIG.siteUrl}${CONFIG.ogImage}` : "";

  // JSON-LD só com dados confirmados: sem endereço, horários, nota ou especialidades até a clínica confirmar.
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: CONFIG.nome,
    url,
    telephone: CONFIG.telefone,
    sameAs: [CONFIG.instagram],
    hasMap: CONFIG.googleMaps,
    logo: `${CONFIG.siteUrl}${CONFIG.logo}.png`,
  };
  if (og) ld.image = og;
  if (CONFIG.endereco.confirmado) {
    const e = CONFIG.enderecoPartes;
    ld.address = {
      "@type": "PostalAddress",
      streetAddress: e.rua,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: "BR",
    };
  }

  const robots = CONFIG.rascunho ? "noindex, nofollow" : "index, follow";

  const tags = [
    `<title>${esc(titulo)}</title>`,
    `<meta name="description" content="${esc(descricao)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<meta name="googlebot" content="${robots}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:site_name" content="${esc(CONFIG.nome)}" />`,
    `<meta property="og:title" content="${esc(titulo)}" />`,
    `<meta property="og:description" content="${esc(descricao)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    og ? `<meta property="og:image" content="${esc(og)}" />` : "",
    og ? `<meta property="og:image:width" content="1200" />` : "",
    og ? `<meta property="og:image:height" content="630" />` : "",
    og ? `<meta property="og:image:alt" content="Logotipo do ${esc(CONFIG.nome)}" />` : "",
    `<meta name="twitter:card" content="${og ? "summary_large_image" : "summary"}" />`,
    `<script type="application/ld+json">${JSON.stringify(ld)}</script>`,
  ].filter(Boolean);

  return {
    name: "metas-do-config",
    transformIndexHtml(html) {
      const comMetas = html.replace("<!--metas-->", tags.join("\n    "));
      return CONFIG.rascunho ? comMetas.replace('<html lang="pt-BR">', '<html lang="pt-BR" data-rascunho="true">') : comMetas;
    },
    buildStart() {
      if (!CONFIG.rascunho) {
        this.warn(
          "CONFIG.rascunho = false: lembre de liberar a indexação também em public/robots.txt, public/_headers e vercel.json (X-Robots-Tag).",
        );
      }
      if (CONFIG.siteUrl.includes("localhost")) this.error("CONFIG.siteUrl não pode ser localhost.");
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), metasDoConfig()],
  build: {
    target: "es2022",
    cssCodeSplit: true,
  },
});
