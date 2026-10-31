import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { CONFIG, UNIDADES_ATIVAS } from "./src/config";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Gera title, metas, canonical, Open Graph e JSON-LD a partir de src/config.ts. */
function seoDoConfig(): Plugin {
  return {
    name: "seo-do-config",
    transformIndexHtml(html) {
      const url = CONFIG.siteUrl.replace(/\/$/, "") + "/";
      const tags: string[] = [
        `<title>${esc(CONFIG.seo.titulo)}</title>`,
        `<meta name="description" content="${esc(CONFIG.seo.descricao)}" />`,
        `<link rel="canonical" href="${url}" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:locale" content="pt_BR" />`,
        `<meta property="og:site_name" content="${esc(CONFIG.marca)}" />`,
        `<meta property="og:title" content="${esc(CONFIG.seo.titulo)}" />`,
        `<meta property="og:description" content="${esc(CONFIG.seo.descricao)}" />`,
        `<meta property="og:url" content="${url}" />`,
        `<meta name="twitter:card" content="${CONFIG.seo.ogImagem ? "summary_large_image" : "summary"}" />`,
      ];
      if (CONFIG.seo.ogImagem) {
        tags.push(`<meta property="og:image" content="${url}${CONFIG.seo.ogImagem.replace(/^\//, "")}" />`);
      }
      if (CONFIG.rascunho) {
        tags.push(
          `<meta name="robots" content="noindex, nofollow" />`,
          `<meta name="googlebot" content="noindex, nofollow" />`,
        );
      }

      const ld = UNIDADES_ATIVAS.map((u) => {
        const r = u.responsavelTecnico;
        return {
          "@context": "https://schema.org",
          "@type": "Dentist",
          name: `${CONFIG.marca} ${u.nomeCurto}`,
          url,
          image: url + u.logo.replace(/^\//, ""),
          telephone: "+" + u.whatsapp,
          address: {
            "@type": "PostalAddress",
            streetAddress: u.endereco.rua,
            addressLocality: u.endereco.cidade,
            addressRegion: u.endereco.uf,
            postalCode: u.endereco.cep,
            addressCountry: "BR",
          },
          hasMap: u.maps.link,
          sameAs: [u.instagram.url],
          paymentAccepted: u.pagamentos.join(", "),
          openingHoursSpecification: u.horarios.map((h) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: `https://schema.org/${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][h.dia]}`,
            opens: h.abre,
            closes: h.fecha,
          })),
          ...(r.nome && r.cro
            ? { employee: { "@type": "Person", name: r.nome, identifier: r.cro } }
            : {}),
        };
      });
      tags.push(
        `<script type="application/ld+json">${JSON.stringify(ld.length === 1 ? ld[0] : ld).replace(/</g, "\\u003c")}</script>`,
      );
      return html.replace("<!--seo-->", tags.join("\n    "));
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seoDoConfig()],
  build: { target: "es2020", cssMinify: true },
});
