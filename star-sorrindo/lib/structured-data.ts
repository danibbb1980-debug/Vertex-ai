import type { FaqItem } from "./faq";
import { openingHours, site, treatments } from "./site-data";

const schemaDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const publicUrl = site.url.startsWith("http://localhost") ? undefined : site.url;

/**
 * JSON-LD de clínica odontológica (Dentist), só com dados fornecidos.
 * Propositalmente SEM aggregateRating/review: a nota não vem de uma
 * integração oficial com o Google, e marcar estrelas próprias viola as
 * diretrizes de dados estruturados para avaliações autodeclaradas.
 * Sem coordenadas, e-mail ou CNPJ (não informados).
 */
export function dentistJsonLd() {
  const groups = new Map<string, string[]>();
  for (const d of openingHours) {
    if (!d.opens || !d.closes) continue;
    const key = `${d.opens}-${d.closes}`;
    groups.set(key, [...(groups.get(key) ?? []), schemaDays[d.weekday]]);
  }

  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: site.name,
    description: `Clínica odontológica no Centro de ${site.city} — ${site.state}: implantes dentários, próteses e clínica geral.`,
    ...(publicUrl ? { url: publicUrl, "@id": `${publicUrl}/#clinica`, image: `${publicUrl}/opengraph-image.png` } : {}),
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
    openingHoursSpecification: [...groups.entries()].map(([range, days]) => {
      const [opens, closes] = range.split("-");
      return { "@type": "OpeningHoursSpecification", dayOfWeek: days, opens, closes };
    }),
    availableService: treatments.map((t) => ({ "@type": "MedicalProcedure", name: t.name })),
  };
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  if (!publicUrl) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${publicUrl}${item.path}`,
    })),
  };
}
