/**
 * Gera, a partir do src/config.ts, o <head> do index.html (SEO, noindex, JSON-LD)
 * e as páginas estáticas privacidade.html e 404.html.
 */
import { CONFIG, enderecoLinha, temResponsavel } from "../src/config";
import { LETRAS } from "../src/components/logo-paths";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const base = CONFIG.siteUrl.replace(/\/$/, "");

export const DESCRICAO =
  "Instituto de odontologia e estética em Varginha - MG: estética dental e facial, implantes dentários, endodontia com microscopia e tratamento de dor orofacial. Agendamento de avaliação pelo WhatsApp.";
export const TITULO = "BIOS Instituto de Odontologia e Estética | Varginha - MG";

const DIAS = [
  "https://schema.org/Sunday",
  "https://schema.org/Monday",
  "https://schema.org/Tuesday",
  "https://schema.org/Wednesday",
  "https://schema.org/Thursday",
  "https://schema.org/Friday",
  "https://schema.org/Saturday",
];

export function jsonLd() {
  const e = CONFIG.endereco;
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: CONFIG.nome,
    url: base + "/",
    telephone: ["+55-35-3214-8743", "+55-35-99966-8743"],
    address: {
      "@type": "PostalAddress",
      streetAddress: `${e.rua}, ${e.numero}`,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: "BR",
    },
    hasMap: CONFIG.mapsUrl,
    sameAs: [CONFIG.instagram.url],
  };
  if (CONFIG.horarios.length) {
    ld.openingHoursSpecification = CONFIG.horarios.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: DIAS[h.dia],
      opens: h.abre,
      closes: h.fecha,
    }));
  }
  if (CONFIG.email) ld.email = CONFIG.email;
  return JSON.stringify(ld);
}

export function headTags() {
  const robots = CONFIG.rascunho
    ? `<meta name="robots" content="noindex, nofollow" />\n    <meta name="googlebot" content="noindex, nofollow" />`
    : "";
  const foto = CONFIG.fotos[0];
  const ogImage = foto
    ? `\n    <meta property="og:image" content="${esc(base + foto.src)}" />` +
      `\n    <meta property="og:image:alt" content="${esc(foto.alt)}" />` +
      (foto.largura && foto.altura
        ? `\n    <meta property="og:image:width" content="${foto.largura}" />\n    <meta property="og:image:height" content="${foto.altura}" />`
        : "")
    : "";
  return `<title>${esc(TITULO)}</title>
    <meta name="description" content="${esc(DESCRICAO)}" />
    ${robots}
    <link rel="canonical" href="${esc(base + "/")}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="${esc(CONFIG.nome)}" />
    <meta property="og:title" content="${esc(TITULO)}" />
    <meta property="og:description" content="${esc(DESCRICAO)}" />
    <meta property="og:url" content="${esc(base + "/")}" />${ogImage}
    <meta name="twitter:card" content="${foto ? "summary_large_image" : "summary"}" />
    <script type="application/ld+json">${jsonLd()}</script>`;
}

/** favicon: o "B" do wordmark em bronze sobre grafite */
export function faviconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#1F1E20"/><g transform="translate(14.5 11) scale(0.1615)"><path d="${LETRAS.B}" transform="translate(-44 -50)" fill="#B39462" fill-rule="evenodd"/></g></svg>`;
}

/* ---------- páginas estáticas ---------- */

const css = `
@font-face{font-family:"Brygada 1918";src:url(/fonts/brygada-400.woff2) format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"Hanken Grotesk";src:url(/fonts/hanken-400.woff2) format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"Hanken Grotesk";src:url(/fonts/hanken-600.woff2) format("woff2");font-weight:600;font-display:swap}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:#EEEAE2;color:#1F1E20;font:400 1.0625rem/1.65 "Hanken Grotesk",system-ui,sans-serif}
.faixa{background:#1F1E20;color:#EEEAE2;font-size:.8125rem;padding:.5rem 1rem;text-align:center}
main{max-width:42rem;margin:0 auto;padding:4rem 1.25rem 5rem}
.marca{font:600 .75rem/1 "Hanken Grotesk",sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#735A2B;text-decoration:none}
h1{font:400 clamp(2.25rem,6vw,3.5rem)/1.05 "Brygada 1918",Georgia,serif;letter-spacing:-.02em;margin:2.5rem 0 1.5rem}
h2{font:400 1.5rem/1.2 "Brygada 1918",Georgia,serif;margin:2.5rem 0 .5rem}
p,li{max-width:62ch}
a{color:#1F1E20;text-underline-offset:.2em}
a:focus-visible{outline:2px solid #735A2B;outline-offset:3px}
.regua{height:12px;margin:3rem 0;background:repeating-linear-gradient(90deg,#A8894F 0 1px,transparent 1px 12px);border-bottom:1px solid #A8894F}
.botao{display:inline-flex;align-items:center;min-height:48px;padding:0 1.5rem;background:#1F1E20;color:#EEEAE2;text-decoration:none;font-weight:600}
small{color:#5F5A53}
`;

function pagina(titulo: string, corpo: string) {
  const robots = CONFIG.rascunho
    ? `<meta name="robots" content="noindex, nofollow" /><meta name="googlebot" content="noindex, nofollow" />`
    : "";
  const faixa = CONFIG.rascunho
    ? `<div class="faixa" role="note">Rascunho para avaliação. Informações sujeitas a confirmação.</div>`
    : "";
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(titulo)}</title>
${robots}
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<meta name="theme-color" content="#EEEAE2" />
<style>${css}</style>
</head>
<body>
${faixa}
<main>
<a class="marca" href="/">${esc(CONFIG.nome)}</a>
${corpo}
</main>
</body>
</html>`;
}

export function privacidadeHtml() {
  const rt = temResponsavel()
    ? `<p>Responsável técnico: ${esc(CONFIG.responsavelTecnico.nome)} · ${esc(CONFIG.responsavelTecnico.cro)}</p>`
    : "";
  return pagina(
    "Privacidade | " + CONFIG.nome,
    `<h1>Privacidade</h1>
<p>Este site é informativo. Ele não tem cadastro, não usa cookies, não usa ferramentas de análise de visitas e não guarda nenhum dado digitado.</p>
<h2>O formulário de agendamento</h2>
<p>Quando você preenche o formulário "Solicitar agendamento" e envia, o seu próprio navegador monta uma mensagem de texto e abre uma conversa no WhatsApp com a clínica. Nada é enviado para servidores deste site e nada fica salvo no navegador.</p>
<p>A mensagem só chega à clínica se você a enviar no WhatsApp. A partir daí, a conversa segue as regras de privacidade do próprio WhatsApp.</p>
<p>Não é preciso informar dados de saúde no formulário. Se quiser, conte isso diretamente na conversa.</p>
<h2>Mapa e links externos</h2>
<p>O mapa da seção de contato é carregado do Google Maps apenas quando você chega até ele na página. Os botões de WhatsApp, Instagram e Google Maps abrem serviços de terceiros, cada um com a sua política de privacidade.</p>
<h2>Contato</h2>
<p>${esc(CONFIG.nome)}<br />${esc(enderecoLinha())}, CEP ${esc(CONFIG.endereco.cep)}<br />Telefone ${esc(CONFIG.telefone)} · WhatsApp ${esc(CONFIG.whatsappExibicao)}</p>
${rt}
<div class="regua" aria-hidden="true"></div>
<a class="botao" href="/">Voltar ao site</a>`
  );
}

export function naoEncontradaHtml() {
  return pagina(
    "Página não encontrada | " + CONFIG.nome,
    `<h1>Esta página não existe.</h1>
<p>O endereço pode ter mudado ou ter sido digitado com algum erro.</p>
<div class="regua" aria-hidden="true"></div>
<a class="botao" href="/">Ir para a página inicial</a>`
  );
}
