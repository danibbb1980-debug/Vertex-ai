import { site, unit } from "./site";

/** Dados estruturados da clínica (LocalBusiness) para o Google. */
export function localBusinessJsonLd() {
  const opening = unit.hours
    .filter((h) => h.open)
    .map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][h.day]}`,
      opens: h.open,
      closes: h.close,
    }));
  return {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: unit.name,
    url: site.url,
    image: `${site.url}/img/pirassununga/sala-atendimento.jpg`,
    telephone: "+55-19-3562-6669",
    address: {
      "@type": "PostalAddress",
      streetAddress: unit.street,
      addressLocality: unit.city,
      addressRegion: unit.state,
      postalCode: unit.postalCode,
      addressCountry: "BR",
    },
    hasMap: unit.mapsHref,
    openingHoursSpecification: opening,
    sameAs: [unit.instagramHref],
    brand: { "@type": "Brand", name: "Não+Pelo" },
  };
}
