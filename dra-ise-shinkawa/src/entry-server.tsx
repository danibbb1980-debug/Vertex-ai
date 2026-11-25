import { renderToString } from 'react-dom/server';
import App from './App';
import { CONFIG, atendimentosAtivos } from './config';
export const render = () => renderToString(<App />);
export const jsonLd = () => {
  const dias = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const horas = Object.entries(CONFIG.horarios).filter(([, h]) => h).map(([d, h]) => ({
    '@type': 'OpeningHoursSpecification', dayOfWeek: dias[Number(d)], opens: h!.abre, closes: h!.fecha,
  }));
  return {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: CONFIG.nome,
    description: `${CONFIG.descritor}. ${CONFIG.registros}.`,
    url: CONFIG.siteUrl + '/',
    image: CONFIG.siteUrl + '/og.png',
    logo: CONFIG.siteUrl + '/logo.svg',
    telephone: '+55 19 99712-8622',
    address: { '@type': 'PostalAddress', streetAddress: CONFIG.endereco.rua, addressLocality: CONFIG.endereco.cidade, addressRegion: CONFIG.endereco.uf, postalCode: CONFIG.endereco.cep, addressCountry: 'BR' },
    hasMap: CONFIG.endereco.maps,
    openingHoursSpecification: horas,
    makesOffer: atendimentosAtivos().map((a) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: a.nome } })),
    sameAs: [CONFIG.instagram.url],
  };
};
export const siteUrl = CONFIG.siteUrl;
