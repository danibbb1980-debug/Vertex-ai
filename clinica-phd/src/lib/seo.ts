import { CONFIG, areasAtivas } from "../config";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const lista = (n: string[]) => (n.length <= 1 ? n.join("") : `${n.slice(0, -1).join(", ")} e ${n[n.length - 1]}`);

/** Gera as tags de <head>: título, descrição, robots (rascunho), canonical, Open Graph e JSON-LD. */
export function cabecalhoSeo(opcoes: { temImagemOg: boolean }) {
  const url = CONFIG.siteUrl.replace(/\/$/, "");
  const nomes = areasAtivas.map((a) => a.nome);
  const titulo = `${CONFIG.nome} | ${lista(nomes)} em ${CONFIG.cidade} - ${CONFIG.uf}`;
  const descricao = `Clínica médica com ${lista(nomes.map((n) => n.toLowerCase()))}, com hora marcada, em ${CONFIG.cidade} - ${CONFIG.uf}.`;
  const e = CONFIG.endereco;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${url}/#clinica`,
    name: CONFIG.nome,
    url: `${url}/`,
    telephone: `+${CONFIG.telefone}`,
    email: CONFIG.email || undefined,
    logo: `${url}/logo-phd.png`,
    ...(opcoes.temImagemOg ? { image: `${url}/og-image.png` } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${e.logradouro}, ${e.complemento}, ${e.edificio}`,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: "BR",
    },
    hasMap: CONFIG.maps.url || undefined,
    sameAs: CONFIG.instagram.url ? [CONFIG.instagram.url] : undefined,
    areaServed: { "@type": "City", name: e.cidade },
    openingHoursSpecification: CONFIG.horarios
      .filter((h) => h.abre && h.fecha)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][h.dia]}`,
        opens: h.abre,
        closes: h.fecha,
      })),
  };

  const robots = CONFIG.rascunho ? "noindex, nofollow" : "index, follow";
  const tags = [
    `<title>${esc(titulo)}</title>`,
    `<meta name="description" content="${esc(descricao)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<meta name="googlebot" content="${robots}" />`,
    `<link rel="canonical" href="${url}/" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:site_name" content="${esc(CONFIG.nome)}" />`,
    `<meta property="og:title" content="${esc(titulo)}" />`,
    `<meta property="og:description" content="${esc(descricao)}" />`,
    `<meta property="og:url" content="${url}/" />`,
    ...(opcoes.temImagemOg
      ? [
          `<meta property="og:image" content="${url}/og-image.png" />`,
          `<meta property="og:image:width" content="1200" />`,
          `<meta property="og:image:height" content="630" />`,
          `<meta property="og:image:alt" content="Monograma PHD em dourado sobre cinza-chumbo, ${esc(CONFIG.nome)}" />`,
          `<meta name="twitter:card" content="summary_large_image" />`,
        ]
      : []),
    `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`,
  ];
  return tags.join("\n    ");
}
