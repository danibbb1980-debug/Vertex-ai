import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { CONFIG, modoAtual, profissionaisAtivas, enderecoCompleto } from "./src/config.ts";

const DIAS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

/** Gera <head> (title, description, robots, canonical, OG, JSON-LD) a partir do CONFIG. */
function headDoConfig(): Plugin {
  return {
    name: "head-do-config",
    transformIndexHtml(html) {
      const modo = modoAtual();
      const url = CONFIG.siteUrl.replace(/\/$/, "");
      const meta = {
        ambas: {
          title: "Odonto Baixinhos e Dra. Josiane Silva | Dentistas em Alfenas - MG",
          description:
            "Odontologia para crianças e para adultos, lado a lado, no centro de Alfenas - MG. Agende uma avaliação pelo WhatsApp.",
          og: "/img/og-ambas.jpg",
        },
        aline: {
          title: "Odonto Baixinhos · Dra. Aline Maciel | Dentista para crianças em Alfenas - MG",
          description:
            "Odontologia para bebês, crianças, pessoas com deficiência e gestantes no centro de Alfenas - MG. Agende uma avaliação pelo WhatsApp.",
          og: "/img/og-aline.jpg",
        },
        josiane: {
          title: "Dra. Josiane Silva | Cirurgiã-Dentista em Alfenas - MG",
          description:
            "Atendimento odontológico individualizado para adultos no centro de Alfenas - MG. Agende uma avaliação pelo WhatsApp.",
          og: "/img/og-josiane.jpg",
        },
      }[modo];

      const horarios = Object.entries(CONFIG.horarios).flatMap(([dia, faixas]) =>
        faixas.map((f) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: `https://schema.org/${DIAS[Number(dia)]}`,
          opens: f.inicio,
          closes: f.fim,
        })),
      );

      const dentistas = profissionaisAtivas().map((p) => ({
        "@type": "Dentist",
        "@id": `${url}/#${p.id === "aline" ? "odonto-baixinhos" : "dra-josiane"}`,
        name: p.id === "aline" ? `${p.consultorio} · ${p.nome}` : p.nome,
        url: `${url}/`,
        image: `${url}${p.foto.base}-${p.foto.larguras[p.foto.larguras.length - 1]}.webp`,
        telephone: `+${p.whatsapp.slice(0, 2)} ${p.whatsapp.slice(2, 4)} ${p.whatsapp.slice(4)}`,
        sameAs: [p.instagram],
        hasMap: CONFIG.endereco.mapsUrl,
        address: {
          "@type": "PostalAddress",
          streetAddress: CONFIG.endereco.rua,
          addressLocality: CONFIG.endereco.cidade,
          addressRegion: CONFIG.endereco.uf,
          postalCode: CONFIG.endereco.cep,
          addressCountry: CONFIG.endereco.pais,
        },
        openingHoursSpecification: horarios,
        paymentAccepted: "Cartão de crédito, cartão de débito",
      }));

      const robots = CONFIG.rascunho ? "noindex, nofollow" : "index, follow";
      const tags = [
        `<title>${esc(meta.title)}</title>`,
        `<meta name="description" content="${esc(meta.description)}" />`,
        `<meta name="robots" content="${robots}" />`,
        `<meta name="googlebot" content="${robots}" />`,
        `<link rel="canonical" href="${url}/" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:locale" content="pt_BR" />`,
        `<meta property="og:title" content="${esc(meta.title)}" />`,
        `<meta property="og:description" content="${esc(meta.description)}" />`,
        `<meta property="og:url" content="${url}/" />`,
        `<meta property="og:image" content="${url}${meta.og}" />`,
        `<meta property="og:image:width" content="1200" />`,
        `<meta property="og:image:height" content="630" />`,
        `<meta property="og:image:alt" content="${esc(`Fachada na ${enderecoCompleto}`)}" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": dentistas })}</script>`,
      ];
      return html.replace("<!--HEAD-->", tags.join("\n    "));
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), headDoConfig()],
  build: { target: "es2020", cssCodeSplit: true, assetsInlineLimit: 2048 },
});
