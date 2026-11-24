import { renderToString } from "react-dom/server";
import App from "./App";
import { CONFIG } from "./config";

export const render = () => renderToString(<App />);

const dias: Record<number, string> = {
  0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday",
};

export const jsonLd = () => {
  const e = CONFIG.endereco;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: CONFIG.nome,
    description: `${CONFIG.descritor} com atendimento individual em ${CONFIG.cidade} - ${CONFIG.uf}.`,
    url: CONFIG.siteUrl,
    telephone: `+${CONFIG.telefone}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: e.rua,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: "BR",
    },
    openingHoursSpecification: CONFIG.horarios
      .filter((h) => h.abre && h.fecha)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.diasSemana.map((d) => dias[d]),
        opens: h.abre,
        closes: h.fecha,
      })),
    sameAs: [CONFIG.instagram.url],
  };
  if (CONFIG.fotos.fachada) data.image = `${CONFIG.siteUrl}/og.jpg`;
  return JSON.stringify(data);
};

export const siteUrl = CONFIG.siteUrl;
export const rascunho = CONFIG.rascunho;
export const temOg = !!CONFIG.fotos.fachada;
