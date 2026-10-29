import type { Config } from '../config'
import { especificacaoHorarios } from './horarios'

/** JSON-LD tipo Dentist. Sem avaliações, sem especialidades. CRO/RT só se existirem. */
export function jsonLd(c: Config) {
  const nodes = c.unidades.map((u) => {
    const node: Record<string, unknown> = {
      '@type': 'Dentist',
      '@id': `${c.siteUrl}/#${u.id}`,
      name: `${c.nome} ${u.rotulo.replace('·', '-')}`,
      description: `${c.posicionamento}, com atendimento com hora marcada em ${c.cidade} - ${c.uf}.`,
      url: c.siteUrl,
      telephone: `+${u.whatsapp}`,
      image: `${c.siteUrl}${c.logo.src}`,
      logo: `${c.siteUrl}${c.logo.src}`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: u.endereco.logradouro,
        addressLocality: u.endereco.cidade,
        addressRegion: u.endereco.uf,
        postalCode: u.endereco.cep,
        addressCountry: 'BR',
      },
      areaServed: { '@type': 'City', name: c.cidade },
      hasMap: u.mapsUrl,
      sameAs: [c.instagram.url],
      openingHoursSpecification: especificacaoHorarios(u.horarios),
      paymentAccepted: c.estrutura.pagamentos.join(', '),
    }
    if (c.responsavelTecnico && c.cro) {
      node.employee = {
        '@type': 'Person',
        name: c.responsavelTecnico,
        jobTitle: 'Responsável técnico',
        identifier: c.cro,
      }
    }
    return node
  })
  return { '@context': 'https://schema.org', '@graph': nodes }
}
