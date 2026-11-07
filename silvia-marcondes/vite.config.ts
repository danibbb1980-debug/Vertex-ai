import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { CONFIG } from "./src/config";

const DIAS_SCHEMA = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const titulo =
  "Silvia Marcondes Estética | Depilação, Limpeza de Pele e Dermaplaning em São João da Boa Vista - SP";
const descricao =
  "Depilação, limpeza de pele e dermaplaning em São João da Boa Vista - SP, com atendimento de segunda a sexta das 6h30 às 21h e aos fins de semana pela manhã.";

function head(): string {
  const url = CONFIG.siteUrl.replace(/\/$/, "") + "/";
  const og = `${url}og.png`;
  const robots = CONFIG.rascunho ? "noindex, nofollow" : "index, follow";
  const e = CONFIG.endereco;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: CONFIG.marca.nomeCompleto,
    url,
    image: og,
    telephone: CONFIG.telefoneSchema,
    address: {
      "@type": "PostalAddress",
      streetAddress: e.rua,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: "BR",
    },
    hasMap: CONFIG.maps.link,
    sameAs: [CONFIG.instagram.url],
    openingHoursSpecification: CONFIG.horarios.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.dias.map((d) => DIAS_SCHEMA[d]),
      opens: h.abre,
      closes: h.fecha,
    })),
  };
  return `
    <title>${titulo}</title>
    <meta name="description" content="${descricao}" />
    <meta name="robots" content="${robots}" />
    <meta name="googlebot" content="${robots}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="${CONFIG.marca.nomeCompleto}" />
    <meta property="og:title" content="${titulo}" />
    <meta property="og:description" content="${descricao}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${og}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Silvia Marcondes Estética, em São João da Boa Vista - SP" />
    <meta name="twitter:card" content="summary_large_image" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;
}

// Pré-carrega só as fontes usadas acima da dobra (texto latino).
function preloads(arquivos: string[]): string {
  const alvos = [/fraunces-latin-soft-normal/, /fraunces-latin-soft-italic/, /figtree-latin-wght-normal/];
  return arquivos
    .filter((f) => f.endsWith(".woff2") && alvos.some((r) => r.test(f)))
    .map((f) => `\n    <link rel="preload" href="/${f}" as="font" type="font/woff2" crossorigin />`)
    .join("");
}

const seo = (): Plugin => ({
  name: "seo-head",
  transformIndexHtml: (html, ctx) =>
    html
      .replace("<!--HEAD-->", head() + preloads(ctx.bundle ? Object.keys(ctx.bundle) : []))
      .replace(
        "<!--NOSCRIPT-->",
        `<noscript><p style="padding:24px;font-family:sans-serif">${CONFIG.marca.nomeCompleto}, ${CONFIG.endereco.rua}, ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}. WhatsApp: <a href="https://wa.me/${CONFIG.whatsapp}">${CONFIG.whatsappExibicao}</a>.</p></noscript>`,
      ),
});

// Páginas estáticas (privacidade, 404) recebem os dados do config no build.
const paginasEstaticas = (): Plugin => ({
  name: "paginas-estaticas",
  apply: "build",
  closeBundle() {
    for (const f of ["privacidade.html", "404.html"]) {
      const p = path.resolve("dist", f);
      if (!fs.existsSync(p)) continue;
      const html = fs
        .readFileSync(p, "utf8")
        .replaceAll("__WA_LINK__", `https://wa.me/${CONFIG.whatsapp}`)
        .replaceAll("__WA_EXIB__", CONFIG.whatsappExibicao)
        .replaceAll("__SITE_URL__", CONFIG.siteUrl.replace(/\/$/, ""))
        .replace(/<div class="faixa"[^>]*>.*?<\/div>/, CONFIG.rascunho ? "$&" : "")
        .replace(/<meta name="(robots|googlebot)" content="noindex, nofollow">/g, CONFIG.rascunho ? "$&" : "");
      fs.writeFileSync(p, html);
    }
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), seo(), paginasEstaticas()],
  build: { target: "es2020", cssCodeSplit: false },
});
