import { modalities, openingHours, photos, site } from "./site-data";

const schemaDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * JSON-LD de negócio local (ExerciseGym), só com dados confirmados.
 * Propositalmente SEM aggregateRating/review: a nota não vem de uma
 * integração oficial, e marcar estrelas próprias viola as diretrizes de
 * dados estruturados do Google para avaliações autodeclaradas.
 * Sem coordenadas (não informadas) e sem e-mail/CNPJ.
 */
export function localBusinessJsonLd() {
  // Agrupa dias com o mesmo horário: seg–sex 06:00–21:30, sáb 07:00–13:00.
  const groups = new Map<string, string[]>();
  for (const d of openingHours) {
    if (!d.opens || !d.closes) continue;
    const key = `${d.opens}-${d.closes}`;
    groups.set(key, [...(groups.get(key) ?? []), schemaDays[d.weekday]]);
  }

  const publicUrl = site.url.startsWith("http://localhost") ? undefined : site.url;

  return {
    "@context": "https://schema.org",
    "@type": "ExerciseGym",
    name: site.name,
    description: `Academia de musculação e aulas coletivas em ${site.city} – ${site.state}.`,
    ...(publicUrl ? { url: publicUrl, "@id": `${publicUrl}/#academia` } : {}),
    image: new URL(photos.cardio.src, site.url).toString(),
    logo: new URL("/brand/logo-original.jpg", site.url).toString(),
    telephone: site.phone.e164,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.address.street} – ${site.address.district}`,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    areaServed: { "@type": "City", name: site.city },
    hasMap: site.links.maps,
    sameAs: [site.links.instagram],
    openingHoursSpecification: [...groups.entries()].map(([range, days]) => {
      const [opens, closes] = range.split("-");
      return { "@type": "OpeningHoursSpecification", dayOfWeek: days, opens, closes };
    }),
    amenityFeature: modalities.map((m) => ({
      "@type": "LocationFeatureSpecification",
      name: m.name,
      value: true,
    })),
  };
}
