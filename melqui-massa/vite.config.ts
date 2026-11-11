import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { CONFIG } from "./src/config";

// Injeta no index.html os dados de SEO vindos do config (canonical, og, JSON-LD).
function seo() {
  const e = CONFIG.endereco;
  const url = CONFIG.siteUrl.replace(/\/$/, "") + "/";
  const dias = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: CONFIG.nome,
    url,
    telephone: "+" + CONFIG.whatsapp,
    sameAs: [CONFIG.instagram.url],
    hasMap: CONFIG.mapsUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${e.predio}, ${e.logradouro}, ${e.complemento}`,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: "BR",
    },
    areaServed: { "@type": "City", name: e.cidade },
    openingHoursSpecification: CONFIG.horarios.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${dias[h.dia]}`,
      opens: h.abre,
      closes: h.fecha,
    })),
  };
  if (CONFIG.crm) ld.identifier = { "@type": "PropertyValue", propertyID: `CRM-${CONFIG.crmUF}`, value: CONFIG.crm };
  if (CONFIG.mostrarEspecialidade && CONFIG.especialidades.length)
    ld.medicalSpecialty = CONFIG.especialidades.map((s) => s.nome);
  const robots = CONFIG.rascunho ? "noindex, nofollow" : "index, follow";
  return {
    name: "seo",
    transformIndexHtml(html: string) {
      return html
        .replace(/%SITE_URL%/g, url)
        .replace(/%ROBOTS%/g, robots)
        .replace("%JSONLD%", JSON.stringify(ld));
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seo()],
});
