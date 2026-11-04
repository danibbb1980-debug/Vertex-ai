import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { CONFIG, enderecoCompleto } from "./src/config";

const DIAS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// Injeta no index.html tudo que vem do config: SEO, canonical, OG e JSON-LD.
function seo(): Plugin {
  const url = CONFIG.siteUrl.replace(/\/$/, "") + "/";
  if (/localhost|127\.0\.0\.1/.test(url)) throw new Error("CONFIG.siteUrl não pode ser localhost");
  const title = "Clínica Dr. Feliciano | Dentista em Pouso Alegre - MG";
  const description =
    "Canal, ortodontia, implantes, clareamento, cirurgia e próteses com hora marcada, no centro de Pouso Alegre - MG. Agende sua avaliação pelo WhatsApp.";
  const e = CONFIG.endereco;
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: CONFIG.nome,
    url,
    telephone: "+" + CONFIG.whatsapp,
    image: url + "logo.svg",
    logo: url + "logo.svg",
    address: {
      "@type": "PostalAddress",
      streetAddress: e.rua,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: "BR",
    },
    openingHoursSpecification: CONFIG.horarios.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.dias.map((d) => DIAS[d]),
      opens: h.abre,
      closes: h.fecha,
    })),
    paymentAccepted: "Cartão de crédito, cartão de débito, pagamento por aproximação",
    sameAs: [CONFIG.instagram.url],
    hasMap: CONFIG.maps,
  };
  if (CONFIG.cro) jsonLd.identifier = CONFIG.cro;
  const robots = CONFIG.rascunho
    ? `<meta name="robots" content="noindex, nofollow" />\n    <meta name="googlebot" content="noindex, nofollow" />`
    : "";
  const head = `
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    ${robots}
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="${esc(CONFIG.nome)}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${url}" />
    <meta name="twitter:card" content="summary" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;
  return {
    name: "seo-config",
    transformIndexHtml: (html) =>
      html.replace("<!--SEO-->", head).replace("%ENDERECO%", esc(enderecoCompleto())),
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seo()],
  build: { target: "es2020", cssCodeSplit: false },
});
