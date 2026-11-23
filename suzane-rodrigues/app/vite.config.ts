import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";
import { CONFIG, atendimentosAtivos } from "./src/config.ts";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** Injeta título, metas, canonical, Open Graph e JSON-LD a partir de src/config.ts. */
function seoFromConfig(): Plugin {
  const url = CONFIG.siteUrl.replace(/\/$/, "") + "/";
  const title = `${CONFIG.nome} | Estética Facial e Corporal em ${CONFIG.cidade} - ${CONFIG.uf}`;
  const description = `Estética facial e corporal com avaliação individual em ${CONFIG.cidade} - ${CONFIG.uf}. Agendamento pelo WhatsApp.`;
  const e = CONFIG.endereco;
  const dias = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: CONFIG.nome,
    description,
    url,
    image: url + "og.png",
    logo: url + "img/logo-sr.svg",
    telephone: "+" + CONFIG.whatsapp,
    address: {
      "@type": "PostalAddress",
      streetAddress: e.rua,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: "BR",
    },
    openingHoursSpecification: CONFIG.horarios
      .filter((h) => h.abre && h.fecha)
      .map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: dias[h.dia], opens: h.abre, closes: h.fecha })),
    hasMap: e.mapsUrl,
    sameAs: [CONFIG.instagram.url],
    makesOffer: atendimentosAtivos().map((a) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: a.nome },
    })),
  };
  const robots = CONFIG.rascunho
    ? `<meta name="robots" content="noindex, nofollow" />\n    <meta name="googlebot" content="noindex, nofollow" />`
    : `<meta name="robots" content="index, follow" />`;

  const head = `
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    ${robots}
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${url}og.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <script type="application/ld+json">${JSON.stringify(jsonld)}</script>`;

  return {
    name: "seo-from-config",
    transformIndexHtml: (html) => html.replace("<!--SEO-->", head),
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seoFromConfig()],
  build: { cssCodeSplit: false },
});
