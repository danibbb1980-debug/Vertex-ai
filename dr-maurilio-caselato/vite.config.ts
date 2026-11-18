import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { CONFIG } from "./src/config.ts";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function headDoConfig(): Plugin {
  const url = CONFIG.siteUrl.replace(/\/$/, "");
  const title = `${CONFIG.nome} | ${CONFIG.profissao} em ${CONFIG.cidade} - ${CONFIG.uf}`;
  const description = `${CONFIG.nome}, ${CONFIG.profissao.toLowerCase()}, ${CONFIG.cro}. Alinhadores transparentes e lentes de contato dental com avaliação individual em ${CONFIG.cidade} - ${CONFIG.uf}. Agendamento pelo WhatsApp.`;
  const ogFoto = CONFIG.fotos.consultorio[0];
  const ogImage = ogFoto ? `${url}${ogFoto.src}-${Math.max(...ogFoto.larguras)}.jpg` : "";

  const dias = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const abertos = CONFIG.horarios.filter((h): h is Extract<typeof h, { abre: string }> => "abre" in h);
  const jsonld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: CONFIG.nome,
    url: `${url}/`,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${CONFIG.endereco.rua}, ${CONFIG.endereco.numero}`,
      addressLocality: CONFIG.endereco.cidade,
      addressRegion: CONFIG.endereco.uf,
      postalCode: CONFIG.endereco.cep,
      addressCountry: "BR",
    },
    openingHoursSpecification: abertos.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${dias[h.diaSemana]}`,
      opens: h.abre,
      closes: h.fecha,
    })),
    sameAs: CONFIG.instagram ? [CONFIG.instagram] : undefined,
  };
  if (CONFIG.whatsapp) jsonld.telephone = `+${CONFIG.whatsapp}`;
  if (ogImage) jsonld.image = ogImage;

  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    CONFIG.rascunho ? `<meta name="robots" content="noindex, nofollow" />` : "",
    CONFIG.rascunho ? `<meta name="googlebot" content="noindex, nofollow" />` : "",
    `<link rel="canonical" href="${url}/" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${url}/" />`,
    ogImage ? `<meta property="og:image" content="${ogImage}" />` : "",
    ogImage ? `<meta property="og:image:alt" content="${esc(ogFoto!.alt)}" />` : "",
    `<meta name="twitter:card" content="${ogImage ? "summary_large_image" : "summary"}" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>`,
  ].filter(Boolean);

  return {
    name: "head-do-config",
    transformIndexHtml(html, ctx) {
      const preloads = Object.keys(ctx.bundle ?? {})
        .filter((f) => /(schibsted-grotesk-latin-500-normal|hanken-grotesk-latin-400-normal).*\.woff2$/.test(f))
        .map((f) => `<link rel="preload" href="/${f}" as="font" type="font/woff2" crossorigin />`);
      return html.replace("<!--HEAD-->", [...tags, ...preloads].join("\n    "));
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), headDoConfig()],
  build: { target: "es2020", cssCodeSplit: false },
});
