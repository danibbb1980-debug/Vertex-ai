import { CONFIG } from '../config'

const DIAS_SCHEMA = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const TITULO = `${CONFIG.nome} | Dentista em ${CONFIG.cidade} - ${CONFIG.uf}`
export const DESCRICAO = `Avaliação e acompanhamento odontológico com hora marcada no Centro de ${CONFIG.cidade} - ${CONFIG.uf}. Agende pelo WhatsApp.`
export const OG_IMAGEM = '/brand/og-odonto-prevent.png'

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

export function jsonLd() {
  const e = CONFIG.endereco
  const dados: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: CONFIG.nome,
    url: `${CONFIG.siteUrl}/`,
    image: `${CONFIG.siteUrl}${OG_IMAGEM}`,
    telephone: `+55 ${CONFIG.telefone}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: e.rua,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: 'BR',
    },
    openingHoursSpecification: CONFIG.horarios.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.dias.map((d) => DIAS_SCHEMA[d]),
      opens: h.abre,
      closes: h.fecha,
    })),
    paymentAccepted: CONFIG.pagamentos.join(', '),
    hasMap: CONFIG.mapsUrl,
    sameAs: [CONFIG.instagram],
  }
  const rt = CONFIG.responsavelTecnico
  if (rt.nome && rt.cro) {
    dados.employee = { '@type': 'Person', name: rt.nome, identifier: rt.cro, jobTitle: 'Responsável técnico' }
  }
  return JSON.stringify(dados).replace(/</g, '\\u003c')
}

/** Tags do <head> geradas a partir do config (injetadas no build pelo vite.config.ts). */
export function headTags(): string {
  const url = `${CONFIG.siteUrl}/`
  const tags = [
    `<title>${esc(TITULO)}</title>`,
    `<meta name="description" content="${esc(DESCRICAO)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:site_name" content="${esc(CONFIG.nome)}" />`,
    `<meta property="og:title" content="${esc(TITULO)}" />`,
    `<meta property="og:description" content="${esc(DESCRICAO)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${CONFIG.siteUrl}${OG_IMAGEM}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Logo da ${esc(CONFIG.nome)} sobre fundo grafite" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<script type="application/ld+json">${jsonLd()}</script>`,
  ]
  if (CONFIG.rascunho) {
    tags.unshift(
      `<meta name="robots" content="noindex, nofollow" />`,
      `<meta name="googlebot" content="noindex, nofollow" />`,
    )
  }
  return tags.join('\n    ')
}
