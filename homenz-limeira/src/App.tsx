import { CONFIG, atendimentosAtivos } from './config'
import { SelecaoProvider } from './estado'
import { Agendar } from './components/Agendar'
import {
  Atendimentos, BarraAgendar, Clinica, ComoFunciona, Contato, CtaFinal, Duvidas, Header, Hero, Rodape,
} from './components/Secoes'

const DIAS_SCHEMA = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function jsonLd() {
  const e = CONFIG.endereco
  return {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    name: CONFIG.nome,
    description: 'Estética para homens em Limeira - SP: cabelo, rosto e corpo, com avaliação individual.',
    url: CONFIG.siteUrl,
    logo: `${CONFIG.siteUrl}/logo-192.png`,
    image: `${CONFIG.siteUrl}/icon-512.png`,
    telephone: '+55-19-99018-8717',
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${e.rua}, ${e.numero} - ${e.bairro}`,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: 'BR',
    },
    openingHoursSpecification: CONFIG.horarios.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${DIAS_SCHEMA[h.dia]}`,
      opens: h.abre,
      closes: h.fecha,
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Atendimentos',
      itemListElement: atendimentosAtivos().map((a) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: a.nome },
      })),
    },
    sameAs: [CONFIG.instagram.url],
  }
}

export function App() {
  const s = CONFIG.secoes
  return (
    <SelecaoProvider>
      <a className="pular" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        {s.atendimentos && <Atendimentos />}
        {s.clinica && <Clinica />}
        {s.comoFunciona && <ComoFunciona />}
        {s.duvidas && <Duvidas />}
        {s.contato && <Contato />}
        {s.agendar && CONFIG.usarWhatsapp && <Agendar />}
        {s.ctaFinal && <CtaFinal />}
      </main>
      <Rodape />
      <BarraAgendar />
    </SelecaoProvider>
  )
}
