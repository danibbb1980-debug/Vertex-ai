import { faq } from "./faq";
import { site, treatments } from "./site";

/**
 * JSON-LD (schema.org/Dentist) para SEO local. Só dados confirmados:
 * sem coordenadas, CNPJ, horários, avaliações ou nome de profissional.
 */
export function dentistJsonLd() {
  const address: Record<string, string> = {
    "@type": "PostalAddress",
    addressLocality: site.city,
    addressRegion: site.state,
    addressCountry: "BR",
  };
  if (site.streetAddress) address.streetAddress = site.streetAddress;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Dentist",
        "@id": `${site.url}/#clinica`,
        name: site.name,
        description: site.description,
        url: site.url,
        image: `${site.url}/brand/logo-on-yellow.png`,
        logo: `${site.url}/brand/logo-vertical.png`,
        telephone: site.phoneE164,
        address,
        areaServed: { "@type": "City", name: `${site.city}, ${site.state}` },
        sameAs: [site.instagram.url],
        availableService: treatments.map((t) => ({ "@type": "MedicalProcedure", name: t.name })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}
