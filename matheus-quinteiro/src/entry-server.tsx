import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { CONFIG, enderecoLinha } from './config'

export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

export function head() {
  const e = CONFIG.endereco
  const dias = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${CONFIG.siteUrl}/#consultorio`,
    name: `${CONFIG.nome} · ${CONFIG.descritor}`,
    description: `${CONFIG.descritor} em ${CONFIG.cidade} - ${CONFIG.uf}, ${CONFIG.registro}. Consulta individual.`,
    url: `${CONFIG.siteUrl}/`,
    telephone: `+${CONFIG.whatsapp}`,
    ...(CONFIG.fotos.consultorio ? { image: `${CONFIG.siteUrl}/og.jpg` } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${e.rua}, ${e.complemento}`,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: 'BR',
    },
    hasMap: e.maps,
    openingHoursSpecification: CONFIG.horarios
      .filter((h) => h.abre && h.fecha)
      .map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: dias[h.dia], opens: h.abre, closes: h.fecha })),
    sameAs: [CONFIG.instagram.url].filter(Boolean),
    employee: { '@type': 'Person', name: CONFIG.nome, jobTitle: CONFIG.descritor },
  }
  return { jsonld: JSON.stringify(jsonld).replace(/</g, '\\u003c'), siteUrl: CONFIG.siteUrl, endereco: enderecoLinha(), og: !!CONFIG.fotos.consultorio, rascunho: CONFIG.rascunho }
}
