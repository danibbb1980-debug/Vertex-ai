/**
 * Gera <head>, JSON-LD e as páginas estáticas (privacidade e 404) a partir do CONFIG.
 * Usado pelo vite.config.ts no momento do build.
 */
import { CONFIG, enderecoCompleto } from './config'

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const DIAS_SCHEMA = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const TITLE = `${CONFIG.nome} | Dentista em ${CONFIG.cidade} - ${CONFIG.uf}`
export const DESCRIPTION = `Implantes dentários, estética e clínica geral com hora marcada em ${CONFIG.cidade} - ${CONFIG.uf}. Avaliação individual e explicações claras.`

const OG_IMAGE = '/img/og-nabak.png'
const OG_IMAGE_EXISTE = true

const robotsMeta = () =>
  CONFIG.rascunho
    ? `<meta name="robots" content="noindex, nofollow" />\n    <meta name="googlebot" content="noindex, nofollow" />`
    : `<meta name="robots" content="index, follow" />`

export function jsonLd() {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: CONFIG.nome,
    url: `${CONFIG.siteUrl}/`,
    telephone: `+${CONFIG.whatsapp}`,
    image: `${CONFIG.siteUrl}${OG_IMAGE}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONFIG.endereco.rua,
      addressLocality: CONFIG.endereco.cidade,
      addressRegion: CONFIG.endereco.uf,
      postalCode: CONFIG.endereco.cep,
      addressCountry: 'BR',
    },
    hasMap: CONFIG.mapsUrl,
    sameAs: [CONFIG.instagram].filter(Boolean),
    openingHoursSpecification: CONFIG.horarios.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: DIAS_SCHEMA[h.dia],
      opens: h.abre,
      closes: h.fecha,
    })),
    paymentAccepted: CONFIG.pagamentos.join(', '),
    amenityFeature: CONFIG.acessibilidade.map((a) => ({
      '@type': 'LocationFeatureSpecification',
      name: a,
      value: true,
    })),
  }
  const rt = CONFIG.responsavelTecnico
  if (rt.nome && rt.cro) {
    data.employee = { '@type': 'Person', name: rt.nome, identifier: rt.cro }
  }
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

const heroPreload = () => {
  const f = CONFIG.fotos[0]
  if (!f) return ''
  const set = [480, 800, 1100].map((w) => `${f.base}-${w}.webp ${w}w`).join(', ')
  return `<link rel="preload" as="image" type="image/webp" imagesrcset="${set}" imagesizes="(min-width: 1024px) 26rem, (min-width: 640px) 22rem, 72vw" fetchpriority="high" />`
}

export function headTags() {
  const url = `${CONFIG.siteUrl}/`
  return `<title>${esc(TITLE)}</title>
    <meta name="description" content="${esc(DESCRIPTION)}" />
    ${robotsMeta()}
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="${esc(CONFIG.nome)}" />
    <meta property="og:title" content="${esc(TITLE)}" />
    <meta property="og:description" content="${esc(DESCRIPTION)}" />
    <meta property="og:url" content="${url}" />
    ${OG_IMAGE_EXISTE ? `<meta property="og:image" content="${CONFIG.siteUrl}${OG_IMAGE}" />\n    <meta property="og:image:width" content="609" />\n    <meta property="og:image:height" content="609" />\n    <meta property="og:image:alt" content="Logotipo da ${esc(CONFIG.nome)}" />` : ''}
    <meta name="twitter:card" content="summary" />
    ${heroPreload()}
    <script type="application/ld+json">${jsonLd()}</script>`
}

export const noscriptHtml = () =>
  `<p style="padding:2rem;font-family:sans-serif">${esc(CONFIG.nome)} · ${esc(enderecoCompleto())} · WhatsApp ${esc(CONFIG.telefoneExibicao)}</p>`

/* ---------- páginas estáticas ---------- */

const baseCss = `
:root{--paper:#FBF8F3;--cream:#F3EDE4;--taupe:#C8BBAD;--copper:#C49A6C;--copper-ink:#865A38;--espresso:#2B211C;--ink:#4A3F39}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--paper);color:var(--ink);font:400 1.0625rem/1.7 "Manrope",system-ui,-apple-system,"Segoe UI",sans-serif}
.draft{position:sticky;top:0;background:var(--espresso);color:#F3EDE4;font-size:.8125rem;text-align:center;padding:.5rem 1rem;letter-spacing:.02em}
main{max-width:42rem;margin:0 auto;padding:4rem 1.25rem 5rem}
.logo{display:inline-block;border-radius:999px;overflow:hidden;line-height:0;margin-bottom:2.5rem}
.logo img{width:96px;height:auto;display:block}
.eyebrow{font-size:.75rem;letter-spacing:.28em;text-transform:uppercase;color:var(--copper-ink);margin:0 0 1rem}
h1{font-family:Georgia,"Cormorant Garamond",serif;font-weight:400;color:var(--espresso);font-size:clamp(2.2rem,6vw,3.2rem);line-height:1.1;margin:0 0 1.5rem}
h1 em{color:var(--copper-ink)}
h2{font-family:Georgia,serif;font-weight:400;color:var(--espresso);font-size:1.5rem;margin:2.5rem 0 .75rem}
hr{border:0;height:1px;background:linear-gradient(90deg,var(--copper),transparent);margin:2rem 0}
a{color:var(--copper-ink);text-underline-offset:3px}
a:focus-visible{outline:2px solid var(--copper-ink);outline-offset:3px;border-radius:4px}
.btn{display:inline-flex;align-items:center;min-height:48px;padding:0 1.5rem;border-radius:999px;background:var(--espresso);color:#FBF8F3;text-decoration:none;font-weight:600;font-size:.95rem;margin-top:1rem}
small{display:block;color:#6B5E55;margin-top:3rem;font-size:.85rem}
`

const shell = (title: string, body: string) => `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(title)}</title>
    ${robotsMeta()}
    <meta name="theme-color" content="#FBF8F3" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <style>${baseCss}</style>
  </head>
  <body>
    ${CONFIG.rascunho ? '<div class="draft" role="note">Rascunho para avaliação. Informações sujeitas a confirmação.</div>' : ''}
    <main>
      <a class="logo" href="/" aria-label="${esc(CONFIG.nome)}, página inicial"><img src="/img/logo-nabak@3x.png" alt="${esc(CONFIG.nome)}" width="96" height="87" /></a>
      ${body}
    </main>
  </body>
</html>`

export function paginaPrivacidade() {
  return shell(
    `Privacidade | ${CONFIG.nome}`,
    `<p class="eyebrow">Privacidade</p>
      <h1>Seus dados, <em>em poucas palavras</em>.</h1>
      <p>Este site é informativo. Ele não tem cadastro, não usa cookies, não usa ferramentas de análise de audiência e não guarda nenhum dado que você digita.</p>
      <h2>Solicitação de agendamento</h2>
      <p>O formulário “Solicitar agendamento” apenas monta uma mensagem de texto no seu próprio aparelho e abre uma conversa no WhatsApp com a clínica. Nada é enviado a servidores deste site nem armazenado no navegador. A mensagem só chega à clínica se você decidir enviá-la no WhatsApp.</p>
      <p>A partir daí, a conversa passa a ser regida pela política de privacidade do WhatsApp e pelo atendimento da ${esc(CONFIG.nome)}.</p>
      <h2>Dados de saúde</h2>
      <p>Não é preciso informar dados de saúde no formulário. As informações clínicas são tratadas com calma, diretamente com a equipe.</p>
      <h2>Mapa</h2>
      <p>O mapa do Google só é carregado se você tocar em “Ver mapa aqui”. Ao carregá-lo, o Google pode aplicar a própria política de privacidade e de cookies.</p>
      <h2>Contato</h2>
      <p>${esc(CONFIG.nome)} · ${esc(enderecoCompleto())}<br />WhatsApp: ${esc(CONFIG.telefoneExibicao)}</p>
      <hr />
      <a class="btn" href="/">Voltar ao site</a>`,
  )
}

export function pagina404() {
  return shell(
    `Página não encontrada | ${CONFIG.nome}`,
    `<p class="eyebrow">Erro 404</p>
      <h1>Esta página <em>não existe</em>.</h1>
      <p>O endereço pode ter mudado ou ter sido digitado de outra forma.</p>
      <a class="btn" href="/">Ir para a página inicial</a>`,
  )
}
