import { renderToString } from 'react-dom/server'
import { App } from './App'
import { CONFIG, atendimentosAtivos } from './config'

export const render = () => renderToString(<App />)

const DIAS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/** JSON-LD: só dados reais e só atendimentos ativos. */
export const jsonLd = () => {
  const e = CONFIG.endereco
  const dados: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    name: CONFIG.nome,
    description: `${CONFIG.descritor} com avaliação personalizada em ${CONFIG.cidade} - ${e.uf}.`,
    url: CONFIG.siteUrl + '/',
    image: [CONFIG.siteUrl + CONFIG.logo.src, CONFIG.endereco.fachada?.src && CONFIG.siteUrl + CONFIG.endereco.fachada.src].filter(Boolean),
    logo: CONFIG.siteUrl + CONFIG.logoQuadrado,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${e.rua}, ${e.numero} - ${e.bairro}`,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: 'BR',
    },
    openingHoursSpecification: CONFIG.horarios
      .filter((h) => h.abre && h.fecha)
      .map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.dias.map((d) => DIAS[d]),
        opens: h.abre,
        closes: h.fecha,
      })),
    hasMap: e.mapsUrl,
    sameAs: [CONFIG.instagram.url].filter(Boolean),
    makesOffer: atendimentosAtivos().map((a) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: a.nome },
    })),
  }
  if (CONFIG.whatsapp) dados.telephone = `+${CONFIG.whatsapp}`
  return JSON.stringify(dados).replace(/</g, '\\u003c')
}
export { CONFIG }
