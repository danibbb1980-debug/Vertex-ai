import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { CONFIG, DIAS } from './src/config';

const url = CONFIG.siteUrl.replace(/\/$/, '');

const schemaDias: Record<string, string> = {
  seg: 'Monday', ter: 'Tuesday', qua: 'Wednesday', qui: 'Thursday', sex: 'Friday', sab: 'Saturday', dom: 'Sunday',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Dentist',
  name: CONFIG.nome,
  url: url + '/',
  image: url + '/og.png',
  telephone: '+' + CONFIG.whatsapp,
  address: {
    '@type': 'PostalAddress',
    streetAddress: CONFIG.endereco.rua,
    addressLocality: CONFIG.endereco.cidade,
    addressRegion: CONFIG.endereco.uf,
    postalCode: CONFIG.endereco.cep,
    addressCountry: 'BR',
  },
  openingHoursSpecification: DIAS.flatMap((d) =>
    CONFIG.horarios[d.id].map(([opens, closes]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: schemaDias[d.id],
      opens,
      closes,
    })),
  ),
  sameAs: [CONFIG.instagram],
};

function html(): Plugin {
  return {
    name: 'html-config',
    transformIndexHtml(src, ctx) {
      const fontes = Object.keys(ctx.bundle ?? {}).filter((f) =>
        /(newsreader-latin-300-(normal|italic)|hanken-grotesk-latin-400-normal).*\.woff2$/.test(f),
      );
      const preload = fontes
        .map((f) => `<link rel="preload" href="/${f}" as="font" type="font/woff2" crossorigin />`)
        .join('\n    ');
      return src
        .replace('%PRELOAD%', preload)
        .replaceAll('%SITE_URL%', url)
        .replace('%ROBOTS%', CONFIG.rascunho ? '<meta name="robots" content="noindex, nofollow" />\n    <meta name="googlebot" content="noindex, nofollow" />' : '')
        .replace('%JSONLD%', JSON.stringify(jsonLd));
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), html()],
  build: { target: 'es2020', cssCodeSplit: false },
});
