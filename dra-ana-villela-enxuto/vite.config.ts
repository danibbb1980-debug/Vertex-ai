import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { CONFIG, enderecoCompleto } from "./src/config.ts";

/** Injeta no index.html os dados do src/config.ts (URLs absolutas, JSON-LD e modo rascunho). */
function configHtml(): Plugin {
  const url = CONFIG.siteUrl.replace(/\/$/, "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: CONFIG.nome,
    description: `${CONFIG.descritor} em ${CONFIG.endereco.cidade}: lentes em resina e porcelana, clareamento e avaliação estética personalizada.`,
    url: `${url}/`,
    image: `${url}${CONFIG.fotos.og}`,
    telephone: "+" + CONFIG.whatsapp,
    sameAs: [CONFIG.instagram],
    hasMap: CONFIG.maps,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONFIG.endereco.rua,
      addressLocality: CONFIG.endereco.cidade,
      addressRegion: CONFIG.endereco.uf,
      postalCode: CONFIG.endereco.cep,
      addressCountry: "BR",
    },
    openingHoursSpecification: [
      { o: CONFIG.horarios.semana.manha },
      { o: CONFIG.horarios.semana.tarde },
    ].map(({ o }) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: o[0].replace("h", ":"),
      closes: o[1].replace("h", ":"),
    })),
  };
  const robots = CONFIG.rascunho ? "noindex, nofollow" : "index, follow";
  return {
    name: "config-html",
    transformIndexHtml(html) {
      return html
        .replaceAll("%SITE_URL%", url)
        .replaceAll("%OG_IMAGE%", `${url}${CONFIG.fotos.og}`)
        .replaceAll("%ROBOTS%", robots)
        .replaceAll("%ENDERECO%", enderecoCompleto)
        .replace("%JSON_LD%", JSON.stringify(jsonLd));
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), configHtml()],
  build: { cssMinify: true, assetsInlineLimit: 0 },
});
