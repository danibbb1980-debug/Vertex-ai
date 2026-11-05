import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { CONFIG } from "./src/config.ts";

/** Monta title, metas, canonical, Open Graph e JSON-LD a partir de src/config.ts. */
function headFromConfig(): Plugin {
  const c = CONFIG;
  const url = c.siteUrl.replace(/\/$/, "") + "/";
  const robots = c.rascunho ? "noindex, nofollow" : "index, follow";
  const e = c.endereco;
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: c.nome,
    url,
    image: url + "og-image.jpg",
    logo: url + "logo-msc-grafite-640.webp",
    telephone: c.telefoneE164,
    email: c.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: e.logradouro,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: "BR",
    },
    hasMap: c.mapsUrl,
    areaServed: "BR",
    knowsAbout: "Direito previdenciário",
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "12:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "13:00", closes: "18:00" },
    ],
    sameAs: [c.instagram.url],
  };
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const head = `
    <title>${esc(c.titulo)}</title>
    <meta name="description" content="${esc(c.descricao)}" />
    <meta name="robots" content="${robots}" />
    <meta name="googlebot" content="${robots}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="${esc(c.nome)}" />
    <meta property="og:title" content="${esc(c.titulo)}" />
    <meta property="og:description" content="${esc(c.descricao)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${url}og-image.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <script type="application/ld+json">${JSON.stringify(ld)}</script>`;
  return {
    name: "head-from-config",
    transformIndexHtml: (html) => html.replace("<!--HEAD-->", head),
  };
}

/** Embute o CSS (≈8 KB gzip) no HTML: um pedido a menos bloqueando a primeira pintura. */
function inlineCss(): Plugin {
  return {
    name: "inline-css",
    apply: "build",
    enforce: "post",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        if (!ctx.bundle) return html;
        return html.replace(/<link rel="stylesheet"[^>]*href="\/(assets\/[^"]+\.css)"[^>]*>/, (tag, file) => {
          const asset = ctx.bundle![file];
          return asset && asset.type === "asset" ? `<style>${asset.source}</style>` : tag;
        });
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), headFromConfig(), inlineCss()],
  build: { target: "es2020", cssCodeSplit: true, assetsInlineLimit: 0 },
});
