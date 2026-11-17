import { CONFIG } from "./config";
import { FAQ } from "./components/Secoes";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

export const TITULO = "Clinic Sculpt | Estética em Varginha - MG";
export const DESCRICAO =
  "Clinic Sculpt, estética personalizada em Varginha - MG: avaliação individual, toxina botulínica, cuidados com a pele e estética corporal. Agendamento pelo WhatsApp.";

const DIAS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function head(): string {
  const url = CONFIG.siteUrl.replace(/\/$/, "");
  const e = CONFIG.endereco;
  const robots = CONFIG.rascunho ? "noindex, nofollow" : "index, follow";
  const ld = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: `${CONFIG.nome} | ${CONFIG.descritor}`,
    alternateName: CONFIG.nomeAlternativo,
    url: `${url}/`,
    image: `${url}/og-clinic-sculpt.jpg`,
    telephone: `+${CONFIG.whatsapp.slice(0, 2)} ${CONFIG.whatsapp.slice(2, 4)} ${CONFIG.whatsapp.slice(4, 9)}-${CONFIG.whatsapp.slice(9)}`,
    ...(CONFIG.email ? { email: CONFIG.email } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${e.rua}, ${e.numero}`,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: "BR",
    },
    areaServed: e.cidade,
    openingHoursSpecification: CONFIG.horarios
      .filter((h) => h.abre)
      .map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: DIAS[h.diaSemana], opens: h.abre, closes: h.fecha })),
    ...(CONFIG.instagram.url ? { sameAs: [CONFIG.instagram.url] } : {}),
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ().map((f) => ({ "@type": "Question", name: f.p, acceptedAnswer: { "@type": "Answer", text: f.r } })),
  };
  const json = (o: unknown) => JSON.stringify(o).replace(/</g, "\\u003c");
  return [
    `<title>${esc(TITULO)}</title>`,
    `<meta name="description" content="${esc(DESCRICAO)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<meta name="googlebot" content="${robots}" />`,
    `<link rel="canonical" href="${url}/" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:site_name" content="${esc(CONFIG.nome)}" />`,
    `<meta property="og:title" content="${esc(TITULO)}" />`,
    `<meta property="og:description" content="${esc(DESCRICAO)}" />`,
    `<meta property="og:url" content="${url}/" />`,
    `<meta property="og:image" content="${url}/og-clinic-sculpt.jpg" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Logotipo da Clinic Sculpt, Estética Personalizada" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<script type="application/ld+json">${json(ld)}</script>`,
    `<script type="application/ld+json">${json(faq)}</script>`,
  ].join("\n    ");
}
