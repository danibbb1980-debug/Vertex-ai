import { CONFIG } from '../config'

const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function jsonLd() {
  const e = CONFIG.endereco
  const abertos = CONFIG.horarios.filter((h) => h.abre && h.fecha)
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: CONFIG.nome,
    url: CONFIG.siteUrl.replace(/\/$/, '') + '/',
    telephone: '+55 35 99900-3915',
    address: {
      '@type': 'PostalAddress',
      streetAddress: e.logradouro,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: 'BR',
    },
    openingHoursSpecification: abertos.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${dayMap[h.dia]}`,
      opens: h.abre,
      closes: h.fecha,
    })),
    sameAs: [CONFIG.instagram.url],
  }
  if (CONFIG.email) data.email = CONFIG.email
  return JSON.stringify(data)
}
