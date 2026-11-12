import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CONFIG, crmTexto, especialidadePrincipal } from './src/config'

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Gera title, metas, canonical, Open Graph e JSON-LD a partir de src/config.ts */
function headFromConfig(): Plugin {
  return {
    name: 'head-from-config',
    transformIndexHtml() {
      const url = CONFIG.siteUrl.replace(/\/$/, '')
      const esp = especialidadePrincipal()
      const title = `${CONFIG.nome} | ${esp.nome} em ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}`
      const description = `Consultório ${CONFIG.consultorio}: ${esp.nome.toLowerCase()} com avaliação individual e hora marcada, em ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}. Agendamento pelo WhatsApp.`
      const ogImage = `${url}/og-logo.jpg`
      const e = CONFIG.endereco
      const dias = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const identifier: object[] = []
      if (esp.rqe) identifier.push({ '@type': 'PropertyValue', propertyID: 'RQE', value: esp.rqe })
      if (crmTexto()) identifier.push({ '@type': 'PropertyValue', propertyID: `CRM-${CONFIG.crmUF}`, value: CONFIG.crm.trim() })
      const ld: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Physician',
        name: CONFIG.nomeCompleto.trim() || CONFIG.nome,
        alternateName: CONFIG.consultorio,
        medicalSpecialty: ['Gynecologic', 'Obstetric'],
        url: `${url}/`,
        image: ogImage,
        address: {
          '@type': 'PostalAddress',
          streetAddress: `${e.logradouro}, ${e.complemento}`,
          addressLocality: e.cidade,
          addressRegion: e.uf,
          postalCode: e.cep,
          addressCountry: 'BR',
        },
        openingHoursSpecification: CONFIG.horarios.map((h) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: h.dias.map((d) => dias[d]),
          opens: h.abre,
          closes: h.fecha,
        })),
      }
      if (identifier.length) ld.identifier = identifier
      if (CONFIG.usarWhatsapp && CONFIG.whatsapp) ld.telephone = `+${CONFIG.whatsapp}`
      if (CONFIG.telefone) ld.telephone = CONFIG.telefone
      if (CONFIG.instagram) ld.sameAs = [CONFIG.instagram]

      const tags: { tag: string; attrs?: Record<string, string>; children?: string; injectTo?: 'head' }[] = [
        { tag: 'title', children: esc(title) },
        { tag: 'meta', attrs: { name: 'description', content: description } },
        { tag: 'link', attrs: { rel: 'canonical', href: `${url}/` } },
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
        { tag: 'meta', attrs: { property: 'og:locale', content: 'pt_BR' } },
        { tag: 'meta', attrs: { property: 'og:site_name', content: CONFIG.consultorio } },
        { tag: 'meta', attrs: { property: 'og:title', content: title } },
        { tag: 'meta', attrs: { property: 'og:description', content: description } },
        { tag: 'meta', attrs: { property: 'og:url', content: `${url}/` } },
        { tag: 'meta', attrs: { property: 'og:image', content: ogImage } },
        { tag: 'meta', attrs: { property: 'og:image:alt', content: `Logo do ${CONFIG.consultorio}` } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary' } },
        { tag: 'script', attrs: { type: 'application/ld+json' }, children: JSON.stringify(ld) },
      ]
      if (!CONFIG.rascunho) tags.push({ tag: 'style', children: ':root{--faixa:0rem}' })
      if (CONFIG.rascunho) {
        tags.unshift(
          { tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' } },
          { tag: 'meta', attrs: { name: 'googlebot', content: 'noindex, nofollow' } },
        )
      }
      return tags.map((t) => ({ ...t, injectTo: 'head' as const }))
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), headFromConfig()],
  build: { target: 'es2020', cssCodeSplit: false },
})
