import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { CONFIG, crmTexto, especialidadesVisiveis } from "./src/config.ts";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** Gera title, metas, Open Graph e JSON-LD a partir de src/config.ts. */
function seoFromConfig(): Plugin {
  return {
    name: "seo-from-config",
    transformIndexHtml(html) {
      const url = CONFIG.siteUrl.replace(/\/$/, "") + "/";
      const title = `${CONFIG.nome} | Emagrecimento e Hipertrofia em ${CONFIG.cidade} - ${CONFIG.uf}`;
      const desc = `Consultório médico em ${CONFIG.cidade} - ${CONFIG.uf} com avaliação individual para emagrecimento e hipertrofia, plano explicado com clareza e atendimento com hora marcada. ${crmTexto()}.`;
      const og = CONFIG.foto ? CONFIG.siteUrl.replace(/\/$/, "") + CONFIG.foto.src : "";
      const e = CONFIG.endereco;
      const dias = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const jsonld: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Physician",
        name: CONFIG.nome,
        url,
        identifier: { "@type": "PropertyValue", propertyID: `CRM-${CONFIG.crm.uf}`, value: CONFIG.crm.numero },
        address: {
          "@type": "PostalAddress",
          streetAddress: `${e.rua}, ${e.complemento}`,
          addressLocality: e.cidade,
          addressRegion: e.uf,
          postalCode: e.cep,
          addressCountry: "BR",
        },
        telephone: "+" + CONFIG.whatsapp,
        sameAs: [CONFIG.instagram.url],
        openingHoursSpecification: CONFIG.horarios.map((h) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: dias[h.dia],
          opens: h.abre,
          closes: h.fecha,
        })),
      };
      if (og) jsonld.image = og;
      const esp = especialidadesVisiveis();
      if (esp.length) jsonld.medicalSpecialty = esp.map((s) => s.nome);
      const tags = [
        `<title>${esc(title)}</title>`,
        `<meta name="description" content="${esc(desc)}" />`,
        CONFIG.rascunho ? `<meta name="robots" content="noindex, nofollow" />` : "",
        CONFIG.rascunho ? `<meta name="googlebot" content="noindex, nofollow" />` : "",
        `<link rel="canonical" href="${url}" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:locale" content="pt_BR" />`,
        `<meta property="og:title" content="${esc(title)}" />`,
        `<meta property="og:description" content="${esc(desc)}" />`,
        `<meta property="og:url" content="${url}" />`,
        og ? `<meta property="og:image" content="${og}" />` : "",
        og && CONFIG.foto ? `<meta property="og:image:alt" content="${esc(CONFIG.foto.alt)}" />` : "",
        `<meta name="twitter:card" content="${og ? "summary_large_image" : "summary"}" />`,
        `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>`,
      ].filter(Boolean);
      return html.replace("<!--SEO-->", tags.join("\n    "));
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seoFromConfig()],
  build: { target: "es2020", cssCodeSplit: false },
});
