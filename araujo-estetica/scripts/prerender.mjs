// Pré-renderiza index, privacidade e 404 em HTML estático (conteúdo existe sem JS),
// injeta metas/SEO/JSON-LD a partir do config e coloca o CSS inline.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const dist = path.resolve("dist");
const ssr = await import(pathToFileURL(path.resolve("dist-ssr/entry-server.js")).href);
const { render, CONFIG, servicosAtivos } = ssr;
const tpl = fs.readFileSync(path.join(dist, "index.html"), "utf8");

if (/localhost|127\.0\.0\.1/.test(CONFIG.siteUrl)) throw new Error("siteUrl não pode ser localhost");
const site = CONFIG.siteUrl.replace(/\/$/, "");

// CSS inline (crítico do hero incluído; o arquivo inteiro tem poucos KB)
const cssHref = tpl.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/);
let html0 = tpl;
if (cssHref) {
  const css = fs.readFileSync(path.join(dist, cssHref[1]), "utf8");
  html0 = html0.replace(cssHref[0], `<style>${css}</style>`);
}
// preload só da fonte do hero
const assets = fs.readdirSync(path.join(dist, "assets"));
// fontes da primeira dobra: display (nome) e texto (parágrafo do hero) — sem elas o parágrafo reflui e há salto
const heroFonts = assets.filter((f) => /^(red-hat-display|hanken-grotesk)-latin-wght-normal.*\.woff2$/.test(f));

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const nomesServ = servicosAtivos.map((s) => s.nome.toLowerCase());
const listaServ = nomesServ.length > 1 ? `${nomesServ.slice(0, -1).join(", ")} e ${nomesServ.at(-1)}` : nomesServ[0] ?? "";

const DIAS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const e = CONFIG.endereco;
const jsonld = {
  "@context": "https://schema.org",
  "@type": "AutoWash",
  name: CONFIG.nome,
  url: site + "/",
  ...(CONFIG.usarWhatsapp ? { telephone: "+" + CONFIG.whatsapp } : {}),
  image: site + "/icon-512.png",
  logo: site + "/icon-512.png",
  address: {
    "@type": "PostalAddress",
    streetAddress: `${e.rua}, ${e.numero}`,
    addressLocality: e.cidade,
    addressRegion: e.uf,
    postalCode: e.cep,
    addressCountry: "BR",
  },
  hasMap: CONFIG.mapsUrl,
  openingHoursSpecification: CONFIG.horarios
    .filter((h) => h.abre && h.fecha)
    .map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: DIAS[h.dia], opens: h.abre, closes: h.fecha })),
  ...(servicosAtivos.length
    ? {
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Serviços",
          itemListElement: servicosAtivos.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.nome } })),
        },
      }
    : {}),
  ...(CONFIG.instagram.url ? { sameAs: [CONFIG.instagram.url] } : {}),
};

function head({ title, description, url, index }) {
  const robots = CONFIG.rascunho || !index ? "noindex, nofollow" : "index, follow";
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<meta name="googlebot" content="${robots}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:site_name" content="${esc(CONFIG.nome)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${site}/icon-512.png" />`,
    `<meta property="og:image:alt" content="Monograma da ${esc(CONFIG.nome)}" />`,
    `<meta name="twitter:card" content="summary" />`,
    ...heroFonts.map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`),
  ].join("\n    ");
}

const pages = [
  {
    file: "index.html",
    app: render.index(),
    head: head({
      title: `${CONFIG.nome} | Lavagem Técnica e Higienização em ${CONFIG.cidade} - ${CONFIG.uf}`,
      description: `Estética automotiva em ${CONFIG.cidade} - ${CONFIG.uf}: ${listaServ}. Peça seu horário pelo WhatsApp.`,
      url: site + "/",
      index: true,
    }) + `\n    <script type="application/ld+json">${JSON.stringify(jsonld)}</script>`,
    hydrate: true,
  },
  {
    file: "privacidade.html",
    app: render.privacidade(),
    head: head({ title: `Privacidade | ${CONFIG.nome}`, description: `Como o site da ${CONFIG.nome} trata os dados: nenhum dado é guardado.`, url: site + "/privacidade.html", index: true }),
    hydrate: false,
  },
  {
    file: "404.html",
    app: render.notFound(),
    head: head({ title: `Página não encontrada | ${CONFIG.nome}`, description: `Página não encontrada no site da ${CONFIG.nome}.`, url: site + "/404.html", index: false }),
    hydrate: false,
  },
];

for (const p of pages) {
  let html = html0.replace("<!--head-->", p.head).replace("<!--app-->", p.app);
  if (CONFIG.rascunho === false) html = html.replace('<html lang="pt-BR">', '<html lang="pt-BR">');
  if (!p.hydrate) html = html.replace(/<script type="module"[^>]*><\/script>/, "").replace(/<link rel="modulepreload"[^>]*>/g, "");
  if (!CONFIG.rascunho) html = html.replace("<html lang=\"pt-BR\">", "<html lang=\"pt-BR\" class=\"no-draft\">");
  if (/localhost/.test(html)) throw new Error(`localhost encontrado em ${p.file}`);
  fs.writeFileSync(path.join(dist, p.file), html);
}
if (cssHref) fs.rmSync(path.join(dist, cssHref[1]));
fs.rmSync(path.resolve("dist-ssr"), { recursive: true, force: true });
console.log("prerender ok:", pages.map((p) => p.file).join(", "));
