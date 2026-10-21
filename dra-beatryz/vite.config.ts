import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { CONFIG, credencial } from "./src/config.ts";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const titulo = "Dra. Beatryz Furlaneto | Odontopediatria em São João da Boa Vista";
const descricao =
  "Dra. Beatryz Furlaneto, cirurgiã-dentista: clínica geral e odontopediatria em São João da Boa Vista, Artur Nogueira e Casa Branca (SP). Agende uma avaliação pelo WhatsApp.";

const fontes =
  "https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&display=swap";

const robotsMeta = CONFIG.rascunho
  ? `<meta name="robots" content="noindex, nofollow" />
    <meta name="googlebot" content="noindex, nofollow" />`
  : "";

function jsonLd() {
  const sj = CONFIG.unidades[0];
  const data = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: CONFIG.nome,
    description: `${CONFIG.profissao}. ${credencial}. ${CONFIG.cro}.`,
    url: `${CONFIG.siteUrl}/`,
    image: `${CONFIG.siteUrl}${CONFIG.fotos.og}`,
    telephone: "+55-19-99187-2808",
    sameAs: [CONFIG.instagram],
    hasMap: CONFIG.googleMaps,
    address: {
      "@type": "PostalAddress",
      streetAddress: "R. Cel. José Procópio, 634 - Vila Conrado",
      addressLocality: "São João da Boa Vista",
      addressRegion: "SP",
      postalCode: sj.cep,
      addressCountry: "BR",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "20:00",
      },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "12:00" },
    ],
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

const head = `
    <title>${esc(titulo)}</title>
    <meta name="description" content="${esc(descricao)}" />
    ${robotsMeta}
    <link rel="canonical" href="${CONFIG.siteUrl}/" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:title" content="${esc(titulo)}" />
    <meta property="og:description" content="${esc(descricao)}" />
    <meta property="og:url" content="${CONFIG.siteUrl}/" />
    <meta property="og:image" content="${CONFIG.siteUrl}${CONFIG.fotos.og}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${esc(CONFIG.fotos.hero.alt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="${fontes}" />
    ${jsonLd()}`;

/** Página simples (privacidade e 404) com o mesmo visual básico. */
function paginaSimples(t: string, corpo: string) {
  const faixa = CONFIG.rascunho
    ? `<div class="faixa">Rascunho para avaliação. Informações sujeitas a confirmação.</div>`
    : "";
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(t)} | ${esc(CONFIG.nome)}</title>
    ${robotsMeta}
    <meta name="theme-color" content="#fbf7f2" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="${fontes}" />
    <style>
      *{box-sizing:border-box}
      body{margin:0;background:#fbf7f2;color:#3b2a36;font:17px/1.65 "DM Sans",system-ui,sans-serif}
      .faixa{background:#efe4ee;color:#4b3466;font-size:13px;text-align:center;padding:6px 16px}
      main{max-width:680px;margin:0 auto;padding:56px 20px 80px}
      a{color:#8e3557;text-underline-offset:3px}
      a:focus-visible{outline:2px solid #8e3557;outline-offset:3px;border-radius:4px}
      h1{font-family:Fraunces,Georgia,serif;font-weight:500;font-size:clamp(32px,6vw,44px);line-height:1.1;margin:8px 0 24px}
      h2{font-family:Fraunces,Georgia,serif;font-weight:500;font-size:22px;margin:32px 0 8px}
      .assinatura{font-family:Fraunces,Georgia,serif;font-size:20px;text-decoration:none;color:#3b2a36}
      .assinatura small{display:block;font-family:"DM Sans",sans-serif;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#8e3557}
      .btn{display:inline-block;margin-top:24px;background:#8e3557;color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:600}
      .muted{color:#6b5866;font-size:15px}
    </style>
  </head>
  <body>
    ${faixa}
    <main>
      <a class="assinatura" href="/">${esc(CONFIG.nome)}<small>Odontopediatria</small></a>
      ${corpo}
    </main>
  </body>
</html>`;
}

const privacidade = paginaSimples(
  "Privacidade",
  `<h1>Privacidade</h1>
  <p>Este site é apenas informativo. Ele não usa cookies próprios, ferramentas de análise, pixels de anúncio nem formulários, e não coleta dados pessoais.</p>
  <h2>Contato pelo WhatsApp</h2>
  <p>Ao tocar em “Agendar”, você é levado ao WhatsApp com uma mensagem pronta. Nada é enviado sem a sua ação. A conversa segue as regras de privacidade do WhatsApp, e os dados que você compartilhar ali são usados só para responder ao seu contato e organizar o atendimento.</p>
  <h2>Serviços de terceiros</h2>
  <p>As fontes do site vêm do Google Fonts. O mapa do Google só é carregado se você tocar em “Carregar mapa”; a partir daí, valem as regras de privacidade do Google. Os links para Instagram e Google Maps abrem os sites desses serviços.</p>
  <h2>Dúvidas</h2>
  <p>Fale com a ${esc(CONFIG.nome)} pelo WhatsApp <a href="https://wa.me/${CONFIG.whatsapp}" rel="noopener noreferrer" target="_blank">${esc(CONFIG.whatsappExibicao)}</a>.</p>
  <p class="muted">${esc(CONFIG.profissao)} · ${esc(CONFIG.cro)}</p>
  <a class="btn" href="/">Voltar ao início</a>`,
);

const pagina404 = paginaSimples(
  "Página não encontrada",
  `<h1>Esta página não foi encontrada.</h1>
  <p>O endereço pode ter mudado. Volte ao início para conhecer o atendimento ou fale direto com a doutora.</p>
  <a class="btn" href="/">Voltar ao início</a>
  <p style="margin-top:20px"><a href="https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.mensagemWhatsapp)}" rel="noopener noreferrer" target="_blank">Falar pelo WhatsApp</a></p>`,
);

function siteConfigPlugin(): Plugin {
  return {
    name: "site-config",
    transformIndexHtml(html) {
      return html.replace("<!--HEAD-->", head);
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "privacidade.html", source: privacidade });
      this.emitFile({ type: "asset", fileName: "404.html", source: pagina404 });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteConfigPlugin()],
});
