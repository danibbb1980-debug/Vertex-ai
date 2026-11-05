import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { CONFIG } from "./src/config.ts";

const DIAS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const TITLE = `${CONFIG.nome} | Estética em ${CONFIG.cidade} - ${CONFIG.uf}`;
const DESCRIPTION = `Estética facial e corporal com avaliação individual e hora marcada em ${CONFIG.cidade} - ${CONFIG.uf}. Solicite sua avaliação pelo WhatsApp.`;

/** Gera as metas, Open Graph e JSON-LD a partir de src/config.ts. */
function headFromConfig(): Plugin {
  const url = CONFIG.siteUrl.replace(/\/$/, "");
  if (/localhost|127\.0\.0\.1/.test(url)) throw new Error("CONFIG.siteUrl não pode apontar para localhost.");
  const ogImage = `${url}/img/og-renata-silva.jpg`;
  const p = CONFIG.profissional;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: CONFIG.nome,
    url: `${url}/`,
    image: ogImage,
    logo: `${url}/img/logo-completo.png`,
    telephone: "+55 " + CONFIG.telefoneExibicao.replace(/[()]/g, "").trim(),
    address: {
      "@type": "PostalAddress",
      streetAddress: CONFIG.endereco.rua,
      addressLocality: CONFIG.endereco.cidade,
      addressRegion: CONFIG.endereco.uf,
      postalCode: CONFIG.endereco.cep,
      addressCountry: "BR",
    },
    areaServed: { "@type": "City", name: CONFIG.cidade },
    hasMap: CONFIG.mapsUrl,
    sameAs: [CONFIG.instagram.url],
    openingHoursSpecification: CONFIG.horarios.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.dias.map((d) => DIAS[d]),
      opens: h.abre,
      closes: h.fecha,
    })),
  };
  if (p.registro && p.titulo) {
    jsonLd.employee = { "@type": "Person", name: p.nome, jobTitle: p.titulo, identifier: p.registro };
  }

  const robots = CONFIG.rascunho ? "noindex, nofollow" : "index, follow";
  const head = [
    `<title>${esc(TITLE)}</title>`,
    `<meta name="description" content="${esc(DESCRIPTION)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<meta name="googlebot" content="${robots}" />`,
    `<link rel="canonical" href="${url}/" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:site_name" content="${esc(CONFIG.nome)}" />`,
    `<meta property="og:title" content="${esc(TITLE)}" />`,
    `<meta property="og:description" content="${esc(DESCRIPTION)}" />`,
    `<meta property="og:url" content="${url}/" />`,
    `<meta property="og:image" content="${ogImage}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Logo da ${esc(CONFIG.nome)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
  ].join("\n    ");

  return {
    name: "head-from-config",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        let out = html.replace("<!--head-->", head);
        if (CONFIG.rascunho) out = out.replace('<html lang="pt-BR">', '<html lang="pt-BR" data-rascunho>');
        // Pré-carrega as duas fontes do primeiro quadro (título e rótulos).
        if (ctx.bundle) {
          const fonts = Object.keys(ctx.bundle).filter((f) =>
            /cormorant-garamond-latin-(400-normal|500-italic).*\.woff2$|jost-latin-wght-normal.*\.woff2$/.test(f),
          );
          const links = fonts
            .map((f) => `<link rel="preload" href="/${f}" as="font" type="font/woff2" crossorigin />`)
            .join("\n    ");
          out = out.replace("</title>", `</title>\n    ${links}`);
        }
        return out;
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), headFromConfig()],
  build: { target: "es2020", cssCodeSplit: false, assetsInlineLimit: 0 },
});
