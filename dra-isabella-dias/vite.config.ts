import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { CONFIG } from "./src/config";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function headPlugin(): Plugin {
  const url = CONFIG.siteUrl.replace(/\/$/, "") + "/";
  const titulo = "Dra. Isabella Dias | Cirurgiã-dentista em Serra Negra - SP";
  const descricao =
    "Dra. Isabella Dias, cirurgiã-dentista, CRO-SP 89630. Clínica geral e implantes dentários com avaliação individual em Serra Negra - SP. Agendamento por telefone.";
  const imagem = CONFIG.fotos.retrato ? url + CONFIG.fotos.retrato.src.replace(/^\//, "") : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: CONFIG.nome,
    url,
    ...(imagem ? { image: imagem } : {}),
    telephone: "+" + CONFIG.telefone,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${CONFIG.endereco.logradouro}, ${CONFIG.endereco.complemento}`,
      addressLocality: CONFIG.endereco.cidade,
      addressRegion: CONFIG.endereco.uf,
      postalCode: CONFIG.endereco.cep,
      addressCountry: "BR",
    },
    openingHoursSpecification: CONFIG.horarios.flatMap((d) =>
      d.turnos.map(([opens, closes]) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: d.schema,
        opens,
        closes,
      })),
    ),
    sameAs: [CONFIG.instagram],
  };

  const tags = [
    `<title>${esc(titulo)}</title>`,
    `<meta name="description" content="${esc(descricao)}" />`,
    CONFIG.rascunho ? `<meta name="robots" content="noindex, nofollow" />` : "",
    CONFIG.rascunho ? `<meta name="googlebot" content="noindex, nofollow" />` : "",
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:title" content="${esc(titulo)}" />`,
    `<meta property="og:description" content="${esc(descricao)}" />`,
    `<meta property="og:url" content="${url}" />`,
    imagem ? `<meta property="og:image" content="${imagem}" />` : "",
    `<meta name="twitter:card" content="${imagem ? "summary_large_image" : "summary"}" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
  ]
    .filter(Boolean)
    .join("\n    ");

  return {
    name: "head-config",
    transformIndexHtml(html) {
      return html.replace("<!--HEAD-->", tags).replace("<body>", CONFIG.rascunho ? '<body class="com-faixa">' : "<body>");
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), headPlugin()],
  build: { cssCodeSplit: false, assetsInlineLimit: 0 },
});
