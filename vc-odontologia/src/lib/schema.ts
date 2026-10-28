import { CONFIG } from '../config'

/**
 * JSON-LD do tipo Dentist. Sem AggregateRating, sem Review e sem especialidades
 * (até a clínica confirmar). Endereço, telefone e horários vêm do CONFIG.
 */
export function jsonLd() {
  const url = CONFIG.siteUrl.replace(/\/$/, '')
  const e = CONFIG.endereco
  return {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    '@id': `${url}/#clinica`,
    name: CONFIG.nome,
    alternateName: CONFIG.nomeCompleto,
    url: `${url}/`,
    image: `${url}/og-image.jpg`,
    logo: `${url}/marca/logo-vc-96.png`,
    telephone: CONFIG.telefoneSchema,
    address: {
      '@type': 'PostalAddress',
      streetAddress: e.logradouro,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: 'BR',
    },
    hasMap: CONFIG.maps.url,
    sameAs: [CONFIG.instagram.url],
    openingHoursSpecification: CONFIG.horarios
      .filter((h) => h.schemaDias.length && h.abre && h.fecha)
      .map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.schemaDias,
        opens: h.abre,
        closes: h.fecha,
      })),
  }
}
