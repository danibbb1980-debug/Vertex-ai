import { CONFIG, enderecoCompleto } from './config'

const base = (title: string, robots: string, body: string) => `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<meta name="robots" content="${robots}" />
<meta name="googlebot" content="${robots}" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;1,500&family=Manrope:wght@400;500;600&display=swap" />
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #f5f0e6; color: #1b1d22; font: 400 1rem/1.7 Manrope, system-ui, sans-serif; }
  main { max-width: 42rem; margin: 0 auto; padding: 4.5rem 1.25rem 5rem; }
  .label { font-size: .72rem; letter-spacing: .22em; text-transform: uppercase; color: #6f5230; font-weight: 600; }
  h1 { font: 500 clamp(2.2rem, 6vw, 3.2rem)/1.1 'Cormorant Garamond', Georgia, serif; margin: .6rem 0 1.5rem; }
  h1 em { font-style: italic; color: #6f5230; }
  h2 { font: 600 1.35rem/1.3 'Cormorant Garamond', Georgia, serif; margin: 2.2rem 0 .4rem; }
  p, li { color: #4d4840; }
  hr { border: 0; border-top: 1px solid #d6cbb6; margin: 2.5rem 0; }
  a { color: #1b1d22; text-underline-offset: 3px; }
  a:focus-visible { outline: 2px solid #6f5230; outline-offset: 3px; }
  .small { font-size: .85rem; }
</style>
</head>
<body>
<main>
${body}
<hr />
<p class="small">${CONFIG.nome} · ${CONFIG.profissao} · ${CONFIG.oab}<br />${enderecoCompleto}</p>
<p><a href="/">Voltar ao início</a></p>
</main>
</body>
</html>`

export const paginaPrivacidade = (robots: string) =>
  base(
    `Privacidade | ${CONFIG.nome}`,
    robots,
    `<p class="label">Privacidade</p>
<h1>Política de <em>privacidade</em></h1>
<p>Este site tem caráter exclusivamente informativo. Ele não possui formulários, não cria contas de usuário e não utiliza ferramentas de análise de audiência, pixels de publicidade ou cookies de rastreamento.</p>
<h2>Dados que você nos envia</h2>
<p>O contato é feito pelo WhatsApp, por iniciativa do próprio visitante. As mensagens trocadas por esse canal estão sujeitas às políticas do aplicativo e são tratadas com sigilo profissional, nos termos do Estatuto da Advocacia.</p>
<h2>Serviços de terceiros</h2>
<p>A página inicial exibe um mapa do Google Maps e carrega fontes do Google Fonts. Esses serviços podem registrar dados técnicos de acesso, como o endereço IP, conforme as políticas do Google.</p>
<h2>Seus direitos</h2>
<p>Nos termos da Lei Geral de Proteção de Dados (Lei 13.709/2018), você pode solicitar informações, correção ou exclusão de dados pessoais pelo WhatsApp ${CONFIG.whatsappExibicao}.</p>`,
  )

export const pagina404 = (robots: string) =>
  base(
    `Página não encontrada | ${CONFIG.nome}`,
    robots,
    `<p class="label">Erro 404</p>
<h1>Página <em>não encontrada</em></h1>
<p>O endereço acessado não existe ou foi alterado.</p>`,
  )
