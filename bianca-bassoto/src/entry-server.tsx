import { renderToString } from 'react-dom/server';
import { App } from './App';
import { CONFIG, atendimentosAtivos, temCrn } from './config';
import { faqs } from './sections/Duvidas';

export const render = () => renderToString(<App />);
export { logoDefsHtml } from './components/logoDefs';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export function head() {
  const url = CONFIG.siteUrl.replace(/\/$/, '') + '/';
  const title = `${CONFIG.nome} | ${CONFIG.descritor} em ${CONFIG.cidade} - ${CONFIG.uf}`;
  const at = atendimentosAtivos().map((a) => a.nome.toLowerCase());
  const desc = `${CONFIG.nome}, ${CONFIG.descritor.toLowerCase()} em ${CONFIG.cidade} - ${CONFIG.uf}${
    temCrn() ? ` (${CONFIG.crn})` : ''
  }. Consulta individual${at.length ? `: ${at.join(' e ')}` : ''}. Agendamento pelo WhatsApp.`;
  const robots = CONFIG.rascunho ? 'noindex, nofollow' : 'index, follow';
  const e = CONFIG.endereco;
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `${CONFIG.nome} | ${CONFIG.descritor}`,
    description: desc,
    url,
    telephone: `+${CONFIG.telefone}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: e.ruaSchema,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: 'BR',
    },
    openingHoursSpecification: CONFIG.horarios
      .filter((h) => h.abre && h.fecha)
      .map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: dayNames[h.dia], opens: h.abre, closes: h.fecha })),
    sameAs: [CONFIG.instagram.url],
  };
  if (temCrn()) ld.identifier = CONFIG.crn;
  // og:image precisa de foto com fundo (o recorte do hero é transparente)
  const fotoOg = CONFIG.foto || CONFIG.fotoConsulta;
  const fotoOgAlt = CONFIG.foto ? CONFIG.fotoAlt : CONFIG.fotoConsultaAlt;
  if (fotoOg) ld.image = url + fotoOg.replace(/^\//, '') + '.jpg';
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs().map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const og = fotoOg
    ? `<meta property="og:image" content="${esc(url + fotoOg.replace(/^\//, '') + '.jpg')}" />
    <meta property="og:image:width" content="1080" />
    <meta property="og:image:height" content="1350" />
    <meta property="og:image:alt" content="${esc(fotoOgAlt)}" />`
    : '';
  return `
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(desc)}" />
    <meta name="robots" content="${robots}" />
    <meta name="googlebot" content="${robots}" />
    <link rel="canonical" href="${esc(url)}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(desc)}" />
    <meta property="og:url" content="${esc(url)}" />
    <meta property="og:site_name" content="${esc(CONFIG.nome)}" />
    ${og}
    <meta name="twitter:card" content="summary" />
    <script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
    <script type="application/ld+json">${JSON.stringify(faqLd).replace(/</g, '\\u003c')}</script>`;
}
