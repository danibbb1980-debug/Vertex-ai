// Gera public/privacidade.html e public/404.html na identidade do site.
import fs from 'node:fs';
const data = JSON.parse(fs.readFileSync('src/assets/logo-data.json', 'utf8'));
const [, , w, h] = data.viewBox.split(' ').map(Number);
const logo = `<svg viewBox="${data.viewBox}" width="${w}" height="${h}" fill="currentColor" role="img" aria-label="Bianca Bassoto, Nutricionista">${data.pear}<path d="${data.l1}"/><path d="${data.l2}"/></svg>`;

const css = `
@font-face{font-family:'Comfortaa';src:url('/fonts/comfortaa-300.woff2') format('woff2');font-weight:300;font-display:swap}
@font-face{font-family:'Hanken Grotesk';src:url('/fonts/hanken-400.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'Hanken Grotesk';src:url('/fonts/hanken-500.woff2') format('woff2');font-weight:500;font-display:swap}
:root{--paper:#f5f0e8;--paper-2:#ede6da;--ink:#17140f;--clay:#675e53;--rule:rgba(23,20,15,.16);--m1:#c2306a;--m2:#17998a;--m3:#e0a21b;--m4:#3f4fb8;--gutter:clamp(1rem,.5rem + 2.4vw,3rem)}
*{box-sizing:border-box;margin:0;padding:0}
html{background:var(--paper);color:var(--ink)}
body{font-family:'Hanken Grotesk',system-ui,sans-serif;font-size:clamp(1rem,.96rem + .2vw,1.0625rem);line-height:1.6;-webkit-font-smoothing:antialiased;padding-top:1.75rem}
::selection{background:var(--ink);color:var(--paper)}
:focus-visible{outline:2px solid var(--ink);outline-offset:3px}
.draft{position:fixed;inset:0 0 auto 0;height:1.75rem;display:flex;align-items:center;justify-content:center;background:var(--paper-2);color:var(--clay);border-bottom:1px solid var(--rule);font-size:.6875rem;letter-spacing:.08em;text-transform:uppercase;font-weight:500;white-space:nowrap;overflow:hidden}
.wrap{max-width:52rem;margin:0 auto;padding:clamp(2rem,6vw,4rem) var(--gutter) 6rem}
.logo{display:inline-flex;color:inherit;min-height:48px;align-items:center}
.logo svg{width:13rem;height:auto}
h1{font-family:'Comfortaa',sans-serif;font-weight:300;font-size:clamp(2.25rem,1.6rem + 3vw,4rem);line-height:1.06;letter-spacing:-.035em;margin:clamp(3rem,8vw,6rem) 0 2rem;text-wrap:balance}
h2{font-family:'Comfortaa',sans-serif;font-weight:300;font-size:clamp(1.375rem,1.2rem + .8vw,1.75rem);letter-spacing:-.02em;margin:2.5rem 0 .75rem}
p,li{max-width:34em;text-wrap:pretty}
p+p{margin-top:1rem}
ul{padding-left:1.25rem}
li+li{margin-top:.5rem}
.muted{color:var(--clay)}
a{color:inherit}
.marks{display:flex;gap:3px;margin-top:3rem}.marks i{display:block;width:3rem;height:3px;border-radius:2px}
.btn{display:inline-flex;align-items:center;min-height:48px;padding:0 1.5rem;border-radius:999px;background:var(--ink);color:var(--paper);text-decoration:none;font-weight:500;margin-top:2rem}
`;

const page = (title, desc, body) => `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<meta name="description" content="${desc}" />
<meta name="robots" content="noindex, nofollow" />
<meta name="googlebot" content="noindex, nofollow" />
<meta name="theme-color" content="#f5f0e8" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<style>${css.replace(/\n/g, '')}</style>
</head>
<body>
<div class="draft" role="note">Rascunho para avaliação. Informações sujeitas a confirmação.</div>
<main class="wrap">
<a class="logo" href="/" aria-label="Voltar ao início">${logo.replace('role="img" aria-label="Bianca Bassoto, Nutricionista"', 'aria-hidden="true"')}</a>
${body}
<div class="marks" aria-hidden="true"><i style="background:var(--m1)"></i><i style="background:var(--m2)"></i><i style="background:var(--m3)"></i><i style="background:var(--m4)"></i></div>
</main>
</body>
</html>
`;

fs.writeFileSync(
  'public/privacidade.html',
  page(
    'Privacidade | Bianca Bassoto, Nutricionista',
    'Como o site de Bianca Bassoto trata os dados digitados no formulário de agendamento.',
    `<h1>Privacidade</h1>
<p>Este site é informativo. Ele não tem cadastro, não usa cookies próprios, não usa ferramentas de análise de visitas e não guarda nenhum dado que você digita.</p>
<h2>O formulário de agendamento</h2>
<p>Quando você preenche o formulário e toca em “Enviar solicitação pelo WhatsApp”, o próprio navegador monta uma mensagem com o que você escreveu e abre uma conversa no WhatsApp com a Bianca Bassoto. Nada é enviado a um servidor deste site e nada fica salvo no seu navegador.</p>
<p>A mensagem só é enviada se você tocar em enviar dentro do WhatsApp. A partir daí, a conversa segue as regras de privacidade do próprio WhatsApp.</p>
<h2>O que não pedimos</h2>
<ul>
<li>Não pedimos telefone, e-mail, CPF nem fotos.</li>
<li>Não é preciso informar dados de saúde no formulário. Se quiser, isso é conversado com calma pelo WhatsApp ou na consulta.</li>
</ul>
<h2>Serviços de terceiros</h2>
<p>O mapa da página é fornecido pelo Google Maps e só carrega quando você chega até ele. Os botões de WhatsApp, Instagram e Google Maps levam a esses serviços, que têm as próprias políticas de privacidade.</p>
<h2>Dúvidas</h2>
<p>Para falar sobre seus dados, use o telefone ou o WhatsApp (35) 3722-4901.</p>
<p class="muted">Bianca Bassoto · Nutricionista · Poços de Caldas/MG</p>
<a class="btn" href="/">Voltar ao site</a>`,
  ),
);

fs.writeFileSync(
  'public/404.html',
  page(
    'Página não encontrada | Bianca Bassoto, Nutricionista',
    'Página não encontrada.',
    `<h1>Esta página não existe.</h1>
<p class="muted">O endereço pode ter mudado ou ter sido digitado com algum erro.</p>
<a class="btn" href="/">Ir para o início</a>`,
  ),
);
console.log('páginas estáticas ok');
