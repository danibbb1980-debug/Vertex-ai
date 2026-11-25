import { renderToString } from 'react-dom/server'
import App from './App'
import { CONFIG } from './config'
import { ORDEM_SEMANA, faixasDoDia } from './lib/horarios'
import { perguntas } from './components/secoes'

export const render = () => renderToString(<App />)

const DIA_SCHEMA = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const jsonLd = () =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'HealthAndBeautyBusiness',
        '@id': `${CONFIG.siteUrl}/#negocio`,
        name: CONFIG.nome,
        description: `${CONFIG.descritor} em ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}.`,
        url: `${CONFIG.siteUrl}/`,
        image: `${CONFIG.siteUrl}/og-logo.jpg`,
        logo: `${CONFIG.siteUrl}/og-logo.jpg`,
        telephone: `+${CONFIG.whatsapp}`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: `${CONFIG.endereco.rua}, ${CONFIG.endereco.numero} - ${CONFIG.endereco.bairro}`,
          addressLocality: CONFIG.endereco.cidade,
          addressRegion: CONFIG.endereco.uf,
          postalCode: CONFIG.endereco.cep,
          addressCountry: 'BR',
        },
        openingHoursSpecification: ORDEM_SEMANA.flatMap((d) =>
          faixasDoDia(d).map((f) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: `https://schema.org/${DIA_SCHEMA[d]}`,
            opens: f.inicio,
            closes: f.fim,
          })),
        ),
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Atendimentos',
          itemListElement: CONFIG.atendimentos
            .filter((a) => a.ativo)
            .map((a) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: a.nome } })),
        },
        sameAs: [CONFIG.instagram.url],
      },
      {
        '@type': 'FAQPage',
        mainEntity: perguntas().map((q) => ({
          '@type': 'Question',
          name: q.p,
          acceptedAnswer: { '@type': 'Answer', text: q.r },
        })),
      },
    ],
  }).replace(/</g, '\\u003c')
