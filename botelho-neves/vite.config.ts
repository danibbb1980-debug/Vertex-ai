import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { CONFIG, sede } from "./src/config";

const DIAS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function head(): Plugin {
  const url = CONFIG.siteUrl.replace(/\/$/, "");
  const s = sede();
  const title =
    "Botelho & Neves Advogados Associados | Direito do Trabalho e Previdenciário em Varginha e Coqueiral - MG";
  const description =
    "Atuação em Direito do Trabalho e Direito Previdenciário, com atendimento direto pelos sócios, em Varginha - MG.";
  const endereco = (u: typeof s) => ({
    "@type": "PostalAddress",
    streetAddress: [u.logradouro, u.complemento].filter(Boolean).join(", "),
    addressLocality: u.cidade,
    addressRegion: u.uf,
    postalCode: u.cep,
    addressCountry: "BR",
  });
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: CONFIG.nome,
    url: url + "/",
    telephone: "+55-35-3015-8433",
    image: CONFIG.fotos.socios ? url + CONFIG.fotos.socios.src : undefined,
    address: endereco(s),
    areaServed: CONFIG.cidadesAtuacao.map((c) => ({ "@type": "City", name: `${c}, MG` })),
    knowsAbout: CONFIG.areas.map((a) => a.titulo),
    openingHoursSpecification: (s.horarios ?? [])
      .filter((h) => h.abre && h.fecha)
      .map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: DIAS[h.dia], opens: h.abre, closes: h.fecha })),
    location: CONFIG.unidades.slice(1).map((u) => ({ "@type": "Place", name: `${CONFIG.nomeCurto} (${u.nome})`, address: endereco(u) })),
    employee: CONFIG.socios.map((p) => ({ "@type": "Person", name: p.nome.replace(/^Dr\.\s*/, ""), jobTitle: "Advogado", identifier: p.oab })),
    sameAs: [CONFIG.instagram.url],
  };
  const robots = CONFIG.rascunho ? "noindex, nofollow" : "index, follow";
  const og = CONFIG.fotos.socios
    ? `<meta property="og:image" content="${url}/img/og.jpg" />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />`
    : "";
  return {
    name: "head-config",
    transformIndexHtml(html) {
      return html
        .replace("%TITLE%", title)
        .replace(
          "<!--HEAD-->",
          `<meta name="description" content="${description}" />
    <meta name="robots" content="${robots}" />
    <meta name="googlebot" content="${robots}" />
    <link rel="canonical" href="${url}/" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="${CONFIG.nome}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}/" />
    ${og}
    <meta name="twitter:card" content="summary_large_image" />
    <script type="application/ld+json">${JSON.stringify(jsonld)}</script>`,
        );
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), head()],
  build: { cssCodeSplit: false },
});
