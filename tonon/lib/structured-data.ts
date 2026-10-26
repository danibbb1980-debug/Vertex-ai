import { amenities, openingHours, portrait, site } from "./site-data";
import { faq } from "./faq";

const schemaDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * JSON-LD de negócio local, só com dados informados pelo laboratório.
 * Tipo genérico LocalBusiness: não assumimos uma categoria mais específica
 * que não tenha sido confirmada. Sem avaliações, coordenadas, e-mail ou CNPJ.
 */
export function localBusinessJsonLd() {
  const groups = new Map<string, string[]>();
  for (const d of openingHours) {
    if (!d.opens || !d.closes) continue;
    const key = `${d.opens}-${d.closes}`;
    groups.set(key, [...(groups.get(key) ?? []), schemaDays[d.weekday]]);
  }

  const publicUrl = site.url.startsWith("http://localhost") ? undefined : site.url;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    description: `${site.focus}. ${site.person}, ${site.role.toLowerCase()}.`,
    ...(publicUrl ? { url: publicUrl, "@id": `${publicUrl}/#laboratorio` } : {}),
    image: new URL(portrait.src, site.url).toString(),
    telephone: site.phone.e164,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    areaServed: { "@type": "City", name: site.city },
    hasMap: site.links.maps,
    sameAs: [site.links.instagram],
    founder: {
      "@type": "Person",
      name: site.person,
      jobTitle: "CEO",
      description: site.role,
      sameAs: [site.links.instagram],
    },
    openingHoursSpecification: [...groups.entries()].map(([range, days]) => {
      const [opens, closes] = range.split("-");
      return { "@type": "OpeningHoursSpecification", dayOfWeek: days, opens, closes };
    }),
    amenityFeature: amenities
      .filter((g) => g.title !== "Atendimento")
      .flatMap((g) => g.items)
      .map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
