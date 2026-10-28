import { CONFIG } from './config'

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export const SEO = {
  title: 'Dr. Gustavo Borges Andrade | Dentista em Alfenas - MG',
  description:
    'Consultório odontológico em Alfenas - MG. Implantes, ortodontia, tratamento de canal, clareamento e estética do sorriso, com atendimento por hora marcada.',
}

export function absoluteUrl(path = '/') {
  const base = CONFIG.siteUrl.replace(/\/+$/, '')
  return path === '/' ? `${base}/` : `${base}${path.startsWith('/') ? '' : '/'}${path}`
}

function jsonLd() {
  const e = CONFIG.endereco
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: `${CONFIG.profissional.nome} | ${CONFIG.consultorio}`,
    url: absoluteUrl('/'),
    telephone: `+${CONFIG.telefone}`,
    email: CONFIG.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: e.rua,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: 'BR',
    },
    hasMap: CONFIG.mapsUrl,
    sameAs: [CONFIG.instagram.url],
    openingHoursSpecification: CONFIG.horarios.flatMap((h) =>
      h.turnos.map(([opens, closes]) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${h.schema}`,
        opens,
        closes,
      })),
    ),
  }
  if (CONFIG.ogImage) data.image = absoluteUrl(CONFIG.ogImage)
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/** Tags do <head>. `path` define canonical/og:url. */
export function headTags(opts: { path?: string; title?: string; description?: string; jsonLd?: boolean } = {}) {
  const path = opts.path ?? '/'
  const title = opts.title ?? SEO.title
  const description = opts.description ?? SEO.description
  const url = absoluteUrl(path)
  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:site_name" content="${esc(CONFIG.profissional.nome)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta name="twitter:card" content="${CONFIG.ogImage ? 'summary_large_image' : 'summary'}" />`,
  ]
  if (CONFIG.ogImage) {
    tags.push(
      `<meta property="og:image" content="${esc(absoluteUrl(CONFIG.ogImage))}" />`,
      `<meta property="og:image:width" content="1200" />`,
      `<meta property="og:image:height" content="630" />`,
      `<meta property="og:image:alt" content="${esc(CONFIG.profissional.nome + ', ' + CONFIG.profissional.titulo + ' em Alfenas - MG')}" />`,
    )
  }
  if (CONFIG.rascunho) {
    tags.push(
      `<meta name="robots" content="noindex, nofollow" />`,
      `<meta name="googlebot" content="noindex, nofollow" />`,
    )
  }
  if (opts.jsonLd !== false) tags.push(`<script type="application/ld+json">${jsonLd()}</script>`)
  return tags.join('\n    ')
}
