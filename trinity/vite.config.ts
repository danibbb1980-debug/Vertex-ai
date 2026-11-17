import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CONFIG } from './src/config'

// injeta dados do config no index.html (canonical, og, JSON-LD)
const h = CONFIG.horarios
const dias = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const jsonld = {
  '@context': 'https://schema.org',
  '@type': 'BeautySalon',
  name: CONFIG.nome,
  description: 'Atendimentos de estética facial e corporal e cursos de estética em Varginha - MG.',
  url: CONFIG.siteUrl + '/',
  image: CONFIG.siteUrl + '/img/og.jpg',
  telephone: '+55 35 99818-4961',
  address: {
    '@type': 'PostalAddress',
    streetAddress: CONFIG.endereco.ruaSchema,
    addressLocality: CONFIG.endereco.cidade,
    addressRegion: CONFIG.endereco.uf,
    postalCode: CONFIG.endereco.cep,
    addressCountry: 'BR',
  },
  openingHoursSpecification: h
    .map((d, i) => (d.abre && d.fecha ? { '@type': 'OpeningHoursSpecification', dayOfWeek: dias[i], opens: d.abre, closes: d.fecha } : null))
    .filter(Boolean),
  sameAs: [CONFIG.instagram],
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'html-config',
      transformIndexHtml: (html) =>
        html
          .replaceAll('%SITE_URL%', CONFIG.siteUrl)
          .replace('%ROBOTS%', CONFIG.rascunho ? 'noindex, nofollow' : 'index, follow')
          .replace('%JSONLD%', JSON.stringify(jsonld)),
    },
  ],
  build: { cssCodeSplit: false },
})
