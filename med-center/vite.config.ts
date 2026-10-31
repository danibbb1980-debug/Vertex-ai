import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { CONFIG, enderecoCompleto } from "./src/config";

// Injeta URL absoluta (CONFIG.siteUrl) e JSON-LD no index.html em tempo de build.
function seo(): Plugin {
  const url = CONFIG.siteUrl.replace(/\/$/, "");
  const e = CONFIG.endereco;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: CONFIG.nome,
    url: url + "/",
    telephone: "+55-35-3025-9494",
    image: url + CONFIG.logo,
    address: {
      "@type": "PostalAddress",
      streetAddress: e.rua,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: "BR",
    },
    hasMap: CONFIG.mapsUrl,
    sameAs: [CONFIG.instagram.url],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "19:30",
      },
    ],
    paymentAccepted: "Cartão de crédito, cartão de débito, pagamento por aproximação",
    description: "Centro de saúde em " + enderecoCompleto(),
  };
  return {
    name: "seo-inject",
    transformIndexHtml(html) {
      return html
        .replaceAll("%SITE_URL%", url)
        .replace("%JSON_LD%", JSON.stringify(jsonLd).replace(/</g, "\\u003c"));
    },
  };
}

export default defineConfig({
  plugins: [react(), seo()],
  build: { target: "es2020", cssMinify: true },
});
