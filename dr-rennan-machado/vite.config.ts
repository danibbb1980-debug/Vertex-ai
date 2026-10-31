import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { CONFIG } from './src/config';
import { diasAbertosSchema } from './src/lib/horarios';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Monta o <head> (SEO, Open Graph, JSON-LD, noindex) a partir de src/config.ts. */
function headFromConfig(): Plugin {
  return {
    name: 'head-from-config',
    transformIndexHtml(html) {
      const url = CONFIG.siteUrl.replace(/\/$/, '');
      if (/localhost|127\.0\.0\.1/.test(url)) throw new Error('CONFIG.siteUrl não pode ser localhost');
      const title = `${CONFIG.nome} | Dentista em ${CONFIG.cidade} - ${CONFIG.uf}`;
      const desc = `Cirurgião-dentista em ${CONFIG.cidade} - ${CONFIG.uf}: clínico geral, endodontia, ortodontia e implantodontia, com hora marcada. ${CONFIG.cro}.`;
      const ogImage = CONFIG.foto ? `${url}/img/og-image.jpg` : '';
      const e = CONFIG.endereco;
      const especialidades =
        CONFIG.mostrarEspecialidades && CONFIG.especialidades.some((s) => s.registro)
          ? { medicalSpecialty: CONFIG.especialidades.filter((s) => s.registro).map((s) => s.nome) }
          : {};
      const ld = {
        '@context': 'https://schema.org',
        '@type': 'Dentist',
        name: CONFIG.nome,
        description: `${CONFIG.titulo} · ${CONFIG.cro}`,
        identifier: CONFIG.cro,
        url: `${url}/`,
        telephone: `+${CONFIG.whatsapp}`,
        ...(ogImage ? { image: ogImage } : {}),
        address: {
          '@type': 'PostalAddress',
          streetAddress: e.rua,
          addressLocality: e.cidade,
          addressRegion: e.uf,
          postalCode: e.cep,
          addressCountry: 'BR',
        },
        hasMap: CONFIG.maps,
        sameAs: [CONFIG.instagram],
        openingHoursSpecification: diasAbertosSchema(),
        paymentAccepted: CONFIG.estrutura.pagamentos.join(', '),
        ...especialidades,
      };
      const tags = [
        `<title>${esc(title)}</title>`,
        `<meta name="description" content="${esc(desc)}" />`,
        CONFIG.rascunho ? `<meta name="robots" content="noindex, nofollow" />` : '',
        CONFIG.rascunho ? `<meta name="googlebot" content="noindex, nofollow" />` : '',
        `<link rel="canonical" href="${url}/" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:locale" content="pt_BR" />`,
        `<meta property="og:title" content="${esc(title)}" />`,
        `<meta property="og:description" content="${esc(desc)}" />`,
        `<meta property="og:url" content="${url}/" />`,
        ogImage ? `<meta property="og:image" content="${ogImage}" />` : '',
        ogImage ? `<meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" />` : '',
        `<meta name="twitter:card" content="${ogImage ? 'summary_large_image' : 'summary'}" />`,
        `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`,
      ].filter(Boolean);
      const h = CONFIG.rascunho ? html.replace('<html lang="pt-BR">', '<html lang="pt-BR" class="has-banner">') : html;
      return h.replace('<!--HEAD-->', tags.join('\n    '));
    },
  };
}

export default defineConfig({
  plugins: [react(), headFromConfig()],
  build: { target: 'es2020', cssCodeSplit: false },
});
