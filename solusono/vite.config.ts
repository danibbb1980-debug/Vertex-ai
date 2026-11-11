import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { CONFIG } from "./src/config";

const titulo = "SoluSono | Fisioterapia do Sono, Ronco e Apneia em Poços de Caldas - MG";
const descricao =
  "Avaliação e acompanhamento para ronco e apneia do sono em Poços de Caldas - MG, com atendimento presencial e online.";

const DIAS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function seo(): Plugin {
  return {
    name: "solusono-seo",
    transformIndexHtml(html, ctx) {
      const fontes = Object.keys(ctx.bundle ?? {}).filter((f) => /(newsreader|schibsted-400)-[\w-]+\.woff2$/.test(f) && !f.includes("italico"));
      const preload = fontes.map((f) => `\n    <link rel="preload" href="/${f}" as="font" type="font/woff2" crossorigin />`).join("");
      const url = CONFIG.siteUrl.replace(/\/$/, "");
      const e = CONFIG.endereco;
      const abertos = CONFIG.horarios.filter((h) => h.abre);
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "MedicalBusiness",
        name: CONFIG.nome,
        description: descricao,
        url: url + "/",
        image: url + "/og.png",
        logo: url + "/apple-touch-icon.png",
        email: CONFIG.email || undefined,
        address: {
          "@type": "PostalAddress",
          streetAddress: e.rua,
          addressLocality: e.cidade,
          addressRegion: e.uf,
          postalCode: e.cep,
          addressCountry: "BR",
        },
        areaServed: `${e.cidade} - ${e.uf}`,
        sameAs: [CONFIG.instagram.url],
        openingHoursSpecification: abertos.length
          ? [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: abertos.map((h) => DIAS[h.dia]),
                opens: abertos[0].abre,
                closes: abertos[0].fecha,
              },
            ]
          : undefined,
      };
      const robots = CONFIG.rascunho ? "noindex, nofollow" : "index, follow";
      const head = `
    <title>${titulo}</title>
    <meta name="description" content="${descricao}" />
    <meta name="robots" content="${robots}" />
    <meta name="googlebot" content="${robots}" />
    <link rel="canonical" href="${url}/" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="${CONFIG.nome}" />
    <meta property="og:title" content="${titulo}" />
    <meta property="og:description" content="${descricao}" />
    <meta property="og:url" content="${url}/" />
    <meta property="og:image" content="${url}/og.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Logotipo da SoluSono" />
    <meta name="twitter:card" content="summary_large_image" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;
      return html.replace("<!--SEO-->", head + preload);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seo()],
  build: { target: "es2020", cssCodeSplit: false },
});
