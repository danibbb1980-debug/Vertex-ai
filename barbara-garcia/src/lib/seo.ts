import { CONFIG } from '../config'
import { perguntas } from '../components/Informativo'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

export const TITULO = 'Barbara Garcia Estética | Massagens, Terapias e Depilação com Cera em São João da Boa Vista - SP'
export const DESCRICAO =
  'Massagens, terapias faciais e corporais e depilação com cera, com hora marcada, na Vila Fleming, em São João da Boa Vista - SP. Peça seu horário pelo WhatsApp.'

const DIAS_SCHEMA = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function jsonLd() {
  const { endereco, siteUrl } = CONFIG
  const negocio = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    '@id': `${siteUrl}/#negocio`,
    name: CONFIG.marca.nomeCompleto,
    url: `${siteUrl}/`,
    telephone: CONFIG.whatsapp ? `+${CONFIG.whatsapp}` : undefined,
    image: `${siteUrl}/og.png`,
    logo: `${siteUrl}/brand/logo-fundo-claro.svg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: endereco.rua,
      addressLocality: endereco.cidade,
      addressRegion: endereco.uf,
      postalCode: endereco.cep,
      addressCountry: 'BR',
    },
    areaServed: { '@type': 'City', name: endereco.cidade },
    hasMap: CONFIG.maps.url || undefined,
    sameAs: [CONFIG.instagram.url].filter(Boolean),
    openingHoursSpecification: CONFIG.horarios
      .filter((d) => d.abre && d.fecha)
      .map((d) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: DIAS_SCHEMA[d.dow], opens: d.abre, closes: d.fecha })),
    makesOffer: CONFIG.atendimentos.map((a) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: a.nome } })),
  }
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: perguntas().map((q) => ({ '@type': 'Question', name: q.p, acceptedAnswer: { '@type': 'Answer', text: q.r } })),
  }
  return [negocio, faq]
}

export function head(): string {
  const url = `${CONFIG.siteUrl}/`
  const robots = CONFIG.rascunho ? 'noindex, nofollow' : 'index, follow'
  const tags = [
    `<title>${esc(TITULO)}</title>`,
    `<meta name="description" content="${esc(DESCRICAO)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<meta name="googlebot" content="${robots}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:site_name" content="${esc(CONFIG.marca.nomeCompleto)}" />`,
    `<meta property="og:title" content="${esc(TITULO)}" />`,
    `<meta property="og:description" content="${esc(DESCRICAO)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${CONFIG.siteUrl}/og.png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Marca Barbara Garcia Estética sobre fundo verde-oliva" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    ...jsonLd().map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`),
  ]
  return tags.join('\n    ')
}
